import './styles/main.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { startSmooth, stopSmooth, lockScroll } from './lib/scroll.js';
import { runPreloader } from './anim/preloader.js';
import { buildIntro, buildHeaderReturn } from './anim/intro.js';
import { setupHorizontal } from './anim/horizontal.js';
import { setupVertical, setupStacked } from './anim/vertical.js';
import { setupMenu, setupNavigation, setupCursor, setupButtons, setupValuesHover } from './anim/interactions.js';

gsap.registerPlugin(ScrollTrigger, SplitText);

const reducedQuery = '(prefers-reduced-motion: reduce)';
const reducedAtStart = window.matchMedia(reducedQuery).matches;

// Entrada única por carregamento: o preloader roda uma vez; o resto se reconstrói por breakpoint.
let introPlayed = false;

async function boot() {
  history.scrollRestoration = 'manual';
  window.scrollTo(0, 0);
  // SplitText mede as linhas: todas as variações usadas precisam estar carregadas antes.
  await Promise.all([
    '400 1em Jost', '500 1em Jost',
    '400 1em "Bodoni Moda"', '500 1em "Bodoni Moda"', 'italic 400 1em "Bodoni Moda"',
    '200 1em "Newsreader Variable"', 'italic 200 1em "Newsreader Variable"',
  ].map((f) => document.fonts.load(f).catch(() => null)));
  await document.fonts.ready;
  const loaded = runPreloader({ reduced: reducedAtStart });

  const mm = gsap.matchMedia();
  mm.add({
    desktop: '(min-width: 951px)',
    mobile: '(max-width: 950px)',
    reduced: reducedQuery,
  }, (ctx) => {
    const { desktop, reduced } = ctx.conditions;
    const cleanups = [];

    if (desktop && !reduced) startSmooth();
    lockScroll(!introPlayed);

    const header = buildHeaderReturn();
    const menu = setupMenu({ desktop });
    cleanups.push(menu.destroy, setupNavigation(menu), setupButtons());
    if (desktop) cleanups.push(setupCursor(), setupValuesHover());

    // Desktop: trilho horizontal fixado. Abaixo de 951px (ou com movimento reduzido) as seções se empilham.
    const horizontal = desktop;
    if (horizontal) cleanups.push(setupHorizontal({ header, reduced }));
    else setupStacked({ header });
    if (!reduced) setupVertical();

    const finish = () => {
      introPlayed = true;
      lockScroll(false);
      ScrollTrigger.refresh();
    };
    if (reduced) {
      gsap.set('.hdr__logo', { width: '100%', height: '100%', fontSize: '1.65rem', autoAlpha: desktop ? 0 : 1 });
      if (desktop) gsap.set('.s-intro__logo', { opacity: 1 });
      header.btnTl.progress(1);
      finish();
    } else {
      const intro = buildIntro({ desktop, onComplete: finish });
      if (introPlayed) intro.progress(1);
      else loaded.then(() => intro.play());
    }

    return () => {
      cleanups.forEach((fn) => fn?.());
      if (desktop) stopSmooth();
    };
  });
}

boot();
