# Verificação da entrega

Data: 21/09/2026. Relato de execução, sem declarar auditoria WCAG integral.

## Automatizado
- 12 testes Node.js/jsdom aprovados.
- Cadastro completo/opcionais vazios; campos inválidos e limites.
- JSON corrompido, esquema/versão/data inválidos e conteúdo adulterado.
- Exceções de acesso e quota sem falso sucesso.
- Exclusão restrita à chave da aplicação.
- Rotas desconhecidas e cliques modificados.
- Hierarquia e IDs únicos nos templates.
- Cinco renderizações do formulário sem multiplicar gravações.
- Foco no resumo, links de erro, reset e remoção da confirmação na edição.
- Texto do usuário recuperado por value, sem interpretá-lo como HTML.

## HTML
W3C Nu Validator: o documento fonte e o documento minificado retornaram messages: [].
A validação de marcação não valida toda a acessibilidade nem a execução da aplicação.

## Navegador da aplicação
Na build de produção local, foram conferidos: erro de envio vazio, cadastro fictício válido, persistência após recarregar, seleção de WebP, alto contraste, modal com Escape e retorno de foco, menu móvel e larguras 320, 480, 640, 768, 1024 e 1440 px sem rolagem horizontal no formulário. A malha manteve 12 colunas.

## Contraste das cores definidas no CSS
Cálculo por script de luminância relativa WCAG, valores arredondados:
- Texto #203C30 / fundo #FAF8F3: 11,30:1.
- Texto #526158 / fundo #FFFFFF: 6,54:1.
- Botão #FFFFFF / #185B40: 8,05:1.
- Hover #FFFFFF / #10412E: 11,55:1.
- Etiqueta #8A4B20 / #F4E2CD: 5,34:1.
- Erro #A12622 / #FFF2EF: 6,82:1.
- Sucesso #203C30 / #E8F3EB: 10,54:1.
- Alto contraste: #FFFFFF / #000000 = 21:1; #FFFF00 / #000000 = 19,56:1.
Não são resultados de WebAIM, NVDA ou Lighthouse.

## Observações e limites
- O primeiro teste do roteador consultava um h1 de noscript no DOM simulado; foi corrigido para consultar #conteudo-spa, a região efetivamente renderizada. Era uma falha do teste, não um bug de minificação.
- Não houve falha de lógica atribuída à minificação nas verificações realizadas.
- Não foram medidos Lighthouse, LCP comparativo nem tempo de carregamento em rede controlada.
- NVDA/VoiceOver, outros motores de navegador e avaliação completa WCAG AA permanecem pendentes.
- A aplicação exige JavaScript; noscript informa essa dependência.
- Sem API, conta de usuário, backend, pagamento ou doação real.


## Produção pública
GitHub Pages verificado em HTTPS em 21/09/2026: navegação, imagens, modal, alto contraste, erro de formulário, salvamento/recuperação/exclusão de dados fictícios. Console sem avisos ou erros observados. Testes e build remotos aprovados antes da publicação.

