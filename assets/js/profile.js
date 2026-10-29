(() => {
  'use strict';
  document.documentElement.classList.add('js-enabled');
  const menu = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#main-nav');
  if (menu && nav) {
    const close = () => { menu.setAttribute('aria-expanded', 'false'); nav.classList.remove('is-open'); };
    menu.addEventListener('click', () => {
      const expanded = menu.getAttribute('aria-expanded') === 'true';
      menu.setAttribute('aria-expanded', String(!expanded));
      nav.classList.toggle('is-open', !expanded);
    });
    nav.addEventListener('click', event => { if (event.target.closest('a')) close(); });
    document.addEventListener('keydown', event => { if (event.key === 'Escape' && nav.classList.contains('is-open')) { close(); menu.focus(); } });
    document.addEventListener('click', event => { if (!event.target.closest('.site-header')) close(); });
    window.matchMedia('(min-width: 761px)').addEventListener('change', event => { if (event.matches) close(); });
  }
  const filters = [...document.querySelectorAll('[data-filter]')];
  const projects = [...document.querySelectorAll('[data-category]')];
  const count = document.querySelector('#project-count');
  filters.forEach(button => button.addEventListener('click', () => {
    filters.forEach(item => { const active = item === button; item.classList.toggle('active', active); item.setAttribute('aria-pressed', String(active)); });
    const selected = button.dataset.filter;
    let visible = 0;
    projects.forEach(project => { const show = selected === 'all' || project.dataset.category.split(' ').includes(selected); project.hidden = !show; if (show) visible++; });
    if (count) count.textContent = `${visible} ${visible === 1 ? 'project' : 'projects'}`;
  }));
  const copy = document.querySelector('.copy-email');
  if (copy) copy.addEventListener('click', async () => {
    const status = document.querySelector('.copy-status');
    try { await navigator.clipboard.writeText(copy.dataset.email); status.textContent = 'Email address copied.'; }
    catch { status.textContent = copy.dataset.email; }
  });
  if ('IntersectionObserver' in window) {
    const links = [...document.querySelectorAll('#main-nav a[href*="#"]')];
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        links.forEach(link => { const active = link.hash === `#${entry.target.id}`; if (active) link.setAttribute('aria-current', 'location'); else link.removeAttribute('aria-current'); });
      });
    }, { rootMargin: '-15% 0px -65% 0px' });
    ['work', 'experience', 'about'].forEach(id => { const section = document.getElementById(id); if (section) observer.observe(section); });
  }
})();
(() => {
  const canvas = document.querySelector('#rover-map');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const status = document.querySelector('#rover-status');
  const destination = document.querySelector('#rover-destination');
  const pause = document.querySelector('#rover-pause');
  const response = document.querySelector('#rover-response');
  response?.addEventListener('input',()=>{document.querySelector('#rover-response-value').textContent=Number(response.value).toFixed(1)+'×';});
  const spots = {lab:{x:540,y:170,label:'THE WORKSHOP',href:'#work',cta:'Enter the workshop'},camp:{x:170,y:400,label:'OFF DUTY',href:'#off-duty',cta:'Meet the person behind the projects'},uplink:{x:540,y:420,label:'UPLINK',href:'#contact',cta:'Start a conversation'}};
  let robot={x:290,y:295,angle:-.7},goal={x:420,y:260},trail=[],paused=false,last=0,arrived=false,inView=true;
  if ("IntersectionObserver" in window) new IntersectionObserver(entries => { inView=entries[0].isIntersecting; }).observe(canvas);
  const size={w:700,h:560};
  const select=(point,key)=>{
    goal={x:point.x,y:point.y};arrived=false;
    document.querySelectorAll('[data-rover]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.rover===key)));
    if(key){destination.href=point.href;destination.firstChild.textContent=point.cta+' ';status.textContent='Destination set: '+point.label.toLowerCase()+'.';}
    else status.textContent='New waypoint. Finding a heading.';
    if(reduced.matches){robot.x=goal.x;robot.y=goal.y;draw();}
  };
  document.querySelectorAll('[data-rover]').forEach(b=>b.addEventListener('click',()=>select(spots[b.dataset.rover],b.dataset.rover)));
  canvas.addEventListener('pointerdown',e=>{const r=canvas.getBoundingClientRect();select({x:Math.max(30,Math.min(670,(e.clientX-r.left)/r.width*700)),y:Math.max(80,Math.min(520,(e.clientY-r.top)/r.height*560))});});
  pause.addEventListener('click',()=>{paused=!paused;pause.setAttribute('aria-pressed',String(paused));pause.textContent=paused?'Resume motion':'Pause motion';});
  function draw(){
    ctx.clearRect(0,0,700,560);ctx.fillStyle='#131f19';ctx.fillRect(0,0,700,560);
    ctx.strokeStyle='#7c936b12';ctx.lineWidth=1;
    for(let x=0;x<700;x+=35){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,560);ctx.stroke();}
    for(let y=0;y<560;y+=35){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(700,y);ctx.stroke();}
    // Deterministic contour lines evoke a terrain survey without hiding controls.
    ctx.strokeStyle='#8ca17225';
    for(let i=0;i<10;i++){
      ctx.beginPath();
      for(let a=0;a<=Math.PI*2+.04;a+=.035){let radius=45+i*21+Math.sin(a*3+i*.23)*12+Math.cos(a*5)*7;let x=315+Math.cos(a)*radius*1.2,y=280+Math.sin(a)*radius*.75;if(a===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);}
      ctx.stroke();
    }
    ctx.font='9px monospace';ctx.fillStyle='#7e9670';ctx.fillText('35° N / FIELD NOTES',22,535);ctx.fillText('ILLUSTRATIVE CONTROL PLAYGROUND',425,535);
    Object.values(spots).forEach(p=>{ctx.strokeStyle='#9eb58a';ctx.lineWidth=1;ctx.strokeRect(p.x-13,p.y-13,26,26);ctx.fillStyle='#c1c7a9';ctx.fillRect(p.x-3,p.y-3,6,6);ctx.font='10px monospace';ctx.fillStyle='#c0c5a7';ctx.fillText(p.label,p.x-35,p.y+34);});
    ctx.beginPath();trail.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));ctx.strokeStyle='#dba46b88';ctx.lineWidth=2;ctx.stroke();
    ctx.setLineDash([4,7]);ctx.beginPath();ctx.moveTo(robot.x,robot.y);ctx.lineTo(goal.x,goal.y);ctx.strokeStyle='#e2af6855';ctx.lineWidth=1;ctx.stroke();ctx.setLineDash([]);
    ctx.strokeStyle='#e5b476';ctx.beginPath();ctx.arc(goal.x,goal.y,10,0,Math.PI*2);ctx.stroke();ctx.beginPath();ctx.moveTo(goal.x-16,goal.y);ctx.lineTo(goal.x+16,goal.y);ctx.moveTo(goal.x,goal.y-16);ctx.lineTo(goal.x,goal.y+16);ctx.stroke();
    ctx.save();ctx.translate(robot.x,robot.y);ctx.rotate(robot.angle);
    ctx.fillStyle='#090f0b';ctx.fillRect(-15,-19,28,8);ctx.fillRect(-15,11,28,8);
    ctx.shadowColor='#e5b476';ctx.shadowBlur=18;ctx.fillStyle='#e4b27a';ctx.fillRect(-16,-10,31,20);ctx.shadowBlur=0;ctx.strokeStyle='#fff0cb';ctx.strokeRect(-16,-10,31,20);
    ctx.fillStyle='#28382a';ctx.fillRect(-8,-6,10,12);ctx.fillStyle='#fff1c5';ctx.fillRect(13,-7,4,4);ctx.fillRect(13,3,4,4);ctx.restore();
  }
  function frame(t){
    let dt=Math.min((t-last)/1000,.05);last=t;
    if(inView&&!paused&&!reduced.matches&&document.visibilityState==='visible'){
      let dx=goal.x-robot.x,dy=goal.y-robot.y,dist=Math.hypot(dx,dy);
      if(dist>3){let error=Math.atan2(dy,dx)-robot.angle;error=Math.atan2(Math.sin(error),Math.cos(error));robot.angle+=Math.max(-2.6*dt,Math.min(2.6*dt,error));let speed=Math.min(65,dist*1.8)*Math.max(.08,Math.cos(error))*Number(response?.value||1);robot.x+=Math.cos(robot.angle)*speed*dt;robot.y+=Math.sin(robot.angle)*speed*dt;if(!trail.length||Math.hypot(robot.x-trail[trail.length-1].x,robot.y-trail[trail.length-1].y)>3){trail.push({x:robot.x,y:robot.y});if(trail.length>550)trail.shift();}}
      else if(!arrived){arrived=true;status.textContent='Waypoint reached. The next move is yours.';}
    }
    if(inView&&!reduced.matches&&document.visibilityState==='visible')draw();
    requestAnimationFrame(frame);
  }
  draw();requestAnimationFrame(frame);
})();
(() => {
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const lab=document.querySelector('.signal-lab');
  const themes={
    robot:{labels:['SENSE','INTERPRET','ACT'],icons:['scan','code','robot'],text:['A robot starts with an imperfect view of the world. Images and sensor readings are the raw material for perception.','Geometry and vision turn observations into a useful representation. My projects explore mapping and CNN-based perception in simulation.','The controller turns a target into movement. This connects to my quadcopter control and reinforcement-learning experiments.'],href:'#work',link:'Explore the robotics projects ↗'},
    data:{labels:['COLLECT','VALIDATE','DELIVER'],icons:['network','code','data'],text:['Crawlers discover and collect data. Scheduling and task queues coordinate the work between services.','Parsers turn raw responses into structured records. Versioned models define the contract between producers and consumers.','Events and database writers deliver structured data downstream. Storage interfaces, retries, and failure handling make those handoffs explicit.'],href:'#engineering',link:'Inside my engineering work ↗'},
    privacy:{labels:['OBSERVE','LABEL','EVALUATE'],icons:['scan','fingerprint','signal'],text:['My thesis studies browser fingerprinting through the scripts websites use and the signals those scripts collect.','Building and labeling a script dataset creates the foundation for studying fingerprinting behavior.','Detection methods can then be compared against the labeled data. The illustration represents the research workflow, not live tracking.'],href:'#fingerprinting',link:'Read about my thesis ↗'}
  };
  if(lab){
    let mode='robot',stage=0;
    const render=()=>{const t=themes[mode];lab.querySelectorAll('.lab-labels text').forEach((e,i)=>e.textContent=t.labels[i]);lab.querySelectorAll('.lab-symbols use').forEach((e,i)=>e.setAttribute('href','#icon-'+t.icons[i]));lab.querySelectorAll('.lab-nodes circle').forEach((e,i)=>e.classList.toggle('active',i===stage));lab.querySelectorAll('[data-stage]').forEach((e,i)=>e.setAttribute('aria-pressed',String(i===stage)));lab.querySelectorAll('[data-lab]').forEach(e=>e.setAttribute('aria-pressed',String(e.dataset.lab===mode)));lab.querySelector('#lab-step').textContent=`0${stage+1} / ${t.labels[stage]}`;lab.querySelector('#lab-description').textContent=t.text[stage];const a=lab.querySelector('#lab-project');a.href=t.href;a.textContent=t.link;};
    lab.querySelectorAll('[data-lab]').forEach(b=>b.addEventListener('click',()=>{mode=b.dataset.lab;stage=0;render();}));lab.querySelectorAll('[data-stage]').forEach(b=>b.addEventListener('click',()=>{stage=Number(b.dataset.stage);render();}));render();
  }
  let pointerPending=false;
  if(matchMedia('(pointer:fine)').matches&&!reduced.matches){
    document.addEventListener('pointermove',e=>{if(pointerPending)return;pointerPending=true;requestAnimationFrame(()=>{document.documentElement.style.setProperty('--pointer-x',e.clientX+'px');document.documentElement.style.setProperty('--pointer-y',e.clientY+'px');pointerPending=false;});},{passive:true});
    document.querySelectorAll('.project,.personal-card').forEach(card=>{
      card.addEventListener('pointermove',e=>{const b=card.getBoundingClientRect(),x=e.clientX-b.left,y=e.clientY-b.top;card.style.setProperty('--card-x',x+'px');card.style.setProperty('--card-y',y+'px');card.style.setProperty('--tilt-x',((.5-y/b.height)*4)+'deg');card.style.setProperty('--tilt-y',((x/b.width-.5)*4)+'deg');});
      card.addEventListener('pointerleave',()=>{card.style.setProperty('--tilt-x','0deg');card.style.setProperty('--tilt-y','0deg');});
    });
  }
  let scrolling=false;const progress=()=>{const total=document.documentElement.scrollHeight-innerHeight;document.documentElement.style.setProperty('--read-progress',(total>0?scrollY/total*100:0)+'%');scrolling=false;};addEventListener('scroll',()=>{if(!scrolling){scrolling=true;requestAnimationFrame(progress);}},{passive:true});progress();
})();
