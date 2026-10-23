// Parte vertical depois do trilho (contato, títulos, rodapé) e a versão empilhada
// das seções do trilho usada em telas ≤950px.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { linesUp } from './intro.js';
import { setupFlips, flipTimeline } from './flips.js';

const onEnter = (trigger, tl, start = 'top 80%') =>
  ScrollTrigger.create({ trigger, start, onEnter: () => tl.play() });

export function setupVertical() {
  // "Desbloqueie seu sonho": letras por linha, alternando direção.
  const title = document.querySelector('.v-title__h');
  const tTitle = gsap.timeline({ paused: true });
  tTitle.from('.v-title__pre', { opacity: 0, y: '100%', duration: 0.5, ease: 'power3.out' });
  title.querySelectorAll('.v-title__line').forEach((line, i) => {
    const s = SplitText.create(line, { type: 'chars', charsClass: 'char', aria: 'auto' });
    line.classList.add('split-mask');
    tTitle.from(s.chars, { y: i % 2 ? '-110%' : '110%', duration: 0.9, stagger: 0.04, ease: 'power3.out' }, 0.15 + i * 0.1);
  });
  onEnter(title, tTitle);

  // Fotos: máscara abre de baixo para cima e a imagem assenta (estimado a partir do vídeo).
  document.querySelectorAll('.reveal-media').forEach((m, i) => {
    const tl = gsap.timeline({ paused: true, delay: i * 0.2 });
    tl.from(m, { '--clip': '100% 0% 0% 0%', duration: 1.2, ease: 'power3.out' })
      .from(m.querySelector('.media__img'), { scale: 1.2, duration: 1.6, ease: 'power3.out' }, 0);
    onEnter(m, tl, 'top 90%');
  });

  // "Exclusividade em / sua máxima / expressão": linhas sobem.
  const lines = gsap.utils.toArray('.v-lines__line > span');
  const tLines = gsap.timeline({ paused: true });
  tLines.from(lines, { y: '105%', duration: 0.9, stagger: 0.12, ease: 'power3.out' });
  onEnter('.v-lines', tLines);

  const tText = gsap.timeline({ paused: true });
  linesUp(document.querySelector('.v-content__text p'), tText, 0, { stagger: 0.06 });
  onEnter('.v-content', tText);

  // Rodapé: a referência transforma as letras gigantes com MorphSVG (formas estreitas → largas).
  // Sem os SVGs originais, reproduzimos o mesmo gesto esticando cada letra no eixo Y (scrub 2).
  gsap.fromTo('.ftr__word span', { scaleY: 0.25 }, {
    scaleY: 1, ease: 'none', stagger: 0.04,
    scrollTrigger: { trigger: '.ftr__word', start: 'top 50%', end: 'bottom bottom', scrub: 2 },
  });

  const proj = document.querySelector('.ftr__project');
  const tProj = gsap.timeline({ paused: true });
  const name = SplitText.create(proj.querySelector('.ftr__name'), { type: 'chars', aria: 'auto' });
  tProj.from(proj.querySelector('.ftr__year'), { y: '100%', opacity: 0, duration: 0.55, ease: 'power3.out' }, 0)
    .from(name.chars, { y: '-100%', duration: 0.65, stagger: 0.025, ease: 'power3.out' }, 0.33)
    .from(proj.querySelectorAll('.ftr__text-line > span'), { y: '-100%', duration: 0.5, stagger: 0.15, ease: 'power3.out' }, 0.66);
  ScrollTrigger.create({ trigger: '.ftr__img-wrap', start: 'bottom 75%', onEnter: () => tProj.play() });
}

// Celular/tablet: seções empilhadas, mesmas animações, gatilhos verticais (referência: is_mobile).
export function setupStacked({ header }) {
  ScrollTrigger.create({ trigger: '.s-intro', start: 'bottom top', onEnter: () => header.btnTl.play(), onLeaveBack: () => header.btnTl.reverse() });
  header.btnTl.play();

  setupFlips({});

  const about = document.querySelector('.s-text__title');
  const tAbout = gsap.timeline({ paused: true });
  about.querySelectorAll('.s-text__line').forEach((l) => l.classList.add('split-mask'));
  tAbout.from(about.querySelectorAll('.s-text__cont'), { y: '105%', duration: 0.8, stagger: 0.1, ease: 'power3.out' });
  onEnter(about, tAbout);

  const p = document.querySelector('.s-imgtext__p');
  const pSplit = SplitText.create(p, { type: 'lines', aria: 'auto' });
  gsap.from(pSplit.lines, { opacity: 0.2, stagger: 0.1, scrollTrigger: { trigger: p, start: 'top 75%', end: 'bottom 50%', scrub: true } });

  // Faixa "Valores" desliza na horizontal (x 0 → -3em).
  gsap.fromTo('.s-marquee__content', { x: 0 }, { x: '-3em', ease: 'none', scrollTrigger: { trigger: '.s-marquee', start: 'top bottom', end: 'bottom top', scrub: 0.5 } });

  // Projetos: a foto cresce de altura 0 e assenta (scale 1.5 → 1, y -15% → 0); ao terminar, entram os textos.
  gsap.utils.toArray('.s-projects__item').forEach((item) => {
    const img = item.querySelector('.s-projects__img');
    const data = item.querySelectorAll('.s-projects__data > div:not(.s-projects__n) > *');
    const split = SplitText.create(item.querySelector('.s-projects__title'), { type: 'lines,chars', linesClass: 'split-mask', aria: 'auto' });
    const text = gsap.timeline({ paused: true });
    text.from(data, { y: '100%', duration: 0.33, stagger: 0.2, ease: 'power2.out' })
      .from(split.chars, { y: '100%', duration: 0.25, stagger: 0.05, ease: 'power2.out' }, 0.5);
    const tl = gsap.timeline();
    tl.from(img, { height: 0, ease: 'power1.inOut' }, 0)
      .from(img.querySelector('.media__img'), { scale: 1.5, yPercent: -15, ease: 'power1.inOut' }, 0);
    ScrollTrigger.create({
      animation: tl, trigger: item, start: 'top 90%', end: 'top 25%', scrub: 0.25,
      onLeave: () => text.timeScale(1).play(), onEnterBack: () => text.timeScale(2).reverse(),
    });
  });

  const last = document.querySelector('.s-last__content');
  const tLast = gsap.timeline({ paused: true });
  last.querySelectorAll('.s-last__line').forEach((line, i) => {
    const s = SplitText.create(line, { type: 'chars', charsClass: 'char', aria: 'auto' });
    line.classList.add('split-mask');
    tLast.from(s.chars, { y: i % 2 ? '-110%' : '110%', duration: 0.65, stagger: 0.03, ease: 'power3.out' }, '<+=.2');
  });
  linesUp(last.querySelector('.s-last__p'), tLast, '<+=.33');
  onEnter(last, tLast, 'top 85%');

  document.querySelectorAll('.s-last__img').forEach((m) => {
    gsap.from(m.querySelector('.media__img'), { yPercent: -50, scale: 1.1, ease: 'power1.out', scrollTrigger: { trigger: m, start: 'top bottom', end: 'bottom bottom', scrub: 0.25 } });
  });

  const closing = document.querySelector('.s-closing__flip');
  ScrollTrigger.create({ animation: flipTimeline(closing), trigger: '.s-closing', start: 'top 50%', end: '+=100%', scrub: 0.33 });
}

