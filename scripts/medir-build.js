import { build } from 'vite';
import { readdir, stat, mkdir, writeFile } from 'node:fs/promises';
import { resolve, join, extname } from 'node:path';
import { minificarHTML } from './minificar-html.js';
async function total(diretorio, extensoes) {
  let bytes = 0;
  for (const item of await readdir(diretorio, { withFileTypes: true })) {
    const caminho = join(diretorio, item.name);
    if (item.isDirectory()) bytes += await total(caminho, extensoes);
    else if (extensoes.includes(extname(caminho))) bytes += (await stat(caminho)).size;
  }
  return bytes;
}
await mkdir('.medicao', { recursive: true });
await build({ build: { outDir: resolve('.medicao/sem-minificar'), emptyOutDir: true, minify: false, cssMinify: false } });
await build();
const html = await minificarHTML();
const extensoes = ['.html', '.css', '.js'];
const original = await total('html', ['.html']) + await total('css', ['.css']) + await total('js', ['.js']);
const baseline = await total('.medicao/sem-minificar', extensoes);
const final = await total('dist', extensoes);
const reducao = (antes, depois) => Number(((antes - depois) / antes * 100).toFixed(2));
const tamanhosImagem = {};
for (const nome of await readdir('imagens')) tamanhosImagem[nome] = (await stat(join('imagens', nome))).size;
const resultado = {
  geradoEm: new Date().toISOString(), fonteBytes: original,
  buildSemMinificacaoBytes: baseline, buildFinalBytes: final,
  reducaoGlobalPercentual: reducao(original, final),
  reducaoMinificacaoPercentual: reducao(baseline, final), html, imagensBytes: tamanhosImagem,
  metodo: 'HTML, CSS e JS sem gzip/Brotli; exclui imagens, ferramentas, testes e source maps. A baseline mantém o mesmo bundler com minificação desativada.',
  tempoCarregamento: 'Não medido. Tamanho em bytes não equivale a tempo de carregamento.'
};
await mkdir('reports', { recursive: true });
await writeFile('reports/medicao.json', JSON.stringify(resultado, null, 2));
console.log(JSON.stringify(resultado, null, 2));

