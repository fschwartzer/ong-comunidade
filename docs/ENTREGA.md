# Entrega publicada

Versão da entrega: 1.0.0.

- Site público: https://fschwartzer.github.io/ong-comunidade/
- Código-fonte: https://github.com/fschwartzer/ong-comunidade
- Issue da consolidação: https://github.com/fschwartzer/ong-comunidade/issues/1
- Milestone: https://github.com/fschwartzer/ong-comunidade/milestone/1
- PR da SPA integrado em develop: https://github.com/fschwartzer/ong-comunidade/pull/2
- PR de lançamento integrado em main: https://github.com/fschwartzer/ong-comunidade/pull/3
- CI da implementação aprovado: https://github.com/fschwartzer/ong-comunidade/actions/runs/35651391693
- Primeira publicação aprovada: https://github.com/fschwartzer/ong-comunidade/actions/runs/35651733864

## Verificação em produção — 21/09/2026
Endereço HTTPS aberto no navegador. Confirmados: navegação SPA, imagens WebP carregadas, modal, erros de formulário, alto contraste, gravação e recuperação após recarregar, exclusão do cadastro fictício. Console sem avisos/erros durante essas verificações.

O workflow testa PRs e publica somente main após os testes e a build passarem. O código e o site são públicos por autorização expressa do responsável.

## Evidências e limites
Há 12 testes automatizados aprovados e validação W3C sem mensagens nos HTML fonte e minificado. A redução medida foi de 18,46% em relação à build equivalente sem minificação (47.301 para 38.569 bytes de HTML/CSS/JS); em relação aos arquivos-fonte, a redução global foi 17,05%. Esses números não são medidas de tempo de carregamento.

NVDA/VoiceOver, auditoria integral WCAG AA e métricas comparativas Lighthouse permanecem pendentes. A aplicação utiliza apenas dados fictícios e não possui backend, autenticação, pagamentos ou doações reais.

