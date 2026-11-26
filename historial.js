/* Historial de resultados del portal (se guarda en el navegador, localStorage). */
(function () {
  var KEY = 'huelva_pm_historial';
  function leer() { try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch (e) { return []; } }
  function escribir(a) { try { localStorage.setItem(KEY, JSON.stringify(a)); return true; } catch (e) { return false; } }
  function numTema(t) { var m = /Tema\s*(\d+)/.exec(t || ''); return m ? +m[1] : 0; }
  // d: { tipo, total, ok, fail, blank, nota, segundos, items: [{ t, q, r, s }] }  (s: 'o' acierto, 'f' fallo, 'b' en blanco; r = pregunta de reserva)
  function guardar(d) {
    var por = {}, fails = [];
    (d.items || []).forEach(function (i) {
      if (i.r) return;
      var k = numTema(i.t), o = por[k] || (por[k] = { o: 0, f: 0, b: 0 });
      if (i.s === 'o') o.o++; else if (i.s === 'f') { o.f++; fails.push(String(i.q).slice(0, 160)); } else o.b++;
    });
    var a = leer();
    a.push({ id: Date.now(), tipo: d.tipo, fecha: new Date().toISOString(), total: d.total, ok: d.ok, fail: d.fail, blank: d.blank,
             nota: Math.round(d.nota * 1000) / 1000, seg: d.segundos, por: por, fails: fails });
    if (a.length > 300) a = a.slice(-300);
    escribir(a);
  }
  window.HistorialPM = { leer: leer, escribir: escribir, guardar: guardar, key: KEY };
})();
