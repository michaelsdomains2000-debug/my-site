const canvas = document.getElementById('ripple');
const ctx    = canvas.getContext('2d');
let W, H, ripples = [], last = performance.now();

function resize(){ W = canvas.width = innerWidth; H = canvas.height = innerHeight; }
addEventListener('resize', resize); resize();

function Ripple(x,y){ this.x=x; this.y=y; this.r=0; this.max=120+Math.random()*80; this.alp=1; }
Ripple.prototype.draw = function(){
  this.r += 2.5;
  this.alp = 1 - this.r/this.max;
  if(this.alp <= 0) return false;
  ctx.beginPath();
  ctx.arc(this.x,this.y,this.r,0,Math.PI*2);
  ctx.strokeStyle = `rgba(255,255,255,${this.alp*.6})`;
  ctx.lineWidth = 2;
  ctx.stroke();
  return true;
};
addEventListener('mousemove', e => { ripples.push(new Ripple(e.clientX, e.clientY)); });
function loop(now){
  if(now-last < 16) {requestAnimationFrame(loop);return;}
  last = now;
  ctx.clearRect(0,0,W,H);
  ripples = ripples.filter(r => r.draw());
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
