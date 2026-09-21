'use strict';

// Os menus só são recolhidos depois de seus controles estarem operacionais.
const nav = document.querySelector('.navegacao');
const menuButton = document.querySelector('.menu-botao');
const subButton = document.querySelector('.submenu-botao');
const desktop = window.matchMedia('(min-width: 768px)');
function closeSub(restoreFocus = false) {
  const wasOpen = subButton.getAttribute('aria-expanded') === 'true';
  subButton.setAttribute('aria-expanded', 'false');
  if (wasOpen && restoreFocus) subButton.focus();
}
menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  if (!open) closeSub();
});
subButton.addEventListener('click', () => subButton.setAttribute('aria-expanded', String(subButton.getAttribute('aria-expanded') !== 'true')));
nav.addEventListener('keydown', event => {
  if (event.key !== 'Escape') return;
  if (subButton.getAttribute('aria-expanded') === 'true') closeSub(true);
  else if (!desktop.matches && menuButton.getAttribute('aria-expanded') === 'true') {
    menuButton.setAttribute('aria-expanded', 'false'); menuButton.focus();
  }
});
document.addEventListener('click', event => {
  if (!nav.contains(event.target)) {
    if (document.querySelector('.submenu').contains(document.activeElement)) closeSub(true);
    else closeSub();
    if (!desktop.matches) {
      if (document.querySelector('.menu-lista').contains(document.activeElement)) menuButton.focus();
      menuButton.setAttribute('aria-expanded', 'false');
    }
  }
});
desktop.addEventListener('change', () => {
  const focusInSub = document.querySelector('.submenu').contains(document.activeElement);
  if (focusInSub) subButton.focus();
  closeSub();
  const focusInMenu = document.querySelector('.menu-lista').contains(document.activeElement);
  if (!desktop.matches && focusInMenu) menuButton.focus();
  if (desktop.matches && document.activeElement === menuButton) document.querySelector('.menu-lista a').focus();
  menuButton.setAttribute('aria-expanded', 'false');
});
nav.classList.add('menu-pronto');

// Dialog nativo: foco contido, Escape e restauração do foco ao fechar.
const dialog = document.querySelector('#modal-participacao');
let modalOrigin = null;
document.querySelectorAll('[data-abrir-modal]').forEach(button => {
  button.hidden = false;
  button.addEventListener('click', () => {
    modalOrigin = button; dialog.showModal(); document.body.classList.add('modal-aberto');
  });
});
dialog.querySelector('[data-fechar-modal]').addEventListener('click', () => dialog.close());
dialog.addEventListener('close', () => {
  document.body.classList.remove('modal-aberto');
  if (modalOrigin) modalOrigin.focus();
});
dialog.addEventListener('click', event => {
  const rect = dialog.getBoundingClientRect();
  if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) dialog.close();
});

const form = document.querySelector('#cadastro');
if (form) {
  const fields = [...form.querySelectorAll('input, select, textarea')];
  const summary = document.querySelector('#resumo-erros');
  const errorList = document.querySelector('#lista-erros');
  const success = document.querySelector('#retorno');
  const toast = document.querySelector('#toast');
  const toastClose = document.querySelector('#fechar-toast');
  let submitted = false;
  function errorMessage(field) {
    if (field.validity.valueMissing) return field.tagName === 'SELECT' ? 'Selecione uma área de interesse.' : 'Preencha este campo obrigatório.';
    if (field.id === 'nome' && !field.validity.valid) return 'Informe um nome com pelo menos 3 caracteres, além de espaços.';
    if (field.validity.typeMismatch) return 'Informe um e-mail no formato nome@exemplo.com.';
    if (field.id === 'telefone' && !field.validity.valid) return 'Digite 10 ou 11 números com DDD, sem símbolos.';
    if (field.id === 'cep' && !field.validity.valid) return 'Digite os 8 números do CEP, sem hífen.';
    if (field.id === 'horas' && !field.validity.valid) return 'Informe um número inteiro entre 1 e 40.';
    if (field.validity.tooLong) return 'Reduza o texto ao limite indicado.';
    return field.validationMessage;
  }
  function checkField(field) {
    if (field.id === 'nome') field.setCustomValidity(field.value && field.value.trim().length < 3 ? 'Nome incompleto.' : '');
    const valid = field.validity.valid;
    const error = document.querySelector('#erro-' + field.id);
    field.classList.toggle('is-invalid', !valid);
    field.classList.toggle('is-valid', valid && field.value.trim() !== '');
    if (valid) field.removeAttribute('aria-invalid'); else field.setAttribute('aria-invalid', 'true');
    error.textContent = valid ? '' : errorMessage(field);
    error.hidden = valid;
    return valid;
  }
  function refreshSummary() {
    const invalid = fields.filter(field => field.getAttribute('aria-invalid') === 'true');
    errorList.replaceChildren();
    invalid.forEach(field => {
      const li = document.createElement('li'); const link = document.createElement('a');
      link.href = '#' + field.id;
      link.textContent = field.labels[0].textContent + ': ' + errorMessage(field);
      link.addEventListener('click', event => { event.preventDefault(); field.focus(); });
      li.append(link); errorList.append(li);
    });
    summary.hidden = invalid.length === 0;
  }
  fields.forEach(field => {
    field.addEventListener('blur', () => { field.dataset.touched = 'true'; checkField(field); if (submitted) refreshSummary(); });
    field.addEventListener('input', () => {
      success.hidden = true; toast.hidden = true;
      if (submitted || field.dataset.touched === 'true') { checkField(field); if (submitted) refreshSummary(); }
    });
    field.addEventListener('change', () => {
      success.hidden = true; toast.hidden = true;
      field.dataset.touched = 'true'; checkField(field); if (submitted) refreshSummary();
    });
  });
  form.addEventListener('submit', event => {
    event.preventDefault(); submitted = true;
    const valid = fields.map(checkField).every(Boolean);
    refreshSummary();
    if (!valid) { success.hidden = true; toast.hidden = true; summary.focus(); return; }
    success.hidden = false;
    toast.hidden = false;
    // Não há fetch, envio, cookies ou persistência de dados neste exercício.
  });
  form.addEventListener('reset', () => {
    submitted = false; summary.hidden = true; success.hidden = true; toast.hidden = true;
    fields.forEach(field => {
      field.setCustomValidity(''); field.classList.remove('is-valid', 'is-invalid');
      field.removeAttribute('aria-invalid'); delete field.dataset.touched;
      document.querySelector('#erro-' + field.id).hidden = true;
    });
  });
  toastClose.addEventListener('click', () => { toast.hidden = true; document.querySelector('#validar').focus(); });
  form.noValidate = true; // A lógica acima usa ValidityState e mensagens acessíveis.
  document.querySelector('#validar').disabled = false;
}
