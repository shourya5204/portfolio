
// Animated background (simple moving circles) + reveal on scroll + small parallax
(function(){
  // canvas background
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext && canvas.getContext('2d');
  let w = canvas.width = window.innerWidth;
  let h = canvas.height = window.innerHeight;
  const circles = [];
  function rand(min,max){ return Math.random()*(max-min)+min; }
  for(let i=0;i<40;i++){
    circles.push({x:rand(0,w), y:rand(0,h), r:rand(20,120), vx:rand(-0.2,0.2), vy:rand(-0.1,0.1), alpha:rand(0.03,0.12)});
  }
  function resize(){ w=canvas.width=window.innerWidth; h=canvas.height=window.innerHeight; }
  window.addEventListener('resize', resize);
  function draw(){
    if(!ctx) return;
    ctx.clearRect(0,0,w,h);
    for(const c of circles){
      c.x += c.vx;
      c.y += c.vy;
      if(c.x < -200) c.x = w+200;
      if(c.x > w+200) c.x = -200;
      if(c.y < -200) c.y = h+200;
      if(c.y > h+200) c.y = -200;
      ctx.beginPath();
      ctx.fillStyle = 'rgba(125,211,201,'+c.alpha+')';
      ctx.ellipse(c.x, c.y, c.r, c.r*0.6, 0, 0, Math.PI*2);
      ctx.fill();
    }
    requestAnimationFrame(draw);
  }
  draw();

  // reveal on scroll
  const els = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){ e.target.style.opacity=1; e.target.style.transform='translateY(0)'; }
    });
  }, {threshold: 0.12});
  els.forEach(el=>io.observe(el));

  // small parallax on mouse move for hero card
  const hero = document.querySelector('.hero');
  const card = document.querySelector('.hero-card');
  if(hero && card){
    hero.addEventListener('mousemove', function(ev){
      const rect = hero.getBoundingClientRect();
      const cx = rect.left + rect.width/2;
      const cy = rect.top + rect.height/2;
      const dx = (ev.clientX - cx)/rect.width;
      const dy = (ev.clientY - cy)/rect.height;
      card.style.transform = 'translate3d(' + (dx*10) + 'px,' + (dy*6) + 'px,0)';
    });
    hero.addEventListener('mouseleave', ()=> card.style.transform = 'translate3d(0,0,0)');
  }

  // floating blobs opacity subtle
  const blobs = document.querySelectorAll('.blob');
  let t=0;
  function animateBlobs(){
    t+=0.01;
    blobs.forEach((b,i)=>{
      b.style.opacity = 0.7 + Math.sin(t + i)*0.12;
      b.style.transform = 'translateY(' + Math.sin(t*1.2 + i)*10 + 'px)';
    });
    requestAnimationFrame(animateBlobs);
  }
  animateBlobs();
})();
