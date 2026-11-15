document.documentElement.classList.add('js');
const toggle=document.querySelector('.menu-toggle');
const nav=document.querySelector('#navigation');
if(toggle&&nav){
 const close=()=>{nav.dataset.open='false';toggle.setAttribute('aria-expanded','false');toggle.textContent='Menu +'};
 close();
 toggle.addEventListener('click',()=>{const open=nav.dataset.open!=='true';nav.dataset.open=String(open);toggle.setAttribute('aria-expanded',String(open));toggle.textContent=open?'Close −':'Menu +'});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&nav.dataset.open==='true'&&!document.querySelector('.photo-viewer[open]')){close();toggle.focus()}});
 nav.addEventListener('click',e=>{if(e.target.closest('a'))close()});
}


const photos = [...document.querySelectorAll('main img')];
if (photos.length && typeof HTMLDialogElement !== 'undefined' && HTMLDialogElement.prototype.showModal) {
  const viewer = document.createElement('dialog');
  viewer.className = 'photo-viewer';
  viewer.setAttribute('aria-label', 'Enlarged photo');
  viewer.innerHTML = '<form method="dialog"><button type="submit" aria-label="Close photo" autofocus>×</button></form><img alt="">';
  document.body.append(viewer);

  const enlarged = viewer.querySelector('img');
  let trigger;
  const largerSource = photo => {
    const candidates = (photo.getAttribute('srcset') || '').split(',')
      .map(candidate => candidate.trim().split(/\s+/))
      .filter(([url, width]) => url && width && width.endsWith('w'))
      .sort((a, b) => parseInt(b[1], 10) - parseInt(a[1], 10));
    return candidates[0]?.[0] || photo.src;
  };

  for (const photo of photos) {
    const link = photo.closest('a');
    const imageLink = link && /\.(?:avif|gif|jpe?g|png|webp)$/i.test(new URL(link.href).pathname);
    if (link && !imageLink) continue;

    const control = link || photo;
    control.classList.add('photo-zoom');
    control.setAttribute('aria-label', photo.alt ? `Enlarge photo: ${photo.alt}` : 'Enlarge photo');
    control.setAttribute('aria-haspopup', 'dialog');
    if (!link) {
      control.tabIndex = 0;
      control.setAttribute('role', 'button');
      control.addEventListener('keydown', event => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          control.click();
        }
      });
    }

    control.addEventListener('click', event => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      trigger = control;
      enlarged.alt = photo.alt;
      enlarged.src = imageLink ? link.href : largerSource(photo);
      viewer.showModal();
    });
  }

  viewer.addEventListener('click', event => {
    if (event.target === viewer) viewer.close();
  });
  viewer.addEventListener('close', () => {
    trigger?.focus({preventScroll: true});
    enlarged.removeAttribute('src');
  });
}
