import { campos, validarDados } from './validacao.js';
export const CHAVE = 'ongComunidade:cadastro:v1';
export function criarArmazenamento(obterStorage = () => window.localStorage) {
  function ler() {
    try {
      const texto = obterStorage().getItem(CHAVE);
      if (texto === null) return { ok: true, dados: null };
      if (texto.length > 20000) throw new Error('Registro excessivo');
      const registro = JSON.parse(texto);
      if (!registro || registro.versao !== 1 || typeof registro.salvoEm !== 'string' || !Number.isFinite(Date.parse(registro.salvoEm)) ||
          !registro.dados || Object.keys(registro.dados).length !== campos.length ||
          !campos.every(nome => Object.hasOwn(registro.dados, nome)) || Object.keys(validarDados(registro.dados)).length) throw new Error('Registro inválido');
      return { ok: true, dados: registro.dados };
    } catch {
      return { ok: false, dados: null, mensagem: 'Não foi possível recuperar o cadastro. O armazenamento pode estar indisponível ou conter dados inválidos. Você pode preencher novamente ou excluir o registro.' };
    }
  }
  function salvar(dados) {
    if (Object.keys(validarDados(dados)).length) return { ok: false, mensagem: 'Revise os campos antes de salvar.' };
    const copia = Object.fromEntries(campos.map(nome => [nome, dados[nome]]));
    try {
      obterStorage().setItem(CHAVE, JSON.stringify({ versao: 1, salvoEm: new Date().toISOString(), dados: copia }));
      return { ok: true, dados: copia };
    } catch {
      return { ok: false, mensagem: 'Os dados não foram salvos. O armazenamento do navegador pode estar bloqueado ou sem espaço. O formulário continua disponível.' };
    }
  }
  function excluir() {
    try { obterStorage().removeItem(CHAVE); return { ok: true }; }
    catch { return { ok: false, mensagem: 'O navegador não permitiu excluir o cadastro. Confira as permissões de armazenamento deste site.' }; }
  }
  return { ler, salvar, excluir };
}

