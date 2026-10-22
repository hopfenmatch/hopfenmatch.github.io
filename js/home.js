/* HopfenMatch 1.9 – Startseite: 3D-Karussell aus gerenderten Flaschen (Blender Cycles, 72 Drehwinkel à 5° je Flasche, Retina-Auflösung, bewegungsabhängig überblendet).
   Ab 1.9 sind die Glas-Sprites ohne Etiketten gerendert; die Etiketten werden live per WebGL exakt im Drehwinkel aufgezeichnet (immer scharf). Ohne WebGL: alte Sprites mit eingebackenen Etiketten. Drei fotorealistische Flaschen stehen auf einer unsichtbaren Drehplatte;
   Wischen dreht den ganzen Kreis (folgt dem Finger, Trägheit, Feder, endlos). Studiolicht bleibt stehen. */
'use strict';
(function(){
const KS=['bier','wein','whisky'],NAME={bier:'Bier',wein:'Wein',whisky:'Whisky'};
const RM=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
const ss=(a,b,x)=>{const t=Math.max(0,Math.min(1,(x-a)/(b-a)));return t*t*(3-2*t)};
/* Flaschen-Freisteller (Pixel im jeweiligen Bild) + reale Höhe in cm */
const M2={"bier":{"hcm":25.6,"wcm":7.0,"crop":[0.20904,0.17556,0.79096,1.0],"fw":206,"fh":742},"wein":{"hcm":30.0,"wcm":7.6,"crop":[0.19209,0.04333,0.80791,1.0],"fw":218,"fh":861},"whisky":{"hcm":25.8,"wcm":9.6,"crop":[0.07062,0.17,0.92938,0.99111],"fw":304,"fh":739}},M1={"bier":{"hcm":25.6,"wcm":7.0,"crop":[0.20904,0.17556,0.79096,1.0],"fw":206,"fh":742},"wein":{"hcm":30.0,"wcm":7.6,"crop":[0.18927,0.04333,0.81073,1.0],"fw":220,"fh":861},"whisky":{"hcm":25.8,"wcm":9.6,"crop":[0.07062,0.17,0.92938,0.99111],"fw":304,"fh":739}};let META=M2,PFX='car2_';const FCM=33,FWCM=13,BASE=0.318/0.33,SEQ={n:72,step:5,cols:6,gut:2};
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
let host,stage,P=0,V=0,anim=0,drag=null,opts={},vis=false,lastIdx=-1,hinted=false,DPR=2,CW=390,CHh=844,L=null;
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
 if(!glInit()){PFX='car_';META=M1}
 loadAll(ld)}
let LD=null;
function loadAll(ld){LD=ld||LD;ld=LD;
 const first=KS.indexOf(opts.kat||'bier'),ord=[0,1,2].map(d=>KS[(first+d)%3]),px=PFX;
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
/* WebGL verloren: auf die alten Sprites mit eingebackenen Etiketten umschalten */
function glLost(){PFX='car_';META=M1;KS.forEach(k=>{const b=B[k];if(!b)return;['hi','s1','s2','s3','s4','lab'].forEach(n=>delete b[n]);b.lp=null});if(LD)loadAll()}
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
  b.el.width=Math.round(w*DPR);b.el.height=Math.round(h*DPR);b.lp=null});
 render(P,true)}
let OF=null;const PY=[],PU=[],PU2=[],PS=[];
/* Flasche k in Drehlage psi (Bogenmaß) zeichnen: Sprite-Frame (15°-Schritte, weich überblendet) bzw. scharfe Frontansicht in Ruhe */
function frame(b,n){const sh=b[SHEET[n%4]];if(!sh)return null;const m=n>>2,fw=b.m.fw,fh=b.m.fh;return [sh,(m%SEQ.cols)*(fw+SEQ.gut),Math.floor(m/SEQ.cols)*(fh+SEQ.gut),fw,fh]}
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
 const t0=performance.now(),m0=MB;cancelAnimationFrame(mbA);const st=now=>{if(performance.now()-mbLast<90){mbA=0;return}MB=Math.max(0,m0*(1-(now-t0)/150));render(P,true);if(MB>0)mbA=requestAnimationFrame(st);else mbA=0};mbA=requestAnimationFrame(st)}
function render(p,force){if(!host||!L)return;if(p===lastP&&!force)return;if(lastP!==null&&p!==lastP)moved();lastP=p;
 const {i,j,t}=weights(p),e=t*t*(3-2*t);
 KS.forEach(k=>{const b=B[k],q=pose(k,p);
  const dd=Math.min(1,q.dd),br=1-.42*dd,bl=1.25*Math.pow(dd,1.6);
  b.el.style.transform=`translate3d(${q.X.toFixed(2)}px,${q.Y.toFixed(2)}px,0) scale(${q.sc.toFixed(4)})`;
  b.el.style.zIndex=String(100+Math.round(q.zw*10));
  b.el.style.filter=dd>.002?`brightness(${br.toFixed(3)}) saturate(${(1-.18*dd).toFixed(3)})`:'none';
  b.el.dataset.blur=bl.toFixed(2);
  const ps=Math.round(q.a*600)/600,rs=!anim&&!drag,key=ps+'|'+Math.round(bl*20)+'|'+rs+'|'+!!b.hi+!!b.s1+!!b.s2+!!(b.s3&&b.s4)+!!b.lab+PFX+'|'+Math.round(MB*40);if(b.lp!==key||force){b.lp=key;paint(k,ps,bl/q.sc,rs,dd)}
  b.el.classList.toggle('front',Math.cos(q.a)>.5)});
 const w=[0,0,0];w[i]=1-e;w[j]=e;E.bg.forEach((el,n)=>el.style.opacity=w[n].toFixed(3));
 uiUpd(p,i,j,t,e,CH[KS[i]],CH[KS[j]])}
function uiUpd(p,i,j,t,e,ca,cb){
 const m=(u,v)=>mixc(u,v,e);
 host.style.setProperty('--ui',m(ca.ui,cb.ui));host.style.setProperty('--sub',m(ca.sub,cb.sub));host.style.setProperty('--btn',m(ca.btn,cb.btn));host.style.setProperty('--btnink',m(ca.btnInk,cb.btnInk));
 for(let k=0;k<3;k++){const el=E['t'+k];let off=0;if(k===i)off=-e;else if(k===j)off=1-e;else off=2;
  const op=k===i?1-ss(0,.5,t):k===j?ss(.5,1,t):0;
  el.style.opacity=op.toFixed(3);el.style.transform=`translate3d(${(off*60).toFixed(1)}px,0,0)`}
 const near=Math.round(mod(p,3))%3;
 if(near!==lastIdx){lastIdx=near;E.hmgo.textContent=NAME[KS[near]]+' entdecken';host.dataset.kat=KS[near];host.querySelectorAll('[data-hm-dot]').forEach((x,q)=>x.classList.toggle('on',q===near))}
 const q=mod(p,3);let pill=q,po=1;
 if(q>2){pill=q<2.5?q:q-3;po=Math.abs(q-2.5)*2}
 E.hmpill.style.transform=`translate3d(${(pill*22).toFixed(1)}px,0,0)`;E.hmpill.style.opacity=po.toFixed(3);
}
/* Feder zum nächsten Ziel */
let target=0;
function springTo(tg){target=tg;cancelAnimationFrame(anim);
 if(RM()){fadeSwap(()=>{P=tg;render(P);settle()});return}
 let last=performance.now();
 const step=now=>{let dt=Math.min(0.25,(now-last)/1000);last=now;const k=150,c=2*Math.sqrt(k)*0.78;
  while(dt>0){const h=Math.min(dt,1/120);V+=(-k*(P-target)-c*V)*h;P+=V*h;dt-=h}
  if(Math.abs(P-target)<0.0006&&Math.abs(V)<0.003){P=target;V=0;anim=0;render(P);settle();return}
  render(P);anim=requestAnimationFrame(step)};
 anim=requestAnimationFrame(step)}
function settle(){P=mod(Math.round(P),3);target=P;render(P,true);if(opts.onChange)opts.onChange(KS[P])}
function fadeSwap(fn){stage.style.transition='opacity .18s';stage.style.opacity='0';host.classList.add('rmfade');setTimeout(()=>{fn();stage.style.opacity='1';host.classList.remove('rmfade')},180)}
function go(dirn){springTo(Math.round(P)+dirn)}
/* Welche Flasche liegt unter dem Finger? (vorderste mit Treffer im Umriss-Rechteck) */
function hitBottle(cx,cy){let best=null,bz=-1e9;KS.forEach(k=>{const r=B[k].el.getBoundingClientRect(),q=pose(k,P),m=META[k];
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
 setP(p,mb){cancelAnimationFrame(anim);anim=0;MBfix=mb==null?null:mb;if(mb!=null)MB=mb;P=p;render(P,true)},
 loaded:()=>KS.map(k=>[k,grid(B[k]),!!B[k].lab]),
 gl:()=>GLX.ok&&PFX==='car2_',
 pose:k=>L?pose(k,P):null,
 go,enter,KS};
})();
