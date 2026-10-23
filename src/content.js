// Conteúdo da página, separado da marcação e das animações.
// Os textos seguem a estrutura da referência (normalisboring.es) adaptada para DOMUS.
// As imagens são fotos do Unsplash (licença Unsplash) usadas como substitutas — não são as originais.

const img = (name) => `/images/${name}.jpg`;

export const brand = {
  // Logo em três partes, como na referência: palavra sans no canto superior esquerdo,
  // conectivo itálico e palavra serifada invertida (rotação 180°) no canto inferior direito.
  top: 'Domus',
  mid: 'é',
  bottom: 'lar',
  year: '2026',
  email: 'contato@domus.com.br',
};

export const nav = [
  { label: 'Sobre', target: 'sobre' },
  { label: 'Projetos', target: 'projetos' },
  { label: 'Contato', target: 'contato', action: 'contact' },
];

export const intro = {
  titles: [
    ['Espaços', 'de vida'],
    ['que', 'desafiam'],
    ['o', '<em>ordinário</em>'],
  ],
  text: 'Num mundo passageiro, em que o efêmero tomou conta de tudo, fazemos casas para durar mais e mais, preservar o meio ambiente, gerar valor e com uma qualidade atemporal que não se deixa levar por tendências.',
};

export const heroImages = {
  single: { src: img('hero-sala'), alt: 'Sala de estar ampla com janelas horizontais e sofá cinza' },
  flip: [
    { src: img('hero-flip-a'), alt: 'Sala clara com sofá branco e madeira' },
    { src: img('hero-flip-b'), alt: 'Sala com janelas em arco e lareira' },
  ],
};

export const about = {
  section: 'Sobre',
  lines: ['Casas que convidam', 'a | parar', 'o tempo', 'e desconectar'],
  text: 'Cada casa deve ser única e especial, assim como as pessoas que a habitam. Unimos design, sustentabilidade e qualidade de vida para oferecer algo verdadeiramente excepcional — um lar que inspire e melhore o dia a dia.',
};

export const imagesText = {
  flips: [
    { dir: 'rightLeft', start: '100% 70%', duration: 1.3,
      down: { src: img('nos-flip1-a'), alt: 'Sala com poltronas de couro e parede de quadros' },
      up: { src: img('nos-flip1-b'), alt: 'Sala em tons neutros com pendentes de palha' } },
    { dir: 'leftRight', start: '0% 70%', duration: 1.3,
      down: { src: img('nos-flip2-a'), alt: 'Banheiro com banheira solta e janela alta' },
      up: { src: img('nos-flip2-b'), alt: 'Quarto claro com portas de vidro' } },
  ],
  text: 'Na DOMUS construímos casas que se destacam pela qualidade e pelo desenho, com volumes contemporâneos, limpos e abertos para o exterior. Espaços que melhoram a vida de quem os habita, com mais conforto, mais sustentabilidade, mais beleza e mais emoção.',
};

export const marquee = 'Valores';

export const imagesSecondary = [
  { dir: 'rightLeft', start: '116% 100%', duration: 1.7,
    down: { src: img('sec-flip1-a'), alt: 'Fachada com madeira, vidro e jardim' },
    up: { src: img('sec-flip1-b'), alt: 'Casa moderna ao entardecer sob uma árvore' } },
  { dir: 'leftRight', start: '100% 100%', duration: 1.7,
    down: { src: img('sec-flip2-a'), alt: 'Fachada escura com ripas de madeira iluminadas' },
    up: { src: img('sec-flip2-b'), alt: 'Escada vazada diante de uma piscina' } },
];

export const values = [
  { num: '01', title: 'Elegância', font: 'edit', img: img('valor-elegancia'),
    text: 'Uma arquitetura sóbria e silenciosa, com sensibilidade estética que se manifesta em materiais como o carvalho e a pedra calcária, numa paleta de tons terrosos.' },
  { num: '02', title: 'Autenticidade', font: 'serif', img: img('valor-autenticidade'),
    text: 'Arquitetura elegante, sustentável e serena, criando espaços refinados, eficientes e harmoniosos que se integram ao entorno e promovem um luxo sereno.' },
  { num: '03', title: 'Funcionalidade', font: 'sans', img: img('valor-funcionalidade'),
    text: 'Espaços abertos, menos hierarquizados e com um enfoque mais pragmático. Zonas multifuncionais e flexíveis, com mais de um uso.' },
];

export const projects = {
  section: 'Projetos',
  text: 'O luxo não grita nem segue tendências estéticas banais: é silencioso, imperceptível, divertido e estimulante. Na DOMUS não queremos criar só casas, mas um estilo de vida.',
  items: [
    { title: 'Casa Solar', year: '2024', place: 'Florianópolis', bg: 'beige', font: 'serif', link: 'O projeto', img: img('proj-1') },
    { title: 'Praça 9', year: '2024', place: 'Curitiba', bg: 'grey', font: 'sans', link: 'O projeto', img: img('proj-2') },
    { title: 'Rua das Pitangas', year: '2023', place: 'Porto Alegre', bg: 'blue', font: 'edit', link: 'O projeto', img: img('proj-3') },
    { title: 'Juno', year: '2025', place: 'Campinas', bg: 'beige', font: 'serif', link: 'Em breve', disabled: true, img: img('proj-4') },
    { title: 'Lote 43', year: '2025', place: 'Atibaia', bg: 'grey', font: 'sans', link: 'Em breve', disabled: true, img: img('proj-5') },
  ],
  last: {
    gallery: [
      { src: img('proj-ultimo-a'), alt: 'Casa com volume em madeira e grande jardim' },
      { src: img('proj-ultimo-b'), alt: 'Sala com quadro e luminárias de mesa' },
    ],
    section: 'Projetos',
    lines: ['Quem disse', 'que o | prazer', 'não pode ser', 'funcional'],
    text: 'Criamos espaços que não se submetem às tendências, preferindo o caminho do artesanato, das oficinas locais, da sustentabilidade e do prazer de quem os ocupa. Espaços de calma, mas também para compartilhar.',
  },
};

export const closing = {
  flip: [
    { src: img('nos-flip2-a'), alt: 'Banheiro com banheira e janela alta' },
    { src: img('hero-flip-a'), alt: 'Sala clara com sofá branco e madeira' },
  ],
};

export const contact = {
  pretitle: '(Contato)',
  title: ['Desbloqueie', 'seu sonho'],
  media: [
    { src: img('contato-a'), alt: 'Poltrona amarela junto a um quadro' },
    { src: img('hero-flip-b'), alt: 'Sala com janelas em arco' },
  ],
  lines: ['Exclusividade em', 'sua máxima', 'expressão'],
  text: 'Na DOMUS, nossa prioridade é oferecer um atendimento personalizado e próximo para ajudar você a encontrar a casa perfeita. Nossa equipe está à disposição para tirar dúvidas e acompanhar cada etapa do processo.',
  cta: 'Solicitar informações',
};

export const footer = {
  word: 'DOMUS',
  project: { year: '(2024)', name: 'Casa Solar', text: ['Privacidade e exclusividade no coração', 'de um paraíso natural'], img: img('proj-1') },
  links: ['Instagram', 'contato@domus.com.br'],
  legal: ['Política de privacidade', 'Política de cookies', 'Aviso legal'],
};
