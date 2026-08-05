# DevClub — Landing Page Cinematográfica

Landing page de página única (scroll storytelling) para o DevClub, construída em HTML/CSS/JS puro
(sem framework de build), com GSAP + ScrollTrigger + Lenis para a experiência de scroll cinematográfico.

## Como rodar localmente

Qualquer servidor estático funciona. Exemplo:

```bash
python3 -m http.server 8080
# depois abra http://localhost:8080/index.html
```

Não abra o `index.html` direto com `file://` — alguns navegadores bloqueiam certas APIs (fetch,
alguns comportamentos de `<video>`) nesse modo.

## Estrutura

```
index.html              — marcação, conteúdo real, SEO/meta, JSON-LD
css/styles.css          — design system (tokens, layout, componentes, responsividade)
js/scenes.js             — as 9 "cenas" cinematográficas (Canvas 2D procedural + overlay sobre vídeo/imagem)
js/main.js              — motor de scroll: GSAP+ScrollTrigger+Lenis, com fallback 100% vanilla JS
CONTEUDO-FONTE.md        — rastreabilidade de cada dado real usado (números, links, nomes)
backup/LEIA-ME.md        — por que não há backup (não havia projeto anterior nesta pasta)
```

## Dependências externas (via CDN, no `index.html`)

- GSAP + ScrollTrigger — `cdnjs.cloudflare.com`
- Lenis — `cdn.jsdelivr.net`
- Fontes (Fraunces, Inter, JetBrains Mono) — `fonts.googleapis.com`

Essas libs **não estão vendorizadas** no projeto porque o ambiente onde esta página foi construída
não tinha acesso de saída a esses domínios (nem via `npm install`) — só foi possível validar o motor
de fallback vanilla JS em sandbox. Em qualquer navegador com internet normal, os três scripts
carregam e a experiência completa GSAP+Lenis assume automaticamente (`js/main.js` detecta isso e
troca de motor sozinho). Veja a seção "Testes executados" abaixo para mais detalhes.

## Vídeo e imagem gerados por IA (Higgsfield)

**Cena 1 (hero)** usa um vídeo cinematográfico gerado (6s, 16:9, sem áudio, sem texto/logo — câmera
avançando lentamente em direção à estação de trabalho), com uma imagem still gerada como *poster*.

- Imagem (poster): https://d8j0ntlcm91z4.cloudfront.net/user_3GmeqlVGnEJg8OBs4ugR3dvtb12/hf_20260721_144919_dc8cbe45-8b10-49e4-82b1-fac4b55e2817.png
- Vídeo: https://d8j0ntlcm91z4.cloudfront.net/user_3GmeqlVGnEJg8OBs4ugR3dvtb12/hf_20260721_150057_889d561f-bee8-47fa-ad89-cd348850e9da.mp4

**Cena 5 (Aprender na prática)** — atualizada em 04/08/2026 a pedido do usuário. Antes era 100%
procedural (Canvas 2D, "editor de código abstrato"); agora usa um vídeo cinematográfico gerado
(`nano_banana_pro` para o still inicial + `kling3_0_turbo` para animar esse still, 6s, 16:9, sem
áudio, sem texto/logo, sem rosto/pessoa reconhecível — mesa de trabalho escura com monitores
exibindo código abstrato que "acende" em verde-sinal), no mesmo padrão da Cena 1 (`<video>` com
`poster`). O canvas por cima virou um overlay 100% transparente (faíscas/partículas subindo da
tela, ganhando conexões conforme o progresso do scroll) — ver `js/scenes.js`, função `scene5`.

- Imagem (poster / quadro inicial): https://d8j0ntlcm91z4.cloudfront.net/user_3GmeqlVGnEJg8OBs4ugR3dvtb12/hf_20260804_220247_9e7b8956-9602-4564-acc1-61ffd5a64c85.png
- Vídeo: https://d8j0ntlcm91z4.cloudfront.net/user_3GmeqlVGnEJg8OBs4ugR3dvtb12/hf_20260804_220711_259fa8e8-8ffe-444e-887b-ee9ee4e06f16.mp4

**Cena 8 (Transformação)** passou por três versões no mesmo dia (04/08/2026): primeiro um mural de
cards procedural, depois uma trilha ascendente procedural (canto escuro → canto verde-sinal), e por
fim — a pedido explícito do usuário, que preferiu um vídeo real a mais uma tentativa procedural/IA
— um **vídeo próprio enviado pelo usuário** (`assets/video/transformacao-scroll.mp4`, sem áudio,
sem Higgsfield envolvido). Esse arquivo foi reprocessado a partir do original enviado (1920×1080,
com áudio) para: (1) remover o áudio (`-an`), (2) reduzir pra 1280×720 (mesma resolução da Cena 1,
economia de banda) e (3) recodificar com um keyframe por frame (`-g 1`), exatamente como o vídeo da
Cena 1 — sem isso, arrastar o scroll pra trás/frente fica "pulando" em vez de deslizar suave, porque
o navegador tem que decodificar cada seek a partir do keyframe anterior. `js/main.js` generalizou a
função que fazia isso só pra Cena 1 (`scrubHeroVideo` → `scrubVideo`, ligada por
`<video data-scrub="true">` em vez de checar um id fixo) pra reaproveitar na Cena 8. O canvas por
cima é o mesmo overlay transparente de partículas da Cena 9 (`litHeroScene`), e a `<video>` tem
`poster="assets/img/transformacao-poster.jpg"` (frame extraído do próprio vídeo) pra nunca mostrar
um retângulo preto antes do primeiro seek.

**Cena 9 (CTA final)** originalmente reaproveitava esse mesmo vídeo do hero (narrativa "volta à
mesma estação, agora iluminada"). A pedido do usuário (21/07/2026), passou a ter uma peça própria:
uma imagem still gerada com tema celebração/sucesso (mesa de trabalho escura, monitores com um
grafismo abstrato de "conclusão" dissolvendo em partículas de luz verde-sinal), animada em CSS puro
— zoom lento tipo Ken Burns (`@keyframes scene9-kenburns`) + um pulso de brilho verde-sinal
(`.cinema__pulse`) que respira em sincronia com o scroll, no lugar de um vídeo de verdade.

- Imagem: https://d8j0ntlcm91z4.cloudfront.net/user_3GmeqlVGnEJg8OBs4ugR3dvtb12/hf_20260721_234143_98ae2e9b-bbba-4cd9-b185-bd00196d311e.png

Por quê imagem + CSS e não vídeo de novo (na época, 21/07/2026): a conta Higgsfield conectada tinha só
2 créditos restantes nesse momento (já tinha usado ~8 dos 10 originais no vídeo/still do hero). Gerar
um vídeo cinematográfico novo custa no mínimo ~4,5–9 créditos dependendo do modelo/duração — inviável
com o saldo disponível. Uma imagem (`nano_banana_pro`, 1k) coube exatamente nos 2 créditos restantes.

**Atualização (04/08/2026)**: a pedido do usuário, a imagem de fundo da Cena 9 foi **removida**.
A cena agora usa só o fundo escuro padrão + o overlay transparente de partículas (`litHeroScene`,
compartilhado com a Cena 8) + o texto/CTA final (`.final-cta`), sem still nem Ken Burns/pulso de luz.
Os elementos `#scene9Image` e `#scene9Pulse` (e os keyframes CSS `scene9-kenburns`/`scene9-pulse`
que só eles usavam) foram removidos do `index.html`/`css/styles.css`. A imagem gerada continua
referenciada no histórico abaixo por rastreabilidade, mas não está mais em uso na página.

Todos os assets estão hospedados no CDN da Higgsfield e referenciados por URL direta no `index.html`
(não foram baixados para dentro do projeto, porque o ambiente da sessão não tinha acesso de saída
para baixá-los — só o navegador do visitante final acessa essas URLs).

Recomendação: baixe os arquivos e coloque-os em `assets/img/` e `assets/video/`, depois troque
as URLs no `index.html` pelos caminhos locais — isso deixa o site independente do CDN da Higgsfield
a longo prazo.

As Cenas 2–4, 6 e 7 são 100% proceduais (Canvas 2D: partículas, redes de nós, grids) — não usam
vídeo/imagem gerado por IA nem asset externo. O motivo original está documentado em
`CONTEUDO-FONTE.md`: a conta Higgsfield conectada tinha apenas 10 créditos (plano free), muito
abaixo do necessário para gerar 9 vídeos cinematográficos encadeados como o briefing original pedia.
O usuário optou explicitamente por gerar só a imagem/vídeo do hero (e, depois, a imagem própria da
Cena 9) e construir o restante em animação procedural. Em 04/08/2026, com o saldo de créditos já
recarregado (172), o usuário pediu para trocar a animação da Cena 5 por uma peça gerada via
Higgsfield (ver seção acima) e a da Cena 8 por um vídeo próprio que ele enviou (ver seção acima) —
Cenas 2–4, 6 e 7 seguem proceduais.

## Layout da seção "Professores e especialistas" (04/08/2026)

A pedido do usuário — depois de comparar 3 protótipos (anel 3D giratório, avatar central + arco de
miniaturas, e órbita lenta) — os cards de professor viraram um **anel 3D giratório (coverflow)**,
sem gerar nenhum asset novo (só CSS/JS):

- **Anel giratório**: `initTeachersCarousel()` em `js/main.js` posiciona cada card
  (`#professores .teacher`) num semicírculo com perspectiva 3D (`.teachers-stage{ perspective }`).
  O card "da frente" (`.is-front`) fica reto, maior (`scale(1.1)`) e com borda/brilho verde-sinal;
  os outros diminuem, giram (`rotateY`) e recuam em Z conforme se afastam do centro. Navega pelas
  setas (`#teachersPrev`/`#teachersNext`, agora circular — sem estado "desabilitado" nas pontas) ou
  clicando direto num card lateral pra trazê-lo pro centro.
- **Ken Burns contínuo** nas fotos — cada uma respira num zoom lento e infinito (aplicado no
  contêiner `.teacher__photo`, não na `<img>`, pra não conflitar com o zoom do card em foco).
- **Tilt 3D + brilho no hover**, só no card da frente — inclina sutilmente seguindo o ponteiro e
  acende um anel de brilho verde-sinal que rastreia o cursor (`.teacher::before`), só em
  dispositivos com ponteiro fino (`pointer: fine`) e respeitando `prefers-reduced-motion`.
- **Entrada do conjunto**: a seção inteira (`.teachers-wrap`) faz um fade/subida suave ao entrar na
  tela, em vez de cada card animar individualmente — faz mais sentido com o anel, que já tem
  bastante movimento por si só.

Os 3 protótipos comparativos (enviados antes da escolha) não fazem parte do projeto final.

**Atualização (05/08/2026)** — troca automática: a pedido do usuário, o anel agora gira sozinho, um
card por vez a cada 2s (`initTeachersCarousel()` → `startAutoplay()`/`stopAutoplay()` em
`js/main.js`), mas as setas e o clique direto num card continuam funcionando a qualquer momento —
qualquer interação manual reinicia a contagem do autoplay em vez de brigar com ele. O autoplay
pausa ao passar o mouse por cima do anel e quando a seção sai da tela (`IntersectionObserver`
dedicado, separado do observer de entrada, que é "uma vez só"), e não roda nada em
`prefers-reduced-motion`. Mesmo padrão de autoplay+pausa já usado no carrossel espiral de
projetos, só que com intervalo mais curto (2s em vez de ~3,2s).

**Qualidade das fotos** — as versões `.webp` das 6 fotos (as que o navegador carrega de fato, via
`<picture>/<source>`) tinham sido geradas em 480×480 com compressão bem agressiva (8–15 KB cada),
bem abaixo da resolução real das fotos-fonte (1024×1024). Isso não dava pra notar no tamanho do
card padrão, mas ficava visivelmente borrado no card em destaque (`scale(1.1)`) em telas de alta
densidade de pixels (Retina/2×+), especialmente depois do ajuste de `aspect-ratio` desta mesma
rodada. Corrigido regenerando os `.webp` a partir dos `.png` originais (1024×1024, na resolução
cheia) com qualidade 88 — arquivos ficaram maiores (50–98 KB, ainda leve) mas nítidos em qualquer
densidade de tela.

**Ajustes finos pedidos pelo usuário (04/08/2026, segunda rodada):**

- **Fotos cortando a cabeça**: as fotos-fonte dos professores são todas 1024×1024 (quadradas). O
  contêiner `.teacher__photo` usava `aspect-ratio:3/4` (mais alto que largo), o que forçava
  `object-fit:cover` a cortar as laterais da imagem para preencher a proporção — e em pelo menos
  duas fotos (Agustinho Neto, Márcio Conceição) o enquadramento original já tinha pouquíssima
  margem entre o topo da cabeça e a borda da imagem, então qualquer recorte adicional lia como
  "cabeça cortada". Corrigido trocando `aspect-ratio` do contêiner para `1/1`, igual à imagem-fonte
  — isso elimina qualquer corte (lateral ou vertical) porque a proporção do contêiner passa a bater
  exatamente com a da imagem original.
- **Transição antes do anel aparecer**: `initTeachersCarousel()` em `js/main.js` ganhou uma
  coreografia de entrada. Antes do `IntersectionObserver` disparar, todos os cards são pintados numa
  posição "espalhada" (mais para trás em Z, menores, rotacionados e com opacidade 0 — parâmetro
  `entering=true` em `applyCard()`). Quando a seção entra na tela, a classe `is-visible` é aplicada e,
  dois `requestAnimationFrame` encadeados depois (para garantir que o navegador já pintou o estado
  espalhado antes de mudar o alvo), os cards são renderizados na posição final do anel — a
  `transition` CSS já existente em `.teacher` (`transform .6s`, `opacity .6s`) anima esse salto,
  criando um efeito de "formação convergindo" em vez dos cards aparecerem prontos na posição final.
  Verificado via amostragem de `getComputedStyle().transform` a cada 40ms durante a transição: a
  escala sobe de 0.495→1.1 e o Z de -260px→0px suavemente ao longo de ~700ms.

## Seção "Mural da Fama" — carrossel espiral de projetos (04/08/2026)

O card único antigo com uma montagem de exemplos de projetos (`assets/img/projetos-reais.png`)
foi trocado por um carrossel de 9 miniaturas reais de projetos por nicho, enviadas pelo usuário
(`assets/img/projects/*.png` + `.webp`): agência de tecnologia, restaurante, imobiliária,
academia, loja virtual, consultoria empresarial, arquitetura/interiores, landing page de app e
portfólio pessoal.

A pedido do usuário, a transição entre elas é "como se fosse um caracol": os 9 cards
(`.project-card`) ficam sobre 9 pontos **fixos** dispostos ao longo de uma espiral — o ponto 0 é
o maior, em destaque, por fora; o último ponto é minúsculo, quase no centro, como o enrolar de uma
concha. `initProjectsSpiral()` (`js/main.js`) não recalcula a espiral a cada passo: ele troca qual
card ocupa qual ponto (`shift`), e a `transition` CSS já existente em `.project-card` anima cada
card do ponto atual pro próximo — o card em destaque encolhe rumo ao centro enquanto o próximo
cresce vindo de dentro, criando a sensação de um caracol avançando pela própria concha em vez de
cards só trocando de lugar (mesma técnica de "pontos fixos + troca de conteúdo por deslocamento"
usada no anel dos professores, adaptada de círculo pra espiral).

- Autoplay lento (a cada ~3,2s), pausado ao passar o mouse ou quando a seção sai da tela
  (`IntersectionObserver`), e reiniciado depois de qualquer interação manual (setas ou clique
  direto num card).
- O raio máximo da espiral é calculado a partir do tamanho real do card em destaque
  (`offsetWidth`/`offsetHeight`, que ignoram o `transform: scale()`) e da altura do palco, então o
  card maior nunca estoura os limites da caixa, seja qual for o ângulo/viewport.
- `prefers-reduced-motion`: `initProjectsSpiral()` nem roda a lógica de posicionamento — uma media
  query em `css/styles.css` troca o layout pra uma grade estática simples com as 9 miniaturas,
  todas visíveis e legíveis de uma vez, sem espiral nem autoplay.

**Atualização (05/08/2026)** — a pedido do usuário, os cards ficaram maiores (`width` do
`.project-card` subiu de `clamp(120px,15vw,220px)` pra `clamp(170px,21vw,320px)`, e o palco
(`.projects-spiral-stage`) cresceu de `clamp(320px,40vw,480px)` pra `clamp(380px,46vw,560px)` de
altura) pra preencher mais o espaço do container. Isso por si só deixaria as fotos borradas: as
imagens originais enviadas pelo usuário são screenshots em 482×300, e exibi-las maiores que o
tamanho nativo obriga o navegador a ampliar (upscale) a imagem. Pra evitar isso sem acesso a uma
ferramenta de super-resolução por IA nesta sessão (o ambiente não tinha saída de rede pro upload
necessário), as 9 imagens foram reprocessadas localmente: upscale Lanczos 2× (482×300 → 964×600)
+ uma leve máscara de nitidez (`ImageFilter.UnsharpMask`, raio 1.4, 110%) pra compensar o
amolecimento que o Lanczos introduz. O resultado vai só no `.webp` (o formato que o
`<picture>`/`<source>` já prioriza em praticamente todo navegador atual); o `.png` de
fallback continua no tamanho original (482×300) pra não inflar o tamanho do projeto sem
necessidade real, já que só entra em uso em navegadores muito antigos sem suporte a WebP. O raio
da espiral (`initProjectsSpiral()`) já era calculado a partir do tamanho real do card em vez de um
valor fixo, então absorveu o aumento sozinho, sem cortar nenhuma foto.

## Cor de marca

Não foi possível confirmar o hex oficial da marca DevClub a partir das fontes públicas acessíveis
durante a sessão (ver `CONTEUDO-FONTE.md`). Foi usada uma paleta grafite/preto + branco quente + um
verde-sinal de destaque (`--accent` em `css/styles.css`), fácil de trocar por uma variável só.
