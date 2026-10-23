// Entrada da página depois do preloader (scroll.js da referência, setScrollH → scroll_intro_tl).
import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';

// Títulos divididos em linhas e letras; linhas pares sobem de baixo (110%), ímpares descem de cima (-110%).
export function charsByLine(el, tl, position = '<+=.05', duration = 0.65, stagger = 0.03) {
  const split = SplitText.create(el, { type: 'lines,chars', linesClass: 'split-mask', charsClass: 'char', aria: 'auto' });
  split.lines.forEach((line, i) => {
    tl.from(line.querySelectorAll('.char'), { y: i % 2 ? '-110%' : '110%', duration, stagger, ease: 'power3.out' }, position);
  });
  return split;
}

// Parágrafo em linhas mascaradas que sobem 100% (.5s, stagger .09).
export function linesUp(el, tl, position, opts = {}) {
  const split = SplitText.create(el, { type: 'lines', linesClass: 'split-mask', aria: 'auto' });
  split.lines.forEach((l) => { l.innerHTML = `<span style="display:block">${l.innerHTML}</span>`; });
  tl.from(el.querySelectorAll('.split-mask > span'), { y: opts.from ?? '100%', duration: 0.5, stagger: opts.stagger ?? 0.09, ease: 'power3.out' }, position);
  return split;
}

export function buildIntro({ desktop, onComplete }) {
  const header = document.querySelector('.hdr');
  const hLogo = header.querySelector('.hdr__logo');
  const intro = document.querySelector('.s-intro');
  const introLogo = intro.querySelector('.s-intro__logo');

  const tl = gsap.timeline({ paused: true, onComplete });

  // O logo do centro se abre até os cantos: primeiro na largura, depois na altura.
  tl.to(hLogo, { width: '100%', fontSize: '1.65rem', duration: 1, ease: 'power2.in' }, 0.25);
  tl.to(hLogo, {
    height: '100%', duration: 1, ease: 'power2.out',
    onComplete: () => {
      if (!desktop) return;
      // No desktop o logo passa a viver dentro da intro e sai junto com ela pela esquerda.
      gsap.set(hLogo, { autoAlpha: 0 });
      gsap.set(introLogo, { opacity: 1 });
    },
    onReverseComplete: () => {
      gsap.set(hLogo, { autoAlpha: 1 });
      gsap.set(introLogo, { opacity: 0 });
    },
  }, '<+=1.75');

  intro.querySelectorAll('.s-intro__title').forEach((t) => charsByLine(t, tl));
  linesUp(intro.querySelector('.s-intro__text'), tl, '<+=.05');

  if (desktop) {
    // A intro encolhe de 100vw para 80vw e revela a foto seguinte, que também desliza.
    const wrap = intro.querySelector('.s-intro__wrap');
    const photo = document.querySelector('.s-images--main .s-images__single');
    tl.fromTo(wrap, { width: '100vw' }, { width: '80vw', duration: 1.25, ease: 'power3.out' }, '-=.5');
    tl.fromTo(photo, { x: '-5vw' }, { x: '-15vw', duration: 1.25, ease: 'power2.out' }, '<');
    tl.from(intro.querySelectorAll('.s-intro__menu li > a'), { y: '2.5rem', duration: 1, ease: 'power3.out', stagger: -0.15 }, '-=1');
  }
  tl.from(intro.querySelector('.s-intro__copy'), { opacity: 0, duration: 0.5, ease: 'none' }, '-=.5');
  return tl;
}

// Logo pequeno nos cantos + botão de menu (animations.js: header_logo_tl e header_btn_tl).
export function buildHeaderReturn() {
  const header = document.querySelector('.hdr');
  const hLogo = header.querySelector('.hdr__logo');
  const top = hLogo.querySelector('.logo__top');
  const group = hLogo.querySelector('.logo__group');
  const btn = header.querySelector('.hdr__btn');

  const logoIn = () => {
    gsap.killTweensOf([top, group]);
    gsap.set(hLogo, { autoAlpha: 1 });
    gsap.fromTo(top, { y: '-180%' }, { y: '0%', duration: 0.75, ease: 'power3.out' });
    gsap.fromTo(group, { y: '130%' }, { y: '0%', duration: 0.75, ease: 'power3.out' });
  };
  const logoOut = () => {
    gsap.killTweensOf([top, group]);
    gsap.to(top, { y: '-180%', duration: 0.25, ease: 'power2.in' });
    gsap.to(group, { y: '130%', duration: 0.25, ease: 'power2.in', onComplete: () => gsap.set(hLogo, { autoAlpha: 0 }) });
  };

  const btnTl = gsap.timeline({ paused: true, onStart: () => btn.classList.add('is-on'), onReverseComplete: () => btn.classList.remove('is-on') });
  btnTl.from(btn, { y: '-180%', duration: 0.5, ease: 'power3.out' });
  btnTl.from(btn.querySelector('span'), { opacity: 0, duration: 0.35, ease: 'none' }, '-=.25');

  return { logoIn, logoOut, btnTl };
}
