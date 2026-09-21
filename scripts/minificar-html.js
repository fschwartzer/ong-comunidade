import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { minify } from 'html-minifier-terser';
export async function minificarHTML(diretorio = 'dist') {
  const arquivo = resolve(diretorio, 'index.html');
  const entrada = await readFile(arquivo, 'utf8');
  const saida = await minify(entrada, {
    collapseWhitespace: true, conservativeCollapse: true, removeComments: true,
    removeAttributeQuotes: false, removeOptionalTags: false,
    minifyJS: false, minifyCSS: false
  });
  await writeFile(arquivo, saida);
  return { antes: Buffer.byteLength(entrada), depois: Buffer.byteLength(saida) };
}
if (process.argv[1] && resolve(process.argv[1]) === resolve('scripts/minificar-html.js')) {
  console.log('HTML:', await minificarHTML());
}

