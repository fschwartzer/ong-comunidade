# ONG Comunidade — Experiência Prática II

Abra `index.html` no navegador. O projeto também funciona em um servidor estático local. Não exige instalação de dependências.

## Estrutura

```text
ong/
├── index.html
├── projetos.html
├── cadastro.html
├── css/estilos.css
├── js/app.js
├── imagens/
│   ├── logo.png
│   ├── logo.webp
│   ├── voluntarios.jpg
│   ├── voluntarios.webp
│   ├── projeto-social.jpg
│   ├── projeto-social.webp
│   ├── doacoes.jpg
│   └── doacoes.webp
├── plans/PLANS.md
└── LEIA-ME.md
```

## Implementação

- Design System em `:root`: 13 cores, cinco tamanhos de fonte e oito espaçamentos baseados em múltiplos de 4px.
- Grid de 12 colunas. Breakpoints: 480px, 640px, 768px, 1024px e 1440px. Cartões com 12/6/4 colunas; hero com 7/5 colunas a partir de 768px; campos relacionados com seis colunas a partir de 1024px.
- Flexbox: cabeçalho, identidade, menu, conteúdo dos cartões, grupos de ações, badges, alertas, cabeçalho do modal, toast e rodapé.
- Navegação progressiva: hambúrguer abaixo de 768px; dropdown acionado por botão. Estados expostos por `aria-expanded`; Escape fecha e devolve o foco.
- Botões com hover, foco visível, active e disabled; redução das transições com `prefers-reduced-motion`.
- Formulário: restrições nativas consultadas via `ValidityState`, erros após interação, mensagens por campo, resumo focalizável, sucesso e toast. Campos opcionais vazios ficam neutros.
- Badges de categoria; alertas informativo, de orientação, de erro e de sucesso.
- Modal `<dialog>`: orientações para a campanha de alimentos, botão de fechar, Escape e retorno do foco.
- Toast persistente até ser fechado, editar ou limpar os campos, sem desaparecimento automático.

## Como reproduzir os estados

1. Abra `projetos.html` para visualizar cartões, etiquetas e alertas.
2. Use “Conheça as ações” para abrir o dropdown. Em largura inferior a 768px, abra primeiro “Menu”.
3. Clique em “Como doar alimentos” para abrir o modal. Feche com o botão ou Escape.
4. Abra `cadastro.html` e clique em “Validar cadastro” com os campos vazios para mostrar o resumo e os erros.
5. Preencha com dados fictícios: Ana Exemplo, voluntario@example.com, telefone 11999999999, área Projeto educativo. Os demais campos são opcionais.
6. Clique em “Validar cadastro”: serão exibidos o alerta de sucesso e a notificação toast. “Limpar campos” restaura o formulário.

## Verificações realizadas

Os três HTML passaram pelo Nu HTML Checker do W3C sem mensagens na submissão final. A primeira submissão desta etapa indicou a necessidade de atribuir um papel semântico ao resumo de erros; foi acrescentado `role="region"` ao contêiner nomeado com `aria-labelledby`.

Testados no Chromium do navegador integrado: Grid em 12 larguras entre 320 e 1920px; início em seis larguras; cadastro em cinco larguras; nenhum transbordamento horizontal nessas condições. Também foram verificados menu, dropdown, Escape, retorno de foco do modal, obrigatoriedade, formatos de e-mail/telefone/CEP, limite de horas, sucesso, fechamento do toast e limpeza dos estados. Console sem erros/avisos observados. Referências locais e IDs conferidos.

Redução de movimento e a disponibilidade inicial dos links sem execução de JavaScript foram verificadas no código. Não foi feita uma auditoria completa com leitores de tela nem uma matriz de navegadores externos.

O projeto é acadêmico e fictício. Não há requisições de envio, pagamentos, cookies ou persistência de cadastro. Validade de formato não confirma a existência de e-mail, telefone ou CEP. Para uso real, será necessário um servidor com validação, tratamento seguro de dados e regras próprias de operação.
