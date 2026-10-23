// Pré-carregamento (preloader.js da referência): o logo entra letra a letra (x 120% → 0,
// .5s, stagger .1, power3.out), a barra inferior e o percentual seguem o carregamento real das
// imagens com um contador "falso" que sobe 1% a cada 5ms sem ultrapassar o real.
import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';

export function splitLogo(logo) {
  const parts = logo.querySelectorAll('.logo__top, .logo__mid, .logo__bottom');
  const splits = [...parts].map((p) => SplitText.create(p, { type: 'chars', charsClass: 'char', aria: 'auto' }));
  logo.querySelectorAll('.char').forEach((ch) => { ch.innerHTML = `<span>${ch.innerHTML}</span>`; });
  return { inner: logo.querySelectorAll('.char > span'), revert: () => splits.forEach((s) => s.revert()) };
}

export function runPreloader({ reduced }) {
  const root = document.documentElement;
  const header = document.querySelector('.hdr');
  const logo = header.querySelector('.hdr__logo');
  const bar = header.querySelector('.hdr__progress');
  const percent = header.querySelector('.hdr__percent');

  if (reduced) {
    gsap.set(logo, { opacity: 1 });
    return Promise.resolve();
  }

  root.classList.add('is-loading');
  const { inner } = splitLogo(logo);
  gsap.set(logo, { opacity: 1 });

  return new Promise((resolve) => {
    let real = 0;
    let fake = 0;
    let logoDone = false;
    const srcs = [...new Set([...document.images].map((i) => i.currentSrc || i.src))];
    let loaded = 0;
    const onOne = () => { loaded++; real = Math.floor((100 / srcs.length) * loaded); };
    srcs.forEach((src) => { const im = new Image(); im.onload = im.onerror = onOne; im.src = src; });
    if (!srcs.length) real = 100;

    const logoTl = gsap.timeline({ paused: true, onComplete: () => { logoDone = true; } });
    logoTl.from(inner, { x: '120%', duration: 0.5, stagger: 0.1, ease: 'power3.out' });
    gsap.delayedCall(0.5, () => logoTl.play());

    const finish = () => {
      clearInterval(timer);
      percent.textContent = '100%';
      gsap.to(bar, { opacity: 0, duration: 0.5, ease: 'none' });
      gsap.to(percent, { opacity: 0, duration: 0.33, ease: 'none' });
      gsap.delayedCall(1.5, () => {
        root.classList.remove('is-loading');
        resolve();
      });
    };

    const timer = setInterval(() => {
      fake = Math.min(fake + 1, real, 100);
      bar.style.setProperty('--progress', `${fake}%`);
      if (fake > 1) percent.textContent = `${fake}%`;
      if (fake === 100 && logoDone) finish();
    }, 5);
  });
}
