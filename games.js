// smartmultiMessenger ゲーム機能 (index.html から読み込まれます)
var G={opp:'',stop:null,dir:null,pf:null,custom:[]};
try{G.custom=JSON.parse(localStorage.cg||'[]')}catch(e){}
var games=[['👾 インベーダー',invaders,1],['🦝 たぬきぽんぽん',tanuki,0],['🐍 ヘビ',snake,1],['🎨 お題ぺいんと',paint,0]];
function rnd(n){return Math.floor(Math.random()*n)}
function sco(n){$('sc').textContent='スコア: '+n}
function cv(s){var c=document.createElement('canvas');c.width=320;c.height=400;c.style.cssText='width:100%;max-width:320px;background:#111;border:1px solid #888;touch-action:none';s.appendChild(c);return c}
function gSend(d){if(G.opp)snd({type:'relay',to:G.opp,data:d})}
function gRelay(f,d){
 if(d.g=='score')$('os').textContent=nameOf(f)+' のスコア: '+d.s;
 else if(d.g=='pl'&&G.pf)G.pf(d);
 else if(d.g=='cu'){var fr=$('cf');if(fr)fr.contentWindow.postMessage({smm:'recv',from:f,data:d.d},'*')}}
window.addEventListener('message',function(e){var fr=$('cf'),d=e.data;if(!fr||e.source!==fr.contentWindow||!d)return;
 if(d.smm=='send')gSend({g:'cu',d:d.data});else if(d.smm=='score'){$('sc').textContent='結果: '+d.score;gSend({g:'score',s:d.score})}});
document.onkeydown=function(e){var k={37:'l',38:'u',39:'r',40:'d'}[e.keyCode];if(k&&G.dir){e.preventDefault();G.dir(k)}};

function gUI(){var g=$('vg');
 if(!$('st')){g.innerHTML='<div>対戦相手: <select id="go" onchange="G.opp=this.value"></select></div><div id="gb"></div><div id="sc" style="font-weight:bold"></div><div id="os" style="color:#d33"></div><div id="st"></div><div id="pd"></div><button class="s" onclick="gStop()">やめる</button><h4>自作ゲームHTML</h4><input type="file" accept=".html,.htm" onchange="addCustom(this.files[0])"><div id="cl"></div>';
  games.forEach(function(q,i){var b=document.createElement('button');b.textContent=q[0];b.onclick=function(){gStart(i)};$('gb').appendChild(b)})}
 var o='<option value="">(ひとりで)</option>';
 list.forEach(function(c){o+='<option value="'+esc(c.id)+'"'+(c.id==G.opp?' selected':'')+'>'+esc(c.name)+'</option>'});
 $('go').innerHTML=o;cList()}
function gStop(){if(G.stop){G.stop();G.stop=null}G.dir=null;G.pf=null;$('st').innerHTML='';$('pd').innerHTML='';$('sc').textContent=''}
function gStart(i){gStop();$('os').textContent='';
 if(games[i][2])$('pd').innerHTML=['l','u','d','r'].map(function(k,j){return '<button style="width:24%" onclick="G.dir&&G.dir(\''+k+'\')">'+['◀','▲','▼','▶'][j]+'</button>'}).join('');
 G.stop=games[i][1]($('st'),function(sc){$('sc').textContent='結果: '+sc;gSend({g:'score',s:sc})})}

function snake(s,end){var x=cv(s).getContext('2d'),b=[[8,10]],d=[1,0],f=[3,3],sc=0;
 G.dir=function(k){var n={l:[-1,0],r:[1,0],u:[0,-1],d:[0,1]}[k];if(n&&(n[0]+d[0]||n[1]+d[1]))d=n};
 var t=setInterval(function(){var h=[b[0][0]+d[0],b[0][1]+d[1]];
  if(h[0]<0||h[1]<0||h[0]>15||h[1]>19||b.some(function(p){return p[0]==h[0]&&p[1]==h[1]})){clearInterval(t);return end(sc)}
  b.unshift(h);if(h[0]==f[0]&&h[1]==f[1]){sc++;f=[rnd(16),rnd(20)];sco(sc)}else b.pop();
  x.fillStyle='#111';x.fillRect(0,0,320,400);x.fillStyle='#e33';x.fillRect(f[0]*20,f[1]*20,18,18);
  x.fillStyle='#4c4';b.forEach(function(p){x.fillRect(p[0]*20,p[1]*20,18,18)})},130);
 return function(){clearInterval(t)}}

function invaders(s,end){var x=cv(s).getContext('2d'),p=150,al=[],sh=[],dx=1,sc=0,fr=0,mv=0;
 for(var i=0;i<5;i++)for(var j=0;j<8;j++)al.push({x:20+j*34,y:20+i*28});
 G.dir=function(k){mv=k=='l'?-1:k=='r'?1:0};
 var t=setInterval(function(){fr++;p=Math.max(0,Math.min(300,p+mv*4));if(fr%15==0)sh.push({x:p+8,y:380});
  var e=false;al.forEach(function(a){a.x+=dx;if(a.x>300||a.x<0)e=true});
  if(e){dx=-dx;al.forEach(function(a){a.y+=10})}
  sh.forEach(function(b){b.y-=6});
  sh=sh.filter(function(b){var hit=false;al=al.filter(function(a){if(!hit&&Math.abs(a.x-b.x)<14&&Math.abs(a.y-b.y)<12){hit=true;sc+=10;return false}return true});return !hit&&b.y>0});
  sco(sc);x.fillStyle='#111';x.fillRect(0,0,320,400);
  x.fillStyle='#4c4';al.forEach(function(a){x.fillRect(a.x,a.y,18,14)});
  x.fillStyle='#fc3';sh.forEach(function(b){x.fillRect(b.x,b.y,3,8)});x.fillStyle='#4cf';x.fillRect(p,385,20,10);
  if(!al.length||al.some(function(a){return a.y>360})){clearInterval(t);end(sc+(al.length?0:100))}},30);
 return function(){clearInterval(t)}}

function tanuki(s,end){s.innerHTML='<div id="tt" style="font-size:24px">30</div><button id="tb" style="font-size:40px;height:200px;background:#c83">🦝ぽん</button>';
 var n=0,t=30;$('tb').onclick=function(){n++;sco(n);this.textContent=n%2?'🦝ぽんぽん':'🦝ぽん'};
 var i=setInterval(function(){t--;$('tt').textContent=t;if(t<=0){clearInterval(i);$('tb').onclick=null;end(n)}},1000);
 return function(){clearInterval(i)}}

function paint(s,end){var tp=['たぬき','ねこ','ロケット','りんご','おうち','花火'][rnd(6)];
 s.innerHTML='<div>お題: <b>'+tp+'</b>(上があなた、下が相手の絵)</div>';
 var c=cv(s),o=cv(s),cx=c.getContext('2d'),ox=o.getContext('2d'),lx=null,dn=false;
 [cx,ox].forEach(function(q){q.fillStyle='#fff';q.fillRect(0,0,320,400);q.lineWidth=3;q.lineCap='round'});
 function ln(q,a){q.beginPath();q.moveTo(a[0],a[1]);q.lineTo(a[2],a[3]);q.stroke()}
 function pos(e){var r=c.getBoundingClientRect(),q=e.touches?e.touches[0]:e;return[(q.clientX-r.left)*320/r.width,(q.clientY-r.top)*400/r.height]}
 function dw(e){e.preventDefault();if(!dn)return;var p=pos(e);if(lx){var a=[lx[0],lx[1],p[0],p[1]];ln(cx,a);gSend({g:'pl',a:a})}lx=p}
 ['touchstart','mousedown'].forEach(function(n){c.addEventListener(n,function(e){dn=true;lx=null;dw(e)})});
 ['touchmove','mousemove'].forEach(function(n){c.addEventListener(n,dw)});
 ['touchend','mouseup','mouseleave'].forEach(function(n){c.addEventListener(n,function(){dn=false;lx=null})});
 G.pf=function(d){ln(ox,d.a)};return function(){}}

function cList(){var l=$('cl');l.innerHTML='';G.custom.forEach(function(c,i){var r=document.createElement('div');r.className='row';r.appendChild(document.createTextNode(c.n+' '));
 [['▶',function(){runCustom(i)}],['🗑',function(){G.custom.splice(i,1);localStorage.cg=JSON.stringify(G.custom);cList()}]].forEach(function(q){var b=document.createElement('button');b.textContent=q[0];b.style.width='auto';b.onclick=q[1];r.appendChild(b)});l.appendChild(r)})}
function addCustom(f){if(!f)return;var r=new FileReader();r.onload=function(){G.custom.push({n:f.name,h:r.result});
 try{localStorage.cg=JSON.stringify(G.custom)}catch(e){G.custom.pop();alert('容量オーバーです')}cList()};r.readAsText(f)}
function runCustom(i){gStop();var f=document.createElement('iframe');f.id='cf';f.setAttribute('sandbox','allow-scripts');
 f.style.cssText='width:100%;height:440px;border:0;background:#fff';f.srcdoc=G.custom[i].h;$('st').appendChild(f)}
