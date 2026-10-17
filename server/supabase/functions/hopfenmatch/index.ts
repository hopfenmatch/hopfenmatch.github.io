// HopfenMatch – Backend (Supabase Edge Function "hopfenmatch"), v1.6 mit Konten & Freunden
// Routen: POST /register, POST /login, POST /logout, POST /account, POST /friend, POST /sync, GET /avatar/:id, GET /health
// Eigene Tabellen hm_item / hm_session / hm_meta / hm_user / hm_friend / hm_fail (siehe ../../../schema.sql). Galaxy Empire bleibt unberührt.
// Daten-Epoche (hm_meta 'epoch') unverändert: Schreiben nur mit passender Epoche.
// Sichtbarkeit (serverseitig): Bewertungen/Check-ins/Aktivitäten nur für einen selbst und bestätigte Freunde,
// Tastings und Tasting-Punkte nur für Teilnehmer, Mitteilungen nur für den Empfänger, Likes/Favoriten nur für den Besitzer.
// Fremde sehen nur Name und Profilbild (Suche).
import { createClient } from "npm:@supabase/supabase-js@2.118.0";

const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });
const KINDS = ["rating", "checkin", "tasting", "tscore", "cbeer", "event", "notif", "like", "fav"];
const MAX_ITEMS = 500, MAX_BODY = 768 * 1024, ITER = 100000;
const NAME_RE = /^[\p{L}\p{N}](?:[\p{L}\p{N} ._'-]{0,22}[\p{L}\p{N}])?$/u;

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, content-type, x-client-info, apikey",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Max-Age": "86400",
};
const json = (o: unknown, status = 200) => new Response(JSON.stringify(o), { status, headers: { ...CORS, "content-type": "application/json; charset=utf-8", "cache-control": "no-store" } });
// Erwartbare Fehler mit HTTP 200 + code, damit Browser keine Konsolenfehler werfen
const err = (error: string, code: number, extra: Record<string, unknown> = {}) => json({ error, code, ...extra });
const must = <T>(r: { data: T; error: unknown }) => { if (r.error) throw r.error; return r.data; };
const hex = (b: ArrayBuffer | Uint8Array) => [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, "0")).join("");
const unhex = (s: string) => new Uint8Array(s.match(/../g)!.map((h) => parseInt(h, 16)));
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function pbkdf2(pass: string, salt: string, iter: number) {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(pass), "PBKDF2", false, ["deriveBits"]);
  return hex(await crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt: unhex(salt), iterations: iter }, key, 256));
}
function same(a: string, b: string) { if (a.length !== b.length) return false; let d = 0; for (let i = 0; i < a.length; i++) d |= a.charCodeAt(i) ^ b.charCodeAt(i); return d === 0; }
async function hashNew(pass: string) { const salt = hex(crypto.getRandomValues(new Uint8Array(16))); return { salt, iter: ITER, pass_hash: await pbkdf2(pass, salt, ITER), ci: false }; }
async function verify(u: any, pass: string) { const p = u.ci ? String(pass).trim().toUpperCase() : String(pass); return same(await pbkdf2(p, u.salt, u.iter), u.pass_hash); }
const normName = (s: unknown) => String(s ?? "").normalize("NFC").replace(/\s+/g, " ").trim();
function nameProblem(n: string) {
  if (n.length < 2) return "Der Name braucht mindestens 2 Zeichen.";
  if (n.length > 24) return "Der Name darf höchstens 24 Zeichen haben.";
  if (!NAME_RE.test(n)) return "Erlaubt sind Buchstaben, Ziffern, Leerzeichen sowie . _ - '";
  return null;
}
function passProblem(p: unknown) {
  if (typeof p !== "string" || p.length < 4) return "Das Passwort braucht mindestens 4 Zeichen.";
  if (p.length > 72) return "Das Passwort ist zu lang (max. 72 Zeichen).";
  return null;
}
function avatarData(a: unknown): string | null | undefined {
  if (a === null) return null;
  if (typeof a !== "string") return undefined;
  const m = a.match(/^data:image\/(jpeg|png|webp);base64,([A-Za-z0-9+/=]+)$/);
  if (!m || m[2].length > 300 * 1024) return undefined;
  return a;
}

// ---- Rate-Limit (persistent in hm_fail, gilt für alle Function-Instanzen) ----
const WIN = 10 * 60e3;
async function limited(keys: string[], max: number) {
  const rows = must(await db.from("hm_fail").select("k,n,t").in("k", keys)) as any[];
  return rows.some((r) => r.n >= max && Date.now() - Date.parse(r.t) < WIN);
}
async function bump(keys: string[]) {
  const rows = must(await db.from("hm_fail").select("k,n,t").in("k", keys)) as any[];
  const now = new Date().toISOString();
  const up = keys.map((k) => { const r = rows.find((x) => x.k === k); const n = r && Date.now() - Date.parse(r.t) < WIN ? r.n + 1 : 1; return { k, n, t: now }; });
  must(await db.from("hm_fail").upsert(up));
}
const ipOf = (req: Request) => (req.headers.get("x-forwarded-for")?.split(",")[0] || "?").trim();

async function newSession(id: string) {
  const token = hex(crypto.getRandomValues(new Uint8Array(32)));
  must(await db.from("hm_session").insert({ token, usr: id }));
  return token;
}
async function auth(req: Request): Promise<{ id: string; token: string } | null> {
  const h = req.headers.get("authorization") || "";
  const t = h.startsWith("Bearer ") ? h.slice(7).trim() : "";
  if (!t || t.length < 20) return null;
  const r = must(await db.from("hm_session").select("usr,seen_at").eq("token", t).maybeSingle()) as { usr: string; seen_at: string } | null;
  if (!r) return null;
  if (Date.now() - Date.parse(r.seen_at) > 6 * 3600e3) await db.from("hm_session").update({ seen_at: new Date().toISOString() }).eq("token", t);
  return { id: r.usr, token: t };
}
async function getEpoch(): Promise<number> {
  const r = must(await db.from("hm_meta").select("v").eq("k", "epoch").maybeSingle()) as { v: { n: number } } | null;
  return Number(r?.v?.n) || 1;
}
const pub = (u: any) => ({ id: u.id, name: u.name, av: u.av || 0 });
const pair = (x: string, y: string) => (x < y ? { a: x, b: y } : { a: y, b: x });
async function userById(id: string) { return must(await db.from("hm_user").select("*").eq("id", id).maybeSingle()) as any; }

// ---- Freundes-/Tasting-Kontext eines Nutzers ----
async function context(me: string) {
  const fr = must(await db.from("hm_friend").select("a,b,status,req,created_at").or(`a.eq.${me},b.eq.${me}`)) as any[];
  const friends: string[] = [], incoming: any[] = [], outgoing: any[] = [];
  for (const r of fr) {
    const o = r.a === me ? r.b : r.a;
    if (r.status === "accepted") friends.push(o);
    else if (r.req === me) outgoing.push({ id: o, ts: Date.parse(r.created_at) });
    else incoming.push({ id: o, ts: Date.parse(r.created_at) });
  }
  const ts = must(await db.from("hm_item").select("id,data").eq("kind", "tasting").eq("del", false)) as any[];
  const tids: string[] = [], tparts = new Set<string>();
  for (const t of ts) {
    const d = t.data || {}, p: string[] = Array.isArray(d.participants) ? d.participants : [];
    if (d.host === me || p.includes(me)) { tids.push(t.id); p.forEach((x) => tparts.add(x)); if (d.host) tparts.add(d.host); }
  }
  const F = new Set([me, ...friends]);
  const fv = hex(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(friends.slice().sort().join(",") + "|" + tids.slice().sort().join(",")))).slice(0, 16);
  return { friends, incoming, outgoing, F, T: new Set(tids), tparts, fv };
}
async function directory(me: string, c: Awaited<ReturnType<typeof context>>) {
  const ids = new Set<string>([me, ...c.friends, ...c.incoming.map((x) => x.id), ...c.outgoing.map((x) => x.id), ...c.tparts]);
  const us = must(await db.from("hm_user").select("id,name,av").in("id", [...ids])) as any[];
  const users: Record<string, any> = {};
  us.forEach((u) => (users[u.id] = pub(u)));
  return { me, users, friends: c.friends, incoming: c.incoming, outgoing: c.outgoing, fv: c.fv };
}

function visible(it: any, me: string, F: Set<string>, T: Set<string>) {
  const d = it.data || {};
  switch (it.kind) {
    case "rating": return F.has(it.id.split(":")[0]);
    case "like": case "fav": return it.id.split("|")[0] === me;
    case "tscore": return T.has(it.id.split("|")[0]);
    case "tasting": return it.del || T.has(it.id);
    case "checkin": return it.del || F.has(d.user);
    case "event": return it.del || F.has(d.user) || (d.tid && T.has(d.tid));
    case "notif": return it.del || d.to === me;
    case "cbeer": return true;
  }
  return false;
}
async function pull(since: number, me: string, F: Set<string>, T: Set<string>) {
  const rev = Number(must(await db.rpc("hm_rev")));
  const items: any[] = [];
  let from = since;
  for (;;) {
    const page = must(await db.from("hm_item").select("kind,id,data,del,rev").gt("rev", from).lte("rev", rev).order("rev").limit(1000)) as any[];
    for (const it of page) if (visible(it, me, F, T)) items.push(it);
    if (page.length < 1000) break;
    from = page[page.length - 1].rev;
  }
  return { rev, items };
}

// Schreibrechte
function allowed(me: string, it: any, F: Set<string>, E: Map<string, any>): string | null {
  if (!it || typeof it !== "object") return "Ungültiger Eintrag";
  const { kind, id } = it;
  if (!KINDS.includes(kind)) return "Unbekannte Art " + kind;
  if (typeof id !== "string" || !id || id.length > 200) return "Ungültige ID";
  if (!it.del && (it.data === undefined || it.data === null || typeof it.data !== "object")) return "Daten fehlen";
  if (JSON.stringify(it.data || {}).length > 32 * 1024) return "Eintrag zu groß";
  const d = it.data || {}, ex = E.get(kind + "/" + id);
  const owner = kind === "rating" ? id.split(":")[0] : kind === "like" || kind === "fav" ? id.split("|")[0] : kind === "tscore" ? id.split("|")[2] : kind === "checkin" ? (it.del ? ex?.user : d.user) : null;
  if (owner !== null && owner !== undefined && owner !== me) return "Fremde Daten (" + kind + ")";
  if (kind === "checkin" && it.del && ex && ex.user !== me) return "Fremde Daten (checkin)";
  if (kind === "rating" && !it.del && (d.user !== me || typeof d.score !== "number" || d.score < 0 || d.score > 100)) return "Ungültige Bewertung";
  if (kind === "tscore" && !it.del && (typeof d.v !== "number" || d.v < 0 || d.v > 100)) return "Ungültige Punkte";
  if (kind === "tasting") {
    const inT = (t: any) => t && (t.host === me || (Array.isArray(t.participants) && t.participants.includes(me)));
    if (ex && !inT(ex)) return "Nicht eingeladen";
    if (!it.del) {
      if (!inT(d)) return "Nicht eingeladen";
      const old = new Set<string>(ex && Array.isArray(ex.participants) ? ex.participants : []);
      if (!Array.isArray(d.participants) || d.participants.some((p: string) => !F.has(p) && !old.has(p))) return "Nur Freunde einladen";
    }
  }
  if (kind === "notif") {
    if (it.del) { if (ex && ex.to !== me && ex.from !== me) return "Fremde Mitteilung"; }
    else if (!(d.to === me || (d.from === me && F.has(d.to)))) return "Mitteilung nur an Freunde";
  }
  if (kind === "event" && !it.del && d.user !== me) return "Fremde Daten (event)";
  if (kind === "cbeer" && ex && ex.by && ex.by !== me) return "Fremdes Bier";
  if (kind === "cbeer" && !it.del && d.by && d.by !== me) return "Fremdes Bier";
  return null;
}
async function existing(items: any[]) {
  const E = new Map<string, any>();
  for (const kind of ["tasting", "notif", "cbeer", "checkin"]) {
    const ids = items.filter((x) => x?.kind === kind && typeof x.id === "string").map((x) => x.id);
    for (let i = 0; i < ids.length; i += 150) {
      const rows = must(await db.from("hm_item").select("id,data").eq("kind", kind).eq("del", false).in("id", ids.slice(i, i + 150))) as any[];
      rows.forEach((r) => E.set(kind + "/" + r.id, r.data));
    }
  }
  return E;
}
async function notifyServer(from: string, to: string, kind: string, text: string, link: string) {
  const id = "s" + hex(crypto.getRandomValues(new Uint8Array(8)));
  must(await db.rpc("hm_put", { p_items: [{ kind: "notif", id, data: { id, to, from, ts: Date.now(), kind, text, link, read: false } }], p_user: from }));
}

// Konto löschen: eigene Einträge als gelöscht markieren (Geräte entfernen sie beim Sync), Freundschaften/Sitzungen/Konto entfernen
async function deleteAccount(me: string) {
  const dels: any[] = [];
  const add = (rows: any[], kind?: string) => rows.forEach((r) => dels.push({ kind: kind || r.kind, id: r.id, del: true }));
  add(must(await db.from("hm_item").select("kind,id").eq("del", false).like("id", `${me}:%`).eq("kind", "rating")) as any[]);
  add(must(await db.from("hm_item").select("kind,id").eq("del", false).in("kind", ["like", "fav"]).like("id", `${me}|%`)) as any[]);
  add(must(await db.from("hm_item").select("kind,id").eq("del", false).eq("kind", "tscore").like("id", `%|${me}`)) as any[]);
  add(must(await db.from("hm_item").select("kind,id").eq("del", false).in("kind", ["checkin", "event"]).eq("data->>user", me)) as any[]);
  add(must(await db.from("hm_item").select("kind,id").eq("del", false).eq("kind", "notif").or(`data->>to.eq.${me},data->>from.eq.${me}`)) as any[]);
  const hosted = must(await db.from("hm_item").select("kind,id").eq("del", false).eq("kind", "tasting").eq("data->>host", me)) as any[];
  add(hosted);
  for (const t of hosted) add(must(await db.from("hm_item").select("kind,id").eq("del", false).eq("kind", "tscore").like("id", `${t.id}|%`)) as any[]);
  const seen = new Set<string>(), uniq = dels.filter((x) => { const k = x.kind + "/" + x.id; if (seen.has(k)) return false; seen.add(k); return true; });
  for (let i = 0; i < uniq.length; i += 300) must(await db.rpc("hm_put", { p_items: uniq.slice(i, i + 300), p_user: me }));
  must(await db.from("hm_friend").delete().or(`a.eq.${me},b.eq.${me}`));
  must(await db.from("hm_session").delete().eq("usr", me));
  must(await db.from("hm_user").delete().eq("id", me));
  return uniq.length;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: CORS });
  const url = new URL(req.url);
  const path = url.pathname.replace(/^.*\/hopfenmatch/, "") || "/";
  try {
    if (path === "/health") return json({ ok: true, app: "hopfenmatch", v: 16, t: Date.now() });

    // Profilbilder sind öffentlich (wie der Name) – versionierte URL, lange cachebar
    const am = path.match(/^\/avatar\/([a-z0-9]{1,40})$/);
    if (am && req.method === "GET") {
      const u = must(await db.from("hm_user").select("avatar").eq("id", am[1]).maybeSingle()) as any;
      const m = u?.avatar?.match(/^data:(image\/\w+);base64,(.+)$/);
      if (!m) return new Response("", { status: 404, headers: CORS });
      const bin = Uint8Array.from(atob(m[2]), (c) => c.charCodeAt(0));
      return new Response(bin, { headers: { ...CORS, "content-type": m[1], "cache-control": "public, max-age=31536000, immutable" } });
    }

    if (path === "/register" && req.method === "POST") {
      const ip = ipOf(req);
      if (await limited(["reg:" + ip], 20)) return err("Zu viele Registrierungen von diesem Netz – bitte später nochmal.", 429);
      const b = await req.json().catch(() => ({}));
      const name = normName(b.name), np = nameProblem(name), pp = passProblem(b.pass);
      if (np) return err(np, 400, { field: "name" });
      if (pp) return err(pp, 400, { field: "pass" });
      const avatar = b.avatar === undefined ? null : avatarData(b.avatar);
      if (avatar === undefined) return err("Das Bild konnte nicht verarbeitet werden.", 400, { field: "avatar" });
      const taken = must(await db.from("hm_user").select("id").eq("name_lc", name.toLowerCase()).maybeSingle());
      if (taken) return err("Der Name ist schon vergeben.", 409, { field: "name" });
      const id = "u" + hex(crypto.getRandomValues(new Uint8Array(6)));
      const h = await hashNew(b.pass);
      const ins = await db.from("hm_user").insert({ id, name, name_lc: name.toLowerCase(), ...h, avatar, av: avatar ? 1 : 0 });
      if (ins.error) { if (String((ins.error as any).code) === "23505") return err("Der Name ist schon vergeben.", 409, { field: "name" }); throw ins.error; }
      await bump(["reg:" + ip]);
      return json({ token: await newSession(id), user: id, name, av: avatar ? 1 : 0, epoch: await getEpoch() });
    }

    if (path === "/login" && req.method === "POST") {
      const ip = ipOf(req);
      const b = await req.json().catch(() => ({}));
      const raw = normName(b.name ?? b.user);
      const keys = ["ip:" + ip, "name:" + raw.toLowerCase()];
      if (await limited(keys, 8)) return err("Zu viele Fehlversuche – bitte in ein paar Minuten nochmal.", 429);
      let u = raw ? (must(await db.from("hm_user").select("*").eq("name_lc", raw.toLowerCase()).maybeSingle()) as any) : null;
      if (!u && /^[a-z0-9]+$/.test(raw)) u = await userById(raw); // ältere App-Versionen senden die ID
      // Neue Konten: Name ohne Groß-/Kleinschreibung, Passwort exakt. Alt-Konten (Sascha/Martin): Passwort egal welche Schreibung.
      const ok = u && typeof b.pass === "string" && (await verify(u, b.pass));
      if (!ok) {
        await bump(keys); await sleep(300);
        return err(u ? "Falsches Passwort." : "Unbekannter Name oder falsches Passwort.", 401, { bad: true });
      }
      await db.from("hm_fail").delete().in("k", keys);
      return json({ token: await newSession(u.id), user: u.id, name: u.name, av: u.av, epoch: await getEpoch() });
    }

    const a = await auth(req);
    if (!a) return json({ error: "Nicht angemeldet", code: 401 }, 401); // echter 401 (auch für ältere App-Versionen)
    const me = a.id;

    if (path === "/logout") { await db.from("hm_session").delete().eq("token", a.token); return json({ ok: true }); }

    if (path === "/account" && req.method === "POST") {
      const b = await req.json().catch(() => ({}));
      const u = await userById(me);
      if (!u) return err("Konto nicht gefunden", 401);
      if (b.action === "rename") {
        const name = normName(b.name), np = nameProblem(name);
        if (np) return err(np, 400, { field: "name" });
        if (name.toLowerCase() !== u.name_lc) {
          const t = must(await db.from("hm_user").select("id").eq("name_lc", name.toLowerCase()).maybeSingle());
          if (t) return err("Der Name ist schon vergeben.", 409, { field: "name" });
        }
        const r = await db.from("hm_user").update({ name, name_lc: name.toLowerCase(), updated_at: new Date().toISOString() }).eq("id", me);
        if (r.error) { if (String((r.error as any).code) === "23505") return err("Der Name ist schon vergeben.", 409, { field: "name" }); throw r.error; }
        return json({ ok: true, name });
      }
      if (b.action === "password") {
        if (await limited(["pw:" + me], 8)) return err("Zu viele Fehlversuche – bitte später nochmal.", 429);
        if (!(await verify(u, String(b.old ?? "")))) { await bump(["pw:" + me]); return err("Das bisherige Passwort stimmt nicht.", 401, { field: "old" }); }
        const pp = passProblem(b.pass); if (pp) return err(pp, 400, { field: "pass" });
        must(await db.from("hm_user").update({ ...(await hashNew(b.pass)), updated_at: new Date().toISOString() }).eq("id", me));
        await db.from("hm_session").delete().eq("usr", me).neq("token", a.token); // andere Geräte abmelden
        return json({ ok: true });
      }
      if (b.action === "avatar") {
        const av = avatarData(b.avatar);
        if (av === undefined) return err("Das Bild konnte nicht verarbeitet werden.", 400);
        const n = av ? (u.av || 0) + 1 : 0;
        must(await db.from("hm_user").update({ avatar: av, av: n, updated_at: new Date().toISOString() }).eq("id", me));
        return json({ ok: true, av: n });
      }
      if (b.action === "delete") {
        if (await limited(["pw:" + me], 8)) return err("Zu viele Fehlversuche – bitte später nochmal.", 429);
        if (!(await verify(u, String(b.pass ?? "")))) { await bump(["pw:" + me]); return err("Das Passwort stimmt nicht.", 401, { field: "pass" }); }
        const n = await deleteAccount(me);
        return json({ ok: true, removed: n });
      }
      return err("Unbekannte Aktion", 400);
    }

    if (path === "/friend" && req.method === "POST") {
      const b = await req.json().catch(() => ({}));
      if (b.action === "search") {
        const q = normName(b.q).toLowerCase().replace(/[%_\\,()]/g, "");
        if (q.length < 1) return json({ users: [] });
        const rows = must(await db.from("hm_user").select("id,name,av").ilike("name_lc", `%${q}%`).neq("id", me).order("name_lc").limit(25)) as any[];
        const c = await context(me);
        const rel = (id: string) => c.friends.includes(id) ? "friend" : c.outgoing.some((x) => x.id === id) ? "outgoing" : c.incoming.some((x) => x.id === id) ? "incoming" : "none";
        rows.sort((x, y) => (x.name.toLowerCase().startsWith(q) ? 0 : 1) - (y.name.toLowerCase().startsWith(q) ? 0 : 1));
        return json({ users: rows.map((u) => ({ ...pub(u), rel: rel(u.id) })) });
      }
      const other = String(b.id || "");
      if (!/^[a-z0-9]{1,40}$/.test(other) || other === me) return err("Ungültiger Nutzer", 400);
      const ou = must(await db.from("hm_user").select("id,name").eq("id", other).maybeSingle()) as any;
      if (!ou) return err("Diesen Nutzer gibt es nicht mehr.", 404);
      const k = pair(me, other);
      const row = must(await db.from("hm_friend").select("*").eq("a", k.a).eq("b", k.b).maybeSingle()) as any;
      if (b.action === "request") {
        if (row?.status === "accepted") return json({ ok: true, rel: "friend" });
        if (row && row.req !== me) { // Gegenanfrage = annehmen
          must(await db.from("hm_friend").update({ status: "accepted" }).eq("a", k.a).eq("b", k.b));
          await notifyServer(me, other, "friend", `{{u:${me}}} hat deine Freundschaftsanfrage angenommen. Prost! 🍻`, "user:" + me);
          return json({ ok: true, rel: "friend" });
        }
        if (row) return json({ ok: true, rel: "outgoing" });
        const c = await context(me);
        if (c.outgoing.length >= 50) return err("Zu viele offene Anfragen.", 429);
        must(await db.from("hm_friend").insert({ ...k, status: "pending", req: me }));
        await notifyServer(me, other, "freq", `{{u:${me}}} möchte mit dir befreundet sein.`, "freq:" + me);
        return json({ ok: true, rel: "outgoing" });
      }
      if (b.action === "accept") {
        if (!row || row.status !== "pending" || row.req === me) return err("Keine offene Anfrage", 400);
        must(await db.from("hm_friend").update({ status: "accepted" }).eq("a", k.a).eq("b", k.b));
        await notifyServer(me, other, "friend", `{{u:${me}}} hat deine Freundschaftsanfrage angenommen. Prost! 🍻`, "user:" + me);
        return json({ ok: true, rel: "friend" });
      }
      if (b.action === "decline" || b.action === "cancel" || b.action === "remove") {
        if (row) must(await db.from("hm_friend").delete().eq("a", k.a).eq("b", k.b));
        return json({ ok: true, rel: "none" });
      }
      return err("Unbekannte Aktion", 400);
    }

    if (path === "/sync") {
      let since = Number(url.searchParams.get("since") || 0);
      let wrote = 0;
      const rejected: any[] = [];
      const epoch = await getEpoch();
      let c = await context(me);
      if (req.method === "POST") {
        const raw = await req.text();
        if (raw.length > MAX_BODY) return err("Zu groß", 413);
        const b = JSON.parse(raw || "{}");
        since = Number(b.since ?? since) || 0;
        if (Number(b.epoch) !== epoch) {
          const rev = Number(must(await db.rpc("hm_rev")));
          return json({ user: me, wrote: 0, rejected: [], resetRequired: true, epoch, rev, items: [] });
        }
        const items = Array.isArray(b.items) ? b.items.slice(0, MAX_ITEMS) : [];
        const E = await existing(items);
        const ok: any[] = [];
        for (const it of items) {
          const why = allowed(me, it, c.F, E);
          if (why) rejected.push({ kind: it?.kind, id: it?.id, why });
          else ok.push({ kind: it.kind, id: it.id, del: !!it.del, data: it.del ? null : it.data });
        }
        if (ok.length) {
          must(await db.rpc("hm_put", { p_items: ok, p_user: me })); wrote = ok.length;
          if (ok.some((x) => x.kind === "tasting")) c = await context(me);
        }
      }
      const p = await pull(since, me, c.F, c.T);
      return json({ user: me, wrote, rejected, epoch, ...p, dir: await directory(me, c) });
    }

    if (path === "/seed") return err("Startdaten gibt es nicht mehr", 410);
    return err("Unbekannte Route", 404);
  } catch (e) {
    console.error(e);
    return json({ error: "Serverfehler", code: 500 }, 500);
  }
});
