# Auditoria da referência e decisões de reconstrução

Referência: https://normalisboring.es (home). Fontes de observação:

- **Vídeo** `WhatsApp Video 2026-10-19 at 17.27.06.mp4` (84s, 464×368), analisado quadro a quadro (1 fps, com folhas de contato).
- **Código público do site**: HTML da home, `main.css` e os scripts do tema (`preloader.js`, `root.js`, `main.js`, `scroll.js`, `animations.js`, `clicks.js`, `rollovers.js`), baixados e lidos.
- **HAR** `normalisboring.es.har` (65 requisições, todas com o conteúdo das respostas). Ele chegou depois de a análise ter sido feita sobre os arquivos baixados do site. Conferi depois: os sete scripts do tema no HAR são **idênticos linha a linha** aos analisados. O HAR também confirma o carregamento de `swup@4.10.0`, da API do YouTube (modal de vídeo), das cinco fontes WOFF2 e do `asterisco.svg`.

Legenda: **[C]** confirmado no código · **[V]** observado no vídeo · **[E]** estimado/inferido.

---

## 1. Tecnologias da referência

| Recurso | Uso real na home | Situação aqui |
|---|---|---|
| GSAP 3.12.7 + ScrollTrigger | Motor de tudo; trilho horizontal com `containerAnimation` [C] | GSAP 3.13 |
| SplitText | Letras e linhas dos títulos, parágrafos e logo [C] | Usado |
| Lenis 1.3.1 | Rolagem suave no desktop, ligada ao `gsap.ticker` [C] | Usado (só desktop, como no original) |
| ScrollSmoother | Registrado, mas **não instanciado** [C] | Não usado: rodar os dois sistemas ao mesmo tempo seria um erro |
| MorphSVGPlugin | Logo gigante "BORING" do rodapé (letras B, O e R) [C] | Substituído (ver §5) |
| Swiper 8 | Só em `.mod-media__slider`, que **não existe na home** [C] | Não instalado |
| Swup 4 | Transição entre páginas (cortina preta + logo) [C] | Não implementado: o vídeo não mostra navegação entre páginas e só há uma página |
| WordPress, CF7, cookies, lazyload | Infraestrutura de conteúdo | Fora do escopo |

Fontes da referência: Juana (Regular/Medium/Light), Editorial New (Ultralight/Regular/Italic) e Izmir. Todas são comerciais. Substitutas (Fontsource, licença OFL): **Juana → Bodoni Moda**, **Editorial New → Newsreader (peso 200)**, **Izmir → Jost**.

Paleta [C]: preto `#000`, branco, bege `#ECE4DA`, vermelho `#DB5C59`, azul `#C7D7E9`, cinza `#707070`. Escala tipográfica em `rem` com `html { font-size: 1.0417vw }` (1rem = 20px em 1920px), copiada do `main.css`.

---

## 2. Mapa da página (desktop)

O desktop é um **trilho horizontal fixado**: a rolagem vertical move as seções para a esquerda (`pin` + `scrub: 1`). Depois do trilho, a página volta a rolar na vertical.

| # | Seção | Largura / altura | Fundo | Conteúdo e comportamento | Vídeo |
|---|---|---|---|---|---|
| 0 | Preloader | tela cheia | branco | Logo central letra a letra, barra inferior e percentual | 0:06–0:11 |
| 1 | Intro | 100vw → 80vw × 100vh | branco | "Espaços de vida / que desafiam / o ordinário", parágrafo, menu vertical à direita, logo nos cantos | 0:11–0:13 |
| 2 | Imagens principais | proporção 1279/960 + flip sobreposto | branco | Foto grande + foto menor que troca (flip vertical) | 0:13–0:24 |
| 3 | Texto "Sobre" | 10 colunas | branco | "Casas que convidam / a ⎵ parar / o tempo / e desconectar"; a última linha corre até a direita | 0:24–0:28 |
| 4 | Imagens + texto | auto | preto | Dois flips (direita→esquerda, esquerda→direita) e parágrafo que acende linha a linha | 0:28–0:35 |
| 5 | Faixa "Valores" | 1.5em | bege | Letreiro vertical (−90°) com asterisco, rolando sem parar e subindo com o scroll | 0:35–0:37 |
| 6 | Imagens secundárias | auto | bege | Dois flips | 0:37–0:41 |
| 7 | Valores | auto | azul | Elegância / Autenticidade / Funcionalidade em letras enormes com `mix-blend-mode: difference`; foto que segue o mouse | 0:41–0:50 |
| 8 | Projetos | 4 col. + 5 × 60vw | branco/bege/cinza/azul | Acordeão: cada card abre de 15vw para 60vw | 0:50–1:08 |
| 9 | Último projeto | 200vw (100vw fixo) | branco | Coluna de fotos subindo + "Quem disse que o prazer não pode ser funcional" | 1:08–1:12 |
| 10 | Fechamento | 150vw (100vw fixo) | vermelho | Foto central com flip vertical | 1:12–1:17 |
| 11 | Contato (vertical) | — | bege | "Desbloqueie seu sonho", duas fotos, "Exclusividade em sua máxima expressão", texto, botão | 1:17–1:22 |
| 12 | Rodapé | — | bege | Links, palavra gigante, card do projeto, legais | 1:22–1:24 |

Fixos sobre tudo: logo nos cantos ("DOMUS" em cima à esquerda, "é LAR®" invertido embaixo à direita), botão **Menu** em cima à direita (o cabeçalho usa `mix-blend-mode: difference`) e cursor circular vermelho.

Celular/tablet (≤950px, referência `is_mobile`): as seções se empilham, o Lenis é desligado e as animações passam a usar gatilhos verticais.

---

## 3. Inventário de animações

Os valores marcados com [C] vêm do código original. Os demais são estimativas a partir do vídeo [E].

### Carregamento (tempo)
| Elemento | Animação | Valores |
|---|---|---|
| Logo | Letras entram em X | `x: 120% → 0`, 0.5s, stagger 0.1, `power3.out`, início após 500ms [C] |
| Barra/percentual | Contador sobe 1% a cada 5ms, limitado ao carregamento real das imagens; some ao chegar em 100% | fade 0.5s / 0.33s; `init` 1.5s depois [C] |
| Logo → cantos | largura → 100% (1s `power2.in`), depois altura → 100% (1s `power2.out`, +1.75s) [C]; fonte 3.5rem → 1.65rem [E] |
| Títulos da intro | Letras por linha; linhas pares sobem (110%), ímpares descem (−110%) | 0.65s, stagger 0.03, `power3.out` [C] |
| Parágrafo da intro | Linhas mascaradas sobem 100% | 0.5s, stagger 0.09 [C] |
| Intro encolhe | `width: 100vw → 80vw` 1.25s `power3.out`; foto seguinte `x: −5vw → −15vw` [C] |
| Menu vertical | `y: 2.5rem → 0`, 1s, stagger −0.15 [C] |

### Posição do scroll (`scrub`)
| Elemento | Gatilho | Animação |
|---|---|---|
| Trilho | `pin`, `scrub: 1`, fim = largura do trilho [C] | `x` das seções |
| Foto principal | `0% 78%` → `90% 100%`, scrub 0.5 [C] | `x: −15vw → 0` |
| Flips | `data-start` (ex.: `100% 70%`) → `+=75%`, scrub 0.35 [C] | clip-path `inset` ou `y: −105%`; foto de baixo `scale 1.2→1` / `y −10%→0` |
| "e desconectar" | `0% 50%` → `100% 50%`, scrub 0 [C] | linha corre da esquerda até alinhar à direita |
| Parágrafo no preto | `0% 75%` → `0% 25%` [C] | opacidade das linhas 0.2 → 1, stagger 0.1 |
| Faixa Valores | `0% 95%` → `100% 0%`, scrub 0.5 [C] | `y: 175vh → 0` (girada −90°) + letreiro CSS 5s linear |
| Valores (espaçamento) | `0% 100%` → `100% 0%`, scrub 1 [C] | `padding-left` 12vw / 20vw, `padding-right` 3vw |
| Projetos | primeiro card `0% 80%`, duração 60% × n, scrub [C] | card `15vw → 60vw`, foto `87vh → 66vh`, `power1.inOut` |
| Último projeto / fechamento | `left left` → `right right` [E, equivalente ao pin interno] | bloco fixo + coluna de fotos subindo / flip vertical (scrub 0.33) [C] |
| Palavra do rodapé | `top 50%` → `bottom bottom`, scrub 2 [C] | `scaleY 0.25 → 1` (substitui MorphSVG) [E] |

### Entrada no viewport (dispara uma vez)
| Elemento | Animação |
|---|---|
| Texto do projeto ao abrir | ano, cidade e botão sobem (0.33s, deslocados 0.2s); letras do título sobem (0.25s, stagger 0.05) [C]; volta em ×2.5 |
| "Quem disse…" | rótulo, letras alternando direção (0.65s, stagger 0.03), parágrafo em linhas [C] |
| "Desbloqueie seu sonho" | letras alternando direção [E] (0.9s, stagger 0.04) |
| Fotos do contato | máscara abre de baixo para cima + `scale 1.2 → 1` [E] |
| "Exclusividade…" | linhas sobem 105%, stagger 0.12 [E] |
| Card do rodapé | ano sobe; letras do nome descem de −100% (stagger 0.025); linhas do texto [C] |
| Logo pequeno + botão Menu | depois que a intro sai (`125% 0%`): `y −180% / 130% → 0`, 0.75s; volta 0.25s `power2.in` [C] |

### Hover e clique
| Elemento | Comportamento |
|---|---|
| Cursor | Círculo vermelho de 0.75rem com `mix-blend-mode: difference`, interpolação 0.2 corrigida por `deltaRatio` [C]; cresce para 7.15rem `back.out` com texto em `[data-cursor]` [C] |
| Valores | Foto quadrada de 18em segue o mouse; ao passar sobre um termo a foto troca com `clip-path 100%→0` (1.25s) e `scale 2→1` (2s) [C]; o cursor principal some |
| Botões pílula | Fundo entra pelo lado de onde o mouse vem e sai pelo lado oposto [E, inspirado em `rollovers.js`] |
| Links do rodapé | Sublinhado que entra pela esquerda e sai pela direita [E] |
| Menu | Fundo azul `width 0 → 100vw` 0.75s; foto com máscara + `x 35%`; letras do título; lista de projetos e links em cascata; o rótulo troca "Menu" ↔ "Fechar" [C] |
| Links internos | Rolagem suave até a seção; no trilho, a posição horizontal é convertida em posição de scroll |
| Contato | Abre `<dialog>` com formulário (validação nativa, sem envio a servidor) |

---

## 4. Arquitetura

```
index.html              ← recebe o HTML gerado em build (legível sem JS)
vite.config.js          ← plugin que injeta renderPage() no index.html
src/content.js          ← todo o texto e as imagens
src/render.js           ← componentes de marcação (funções que retornam HTML)
src/styles/main.css     ← tokens, layout horizontal e regras ≤950px
src/main.js             ← orquestra: fontes → preloader → gsap.matchMedia por breakpoint
src/lib/scroll.js       ← Lenis único + scrollTo (inclusive dentro do trilho)
src/anim/preloader.js   ← logo, barra e contador
src/anim/intro.js       ← entrada da intro, retorno do logo e botão Menu
src/anim/horizontal.js  ← trilho, acordeão, blocos fixos internos
src/anim/flips.js       ← timeline das fotos sobrepostas
src/anim/vertical.js    ← parte vertical + versão empilhada (celular)
src/anim/interactions.js← menu, cursor, botões, hover de Valores, modal
public/images/          ← fotos substitutas (Unsplash)
```

- **JavaScript puro em vez de React**: a pasta estava vazia e toda a lógica da referência é imperativa sobre o DOM (SplitText, `containerAnimation`, medições de largura). React só acrescentaria uma camada de reconciliação competindo com o GSAP pelo mesmo DOM.
- **Limpeza centralizada**: tudo é criado dentro de `gsap.matchMedia()`. Ao cruzar 950px ou mudar a preferência de movimento, timelines, ScrollTriggers e SplitTexts são revertidos e os listeners são removidos pelas funções de limpeza. A referência recarregava a página (`window.location.reload()`); aqui isso não é necessário.
- **Um único loop**: Lenis e cursor rodam no `gsap.ticker`. Não há `requestAnimationFrame` próprio.

---

## 5. Diferenças conhecidas em relação à referência

1. **Fontes**: Juana, Editorial New e Izmir são comerciais e foram trocadas por Bodoni Moda, Newsreader e Jost. A Bodoni é mais larga que a Juana, então algumas linhas ficam mais compridas (por isso a seção "Sobre" pode crescer além de 10 colunas).
2. **Imagens**: são fotos do Unsplash escolhidas por enquadramento e paleta parecidos. **Não são as fotos originais.**
3. **Marca e textos**: a reconstrução é para a DOMUS. Os textos foram traduzidos/adaptados para português, os nomes dos projetos são fictícios e o logo "DOMUS é LAR®" segue a mesma composição em três partes do "NORMAL is BORING®". Os textos são provisórios.
4. **Rodapé**: a referência usa MorphSVG entre pares de caminhos desenhados à mão para as letras de "BORING". Sem esses SVGs, o mesmo gesto (letras estreitas que se alargam com o scroll) foi reproduzido com `scaleY` sobre "DOMUS". Para ficar fiel, é preciso desenhar os SVGs inicial/final de cada letra e usar `MorphSVGPlugin`, que é gratuito desde o GSAP 3.13.
5. **Último projeto**: na referência, o último card (POL43) se transforma na coluna de fotos com o texto ao lado (timeline de ~90 linhas que redimensiona e reposiciona os itens). Aqui o card e a coluna "Quem disse…" são blocos separados, com bloco fixo e coluna subindo. A sensação no vídeo é parecida, mas a transição não é idêntica.
6. **Swup / transições entre páginas**: não implementadas porque há uma página só e o vídeo não mostra navegação. A referência usa cortina preta subindo (`y 100vh → 0`, 1s `power3.inOut`) e o logo entrando letra a letra. Seria o próximo passo se houver páginas de projeto.
7. **Botão de capítulos** ("01 Contato" no cabeçalho), banner de cookies, selo Awwwards e modal de vídeo não foram reproduzidos.
8. **Formulário**: só valida e confirma localmente; não envia nada.
9. **Preloader**: a referência mostra o contador só na primeira visita (`localStorage`). Aqui ele aparece sempre.
10. **Tempo exato**: vários valores vêm do código, mas o vídeo foi gravado em baixa resolução (464px) e a 27 fps. As estimativas [E] não foram medidas quadro a quadro com precisão de milissegundo.
11. **Aviso de console ao redimensionar**: quando a janela cruza 950px, o SplitText pode avisar `SplitText called before fonts loaded` se um subconjunto de fonte ainda não carregou. A divisão se refaz certa na próxima atualização.

---

## 6. Acessibilidade e desempenho

- O HTML é gerado em build: sem JavaScript, todo o conteúdo fica visível em fluxo normal.
- `prefers-reduced-motion`: sem preloader, sem animação da intro, sem Lenis, sem letreiro contínuo, sem as entradas da parte vertical e com os flips já resolvidos. O trilho horizontal e as animações ligadas a ele continuam (são dirigidas pelo próprio scroll), mas sem atraso de suavização. O menu continua animado.
- SplitText com `aria: 'auto'` (o texto continua legível por leitores de tela); `<dialog>` nativo; foco visível; Esc fecha o menu e o modal; o foco entra no menu ao abrir e volta ao botão ao fechar.
- Animações de scroll usam `transform`, `opacity` e `clip-path`. As exceções, herdadas da referência, são `width`/`height` no acordeão de projetos e na intro.
- Imagens fora da primeira tela usam `loading="lazy"`. O preloader pré-carrega todas, como o original.
