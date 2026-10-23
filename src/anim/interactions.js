// Microinterações: menu (clicks.js), cursor que segue o mouse (main.js, setFollow),
// fundo dos botões que entra pelo lado do mouse (rollovers.js), hover de Valores e modal.
import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { lockScroll, scrollToTarget } from '../lib/scroll.js';

const fineHover = () => window.matchMedia('(hover: hover) and (pointer: fine)').matches;

/* ---------- Menu ---------- */
export function setupMenu({ desktop }) {
  const btn = document.querySelector('.hdr__btn');
  const label = btn.querySelector('.hdr__btn-label');
  const menu = document.getElementById('menu');
  let open = false;
  let lastFocus = null;

  const splits = [
    SplitText.create(menu.querySelector('.menu__media-title'), { type: 'chars', aria: 'auto' }),
    SplitText.create(menu.querySelector('.menu__projects-title'), { type: 'chars', aria: 'auto' }),
    SplitText.create(menu.querySelector('.menu__mail'), { type: 'chars', aria: 'auto' }),
  ];

  const swapLabel = (text) => {
    gsap.to(label, {
      y: '120%', duration: 0.33, ease: 'power2.out',
      onComplete: () => { label.textContent = text; gsap.fromTo(label, { y: '-120%' }, { y: '0%', duration: 0.33, ease: 'power2.out' }); },
    });
  };

  const tl = gsap.timeline({
    paused: true,
    onStart: () => { menu.hidden = false; },
    onReverseComplete: () => { menu.hidden = true; },
  });
  tl.fromTo(menu.querySelector('.menu__bg'), { width: 0 }, { width: '100vw', duration: 0.75, ease: 'power2.out' }, 0);
  const m = desktop ? 0.215 : 1.5;
  tl.from(menu.querySelector('.menu__media-img'), { '--clip': '0% 0% 0% 100%', duration: 0.75, ease: 'power2.out' }, m)
    .from(menu.querySelector('.menu__media-img .media__img'), { x: '35%', duration: 1.1, ease: 'power2.out' }, m)
    .from(splits[0].chars, { y: '105%', duration: 0.65, stagger: 0.033, ease: 'power3.out' }, m + 0.35)
    .from(splits[1].chars, { y: '105%', duration: 1, ease: 'power3.out' }, 0.3);
  menu.querySelectorAll('.menu__projects a').forEach((a, i) => {
    tl.from(a.children, { y: '120%', duration: 0.65, stagger: 0.025, ease: 'power3.out' }, 0.95 + 0.15 * i);
  });
  menu.querySelectorAll('.menu__link > span').forEach((s, i) => {
    tl.fromTo(s, { y: '105%' }, { y: '0%', duration: 0.85, ease: 'power3.out' }, 1 + 0.1 * i);
  });
  tl.from(splits[2].chars, { y: '105%', duration: 0.65, stagger: 0.02, ease: 'power3.out' }, 1.4);

  const setOpen = (value) => {
    if (value === open) return;
    open = value;
    btn.setAttribute('aria-expanded', String(open));
    btn.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    swapLabel(open ? 'Fechar' : 'Menu');
    lockScroll(open);
    if (open) {
      lastFocus = document.activeElement;
      menu.hidden = false;
      tl.timeScale(1).play();
      menu.querySelector('.menu__link')?.focus({ preventScroll: true });
    } else {
      tl.timeScale(2).reverse();
      lastFocus?.focus?.({ preventScroll: true });
    }
  };

  const onBtn = () => setOpen(!open);
  const onKey = (e) => { if (e.key === 'Escape' && open) setOpen(false); };
  btn.addEventListener('click', onBtn);
  document.addEventListener('keydown', onKey);

  return {
    close: () => setOpen(false),
    isOpen: () => open,
    destroy: () => {
      btn.removeEventListener('click', onBtn);
      document.removeEventListener('keydown', onKey);
      lockScroll(false);
      menu.hidden = true;
      label.textContent = 'Menu';
      btn.setAttribute('aria-expanded', 'false');
      open = false;
    },
  };
}

/* ---------- Links internos e modal de contato ---------- */
export function setupNavigation(menuApi) {
  const dialog = document.getElementById('contact-modal');
  const status = dialog.querySelector('.modal__status');

  const onClick = (e) => {
    const el = e.target.closest('[data-action="contact"], [data-target]');
    if (!el) return;
    e.preventDefault();
    const wasOpen = menuApi.isOpen();
    if (wasOpen) menuApi.close();
    if (el.dataset.action === 'contact') {
      status.textContent = '';
      dialog.showModal();
      lockScroll(true);
      return;
    }
    gsap.delayedCall(wasOpen ? 0.6 : 0, () => scrollToTarget(el.dataset.target));
  };
  const onClose = () => lockScroll(false);
  // Sem servidor: o envio só valida o formulário e confirma localmente.
  const onSend = (e) => {
    if (!e.target.matches('[data-send]')) return;
    const form = dialog.querySelector('form');
    if (!form.reportValidity()) return;
    status.textContent = 'Obrigado! Entraremos em contato em breve.';
    form.reset();
  };

  document.addEventListener('click', onClick);
  dialog.addEventListener('close', onClose);
  dialog.addEventListener('click', onSend);
  return () => {
    document.removeEventListener('click', onClick);
    dialog.removeEventListener('close', onClose);
    dialog.removeEventListener('click', onSend);
  };
}

/* ---------- Cursor ---------- */
export function setupCursor() {
  if (!fineHover()) return () => {};
  document.documentElement.classList.add('has-cursor');
  const cursor = document.getElementById('cursor');
  const span = cursor.querySelector('span');
  const pos = { x: innerWidth / 2, y: innerHeight / 2 };
  const mouse = { ...pos };
  const xSet = gsap.quickSetter(cursor, 'x', 'px');
  const ySet = gsap.quickSetter(cursor, 'y', 'px');
  const speed = 0.2;

  const tick = () => {
    const dt = 1 - Math.pow(1 - speed, gsap.ticker.deltaRatio());
    pos.x += (mouse.x - pos.x) * dt;
    pos.y += (mouse.y - pos.y) * dt;
    xSet(pos.x); ySet(pos.y);
  };
  const onMove = (e) => { mouse.x = e.clientX; mouse.y = e.clientY; };
  gsap.ticker.add(tick);
  window.addEventListener('pointermove', onMove);

  // Elementos com data-cursor expandem o círculo e mostram um texto.
  const grow = gsap.timeline({ paused: true });
  grow.to(cursor, { width: '7.15rem', height: '7.15rem', duration: 0.25, ease: 'back.out' }, 0)
    .to(span, { opacity: 1, duration: 0.35, ease: 'none' }, 0);
  const onOver = (e) => {
    const el = e.target.closest('[data-cursor]');
    if (!el || el.contains(e.relatedTarget)) return;
    span.textContent = el.dataset.cursor; grow.play();
  };
  const onOut = (e) => {
    const el = e.target.closest('[data-cursor]');
    if (!el || el.contains(e.relatedTarget)) return;
    grow.reverse();
  };
  document.addEventListener('pointerover', onOver);
  document.addEventListener('pointerout', onOut);

  return () => {
    gsap.ticker.remove(tick);
    window.removeEventListener('pointermove', onMove);
    document.removeEventListener('pointerover', onOver);
    document.removeEventListener('pointerout', onOut);
    document.documentElement.classList.remove('has-cursor');
    grow.kill();
  };
}

/* ---------- Botões: fundo entra pelo lado de onde vem o mouse ---------- */
export function setupButtons() {
  if (!fineHover()) return () => {};
  const side = (el, e) => {
    const r = el.getBoundingClientRect();
    const dx = (e.clientX - r.left) / r.width - 0.5;
    const dy = (e.clientY - r.top) / r.height - 0.5;
    return Math.abs(dx) > Math.abs(dy)
      ? { '--posX': dx < 0 ? '-101%' : '101%', '--posY': '0%' }
      : { '--posX': '0%', '--posY': dy < 0 ? '-101%' : '101%' };
  };
  const onEnter = (e) => {
    const el = e.target.closest?.('.btn--pill');
    if (!el || el.contains(e.relatedTarget)) return;
    gsap.fromTo(el, side(el, e), { '--posX': '0%', '--posY': '0%', duration: 0.4, ease: 'power3.out', overwrite: true });
  };
  const onLeave = (e) => {
    const el = e.target.closest?.('.btn--pill');
    if (!el || el.contains(e.relatedTarget)) return;
    gsap.to(el, { ...side(el, e), duration: 0.4, ease: 'power3.out', overwrite: true });
  };
  document.addEventListener('pointerover', onEnter);
  document.addEventListener('pointerout', onLeave);
  return () => {
    document.removeEventListener('pointerover', onEnter);
    document.removeEventListener('pointerout', onLeave);
  };
}

/* ---------- Valores: foto que segue o mouse e troca por termo ---------- */
export function setupValuesHover() {
  if (!fineHover()) return () => {};
  const section = document.querySelector('.s-values');
  const follow = section.querySelector('.s-values__follow');
  const imgs = follow.querySelectorAll('img');
  const cursor = document.getElementById('cursor');
  const xTo = gsap.quickTo(follow, 'x', { duration: 0.6, ease: 'power3' });
  const yTo = gsap.quickTo(follow, 'y', { duration: 0.6, ease: 'power3' });
  let current = -1;

  const onMove = (e) => {
    const r = section.getBoundingClientRect();
    xTo(e.clientX - r.left - follow.offsetWidth / 2);
    yTo(e.clientY - r.top - follow.offsetHeight);
  };
  const onEnterSection = () => {
    gsap.to(cursor, { scale: 0, opacity: 0, duration: 0.33, ease: 'power2.out' });
    gsap.fromTo(follow, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.33, ease: 'power2.out', transformOrigin: 'bottom center' });
  };
  const onLeaveSection = () => {
    gsap.to(follow, { scale: 0, opacity: 0, duration: 0.33, ease: 'power2.out' });
    gsap.to(cursor, { scale: 1, opacity: 1, duration: 0.33, ease: 'power2.out' });
  };
  const show = (i) => {
    if (i === current) return;
    follow.querySelector('.is-prev')?.classList.remove('is-prev');
    const on = follow.querySelector('.is-on');
    if (on) { on.classList.add('is-prev'); on.classList.remove('is-on'); }
    imgs[i].classList.add('is-on');
    gsap.fromTo(imgs[i], { '--clip': '100% 0% 0% 0%' }, { '--clip': '0% 0% 0% 0%', duration: 1.25, ease: 'power3.out' });
    gsap.fromTo(imgs[i], { scale: 2 }, { scale: 1, duration: 2, ease: 'power2.out' });
    current = i;
  };
  const termHandlers = [...section.querySelectorAll('.s-values__term')].map((t, i) => {
    const h = () => show(i);
    t.addEventListener('pointerenter', h);
    return () => t.removeEventListener('pointerenter', h);
  });
  section.addEventListener('pointermove', onMove);
  section.addEventListener('pointerenter', onEnterSection);
  section.addEventListener('pointerleave', onLeaveSection);
  return () => {
    termHandlers.forEach((off) => off());
    section.removeEventListener('pointermove', onMove);
    section.removeEventListener('pointerenter', onEnterSection);
    section.removeEventListener('pointerleave', onLeaveSection);
  };
}
