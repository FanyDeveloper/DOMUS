// Uma única estratégia de rolagem suave: Lenis dirigido pelo ticker do GSAP.
// A referência carrega ScrollSmoother mas quem roda de fato é o Lenis (main.js, setSmooth);
// aqui o ScrollSmoother nem é importado.
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

let lenis = null;
const raf = (time) => lenis?.raf(time * 1000);

export function startSmooth() {
  if (lenis) return lenis;
  lenis = new Lenis();
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(raf);
  gsap.ticker.lagSmoothing(0);
  return lenis;
}

export function stopSmooth() {
  if (!lenis) return;
  gsap.ticker.remove(raf);
  lenis.destroy();
  lenis = null;
  gsap.ticker.lagSmoothing(500, 33);
}

export const lockScroll = (on) => {
  if (lenis) on ? lenis.stop() : lenis.start();
  document.documentElement.style.overflow = on ? 'hidden' : '';
};

export function scrollToY(y, immediate = false) {
  if (lenis) lenis.scrollTo(y, { immediate, duration: 1.6 });
  else window.scrollTo({ top: y, behavior: immediate ? 'instant' : 'smooth' });
}

// Destinos dentro do trilho horizontal são convertidos em posição de scroll vertical.
let horizontal = null; // { st, track, dist }
export const setHorizontal = (h) => { horizontal = h; };

export function scrollToTarget(id) {
  const el = document.getElementById(id);
  if (!el) return;
  if (horizontal && horizontal.track.contains(el)) {
    const { st, dist } = horizontal;
    const x = Math.min(el.offsetLeft, dist());
    scrollToY(st.start + (x / dist()) * (st.end - st.start));
    return;
  }
  scrollToY(el.getBoundingClientRect().top + window.scrollY);
}
