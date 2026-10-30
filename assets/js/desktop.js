(() => {
  'use strict';
  const source=document.querySelector('#workspace-content');
  if (!source) return;
  const $ = s => document.querySelector(s);
  const icon = name => `<svg class="work-icon" aria-hidden="true"><use href="#icon-${name}"/></svg>`;
  const apps = {
    welcome: {name:'Welcome',icon:'orbit',color:'peach'},
    projects:{name:'Projects',icon:'code',color:'blue',selectors:['#work']},
    robotics:{name:'Robotics Lab',icon:'robot',color:'mint',selectors:['.hero-visual','.signal-lab']},
    systems:{name:'Data Systems',icon:'network',color:'blue',selectors:['#engineering']},
    research:{name:'Research',icon:'fingerprint',color:'violet',selectors:['#experience']},
    profile:{name:'About Matin',icon:'scan',color:'blue',selectors:['#about']},
    offduty:{name:'Off duty',icon:'game',color:'rose',selectors:['#off-duty']},
    terminal:{name:'Terminal',icon:'code',color:'mint'},
    contact:{name:'Contact',icon:'mail',color:'violet',selectors:['#contact']}
  };
  let z=10,active='welcome',resting=false;
  const windows=new Map();
  const shell=document.createElement('div');shell.className='portfolio-desktop';shell.id='desktop-main';shell.setAttribute('role','main');
  shell.innerHTML=`<div class="desktop-wallpaper" aria-hidden="true"><div class="wallpaper-glow"></div><svg viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice"><defs><linearGradient id="terrain-gradient" x2="1" y2="1"><stop stop-color="#486479" stop-opacity=".25"/><stop offset="1" stop-color="#5c4268" stop-opacity=".6"/></linearGradient></defs><g fill="none" stroke="#aac4d0" opacity=".12"><ellipse cx="1130" cy="430" rx="500" ry="230" transform="rotate(-30 1130 430)"/><ellipse cx="1130" cy="430" rx="440" ry="190" transform="rotate(-30 1130 430)"/><circle cx="1130" cy="430" r="120"/><path d="M600 430h900M1130 50v800"/></g><path d="M0 840L250 530 450 690 860 300 1300 770 1600 490V1000H0Z" fill="url(#terrain-gradient)"/><g fill="none" stroke="#b5bed1" opacity=".08"><path d="M0 900L250 590 450 750 860 360 1300 830 1600 550M0 940L250 630 450 790 860 400 1300 870 1600 590M0 980L250 670 450 830 860 440 1300 910 1600 630"/></g></svg><span class="wallpaper-word">curiosity.</span></div>
  <header class="desktop-bar"><button class="workspace-home" data-open="welcome"><span class="workspace-symbol">m<span>_</span></span> Matin’s workspace</button><span class="desktop-context">Robotics / Data / A few side quests</span><div class="bar-right"><button class="show-desktop" title="Minimize all windows">Show desktop</button><span class="desktop-clock"></span></div></header>
  <nav class="desktop-shortcuts" aria-label="Desktop applications">${['projects','robotics','systems','research','profile','offduty'].map(id=>`<button data-open="${id}" class="desktop-shortcut"><span class="app-icon ${apps[id].color}">${icon(apps[id].icon)}</span><span>${apps[id].name}</span></button>`).join('')}</nav>
  <aside class="desktop-note"><span class="eyebrow">A personal operating space</span><h2>Make yourself<br><em>at home.</em></h2><p>Open a project.<br>Follow a signal.<br>Take a side quest.</p><button data-open="terminal">${icon('code')} hello, friend. <span>↗</span></button><span class="desktop-location">TEHRAN, IRAN / ALWAYS CURIOUS</span></aside>
  <div class="window-space"></div>
  <nav class="desktop-dock" aria-label="Application dock">${Object.entries(apps).map(([id,a])=>`<button data-open="${id}" class="dock-app" aria-label="Open ${a.name}" title="${a.name}"><span class="app-icon ${a.color}">${icon(a.icon)}</span><span class="dock-label">${a.name}</span><i></i></button>`).join('')}<span class="dock-divider"></span><a href="/cv/" class="dock-app" aria-label="Open curriculum vitae" title="Curriculum vitae"><span class="app-icon peach">${icon('data')}</span><span class="dock-label">CV</span></a><button class="rest-button dock-app" aria-label="Rest at the bonfire" aria-pressed="false" title="Rest at the bonfire"><span class="app-icon ember">♨</span><span class="dock-label">Bonfire</span></button></nav>
  <div class="desktop-toast" role="status" aria-live="polite"></div>`;
  document.body.append(shell);
  const space=shell.querySelector('.window-space');
  const focus=id=>{
    const win=windows.get(id);if(!win)return;
    win.hidden=false;win.style.zIndex=++z;active=id;
    windows.forEach((w,key)=>w.classList.toggle('focused',key===id));
    shell.querySelectorAll('[data-open]').forEach(b=>{b.classList.toggle('app-running',windows.has(b.dataset.open)&&!windows.get(b.dataset.open).dataset.closed);b.classList.toggle('app-active',b.dataset.open===id);});
  };
  const close=id=>{const win=windows.get(id);if(!win)return;win.hidden=true;win.dataset.closed='true';shell.querySelectorAll(`[data-open="${id}"]`).forEach(b=>b.classList.remove('app-running','app-active'));const button=shell.querySelector(`.desktop-shortcuts [data-open="${id}"],.desktop-dock [data-open="${id}"]`);button?.focus();};
  function open(id){
    if(!apps[id])return;
    if(windows.has(id)){delete windows.get(id).dataset.closed;focus(id);return;}
    const a=apps[id],win=document.createElement('section');win.className='desktop-window app-'+id;win.setAttribute('role','dialog');win.setAttribute('aria-label',a.name);win.tabIndex=-1;
    const offset=(windows.size%4)*22;win.style.setProperty('--window-offset',offset+'px');
    win.innerHTML=`<div class="window-titlebar"><div class="window-title">${icon(a.icon)}<span>${a.name}</span><span class="window-path">/ matin / ${id}</span></div><div class="window-controls"><button data-action="min" aria-label="Minimize ${a.name}" title="Minimize">−</button><button data-action="max" aria-label="Maximize ${a.name}" title="Maximize">□</button><button data-action="close" aria-label="Close ${a.name}" title="Close">×</button></div></div><div class="window-content"></div>`;
    const content=win.querySelector('.window-content');
    if(id==='welcome'){
      const img=source.dataset.portrait;
      content.innerHTML=`<div class="welcome-app"><div class="welcome-topline"><span class="app-kicker">PERSONAL WORKSPACE / 01</span><span class="welcome-status"><i></i> Engineer. Explorer. Human.</span></div><div class="welcome-layout"><div><p class="welcome-greeting">Hello, I’m Matin.</p><p class="welcome-role">COMPUTER ENGINEER / ROBOTICS &amp; DATA SYSTEMS</p><h1>Built on curiosity.<br><em>And a few retries.</em></h1><p class="welcome-bio">Mohammad Matin Momeni Ravandi.<br>I build robots, data pipelines, and things that help me understand how the world works.</p><div class="welcome-actions"><button data-open="projects">Explore my projects <span>↗</span></button><button data-open="profile">Meet the person</button></div></div><div class="welcome-portrait"><img src="${img}" width="160" height="160" decoding="async" fetchpriority="high" alt="Mohammad Matin Momeni Ravandi"><span>MATIN / OUTSIDE THE EDITOR</span></div></div><div class="welcome-apps">${['robotics','systems','research'].map(key=>`<button data-open="${key}"><span class="app-icon ${apps[key].color}">${icon(apps[key].icon)}</span><strong>${apps[key].name}</strong><span>${{robotics:'Perception → control',systems:'Collection → delivery',research:'Signals → understanding'}[key]}</span><b>↗</b></button>`).join('')}</div><div class="welcome-bottom"><span>Try the terminal. There are a few familiar echoes.</span><button data-open="terminal">${icon('code')} Open terminal</button></div></div>`;
    }else if(id==='terminal'){
      content.innerHTML='<div class="terminal-app"><p class="terminal-greeting">hello, friend.</p><p>A small window into my work. Type <strong>help</strong> to explore.</p><div class="terminal-output" role="log" aria-live="polite"></div><form class="terminal-form"><label for="portfolio-command">matin@workspace:~$</label><input id="portfolio-command" name="command" aria-label="Portfolio terminal command" autocomplete="off" spellcheck="false"><button type="submit">↵</button></form></div>';
      const form=content.querySelector('form'),input=content.querySelector('input'),output=content.querySelector('.terminal-output');let history=[],historyIndex=0;
      const print=(text,kind='')=>{const line=document.createElement('p');line.className=kind;line.textContent=text;output.append(line);content.scrollTop=content.scrollHeight;};
      form.addEventListener('submit',e=>{e.preventDefault();const raw=input.value.trim();if(!raw)return;history.push(raw);historyIndex=history.length;input.value='';print('matin@workspace:~$ '+raw,'terminal-echo');const cmd=raw.toLowerCase();
        if(cmd==='clear'){output.replaceChildren();return;}
        if(cmd==='help')print('help · ls · whoami · cat about · open <app> · bonfire · hint · clear\nApps: projects, robotics, systems, research, profile, offduty, contact');
        else if(cmd==='ls')print('projects/   robotics/   systems/   research/   profile/   offduty/   contact/');
        else if(cmd==='whoami'||cmd==='cat about')print('Mohammad Matin Momeni Ravandi\nComputer engineer · Shahid Beheshti University\nRobotics, control, and data systems. Films, music, running, and Soulsborne games.');
        else if(cmd==='bonfire'){toggleRest();print(resting?"Don't you dare go Hollow. — Laurentius":'Back to exploring.');}
        else if(cmd==='4 8 15 16 23 42'||cmd==='4815162342'){print('>: 4 8 15 16 23 42\nSEQUENCE ACCEPTED\n108:00\nThe Swan / Counter reset.','egg-lost');}
        else if(cmd==='fsociety'||cmd==='seeing this too'){print('Please, tell me you are seeing this, too.\n— Elliot Alderson','egg-robot');content.classList.add('terminal-transmission');setTimeout(()=>content.classList.remove('terminal-transmission'),1600);}
        else if(cmd==='october 14'||cmd==='2%'){print('OCTOBER 14\n2% departed. 98% remained.\nNo explanation returned.','egg-leftovers');}
        else if(cmd==='hollow'||cmd==='praise the sun'){print("Don't you dare go Hollow.\n— Laurentius of the Great Swamp",'egg-souls');}
        else if(cmd==='grace'||cmd==='tarnished'){print('LOST GRACE DISCOVERED\nA little guidance for the road ahead.','egg-elden');}
        else if(cmd==='hint'){print('A sequence. A date. A farewell. A familiar voice. A trace of gold.\nLook around Off duty.');}
        else if(cmd.startsWith('open ')){const key=cmd.slice(5).trim();if(apps[key]){open(key);print('Opened '+apps[key].name+'.');}else if(key==='cv')location.href='/cv/';else print('Unknown app. Type ls to see the workspace.');}
        else print('Command not found. Try help.');
      });
      input.addEventListener('keydown',e=>{if(e.key==='ArrowUp'){e.preventDefault();historyIndex=Math.max(0,historyIndex-1);input.value=history[historyIndex]||'';}if(e.key==='ArrowDown'){e.preventDefault();historyIndex=Math.min(history.length,historyIndex+1);input.value=history[historyIndex]||'';}});
    }else{
      a.selectors.forEach(selector=>{const node=$(selector);if(!node)return;content.append(node);});
      if(id==='robotics'){const title=document.createElement('div');title.className='robotics-app-intro';title.innerHTML='<p class="eyebrow">Robotics / Perception / Control</p><h2>A small space<br>to <em>experiment.</em></h2><p>Send the rover to a waypoint, then explore the perception and control sketches below.</p>';content.prepend(title);}
    }
    space.append(win);windows.set(id,win);
    win.addEventListener('pointerdown',()=>focus(id));
    win.querySelector('[data-action="close"]').addEventListener('click',()=>close(id));
    win.querySelector('[data-action="min"]').addEventListener('click',()=>{win.hidden=true;shell.querySelector(`.desktop-dock [data-open="${id}"]`)?.focus();});
    const maximize=()=>{win.classList.toggle('maximized');win.querySelector('[data-action="max"]').setAttribute('aria-label',(win.classList.contains('maximized')?'Restore ':'Maximize ')+a.name);};
    win.querySelector('[data-action="max"]').addEventListener('click',maximize);
    const bar=win.querySelector('.window-titlebar');bar.addEventListener('dblclick',e=>{if(!e.target.closest('button'))maximize();});
    bar.addEventListener('pointerdown',e=>{if(e.target.closest('button')||innerWidth<761||win.classList.contains('maximized'))return;const box=win.getBoundingClientRect(),startX=e.clientX,startY=e.clientY;bar.setPointerCapture(e.pointerId);const move=ev=>{win.style.left=Math.max(10,Math.min(innerWidth-160,box.left+ev.clientX-startX))+'px';win.style.top=Math.max(47,Math.min(innerHeight-140,box.top+ev.clientY-startY))+'px';win.style.transform='none';};const end=()=>{bar.removeEventListener('pointermove',move);bar.removeEventListener('pointerup',end);bar.removeEventListener('pointercancel',end);};bar.addEventListener('pointermove',move);bar.addEventListener('pointerup',end);bar.addEventListener('pointercancel',end);});
    focus(id);win.focus();if(id==='terminal')content.querySelector('input').focus();
  }
  const targetApps={work:'projects',engineering:'systems',experience:'research',fingerprinting:'research',about:'profile','off-duty':'offduty',contact:'contact',main:'welcome'};
  document.addEventListener('click',e=>{
    const launcher=e.target.closest('[data-open]');if(launcher&&document.body.classList.contains('desktop-mode')){open(launcher.dataset.open);return;}
    const a=e.target.closest('a[href]');if(!a||!document.body.classList.contains('desktop-mode'))return;
    const u=new URL(a.href,location.href);if(u.origin!==location.origin||u.pathname!==location.pathname||!u.hash)return;
    const key=u.hash.slice(1),id=targetApps[key];if(id){e.preventDefault();open(id);history.replaceState(null,'',u.hash);if(key==='fingerprinting')requestAnimationFrame(()=>$('#fingerprinting').scrollIntoView({block:'start',behavior:'smooth'}));}
  });
  function toggleRest(){resting=!resting;document.body.classList.toggle('workspace-resting',resting);const btn=shell.querySelector('.rest-button');btn.setAttribute('aria-pressed',String(resting));btn.setAttribute('aria-label',resting?'Leave the bonfire':'Rest at the bonfire');const rover=$('#rover-pause');if(rover&&((rover.getAttribute('aria-pressed')==='true')!==resting))rover.click();const toast=shell.querySelector('.desktop-toast');toast.textContent=resting?"Don't you dare go Hollow.":'Back to the workspace.';clearTimeout(toggleRest.timer);toggleRest.timer=setTimeout(()=>toast.textContent='',3500);}
  shell.querySelector('.rest-button').addEventListener('click',toggleRest);
  shell.querySelector('.show-desktop').addEventListener('click',()=>{windows.forEach(w=>w.hidden=true);});
  addEventListener('resize',()=>{windows.forEach(w=>{if(innerWidth>760&&!w.classList.contains('maximized')){const b=w.getBoundingClientRect();if(b.left>innerWidth-160)w.style.left=Math.max(10,innerWidth-200)+'px';if(b.top>innerHeight-140)w.style.top=Math.max(47,innerHeight-180)+'px';}});});
  const enable=()=>{document.body.classList.add('desktop-mode');$('.skip-link').href='#desktop-main';};
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&document.body.classList.contains('desktop-mode')){const visible=[...windows.entries()].filter(([,w])=>!w.hidden).sort((a,b)=>Number(b[1].style.zIndex)-Number(a[1].style.zIndex));if(visible.length)close(visible[0][0]);}});
  const clock=()=>shell.querySelector('.desktop-clock').textContent=new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Tehran',hour:'2-digit',minute:'2-digit'}).format(new Date())+' / Tehran';clock();setInterval(clock,60000);
  enable();open('welcome');
  const initial=targetApps[location.hash.slice(1)];if(initial&&initial!=='welcome')open(initial);
  $('#workspace-startup')?.remove();
})();
