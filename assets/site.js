
const menu=document.querySelector('.menu-top-menu-container');
const cBox=document.querySelector('.c-box');
const topButtons=document.querySelector('footer.site-footer .top-buttons');
const toDos=['dissent','read','watch','eat','revolt','see','taste'];
const isMultiColumn=()=>Boolean(topButtons && getComputedStyle(topButtons).display!=='none');
function setMenu(open){if(!menu)return;menu.classList.toggle('open',open);menu.setAttribute('aria-hidden',String(!open));}
function smoothScrollToHash(hash,time=300){
  if(!hash)return;
  if(hash==='#about') document.querySelector('#about')?.classList.add('open');
  else if(hash!=='#news') document.querySelector('#about')?.classList.remove('open');
  if(hash==='#news') document.querySelector('#other-news')?.style.setProperty('display','block');
  const target=hash==='#home'?document.body:document.querySelector(hash);
  if(!target)return;
  const cRect=cBox?cBox.getBoundingClientRect():{bottom:0,height:0};
  const lineW=cBox?parseFloat(getComputedStyle(cBox).borderLeftWidth)||0:0;
  let offset=(cRect.bottom>0?cRect.height:0)+lineW;
  if(isMultiColumn() && target.getBoundingClientRect().top + scrollY - offset > 10) offset=0;
  scrollTo({top:Math.max(0,target.getBoundingClientRect().top+scrollY-offset),behavior:'smooth'});
  if(history.pushState && hash!=='#home') history.pushState({title:'La Cocina. '+hash.toUpperCase()},'',hash);
}
document.querySelectorAll('.menu-toggle,.c-aside').forEach(b=>b.addEventListener('click',()=>setMenu(!menu?.classList.contains('open'))));
menu?.querySelectorAll('a').forEach(a=>a.addEventListener('click',e=>{setMenu(false); if(a.hash && a.pathname===location.pathname){e.preventDefault();smoothScrollToHash(a.hash)}}));
document.querySelectorAll('.collapsible .handle').forEach(h=>h.addEventListener('click',()=>{const b=h.parentElement.querySelector('.body');if(!b)return;b.style.display=b.style.display==='block'?'none':'block';document.dispatchEvent(new CustomEvent('toggleNews',{bubbles:true}));}));
document.querySelectorAll('.collapsible .body').forEach(b=>b.style.display='none');
const about=document.querySelector('#about');about?.addEventListener('click',()=>about.classList.toggle('open'));
document.querySelectorAll('.stepper.left,.stepper.right').forEach(button=>button.addEventListener('click',e=>{const box=document.querySelector('#about .content-padding-box'); if(box){const step=box.clientWidth+50; box.scrollBy({left:button.classList.contains('left')?-step:step,behavior:'smooth'});} e.stopImmediatePropagation();}));
document.querySelector('#more-news-button')?.addEventListener('click',e=>{const other=document.querySelector('#other-news'); if(other) other.style.display=other.style.display==='block'?'none':'block';});
document.querySelector('#go-top-aside')?.addEventListener('click',()=>smoothScrollToHash('#home'));
function drawNumberDots(){
  document.querySelectorAll('.archive-entry .number:not([data-dots-ready])').forEach(el=>{
    const digits=el.querySelector('.digits'), dots=el.querySelector('.dots'), space=el.querySelector('.space');
    if(!digits||!dots||!space)return;
    function update(){
      dots.style.letterSpacing='0px'; space.style.width='0px'; dots.textContent='.';
      const box=el.getBoundingClientRect(), dr=digits.getBoundingClientRect(), one=dots.getBoundingClientRect().width||8;
      const available=Math.max(0,(box.right-box.left)-(dr.right-dr.left));
      const count=Math.max(1,Math.ceil(available/one));
      dots.textContent='.'.repeat(count);
      const dotsW=dots.getBoundingClientRect().width;
      if(count>1) dots.style.letterSpacing=Math.max(0,Math.floor((available-dotsW)/count))+'px';
      space.style.width=Math.max(0,available-dots.getBoundingClientRect().width)+'px';
    }
    update(); el.dataset.dotsReady='true'; addEventListener('resize',update,{passive:true});
  });
}
function setScrollBottomFix(){
  document.querySelectorAll('.scroll-bottom-fix').forEach(el=>{
    if(isMultiColumn()){const r=el.getBoundingClientRect(); el.style.top=Math.min(innerHeight-r.height,0)+'px';}
    else el.style.top='';
  });
}
function toggleTopButtons(){if(!topButtons||!cBox)return;const r=cBox.getBoundingClientRect();topButtons.classList.toggle('open',r.bottom<(r.height/2));}
let todoTimer;function setupTodos(){const box=document.querySelector('#todos'); if(!box)return; const original=box.textContent.trim(); let active=toDos.filter(t=>t!==original), used=[]; function loop(){if(!active.length){active=used;used=[];box.textContent=original;todoTimer=setTimeout(loop,1000);return;} const i=Math.floor(Math.random()*active.length); const t=active.splice(i,1)[0]; used.push(t); box.textContent=t; todoTimer=setTimeout(loop,200);} loop(); const featured=document.querySelector('#featured'); featured?.addEventListener('mouseenter',()=>{clearTimeout(todoTimer);box.textContent=original}); featured?.addEventListener('mouseleave',loop);}
addEventListener('scroll',()=>{setMenu(false);toggleTopButtons();},{passive:true});
addEventListener('resize',()=>{toggleTopButtons();setScrollBottomFix();},{passive:true});
if(location.hash){setTimeout(()=>smoothScrollToHash(location.hash,0),20)}
drawNumberDots();setScrollBottomFix();toggleTopButtons();setupTodos();
