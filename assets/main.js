document.documentElement.classList.add('js');
const toggle=document.querySelector('.menu-toggle');
const nav=document.querySelector('#navigation');
if(toggle&&nav){
 const close=()=>{nav.dataset.open='false';toggle.setAttribute('aria-expanded','false');toggle.textContent='Menu +'};
 close();
 toggle.addEventListener('click',()=>{const open=nav.dataset.open!=='true';nav.dataset.open=String(open);toggle.setAttribute('aria-expanded',String(open));toggle.textContent=open?'Close −':'Menu +'});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&nav.dataset.open==='true'){close();toggle.focus()}});
 nav.addEventListener('click',e=>{if(e.target.closest('a'))close()});
}

