
(() => {
  const library=document.querySelector('.memory-library');if(!library)return;
  const worlds={"souls": {"category": "DARK SOULS SERIES", "index": "01 / 05", "title": "Don't you dare go Hollow.", "credit": "Laurentius of the Great Swamp · Dark Souls (2011)", "alt": "Official Dark Souls Remastered screenshot of an armored character resting at a bonfire", "note": "The atmosphere, the exploration, the fight that finally clicks. And a farewell worth keeping.", "secret": "A farewell can also be a command. Try hollow in the terminal."}, "elden": {"category": "ELDEN RING", "index": "02 / 05", "title": "Guidance of Grace", "credit": "The Lands Between", "alt": "Elden Ring key art with a kneeling Tarnished beneath the golden Erdtree", "note": "A vast world, a distant light, and the freedom to take the long way around.", "secret": "Even a terminal can hold a little grace."}, "lost": {"category": "LOST", "index": "03 / 05", "title": "4 8 15 16 23 42", "credit": "The Numbers", "alt": "Lost promotional artwork with the cast silhouetted below the title", "note": "The island. The hatch. The questions that keep pulling you back.", "secret": "The terminal is waiting for the sequence. Use spaces between the numbers."}, "robot": {"category": "MR. ROBOT", "index": "04 / 05", "title": "Please, tell me you are seeing this, too.", "credit": "Elliot Alderson", "alt": "A still of Rami Malek as Elliot Alderson in Mr. Robot", "note": "A familiar face on the other side of the screen. The terminal has a signal of its own.", "secret": "Try fsociety in the terminal."}, "leftovers": {"category": "THE LEFTOVERS", "index": "05 / 05", "title": "What remains.", "credit": "October 14", "alt": "The Leftovers promotional artwork with figures reaching toward one another underwater", "note": "People living in the space an unanswered question leaves behind.", "secret": "Some dates stay with you. Try october 14 in the terminal."}};
  let selected='souls';
  const base=new URL(library.querySelector('#memory-image').src);base.pathname=base.pathname.replace(/souls(?:-official)?\.webp$/,'');
  library.querySelectorAll('button[data-world]').forEach(button=>button.addEventListener('click',()=>{
    selected=button.dataset.world;const w=worlds[selected];const viewer=library.querySelector('.memory-viewer');viewer.dataset.world=selected;
    const image=library.querySelector('#memory-image');image.src=new URL((selected==='souls'?'souls-official':selected)+'.webp',base).href;image.alt=w.alt;
    ['category','index','title','credit','note'].forEach(key=>library.querySelector('#memory-'+key).textContent=w[key]);
    library.querySelector('#memory-discovery').textContent='';
    library.querySelectorAll('button[data-world]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
  }));
  library.querySelector('.memory-secret').addEventListener('click',()=>{library.querySelector('#memory-discovery').textContent=worlds[selected].secret;});
})();
