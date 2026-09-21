import { iniciarRoteador } from './roteador.js';
import { renderizarTela } from './templates.js';
import { iniciarFormulario } from './validacao.js';
import { criarArmazenamento, CHAVE } from './armazenamento.js';
import { iniciarInterface } from './interface.js';

const armazenamento = criarArmazenamento();
const interfaceUI = iniciarInterface();
let recuperacao = armazenamento.ler();
const preparar = iniciarFormulario(document.querySelector('#conteudo-spa'), {
  salvar(dados) {
    const resultado = armazenamento.salvar(dados);
    if (resultado.ok) recuperacao = resultado;
    return resultado;
  },
  excluir() {
    const resultado = armazenamento.excluir();
    if (resultado.ok) recuperacao = { ok: true, dados: null };
    return resultado;
  },
  notificar: interfaceUI.notificar,
  limparNotificacao: interfaceUI.limparNotificacao
});
iniciarRoteador({
  renderizar: renderizarTela,
  antes: interfaceUI.antesDaRota,
  depois(rota) {
    if (rota.nome === 'cadastro') {
      recuperacao = armazenamento.ler();
      preparar(recuperacao.dados, recuperacao.ok ? '' : recuperacao.mensagem);
    }
  }
});
// Outra aba pode mudar o registro: avisa sem sobrescrever a edição em curso.
window.addEventListener('storage', event => {
  if (event.key === CHAVE || event.key === null) {
    recuperacao = armazenamento.ler();
    interfaceUI.notificar('Armazenamento atualizado', 'O cadastro foi alterado em outra aba. Volte à tela de cadastro para recuperar a versão salva.');
  }
});

