# ONG Comunidade

Projeto acadêmico de Desenvolvimento Front-End para Web. A ONG é fictícia, as imagens foram geradas com IA e o formulário deve receber somente dados fictícios. Não há arrecadação, pagamentos, envio a servidor ou base compartilhada de cadastros.

## Funcionalidades
- SPA com rotas por fragmento: #/inicio, #/projetos e #/cadastro.
- Cartões preenchidos por clonagem de template e atribuição com textContent.
- Menu móvel, submenu, modal nativo, resumo de erros e toast.
- Validação de nome, e-mail, telefone, CEP, interesse, disponibilidade e mensagem.
- Recuperação e exclusão do último cadastro válido neste navegador.
- Alto contraste manual, foco visível e preferência por movimento reduzido.

## Tecnologias e estrutura
HTML5, CSS3 e JavaScript puro em módulos ES6. Vite e html-minifier-terser são ferramentas de desenvolvimento; jsdom e node:test apoiam os testes. Não há framework de interface nem dependências externas carregadas por CDN.

    html/index.html           documento principal e templates
    css/estilos.css            variáveis, Grid, Flexbox e componentes
    imagens/                  PNG/JPEG e WebP
    js/app.js                 inicialização e integração
    js/roteador.js            rotas, título e foco
    js/templates.js           dados de projetos e criação dos cartões
    js/validacao.js            critérios e eventos do formulário
    js/armazenamento.js        JSON e localStorage
    js/interface.js           menus, modal, toast e contraste
    tests/                    testes automatizados
    scripts/                  minificação de HTML e medição
    .github/                  CI/CD e modelos de issue e PR
    docs/                     evidências e limitações
    dist/                     build gerada, não versionada

As dependências seguem um sentido: app integra os módulos; armazenamento reutiliza validarDados; validação recebe funções de salvar e excluir. Não existem importações circulares nem listeners recriados em cada navegação.

## Pré-requisitos e instalação
Instale Git e Node.js 24 LTS (NPM incluído). O package-lock.json fixa a árvore das dependências.

    git clone https://github.com/fschwartzer/ong-comunidade.git
    cd ong-comunidade
    npm ci
    npm run dev

Abra o endereço mostrado pelo Vite, normalmente http://127.0.0.1:5173/. Não abra html/index.html por file://: módulos ES6 precisam de servidor HTTP.

A execução sem ferramentas de build também pode usar Python 3 na raiz:
    
    python -m http.server 8000

Nesse caso, abra http://localhost:8000/html/index.html. Para build e testes, Node.js e npm ci continuam necessários. Cadastros de origens diferentes não são compartilhados: porta, protocolo e domínio fazem parte da origem.

## Uso e armazenamento
Preencha os campos obrigatórios e selecione “Salvar cadastro local”. Campos inválidos recebem mensagem associada, borda e aria-invalid; o resumo recebe foco e contém atalhos para corrigi-los. Após salvar, os dados reaparecem ao recarregar ou retornar ao cadastro.

“Limpar campos” limpa apenas a edição da tela. “Excluir cadastro salvo” remove somente a chave ongComunidade:cadastro:v1 e limpa a tela. O armazenamento contém versão, data ISO e dados. A leitura verifica estrutura, tipos e critérios novamente. JSON inválido, bloqueio ou falta de espaço geram orientação, sem simular sucesso.

O navegador pode apagar ou alterar esses dados. localStorage não é criptografado, não autentica usuários, não sincroniza dispositivos e não substitui validação no servidor numa aplicação real. O modo de contraste permanece durante a navegação SPA, mas volta ao tema padrão ao recarregar.

## Testes
    npm test
    npm run build
    npm run preview
    npm run medir

npm test executa 12 testes com Node.js e jsdom: limites dos campos, JSON corrompido, alteração do esquema, quota e bloqueio, exclusão isolada, roteamento, templates, repetição de eventos, foco do resumo e restauração segura. jsdom não substitui testes de layout ou de leitores de tela.

Confira também a build no navegador: navegação/Voltar/Avançar, cadastro inválido/válido, recuperação, exclusão, menus com teclado, Escape no modal, contraste e larguras 320, 480, 640, 768, 1024 e 1440 px. Veja docs/VALIDACAO.md para resultados e limitações.

## Acessibilidade e apresentação
A página usa header, nav, main e footer, hierarquia de títulos, rótulos, fieldset/legend, atalho ao conteúdo e controles nativos. aria-expanded/controls descrevem menus; aria-labelledby/describedby identificam diálogo e mensagens. O modal aberto com showModal mantém o foco; Escape e fechamento devolvem o foco ao acionador.

CSS Grid mantém 12 colunas. Breakpoints cumulativos: 480 px (margens), 640 px (dois cartões), 768 px (navegação horizontal e hero 7/5), 1024 px (três cartões e formulário 8/4), 1440 px (contêiner 1280 e intervalo 32). Flexbox alinha componentes internos.

O botão “Alto contraste” alterna data-contraste e aria-pressed. O tema usa fundo preto, texto branco e links/foco amarelos; substitui também fundos explícitos. Mensagens não dependem apenas da cor. prefers-reduced-motion reduz movimento e forced-colors preserva bordas/foco com cores de sistema. Não se declara conformidade integral WCAG 2.1 AA: testes com leitores de tela permanecem pendentes.

## Build, otimização e publicação
vite.config.js usa root: 'html', base: './', build.outDir: '../dist'. Vite reúne módulos e minifica CSS/JS; scripts/minificar-html.js processa o HTML conservando tags e atributos de acessibilidade. O diretório dist contém a aplicação estática e imagens com nomes versionados por conteúdo. npm run preview é somente para conferência local.

PNG preserva o logo; JPEG é alternativa às ilustrações em WebP. picture prioriza WebP, img mantém fallback. A imagem principal tem prioridade de carregamento, e os cartões usam loading="lazy". Width/height, max-width, aspect-ratio e object-fit reservam e ajustam as áreas visuais. Não há srcset com múltiplas resoluções.

npm run medir compara fontes, build sem minificação e build final, excluindo imagens, source maps, testes e ferramentas. A medição em bytes não representa automaticamente uma redução do tempo de carregamento. Os resultados ficam em reports/medicao.json.

No GitHub, selecione Settings > Pages > Source: GitHub Actions. O workflow valida PRs para develop/main e pushes nessas branches. Somente main pode publicar após teste e build aprovados. A etapa de publicação usa permissions pages: write e id-token: write; as demais têm apenas leitura do código. PRs não publicam.

Publicação e registros remotos: veja docs/ENTREGA.md para o estado efetivamente confirmado. Não há variáveis secretas exigidas pela aplicação.

## Versionamento e manutenção
main representa a entrega estável; develop integra evolução; feature/spa contém a implementação. release/* prepara uma entrega e hotfix/* será criado se houver correção urgente. Não se criam branches vazias para aparentar trabalho inexistente.

Conventional Commits descrevem alterações reais com chore, feat, fix, test e docs. A versão segue MAJOR.MINOR.PATCH: incompatibilidade, funcionalidade compatível e correção, respectivamente. O primeiro commit registra a base já existente; não reconstrói um histórico fictício das atividades anteriores.

Use issues para critérios de conclusão, milestone para a meta e PRs para explicar alterações e evidências. Revisão individual não é aprovação de um terceiro. Antes de integrar alterações, execute testes e build; depois, confira rotas, imagens, foco, formulário e contraste.

## Autoria e recursos
Atividade acadêmica desenvolvida com assistência de IA, com revisão e testes descritos nos documentos. O uso da assistência não implica domínio autônomo de todas as técnicas. As ilustrações são geradas com IA e representam uma organização fictícia.

