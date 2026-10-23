// Marcação da página. Cada função é um componente que devolve HTML a partir do conteúdo.
import * as c from './content.js';

const media = ({ src, alt }, cls = '', eager = false) =>
  `<div class="media ${cls}"><img class="media__img" src="${src}" alt="${alt}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async"></div>`;

// Duas imagens empilhadas: a de cima é removida pelo scroll e revela a de baixo.
const flip = ({ dir, start, duration, down, up }, cls = '', eager = false) => `
  <div class="flip flip--${dir} ${cls}" data-start="${start ?? ''}" data-duration="${duration ?? 1.5}">
    ${media(down, 'flip__down', eager)}
    ${media(up, 'flip__up', eager)}
  </div>`;

// "|" no texto vira um espaço largo, como os <span> vazios das linhas da referência.
const gap = (s) => s.replace(' | ', ' <span class="gap" aria-hidden="true"></span> ');

export const logo = (cls = '') => `
  <div class="logo ${cls}">
    <div class="logo__top">${c.brand.top}</div>
    <div class="logo__group">
      <div class="logo__mid">${c.brand.mid}</div>
      <div class="logo__bottom">${c.brand.bottom}<span class="logo__reg">®</span></div>
    </div>
  </div>`;

const header = () => `
  <header class="hdr" aria-label="Cabeçalho">
    <a class="hdr__home" href="#top" aria-label="${c.brand.top} — início">${logo('hdr__logo')}</a>
    <button class="hdr__btn btn btn--pill" type="button" aria-expanded="false" aria-controls="menu"><span><span class="hdr__btn-label">Menu</span></span></button>
    <div class="hdr__percent" aria-hidden="true">0%</div>
    <div class="hdr__progress" aria-hidden="true"></div>
  </header>
  <div class="menu" id="menu" hidden>
    <div class="menu__bg"></div>
    <nav class="menu__site" aria-label="Principal">
      <ul>${c.nav.map((n) => `<li><a class="menu__link" href="#${n.target}" data-target="${n.target}"${n.action ? ` data-action="${n.action}"` : ''}><span>${n.label}</span></a></li>`).join('')}</ul>
    </nav>
    <div class="menu__media">
      <div class="menu__media-title">${c.projects.items[0].title}</div>
      ${media({ src: c.projects.items[0].img, alt: '' }, 'menu__media-img')}
    </div>
    <div class="menu__projects">
      <h2 class="menu__projects-title">Projetos</h2>
      <ul>${c.projects.items.map((p, i) => `
        <li class="${p.disabled ? 'is-disabled' : ''}"><a href="#projetos" data-target="projetos">
          <span class="menu__num">(${i + 1})</span><span class="menu__name">${p.title}</span><span class="menu__place">${p.disabled ? 'Em breve' : p.place}</span>
        </a></li>`).join('')}</ul>
    </div>
    <a class="menu__mail" href="mailto:${c.brand.email}">${c.brand.email}</a>
  </div>`;

const intro = () => `
  <div class="s-intro" id="top">
    <div class="s-intro__wrap">
      <ul class="s-intro__menu" aria-label="Atalhos">${c.nav.map((n) => `<li><a href="#${n.target}" data-target="${n.target}"${n.action ? ` data-action="${n.action}"` : ''}>${n.label}</a></li>`).join('')}</ul>
      <div class="s-intro__copy">${c.brand.top} ${c.brand.mid} ${c.brand.bottom} ©${c.brand.year}</div>
      <div class="s-intro__content">
        <h1 class="s-intro__titles">${c.intro.titles.map((t) => `<span class="s-intro__title">${t.join('<br>')}</span>`).join('')}</h1>
        <p class="s-intro__text">${c.intro.text}</p>
      </div>
      ${logo('s-intro__logo')}
    </div>
  </div>
  <div class="s-images s-images--main">
    ${media(c.heroImages.single, 's-images__single', true)}
    ${flip({ dir: 'upDown', duration: 1.2, down: c.heroImages.flip[0], up: c.heroImages.flip[1] }, 's-images__flip', true)}
  </div>`;

const about = () => `
  <div class="s-text" id="sobre">
    <div class="s-text__label section-label">${c.about.section}</div>
    <div class="s-text__wrap">
      <h2 class="s-text__title">${c.about.lines.map((l, i) => `<span class="s-text__line${i === 3 ? ' is-right' : ''}"><span class="s-text__cont">${gap(l)}</span></span>`).join('')}</h2>
      <p class="s-text__p">${c.about.text}</p>
    </div>
  </div>`;

const imagesText = () => `
  <div class="s-imgtext">
    ${c.imagesText.flips.map((f) => flip(f, 's-imgtext__flip')).join('')}
    <p class="s-imgtext__p">${c.imagesText.text}</p>
  </div>`;

const marquee = () => {
  const item = `<span class="s-marquee__item"><span>${c.marquee}</span><svg class="s-marquee__star" viewBox="0 0 40 40" aria-hidden="true"><path d="M20 0v40M0 20h40M5.86 5.86l28.28 28.28M34.14 5.86 5.86 34.14" stroke="currentColor" stroke-width="1.2" fill="none"/></svg></span>`;
  return `<div class="s-marquee" aria-label="${c.marquee}"><div class="s-marquee__content" aria-hidden="true"><div class="s-marquee__run">${item.repeat(3)}</div><div class="s-marquee__run">${item.repeat(3)}</div></div></div>`;
};

const imagesSecondary = () => `
  <div class="s-images s-images--secondary">
    ${c.imagesSecondary.map((f) => flip(f, 's-images__flip')).join('')}
  </div>`;

const values = () => `
  <div class="s-values">
    ${c.values.map((v, i) => `
      <div class="s-values__term" data-index="${i}">
        <p class="s-values__text">${v.text}</p>
        <div class="s-values__head">
          <span class="s-values__num">${v.num}</span>
          <h3 class="s-values__title f-${v.font}"><span>${v.title}</span></h3>
        </div>
      </div>`).join('')}
    <div class="s-values__follow" aria-hidden="true">${c.values.map((v) => `<img src="${v.img}" alt="" loading="lazy">`).join('')}</div>
  </div>`;

const projects = () => `
  <div class="s-projects" id="projetos">
    <div class="s-projects__intro">
      <div class="section-label">${c.projects.section}</div>
      <p class="s-projects__text">${c.projects.text}</p>
    </div>
    ${c.projects.items.map((p, i) => `
      <article class="s-projects__item bg-${p.bg}">
        <div class="s-projects__inner">
          ${media({ src: p.img, alt: `Projeto ${p.title}` }, 's-projects__img')}
          <div class="s-projects__info">
            <div class="s-projects__data">
              <div><span>${p.year}</span></div>
              <div><span>${p.place}</span></div>
              <div class="s-projects__n">0${i + 1}</div>
              <div><a class="btn btn--pill btn--inv bg-${p.bg}${p.disabled ? ' is-disabled' : ''}" ${p.disabled ? 'aria-disabled="true"' : 'href="#contato" data-target="contato"'}><span>${p.link}</span></a></div>
            </div>
            <h3 class="s-projects__title f-${p.font}">${p.title}</h3>
          </div>
        </div>
      </article>`).join('')}
  </div>
  <div class="s-last">
    <div class="s-last__pin">
      <div class="s-last__gallery">
        ${c.projects.last.gallery.map((g) => media(g, 's-last__img')).join('')}
        <a class="s-last__all bg-blue" href="#projetos" data-target="projetos"><span>Ver todos</span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 19 19 5M8 5h11v11" stroke="currentColor" stroke-width="1" fill="none"/></svg></a>
      </div>
      <div class="s-last__content">
        <div class="section-label">${c.projects.last.section}</div>
        <h2 class="s-last__title">${c.projects.last.lines.map((l, i) => `<span class="s-last__line${i > 1 ? ' is-right' : ''}">${gap(l)}</span>`).join('')}</h2>
        <p class="s-last__p">${c.projects.last.text}</p>
      </div>
    </div>
  </div>
  <div class="s-closing">
    <div class="s-closing__pin">
      ${flip({ dir: 'upDown', duration: 1.5, down: c.closing.flip[0], up: c.closing.flip[1] }, 's-closing__flip')}
    </div>
  </div>`;

const contact = () => `
  <section class="v-title" id="contato">
    <div class="v-title__pre">${c.contact.pretitle}</div>
    <h2 class="v-title__h">${c.contact.title.map((t) => `<span class="v-title__line">${t}</span>`).join('')}</h2>
  </section>
  <section class="v-media">
    ${media(c.contact.media[0], 'v-media__a reveal-media')}
    ${media(c.contact.media[1], 'v-media__b reveal-media')}
  </section>
  <section class="v-lines">
    ${c.contact.lines.map((l, i) => `<span class="v-lines__line${i === 2 ? ' is-right' : ''}"><span>${l}</span></span>`).join('')}
  </section>
  <section class="v-content">
    <div class="v-content__text">
      <p>${c.contact.text}</p>
      <p><a href="mailto:${c.brand.email}"><strong>${c.brand.email}</strong></a></p>
    </div>
  </section>
  <section class="v-cta">
    <button class="btn btn--pill btn--xl" type="button" data-action="contact"><span>${c.contact.cta}</span></button>
  </section>`;

const footer = () => `
  <footer class="ftr">
    <div class="ftr__links">${c.footer.links.map((l) => `<a class="link" href="${l.includes('@') ? `mailto:${l}` : '#'}">${l}</a>`).join('<span aria-hidden="true">|</span>')}<span aria-hidden="true">|</span></div>
    <div class="ftr__content">
      <div class="ftr__word" aria-hidden="true">${[...c.footer.word].map((ch) => `<span>${ch}</span>`).join('')}</div>
      <div class="ftr__project">
        <div class="ftr__year">${c.footer.project.year}</div>
        <a class="ftr__img-wrap expand" href="#projetos" data-target="projetos" data-cursor="Explorar">${media({ src: c.footer.project.img, alt: `Projeto ${c.footer.project.name}` }, 'ftr__img')}</a>
        <div class="ftr__name">${c.footer.project.name}</div>
        <p class="ftr__text">${c.footer.project.text.map((t) => `<span class="ftr__text-line"><span>${t}</span></span>`).join('')}</p>
      </div>
    </div>
    <div class="ftr__bottom">
      <div>${c.brand.top} ${c.brand.mid} ${c.brand.bottom} ©${c.brand.year}</div>
      <ul>${c.footer.legal.map((l) => `<li><a href="#">${l}</a></li>`).join('')}</ul>
    </div>
  </footer>`;

const contactModal = () => `
  <dialog class="modal" id="contact-modal" aria-labelledby="modal-title">
    <form class="modal__form" method="dialog">
      <button class="modal__close" type="submit" value="close" aria-label="Fechar"><span></span><span></span></button>
      <div class="modal__pre">(Contato)</div>
      <h2 class="modal__title" id="modal-title">Desbloqueie<br>seu sonho</h2>
      <div class="modal__fields">
        ${['Nome', 'Telefone', 'Email', 'Mensagem'].map((f) => `<label class="modal__field"><span>${f}</span><input name="${f.toLowerCase()}" ${f === 'Email' ? 'type="email"' : 'type="text"'} required></label>`).join('')}
      </div>
      <label class="modal__check"><input type="checkbox" required> Aceito a Política de Privacidade e o Aviso Legal</label>
      <button class="btn btn--pill modal__send" type="button" data-send>Enviar</button>
      <p class="modal__status" role="status" aria-live="polite"></p>
    </form>
  </dialog>`;

// Gerado em tempo de build (vite.config.js), então o HTML já chega pronto: sem JS o conteúdo continua visível.
export function renderPage() {
  return `
    <div id="cursor" aria-hidden="true"><div><span></span></div></div>
    ${header()}
    <main id="main">
      <section class="hscroll" aria-label="Apresentação">
        ${intro()}${about()}${imagesText()}${marquee()}${imagesSecondary()}${values()}${projects()}
      </section>
      ${contact()}
      ${footer()}
    </main>
    ${contactModal()}`;
}
