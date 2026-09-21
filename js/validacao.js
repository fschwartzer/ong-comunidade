export const campos = Object.freeze(['nome', 'email', 'telefone', 'cep', 'interesse', 'horas', 'mensagem']);
const interesses = ['voluntariado', 'educacao', 'doacoes'];
export function validarDados(dados) {
  const erros = {};
  if (!dados || typeof dados !== 'object' || Array.isArray(dados)) return { dados: 'Formato de cadastro inválido.' };
  for (const nome of campos.filter(nome => nome !== 'horas')) {
    if (typeof dados[nome] !== 'string') erros[nome] = 'Informe um texto válido.';
  }
  if (!erros.nome && (dados.nome.trim().length < 3 || dados.nome.length > 100)) erros.nome = 'Informe de 3 a 100 caracteres para o nome, além de espaços.';
  if (!erros.email && (dados.email.length > 150 || !/^[a-zA-Z0-9.!#$%&'*+/=?^_\x60{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?)*$/.test(dados.email))) erros.email = 'Informe um e-mail válido, como nome@exemplo.com.';
  if (!erros.telefone && !/^\d{10,11}$/.test(dados.telefone)) erros.telefone = 'Digite 10 ou 11 números com DDD, sem símbolos.';
  if (!erros.cep && dados.cep !== '' && !/^\d{8}$/.test(dados.cep)) erros.cep = 'Digite os 8 números do CEP, sem hífen.';
  if (!erros.interesse && !interesses.includes(dados.interesse)) erros.interesse = 'Selecione uma área de interesse.';
  if (dados.horas !== null && (typeof dados.horas !== 'number' || !Number.isInteger(dados.horas) || dados.horas < 1 || dados.horas > 40)) erros.horas = 'Informe um número inteiro entre 1 e 40, ou deixe vazio.';
  if (!erros.mensagem && dados.mensagem.length > 500) erros.mensagem = 'Limite a mensagem a 500 caracteres.';
  return erros;
}
export function lerFormulario(form) {
  const dados = {};
  campos.forEach(nome => {
    const campo = form.elements.namedItem(nome);
    dados[nome] = nome === 'horas' ? (campo.value === '' ? null : campo.valueAsNumber) : campo.value;
  });
  return dados;
}
export function iniciarFormulario(raiz, { salvar, excluir, notificar, limparNotificacao }) {
  let enviado = false;
  const tocados = new Set();
  const formAtual = () => raiz.querySelector('#cadastro');
  function conferir(form, nome) {
    const campo = form.elements.namedItem(nome);
    const erros = validarDados(lerFormulario(form));
    const mensagem = erros[nome] || (campo.validity.valid ? '' : campo.validationMessage);
    const erro = form.querySelector('#erro-' + nome);
    if (mensagem) campo.setAttribute('aria-invalid', 'true');
    else campo.removeAttribute('aria-invalid');
    campo.classList.toggle('is-invalid', Boolean(mensagem));
    campo.classList.toggle('is-valid', !mensagem && campo.value.trim() !== '');
    erro.textContent = mensagem;
    erro.hidden = !mensagem;
    return !mensagem;
  }
  function resumo(form, moverFoco = false) {
    const bloco = form.querySelector('#resumo-erros');
    const lista = form.querySelector('#lista-erros');
    lista.replaceChildren();
    campos.forEach(nome => {
      const campo = form.elements.namedItem(nome);
      if (campo.getAttribute('aria-invalid') !== 'true') return;
      const li = document.createElement('li');
      const link = document.createElement('a');
      link.href = '#' + nome;
      link.dataset.erroDestino = nome;
      link.textContent = campo.labels[0].textContent + ': ' + form.querySelector('#erro-' + nome).textContent;
      li.append(link);
      lista.append(li);
    });
    bloco.hidden = lista.children.length === 0;
    if (moverFoco && !bloco.hidden) bloco.focus();
  }
  function esconderConfirmacao(form) {
    form.querySelector('#retorno').hidden = true;
    limparNotificacao();
    const estado = raiz.querySelector('#estado-cadastro');
    estado.hidden = true;
  }
  function edicao(event) {
    const form = formAtual();
    if (!form || !form.contains(event.target) || !campos.includes(event.target.name)) return;
    if (event.type !== 'focusout') esconderConfirmacao(form);
    if (event.type !== 'input') tocados.add(event.target.name);
    if (enviado || tocados.has(event.target.name)) conferir(form, event.target.name);
    if (enviado) resumo(form);
  }
  ['input', 'change', 'focusout'].forEach(tipo => raiz.addEventListener(tipo, edicao));
  raiz.addEventListener('submit', event => {
    const form = formAtual();
    if (event.target !== form) return;
    event.preventDefault();
    enviado = true;
    const valido = campos.map(nome => conferir(form, nome)).every(Boolean);
    esconderConfirmacao(form);
    resumo(form, true);
    if (!valido) return;
    const resultado = salvar(lerFormulario(form));
    if (resultado.ok) {
      form.querySelector('#retorno').hidden = false;
      notificar('Cadastro salvo', 'Os dados fictícios foram salvos somente neste navegador.');
    } else {
      const estado = raiz.querySelector('#estado-cadastro');
      estado.textContent = resultado.mensagem;
      estado.hidden = false;
      estado.setAttribute('tabindex', '-1');
      estado.focus();
      notificar('Não foi possível salvar', resultado.mensagem);
    }
  });
  raiz.addEventListener('reset', event => {
    if (event.target !== formAtual()) return;
    enviado = false; tocados.clear();
    const form = event.target;
    esconderConfirmacao(form);
    campos.forEach(nome => {
      const campo = form.elements.namedItem(nome);
      campo.removeAttribute('aria-invalid');
      campo.classList.remove('is-invalid', 'is-valid');
      form.querySelector('#erro-' + nome).hidden = true;
    });
    form.querySelector('#resumo-erros').hidden = true;
  });
  raiz.addEventListener('click', event => {
    const form = formAtual();
    if (!form) return;
    const link = event.target.closest('[data-erro-destino]');
    if (link) { event.preventDefault(); form.elements.namedItem(link.dataset.erroDestino).focus(); }
    if (event.target.closest('[data-excluir]')) {
      const resultado = excluir();
      if (resultado.ok) {
        form.reset();
        notificar('Cadastro excluído', 'O registro desta aplicação foi removido deste navegador.');
      } else notificar('Não foi possível excluir', resultado.mensagem);
    }
  });
  return function preparar(dados, aviso) {
    enviado = false; tocados.clear();
    const form = formAtual();
    if (!form) return;
    form.noValidate = true;
    if (dados) campos.forEach(nome => { form.elements.namedItem(nome).value = dados[nome] ?? ''; });
    const estado = raiz.querySelector('#estado-cadastro');
    estado.textContent = aviso || (dados ? 'Cadastro recuperado deste navegador. Você pode atualizar ou excluir os dados.' : '');
    estado.hidden = !estado.textContent;
  };
}

