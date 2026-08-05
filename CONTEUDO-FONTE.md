# Fonte de conteúdo real — DevClub Landing Page

Este documento registra, de forma rastreável, de onde veio cada informação usada na landing page.
Nenhum número, depoimento, nome ou dado institucional foi inventado. Onde a informação real
não estava disponível, a seção foi escrita de forma genérica (sem inventar dado factual) ou omitida.

## 1. Conteúdo fornecido diretamente pelo usuário (tratado como conteúdo real da marca)

Lista literal fornecida no briefing, usada como fonte primária de nomes de recursos/seções:

- Área do Aluno
- Quero ser aluno
- Mais de 25 mil alunos
- Alunos em grandes empresas do Brasil e do mundo
- Formações completas do zero ao avançado
- Programação Front End / Back End / Full Stack / Mobile
- React, Node.js, JavaScript, HTML5, CSS3
- Gestão de IA, IA e Automações, Claude e Claude Code, Trilha N8N
- Análise de Dados, Power BI
- Acompanhamento de recrutadora
- Terapeuta focado em alta performance
- Mentorias semanais
- Agentes de IA
- Suporte humano
- Comunidade de profissionais de tecnologia
- Vagas de emprego exclusivas
- Plataforma de ensino / Trilhas e formações / Comunidade de alunos
- Club Agents
- Playground de treinamento
- Mural da Fama
- Projetos práticos e reais
- Transformação de alunos
- Professores e especialistas
- Nomes do time de professores (fornecidos pelo usuário em 21/07/2026): Rodolfo Mori (fundador),
  Fernanda, Agustinho, Henrique, Márcio, Juliana, Mateus

## 2. Conteúdo verificado em fontes públicas do DevClub (WebFetch/WebSearch, jul/2026)

- **stars.devclub.com.br** — meta description confirma: "DevClub Stars - Mural da Fama dos alunos do DevClub".
  Usado para linkar a seção "Mural da Fama" a uma URL real.
- **aulas.devclub.com.br** — confirmado via busca como a Área de Membros real do DevClub. Usado como
  destino do CTA "Área do Aluno".
- **lp.devclub.com.br/devclub-oficial** (página de vendas/Webflow, pode ser uma campanha mais antiga):
  - Fundador citado: **Rodolfo Mori** (histórico em Santander, BTG Pactual, PI Investimentos, Toro
    Investimentos; "de eletricista a Dev Sênior"). Usado apenas para uma menção institucional pontual
    sobre o fundador — sem inventar biografia adicional.
  - Link real de suporte via WhatsApp/atendimento: `https://go.rodolfomori.com.br/suporte`
  - CNPJ/razão social do rodapé: Launch Control Serviços Digitais LTDA — CNPJ 35.775.053/0001-69
  - Esta página usa "+10 mil alunos" (número mais antigo). Como o usuário informou explicitamente
    "+25 mil alunos" como dado atual, o número mais recente fornecido pelo usuário foi priorizado,
    e o número antigo da campanha não foi usado, para não gerar contradição.
  - Não foram usados os valores de "salário até R$25.000" nem nomes de empresas específicas dessa
    página, pois não constavam na lista de conteúdo real fornecida pelo usuário e não puderam ser
    reconfirmados na página institucional atual (site é uma SPA React, não indexável por fetch simples).

## 3. URLs reais usadas na página

- Site institucional: https://www.devclub.com.br/
- Área do Aluno: https://aulas.devclub.com.br/
- Mural da Fama: https://stars.devclub.com.br/
- Suporte / WhatsApp: https://go.rodolfomori.com.br/suporte
- CTA "Quero ser aluno": https://www.devclub.com.br/ (página institucional real; nenhuma URL de
  checkout específica foi informada ou verificada, então o CTA aponta para o site oficial em vez de
  uma URL inventada)

## 4. O que NÃO foi incluído por falta de dado real verificável

- Depoimentos com nome/foto de alunos específicos (ver observação abaixo)
- Nomes de empresas contratantes específicas (logos)
- Preços, parcelamento (do curso DevClub)
- Estatísticas além de "+25 mil alunos" e "alunos em grandes empresas do Brasil e do mundo"

## 5. Observação sobre os depoimentos de alunos

A seção "Depoimentos" (antes de "Formações") usa 4 citações fictícias (Marina S., Lucas A.,
Camila R., Rafael T.) com nomes genéricos e sem foto de pessoa real, criadas a pedido explícito
do usuário em 21/07/2026. Contexto: esta landing page é uma peça para um concurso interno do
próprio DevClub (a melhor submissão ganha uma vaga), não uma página comercial em produção — o
usuário indicou que, em caso de vitória, o site será refeito e ajustado junto com a empresa,
quando depoimentos reais do Mural da Fama (stars.devclub.com.br) devem substituir estes.
Isso é uma exceção pontual à regra da seção 4 acima, registrada aqui para rastreabilidade.

### 5.1 Faixa "marquee" de empresas

Em 21/07/2026 o usuário enviou uma imagem de referência de outra plataforma (professores de IA)
mostrando uma faixa com logos de empresas reais específicas (EY, iFood, OAB, UFRJ etc.), pedindo
algo parecido "fazendo menção aos alunos que fizeram DevClub e hoje estão trabalhando em grandes
empresas". Nomes de empresas contratantes específicas não são um dado verificado para o DevClub
(ver seção 4) — a primeira versão usou setores genéricos por esse motivo.

O usuário pediu então, explicitamente, para usar nomes reais de empresas (iFood, Mercado Livre "entre
outras"), inclusive após eu explicar o risco de alegação não verificada envolvendo marcas de
terceiros. Ele esclareceu que: (1) este site não será publicado/divulgado — é um protótipo para um
processo seletivo interno do próprio DevClub; (2) segundo ele, a própria empresa pede o uso desses
nomes nesse tipo de exercício. Diante desse contexto (não é uma peça de marketing ao público,
conforme já registrado na seção 5 sobre depoimentos), atendi o pedido e troquei os itens da faixa
por nomes de empresas reais (iFood, Mercado Livre, Nubank, Itaú, Magalu, Ambev, XP Inc., Globo) —
apenas texto, sem reproduzir logotipos oficiais dessas marcas. Assim como os depoimentos, esses
nomes NÃO são uma lista verificada de empregadores reais de ex-alunos; são ilustrativos para este
protótipo e devem ser substituídos por dados reais (ou removidos) caso o site avance para produção.

## 6. Faixas salariais (seção "O mercado paga bem?")

Os valores usados na seção de valorização de mercado (trilha Full Stack — Júnior/Pleno/Sênior)
NÃO são do DevClub: são dados públicos de mercado, verificados via WebFetch em 21/07/2026 no
Guia Salarial 2026 da Robert Half Brasil (roberthalf.com/br), consultando a página específica do
cargo. São faixas nacionais (25º–75º percentil), valores brutos mensais. A imagem de referência
enviada pelo usuário mostrava dados de "Product Designer" de outra plataforma/curso, não da
DevClub, então não foi copiada — os números foram substituídos por dados reais e relevantes à
trilha que a DevClub oferece, com fonte citada visivelmente na própria seção.
Front End, Back End e Mobile também foram verificados na mesma fonte (valores muito próximos aos
da Full Stack), mas foram removidos da página a pedido do usuário em 21/07/2026 para evitar
repetição visual — só a Full Stack ficou como exemplo representativo.

## 7. Observação sobre cor de marca

Não foi possível extrair um hex oficial de marca do DevClub a partir das fontes públicas acessíveis
nesta sessão (o site atual é uma SPA renderizada em JS e não expôs CSS/tema via fetch estático).
Foi adotada uma paleta escura premium (grafite/preto + branco quente) com um verde-sinal de destaque
(`--accent`), facilmente trocável por uma variável CSS caso o usuário informe o hex oficial da marca.

## 8. Seção "Certificados"

Criada em 21/07/2026 a partir de uma imagem de referência (cards de certificado de outra
plataforma). Igual à seção "Formações", o selo "Reconhecido pelo MEC" aparece só no certificado do
MBA em Inteligência Artificial — o certificado de trilha comum (ex: Full Stack), mostrado "espiando"
atrás, não leva o selo, mantendo consistência com a real fonte oficial (ver seção 2). O nome usado
como assinatura no certificado (Rodolfo Mori, fundador) já é dado real confirmado; não há nome de
aluno fictício nessa seção.

## 9.1 Cena 5, Cena 8 e Professores — aprimoramentos pedidos pelo usuário (04/08/2026)

Nenhum dado factual novo foi adicionado nesta rodada (só mudanças visuais/animação). Registrado
aqui por rastreabilidade, seguindo o mesmo padrão das seções acima:

- **Cena 5** ("Aprender na prática"): a pedido do usuário, trocada de canvas procedural (editor de
  código abstrato) para uma peça gerada via Higgsfield — still (`nano_banana_pro`) animado em vídeo
  (`kling3_0_turbo`, usando o still como quadro inicial/`start_image`), no mesmo padrão da Cena 1.
  Prompt e URLs documentados no `README.md`. Créditos disponíveis no momento: 172 (bem acima do
  saldo de 2 créditos da sessão de 21/07/2026 que limitou a Cena 9 a imagem+CSS).
- **Cena 8** ("Transformação"): passou por três versões no mesmo dia. Primeiro a animação de
  partículas convergindo numa estrela foi trocada por um mosaico/grade acendendo em onda ("Mural da
  Fama"); o usuário não gostou. Depois virou uma trilha ascendente 100% procedural (canto escuro →
  canto verde-sinal); o usuário pediu pra trocar de novo, agora preferindo mídia real a mais uma
  tentativa procedural/gerada. A versão final usa um **vídeo enviado pelo próprio usuário**
  (pessoa estudando/codando à noite → volta mostrando um setup de trabalho com dois monitores,
  câmera por trás), sem áudio, com scroll-scrub igual à Cena 1. Nenhum nome, depoimento ou número
  de aluno foi adicionado — é só o vídeo do usuário, sem texto sobreposto.
- **Professores**: o carrossel horizontal virou um anel 3D giratório (coverflow), escolhido pelo
  usuário depois de comparar 3 protótipos interativos (anel giratório, avatar central + arco de
  miniaturas, órbita lenta). Ken Burns e tilt/brilho no hover (card da frente) seguem existindo.
  Nenhum nome, foto ou cargo foi alterado, só a apresentação/layout visual.

## 9.2 Ajustes finos — fotos, transição de entrada e Cena 9 (04/08/2026, segunda rodada)

Também sem nenhum dado factual novo — só correções visuais/animação pedidas pelo usuário
("imagens de professores no anel giratório está cortando a cabeça, arrumar dimensões e colocar
alguma transição antes de aparecer o anel, retirar imagem da cena 9 e só deixar a escrita"):

- **Fotos dos professores**: `aspect-ratio` do contêiner `.teacher__photo` trocado de `3/4` para
  `1/1`, igual à proporção real das fotos-fonte (1024×1024, confirmado via PIL para as 6 fotos),
  eliminando o corte introduzido por `object-fit:cover` numa proporção diferente da original.
  Nenhuma foto foi trocada ou regerada — só a proporção do enquadramento no layout.
- **Transição de entrada do anel**: adicionada coreografia de entrada em `initTeachersCarousel()`
  (`js/main.js`) — os cards partem de uma posição espalhada/reduzida/transparente e convergem para
  o anel quando a seção entra na tela, usando a `transition` CSS já existente nos cards. Nenhum
  asset novo.
- **Cena 9**: a imagem gerada por IA (still de celebração/sucesso, listada no `README.md`) foi
  **removida** a pedido do usuário. A cena passou a ser só o fundo escuro + overlay de partículas
  + texto/CTA. Isso não muda nenhum dado factual da página (a Cena 9 nunca teve texto/nome/número
  sobreposto à imagem).

## 9.3 Seção "Mural da Fama" — card de projetos trocado por carrossel espiral (04/08/2026)

O card único antigo (`assets/img/projetos-reais.png`, uma montagem genérica "exemplos de sites e
projetos reais... em nichos como agências, delivery, finanças, imobiliárias, academias, estética,
SaaS, viagens e arquitetura") foi **removido** e substituído por 9 miniaturas individuais de
projetos, enviadas pelo próprio usuário (arquivo `layouts_sites_separados.zip`, 04/08/2026):
agência de tecnologia, restaurante, imobiliária, academia, loja virtual, consultoria empresarial,
arquitetura/interiores, landing page de app e portfólio pessoal — salvas em
`assets/img/projects/`. São mockups ilustrativos de sites por nicho (mesmo espírito do que a
imagem única antiga já fazia, só que agora cada nicho é uma peça própria, visível individualmente
com legenda), não uma lista verificada de projetos reais de alunos específicos — mesma ressalva já
registrada na seção 4 para esse tipo de conteúdo ilustrativo do protótipo.

A pedido do usuário — "uma animação entre elas como se fosse um caracol" — os 9 cards viraram um
carrossel em formato de espiral (`initProjectsSpiral()` em `js/main.js`): 9 pontos fixos ao longo
de uma curva espiral (o de fora é o maior/em destaque, os de dentro encolhem até quase sumir no
centro, como o enrolar da concha de um caracol) e, a cada "passo" (autoplay lento a cada ~3,2s,
ou pelas setas/clique), os CARDS trocam de ponto — o card em destaque encolhe rumo ao centro
enquanto o próximo cresce vindo de dentro, dando a sensação de um caracol avançando pela própria
concha. Pausa ao passar o mouse e ao sair da tela; com `prefers-reduced-motion`, vira uma grade
estática simples (sem espiral nem autoplay) mostrando as 9 miniaturas de uma vez.

## 9.4 Ajustes de tamanho/qualidade de imagem — projetos e professores (05/08/2026)

Sem dado factual novo, só ajustes visuais pedidos pelo usuário ("aumentar fotos de projeto para
que ocupe mais os espaços... sem desfocar" e "professores... fotos ficaram desfocadas, ajustar
qualidade de imagens"):

- **Projetos**: os cards do carrossel espiral ficaram maiores. Como as 9 imagens enviadas pelo
  usuário são screenshots em 482×300, exibi-las maiores exigiria o navegador ampliar a imagem
  além do tamanho nativo (borrão). Como o ambiente desta sessão não tinha saída de rede disponível
  para usar upscale por IA (Higgsfield) — o passo de upload da imagem para a ferramenta depende de
  um `curl`/HTTP PUT que não teve conectividade neste sandbox —, a correção foi um upscale local
  determinístico (Lanczos 2× + nitidez leve via Pillow, sem inventar nenhum conteúdo/detalhe novo
  na imagem) aplicado só na versão `.webp` (a que o navegador carrega por padrão); o `.png` de
  fallback ficou no tamanho original. Detalhes técnicos no `README.md`.
- **Professores**: as versões `.webp` das 6 fotos (as que o navegador realmente carrega) tinham
  sido geradas numa resolução bem menor (480×480) e muito comprimidas — abaixo da resolução das
  fotos-fonte reais (1024×1024, já documentadas na seção 1). Regeneradas a partir do PNG original
  em resolução cheia, sem trocar nem recortar nenhuma foto — só a qualidade de compressão/exportação.

## 9. Cena 9 — troca da animação por uma imagem IA própria (21/07/2026)

A pedido do usuário, a Cena 9 (CTA final) deixou de reaproveitar o vídeo do hero e passou a ter uma
imagem própria gerada via Higgsfield (`nano_banana_pro`), tema celebração/sucesso (mesa de trabalho
escura, sem rosto/pessoa reconhecível, sem texto/logo), animada em CSS (Ken Burns + pulso de luz) em
vez de vídeo. Motivo registrado em detalhe no `README.md`, seção "Vídeo e imagem gerados por IA":
a conta Higgsfield tinha apenas 2 créditos no momento, insuficientes para gerar um vídeo novo
(mínimo ~4,5 créditos), mas suficientes para uma imagem. O usuário foi consultado sobre as opções
(imagem+CSS vs. esperar recarga de créditos vs. animação 100% procedural) antes da escolha.
