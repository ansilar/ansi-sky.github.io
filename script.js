/* NOCTURNE – общий скрипт сайта */

/* 1. Впишите ID счетчика MyTracker между кавычками, например '3591234' */
const MYTRACKER_ID = '';

/* 2. Отправка целей и событий в системы аналитики */
function trackGoal(name) {
  try {
    if (MYTRACKER_ID) {
      window._tmr = window._tmr || [];
      window._tmr.push({ type: 'reachGoal', id: MYTRACKER_ID, goal: name });
    }
  } catch (e) {}
  try {
    if (window.top100Counter && typeof window.top100Counter.trackEvent === 'function') {
      window.top100Counter.trackEvent(name, {});
    }
  } catch (e) {}
}
document.querySelectorAll('[data-goal]').forEach(el =>
  el.addEventListener('click', () => trackGoal(el.dataset.goal)));

/* 3. Звездное небо с падающими метеорами */
const sky = document.getElementById('sky');
if (sky) {
  const ctx = sky.getContext('2d');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let w, h, stars = [], meteors = [], mx = 0, my = 0;
  const dpr = window.devicePixelRatio || 1;
  function resize() {
    w = sky.width = innerWidth * dpr; h = sky.height = innerHeight * dpr;
    sky.style.width = innerWidth + 'px'; sky.style.height = innerHeight + 'px';
    const count = Math.floor(innerWidth * innerHeight / 3500);
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      r: (Math.random() * 1.2 + 0.2) * dpr, a: Math.random() * 6,
      s: Math.random() * 0.02 + 0.003,
      hue: Math.random() < 0.15 ? 200 : (Math.random() < 0.1 ? 280 : 0)
    }));
  }
  resize(); addEventListener('resize', resize);
  addEventListener('mousemove', e => { mx = e.clientX / innerWidth - 0.5; my = e.clientY / innerHeight - 0.5; });
  function frame() {
    ctx.clearRect(0, 0, w, h);
    for (const s of stars) {
      s.a += s.s;
      const alpha = 0.5 + Math.sin(s.a) * 0.5;
      ctx.beginPath();
      ctx.arc(s.x + mx * s.r * 12, s.y + my * s.r * 12, s.r, 0, Math.PI * 2);
      ctx.fillStyle = s.hue ? `hsla(${s.hue},100%,80%,${alpha})` : `rgba(255,255,255,${alpha})`;
      ctx.fill();
    }
    if (Math.random() < 0.006) meteors.push({ x: Math.random() * w, y: Math.random() * h * 0.5, l: 0, v: (6 + Math.random() * 6) * dpr });
    meteors = meteors.filter(m => m.l < 1);
    for (const m of meteors) {
      m.l += 0.015; m.x += m.v; m.y += m.v * 0.45;
      const tx = m.x - m.v * 14, ty = m.y - m.v * 6.3;
      const g = ctx.createLinearGradient(m.x, m.y, tx, ty);
      g.addColorStop(0, `rgba(255,255,255,${1 - m.l})`); g.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.strokeStyle = g; ctx.lineWidth = 1.5 * dpr;
      ctx.beginPath(); ctx.moveTo(m.x, m.y); ctx.lineTo(tx, ty); ctx.stroke();
    }
    if (!reduce) requestAnimationFrame(frame);
  }
  frame();
}

/* 4. Шапка, мобильное меню, активный пункт */
const header = document.querySelector('.header');
const onScroll = () => header && header.classList.toggle('scrolled', scrollY > 30);
addEventListener('scroll', onScroll); onScroll();
const burger = document.querySelector('.burger'), menu = document.querySelector('.menu');
if (burger) burger.addEventListener('click', () => { burger.classList.toggle('open'); menu.classList.toggle('open'); });
const currentPage = location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.menu a').forEach(a => { if (a.getAttribute('href') === currentPage) a.classList.add('active'); });

/* 5. Появление блоков при прокрутке */
const io = new IntersectionObserver(entries => entries.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
}), { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

/* 6. Анимированные числа */
document.querySelectorAll('[data-count]').forEach(el => {
  const target = +el.dataset.count; let done = false;
  new IntersectionObserver(([e]) => {
    if (e.isIntersecting && !done) {
      done = true; const start = performance.now();
      const tick = t => {
        const p = Math.min((t - start) / 1800, 1);
        el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }
  }).observe(el);
});

/* 7. Подсветка карточек и свечение за курсором */
document.querySelectorAll('.card').forEach(c => c.addEventListener('mousemove', e => {
  const r = c.getBoundingClientRect();
  c.style.setProperty('--x', e.clientX - r.left + 'px');
  c.style.setProperty('--y', e.clientY - r.top + 'px');
}));
if (matchMedia('(pointer:fine)').matches) {
  const glow = document.createElement('div'); glow.className = 'cursor-glow'; document.body.appendChild(glow);
  addEventListener('mousemove', e => { glow.style.left = e.clientX + 'px'; glow.style.top = e.clientY + 'px'; });
}

/* 8. Совет дня на главной */
const tip = document.getElementById('tip');
if (tip) {
  const TIPS = [
    'Глазам нужно около 20 минут, чтобы привыкнуть к темноте. Не смотри в телефон или включи красный фильтр.',
    'Продли отрезок между двумя крайними звездами ковша Большой Медведицы примерно в пять раз – и найдешь Полярную.',
    'Планеты почти не мерцают, в отличие от звезд. Так их легко отличить.',
    'Метеоров больше всего после полуночи, когда наша сторона Земли летит навстречу потоку.',
    'Бинокль 10x50 покажет кратеры Луны и четыре крупных спутника Юпитера.',
    'Приложение-планетарий на телефоне подскажет, что за яркая точка висит над крышей.'
  ];
  tip.textContent = TIPS[new Date().getDate() % TIPS.length];
}

/* 9. Рисование созвездий */
const SHAPES = {
  ursa: { s: [[.06,.22],[.2,.3],[.33,.34],[.47,.42],[.5,.68],[.82,.74],[.86,.44]], l: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,3]] },
  cass: { s: [[.08,.3],[.3,.68],[.5,.42],[.7,.72],[.92,.32]], l: [[0,1],[1,2],[2,3],[3,4]] },
  orion: { s: [[.3,.18,3,'255,170,120'],[.68,.22],[.42,.52],[.5,.49],[.58,.46],[.36,.88],[.72,.84,3,'170,210,255'],[.5,.04,1.5]], l: [[0,2],[1,4],[2,3],[3,4],[2,5],[4,6],[0,7],[7,1]] },
  leo: { s: [[.2,.78,3],[.22,.56],[.32,.42],[.3,.25],[.42,.14],[.66,.4],[.9,.56],[.66,.66]], l: [[0,1],[1,2],[2,3],[3,4],[2,5],[5,6],[6,7],[7,0],[5,7]] },
  lyra: { s: [[.32,.14,3.2,'200,220,255'],[.44,.38],[.64,.42],[.6,.84],[.4,.8]], l: [[0,1],[1,2],[2,3],[3,4],[4,1]] },
  cygnus: { s: [[.5,.06,3],[.5,.4],[.5,.64],[.5,.94,2,'255,210,140'],[.16,.3],[.84,.52]], l: [[0,1],[1,2],[2,3],[4,1],[1,5]] },
  scorpius: { s: [[.08,.2],[.16,.08],[.2,.24],[.34,.36,3,'255,120,90'],[.42,.5],[.45,.64],[.52,.8],[.64,.9],[.8,.88],[.9,.76],[.86,.64]], l: [[0,2],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7],[7,8],[8,9],[9,10]] },
  perseus: { s: [[.52,.06],[.46,.26],[.5,.44,2.6],[.66,.56],[.76,.8],[.34,.58,2.2],[.28,.82]], l: [[0,1],[1,2],[2,3],[3,4],[2,5],[5,6]] },
  andromeda: { s: [[.08,.82,2.6],[.34,.62],[.6,.46,2.6],[.9,.28,2.4],[.5,.3,1.2]], l: [[0,1],[1,2],[2,3],[2,4]], g: [.56,.16] }
};
document.querySelectorAll('canvas[data-shape]').forEach(cv => {
  const sh = SHAPES[cv.dataset.shape]; if (!sh) return;
  const ctx = cv.getContext('2d'); let t0 = null, started = false;
  function size() {
    const d = window.devicePixelRatio || 1;
    cv.width = cv.clientWidth * d; cv.height = cv.clientHeight * d; ctx.setTransform(d, 0, 0, d, 0, 0);
  }
  function draw(t) {
    if (!t0) t0 = t;
    const p = Math.min((t - t0) / 1600, 1), W = cv.clientWidth, H = cv.clientHeight, pad = 24;
    const X = x => pad + x * (W - pad * 2), Y = y => pad + y * (H - pad * 2);
    ctx.clearRect(0, 0, W, H);
    ctx.strokeStyle = 'rgba(139,123,255,.6)'; ctx.lineWidth = 1.2;
    sh.l.forEach(([a, b], i) => {
      const k = Math.min(Math.max(p * sh.l.length - i, 0), 1); if (!k) return;
      const [x1, y1] = sh.s[a], [x2, y2] = sh.s[b];
      ctx.beginPath(); ctx.moveTo(X(x1), Y(y1)); ctx.lineTo(X(x1 + (x2 - x1) * k), Y(y1 + (y2 - y1) * k)); ctx.stroke();
    });
    if (sh.g) {
      ctx.save(); ctx.translate(X(sh.g[0]), Y(sh.g[1])); ctx.rotate(-0.6); ctx.scale(1, 0.4);
      const gr = ctx.createRadialGradient(0, 0, 0, 0, 0, 24);
      gr.addColorStop(0, 'rgba(255,220,255,.9)'); gr.addColorStop(1, 'rgba(255,122,217,0)');
      ctx.fillStyle = gr; ctx.beginPath(); ctx.arc(0, 0, 24, 0, 7); ctx.fill(); ctx.restore();
    }
    sh.s.forEach((st, i) => {
      const tw = 0.7 + Math.sin(t / 500 + i * 1.7) * 0.3, r = st[2] || 2, x = X(st[0]), y = Y(st[1]);
      const g = ctx.createRadialGradient(x, y, 0, x, y, r * 5);
      g.addColorStop(0, `rgba(${st[3] || '255,255,255'},${tw})`); g.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r * 5, 0, 7); ctx.fill();
      ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(x, y, r * 0.8, 0, 7); ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  new IntersectionObserver(([e]) => {
    if (e.isIntersecting && !started) { started = true; size(); requestAnimationFrame(draw); }
  }).observe(cv);
  addEventListener('resize', size);
});
document.querySelectorAll('.filter[data-filter]').forEach(btn => btn.addEventListener('click', () => {
  document.querySelectorAll('.filter[data-filter]').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const f = btn.dataset.filter;
  document.querySelectorAll('.const-card').forEach(c => c.classList.toggle('hide', f !== 'all' && !c.dataset.season.includes(f)));
  trackGoal('filter_' + f);
}));

/* 10. Планеты с учетом хэшей в адресе */
const PLANETS = {
  mercury: { name: 'Меркурий', type: 'Каменная планета', bg: 'linear-gradient(160deg,#b3aea8,#6b655f 60%,#3a3633)', glow: 'rgba(180,170,160,.35)', text: 'Самая маленькая планета и ближайшая к Солнцу. Атмосферы почти нет, поэтому днем поверхность раскаляется до +430 °C, а ночью остывает до -180 °C.', facts: [['От Солнца', '58 млн км'], ['Год', '88 суток'], ['Диаметр', '4879 км'], ['Спутники', 'нет']] },
  venus: { name: 'Венера', type: 'Каменная планета', bg: 'linear-gradient(160deg,#f3d9a4,#d9a55b 55%,#8a5a26)', glow: 'rgba(240,200,120,.4)', text: 'Самая горячая планета Солнечной системы – около +465 °C из-за парникового эффекта. Вращается в обратную сторону, и ее сутки длиннее года.', facts: [['От Солнца', '108 млн км'], ['Год', '225 суток'], ['Диаметр', '12 104 км'], ['Спутники', 'нет']] },
  earth: { name: 'Земля', type: 'Наш дом', bg: 'linear-gradient(160deg,#5fb0ff,#1c5fb8 40%,#2f8f5b 58%,#0d3a7a)', glow: 'rgba(80,160,255,.45)', text: 'Единственная известная планета с жидкой водой на поверхности и жизнью. Отсюда мы и смотрим наверх.', facts: [['От Солнца', '150 млн км'], ['Год', '365,25 суток'], ['Диаметр', '12 742 км'], ['Спутники', '1']] },
  mars: { name: 'Марс', type: 'Каменная планета', bg: 'linear-gradient(160deg,#ff9a6b,#c1440e 55%,#6b1f05)', glow: 'rgba(255,110,60,.4)', text: 'Красный цвет дает оксид железа в грунте. Здесь находится гора Олимп высотой около 22 км – крупнейший вулкан Солнечной системы.', facts: [['От Солнца', '228 млн км'], ['Год', '687 суток'], ['Диаметр', '6779 км'], ['Спутники', '2']] },
  jupiter: { name: 'Юпитер', type: 'Газовый гигант', bg: 'linear-gradient(to bottom,#d8b48a 0 12%,#f1e0c5 12% 22%,#b07a4f 22% 34%,#efd9b8 34% 46%,#c48a5a 46% 58%,#e9cfa9 58% 70%,#a8683e 70% 82%,#dcbf98 82%)', glow: 'rgba(230,180,120,.4)', text: 'Крупнейшая планета системы. Большое красное пятно – гигантский шторм, который больше Земли и наблюдается уже несколько веков.', facts: [['От Солнца', '778 млн км'], ['Год', '11,9 лет'], ['Диаметр', '139 820 км'], ['Спутники', 'более 90']] },
  saturn: { name: 'Сатурн', type: 'Газовый гигант', bg: 'linear-gradient(to bottom,#e8d3a3 0 20%,#d6b97c 20% 40%,#f1e2bd 40% 60%,#caa867 60% 80%,#e3cc95 80%)', glow: 'rgba(230,200,140,.4)', text: 'Его плотность меньше плотности воды. Кольца состоят из ледяных глыб и пыли и видны даже в небольшой телескоп.', facts: [['От Солнца', '1,43 млрд км'], ['Год', '29,5 лет'], ['Диаметр', '116 460 км'], ['Спутники', 'более 270']], ring: true },
  uranus: { name: 'Уран', type: 'Ледяной гигант', bg: 'linear-gradient(160deg,#c9f6f8,#7fd6df 55%,#3e9aa6)', glow: 'rgba(120,220,230,.4)', text: 'Ось вращения наклонена примерно на 98 градусов, поэтому планета словно катится по орбите на боку.', facts: [['От Солнца', '2,87 млрд км'], ['Год', '84 года'], ['Диаметр', '50 724 км'], ['Спутники', 'более 25']] },
  neptune: { name: 'Нептун', type: 'Ледяной гигант', bg: 'linear-gradient(160deg,#7aa7ff,#3554d1 55%,#14267a)', glow: 'rgba(90,130,255,.45)', text: 'Самая далекая планета. Ветры здесь разгоняются примерно до 2000 км/ч – это самые быстрые ветры в Солнечной системе.', facts: [['От Солнца', '4,5 млрд км'], ['Год', '165 лет'], ['Диаметр', '49 244 км'], ['Спутники', '16']] }
};
const pv = document.getElementById('planet-view');
if (pv) {
  const tabs = document.querySelectorAll('[data-planet]');
  function showPlanet() {
    const id = PLANETS[location.hash.slice(1)] ? location.hash.slice(1) : 'earth', p = PLANETS[id];
    tabs.forEach(t => t.classList.toggle('active', t.dataset.planet === id));
    pv.innerHTML = `<div class="planet ${p.ring ? 'ringed' : ''}" style="background:${p.bg};--glow:${p.glow}"></div>
      <div class="planet-info"><span class="tag">${p.type}</span><h2>${p.name}</h2><p>${p.text}</p>
      <div class="facts">${p.facts.map(f => `<div class="fact"><small>${f[0]}</small><strong>${f[1]}</strong></div>`).join('')}</div></div>`;
    pv.classList.remove('fade-swap'); void pv.offsetWidth; pv.classList.add('fade-swap');
  }
  tabs.forEach(t => t.addEventListener('click', () => { location.hash = t.dataset.planet; }));
  addEventListener('hashchange', showPlanet); showPlanet();
}

/* 11. Календарь и обратный отсчет */
const events = document.querySelectorAll('.event[data-date]');
if (events.length) {
  const now = new Date(); let next = null;
  events.forEach(ev => {
    const d = new Date(ev.dataset.date + 'T21:00:00');
    if (d < now) ev.classList.add('past');
    else if (!next) next = { d, name: ev.querySelector('h3').textContent };
  });
  const nameEl = document.getElementById('next-name'), cd = document.getElementById('countdown');
  if (next && cd) {
    nameEl.textContent = next.name;
    const tick = () => {
      const s = Math.max(0, (next.d - new Date()) / 1000);
      const v = [Math.floor(s / 86400), Math.floor(s % 86400 / 3600), Math.floor(s % 3600 / 60), Math.floor(s % 60)];
      cd.querySelectorAll('b').forEach((b, i) => b.textContent = String(v[i]).padStart(2, '0'));
    };
    tick(); setInterval(tick, 1000);
  }
}

/* 12. Тест "Какое ты созвездие?" */
const QUIZ = [
  { q: 'Идеальный вечер пятницы – это...', a: [['Собрать друзей и придумать приключение', 'orion'], ['Плед, чай и любимая музыка', 'lyra'], ['Выставка или новое красивое место', 'cass'], ['Спокойная прогулка с близким человеком', 'ursa']] },
  { q: 'Что тебя вдохновляет сильнее всего?', a: [['Новые вызовы', 'orion'], ['Музыка и истории', 'lyra'], ['Красота в деталях', 'cass'], ['Люди рядом', 'ursa']] },
  { q: 'Выбери время суток', a: [['Полночь', 'orion'], ['Глубокая ночь, когда все спят', 'lyra'], ['Закат', 'cass'], ['Раннее утро', 'ursa']] },
  { q: 'Какая роль в команде чаще достается тебе?', a: [['Лидер', 'orion'], ['Генератор идей', 'lyra'], ['Тот, кто делает красиво', 'cass'], ['Опора и голос разума', 'ursa']] },
  { q: 'Где лучше всего смотреть на звезды?', a: [['В горах, повыше', 'orion'], ['На крыше с наушниками', 'lyra'], ['В пустыне Атакама', 'cass'], ['На даче, где тихо', 'ursa']] }
];
const RESULTS = {
  orion: ['Орион', 'Ты охотник за впечатлениями. Энергия, смелость и умение вести за собой – как у самого яркого зимнего созвездия.'],
  lyra: ['Лира', 'Ты слышишь музыку там, где другие слышат тишину. Твоя звезда – Вега, одна из самых ярких на летнем небе.'],
  cass: ['Кассиопея', 'Ты ценишь красоту и стиль. Кассиопея – царица северного неба, ее букву W не спутать ни с чем.'],
  ursa: ['Большая Медведица', 'Ты надежный ориентир для друзей. По ковшу Большой Медведицы веками находили Полярную звезду.']
};
const quizBox = document.getElementById('quiz');
if (quizBox) {
  let step = 0, score = {};
  const bar = document.querySelector('.progress i');
  function render() {
    bar.style.width = (step / QUIZ.length * 100) + '%';
    if (step === QUIZ.length) return finish();
    const item = QUIZ[step];
    quizBox.innerHTML = `<span class="tag">Вопрос ${step + 1} из ${QUIZ.length}</span><h2 class="q-title">${item.q}</h2>
      <div class="answers">${item.a.map(x => `<button class="answer" data-k="${x[1]}">${x[0]}</button>`).join('')}</div>`;
    quizBox.classList.remove('fade-swap'); void quizBox.offsetWidth; quizBox.classList.add('fade-swap');
    quizBox.querySelectorAll('.answer').forEach(b => b.onclick = () => {
      if (step === 0) trackGoal('quiz_start');
      score[b.dataset.k] = (score[b.dataset.k] || 0) + 1; step++; render();
    });
  }
  function finish() {
    const best = Object.keys(score).sort((a, b) => score[b] - score[a])[0], r = RESULTS[best];
    quizBox.innerHTML = `<div class="result"><span class="tag">Твое созвездие</span><h2 class="gradient-text">${r[0]}</h2><p>${r[1]}</p>
      <div class="btns" style="justify-content:center;margin-top:30px"><button class="btn" id="again">Пройти еще раз</button>
      <a class="btn btn-primary" href="club.html" data-goal="quiz_to_club">Вступить в клуб</a></div></div>`;
    location.hash = 'result';
    trackGoal('quiz_complete');
    quizBox.querySelector('[data-goal]').addEventListener('click', () => trackGoal('quiz_to_club'));
    document.getElementById('again').onclick = () => { step = 0; score = {}; history.replaceState(null, '', location.pathname); render(); };
  }
  render();
}

/* 13. Форма записи в клуб */
const form = document.getElementById('club-form');
if (form) form.addEventListener('submit', e => {
  e.preventDefault();
  trackGoal('club_signup');
  form.querySelector('button').textContent = 'Отправляем...';
  setTimeout(() => { location.href = 'thanks.html'; }, 700);
});
