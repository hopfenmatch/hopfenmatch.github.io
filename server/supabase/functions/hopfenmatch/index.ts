// HopfenMatch – Sync-Backend (Supabase Edge Function "hopfenmatch")
// Routen: POST /login, GET|POST /sync, GET /health
// Daten-Epoche (hm_meta 'epoch'): Schreiben nur mit passender Epoche – nach einem Neustart der Daten laden alte Geräte neu, statt alte Bewertungen hochzuladen.
// Eigene Tabellen hm_item / hm_session / hm_meta (siehe ../../../schema.sql). Galaxy Empire bleibt unberührt.
import { createClient } from "npm:@supabase/supabase-js@2.118.0";

const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });
const USERS = ["sascha", "martin"];
// Passwort für beide: BIER (Groß-/Kleinschreibung egal) – nur als SHA-256 hinterlegt
const KINDS = ["rating", "checkin", "tasting", "tscore", "cbeer", "event", "notif", "like", "fav"];
const MAX_ITEMS = 500, MAX_BODY = 512 * 1024;
const fails = new Map<string, { n: number; t: number }>();

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, content-type, x-client-info, apikey",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Max-Age": "86400",
};
const json = (o: unknown, status = 200) => new Response(JSON.stringify(o), { status, headers: { ...CORS, "content-type": "application/json; charset=utf-8", "cache-control": "no-store" } });
const must = <T>(r: { data: T; error: unknown }) => { if (r.error) throw r.error; return r.data; };

async function sha(s: string) {
  const b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, "0")).join("");
}
async function checkPass(p: string) {
  // Vergleich über Hash, damit das Klartext-Passwort nicht im Code steht
  return (await sha("hopfenmatch:" + String(p || "").trim().toUpperCase())) === Deno.env.get("HM_PASS_SHA") ||
    (!Deno.env.get("HM_PASS_SHA") && (await sha("hopfenmatch:" + String(p || "").trim().toUpperCase())) === DEFAULT_SHA);
}
const DEFAULT_SHA = "ac1af4be560a7d4e3fa35280231d8e2078d3e0f2d9062fdeb0b9cb82376bcdd1";

async function auth(req: Request): Promise<string | null> {
  const h = req.headers.get("authorization") || "";
  const t = h.startsWith("Bearer ") ? h.slice(7).trim() : "";
  if (!t || t.length < 20) return null;
  const r = must(await db.from("hm_session").select("usr,seen_at").eq("token", t).maybeSingle()) as { usr: string; seen_at: string } | null;
  if (!r) return null;
  if (Date.now() - Date.parse(r.seen_at) > 6 * 3600e3) await db.from("hm_session").update({ seen_at: new Date().toISOString() }).eq("token", t);
  return r.usr;
}

// Besitzregeln: eigene Bewertungen, Check-ins, Likes, Favoriten und Tasting-Punkte darf nur der Besitzer schreiben
function allowed(user: string, it: any): string | null {
  if (!it || typeof it !== "object") return "Ungültiger Eintrag";
  const { kind, id } = it;
  if (!KINDS.includes(kind)) return "Unbekannte Art " + kind;
  if (typeof id !== "string" || !id || id.length > 200) return "Ungültige ID";
  if (!it.del && (it.data === undefined || it.data === null || typeof it.data !== "object")) return "Daten fehlen";
  if (JSON.stringify(it.data || {}).length > 32 * 1024) return "Eintrag zu groß";
  const owner = kind === "rating" ? id.split(":")[0] : kind === "like" || kind === "fav" ? id.split("|")[0] : kind === "tscore" ? id.split("|")[2] : kind === "checkin" ? (it.data?.user) : null;
  if (owner && owner !== user) return "Fremde Daten (" + kind + ")";
  if (kind === "rating" && !it.del && (it.data.user !== user || typeof it.data.score !== "number" || it.data.score < 0 || it.data.score > 100)) return "Ungültige Bewertung";
  if (kind === "tscore" && !it.del && (typeof it.data.v !== "number" || it.data.v < 0 || it.data.v > 100)) return "Ungültige Punkte";
  return null;
}

async function getEpoch(): Promise<number> {
  const r = must(await db.from("hm_meta").select("v").eq("k", "epoch").maybeSingle()) as { v: { n: number } } | null;
  return Number(r?.v?.n) || 1;
}

async function pull(since: number) {
  const rev = must(await db.rpc("hm_rev")) as number;
  const items: any[] = [];
  let from = since;
  // seitenweise lesen (PostgREST-Limit 1000)
  for (;;) {
    const page = must(await db.from("hm_item").select("kind,id,data,del,rev,by_user").gt("rev", from).lte("rev", rev).order("rev").limit(1000)) as any[];
    items.push(...page);
    if (page.length < 1000) break;
    from = page[page.length - 1].rev;
  }
  return { rev: Number(rev), items };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: CORS });
  const url = new URL(req.url);
  const path = url.pathname.replace(/^.*\/hopfenmatch/, "") || "/";
  try {
    if (path === "/health") return json({ ok: true, app: "hopfenmatch", t: Date.now() });

    if (path === "/login" && req.method === "POST") {
      const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "?";
      const f = fails.get(ip);
      if (f && f.n >= 8 && Date.now() - f.t < 10 * 60e3) return json({ error: "Zu viele Versuche – bitte in ein paar Minuten nochmal." }, 429);
      const b = await req.json().catch(() => ({}));
      const user = String(b.user || "").toLowerCase();
      if (!USERS.includes(user) || !(await checkPass(b.pass))) {
        fails.set(ip, { n: (f && Date.now() - f.t < 10 * 60e3 ? f.n : 0) + 1, t: Date.now() });
        await new Promise((r) => setTimeout(r, 400));
        return json({ error: "Falsches Passwort", bad: true }); // 200, damit der Browser keinen Konsolenfehler meldet
      }
      fails.delete(ip);
      const token = crypto.randomUUID().replace(/-/g, "") + crypto.randomUUID().replace(/-/g, "");
      must(await db.from("hm_session").insert({ token, usr: user }));
      return json({ token, user, epoch: await getEpoch() });
    }

    const user = await auth(req);
    if (!user) return json({ error: "Nicht angemeldet" }, 401);

    if (path === "/sync") {
      let since = Number(url.searchParams.get("since") || 0);
      let wrote = 0;
      const rejected: any[] = [];
      const epoch = await getEpoch();
      if (req.method === "POST") {
        const raw = await req.text();
        if (raw.length > MAX_BODY) return json({ error: "Zu groß" }, 413);
        const b = JSON.parse(raw || "{}");
        since = Number(b.since ?? since) || 0;
        if (Number(b.epoch) !== epoch) {
          // Gerät hat einen veralteten Datenstand (vor dem letzten Neustart): nichts schreiben, Neuladen anfordern
          const rev = Number(must(await db.rpc("hm_rev")));
          return json({ user, wrote: 0, rejected: [], resetRequired: true, epoch, rev, items: [] });
        }
        const items = Array.isArray(b.items) ? b.items.slice(0, MAX_ITEMS) : [];
        const ok: any[] = [];
        for (const it of items) {
          const why = allowed(user, it);
          if (why) rejected.push({ kind: it?.kind, id: it?.id, why });
          else ok.push({ kind: it.kind, id: it.id, del: !!it.del, data: it.del ? null : it.data });
        }
        if (ok.length) { must(await db.rpc("hm_put", { p_items: ok, p_user: user })); wrote = ok.length; }
      }
      const p = await pull(since);
      return json({ user, wrote, rejected, epoch, ...p });
    }

    if (path === "/seed") return json({ error: "Startdaten gibt es nicht mehr (v1.3: Neustart bei null)" }, 410);
    return json({ error: "Unbekannte Route" }, 404);
  } catch (e) {
    console.error(e);
    return json({ error: "Serverfehler" }, 500);
  }
});
