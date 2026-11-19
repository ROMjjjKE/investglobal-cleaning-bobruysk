document.documentElement.classList.add('js');

/* меню */
(function () {
  var b = document.getElementById('burger'), n = document.getElementById('nav');
  if (!b || !n) return;
  b.addEventListener('click', function () {
    var open = n.classList.toggle('open');
    b.classList.toggle('open', open);
    b.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  n.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') { n.classList.remove('open'); b.classList.remove('open'); }
  });
})();

/* мягкое появление секций */
(function () {
  var els = document.querySelectorAll('.sec, .hero');
  if (!('IntersectionObserver' in window)) return;
  els.forEach(function (el) { el.style.opacity = 0; el.style.transform = 'translateY(14px)'; });
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) {
        en.target.style.transition = 'opacity .5s ease, transform .5s ease';
        en.target.style.opacity = 1;
        en.target.style.transform = 'none';
        io.unobserve(en.target);
      }
    });
  }, { rootMargin: '0px 0px -8% 0px' });
  els.forEach(function (el) { io.observe(el); });
})();

/* форма заявки */
(function () {
  var f = document.getElementById('reqForm');
  if (!f) return;
  var type = document.getElementById('q-type'), area = document.getElementById('q-area'),
      name = document.getElementById('q-name'), tel = document.getElementById('q-tel'),
      note = document.getElementById('q-note'), toast = document.getElementById('toast');
  var box = { type: 'f-type', area: 'f-area', name: 'f-name', tel: 'f-tel' };

  function setErr(key, bad) {
    var el = document.getElementById(box[key]);
    if (el) el.classList.toggle('err', bad);
  }

  f.addEventListener('submit', function (e) {
    e.preventDefault();
    var bad = {
      type: !type.value,
      area: !(parseInt(area.value, 10) > 0),
      name: name.value.trim().length < 2,
      tel: tel.value.replace(/\D/g, '').length < 9
    };
    Object.keys(bad).forEach(function (k) { setErr(k, bad[k]); });
    if (bad.type || bad.area || bad.name || bad.tel) { return; }

    var lines = [
      'Заявка на клининг — Инвест глобал плюс',
      'Объект: ' + type.value,
      'Площадь: ' + area.value + ' м²',
      'Имя: ' + name.value.trim(),
      'Телефон: ' + tel.value.trim()
    ];
    if (note.value.trim()) lines.push('Задача: ' + note.value.trim());
    var text = lines.join('\n');

    function done() { toast.classList.add('on'); toast.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, done);
    } else {
      var ta = document.createElement('textarea');
      ta.value = text; document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); } catch (err) {}
      document.body.removeChild(ta); done();
    }
  });

  [type, area, name, tel].forEach(function (el) {
    el.addEventListener('input', function () { setErr(el.id.replace('q-', ''), false); });
    el.addEventListener('change', function () { setErr(el.id.replace('q-', ''), false); });
  });
})();
