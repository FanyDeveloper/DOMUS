# DOMUS

Reconstrução, para estudo, da experiência de rolagem de [normalisboring.es](https://normalisboring.es): trilho horizontal fixado, preloader com logo, tipografia que entra letra a letra, fotos sobrepostas que se revelam e acordeão de projetos. Aplicação independente, sem WordPress.

Mapa da página, inventário de animações, arquitetura e diferenças conhecidas: [docs/AUDITORIA.md](docs/AUDITORIA.md).

## Rodar

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # gera dist/
npm run preview   # serve dist/
```

## Bibliotecas

| Pacote | Por quê |
|---|---|
| `gsap` 3.13 (ScrollTrigger, SplitText) | Mesmo motor da referência; `containerAnimation` para as animações dentro do trilho horizontal. SplitText é gratuito desde a 3.13 |
| `lenis` 1.3.1 | Rolagem suave do desktop, mesma versão e mesma ligação ao `gsap.ticker` da referência |
| `@fontsource/*` | Bodoni Moda, Newsreader e Jost, substitutas livres das fontes comerciais originais |
| `vite` | Servidor de desenvolvimento e build; também pré-renderiza o HTML |

Swiper, Swup, ScrollSmoother e MorphSVG aparecem na referência, mas não fazem falta nesta página (ver auditoria §1 e §5).

## Como testar

- **Desktop (>950px)**: role com a roda do mouse ou com o trackpad. As seções devem correr para a esquerda até o fundo vermelho; depois a página volta a rolar na vertical. Role também para trás: tudo deve voltar ao estado anterior.
- **Valores (fundo azul)**: passe o mouse sobre cada palavra. Uma foto segue o cursor e troca a cada termo.
- **Menu**: o botão aparece depois da intro. Esc fecha o menu, e os links levam às seções, inclusive dentro do trilho.
- **Contato**: "Solicitar informações" abre o formulário. Esc fecha.
- **Redimensionar**: cruze 950px de largura. O layout passa para colunas empilhadas sem recarregar a página.
- **Movimento reduzido**: ative "reduzir movimento" no sistema operacional e recarregue. O preloader some e os conteúdos já aparecem no lugar.

## Créditos das imagens

Fotos do [Unsplash](https://unsplash.com) (Licença Unsplash), em `public/images/`. São substitutas: as fotos originais da referência não foram usadas.
