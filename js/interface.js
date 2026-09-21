export function iniciarInterface() {
  const nav = document.querySelector('.navegacao');
  const menu = document.querySelector('.menu-botao');
  const submenu = document.querySelector('.submenu-botao');
  const desktop = window.matchMedia('(min-width: 768px)');
  const dialog = document.querySelector('#modal-participacao');
  const toast = document.querySelector('#toast');
  let origem = null;
  function fecharMenus() {
    menu.setAttribute('aria-expanded', 'false');
    submenu.setAttribute('aria-expanded', 'false');
  }
  function limparNotificacao() { toast.hidden = true; }
  function notificar(titulo, mensagem) {
    document.querySelector('#toast-titulo').textContent = titulo;
    document.querySelector('#toast-mensagem').textContent = mensagem;
    toast.hidden = false;
  }
  document.addEventListener('click', event => {
    if (event.target.closest('.menu-botao')) {
      const abrir = menu.getAttribute('aria-expanded') !== 'true';
      menu.setAttribute('aria-expanded', String(abrir));
      if (!abrir) submenu.setAttribute('aria-expanded', 'false');
    } else if (event.target.closest('.submenu-botao')) {
      submenu.setAttribute('aria-expanded', String(submenu.getAttribute('aria-expanded') !== 'true'));
    } else if (!nav.contains(event.target)) {
      const focoOcultado = document.querySelector('.submenu').contains(document.activeElement);
      if (focoOcultado) submenu.focus();
      if (!desktop.matches && document.querySelector('.menu-lista').contains(document.activeElement)) menu.focus();
      fecharMenus();
    }
    const abrirModal = event.target.closest('[data-abrir-modal]');
    if (abrirModal) {
      origem = abrirModal;
      dialog.showModal();
      document.body.classList.add('modal-aberto');
    }
    if (event.target.closest('[data-fechar-modal]')) dialog.close();
    if (event.target.closest('[data-pular]')) {
      event.preventDefault();
      document.querySelector('#conteudo').focus();
      document.querySelector('#conteudo').scrollIntoView();
    }
    if (event.target.closest('#fechar-toast')) {
      limparNotificacao();
      (document.querySelector('#validar') || document.querySelector('#conteudo')).focus();
    }
  });
  nav.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    if (submenu.getAttribute('aria-expanded') === 'true') {
      submenu.setAttribute('aria-expanded', 'false'); submenu.focus();
    } else if (!desktop.matches && menu.getAttribute('aria-expanded') === 'true') {
      menu.setAttribute('aria-expanded', 'false'); menu.focus();
    }
  });
  desktop.addEventListener('change', () => {
    const foco = document.activeElement;
    if (!desktop.matches && document.querySelector('.menu-lista').contains(foco)) menu.focus();
    else if (desktop.matches && foco === menu) document.querySelector('.menu-lista a').focus();
    else if (document.querySelector('.submenu').contains(foco)) submenu.focus();
    fecharMenus();
  });
  dialog.addEventListener('close', () => {
    document.body.classList.remove('modal-aberto');
    if (origem?.isConnected) origem.focus();
  });
  dialog.addEventListener('click', event => {
    const rect = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) dialog.close();
  });
  document.querySelector('#alternar-contraste').addEventListener('click', event => {
    const alto = document.documentElement.dataset.contraste !== 'alto';
    if (alto) document.documentElement.dataset.contraste = 'alto';
    else delete document.documentElement.dataset.contraste;
    event.currentTarget.setAttribute('aria-pressed', String(alto));
  });
  nav.classList.add('menu-pronto');
  return {
    notificar, limparNotificacao,
    antesDaRota() {
      if (dialog.open) { origem = null; dialog.close(); }
      fecharMenus(); limparNotificacao();
    }
  };
}

