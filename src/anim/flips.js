// "flipMedia" da referência (main.js, setFlips): duas fotos empilhadas; a de cima sai
// (por clip-path ou deslocamento) enquanto a de baixo assenta (escala 1.2 → 1 ou y -10% → 0).
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function flipTimeline(el) {
  const d = parseFloat(el.dataset.duration) || 1.5;
  const up = el.querySelector('.flip__up');
  const downImg = el.querySelector('.flip__down .media__img');
  const tl = gsap.timeline({ paused: true });
  if (el.classList.contains('flip--leftRight')) {
    tl.to(up, { '--clip': '0% 100% 0% 0%', duration: d, ease: 'power2.out' }, 0);
    tl.from(downImg, { scale: 1.2, duration: d + 0.5, ease: 'power2.out' }, 0);
  } else if (el.classList.contains('flip--rightLeft')) {
    tl.to(up, { '--clip': '0% 0% 0% 100%', duration: d, ease: 'power2.out' }, 0);
    tl.from(downImg, { scale: 1.2, duration: d + 0.5, ease: 'power2.out' }, 0);
  } else {
    tl.to(up, { y: '-105%', duration: d, ease: 'power3.out' }, 0);
    tl.from(downImg, { y: '-10%', duration: d + 0.5, ease: 'power3.out' }, 0);
  }
  return tl;
}

// ca = { containerAnimation } no desktop; vazio no layout vertical.
export function setupFlips({ ca = {}, reduced } = {}) {
  document.querySelectorAll('.flip:not(.s-closing__flip)').forEach((el) => {
    const tl = flipTimeline(el);
    if (reduced) { tl.progress(1); return; }
    const horizontal = !!ca.containerAnimation;
    ScrollTrigger.create({
      ...ca,
      animation: tl,
      trigger: el,
      start: horizontal ? (el.dataset.start || '100% 100%') : 'top 85%',
      end: horizontal ? '+=75%' : 'bottom 40%',
      scrub: 0.35,
    });
  });
}
