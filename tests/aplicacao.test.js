import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { JSDOM } from 'jsdom';
import { validarDados, iniciarFormulario } from '../js/validacao.js';
import { criarArmazenamento, CHAVE } from '../js/armazenamento.js';
import { resolverRota, iniciarRoteador } from '../js/roteador.js';
import { renderizarTela } from '../js/templates.js';

const valido = () => ({ nome: 'Pessoa de Teste', email: 'teste@example.com', telefone: '11999999999', cep: '01001000', interesse: 'educacao', horas: 4, mensagem: 'Cadastro fictício.' });
function memoria() {
  const mapa = new Map();
  return { getItem: chave => mapa.get(chave) ?? null, setItem: (chave, valor) => mapa.set(chave, valor), removeItem: chave => mapa.delete(chave) };
}
test('validação aceita cadastro completo e campos opcionais vazios', () => {
  assert.deepEqual(validarDados(valido()), {});
  assert.deepEqual(validarDados({ ...valido(), cep: '', horas: null, mensagem: '' }), {});
});
test('validação recusa campos vazios, tipos incorretos, limites e formatos', () => {
  for (const [campo, valor] of [['nome', '   '], ['nome', 'ab'], ['nome', 'a'.repeat(101)], ['email', 'sem-arroba'], ['email', 'a'.repeat(151)], ['telefone', '11 99999-9999'], ['cep', '123'], ['interesse', 'externo'], ['horas', 1.5], ['horas', 0], ['horas', 41], ['horas', '4'], ['mensagem', 'x'.repeat(501)]]) {
    assert.ok(validarDados({ ...valido(), [campo]: valor })[campo], campo);
  }
  assert.ok(validarDados(null).dados);
  assert.ok(validarDados([]).dados);
});
test('gravação, leitura e substituição usam JSON e somente a chave da aplicação', () => {
  const storage = memoria();
  storage.setItem('outro-projeto', 'preservar');
  const api = criarArmazenamento(() => storage);
  assert.equal(api.ler().dados, null);
  assert.equal(api.salvar(valido()).ok, true);
  const registro = JSON.parse(storage.getItem(CHAVE));
  assert.equal(registro.versao, 1);
  assert.ok(Number.isFinite(Date.parse(registro.salvoEm)));
  assert.deepEqual(api.ler().dados, valido());
  api.salvar({ ...valido(), nome: 'Segundo Registro' });
  assert.equal(api.ler().dados.nome, 'Segundo Registro');
  assert.equal(api.excluir().ok, true);
  assert.equal(storage.getItem(CHAVE), null);
  assert.equal(storage.getItem('outro-projeto'), 'preservar');
});
test('JSON corrompido, versão desconhecida e dados manipulados não são restaurados', () => {
  const storage = memoria(), api = criarArmazenamento(() => storage);
  for (const valor of ['{quebrado', 'null', '[]', JSON.stringify({ versao: 2, salvoEm: new Date().toISOString(), dados: valido() }), JSON.stringify({ versao: 1, salvoEm: 'ontem', dados: valido() }), JSON.stringify({ versao: 1, salvoEm: new Date().toISOString(), dados: { ...valido(), horas: '4' } }), JSON.stringify({ versao: 1, salvoEm: new Date().toISOString(), dados: { ...valido(), extra: true } })]) {
    storage.setItem(CHAVE, valor);
    assert.equal(api.ler().ok, false);
    assert.equal(api.ler().dados, null);
  }
});
test('bloqueio de acesso e quota não produzem falso sucesso', () => {
  const bloqueado = criarArmazenamento(() => { throw new Error('SecurityError'); });
  assert.equal(bloqueado.ler().ok, false);
  assert.equal(bloqueado.salvar(valido()).ok, false);
  assert.equal(bloqueado.excluir().ok, false);
  const storage = memoria();
  storage.setItem = () => { throw new Error('QuotaExceededError'); };
  assert.equal(criarArmazenamento(() => storage).salvar(valido()).ok, false);
});
test('cadastro inválido não chega ao armazenamento', () => {
  const storage = memoria();
  assert.equal(criarArmazenamento(() => storage).salvar({ ...valido(), email: '' }).ok, false);
  assert.equal(storage.getItem(CHAVE), null);
});
test('roteamento aceita as rotas previstas e rejeita caminhos imprevistos', () => {
  assert.deepEqual(resolverRota(''), { nome: 'inicio', alvo: '' });
  assert.deepEqual(resolverRota('#/projetos/campanha'), { nome: 'projetos', alvo: 'campanha' });
  assert.equal(resolverRota('#/cadastro').nome, 'cadastro');
  for (const hash of ['#/cadastro/campanha', '#/inexistente', '#/projetos/<script>', '#nome']) assert.equal(resolverRota(hash).nome, 'nao-encontrada');
});
function ambiente() {
  const dom = new JSDOM(readFileSync('html/index.html', 'utf8'), { url: 'https://exemplo.test/ong/' });
  globalThis.window = dom.window;
  globalThis.document = dom.window.document;
  globalThis.location = dom.window.location;
  dom.window.scrollTo = () => {};
  dom.window.HTMLElement.prototype.scrollIntoView = () => {};
  return dom;
}
test('templates geram cartões com IDs únicos e hierarquia correta', () => {
  const dom = ambiente(), root = document.querySelector('#conteudo-spa');
  for (const nome of ['inicio', 'projetos', 'cadastro', 'nao-encontrada']) {
    root.replaceChildren(renderizarTela(nome));
    const ids = [...document.querySelectorAll('[id]')].map(x => x.id);
    assert.equal(ids.length, new Set(ids).size);
    assert.equal(root.querySelectorAll('h1').length, 1);
    if (nome === 'inicio' || nome === 'projetos') {
      assert.equal(root.querySelectorAll('.card').length, 3);
      assert.equal(root.querySelectorAll(nome === 'inicio' ? '.card h3' : '.card h2').length, 3);
      assert.ok([...root.querySelectorAll('.card img')].every(img => img.alt));
    }
  }
  dom.window.close();
});
test('eventos delegados continuam únicos após trocar e restaurar templates', () => {
  const dom = ambiente(), root = document.querySelector('#conteudo-spa');
  let gravacoes = 0;
  const preparar = iniciarFormulario(root, { salvar: () => { gravacoes++; return { ok: true }; }, excluir: () => ({ ok: true }), notificar() {}, limparNotificacao() {} });
  for (let i = 0; i < 5; i++) {
    root.replaceChildren(renderizarTela('cadastro'));
    preparar(valido(), '');
    root.querySelector('form').dispatchEvent(new dom.window.Event('submit', { bubbles: true, cancelable: true }));
    root.replaceChildren(renderizarTela('inicio'));
  }
  assert.equal(gravacoes, 5);
  dom.window.close();
});
test('formulário sinaliza falhas, move o foco e remove confirmação ao editar', () => {
  const dom = ambiente(), root = document.querySelector('#conteudo-spa');
  let gravacoes = 0;
  const preparar = iniciarFormulario(root, { salvar: () => { gravacoes++; return { ok: true }; }, excluir: () => ({ ok: true }), notificar() {}, limparNotificacao() {} });
  root.replaceChildren(renderizarTela('cadastro')); preparar(null, '');
  const form = root.querySelector('form');
  form.dispatchEvent(new dom.window.Event('submit', { bubbles: true, cancelable: true }));
  assert.equal(gravacoes, 0);
  assert.equal(document.activeElement.id, 'resumo-erros');
  assert.equal(root.querySelector('#nome').getAttribute('aria-invalid'), 'true');
  root.querySelector('[data-erro-destino]').click();
  assert.equal(document.activeElement.id, 'nome');
  preparar(valido(), '');
  form.dispatchEvent(new dom.window.Event('submit', { bubbles: true, cancelable: true }));
  assert.equal(gravacoes, 1);
  assert.equal(root.querySelector('#retorno').hidden, false);
  root.querySelector('#nome').dispatchEvent(new dom.window.Event('input', { bubbles: true }));
  assert.equal(root.querySelector('#retorno').hidden, true);
  form.reset();
  assert.equal(root.querySelector('#nome').value, '');
  assert.equal(root.querySelector('#nome').hasAttribute('aria-invalid'), false);
  dom.window.close();
});
test('restauração usa value e não interpreta texto do usuário como HTML', () => {
  const dom = ambiente(), root = document.querySelector('#conteudo-spa');
  root.replaceChildren(renderizarTela('cadastro'));
  const preparar = iniciarFormulario(root, { salvar() {}, excluir() {}, notificar() {}, limparNotificacao() {} });
  preparar({ ...valido(), mensagem: '<img src=x onerror=alert(1)>' }, '');
  assert.equal(root.querySelector('#mensagem').value, '<img src=x onerror=alert(1)>');
  assert.equal(root.querySelector('#mensagem').children.length, 0);
  dom.window.close();
});
test('roteador mantém navegação na mesma página e não intercepta cliques modificados', () => {
  const dom = ambiente();
  iniciarRoteador({ renderizar: renderizarTela, antes() {}, depois() {} });
  const link = document.querySelector('a[href="#/projetos"]');
  const modificado = new dom.window.MouseEvent('click', { bubbles: true, cancelable: true, ctrlKey: true });
  // Impede apenas a navegação do simulador após conferir a lógica da aplicação.
  document.addEventListener('click', event => { if (event.ctrlKey) { assert.equal(event.defaultPrevented, false); event.preventDefault(); } }, { once: true });
  link.dispatchEvent(modificado);
  assert.equal(document.querySelector('#conteudo-spa h1').id, 'titulo-inicio');
  const normal = new dom.window.MouseEvent('click', { bubbles: true, cancelable: true });
  link.dispatchEvent(normal);
  assert.equal(normal.defaultPrevented, true);
  assert.equal(location.hash, '#/projetos');
  window.dispatchEvent(new dom.window.HashChangeEvent('hashchange'));
  assert.equal(document.title, 'ONG Comunidade | Projetos');
  assert.equal(document.activeElement.id, 'titulo-projetos');
  dom.window.close();
});


