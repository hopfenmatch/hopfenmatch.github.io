/* HopfenMatch 1.9.1 – Startseite: 3D-Karussell aus gerenderten Flaschen (Blender Cycles, 72 Drehwinkel à 5° je Flasche, Retina-Auflösung, bewegungsabhängig überblendet).
   Ab 1.9 sind die Glas-Sprites ohne Etiketten gerendert; die Etiketten werden live per WebGL exakt im Drehwinkel aufgezeichnet (immer scharf). Ohne WebGL: alte Sprites mit eingebackenen Etiketten. Drei fotorealistische Flaschen stehen auf einer unsichtbaren Drehplatte;
   Wischen dreht den ganzen Kreis (folgt dem Finger, Trägheit, Feder, endlos). Studiolicht bleibt stehen. */
'use strict';
(function(){
const KS=['bier','wein','whisky'],NAME={bier:'Bier',wein:'Wein',whisky:'Whisky'};
const RM=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
const ss=(a,b,x)=>{const t=Math.max(0,Math.min(1,(x-a)/(b-a)));return t*t*(3-2*t)};
/* Flaschen-Freisteller (Pixel im jeweiligen Bild) + reale Höhe in cm */
const M2={"bier":{"hcm":25.6,"wcm":7.0,"crop":[0.20904,0.17556,0.79096,1.0],"fw":206,"fh":742,"fw2":144,"fh2":519},"wein":{"hcm":30.0,"wcm":7.6,"crop":[0.19209,0.04333,0.80791,1.0],"fw":218,"fh":861,"fw2":153,"fh2":603},"whisky":{"hcm":25.8,"wcm":9.6,"crop":[0.07062,0.17,0.92938,0.99111],"fw":304,"fh":739,"fw2":213,"fh2":517}},M1={"bier":{"hcm":25.6,"wcm":7.0,"crop":[0.20904,0.17556,0.79096,1.0],"fw":206,"fh":742},"wein":{"hcm":30.0,"wcm":7.6,"crop":[0.18927,0.04333,0.81073,1.0],"fw":220,"fh":861},"whisky":{"hcm":25.8,"wcm":9.6,"crop":[0.07062,0.17,0.92938,0.99111],"fw":304,"fh":739}};let META=M2,PFX='car2_';const FCM=33,FWCM=13,BASE=0.318/0.33,SEQ={n:72,step:5,cols:6,gut:2};
/* Bogen-Raster: Blatt 1 = 20°, Blatt 2 = +10°, Blatt 3/4 = +5°/+15° (Index n%4 → Blatt) */
const SHEET=['s1','s3','s2','s4'];
/* Kamera: Abstand zur Drehachse D, Plattenradius RT, Kamerahöhe HC (cm) */
const D=36,RT=8,HC=12;
const C={bier:{ui:'#fbf0dc',sub:'#e8cfa6',btn:'#e3a332',btnInk:'#24140a'},
 wein:{ui:'#fbefe6',sub:'#e6c6c8',btn:'#f3e6cf',btnInk:'#5a1424'},
 whisky:{ui:'#f6ead2',sub:'#d8c39a',btn:'#d8b864',btnInk:'#1a1208'}};
const hex=h=>{const n=parseInt(h.slice(1),16);return [n>>16,(n>>8)&255,n&255]};
const CH={};KS.forEach(k=>{const o={};for(const x in C[k])o[x]=hex(C[k][x]);CH[k]=o});
const mixc=(a,b,t)=>'rgb('+Math.round(a[0]+(b[0]-a[0])*t)+','+Math.round(a[1]+(b[1]-a[1])*t)+','+Math.round(a[2]+(b[2]-a[2])*t)+')';
let GLM=false;let host,stage,P=0,V=0,anim=0,drag=null,opts={},vis=false,lastIdx=-1,hinted=false,DPR=2,CW=390,CHh=844,L=null;
const mod=(x,n)=>((x%n)+n)%n;
function weights(p){const q=mod(p,3),i=Math.floor(q),t=q-i;return {i,j:(i+1)%3,t}}
const B={};// je Flasche: el, cv, ctx, img, lab, neck, lastPsi
/* ===== v1.9: Etiketten live per WebGL – exakt auf die Geometrie der gerenderten Flasche projiziert (gleiche Kamera wie in Blender),
   Licht passend zum Studiolicht, Kondenstropfen (Bier), Goldfolie mit Glanz (Wein, Whisky), Rückenetikett durch Glas und Flüssigkeit ===== */
const LBK={bier:{cyl:1,R:35.25,Rg:35,F:[62,140,150],B:[62,140,85.5],N:[13.75,224,236],ior:1.36,op:.82,cream:[.86,.80,.70],tint:[.55,.30,.16],zr:[60,238],rr:36},
 wein:{cyl:1,R:38.25,Rg:38,F:[58,168,98],B:[66,151,74],ior:1.45,op:.45,cream:[.84,.80,.72],tint:[.6,.55,.5],zr:[56,170],rr:39},
 whisky:{cyl:0,PF:[60,83.7931,103.5,-31.15],PB:[56,79.975,103.5,31.15],hx:48,hy:31,ior:1.45,op:.82,cream:[.80,.74,.62],tint:[.62,.40,.22],zr:[61,146],rr:58}};
const GFL=112.5*0.32/0.33,GAS=354/900;
const f3=a=>'vec3('+a.map(v=>(+v).toFixed(5)).join(',')+')',fl=v=>(+v).toFixed(5);
function glSrc(k){const c=LBK[k];let d='#define CYL '+c.cyl+'\n';
 if(c.cyl){d+=`#define RL ${fl(c.R)}\n#define RG ${fl(c.Rg)}\n#define FZ vec3(${fl(c.F[0])},${fl(c.F[1])},${fl(c.F[2]*Math.PI/180)})\n#define BZ vec3(${fl(c.B[0])},${fl(c.B[1])},${fl(c.B[2]*Math.PI/180)})\n`;
  if(c.N)d+=`#define NECK 1\n#define NZ vec3(${fl(c.N[0])},${fl(c.N[1])},${fl(c.N[2])})\n`}
 else d+=`#define PF vec4(${c.PF.map(fl).join(',')})\n#define PB vec4(${c.PB.map(fl).join(',')})\n#define HX ${fl(c.hx)}\n#define HY ${fl(c.hy)}\n`;
 d+=`#define IOR ${fl(c.ior)}\n#define OPA ${fl(c.op)}\n#define CREAM ${f3(c.cream)}\n#define TINT ${f3(c.tint)}\n#define DROPS ${k==='bier'?'1.0':'0.0'}\n`;
 return `#extension GL_OES_standard_derivatives : enable
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
${d}
uniform vec4 uBand;uniform vec4 uVP;uniform vec2 uCS;uniform float uMode,uSoft;
uniform sampler2D tF,tFx,tB,tBx,tN;
const float FL=${fl(GFL)},SH=36.,ASP=${fl(GAS)};
const vec3 CAM=vec3(0.,-1000.,153.);
/* Studiolicht (Welt): Hauptlicht links vorn oben (warm), Fenster/Softbox oben links, Kante rechts, warmes Umgebungslicht */
const vec3 LK=vec3(-0.7339,-0.6361,0.2838),LW=vec3(-0.5178,-0.5178,0.6807),LR=vec3(0.8418,0.5388,0.0673);
const vec3 CK=vec3(1.0,0.84,0.66),CW=vec3(1.0,0.93,0.84),CR=vec3(1.0,0.80,0.58),AMB=vec3(0.35,0.30,0.24);
vec3 rz(vec3 v,vec2 cs){return vec3(v.x*cs.x-v.y*cs.y,v.x*cs.y+v.y*cs.x,v.z);}
float wr(float x,float w){return max(0.,(x+w)/(1.+w));}
float edgeAA(vec2 uv){vec2 w=clamp(fwidth(uv),vec2(1e-5),vec2(.02));vec2 e=min(uv,1.-uv)/w;return clamp(.5+min(e.x,e.y),0.,1.);}
vec3 diffL(vec3 n){return AMB+0.90*wr(dot(n,LK),.45)*CK+0.42*wr(dot(n,LW),.6)*CW+0.32*wr(dot(n,LR),.25)*CR;}
float ph(vec3 n,vec3 L,vec3 V,float s){return pow(max(dot(n,normalize(L+V)),0.),s);}
/* Papier, Goldfolie, Tropfen – n: Normale (Welt), T/U: Tangenten (Welt), V: zur Kamera */
vec4 shade(sampler2D tc,sampler2D tx,vec2 uv,vec3 n,vec3 T,vec3 U,vec3 V,float hasX){
 vec4 ax=hasX>0.?texture2D(tx,uv):vec4(0.,.5,.5,1.);
 vec2 dn=(ax.gb-.5)*2.;float cov=clamp((1.-ax.a)*2.008,0.,1.)*DROPS;
 vec2 uv2=uv-vec2(dn.x,-dn.y)*0.0065*cov;
 vec3 tex=texture2D(tc,uv2).rgb;tex*=tex;/* sRGB grob linear */
 float nv=max(dot(n,V),0.);
 vec3 dif=diffL(n);
 float gold=ax.r*(1.-cov);
 vec3 spP=(0.05*ph(n,LK,V,14.)+0.035*ph(n,LW,V,8.))*CK;
 vec3 paper=tex*dif*1.1+spP;
 /* Goldfolie: wenig Streulicht, kräftiger, gerichteter Glanz der Lichter + warme Umgebung */
 float gk=ph(n,LK,V,60.),gw=ph(n,LW,V,22.),gr=ph(n,LR,V,30.);
 float gb=pow(max(dot(n,normalize(LW+V)),0.),3.);
 vec3 goldc=tex*(0.35*dif+0.85+0.75*gb*CW+2.4*gk*CK+1.0*gw*CW+0.9*gr*CR+0.4*pow(1.-nv,2.));
 vec3 col=mix(paper,goldc,gold);
 /* Rand dunkler (Lichtabfall zur Silhouette) */
 col*=mix(.42,1.,smoothstep(0.,.6,nv));
 if(DROPS>.5&&cov>0.003){float l2=dot(dn,dn),nz=sqrt(max(0.,1.-l2));
  vec3 nd=normalize(T*dn.x+U*dn.y+n*max(nz,.05));
  float rim=1.-.55*smoothstep(.25,.95,sqrt(l2));
  vec3 drop=tex*diffL(nd)*rim*mix(.42,1.,smoothstep(0.,.6,nv));
  drop+=(2.4*ph(nd,LK,V,220.)*CK+1.2*ph(nd,LW,V,120.)*CW+.5*ph(nd,LR,V,90.)*CR);
  col=mix(col,drop,clamp(cov,0.,1.));}
 return vec4(sqrt(max(col,0.)),1.);}
void main(){
 vec2 f=(gl_FragCoord.xy-uVP.xy)/uVP.zw;
 float nx=f.x,ny=uBand.x+(1.-f.y)*(uBand.y-uBand.x);
 vec3 dW=normalize(vec3((nx-.5)*SH*ASP,FL,(.5-ny)*SH));
 vec2 ci=vec2(uCS.x,-uCS.y);
 vec3 d=rz(dW,ci),o=rz(CAM,ci),V=-dW;
 vec4 outc=vec4(0.);
#if CYL==1
 float a=dot(d.xy,d.xy),tc=-dot(o.xy,d.xy)/a;vec2 q=o.xy+d.xy*tc;float qq=dot(q,q);
 if(uMode<.5){
  float h2=RL*RL-qq;float sil=clamp(.5+h2/max(fwidth(h2),1e-4),0.,1.);
  float t1=tc-sqrt(max(h2,0.)/a);vec3 p=o+d*t1;
  vec3 nO=vec3(p.xy/RL,0.),n=rz(nO,uCS);vec3 U=vec3(0.,0.,1.);
  float al=atan(p.x,-p.y);
  vec2 uvF=vec2((al+FZ.z*.5)/FZ.z,(p.z-FZ.x)/(FZ.y-FZ.x));
  float ab=atan(-p.x,p.y);
  vec2 uvB=vec2((ab+BZ.z*.5)/BZ.z,(p.z-BZ.x)/(BZ.y-BZ.x));
  float cF=edgeAA(uvF)*sil,cB=edgeAA(uvB)*sil;
#ifdef NECK
  float h3=NZ.x*NZ.x-qq;float s3=clamp(.5+h3/max(fwidth(h3),1e-4),0.,1.);
  float t3=tc-sqrt(max(h3,0.)/a);vec3 p3=o+d*t3;float an=atan(p3.x,-p3.y);
  float u1=fract((an+3.14159265)/6.2831853),u2=fract(u1+.5)-.5;float un=fwidth(u1)<=fwidth(u2)+1e-6?u1:u2;
  float vn=(p3.z-NZ.y)/(NZ.z-NZ.y);float cN=clamp(.5+min(vn,1.-vn)/clamp(fwidth(vn),1e-5,.05),0.,1.)*s3;
#endif
  if(cF>0.){vec3 T=rz(vec3(cos(al),sin(al),0.),uCS);vec4 c=shade(tF,tFx,vec2(uvF.x,1.-uvF.y),n,T,U,V,1.);outc=vec4(c.rgb*cF,cF);}
  else if(cB>0.){vec3 T=rz(vec3(-cos(ab),-sin(ab),0.),uCS);vec4 c=shade(tB,tBx,vec2(uvB.x,1.-uvB.y),n,T,U,V,1.);outc=vec4(c.rgb*cB,cB);}
#ifdef NECK
  else if(cN>0.){vec3 n3=rz(vec3(p3.xy/NZ.x,0.),uCS);vec3 T=rz(vec3(cos(an),sin(an),0.),uCS);vec4 c=shade(tN,tN,vec2(un,1.-vn),n3,T,U,V,0.);outc=vec4(c.rgb*cN,cN);}
#endif
 }else{
  /* Blick durch Glas + Flüssigkeit: Brechung beim Eintritt, dann Innenseite der gegenüberliegenden Etiketten */
  float h2=RG*RG-qq;if(h2<=0.){gl_FragColor=vec4(0.);return;}
  float t1=tc-sqrt(h2/a);vec3 p1=o+d*t1;vec3 n1=vec3(p1.xy/RG,0.);
  float ne=max(dot(-d,n1),0.);
  vec3 d2=refract(d,n1,1./IOR);
  float a2=dot(d2.xy,d2.xy),tc2=-dot(p1.xy,d2.xy)/a2;vec2 q2=p1.xy+d2.xy*tc2;float h4=max(RG*RG-dot(q2,q2),0.);
  vec3 p=p1+d2*(tc2+sqrt(h4/a2));
  float al=atan(p.x,-p.y),ab=atan(-p.x,p.y);
  vec2 uvF=vec2((al+FZ.z*.5)/FZ.z,(p.z-FZ.x)/(FZ.y-FZ.x));
  vec2 uvB=vec2((ab+BZ.z*.5)/BZ.z,(p.z-BZ.x)/(BZ.y-BZ.x));
  float fe=smoothstep(.12,.42,ne);
  float cB=edgeAA(uvB)*fe,cF=edgeAA(uvF)*fe;vec3 m=vec3(1.);float cv=0.;
  if(cB>0.){vec3 t=texture2D(tB,vec2(1.-uvB.x,1.-uvB.y)).rgb;m=t*TINT*1.25;cv=cB;}
  else if(cF>0.){vec3 t=texture2D(tF,vec2(uvF.x,1.-uvF.y)).rgb;float l=dot(t,vec3(.3,.5,.2));m=CREAM*TINT*(.8+.2*l);cv=cF;}
  if(cv>0.){vec3 mm=mix(vec3(1.),m,OPA);outc=vec4(mm*cv,cv);}
 }
#else
 if(uMode<.5){
  if(o.y<PF.w){float t=(PF.w-o.y)/d.y;vec3 p=o+d*t;vec2 uv=vec2(p.x/PF.x+.5,(p.z-PF.z)/PF.y+.5);float c=edgeAA(uv);
   if(c>0.){vec3 n=rz(normalize(vec3((uv.x-.5)*.3,-1.,0.)),uCS);vec4 s=shade(tF,tFx,vec2(uv.x,1.-uv.y),n,rz(vec3(1.,0.,0.),uCS),vec3(0.,0.,1.),V,1.);outc=vec4(s.rgb*c,c);}}
  else if(o.y>PB.w){float t=(PB.w-o.y)/d.y;vec3 p=o+d*t;vec2 uv=vec2(-p.x/PB.x+.5,(p.z-PB.z)/PB.y+.5);float c=edgeAA(uv);
   if(c>0.){vec3 n=rz(normalize(vec3(-(uv.x-.5)*.3,1.,0.)),uCS);vec4 s=shade(tB,tBx,vec2(uv.x,1.-uv.y),n,rz(vec3(-1.,0.,0.),uCS),vec3(0.,0.,1.),V,1.);outc=vec4(s.rgb*c,c);}}
 }else{
  /* Eintritt in den Glasquader (Seiten ±HX, Front/Rücken ±HY), Brechung, dann Ebene des gegenüberliegenden Etiketts */
  vec2 inv=1./d.xy;vec2 t0=(vec2(-HX,-HY)-o.xy)*inv,t1=(vec2(HX,HY)-o.xy)*inv;vec2 tn=min(t0,t1),tf=max(t0,t1);
  float te=max(tn.x,tn.y),tx=min(tf.x,tf.y);if(te>=tx){gl_FragColor=vec4(0.);return;}
  vec3 p1=o+d*te;vec3 n1=tn.x>tn.y?vec3(-sign(d.x),0.,0.):vec3(0.,-sign(d.y),0.);
  float ne=max(dot(-d,n1),0.);vec3 d2=refract(d,n1,1./IOR);
  float yp=d2.y>0.?PB.w:PF.w;float t=(yp-p1.y)/d2.y;vec3 p=p1+d2*t;float inb=step(abs(p.x),HX);
  float fe=smoothstep(.12,.42,ne)*inb;vec3 m=vec3(1.);float cv=0.;
  if(yp>0.){vec2 uv=vec2(-p.x/PB.x+.5,(p.z-PB.z)/PB.y+.5);float c=edgeAA(uv)*fe;if(c>0.){m=texture2D(tB,vec2(1.-uv.x,1.-uv.y)).rgb*TINT*1.25;cv=c;}}
  else{vec2 uv=vec2(p.x/PF.x+.5,(p.z-PF.z)/PF.y+.5);float c=edgeAA(uv)*fe;if(c>0.){vec3 tt=texture2D(tF,vec2(uv.x,1.-uv.y)).rgb;m=CREAM*TINT*(.8+.2*dot(tt,vec3(.3,.5,.2)));cv=c;}}
  if(cv>0.){vec3 mm=mix(vec3(1.),m,OPA);outc=vec4(mm*cv,cv);}
 }
#endif
 gl_FragColor=outc;}`}
const GLX={ok:false};
function glInit(){try{const c=document.createElement('canvas');c.width=4;c.height=4;
 const gl=c.getContext('webgl',{alpha:true,premultipliedAlpha:true,antialias:false,depth:false,stencil:false,preserveDrawingBuffer:true,powerPreference:'high-performance'});
 if(!gl||!gl.getExtension('OES_standard_derivatives'))return false;
 const an=gl.getExtension('EXT_texture_filter_anisotropic')||gl.getExtension('WEBKIT_EXT_texture_filter_anisotropic');
 const vs=gl.createShader(gl.VERTEX_SHADER);gl.shaderSource(vs,'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}');gl.compileShader(vs);
 const P={};for(const k of KS){const fs=gl.createShader(gl.FRAGMENT_SHADER);gl.shaderSource(fs,glSrc(k));gl.compileShader(fs);
  if(!gl.getShaderParameter(fs,gl.COMPILE_STATUS)){console.warn('HM label shader',k,gl.getShaderInfoLog(fs));return false}
  const pr=gl.createProgram();gl.attachShader(pr,vs);gl.attachShader(pr,fs);gl.bindAttribLocation(pr,0,'p');gl.linkProgram(pr);
  if(!gl.getProgramParameter(pr,gl.LINK_STATUS))return false;
  const u={};['uBand','uVP','uCS','uMode','uSoft','tF','tFx','tB','tBx','tN'].forEach(n=>u[n]=gl.getUniformLocation(pr,n));P[k]={pr,u}}
 const bf=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,bf);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),gl.STATIC_DRAW);
 gl.enableVertexAttribArray(0);gl.vertexAttribPointer(0,2,gl.FLOAT,false,0,0);
 const blank=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,blank);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,1,1,0,gl.RGBA,gl.UNSIGNED_BYTE,new Uint8Array([0,128,128,255]));
 gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.NEAREST);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.NEAREST);
 Object.assign(GLX,{ok:true,c,gl,P,an,amax:an?Math.min(8,gl.getParameter(an.MAX_TEXTURE_MAX_ANISOTROPY_EXT)):0,blank,T:{}});
 c.addEventListener('webglcontextlost',e=>{e.preventDefault();GLX.ok=false;glLost()});
 /* Bildband der Etiketten je Flasche (unabhängig vom Drehwinkel) */
 KS.forEach(k=>{const g=LBK[k];let y0=1,y1=0;for(let i=0;i<48;i++){const t=i/48*6.2832;for(const z of g.zr){const x=g.rr*Math.cos(t),y=g.rr*Math.sin(t),ny=.5-GFL*(z-153)/(y+1000)/36;y0=Math.min(y0,ny);y1=Math.max(y1,ny)}}
  g.band=[Math.max(0,y0-.004),Math.min(1,y1+.004)]});
 return true}catch(e){console.warn('HM WebGL',e);return false}}
function glTex(im,rep){const gl=GLX.gl,t=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,t);
 gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL,false);gl.pixelStorei(gl.UNPACK_COLORSPACE_CONVERSION_WEBGL,gl.NONE);gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,false);
 gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,im);gl.generateMipmap(gl.TEXTURE_2D);
 gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR_MIPMAP_LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
 gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,rep?gl.REPEAT:gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
 if(GLX.an)gl.texParameterf(gl.TEXTURE_2D,GLX.an.TEXTURE_MAX_ANISOTROPY_EXT,GLX.amax);return t}
/* Etiketten der Flasche k in Drehlage deg rendern; liefert [canvas, sx, sy(front), sy(back), bw, bh, ny0, ny1] */
function glDraw(k,deg,W,HH,res,far){const g=LBK[k],T=GLX.ok&&GLX.T[k];if(!T)return null;const gl=GLX.gl,c=GLX.c;
 const bw=Math.max(8,Math.round(W*res)),bh=Math.max(8,Math.round((g.band[1]-g.band[0])*HH*res));
 const cw=bw*2,ch=bh;if(c.width<cw||c.height<ch){c.width=Math.max(cw,c.width);c.height=Math.max(ch,c.height)}
 const pr=GLX.P[k];gl.useProgram(pr.pr);const a=deg*Math.PI/180;
 const tx=[['tF',T.f],['tFx',T.fx],['tB',T.b],['tBx',T.bx],['tN',T.n]];tx.forEach(([n,t],i)=>{gl.activeTexture(gl.TEXTURE0+i);gl.bindTexture(gl.TEXTURE_2D,t||GLX.blank);gl.uniform1i(pr.u[n],i)});
 gl.uniform4f(pr.u.uBand,g.band[0],g.band[1],0,0);gl.uniform2f(pr.u.uCS,Math.cos(a),Math.sin(a));gl.uniform1f(pr.u.uSoft,0);
 gl.disable(gl.BLEND);gl.disable(gl.SCISSOR_TEST);gl.viewport(0,0,c.width,c.height);gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);
 const y=c.height-bh;
 gl.viewport(0,y,bw,bh);gl.uniform4f(pr.u.uVP,0,y,bw,bh);gl.uniform1f(pr.u.uMode,0);gl.drawArrays(gl.TRIANGLES,0,3);
 if(far){gl.viewport(bw,y,bw,bh);gl.uniform4f(pr.u.uVP,bw,y,bw,bh);gl.uniform1f(pr.u.uMode,1);gl.drawArrays(gl.TRIANGLES,0,3)}
 return {c,bw,bh,ny0:g.band[0],ny1:g.band[1],far}}

/* ===== v1.9.1: alles in EINEM WebGL-Canvas – Sprite + Live-Etikett + Kontaktschatten je Flasche in eine Textur (nur bei Änderung),
   dann pro Frame nur drei Quads aufs Bild (Tiefenunschärfe, Helligkeit, Sättigung im Shader; keine CSS-Filter, keine 2D-Kopien).
   Bilder werden vorab dekodiert und in Leerlauf-Frames einzeln hochgeladen und aufgewärmt (kein Ruckeln bei der ersten Drehung). ===== */
const G2={};
function gl2Prog(gl,vs,fs,names){const mk=(t,s)=>{const x=gl.createShader(t);gl.shaderSource(x,s);gl.compileShader(x);if(!gl.getShaderParameter(x,gl.COMPILE_STATUS))throw new Error('HM shader: '+gl.getShaderInfoLog(x));return x};
 const pr=gl.createProgram();gl.attachShader(pr,mk(gl.VERTEX_SHADER,vs));gl.attachShader(pr,mk(gl.FRAGMENT_SHADER,fs));gl.bindAttribLocation(pr,0,'p');gl.linkProgram(pr);
 if(!gl.getProgramParameter(pr,gl.LINK_STATUS))throw new Error('HM link');const u={};names.forEach(n=>u[n]=gl.getUniformLocation(pr,n));return {pr,u}}
const G2HDR='#ifdef GL_FRAGMENT_PRECISION_HIGH\nprecision highp float;\n#else\nprecision mediump float;\n#endif\n';
/* Flasche zusammensetzen (Bildraum der Flasche, y nach unten): Sprite (zwei Winkel überblendet) · Etikett-Durchsicht (Multiplizieren) · Etikett · Kontaktschatten dahinter */
const G2FB=G2HDR+`uniform sampler2D tA,tB,tL;uniform vec4 uRA,uRB,uCrop,uVP,uLB,uSh;uniform float uS,uLab,uFar;
float st(float d,vec3 a){return d<a.y?mix(a.x,a.z,d/a.y):0.;}
float e1(vec2 P){vec2 l=vec2(P.x-uSh.x,(P.y-(uSh.y-.05*uSh.z))/.075);float d=length(l)/(uSh.w*.5*.98*uSh.z);return d<.7?mix(.5,.32,d/.7):d<1.?mix(.32,0.,(d-.7)/.3):0.;}
float e2(vec2 P){vec2 l=vec2(P.x-uSh.x,(P.y-(uSh.y+.05*uSh.z))/.16);float d=length(l)/(uSh.w*.5*1.5*uSh.z);return d<.5?mix(.22,.09,d/.5):d<1.?mix(.09,0.,(d-.5)/.5):0.;}
vec4 tx(sampler2D t,vec2 c){vec4 v=texture2D(t,c);return vec4(v.rgb*v.a,v.a);}
void main(){vec2 f=gl_FragCoord.xy/uVP.xy;vec2 q=vec2(f.x,1.-f.y);vec4 col=vec4(0.);
 vec2 cu=(q-uCrop.xy)/(uCrop.zw-uCrop.xy);
 if(cu.x>=0.&&cu.y>=0.&&cu.x<=1.&&cu.y<=1.){vec4 a=tx(tA,mix(uRA.xy,uRA.zw,cu));if(uS>0.){vec4 b=tx(tB,mix(uRB.xy,uRB.zw,cu));a=mix(a,b,uS);}col=a;}
 if(uLab>0.&&q.y>=uLB.x&&q.y<=uLB.y){float ly=(q.y-uLB.x)/(uLB.y-uLB.x);vec2 t=vec2(q.x*uLB.z,(1.-ly)*uLB.w);
  if(uFar>0.){vec4 fa=texture2D(tL,t+vec2(uLB.z,0.));col=vec4(fa.rgb*(1.-col.a)+col.rgb*(1.-fa.a)+fa.rgb*col.rgb,fa.a+col.a-fa.a*col.a);}
  vec4 n=texture2D(tL,t);col=n+col*(1.-n.a);}
 vec2 P=q*uVP.zw;float a1=e1(P),a2=e2(P);float sa=a1+a2*(1.-a1);col+=vec4(vec3(36.,17.,6.)/255.*sa,sa)*(1.-col.a);
 gl_FragColor=col;}`;
/* aufs Bild: Quad je Flasche; Tiefenunschärfe (17 Abtastungen), Helligkeit, Sättigung */
const G2VS='attribute vec2 p;uniform vec4 uR;uniform vec2 uV;varying vec2 v;void main(){v=p;vec2 s=uR.xy+p*uR.zw;gl_Position=vec4(s.x/uV.x*2.-1.,1.-s.y/uV.y*2.,0.,1.);}';
const G2FS=G2HDR+`uniform sampler2D t;uniform vec4 uT,uC;uniform float uBl,uBr,uSa;varying vec2 v;
vec4 sm(vec2 o){vec2 c=vec2(v.x*uT.x,(1.-v.y)*uT.y)+o*uT.zw;return texture2D(t,clamp(c,uT.zw*.5,uT.xy-uT.zw*.5));}
void main(){vec4 c;
 if(uBl>.25){float r1=uBl,r2=uBl*2.;c=sm(vec2(0.));float w=1.;
  for(int i=0;i<8;i++){float a=float(i)*.785398;c+=.607*sm(vec2(cos(a),sin(a))*r1);c+=.135*sm(vec2(cos(a+.3927),sin(a+.3927))*r2);}
  c/=1.+8.*(.607+.135);}
 else c=sm(vec2(0.));
 vec3 x=c.rgb;float s=uSa;x=vec3(dot(x,vec3(.213+.787*s,.715-.715*s,.072-.072*s)),dot(x,vec3(.213-.213*s,.715+.285*s,.072-.072*s)),dot(x,vec3(.213-.213*s,.715-.715*s,.072+.928*s)));
 gl_FragColor=vec4(x*uBr,c.a)*uC.x;}`;
function gl2Init(stage){try{const c=document.createElement('canvas');c.className='hm-gl';
 const gl=c.getContext('webgl',{alpha:true,premultipliedAlpha:true,antialias:false,depth:false,stencil:false,preserveDrawingBuffer:false,powerPreference:'high-performance'});
 if(!gl||!gl.getExtension('OES_standard_derivatives'))return false;
 const an=gl.getExtension('EXT_texture_filter_anisotropic')||gl.getExtension('WEBKIT_EXT_texture_filter_anisotropic');
 const FT='attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
 const P={};for(const k of KS)P[k]=gl2Prog(gl,FT,glSrc(k),['uBand','uVP','uCS','uMode','uSoft','tF','tFx','tB','tBx','tN']);
 const PB=gl2Prog(gl,FT,G2FB,['tA','tB','tL','uRA','uRB','uCrop','uVP','uLB','uSh','uS','uLab','uFar']);
 const PS=gl2Prog(gl,G2VS,G2FS,['t','uT','uC','uBl','uBr','uSa','uR','uV']);
 const bt=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,bt);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),gl.STATIC_DRAW);
 const bq=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,bq);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([0,0,1,0,0,1,1,1]),gl.STATIC_DRAW);
 gl.enableVertexAttribArray(0);
 const blank=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,blank);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,1,1,0,gl.RGBA,gl.UNSIGNED_BYTE,new Uint8Array([0,128,128,255]));
 gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.NEAREST);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.NEAREST);
 Object.assign(GLX,{ok:true,c,gl,P,an,amax:an?Math.min(8,gl.getParameter(an.MAX_TEXTURE_MAX_ANISOTROPY_EXT)):0,blank,T:{}});
 Object.assign(G2,{c,gl,PB,PS,bt,bq,mem:0,top:0,h:1});G2.scr=gl2Target(1,1);
 KS.forEach(k=>{const g=LBK[k];let y0=1,y1=0;for(let i=0;i<48;i++){const t=i/48*6.2832;for(const z of g.zr){const x=g.rr*Math.cos(t),y=g.rr*Math.sin(t),ny=.5-GFL*(z-153)/(y+1000)/36;y0=Math.min(y0,ny);y1=Math.max(y1,ny)}}
  g.band=[Math.max(0,y0-.004),Math.min(1,y1+.004)]});
 c.addEventListener('webglcontextlost',e=>{e.preventDefault();GLX.ok=false;G2.lost=true;glLost()});
 stage.appendChild(c);
 /* Shader aufwärmen: jedes Programm einmal unsichtbar zeichnen (Kompilieren/Verknüpfen nicht erst bei der ersten Drehung) */
 gl2Bind(G2.scr);gl.viewport(0,0,1,1);gl.bindBuffer(gl.ARRAY_BUFFER,bt);gl.vertexAttribPointer(0,2,gl.FLOAT,false,0,0);
 for(const k of KS){const pr=P[k];gl.useProgram(pr.pr);['tF','tFx','tB','tBx','tN'].forEach((n,i)=>{gl.activeTexture(gl.TEXTURE0+i);gl.bindTexture(gl.TEXTURE_2D,blank);gl.uniform1i(pr.u[n],i)});
  gl.uniform4f(pr.u.uBand,0,1,0,0);gl.uniform4f(pr.u.uVP,0,0,1,1);gl.uniform2f(pr.u.uCS,1,0);for(const m of [0,1]){gl.uniform1f(pr.u.uMode,m);gl.drawArrays(gl.TRIANGLES,0,3)}}
 gl.useProgram(PB.pr);['tA','tB','tL'].forEach((n,i)=>{gl.activeTexture(gl.TEXTURE0+i);gl.bindTexture(gl.TEXTURE_2D,blank);gl.uniform1i(PB.u[n],i)});gl.uniform4f(PB.u.uVP,1,1,1,1);gl.uniform1f(PB.u.uLab,1);gl.uniform1f(PB.u.uFar,1);gl.drawArrays(gl.TRIANGLES,0,3);
 gl2Warm(blank);gl.readPixels(0,0,1,1,gl.RGBA,gl.UNSIGNED_BYTE,new Uint8Array(4));
 return true}catch(e){console.warn('HM WebGL',e);return false}}
function gl2Target(w,h,old){const gl=G2.gl;if(old&&old.w>=w&&old.h>=h)return old;if(old){gl.deleteTexture(old.t);gl.deleteFramebuffer(old.f);G2.mem-=old.w*old.h*4}
 const t=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,t);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,w,h,0,gl.RGBA,gl.UNSIGNED_BYTE,null);
 gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
 gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
 const f=gl.createFramebuffer();gl.bindFramebuffer(gl.FRAMEBUFFER,f);gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.COLOR_ATTACHMENT0,gl.TEXTURE_2D,t,0);G2.mem+=w*h*4;return {t,f,w,h}}
function gl2Bind(x){G2.gl.bindFramebuffer(G2.gl.FRAMEBUFFER,x?x.f:null)}
/* Textur einmal unsichtbar benutzen → liegt danach wirklich auf der GPU */
function gl2Warm(t){const gl=G2.gl,S=G2.PS;gl2Bind(G2.scr);gl.viewport(0,0,1,1);gl.disable(gl.BLEND);gl.useProgram(S.pr);gl.bindBuffer(gl.ARRAY_BUFFER,G2.bq);gl.vertexAttribPointer(0,2,gl.FLOAT,false,0,0);
 gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,t);gl.uniform1i(S.u.t,0);gl.uniform4f(S.u.uT,1,1,1,1);gl.uniform4f(S.u.uC,1,0,0,0);gl.uniform1f(S.u.uBl,0);gl.uniform1f(S.u.uBr,1);gl.uniform1f(S.u.uSa,1);
 gl.uniform4f(S.u.uR,0,0,1,1);gl.uniform2f(S.u.uV,1,1);gl.drawArrays(gl.TRIANGLE_STRIP,0,4)}
/* Sprite-Blatt hochladen (nicht vormultipliziert; Ränder sind ausgeblutet, Vormultiplikation im Shader), ohne Mipmaps */
function gl2Sprite(im){const gl=G2.gl,t=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,t);
 gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL,false);gl.pixelStorei(gl.UNPACK_COLORSPACE_CONVERSION_WEBGL,gl.NONE);gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,false);
 gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,im);
 gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
 gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
 const w=im.naturalWidth||im.width,h=im.naturalHeight||im.height;G2.mem+=w*h*4;gl2Warm(t);return {t,w,h}}
function gl2Label(im,rep){const t=glTex(im,rep),w=im.naturalWidth||im.width,h=im.naturalHeight||im.height;G2.mem+=Math.round(w*h*4*4/3);gl2Warm(t);return t}
/* Upload-Warteschlange: vorab dekodierte Bilder, ein Upload pro Frame, während des Ziehens nur Dringendes */
const UQ=[];let uqA=0,uqN=0;
function uqAdd(job){UQ.push(job);UQ.sort((a,b)=>(b.pri||0)-(a.pri||0));if(!uqA)uqA=requestAnimationFrame(uqRun)}
function uqRun(){uqA=0;if(!UQ.length||!GLX.ok)return;const busy=!!drag||!!anim||MB>0;uqN++;
 if(!busy||UQ[0].pri>=2||uqN%8===0){const j=UQ.shift();try{j.run()}catch(e){console.warn('HM upload',e)}}
 if(UQ.length)uqA=requestAnimationFrame(uqRun)}
/* Bild laden → vorab dekodieren (img.decode, außerhalb des Hauptthreads) → in die Warteschlange */
function gl2Load(src,pri,cb){const im=new Image();im.decoding='async';let done=false;
 const go=()=>{if(done)return;done=true;uqAdd({pri,run:()=>{cb(im)}})};
 im.onload=()=>{if(im.decode)im.decode().then(go,go);else go()};im.onerror=()=>{};im.src=src;return im}
/* Etiketten der Flasche k in Drehlage deg in die Etikett-Textur zeichnen (links Vorderseite, rechts Durchsicht) */
function gl2Labels(k,deg,W,HH,res,far){const g=LBK[k],T=GLX.T[k];if(!T)return null;const gl=G2.gl;
 const bw=Math.max(8,Math.round(W*res)),bh=Math.max(8,Math.round((g.band[1]-g.band[0])*HH*res));
 G2.lb=gl2Target(Math.max(bw*2,G2.lbw||0),Math.max(bh,G2.lbh||0),G2.lb);const L=G2.lb;gl2Bind(L);
 const pr=GLX.P[k];gl.useProgram(pr.pr);gl.bindBuffer(gl.ARRAY_BUFFER,G2.bt);gl.vertexAttribPointer(0,2,gl.FLOAT,false,0,0);const a=deg*Math.PI/180;
 [['tF',T.f],['tFx',T.fx],['tB',T.b],['tBx',T.bx],['tN',T.n]].forEach(([n,t],i)=>{gl.activeTexture(gl.TEXTURE0+i);gl.bindTexture(gl.TEXTURE_2D,t||GLX.blank);gl.uniform1i(pr.u[n],i)});
 gl.uniform4f(pr.u.uBand,g.band[0],g.band[1],0,0);gl.uniform2f(pr.u.uCS,Math.cos(a),Math.sin(a));gl.uniform1f(pr.u.uSoft,0);gl.disable(gl.BLEND);
 gl.viewport(0,0,bw*2,bh);gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);
 gl.viewport(0,0,bw,bh);gl.uniform4f(pr.u.uVP,0,0,bw,bh);gl.uniform1f(pr.u.uMode,0);gl.drawArrays(gl.TRIANGLES,0,3);
 if(far){gl.viewport(bw,0,bw,bh);gl.uniform4f(pr.u.uVP,bw,0,bw,bh);gl.uniform1f(pr.u.uMode,1);gl.drawArrays(gl.TRIANGLES,0,3)}
 return {bw,bh,L,ny0:g.band[0],ny1:g.band[1]}}
/* Flasche k in ihre Textur zeichnen (nur wenn sich Winkel/Ladezustand ändert) */
function gl2Paint(k,psi,rest,dd){const b=B[k],m=META[k];b.m=m;if(!b.hi&&!b.s1)return false;if(!b.lab)return false;const gl=G2.gl;
 const W=b.W,HH=b.HH,res=dd>.5?.5:dd>.12?.75:1,Wr=Math.max(8,Math.round(W*res)),Hr=Math.max(8,Math.round(HH*res));b.res=[Wr,Hr];
 const deg=((psi*180/Math.PI)%360+360)%360;
 const lab=gl2Labels(k,deg,W,HH,res,dd<.5);
 let A,Bt,ra,rb,s=0;const front=(deg<0.3||deg>359.7)&&b.hi&&(rest||!b.s1);
 const rect=(f,sh)=>[f[1]/sh.w,f[2]/sh.h,(f[1]+f[3])/sh.w,(f[2]+f[4])/sh.h];
 if(front||!b.s1){A=b.hi;ra=[0,0,1,1]}
 else{const g=grid(b),fi=deg/(SEQ.step*g),j0=Math.floor(fi),t=fi-j0,i0=(j0*g)%SEQ.n,i1=((j0+1)*g)%SEQ.n,f0=frame(b,i0),f1=frame(b,i1);
  s=MB*t+(1-MB)*ss(.42,.58,t);if(s<.004)s=0;if(s>.996){s=0;A=f1[0];ra=rect(f1,f1[0])}else{A=f0[0];ra=rect(f0,f0[0]);Bt=f1[0];rb=rect(f1,f1[0])}}
 b.fbo=gl2Target(W,HH,b.fbo);gl2Bind(b.fbo);gl.viewport(0,0,Wr,Hr);gl.disable(gl.BLEND);
 const S=G2.PB;gl.useProgram(S.pr);gl.bindBuffer(gl.ARRAY_BUFFER,G2.bt);gl.vertexAttribPointer(0,2,gl.FLOAT,false,0,0);
 gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,A.t);gl.uniform1i(S.u.tA,0);
 gl.activeTexture(gl.TEXTURE1);gl.bindTexture(gl.TEXTURE_2D,(Bt||A).t);gl.uniform1i(S.u.tB,1);
 gl.activeTexture(gl.TEXTURE2);gl.bindTexture(gl.TEXTURE_2D,lab?lab.L.t:GLX.blank);gl.uniform1i(S.u.tL,2);
 gl.uniform4fv(S.u.uRA,ra);gl.uniform4fv(S.u.uRB,rb||ra);gl.uniform1f(S.u.uS,s);gl.uniform4fv(S.u.uCrop,m.crop);gl.uniform4f(S.u.uVP,Wr,Hr,W,HH);
 if(lab){gl.uniform4f(S.u.uLB,lab.ny0,lab.ny1,lab.bw/lab.L.w,lab.bh/lab.L.h);gl.uniform1f(S.u.uLab,1);gl.uniform1f(S.u.uFar,dd<.5?1:0)}else gl.uniform1f(S.u.uLab,0);
 gl.uniform4f(S.u.uSh,W/2,b.base*DPR,b.pxcm*DPR,m.wcm);
 gl.drawArrays(gl.TRIANGLES,0,3);return true}
/* Bild aus den drei Flaschen-Texturen zusammensetzen (hinten zuerst) */
function gl2Screen(){const gl=G2.gl,c=G2.c,S=G2.PS;gl2Bind(null);gl.viewport(0,0,c.width,c.height);gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);
 gl.enable(gl.BLEND);gl.blendFunc(gl.ONE,gl.ONE_MINUS_SRC_ALPHA);gl.useProgram(S.pr);gl.bindBuffer(gl.ARRAY_BUFFER,G2.bq);gl.vertexAttribPointer(0,2,gl.FLOAT,false,0,0);
 gl.uniform2f(S.u.uV,CW,G2.h);gl.activeTexture(gl.TEXTURE0);gl.uniform1i(S.u.t,0);
 KS.slice().sort((x,y)=>B[x].q.zw-B[y].q.zw).forEach(k=>{const b=B[k],q=b.q;if(!b.drawn||!b.fbo)return;
  const [Wr,Hr]=b.res,F=b.fbo;gl.bindTexture(gl.TEXTURE_2D,F.t);gl.uniform4f(S.u.uT,Wr/F.w,Hr/F.h,1/F.w,1/F.h);gl.uniform4f(S.u.uC,1,0,0,0);
  const sig=b.blur*DPR>0.46?b.blur*DPR*KBL*(Wr/b.W):0;gl.uniform1f(S.u.uBl,sig);gl.uniform1f(S.u.uBr,b.br);gl.uniform1f(S.u.uSa,b.sa);
  gl.uniform4f(S.u.uR,q.X-q.sc*b.w/2,q.Y-q.sc*b.base-G2.top,q.sc*b.w,q.sc*b.h);gl.drawArrays(gl.TRIANGLE_STRIP,0,4)});
 gl.disable(gl.BLEND)}
let KBL=2.0;

function build(){
 host.innerHTML=`<div class="hm-bg" aria-hidden="true">${KS.map(k=>`<i class="hm-bg-${k}"></i>`).join('')}</div>
 <div class="hm-svg hm-stage" aria-hidden="true">${KS.map(k=>`<canvas class="hm-b" data-k="${k}"></canvas>`).join('')}</div>
 <div class="hm-top"><div class="hm-wm">Hopfen<b>Match</b></div><button class="hm-me" data-hm="profile" aria-label="Profil"><img alt="" crossorigin="anonymous"></button></div>
 <div class="hm-bot"><div class="hm-titles">${KS.map((k,i)=>`<div class="hm-t" id="hmt${i}"><h1>${NAME[k]}</h1><p></p></div>`).join('')}</div>
 <button class="hm-go" data-hm="enter"><span id="hmgo">Bier entdecken</span><svg viewBox="0 0 24 24" width="20" height="20"><path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
 <div class="hm-dots">${KS.map((k,i)=>`<button data-hm-dot="${i}" aria-label="${NAME[k]}"></button>`).join('')}<i id="hmpill"></i></div>
 <div class="hm-hint" id="hmhint"><span>‹</span> Wischen zum Drehen <span>›</span></div></div>`;
 stage=host.querySelector('.hm-stage');
 E.hmgo=host.querySelector('#hmgo');E.hmpill=host.querySelector('#hmpill');E.bg=KS.map(k=>host.querySelector('.hm-bg-'+k));for(let i=0;i<3;i++)E['t'+i]=host.querySelector('#hmt'+i);
 const ld=(src,cb)=>{const im=new Image();im.decoding='async';im.onload=()=>{if(src.indexOf(PFX)<0&&src.indexOf('lab_')<0)return;cb(im);for(const k of KS)B[k].lp=null;render(P,true)};im.src=src;return im};
 KS.forEach(k=>{const cv=host.querySelector('.hm-b[data-k="'+k+'"]');B[k]={el:cv,ctx:cv.getContext('2d'),lp:null}});
 if(gl2Init(stage)){GLM=true;host.classList.add('hm-glmode');KS.forEach(k=>{B[k].el.width=1;B[k].el.height=1})}else{PFX='car_';META=M1}
 loadAll(ld)}
let LD=null;
function loadAll(ld){LD=ld||LD;ld=LD;
 const first=KS.indexOf(opts.kat||'bier'),ord=[0,1,2].map(d=>KS[(first+d)%3]),px=PFX;
 if(GLM&&GLX.ok)return loadGL(ord);
 /* Etikett-Texturen (Retina, mit Mipmaps): Vorder-/Rückenetikett + Hilfskanal (Goldmaske, Tropfen-Normalen) */
 const lab=(k,cb)=>{if(!GLX.ok){cb&&cb();return}const n={f:'f',fx:'f_x',b:'b',bx:'b_x'};if(k==='bier')n.n='n';if(k==='wein')delete n.bx;
  const got={};let c=Object.keys(n).length;for(const q in n){const im=new Image();im.decoding='async';
   im.onload=()=>{got[q]=im;if(--c===0&&GLX.ok){const T={};for(const z in got)T[z]=glTex(got[z],z==='n');GLX.T[k]=T;B[k].lab=1;B[k].lp=null;render(P,true);cb&&cb()}};
   im.onerror=()=>{if(--c===0&&cb)cb()};im.src='img/lab_'+k+'_'+n[q]+'.webp'}};
 // gestaffelt: Frontansicht + Etikett der aktiven Flasche → 20°-Raster aller Flaschen (enthält alle Ruhelagen) → übrige Frontansichten/Etiketten → 10°-Zwischenwinkel → 5°-Zwischenwinkel
 ld('img/'+px+ord[0]+'.webp',im=>B[ord[0]].hi=im);lab(ord[0]);
 const seqLd=(n,cb)=>{let c=ord.length;ord.forEach(k=>ld('img/'+px+k+'_'+n+'.webp',im=>{B[k][n]=im;if(--c===0&&cb)cb()}))};
 setTimeout(()=>{seqLd('s1',()=>{ord.slice(1).forEach(k=>{ld('img/'+px+k+'.webp',im=>B[k].hi=im);lab(k)});seqLd('s2',()=>{seqLd('s3');seqLd('s4')})})},60);
}
/* WebGL-Weg: Bilder vorab dekodieren, einzeln in Leerlauf-Frames hochladen; Zwischenwinkel-Blätter (s2–s4, nur in Bewegung sichtbar) in 0,7-facher Auflösung (car3_) */
function loadGL(ord){const upd=k=>{B[k].lp=null;render(P,true)};
 const spr=(k,n,pri,cb)=>{const s3=n!=='hi'&&n!=='s1',src='img/'+(s3?'car3_':'car2_')+k+(n==='hi'?'':'_'+n)+'.webp';
  gl2Load(src,pri,im=>{if(!GLX.ok)return;const o=gl2Sprite(im);if(n!=='hi'){o.fw=s3?META[k].fw2:META[k].fw;o.fh=s3?META[k].fh2:META[k].fh}B[k][n]=o;upd(k);cb&&cb()})};
 const lab=(k,pri)=>{const n={f:'f',fx:'f_x',b:'b',bx:'b_x'};if(k==='bier')n.n='n';if(k==='wein')delete n.bx;const T={};let c=Object.keys(n).length;
  for(const q in n)gl2Load('img/lab_'+k+'_'+n[q]+'.webp',pri,im=>{if(!GLX.ok)return;T[q]=gl2Label(im,q==='n');if(--c===0){GLX.T[k]=T;B[k].lab=1;upd(k)}})};
 spr(ord[0],'hi',4);lab(ord[0],4);
 const seq=(n,pri,cb)=>{let c=3;ord.forEach(k=>spr(k,n,pri,()=>{if(--c===0&&cb)cb()}))};
 setTimeout(()=>{seq('s1',3,()=>{ord.slice(1).forEach(k=>{spr(k,'hi',2);lab(k,2)});seq('s2',1,()=>{seq('s3',0);seq('s4',0)})})},60)}
/* WebGL verloren: auf die alten Sprites mit eingebackenen Etiketten umschalten */
function glLost(){GLM=false;if(host)host.classList.remove('hm-glmode');if(G2.c)G2.c.style.display='none';UQ.length=0;PFX='car_';META=M1;KS.forEach(k=>{const b=B[k];if(!b)return;['hi','s1','s2','s3','s4','lab'].forEach(n=>delete b[n]);b.lp=null});resize();if(LD)loadAll()}
const E={};
/* Layout aus der Bildschirmgröße: Brennweite so, dass die größte Flasche vorne zwischen Kopfzeile und Titel passt */
function resize(){if(!host)return;const r=host.getBoundingClientRect();if(!r.width)return;
 DPR=Math.min(window.devicePixelRatio||1,3);CW=r.width;CHh=r.height;
 const top=host.querySelector('.hm-top').getBoundingClientRect().bottom-r.top+6,bot=host.querySelector('.hm-titles').getBoundingClientRect().top-r.top-16;
 const maxH=Math.max(...KS.map(k=>META[k].hcm));let f=(bot-top)*(D-RT)/maxH;
 const wmax=Math.max(...KS.map(k=>META[k].wcm/2));f=Math.min(f,(CW/2-6)*(D+RT/2)/(RT*Math.sin(2.0944)+wmax));
 const y0=bot-f*HC/(D-RT);L={f,y0,base:bot};
 KS.forEach(k=>{const b=B[k],ch=f/(D-RT)*FCM,cw=ch*FWCM/FCM;// CSS-Größe des Bildausschnitts vorne
  const w=Math.ceil(cw),h=Math.ceil(ch),base=h*BASE;b.w=w;b.h=h;b.base=base;b.pxcm=ch/FCM;
  b.el.style.width=w+'px';b.el.style.height=h+'px';b.el.style.marginLeft=(-w/2)+'px';b.el.style.marginTop=(-base)+'px';b.el.style.transformOrigin='50% '+base+'px';
  b.W=Math.round(w*DPR);b.HH=Math.round(h*DPR);if(!GLM){b.el.width=b.W;b.el.height=b.HH}b.lp=null});
 if(GLM){/* Canvas nur über dem Band, in dem Flaschen stehen können (weniger Speicher/Füllrate) */let t0=1e9,t1=-1e9;
  for(let i=0;i<36;i++)KS.forEach(k=>{const q=pose(k,i/12),b=B[k];t0=Math.min(t0,q.Y-q.sc*b.base);t1=Math.max(t1,q.Y+q.sc*(b.h-b.base))});
  t0=Math.max(0,Math.floor(t0)-2);t1=Math.min(CHh,Math.ceil(t1)+2);G2.top=t0;G2.h=t1-t0;const c=G2.c;c.style.top=t0+'px';c.style.height=G2.h+'px';
  const pw=Math.round(CW*DPR),ph=Math.round(G2.h*DPR);if(c.width!==pw||c.height!==ph){c.width=pw;c.height=ph}}
 render(P,true)}
let OF=null;const PY=[],PU=[],PU2=[],PS=[];
/* Flasche k in Drehlage psi (Bogenmaß) zeichnen: Sprite-Frame (15°-Schritte, weich überblendet) bzw. scharfe Frontansicht in Ruhe */
function frame(b,n){const sh=b[SHEET[n%4]];if(!sh)return null;const m=n>>2,fw=sh.fw||b.m.fw,fh=sh.fh||b.m.fh;return [sh,(m%SEQ.cols)*(fw+SEQ.gut),Math.floor(m/SEQ.cols)*(fh+SEQ.gut),fw,fh]}
/* feinstes vollständig geladenes Raster (in 5°-Schritten): 1 = 5°, 2 = 10°, 4 = 20° */
const grid=b=>b.s3&&b.s4&&b.s2?1:b.s2?2:4;
function paint(k,psi,blur,rest,dd){const b=B[k],m=META[k];b.m=m;if(!b.hi&&!b.s1)return;const gl=GLX.ok&&PFX==='car2_';if(gl&&!b.lab)return;
 const W=b.el.width,HH=b.el.height,soft=blur*DPR>0.46;
 if(soft){if(!OF)OF=document.createElement('canvas');if(OF.width<W||OF.height<HH){OF.width=Math.max(W,OF.width);OF.height=Math.max(HH,OF.height)}}
 const x=soft?OF.getContext('2d'):b.ctx;x.setTransform(1,0,0,1,0,0);x.clearRect(0,0,W,HH);x.imageSmoothingEnabled=true;x.imageSmoothingQuality='high';
 const cr=m.crop,dx=cr[0]*W,dy=cr[1]*HH,dw=(cr[2]-cr[0])*W,dh=(cr[3]-cr[1])*HH;
 const deg=((psi*180/Math.PI)%360+360)%360,front=(deg<0.3||deg>359.7)&&b.hi&&(rest||!b.s1);
 if(front)x.drawImage(b.hi,dx,dy,dw,dh);
 else if(b.s1){const g=grid(b),fi=deg/(SEQ.step*g),j0=Math.floor(fi),t=fi-j0,i0=(j0*g)%SEQ.n,i1=((j0+1)*g)%SEQ.n,f0=frame(b,i0),f1=frame(b,i1);
  /* in Bewegung: stetige Überblendung zwischen den Nachbarwinkeln (kein Rucken); steht der Finger: scharfer Einzelwinkel */
  const s=MB*t+(1-MB)*ss(.42,.58,t);
  if(s<.004||s>.996){const f=s>.996?f1:f0;x.drawImage(f[0],f[1],f[2],f[3],f[4],dx,dy,dw,dh)}
  else{x.globalCompositeOperation='lighter';x.globalAlpha=1-s;x.drawImage(f0[0],f0[1],f0[2],f0[3],f0[4],dx,dy,dw,dh);x.globalAlpha=s;x.drawImage(f1[0],f1[1],f1[2],f1[3],f1[4],dx,dy,dw,dh);x.globalAlpha=1;x.globalCompositeOperation='source-over'}}
 else x.drawImage(b.hi,dx,dy,dw,dh);
 /* Live-Etikett: gleicher Drehwinkel wie das Sprite, eigene Geometrie → in jeder Zwischenstellung scharf, kein Doppelbild.
    Hintere Flaschen günstiger (geringere Auflösung, ohne Durchsicht) */
 if(gl){const r=glDraw(k,deg,W,HH,dd>.5?.5:dd>.12?.75:1,dd<.5);
  if(r){const y0=r.ny0*HH,h=(r.ny1-r.ny0)*HH;if(r.far){x.globalCompositeOperation='multiply';x.drawImage(r.c,r.bw,0,r.bw,r.bh,0,y0,W,h)}
   x.globalCompositeOperation='source-over';x.drawImage(r.c,0,0,r.bw,r.bh,0,y0,W,h)}}
 /* weicher Kontaktschatten unter der Flasche, hinter das Bild gelegt (keine Fläche, kein Rand) */
 const cx=W/2,sy=b.base*DPR,pc=b.pxcm*DPR;x.save();x.globalCompositeOperation='destination-over';
 const ell=(r,sy_,dy,stops)=>{x.save();x.translate(cx,sy+dy);x.scale(1,sy_);const g=x.createRadialGradient(0,0,0,0,0,r);stops.forEach(([o,a])=>g.addColorStop(o,'rgba(36,17,6,'+a+')'));x.fillStyle=g;x.beginPath();x.arc(0,0,r,0,7);x.fill();x.restore()};
 ell(m.wcm/2*.98*pc,.075,-.05*pc,[[0,.5],[.7,.32],[1,0]]);/* Kontaktlinie direkt am Boden */
 ell(m.wcm/2*1.5*pc,.16,.05*pc,[[0,.22],[.5,.09],[1,0]]);/* weicher Schlagschatten */
 x.restore();
 if(soft){/* Tiefenunschärfe: Bildpyramide mit Zeltfilter (je Stufe 4 versetzte Abtastungen, additiv gemittelt); stufenlos durch Überblenden zweier benachbarter Stufen (kein Springen) */
  const lf=Math.max(0,Math.min(4,Math.log2(blur*DPR/0.9)+1)),L0=Math.floor(lf),L1=Math.min(4,L0+1),fr=lf-L0;let src=OF,w=W,h=HH;
  for(let n=0;n<L1;n++){const c=PY[n]||(PY[n]=document.createElement('canvas')),nw=Math.max(2,Math.ceil(w/2)),nh=Math.max(2,Math.ceil(h/2));
   if(c.width<nw+2||c.height<nh+2){c.width=Math.max(nw+2,c.width);c.height=Math.max(nh+2,c.height)}const g=c.getContext('2d');g.clearRect(0,0,c.width,c.height);
   g.globalCompositeOperation='lighter';g.globalAlpha=.25;for(const [ox,oy] of [[-.5,-.5],[.5,-.5],[-.5,.5],[.5,.5]])g.drawImage(src,0,0,w,h,ox,oy,nw,nh);g.globalAlpha=1;g.globalCompositeOperation='source-over';
   src=c;w=nw;h=nh;PS[n]=[w,h]}
  const up=(L,U)=>{if(L===0)return [OF,W,HH];let src=PY[L-1],[w,h]=PS[L-1];
   for(let n=L-1;n>0;n--){const c=U[n]||(U[n]=document.createElement('canvas')),[nw,nh]=PS[n-1];if(c.width<nw+2||c.height<nh+2){c.width=Math.max(nw+2,c.width);c.height=Math.max(nh+2,c.height)}
    const g=c.getContext('2d');g.clearRect(0,0,c.width,c.height);g.drawImage(src,0,0,w,h,0,0,nw,nh);src=c;w=nw;h=nh}return [src,w,h]};
  const y=b.ctx;y.setTransform(1,0,0,1,0,0);y.clearRect(0,0,W,HH);y.imageSmoothingEnabled=true;y.imageSmoothingQuality='high';
  const A=up(L0,PU);if(fr<.01||L0===L1){y.drawImage(A[0],0,0,A[1],A[2],0,0,W,HH)}
  else{const Bq=up(L1,PU2);y.globalCompositeOperation='lighter';y.globalAlpha=1-fr;y.drawImage(A[0],0,0,A[1],A[2],0,0,W,HH);y.globalAlpha=fr;y.drawImage(Bq[0],0,0,Bq[1],Bq[2],0,0,W,HH);y.globalAlpha=1;y.globalCompositeOperation='source-over'}}
}
/* Stellung im Kreis für Karussell-Position p */
function pose(k,p){const i=KS.indexOf(k),a=(i-p)*2.0944;const xw=RT*Math.sin(a),zw=RT*Math.cos(a),dz=D-zw,sc=(D-RT)/dz;
 return {a,xw,zw,sc,X:CW/2+L.f*xw/dz,Y:L.y0+L.f*HC/dz,psi:a-Math.atan2(xw,dz),dd:Math.max(0,(1-Math.cos(a))/1.5)}}
let lastP=null,MB=0,MBfix=null,mbT=0,mbA=0,mbLast=0;
function moved(){if(MBfix!=null)return;MB=1;mbLast=performance.now();if(!mbT)mbT=setTimeout(idle,100)}
function idle(){mbT=0;const w=performance.now()-mbLast;if(w<90){mbT=setTimeout(idle,95-w);return}
 const t0=performance.now(),m0=MB;cancelAnimationFrame(mbA);const st=now=>{if(performance.now()-mbLast<90){mbA=0;return}MB=Math.max(0,m0*(1-(now-t0)/150));INRAF=1;try{render(P,true)}finally{INRAF=0}if(MB>0)mbA=requestAnimationFrame(st);else mbA=0};mbA=requestAnimationFrame(st)}
function render(p,force){if(!host||!L)return;if(p===lastP&&!force)return;if(lastP!==null&&p!==lastP)moved();lastP=p;
 const {i,j,t}=weights(p),e=t*t*(3-2*t);
 KS.forEach(k=>{const b=B[k],q=pose(k,p);
  const dd=Math.min(1,q.dd),br=1-.42*dd,bl=1.25*Math.pow(dd,1.6);
  if(GLM)return;
  b.el.style.transform=`translate3d(${q.X.toFixed(2)}px,${q.Y.toFixed(2)}px,0) scale(${q.sc.toFixed(4)})`;
  b.el.style.zIndex=String(100+Math.round(q.zw*10));
  b.el.style.filter=dd>.002?`brightness(${br.toFixed(3)}) saturate(${(1-.18*dd).toFixed(3)})`:'none';
  b.el.dataset.blur=bl.toFixed(2);
  const ps=Math.round(q.a*600)/600,rs=!anim&&!drag,key=ps+'|'+Math.round(bl*20)+'|'+rs+'|'+!!b.hi+!!b.s1+!!b.s2+!!(b.s3&&b.s4)+!!b.lab+PFX+'|'+Math.round(MB*40);if(b.lp!==key||force){b.lp=key;paint(k,ps,bl/q.sc,rs,dd)}
  b.el.classList.toggle('front',Math.cos(q.a)>.5)});
 if(GLM&&GLX.ok){G2.p=p;G2.f=G2.f||!!force;if(INRAF)renderGL();else if(!G2.ra)G2.ra=requestAnimationFrame(()=>{G2.ra=0;renderGL()})}
 const w=[0,0,0];w[i]=1-e;w[j]=e;E.bg.forEach((el,n)=>sty(el,'opacity',w[n].toFixed(3)));
 uiUpd(p,i,j,t,e,CH[KS[i]],CH[KS[j]])}
/* Stilwerte nur bei Änderung setzen (keine unnötige Stilberechnung pro Frame) */
const SV=new WeakMap();function sty(el,p,v){let o=SV.get(el);if(!o){o={};SV.set(el,o)}if(o[p]===v)return;o[p]=v;if(p[0]==='-')el.style.setProperty(p,v);else el.style[p]=v}
/* WebGL: Flaschen-Texturen (nur bei Änderung) + Bild – immer im Animations-Frame, höchstens einmal pro Frame */
let INRAF=0;
function renderGL(){if(!GLX.ok||!L)return;const p=G2.p,force=G2.f;G2.f=false;
 KS.forEach(k=>{const b=B[k],q=pose(k,p);const dd=Math.min(1,q.dd),br=1-.42*dd,bl=1.25*Math.pow(dd,1.6);
b.q=q;b.br=dd>.002?br:1;b.sa=dd>.002?1-.18*dd:1;b.blur=bl/q.sc;const res=dd>.5?2:dd>.12?1:0;
   const key=Math.round(q.a*600)/600+'|'+(!anim&&!drag)+'|'+!!b.hi+!!b.s1+!!b.s2+!!(b.s3&&b.s4)+!!b.lab+'|'+Math.round(MB*40)+'|'+res;
   if(b.lp!==key||force){b.lp=key;b.drawn=gl2Paint(k,Math.round(q.a*600)/600,!anim&&!drag,dd)}});
 gl2Screen()}
function uiUpd(p,i,j,t,e,ca,cb){
 const m=(u,v)=>mixc(u,v,e);
 sty(host,'--ui',m(ca.ui,cb.ui));sty(host,'--sub',m(ca.sub,cb.sub));sty(host,'--btn',m(ca.btn,cb.btn));sty(host,'--btnink',m(ca.btnInk,cb.btnInk));
 for(let k=0;k<3;k++){const el=E['t'+k];let off=0;if(k===i)off=-e;else if(k===j)off=1-e;else off=2;
  const op=k===i?1-ss(0,.5,t):k===j?ss(.5,1,t):0;
  sty(el,'opacity',op.toFixed(3));sty(el,'transform',`translate3d(${(off*60).toFixed(1)}px,0,0)`)}
 const near=Math.round(mod(p,3))%3;
 if(near!==lastIdx){lastIdx=near;E.hmgo.textContent=NAME[KS[near]]+' entdecken';host.dataset.kat=KS[near];host.querySelectorAll('[data-hm-dot]').forEach((x,q)=>x.classList.toggle('on',q===near))}
 const q=mod(p,3);let pill=q,po=1;
 if(q>2){pill=q<2.5?q:q-3;po=Math.abs(q-2.5)*2}
 sty(E.hmpill,'transform',`translate3d(${(pill*22).toFixed(1)}px,0,0)`);sty(E.hmpill,'opacity',po.toFixed(3));
}
/* Feder zum nächsten Ziel */
let target=0;
function springTo(tg){target=tg;cancelAnimationFrame(anim);
 if(RM()){fadeSwap(()=>{P=tg;render(P);settle()});return}
 let last=performance.now();
 const step=now=>{INRAF=1;try{step0(now)}finally{INRAF=0}};const step0=now=>{let dt=Math.min(0.25,(now-last)/1000);last=now;const k=150,c=2*Math.sqrt(k)*0.78;
  while(dt>0){const h=Math.min(dt,1/120);V+=(-k*(P-target)-c*V)*h;P+=V*h;dt-=h}
  if(Math.abs(P-target)<0.0006&&Math.abs(V)<0.003){P=target;V=0;anim=0;render(P);settle();return}
  render(P);anim=requestAnimationFrame(step)};
 anim=requestAnimationFrame(step)}
function settle(){P=mod(Math.round(P),3);target=P;render(P,true);if(opts.onChange)opts.onChange(KS[P])}
function fadeSwap(fn){stage.style.transition='opacity .18s';stage.style.opacity='0';host.classList.add('rmfade');setTimeout(()=>{fn();stage.style.opacity='1';host.classList.remove('rmfade')},180)}
function go(dirn){springTo(Math.round(P)+dirn)}
/* Welche Flasche liegt unter dem Finger? (vorderste mit Treffer im Umriss-Rechteck) */
function hitBottle(cx,cy){let best=null,bz=-1e9;const hr=host.getBoundingClientRect();KS.forEach(k=>{const q=pose(k,P),m=META[k],b=B[k];const r=GLM?{left:hr.left+q.X-q.sc*b.w/2,top:hr.top+q.Y-q.sc*b.base,width:q.sc*b.w,height:q.sc*b.h}:b.el.getBoundingClientRect();
 const sc=r.height/FCM,bw=m.wcm*sc,l0=r.left+(r.width-bw)/2,t0=r.top+(0.318-m.hcm/100)/0.33*r.height,b0=r.top+BASE*r.height;if(cx<l0||cx>l0+bw||cy<t0||cy>b0)return;if(q.zw>bz){bz=q.zw;best=k}});return best}
function bind(){
 const sw=host.clientWidth||390;
 host.addEventListener('pointerdown',e=>{if(!vis||e.button>0)return;if(e.target.closest('[data-hm],[data-hm-dot]'))return;
  cancelAnimationFrame(anim);anim=0;drag={hit:hitBottle(e.clientX,e.clientY),x:e.clientX,y:e.clientY,p0:P,t:performance.now(),lx:e.clientX,lt:performance.now(),vx:0,moved:false,id:e.pointerId,w:host.clientWidth||sw};
  try{host.setPointerCapture(e.pointerId)}catch(x){}});
 host.addEventListener('pointermove',e=>{if(!drag||e.pointerId!==drag.id)return;const dx=e.clientX-drag.x,dy=e.clientY-drag.y;
  if(!drag.moved&&Math.hypot(dx,dy)>8)drag.moved=true;
  const now=performance.now(),dt=Math.max(1,now-drag.lt);drag.vx=0.8*((e.clientX-drag.lx)/dt)+0.2*drag.vx;drag.lx=e.clientX;drag.lt=now;
  if(drag.moved&&!RM()){P=drag.p0-dx/(drag.w*0.62);V=0;render(P);if(!hinted){hinted=true;host.classList.add('swiped')}}});
 const up=e=>{if(!drag||e.pointerId!==drag.id)return;const d=drag;drag=null;const dx=e.clientX-d.x;
  if(!d.moved){const cur=KS[mod(Math.round(P),3)];
   if(d.hit===cur)enter();else if(d.hit){const n=KS.indexOf(d.hit),c=KS.indexOf(cur);let s=n-c;if(s===2)s=-1;if(s===-2)s=1;springTo(Math.round(P)+s)}else springTo(Math.round(P));return}
  if(RM()){if(Math.abs(dx)>40){hinted=true;host.classList.add('swiped');springTo(Math.round(d.p0)+(dx<0?1:-1))}return}
  const vel=-d.vx*1000/(d.w*0.62); // Positionen pro Sekunde
  let tg=Math.round(P+vel*0.2);const base=Math.round(d.p0);tg=Math.max(base-2,Math.min(base+2,tg));
  V=Math.max(-9,Math.min(9,vel));springTo(tg)};
 host.addEventListener('pointerup',up);host.addEventListener('pointercancel',e=>{if(drag){drag=null;springTo(Math.round(P))}});
 host.addEventListener('click',e=>{const b=e.target.closest('[data-hm]'),dt=e.target.closest('[data-hm-dot]');
  if(dt){const n=+dt.dataset.hmDot,cur=mod(Math.round(P),3);let d=n-cur;if(d===2)d=-1;if(d===-2)d=1;springTo(Math.round(P)+d);return}
  if(!b)return;if(b.dataset.hm==='enter')enter();if(b.dataset.hm==='profile'&&opts.onProfile)opts.onProfile()});
 host.addEventListener('keydown',e=>{if(!vis)return;if(e.key==='ArrowRight')go(1);if(e.key==='ArrowLeft')go(-1);if(e.key==='Enter'&&!e.target.closest('button'))enter()});
}
function enter(){if(!vis)return;cancelAnimationFrame(anim);anim=0;const k=KS[mod(Math.round(P),3)];P=mod(Math.round(P),3);render(P,true);
 host.classList.add('leaving');vis=false;if(opts.onEnter)opts.onEnter(k);
 setTimeout(()=>{host.classList.remove('on','leaving');host.setAttribute('aria-hidden','true')},RM()?200:560)}
window.HMHome={
 mount(el,o){host=el;opts=o||{};build();bind();P=Math.max(0,KS.indexOf(o.kat||'bier'));addEventListener('resize',()=>{if(vis)resize()});},
 show(k,info){if(!host)return;if(k&&KS.includes(k)){P=KS.indexOf(k)}
  if(info){(info.counts||[]).forEach((c,i)=>{const p=host.querySelector('#hmt'+i+' p');if(p)p.textContent=c});const im=host.querySelector('.hm-me img');if(im&&info.img)im.src=info.img}
  host.classList.remove('leaving');host.classList.add('on');host.removeAttribute('aria-hidden');vis=true;resize()},
 hide(){if(!host)return;cancelAnimationFrame(anim);anim=0;drag=null;vis=false;host.classList.remove('on','leaving');host.setAttribute('aria-hidden','true')},
 visible:()=>vis,
 state:()=>({p:P,v:V,kat:KS[mod(Math.round(P),3)],drag:!!drag,anim:!!anim}),
 render:p=>{render(p==null?P:p,true)},
 setP(p,mb){cancelAnimationFrame(anim);anim=0;MBfix=mb==null?null:mb;if(mb!=null)MB=mb;P=p;render(P,true);
  /* Test-Hilfe: Bild ein zweites Mal zeichnen (WebKit-Screenshots lesen sonst den getauschten Puffer) */if(GLM&&!G2.rr){G2.rr=1;requestAnimationFrame(()=>requestAnimationFrame(()=>{G2.rr=0;if(GLX.ok)renderGL()}))}},
 loaded:()=>KS.map(k=>[k,grid(B[k]),!!B[k].lab]),
 gl:()=>GLX.ok&&PFX==='car2_',
 dbg:()=>({p:G2.p,ra:G2.ra,q:KS.map(k=>B[k].q&&[+B[k].q.X.toFixed(1),+B[k].q.zw.toFixed(2),B[k].drawn])}),
 rect:k=>{const q=pose(k,P),b=B[k],hr=host.getBoundingClientRect();return {left:hr.left+q.X-q.sc*b.w/2,top:hr.top+q.Y-q.sc*b.base,width:q.sc*b.w,height:q.sc*b.h}},
 depth:k=>{const b=B[k];return GLM?{z:b.q?b.q.zw:0,br:b.br,blur:b.blur}:null},
 mem:()=>({gpuMB:+((G2.mem||0)/1048576).toFixed(1),canvasMB:G2.c?+(G2.c.width*G2.c.height*4/1048576).toFixed(1):0,queue:UQ.length,dpr:DPR}),
 kbl:v=>{if(v!=null){KBL=v;KS.forEach(k=>B[k].lp=null);render(P,true)}return KBL},
 pose:k=>L?pose(k,P):null,
 go,enter,KS};
})();
