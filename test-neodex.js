// lancé par le test « local » de NeoDex : un motif de date sur un texte, ses correspondances, le remplacement, l'explication, puis un motif qui s'emballe
module.exports = async ({ pj, sleep }) => {
  const type = (id, v) => pj(`(() => { const f = document.getElementById(${JSON.stringify(id)}); f.value = ${JSON.stringify(v)}; f.dispatchEvent(new Event('input')); })(), 0`);
  await sleep(500);
  await type('pa_text', 'Le 14/07/1998 et le 03/12/2026, pas le 32/13/2020.');
  await type('pa_re', String.raw`(?<jour>0[1-9]|[12]\d|3[01])/(?<mois>0[1-9]|1[0-2])/(?<annee>\d{4})`);
  await type('pa_rep', '$<annee>-$<mois>-$<jour>'); await sleep(600);
  const marks = await pj(`document.querySelectorAll('#pa_view mark').length`), out = await pj(`document.getElementById('pa_repOut').textContent`);
  if (marks !== 2) throw new Error(marks + ' correspondances au lieu de 2');
  if (out !== 'Le 1998-07-14 et le 2026-12-03, pas le 32/13/2020.') throw new Error('remplacement : ' + out);
  await pj(`document.querySelector('[data-side=explain]').click(), 0`); await sleep(200);
  const ex = await pj(`document.getElementById('pa_explain').textContent`);
  if (!/groupe nommé « jour »/.test(ex) || !/exactement 4 fois/.test(ex)) throw new Error('explication incomplète');
  await type('pa_text', 'a'.repeat(32) + 'b'); await type('pa_re', '(a+)+$'); await sleep(1800);
  const msg = await pj(`document.querySelector('.paMsg').textContent`);
  if (!/arrêtée/.test(msg)) throw new Error('le motif qui s\'emballe n\'est pas arrêté : ' + msg);
  await type('pa_text', 'Le 14/07/1998 et le 03/12/2026, pas le 32/13/2020.');
  await type('pa_re', String.raw`(?<jour>0[1-9]|[12]\d|3[01])/(?<mois>0[1-9]|1[0-2])/(?<annee>\d{4})`); await sleep(600);
  const over = await pj(`[...document.querySelectorAll('.appWrap *')].filter(e => e.getBoundingClientRect().right > innerWidth + 1).length`);
  if (over) throw new Error(over + ' élément(s) débordent à droite');
  return '2 dates trouvées, remplacement, explication et arrêt d\'un motif qui s\'emballe ok';
};
