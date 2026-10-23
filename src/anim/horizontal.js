// Trilho horizontal do desktop (scroll.js da referência) e as animações que dependem dele.
// Todas as animações internas usam `containerAnimation`, então os pontos de início/fim
// ("100% 100%", "0% 75%"…) se referem ao eixo X, exatamente como no original.
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { setHorizontal } from '../lib/scroll.js';
import { linesUp } from './intro.js';
import { setupFlips, flipTimeline } from './flips.js';

const MAX_W = 60;   // largura do projeto aberto (vw)
const H_ITEM = 33.33;

export function setupHorizontal({ header, reduced }) {
  const track = document.querySelector('.hscroll');
  const sections = gsap.utils.toArray(track.children);
  const scrub = reduced ? true : 1;

  // Larguras que a própria animação altera ficam congeladas antes de medir o trilho.
  const values = track.querySelector('.s-values');
  gsap.set(values, { width: values.offsetWidth + window.innerWidth * 0.64 });
  const items = gsap.utils.toArray('.s-projects__item');

  // Comprimento do trilho medido com todos os projetos abertos (largura final);
  // offsetWidth ignora os transforms, então a medida não muda durante o scroll.
  let projTl = null;
  const dist = () => {
    const p = projTl?.progress() ?? 0;
    projTl?.progress(1, true);
    const w = sections.reduce((sum, s) => sum + s.offsetWidth, 0);
    projTl?.progress(p, true);
    return w - window.innerWidth;
  };
  const scrollTl = gsap.timeline({ paused: true });
  scrollTl.to(sections, { x: () => -dist(), ease: 'none', duration: 100 });

  const st = ScrollTrigger.create({
    animation: scrollTl,
    trigger: track,
    pin: true,
    scrub,
    start: 'top top',
    end: () => `+=${dist()}`,
    invalidateOnRefresh: true,
  });
  setHorizontal({ st, track, dist });
  const ca = { containerAnimation: scrollTl };

  // Logo pequeno + botão Menu depois que a intro sai da tela.
  ScrollTrigger.create({
    ...ca, trigger: '.s-intro', start: '125% 0%',
    onEnter: () => { header.logoIn(); header.btnTl.timeScale(1).play(); },
    onEnterBack: () => { header.logoOut(); header.btnTl.timeScale(1.75).reverse(); },
  });

  // Foto principal: volta de -15vw para 0 conforme entra.
  gsap.fromTo('.s-images--main .s-images__single', { x: '-15vw' }, {
    x: '0vw', ease: 'none',
    scrollTrigger: { ...ca, trigger: '.s-images--main', start: '0% 78%', end: '90% 100%', scrub: 0.5 },
  });

  setupFlips({ ca, reduced });

  // "Casas que convidam…": a última linha corre da esquerda até alinhar à direita (scrub 0).
  const lastLine = track.querySelector('.s-text__line.is-right');
  const cont = lastLine.querySelector('.s-text__cont');
  gsap.from(cont, {
    x: () => -(lastLine.offsetWidth - cont.offsetWidth), ease: 'power1.inOut',
    scrollTrigger: { ...ca, trigger: '.s-text', start: '0% 50%', end: '100% 50%', scrub: true, invalidateOnRefresh: true },
  });

  // Parágrafo sobre fundo preto: linhas acendem de .2 para 1 conforme o scroll.
  const p = track.querySelector('.s-imgtext__p');
  const pSplit = SplitText.create(p, { type: 'lines', aria: 'auto' });
  gsap.from(pSplit.lines, {
    opacity: 0.2, duration: 0.2, stagger: 0.1,
    scrollTrigger: { ...ca, trigger: p, start: '0% 75%', end: '0% 25%', scrub: true },
  });

  // Faixa "Valores": gira -90° e sobe de 175vh com scrub .5; o letreiro corre em CSS.
  const marquee = track.querySelector('.s-marquee__content');
  gsap.set(marquee, { rotation: -90, y: () => window.innerHeight, transformOrigin: 'top left' });
  gsap.from(marquee, {
    y: () => window.innerHeight * 1.8, ease: 'none',
    scrollTrigger: { ...ca, trigger: '.s-marquee', start: '0% 95%', end: '100% 0%', scrub: 0.5, invalidateOnRefresh: true },
  });

  setupValues(ca);
  // Os blocos depois dos projetos mudam de posição quando os cards abrem:
  // recalculamos os gatilhos deles ao sair/voltar do acordeão (como a referência faz).
  let late = [];
  const refreshLate = () => late.forEach((t) => t.refresh());
  projTl = setupProjects(ca, items, refreshLate);
  late = [setupLastItem(ca, items.at(-1)), ...setupLast(ca), ...setupClosing(ca)];
  ScrollTrigger.addEventListener('refresh', refreshLate);
  st.refresh();

  return () => {
    ScrollTrigger.removeEventListener('refresh', refreshLate);
    setHorizontal(null);
  };
}

function setupValues(ca) {
  const el = document.querySelector('.s-values');
  const terms = el.querySelectorAll('.s-values__term');

  // Parallax de espaçamento entre os três termos (scrub 1), com o dobro da amplitude da referência.
  const tl = gsap.timeline();
  tl.to(terms[0], { paddingLeft: '24vw' }, 0)
    .to(terms[1], { paddingRight: '6vw' }, 0)
    .to(terms[1].querySelector('.s-values__text'), { marginRight: '6vw' }, 0)
    .to(terms[2], { paddingLeft: '40vw' }, 0);
  ScrollTrigger.create({ ...ca, animation: tl, trigger: el, start: '0% 100%', end: '100% 0%', scrub: 1 });
}

function setupProjects(ca, items, onBoundary) {
  // Acordeão horizontal: cada projeto abre de 15vw para 60vw e a foto baixa de 87vh para 66vh.
  const tl = gsap.timeline();
  items.forEach((item, i) => {
    const title = item.querySelector('.s-projects__title');
    const data = item.querySelectorAll('.s-projects__data > div:not(.s-projects__n)');
    const split = SplitText.create(title, { type: 'lines,chars', linesClass: 'split-mask', aria: 'auto' });

    const text = gsap.timeline({ paused: true, delay: 0.1 });
    text.fromTo(data[0].firstElementChild, { y: '100%' }, { y: '0%', duration: 0.33, ease: 'power2.out' }, 0)
      .fromTo(data[1].firstElementChild, { y: '100%' }, { y: '0%', duration: 0.33, ease: 'power2.out' }, 0.2)
      .fromTo(data[2].firstElementChild, { y: '100%', opacity: 0 }, { y: '0%', opacity: 1, duration: 0.33, ease: 'power2.out' }, 0.4)
      .fromTo(split.chars, { y: '100%' }, { y: '0%', duration: 0.25, ease: 'power2.out', stagger: 0.05 }, 0.5);

    tl.to(item, {
      '--open': 1, duration: 0.005,
      onComplete: () => { text.timeScale(1).play(); },
      onReverseComplete: () => { text.timeScale(2.5).reverse(); },
    }, i + 0.5);
    tl.fromTo(item, { width: '15vw' }, { width: `${MAX_W}vw`, duration: 1, ease: 'power1.inOut' }, i);
    tl.fromTo(item.querySelector('.s-projects__img'), { height: '87vh' }, { height: `${H_ITEM * 2}vh`, duration: 1, ease: 'power1.inOut' }, i);
  });
  ScrollTrigger.create({
    ...ca, animation: tl, trigger: items[0], start: '0% 80%', end: `+=${MAX_W * items.length}%`, scrub: true,
    onLeave: onBoundary, onEnterBack: onBoundary,
  });

  const intro = document.querySelector('.s-projects__text');
  const tlText = gsap.timeline({ paused: true });
  linesUp(intro, tlText, 0);
  ScrollTrigger.create({ ...ca, trigger: intro, start: 'left 75%', onEnter: () => tlText.play() });
  return tl;
}

// "Fixa" um bloco dentro do trilho: o conteúdo anda para a direita na mesma velocidade
// com que o trilho anda para a esquerda (como mod-scroll__pin / cierre na referência).
function pinInside(ca, section, inner, extra) {
  const tl = gsap.timeline();
  tl.fromTo(inner, { x: 0 }, { x: extra, ease: 'none' });
  return ScrollTrigger.create({ ...ca, animation: tl, trigger: section, start: 'left left', end: 'right right', scrub: true });
}

// Último projeto (Lote 43): depois de aberto fica parado na esquerda, encolhe para a largura
// da galeria (como o last-item da referência) e, quando a galeria sobe, sai para cima sumindo.
function setupLastItem(ca, item) {
  const inner = item.querySelector('.s-projects__inner');
  const vw = window.innerWidth;
  const shrink = vw * 0.175; // 60vw → 42.5vw
  const tl = gsap.timeline();
  tl.fromTo(item, { x: 0 }, { x: vw * 1.2, ease: 'none', duration: 1.6 }, 0)
    .fromTo(item, { clipPath: 'inset(0px 0px 0px 0px)' }, { clipPath: `inset(0px ${shrink}px 0px 0px)`, ease: 'none', duration: 0.8 }, 0)
    .fromTo(inner, { width: '60vw' }, { width: '42.5vw', ease: 'none', duration: 0.8 }, 0)
    .to(item, { scale: 0.85, transformOrigin: '21.25vw 0%', ease: 'power1.in', duration: 0.8 }, 0.8)
    .to(item, { yPercent: -100, autoAlpha: 0, ease: 'power1.in', duration: 0.8 }, 0.8);
  return ScrollTrigger.create({
    // Medido pela .s-last (logo depois do card) para o gatilho não depender do próprio x animado.
    ...ca, animation: tl, trigger: '.s-last', start: 'left 60%', end: 'left -60%', scrub: true,
  });
}

function setupLast(ca) {
  const section = document.querySelector('.s-last');
  const pin = section.querySelector('.s-last__pin');
  const gallery = section.querySelector('.s-last__gallery');
  const pinSt = pinInside(ca, section, pin, () => section.offsetWidth - window.innerWidth);

  // A coluna de fotos sobe enquanto o bloco está fixo.
  const kids = gallery.children;
  const galleryTw = gsap.fromTo(kids, { y: '100vh' }, {
    y: () => -(gallery.scrollHeight - gallery.offsetHeight), ease: 'none',
    scrollTrigger: { ...ca, trigger: section, start: 'left left', end: 'right right', scrub: true, invalidateOnRefresh: true },
  });
  const zoomTw = gsap.from(section.querySelectorAll('.s-last__img .media__img'), {
    scale: 1.2, ease: 'none',
    scrollTrigger: { ...ca, trigger: section, start: 'left left', end: 'right right', scrub: true },
  });

  // Título com letras alternando direção + parágrafo em linhas.
  const tl = gsap.timeline({ paused: true });
  tl.from(section.querySelector('.section-label'), { opacity: 0, y: '100%', duration: 0.33 });
  section.querySelectorAll('.s-last__line').forEach((line, i) => {
    const s = SplitText.create(line, { type: 'chars', charsClass: 'char', aria: 'auto' });
    line.classList.add('split-mask');
    tl.from(s.chars, { y: i % 2 ? '-110%' : '110%', duration: 0.65, stagger: 0.03, ease: 'power3.out' }, '<+=.2');
  });
  linesUp(section.querySelector('.s-last__p'), tl, '<+=.33');
  const textSt = ScrollTrigger.create({
    ...ca, trigger: section, start: 'left 40%',
    onEnter: () => tl.timeScale(1).play(), onLeaveBack: () => tl.timeScale(2).reverse(),
  });
  return [pinSt, galleryTw.scrollTrigger, zoomTw.scrollTrigger, textSt];
}

function setupClosing(ca) {
  const section = document.querySelector('.s-closing');
  const pin = section.querySelector('.s-closing__pin');
  const pinSt = pinInside(ca, section, pin, () => section.offsetWidth - window.innerWidth);
  // Parallax de entrada: as camadas da imagem chegam deslocadas (x -100% → 0).
  const inTw = gsap.from(section.querySelectorAll('.s-closing__flip > .media'), {
    x: '-100%', ease: 'none',
    scrollTrigger: { ...ca, trigger: section, start: 'left 100%', end: 'left 0%', scrub: 0.1 },
  });
  // A foto de cima sobe e revela a de baixo durante a primeira metade do bloco fixo.
  const flipSt = ScrollTrigger.create({
    ...ca, animation: flipTimeline(section.querySelector('.s-closing__flip')),
    trigger: section, start: '0% 0%', end: '+=50%', scrub: 0.33,
  });
  return [pinSt, inTw.scrollTrigger, flipSt];
}

