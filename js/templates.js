const imagens = {
  comunidade: [new URL('../imagens/voluntarios.jpg', import.meta.url).href, new URL('../imagens/voluntarios.webp', import.meta.url).href],
  educacao: [new URL('../imagens/projeto-social.jpg', import.meta.url).href, new URL('../imagens/projeto-social.webp', import.meta.url).href],
  campanha: [new URL('../imagens/doacoes.jpg', import.meta.url).href, new URL('../imagens/doacoes.webp', import.meta.url).href]
};
export const projetos = Object.freeze([
  { id: 'comunidade', categoria: 'Comunidade', titulo: 'Cultivar também é cuidar', texto: 'Encontros para plantar, compartilhar saberes e cuidar dos espaços do bairro. A participação aproxima gerações em torno de uma horta comunitária.', alt: 'Ilustração de quatro voluntários cuidando de uma horta comunitária.', classe: 'badge' },
  { id: 'educacao', categoria: 'Educação', titulo: 'Aprender em comunidade', texto: 'Leitura, apoio à aprendizagem e oficinas criativas. Um espaço para descobrir, trocar experiências e desenvolver novas habilidades.', alt: 'Ilustração de uma educadora e três crianças aprendendo com livros e blocos.', classe: 'badge badge-terra' },
  { id: 'campanha', categoria: 'Solidariedade', titulo: 'Alimentos que aproximam', texto: 'Uma proposta de arrecadação de alimentos para apoiar famílias. Pequenas contribuições podem se transformar em cuidado compartilhado.', alt: 'Ilustração de três voluntários organizando alimentos para doação.', classe: 'badge badge-neutro' }
]);
function cartao(projeto, inicio) {
  const fragmento = document.querySelector('#modelo-cartao').content.cloneNode(true);
  const article = fragmento.querySelector('article');
  article.id = projeto.id;
  const titulo = document.createElement(inicio ? 'h3' : 'h2');
  titulo.id = 'titulo-' + projeto.id;
  titulo.textContent = projeto.titulo;
  fragmento.querySelector('[data-titulo]').replaceWith(titulo);
  article.setAttribute('aria-labelledby', titulo.id);
  fragmento.querySelector('[data-descricao]').textContent = projeto.texto;
  const badge = fragmento.querySelector('.badge');
  badge.textContent = projeto.categoria;
  badge.className = projeto.classe;
  const img = fragmento.querySelector('img');
  img.src = imagens[projeto.id][0];
  img.alt = projeto.alt;
  fragmento.querySelector('source').srcset = imagens[projeto.id][1];
  const acao = document.createElement(projeto.id === 'campanha' ? 'button' : 'a');
  acao.className = 'botao botao-secundario';
  if (projeto.id === 'campanha') {
    acao.type = 'button';
    acao.dataset.abrirModal = '';
    acao.textContent = 'Como doar alimentos';
  } else {
    acao.href = '#/cadastro';
    acao.dataset.rota = '';
    acao.textContent = 'Quero participar';
  }
  fragmento.querySelector('.acoes').append(acao);
  return fragmento;
}
export function renderizarTela(nome) {
  const template = document.querySelector('#tela-' + nome);
  const fragmento = template.content.cloneNode(true);
  const lista = fragmento.querySelector('[data-cartoes]');
  if (lista) {
    const cards = document.createDocumentFragment();
    projetos.forEach(projeto => cards.append(cartao(projeto, nome === 'inicio')));
    lista.replaceChildren(cards);
  }
  return fragmento;
}

