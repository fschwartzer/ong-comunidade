const titulos = { inicio: 'Início', projetos: 'Projetos', cadastro: 'Cadastro', 'nao-encontrada': 'Página não encontrada' };
export function resolverRota(hash) {
  if (!hash || hash === '#') return { nome: 'inicio', alvo: '' };
  const match = /^#\/(inicio|projetos|cadastro)(?:\/(comunidade|educacao|campanha))?$/.exec(hash);
  if (!match || (match[2] && match[1] !== 'projetos')) return { nome: 'nao-encontrada', alvo: '' };
  return { nome: match[1], alvo: match[2] || '' };
}
export function iniciarRoteador({ renderizar, antes, depois }) {
  const raiz = document.querySelector('#conteudo-spa');
  function atualizar() {
    const rota = resolverRota(location.hash);
    antes();
    raiz.replaceChildren(renderizar(rota.nome));
    document.title = 'ONG Comunidade | ' + titulos[rota.nome];
    document.querySelectorAll('.navegacao a[data-rota]').forEach(link => {
      const ativa = link.getAttribute('href') === '#/' + rota.nome;
      if (ativa) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
    depois(rota);
    const alvo = (rota.alvo && raiz.querySelector('#titulo-' + rota.alvo)) || raiz.querySelector('h1');
    if (alvo) {
      alvo.setAttribute('tabindex', '-1');
      alvo.focus({ preventScroll: true });
      if (rota.alvo) alvo.scrollIntoView({ block: 'center' });
      else window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }
  document.addEventListener('click', event => {
    const link = event.target.closest('a[data-rota]');
    if (!link || event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || link.hasAttribute('download') || (link.target && link.target !== '_self')) return;
    const url = new URL(link.href);
    if (url.origin !== location.origin || url.pathname !== location.pathname || url.search !== location.search) return;
    event.preventDefault();
    if (location.hash === url.hash) atualizar();
    else location.hash = url.hash;
  });
  window.addEventListener('hashchange', atualizar);
  atualizar();
}

