
(function () {
  var h = React.createElement;
  var VOID = { img: 1, input: 1, br: 1, hr: 1, meta: 1, link: 1, source: 1, area: 1, col: 1, embed: 1, wbr: 1 };
  var EVENTS = { onclick: 'onClick', onchange: 'onChange', oninput: 'onInput', onkeydown: 'onKeyDown', onsubmit: 'onSubmit' };
  var WHOLE = /^\s*\{\{([^}]+)\}\}\s*$/, ANY = /\{\{([^}]+)\}\}/g;
  function get(scope, path) {
    path = path.trim();
    if (path === 'true') return true; if (path === 'false') return false;
    if (/^-?\d+(\.\d+)?$/.test(path)) return Number(path);
    var cur = scope, parts = path.split('.');
    for (var i = 0; i < parts.length; i++) { if (cur == null) return undefined; cur = cur[parts[i]]; }
    return cur;
  }
  function interp(str, scope) { return str.replace(ANY, function (m, p) { var v = get(scope, p); return v == null ? '' : String(v); }); }
  function val(str, scope) { var m = str.match(WHOLE); return m ? get(scope, m[1]) : (str.indexOf('{{') >= 0 ? interp(str, scope) : str); }
  function camel(s) { return s.replace(/-([a-z])/g, function (m, c) { return c.toUpperCase(); }); }
  function styleObj(s) {
    var o = {};
    String(s).split(';').forEach(function (d) {
      var i = d.indexOf(':'); if (i < 0) return;
      var k = d.slice(0, i).trim(), v = d.slice(i + 1).trim(); if (!k) return;
      o[k.indexOf('--') === 0 ? k : camel(k)] = v;
    });
    return o;
  }
  function propName(n) {
    if (EVENTS[n]) return EVENTS[n];
    if (n === 'class') return 'className'; if (n === 'for') return 'htmlFor'; if (n === 'tabindex') return 'tabIndex';
    if (n.indexOf('aria-') === 0 || n.indexOf('data-') === 0) return n;
    return n.indexOf('-') > 0 ? camel(n) : n;
  }
  function kids(node, scope) {
    var out = [], cs = node.childNodes;
    for (var i = 0; i < cs.length; i++) {
      var c = cs[i];
      if (c.nodeType === 3 && /^\s*$/.test(c.nodeValue) && c.nodeValue.indexOf('\n') >= 0) continue;
      var r = render(c, scope, i);
      if (r !== null && r !== undefined) out.push(r);
    }
    return out;
  }
  function render(node, scope, key) {
    if (node.nodeType === 3) { var t = node.nodeValue; return t.indexOf('{{') >= 0 ? interp(t, scope) : t; }
    if (node.nodeType !== 1) return null;
    var tag = node.tagName.toLowerCase();
    if (tag === 'sc-if') return val(node.getAttribute('value') || '', scope) ? h(React.Fragment, { key: key }, kids(node, scope)) : null;
    if (tag === 'sc-for') {
      var list = val(node.getAttribute('list') || '', scope) || [], as = node.getAttribute('as') || 'item';
      return h(React.Fragment, { key: key }, list.map(function (it, i) {
        var sc = Object.assign({}, scope); sc[as] = it; sc.$index = i;
        return h(React.Fragment, { key: i }, kids(node, sc));
      }));
    }
    var props = { key: key };
    for (var i = 0; i < node.attributes.length; i++) {
      var a = node.attributes[i]; if (a.name.indexOf('hint-') === 0) continue;
      var pn = propName(a.name), v = val(a.value, scope);
      if (pn === 'style') { props.style = styleObj(v); continue; }
      if (pn === 'disabled' || pn === 'checked') v = (v === '' ? true : !!v && v !== 'false');
      props[pn] = v;
    }
    if (tag === 'input' && 'value' in props && props.value == null) props.value = '';
    return VOID[tag] ? h(tag, props) : h.apply(null, [tag, props].concat(kids(node, scope)));
  }
  var ROOT = document.getElementById('dc-template').content.firstElementChild;
  window.DCLogic = class extends React.Component {
    constructor(p) { super(p); this.state = null; }
    render() { return render(ROOT, this.renderVals(), 'root'); }
  };
})();


class Component extends DCLogic {
  D() {
    if (this._D) return this._D;
    const SUBJ = [
      { id: 'polity', name: 'Polity & Governance', short: 'Polity', pool: 118, nb: [5, 7, 0, 0, 0], d: 'M12 3v18M7 21h10M5 7h14M5 7l-3 7a3 3 0 0 0 6 0zM19 7l-3 7a3 3 0 0 0 6 0z' },
      { id: 'economy', name: 'Economy', short: 'Economy', pool: 104, nb: [2, 2, 3, 1, 1], d: 'M3 3v18h18M7 14l4-4 3 3 6-7' },
      { id: 'env', name: 'Environment & Ecology', short: 'Environment', pool: 92, nb: [3, 1, 1, 1, 1], d: 'M5 20c0-9 6-15 15-15 0 9-6 15-15 15zM5 20l8-8' },
      { id: 'st', name: 'Science & Technology', short: 'Sci & Tech', pool: 88, nb: [1, 2, 1, 1, 1], d: 'M9 3h6M10 3v6l-5.5 9.5A1.7 1.7 0 0 0 6 21h12a1.7 1.7 0 0 0 1.5-2.5L14 9V3M7.5 15h9' },
      { id: 'ir', name: 'International Relations', short: 'IR', pool: 96, nb: [2, 1, 1, 1, 0], d: 'M12 3a9 9 0 1 0 0 18a9 9 0 1 0 0-18zM3 12h18M12 3c3 3.5 3 14.5 0 18M12 3c-3 3.5-3 14.5 0 18' },
      { id: 'hist', name: 'History, Art & Culture', short: 'History', pool: 74, nb: [0, 1, 1, 0, 1], d: 'M3 21h18M5 21V11M19 21V11M10 21v-5h4v5M3 11h18L12 4z' },
      { id: 'geo', name: 'Geography', short: 'Geography', pool: 68, nb: [1, 0, 1, 1, 0], d: 'M9 4L3 6v14l6-2 6 2 6-2V4l-6 2zM9 4v14M15 6v14' },
      { id: 'social', name: 'Social Issues & Schemes', short: 'Social', pool: 110, nb: [0, 1, 0, 0, 1], d: 'M9 11a4 4 0 1 0 0-8a4 4 0 0 0 0 8zM2 21v-1a7 7 0 0 1 14 0v1M16 3.3a4 4 0 0 1 0 7.4M22 21v-1a7 7 0 0 0-4-6.3' }
    ];
    const MONTHS = [
      { id: 'may', short: 'May', count: 128 },
      { id: 'jun', short: 'Jun', count: 142 },
      { id: 'jul', short: 'Jul', count: 155 },
      { id: 'aug', short: 'Aug', count: 161 },
      { id: 'sep', short: 'Sep', count: 164 }
    ];
    // Current Affairs question bank: empty until the CA spreadsheet is provided.
    const Q = [];
    const NB = ['sep', 'aug', 'jul', 'jun', 'may'];
    const MN = { may: 5, jun: 6, jul: 7, aug: 8, sep: 9 };
    const MS = { may: 'May', jun: 'Jun', jul: 'Jul', aug: 'Aug', sep: 'Sep' };
    const STRIP = ['#F2C94C', '#D9A93A', '#B78A2E', '#8E7236', '#7A7466', '#626770', '#4E535C', '#3E424A'];
    const items = [];
    const PSUBJ = [
      { id: 'p0', name: 'Indian Polity & Governance', short: 'Polity', nb: 'polity', d: SUBJ[0].d },
      { id: 'p1', name: 'Economy', short: 'Economy', nb: 'economy', d: SUBJ[1].d },
      { id: 'p2', name: 'Environment & Ecology', short: 'Environment', nb: 'env', d: SUBJ[2].d },
      { id: 'p3', name: 'Science & Technology', short: 'Sci & Tech', nb: 'st', d: SUBJ[3].d },
      { id: 'p4', name: 'International Relations', short: 'IR', nb: 'ir', d: SUBJ[4].d },
      { id: 'p5', name: 'Geography', short: 'Geography', nb: 'geo', d: SUBJ[6].d },
      { id: 'p6', name: 'Agriculture', short: 'Agriculture', nb: 'economy', d: 'M12 21V11M12 11c0-4 3-7 8-7 0 4-3 7-8 7zM12 14c0-3-2.5-5.5-7-5.5 0 3.5 2.5 5.5 7 5.5' },
      { id: 'p7', name: 'Ancient Indian History', short: 'Ancient History', nb: 'hist', d: SUBJ[5].d },
      { id: 'p8', name: 'Medieval Indian History', short: 'Medieval History', nb: 'hist', d: 'M3 21h18M5 21v-7h14v7M7 14a5 5 0 0 1 10 0M12 4v5M9 21v-3h6v3' },
      { id: 'p9', name: 'Modern Indian History', short: 'Modern History', nb: 'hist', d: 'M5 21V4M5 4h11l-2 4 2 4H5' },
      { id: 'p10', name: 'Art & Culture', short: 'Art & Culture', nb: 'hist', d: 'M12 3a9 9 0 0 0 0 18c1.5 0 2-1 2-2s-1-2 0-3 2-1 3-1a4 4 0 0 0 4-4c0-4.5-4-8-9-8zM7.5 11.5h.01M10 7.5h.01M15 7.5h.01' },
      { id: 'p11', name: 'Places in News', short: 'Places in News', nb: 'geo', d: 'M12 21s-7-6.2-7-11a7 7 0 1 1 14 0c0 4.8-7 11-7 11zM12 7.5a2.5 2.5 0 1 0 0 5a2.5 2.5 0 0 0 0-5z' },
      { id: 'p12', name: 'Miscellaneous', short: 'Misc', nb: 'social', d: 'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z' }
    ];
    this._D = { SUBJ, PSUBJ, MONTHS, Q, NB, MN, MS, STRIP, items: items };
    return this._D;
  }

  base() {
    return {
      screen: 'A0', subs: ['polity', 'economy'], months: ['aug', 'sep'], count: 20, custom: '', mode: 'practice', demo: 'default',
      sqOrigin: 'A0', quiz: null, finished: null, solTab: 'all',
      nbMonths: [], nbEmpty: false, b2Subj: 'polity', b2Months: [], b2Sort: 'latest', open: null,
      cleared: {}, added: [], missBump: {}, mq: null, mqModal: false, examModal: false, setModal: false,
      source: 'pyq', psubs: ['p0', 'p1'], years: [2026, 2025], pyqSeen: {},
      toast: null, hero: 0, jumpOpen: false, seq: 0, attempted: 0
    };
  }
  storeKey() { return 'sarrthi-practice-proto-v2'; }
  persistKeys() { return ['added', 'cleared', 'missBump', 'seq', 'attempted', 'finished', 'pyqSeen']; }
  defaults() {
    if (!this._def) {
      const d = this.base();
      try {
        const raw = window.localStorage.getItem(this.storeKey());
        if (raw) { const saved = JSON.parse(raw); this.persistKeys().forEach(k => { if (saved[k] !== undefined) d[k] = saved[k]; }); }
        d.added = (d.added || []).filter(x => x.pid);
        if (d.finished && d.finished.source !== 'pyq') d.finished = null;
      } catch (e) {}
      this._def = d;
    }
    return this._def;
  }
  componentDidUpdate() {
    try {
      const s = this.st();
      const out = {};
      this.persistKeys().forEach(k => { out[k] = s[k]; });
      window.localStorage.setItem(this.storeKey(), JSON.stringify(out));
    } catch (e) {}
  }
  clearAll(stayOn) {
    try { window.localStorage.removeItem(this.storeKey()); } catch (e) {}
    this._def = this.base();
    this.setState(Object.assign({}, this.base(), { screen: stayOn || 'A0' }));
  }

  st() { return Object.assign({}, this.defaults(), this.state || {}); }
  subj(id) { const D = this.D(); return D.SUBJ.find(x => x.id === id) || D.PSUBJ.find(x => x.id === id); }
  pq(id) { return this._pyqMap ? this._pyqMap[id] : null; }
  qOf(x) {
    if (x && x.pid) {
      const p = this.pq(x.pid);
      if (!p) return { text: 'Loading question…', opts: ['…', '…', '…', '…'], correct: 0, sol: '' };
      return { text: p.q, opts: p.o, correct: p.a, sol: p.x };
    }
    return this.D().Q[x.tpl] || { text: 'Question removed', opts: ['—', '—', '—', '—'], correct: 0, sol: '' };
  }
  mlabel(x) { return x.month === 'pyq' ? 'PYQ ' + x.year : this.D().MS[x.month] + ' 2026'; }
  tagsOf(x) {
    if (x.pid) return [{ t: this.subj(x.psubj || x.subj).name }, { t: 'UPSC Prelims ' + x.year + ' · Q' + x.qno }];
    return [{ t: this.subj(x.subj).name }, { t: this.mlabel(x) }];
  }
  today() { const d = new Date(); const M = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']; return d.getDate() + ' ' + M[d.getMonth()] + ' ' + d.getFullYear(); }
  componentDidMount() {
    try {
      fetch('data/pyq.json').then(r => r.json()).then(arr => {
        const map = {}; arr.forEach(q => { map[q.i] = q; });
        this._pyq = arr; this._pyqMap = map; this.forceUpdate();
      }).catch(() => { this._pyqErr = true; this.forceUpdate(); });
    } catch (e) { this._pyqErr = true; }
  }
  pyqFiltered(s) {
    if (!this._pyq) return [];
    return this._pyq.filter(q => s.psubs.indexOf('p' + q.s) >= 0 && s.years.indexOf(q.y) >= 0);
  }
  yearsLabel(ys) {
    const a = ys.slice().sort();
    if (!a.length) return '';
    if (a.length === 1) return 'Prelims ' + a[0];
    const contiguous = a[a.length - 1] - a[0] === a.length - 1;
    return 'Prelims ' + (contiguous ? a[0] + '–' + String(a[a.length - 1]).slice(2) : a.join(', '));
  }
  seenPatch(s, q) {
    if (!q || q.source !== 'pyq') return {};
    const seen = Object.assign({}, s.pyqSeen);
    q.qs.forEach((x, i) => { if (i <= q.idx || q.picks[i] != null || q.checked[i] || q.skipped[i]) seen[x.pid] = true; });
    return { pyqSeen: seen };
  }
  startPatch(quiz) {
    const p = { quiz: quiz, examModal: false };
    if (quiz && quiz.resetIds && quiz.resetIds.length) {
      const seen = Object.assign({}, this.st().pyqSeen);
      quiz.resetIds.forEach(id => { delete seen[id]; });
      p.pyqSeen = seen;
    }
    return p;
  }
  addMistakes(s, list, seq) {
    const D = this.D();
    const added = s.added.slice();
    const cleared = Object.assign({}, s.cleared);
    const bump = Object.assign({}, s.missBump);
    const date = this.today();
    list.forEach((m, j) => {
      const q = m.q;
      if (q.pid) {
        const id = 'pyq-' + q.pid;
        const at = added.findIndex(x => x.id === id);
        if (at >= 0) {
          if (cleared[id]) delete cleared[id];
          bump[id] = (bump[id] || 0) + 1;
          added[at] = Object.assign({}, added[at], { wrong: m.your, dateText: date, key: 929 + seq / 100, fresh: true });
        } else {
          const ps = D.PSUBJ.find(x => x.id === q.psubj);
          added.push({ id: id, pid: q.pid, subj: ps ? ps.nb : 'social', psubj: q.psubj, year: q.year, qno: q.qno, month: 'pyq', missed: 1, dateText: date, key: 929 + seq / 100, wrong: m.your, fresh: true });
        }
      } else {
        added.push({ id: 'sq' + seq + '-' + j, subj: q.subj, month: q.month, tpl: q.tpl, missed: 1, dateText: date, key: 929 + seq / 100, wrong: m.your, fresh: true });
      }
    });
    return { added: added, cleared: cleared, missBump: bump };
  }
  allItems(s) { return this.D().items.concat(s.added); }
  liveItems(s) { return this.allItems(s).filter(i => !s.cleared[i.id]); }
  byMonths(list, ms) { return ms.length ? list.filter(i => ms.indexOf(i.month) >= 0) : list; }
  plural(n, one, many) { return n + ' ' + (n === 1 ? one : many); }
  fmt(sec) { sec = Math.round(sec); const m = Math.floor(sec / 60), r = sec % 60; return m + ':' + (r < 10 ? '0' : '') + r; }

  monthLabelDesc(ms) {
    const D = this.D();
    const arr = D.NB.filter(m => ms.indexOf(m) >= 0);
    const hasP = ms.indexOf('pyq') >= 0;
    if (!arr.length && !hasP) return 'All months';
    let part = '';
    if (arr.length === 5) part = 'May–Sep 2026';
    else if (arr.length) part = arr.map(m => D.MS[m]).join(', ') + ' 2026';
    return [part, hasP ? 'PYQs' : ''].filter(Boolean).join(' + ');
  }
  presentLabel(list) { const set = {}; list.forEach(i => { set[i.month] = 1; }); return this.monthLabelDesc(Object.keys(set)); }
  monthRangeAsc(ms) {
    const D = this.D();
    const ORDER = ['may', 'jun', 'jul', 'aug', 'sep'];
    const arr = ORDER.filter(m => ms.indexOf(m) >= 0);
    if (!arr.length) return '';
    if (arr.length === 1) return D.MS[arr[0]] + ' 2026';
    const idx = arr.map(m => ORDER.indexOf(m));
    const contiguous = idx[idx.length - 1] - idx[0] === idx.length - 1;
    return contiguous ? D.MS[arr[0]] + '–' + D.MS[arr[arr.length - 1]] + ' 2026' : arr.map(m => D.MS[m]).join(', ') + ' 2026';
  }
  subjLabel(subs) {
    const names = subs.map(id => this.subj(id).short);
    return names.length <= 2 ? names.join(', ') : names.slice(0, 2).join(', ') + ' +' + (names.length - 2);
  }
  pat(i) { const k = i % 20; if ([2, 6, 9, 13, 16, 19].indexOf(k) >= 0) return 'i'; if ([4, 11, 17].indexOf(k) >= 0) return 's'; return 'c'; }

  go(screen, extra) {
    const p = Object.assign({ screen: screen, jumpOpen: false }, extra || {});
    if (screen === 'B4') { const m = p.mq || this.st().mq; if (m && !m.endedAt) p.mq = Object.assign({}, m, { endedAt: Date.now() }); }
    this.setState(p);
  }
  toast(text, pos) {
    this._tid = (this._tid || 0) + 1;
    const id = this._tid;
    this.setState({ toast: { text: text, pos: pos, id: id } });
    setTimeout(() => { const t = this.state && this.state.toast; if (t && t.id === id) this.setState({ toast: null }); }, 2800);
  }

  a3(s) {
    const custom = parseInt(s.custom, 10);
    const isCustom = s.count === 'custom';
    const requested = isCustom ? (isNaN(custom) ? 0 : custom) : s.count;
    const customBad = isCustom && (isNaN(custom) || custom < 3 || custom > 50);
    let eff, floor, exhausted, short, line, total, loading = false;
    if (s.source === 'pyq') {
      loading = !this._pyq;
      const f = this.pyqFiltered(s);
      total = f.length;
      const unseen = f.filter(q => !s.pyqSeen[q.i]).length;
      exhausted = total >= 3 && unseen === 0;
      eff = exhausted ? total : unseen;
      floor = eff < 3;
      short = !floor && !exhausted && eff < requested;
      if (loading) line = this._pyqErr ? 'Couldn\u2019t load the PYQ bank. Reload the page to try again.' : 'Loading the UPSC PYQ bank…';
      else if (floor) line = 'Only ' + eff + (eff === 1 ? ' question matches' : ' questions match') + ' — add a subject or year to start.';
      else if (exhausted) line = 'All ' + total + ' questions in this filter attempted · a fresh round starts from Q1';
      else if (short) line = 'Only ' + eff + ' unseen questions match. We\u2019ll start with ' + eff + '.';
      else line = eff + ' unseen questions match your filters' + (eff < total ? ' · ' + (total - eff) + ' already attempted' : '');
    } else {
      const D = this.D();
      const pool = s.subs.reduce((acc, id) => acc + this.subj(id).pool, 0);
      const mc = s.months.reduce((acc, id) => acc + D.MONTHS.find(m => m.id === id).count, 0);
      const live = Math.round(pool * mc / 750 * 0.875);
      eff = s.demo === 'short' ? 7 : s.demo === 'floor' ? 2 : s.demo === 'exhausted' ? 112 : live;
      total = eff;
      floor = eff < 3;
      exhausted = !floor && s.demo === 'exhausted';
      short = !floor && !exhausted && eff < requested;
      if (floor) line = 'Only ' + eff + ' questions match — add a subject or month to start.';
      else if (exhausted) line = 'All ' + eff + ' questions in this filter attempted · a fresh round starts from Q1';
      else if (short) line = 'Only ' + eff + ' unseen questions match. We\u2019ll start with ' + eff + '.';
      else line = eff + ' unseen questions match your filters';
    }
    const canStart = !loading && !floor && !customBad && requested >= 1;
    const n = Math.min(requested, eff);
    return { eff, floor, exhausted, short, line, canStart, n, customBad, total, loading };
  }

  makeQuiz(s) {
    const D = this.D();
    const a = this.a3(s);
    if (!a.canStart) return null;
    const n = a.n;
    if (s.source === 'pyq') {
      const f = this.pyqFiltered(s);
      const pool = a.exhausted ? f : f.filter(q => !s.pyqSeen[q.i]);
      const qs = pool.slice(0, n).map(q => ({ pid: q.i, subj: 'p' + q.s, psubj: 'p' + q.s, year: q.y, qno: q.n, month: 'pyq' }));
      const subs = D.PSUBJ.map(x => x.id).filter(id => s.psubs.indexOf(id) >= 0);
      return { source: 'pyq', n: qs.length, qs, mode: s.mode, idx: 0, picks: {}, checked: {}, skipped: {}, fresh: a.exhausted, resetIds: a.exhausted ? f.map(q => q.i) : [], subs, subjLabel: this.subjLabel(subs), monthLabel: this.yearsLabel(s.years), startedAt: Date.now() };
    }
    const ORDER = ['may', 'jun', 'jul', 'aug', 'sep'];
    const ms = ORDER.filter(m => s.months.indexOf(m) >= 0);
    const subs = D.SUBJ.map(x => x.id).filter(id => s.subs.indexOf(id) >= 0);
    const qs = [];
    for (let i = 0; i < n; i++) qs.push({ tpl: i % 3, subj: subs[i % subs.length], month: ms[Math.floor(i / subs.length) % ms.length] });
    return { source: 'ca', n, qs, mode: s.mode, idx: 0, picks: {}, checked: {}, skipped: {}, fresh: a.exhausted, resetIds: [], subs, subjLabel: this.subjLabel(subs), monthLabel: this.monthRangeAsc(ms), startedAt: Date.now() };
  }

  computeRes(qz) {
    const practice = qz.mode === 'practice';
    return qz.qs.map((q, i) => {
      const T = this.qOf(q);
      const pk = qz.picks[i];
      let o = null, your = null;
      if (practice) {
        if (qz.checked[i]) { o = pk === T.correct ? 'c' : 'i'; your = pk; }
        else if (qz.skipped[i]) o = 's';
      } else {
        if (pk != null) { o = pk === T.correct ? 'c' : 'i'; your = pk; }
        else if (qz.skipped[i]) o = 's';
      }
      if (!o) { o = 's'; your = null; }
      return { o, your };
    });
  }

  finishQuiz(qz, screen) {
    const s = this.st();
    qz = qz || s.quiz;
    if (!qz) return;
    const res = this.computeRes(qz);
    const seq = s.seq + 1;
    const wrongs = [];
    res.forEach((r, i) => { if (r.o === 'i') wrongs.push({ q: qz.qs[i], your: r.your }); });
    const k = wrongs.length;
    const secs = qz.startedAt ? Math.round((Date.now() - qz.startedAt) / 1000) : 0;
    this.go(screen || 'A5', Object.assign({ finished: { n: qz.n, mode: qz.mode, source: qz.source || 'ca', subs: qz.subs, subjLabel: qz.subjLabel, monthLabel: qz.monthLabel, qs: qz.qs, res: res, added: k, secs: secs }, seq: seq, attempted: s.attempted + 1, examModal: false, solTab: 'all', quiz: null }, this.addMistakes(s, wrongs, seq), this.seenPatch(s, qz)));
    if (k > 0) this.toast(this.plural(k, 'question', 'questions') + ' added to your Mistake Notebook', 'tr');
  }

  exitQuiz() {
    const s = this.st();
    const q = s.quiz;
    const seq = s.seq + 1;
    const wrongs = [];
    if (q && q.mode === 'practice') {
      q.qs.forEach((x, i) => { if (q.checked[i] && q.picks[i] !== this.qOf(x).correct) wrongs.push({ q: x, your: q.picks[i] }); });
    }
    this.go(s.sqOrigin, Object.assign({ seq: seq, quiz: null }, this.addMistakes(s, wrongs, seq), this.seenPatch(s, q)));
    if (wrongs.length > 0) this.toast(this.plural(wrongs.length, 'question', 'questions') + ' added to your Mistake Notebook', 'tr');
  }

  qUpd(patch) { const s = this.st(); if (!s.quiz) return; this.setState({ quiz: Object.assign({}, s.quiz, patch) }); }
  qPick(j) {
    const q = this.st().quiz; if (!q) return;
    const i = q.idx;
    if (q.mode === 'practice' && q.checked[i]) return;
    const picks = Object.assign({}, q.picks); picks[i] = j;
    const skipped = Object.assign({}, q.skipped); delete skipped[i];
    this.qUpd({ picks, skipped });
  }
  qCheck() {
    const q = this.st().quiz; if (!q || q.picks[q.idx] == null) return;
    const checked = Object.assign({}, q.checked); checked[q.idx] = true;
    this.qUpd({ checked });
  }
  qNext() {
    const q = this.st().quiz; if (!q) return;
    if (q.idx < q.n - 1) this.qUpd({ idx: q.idx + 1 }); else this.finishQuiz(q);
  }
  qSkip() {
    const q = this.st().quiz; if (!q) return;
    const i = q.idx;
    const skipped = Object.assign({}, q.skipped); skipped[i] = true;
    const picks = Object.assign({}, q.picks); delete picks[i];
    const nq = Object.assign({}, q, { skipped, picks });
    const last = i === q.n - 1;
    if (!last) nq.idx = i + 1;
    if (last && q.mode === 'practice') this.finishQuiz(nq);
    else this.setState({ quiz: nq });
  }
  unanswered(q) { let c = 0; for (let i = 0; i < q.n; i++) if (q.picks[i] == null) c++; return c; }
  examSubmit() {
    const q = this.st().quiz; if (!q) return;
    if (this.unanswered(q) > 0) this.setState({ examModal: true }); else this.finishQuiz(q);
  }
  examReview() {
    const q = this.st().quiz; if (!q) return;
    let first = q.idx;
    for (let i = 0; i < q.n; i++) { if (q.picks[i] == null) { first = i; break; } }
    this.setState({ examModal: false, quiz: Object.assign({}, q, { idx: first }) });
  }

  makeMQ(s, subjId, months, origin, ids, labels) {
    const all = this.allItems(s);
    let list;
    if (ids) list = ids.filter(id => !s.cleared[id]);
    else list = this.byMonths(this.liveItems(s).filter(i => !subjId || i.subj === subjId), months).sort((a, b) => b.key - a.key).map(i => i.id);
    if (!list.length) return null;
    const items = list.map(id => all.find(x => x.id === id));
    return {
      ids: list, idx: 0, picks: {}, checked: {}, cleared: {}, scope: subjId, origin: origin, startedAt: Date.now(),
      subjLabel: labels ? labels.subjLabel : (subjId ? this.subj(subjId).name : 'All subjects'),
      monthLabel: labels ? labels.monthLabel : (months.length ? this.monthLabelDesc(months) : this.presentLabel(items))
    };
  }
  launchMQ(subjId, months, origin, ids, labels) {
    const s = this.st();
    const mq = this.makeMQ(s, subjId, months, origin, ids, labels);
    if (!mq) return;
    this.go('B3', { mq: mq, mqModal: false });
  }
  mqPick(j) {
    const s = this.st(); const mq = s.mq; if (!mq) return;
    const id = mq.ids[mq.idx];
    if (mq.checked[id]) return;
    const picks = Object.assign({}, mq.picks); picks[id] = j;
    this.setState({ mq: Object.assign({}, mq, { picks }) });
  }
  mqCheck() {
    const s = this.st(); const mq = s.mq; if (!mq) return;
    const D = this.D();
    const id = mq.ids[mq.idx];
    const pick = mq.picks[id];
    if (pick == null) return;
    const it = this.allItems(s).find(x => x.id === id);
    const ok = pick === this.qOf(it).correct;
    const checked = Object.assign({}, mq.checked); checked[id] = true;
    const mcl = Object.assign({}, mq.cleared); if (ok) mcl[id] = true;
    const patch = { mq: Object.assign({}, mq, { checked, cleared: mcl }) };
    if (ok) { const c = Object.assign({}, s.cleared); c[id] = true; patch.cleared = c; }
    else { const b = Object.assign({}, s.missBump); b[id] = (b[id] || 0) + 1; patch.missBump = b; }
    this.setState(patch);
    if (ok) this.toast('Cleared from your Notebook', 'bc');
  }
  mqNext() {
    const s = this.st(); const mq = s.mq; if (!mq) return;
    if (mq.idx < mq.ids.length - 1) this.setState({ mq: Object.assign({}, mq, { idx: mq.idx + 1 }) });
    else this.go('B4', { mqModal: false });
  }
  ffCalc(s, mq) {
    const D = this.D();
    const N = mq.ids.length;
    const picks = Object.assign({}, mq.picks), checked = Object.assign({}, mq.checked), mcl = Object.assign({}, mq.cleared), gl = Object.assign({}, s.cleared);
    for (let k = mq.idx; k < N; k++) {
      const id = mq.ids[k];
      if (checked[id]) continue;
      const it = this.allItems(s).find(x => x.id === id);
      const wrong = N > 3 && k >= N - 3;
      picks[id] = wrong ? it.wrong : this.qOf(it).correct;
      checked[id] = true;
      if (!wrong) { mcl[id] = true; gl[id] = true; }
    }
    return { mq: Object.assign({}, mq, { picks, checked, cleared: mcl, idx: N - 1 }), cleared: gl };
  }
  mqFast() { const s = this.st(); if (!s.mq) return; this.go('B4', Object.assign({ mqModal: false }, this.ffCalc(s, s.mq))); }

  jump(code) {
    const s = this.st();
    const base = { jumpOpen: false, mqModal: false, examModal: false };
    const ensure = { source: 'pyq', psubs: s.psubs.length ? s.psubs : ['p0', 'p1'], years: s.years.length ? s.years : [2026, 2025] };
    const cnt = typeof s.count === 'number' ? s.count : 20;
    if (code === 'A0' || code === 'A1' || code === 'A2') return this.go(code, Object.assign(base, ensure, { demo: 'default', sqOrigin: 'A0' }));
    if (code.indexOf('A3') === 0) {
      const demo = { A3: 'default', A3a: 'short', A3b: 'floor', A3c: 'exhausted' }[code];
      return this.go('A3', Object.assign(base, ensure, { demo: demo, count: cnt, sqOrigin: 'A0' }));
    }
    if (code === 'A4' || code === 'A4b') {
      const mode = code === 'A4' ? 'practice' : 'exam';
      const s2 = Object.assign({}, s, ensure, { mode: mode, demo: 'default', count: cnt });
      return this.go(code, Object.assign(base, ensure, { mode: mode, demo: 'default', count: cnt, sqOrigin: 'A0' }, this.startPatch(this.makeQuiz(s2))));
    }
    if (code === 'A5' || code === 'A6') {
      if (s.finished) return this.go(code, Object.assign(base, { solTab: 'all' }));
      const s2 = Object.assign({}, s, ensure, { mode: 'practice', demo: 'default', count: 20 });
      this.setState(Object.assign(base, ensure, { mode: 'practice', demo: 'default', count: 20 }));
      return this.finishQuiz(this.makeQuiz(s2), code);
    }
    if (code === 'S') return this.go('S', base);
    if (code === 'B1') return this.go('B1', Object.assign(base, { nbEmpty: false }));
    if (code === 'B1e') return this.go('B1', Object.assign(base, { nbEmpty: true }));
    if (code === 'B2') return this.go('B2', Object.assign(base, { b2Subj: 'polity', b2Months: [], open: null }));
    if (code === 'B3' || code === 'B4') {
      const mq = this.makeMQ(s, 'polity', [], 'B2') || this.makeMQ(s, null, [], 'B1');
      if (!mq) return this.go('B1', base);
      if (code === 'B3') return this.go('B3', Object.assign(base, { mq: mq }));
      return this.go('B4', Object.assign(base, this.ffCalc(s, mq)));
    }
  }

  optView(o, j, correct, pick, checked, on, letters) {
    let cls = 'opt', tick = false, cross = false;
    if (checked) {
      cls += ' locked';
      if (j === correct) { cls += pick === j ? ' ok' : ' okline'; tick = true; }
      else if (j === pick) { cls += ' bad'; cross = true; }
      else cls += ' dim';
    } else if (pick === j) cls += ' sel';
    return { n: letters ? 'abcd'[j] : j + 1, text: o, cls: cls, tick: tick, cross: cross, radio: !tick && !cross, radioCls: pick === j ? 'radio on' : 'radio', picked: pick === j, on: on };
  }

  engineQuiz(s) {
    const D = this.D();
    const q = s.quiz || this.makeQuiz(Object.assign({}, this.defaults()));
    if (!q || !q.qs.length) {
      return { title: 'Loading…', sub: 'Smart Quiz', fresh: false, pct: 0, progText: '', qBadge: 'Q1', tags: [], text: 'Loading the question bank…', options: [], showMissed: false, missedLine: '', showSol: false, sol: '', showResult: false, resultText: '', resultCls: 'note', showCleared: false, showStays: false, secShow: false, secLabel: '', secOn: () => {}, primLabel: 'Back', primOn: () => this.go('A0', { quiz: null }), primDisabled: false, palette: [], palTitle: 'Question palette', palSub: '', legend: [], exit: () => this.go('A0', { quiz: null }), showFF: false, ff: () => {} };
    }
    const i = q.idx, it = q.qs[i], T = this.qOf(it);
    const practice = q.mode === 'practice';
    const pick = q.picks[i];
    const hasPick = pick != null;
    const checked = practice && !!q.checked[i];
    const last = i === q.n - 1;
    const options = T.opts.map((o, j) => this.optView(o, j, T.correct, pick, checked, () => this.qPick(j), !!it.pid));
    const answered = practice ? Object.keys(q.checked).length : Object.keys(q.picks).length;
    const palette = q.qs.map((x, k) => {
      let c = '';
      if (practice) { if (q.checked[k]) c = q.picks[k] === this.qOf(x).correct ? 'ok' : 'bad'; else if (q.skipped[k]) c = 'skip'; }
      else { if (q.picks[k] != null) c = 'ans'; else if (q.skipped[k]) c = 'hollow'; }
      if (k === i) c += ' cur';
      return { n: k + 1, cls: c, on: () => this.qUpd({ idx: k }) };
    });
    let sec, prim;
    if (practice) {
      sec = { show: !checked, label: last ? 'Skip & Finish' : 'Skip', on: () => this.qSkip() };
      prim = checked ? { label: last ? 'Finish Quiz' : 'Save & Next', on: () => this.qNext(), disabled: false }
        : { label: 'Check Answer', on: () => this.qCheck(), disabled: !hasPick };
    } else {
      sec = { show: true, label: 'Skip', on: () => this.qSkip() };
      prim = last ? { label: 'Submit Quiz', on: () => this.examSubmit(), disabled: false }
        : { label: 'Save & Next', on: () => this.qNext(), disabled: !hasPick };
    }
    const correctPick = checked && pick === T.correct;
    const legend = practice
      ? [{ label: 'Current', cls: 'cur' }, { label: 'Correct', cls: 'ok' }, { label: 'Incorrect', cls: 'bad' }, { label: 'Skipped', cls: 'skip' }]
      : [{ label: 'Current', cls: 'cur' }, { label: 'Answered', cls: 'ans' }, { label: 'Skipped', cls: 'hollow' }, { label: 'Not visited', cls: '' }];
    return {
      title: (i + 1) + ' of ' + q.n, sub: 'Smart Quiz · ' + (q.source === 'pyq' ? 'UPSC PYQs · ' : '') + q.subjLabel + ' · ' + q.monthLabel, fresh: !!q.fresh,
      pct: Math.round(answered / q.n * 100), progText: answered + ' of ' + q.n + ' answered',
      qBadge: 'Q' + (i + 1), tags: this.tagsOf(it), text: T.text, options: options,
      showMissed: false, missedLine: '', showSol: checked, sol: T.sol,
      showResult: checked, resultText: correctPick ? 'Correct' : 'Incorrect · added to your Mistake Notebook', resultCls: correctPick ? 'note ok' : 'note bad',
      showCleared: false, showStays: false,
      secShow: sec.show, secLabel: sec.label, secOn: sec.on, primLabel: prim.label, primOn: prim.on, primDisabled: prim.disabled,
      palette: palette, palTitle: practice ? 'Question palette · Practice' : 'Question palette · Exam', palSub: answered + ' of ' + q.n + ' answered',
      legend: legend, exit: () => this.exitQuiz(), showFF: false, ff: () => {}
    };
  }

  engineMQ(s) {
    const D = this.D();
    const mq = s.mq;
    if (!mq) return this.engineQuiz(s);
    const N = mq.ids.length;
    const i = mq.idx, id = mq.ids[i];
    const it = this.allItems(s).find(x => x.id === id);
    const T = this.qOf(it);
    const pick = mq.picks[id];
    const checked = !!mq.checked[id];
    const last = i === N - 1;
    const options = T.opts.map((o, j) => this.optView(o, j, T.correct, pick, checked, () => this.mqPick(j), !!it.pid));
    const answered = mq.ids.filter(x => mq.checked[x]).length;
    const clearedN = mq.ids.filter(x => mq.cleared[x]).length;
    const wrongN = answered - clearedN;
    const palette = mq.ids.map((x, k) => {
      let c = mq.checked[x] ? (mq.cleared[x] ? 'ok' : 'bad') : '';
      if (k === i) c += ' cur';
      return { n: k + 1, cls: c, on: () => this.setState({ mq: Object.assign({}, this.st().mq, { idx: k }) }) };
    });
    const prim = checked ? { label: last ? 'Finish Mistake Quiz' : 'Save & Next', on: () => this.mqNext(), disabled: false }
      : { label: 'Check Answer', on: () => this.mqCheck(), disabled: pick == null };
    const okPick = checked && pick === T.correct;
    return {
      title: (i + 1) + ' of ' + N, sub: 'Mistake Quiz · ' + mq.subjLabel + ' · ' + mq.monthLabel, fresh: false,
      pct: Math.round(answered / N * 100), progText: answered + ' of ' + N + ' answered',
      qBadge: 'Q' + (i + 1), tags: this.tagsOf(it), text: T.text, options: options,
      showMissed: true, missedLine: 'You missed this on ' + it.dateText + ' · Missed ×' + (it.missed + (s.missBump[id] || 0)),
      showSol: checked, sol: T.sol, showResult: false, resultText: '', resultCls: 'note',
      showCleared: okPick, showStays: checked && !okPick,
      secShow: false, secLabel: '', secOn: () => {}, primLabel: prim.label, primOn: prim.on, primDisabled: prim.disabled,
      palette: palette, palTitle: 'Question palette · Mistake Quiz', palSub: 'Cleared ' + clearedN + ' · Still to fix ' + wrongN,
      legend: [{ label: 'Current', cls: 'cur' }, { label: 'Cleared', cls: 'ok' }, { label: 'Still to fix', cls: 'bad' }, { label: 'Not answered', cls: '' }],
      exit: () => this.setState({ mqModal: true }), showFF: true, ff: () => this.mqFast()
    };
  }

  monthChips(list, sel, setter, short) {
    const D = this.D();
    const chips = [{ label: 'All', count: list.length, on: !sel.length, tap: () => setter([]) }];
    D.NB.concat(['pyq']).forEach(m => {
      const on = sel.indexOf(m) >= 0;
      const cnt = list.filter(i => i.month === m).length;
      if (!cnt && !on) return;
      chips.push({
        label: m === 'pyq' ? 'UPSC PYQs' : (short ? D.MS[m] : D.MS[m] + ' 2026'), count: cnt, on: on,
        tap: () => { let next = on ? sel.filter(x => x !== m) : sel.concat(m); if (next.length === 6) next = []; setter(next); }
      });
    });
    chips.forEach(c => { c.cls = c.on ? 'chip on' : 'chip'; });
    return chips;
  }

  renderVals() {
    const s = this.st();
    const D = this.D();
    const sc = s.screen;
    const isEngine = sc === 'A4' || sc === 'A4b' || sc === 'B3';
    const live = this.liveItems(s);
    const v = {};
    v.shell = !isEngine;
    v.isEngine = isEngine;
    v.isA0 = sc === 'A0'; v.isA1 = sc === 'A1'; v.isA2 = sc === 'A2'; v.isA3 = sc === 'A3';
    v.isWizard = v.isA1 || v.isA2 || v.isA3;
    v.isA5 = sc === 'A5'; v.isA6 = sc === 'A6'; v.isB1 = sc === 'B1'; v.isB2 = sc === 'B2'; v.isB4 = sc === 'B4';
    v.screenCode = sc === 'A3' && s.demo !== 'default' ? 'A3' + { short: 'a', floor: 'b', exhausted: 'c' }[s.demo] : (sc === 'B1' && s.nbEmpty ? 'B1 empty' : sc);

    v.goHome = () => this.go('A0');
    v.goB1 = () => this.go('B1');
    v.notInProto = () => this.toast('That section isn’t part of this prototype', 'tr');
    v.watchNow = () => this.toast('The live class opens in the video player', 'tr');

    // A0
    v.heroDots = [0, 1, 2, 3].map(k => ({ cls: s.hero === k ? 'hdot on' : 'hdot', tap: () => this.setState({ hero: k }), label: 'Show banner ' + (k + 1) }));
    v.nbTotal = live.length;
    v.nbZero = live.length === 0;
    const perSubj = D.SUBJ.map((sb, k) => ({ sb: sb, k: k, n: live.filter(i => i.subj === sb.id).length }));
    v.strip = perSubj.filter(x => x.n > 0).map(x => ({ n: x.n, c: D.STRIP[x.k], title: x.sb.name + ': ' + x.n }));
    const top = perSubj.filter(x => x.n > 0).sort((a, b) => b.n - a.n);
    v.stripCaption = top.length ? top.slice(0, 3).map(x => x.sb.short + ' ' + x.n).join(' · ') + (top.length > 3 ? ' · +' + (top.length - 3) + ' more subjects' : '') : 'Nothing to fix right now';
    v.startSmartA0 = () => this.go('A1', { sqOrigin: 'A0', demo: 'default' });
    v.openNotebook = () => this.go('B1', { nbEmpty: false });
    v.startMQAll = () => this.launchMQ(null, [], 'A0');
    v.teachers = [
      ['Dr. Shivin Chaudhary Sir', 'Ex-IRS', 'Science & Tech + Environment', 'Jan–Feb, July', 'img/shivin.jpg'],
      ['Varun Jain Sir', '4 UPSC Mains; 2 UPSC Interviews; IIT Roorkee', 'International Relations', 'March, July', 'img/varun.jpg'],
      ['Sajal Singh Sir', 'Mentor to 600+ successful rankers; 3 UPSC Interviews', 'Security, Society', 'Monthly', 'img/sajal.jpg'],
      ['Himanshu Khatri Sir', 'Ex-IRS', 'History & AMAC', 'Monthly', 'img/himanshu.jpg'],
      ['Aditya Kalia Sir', '2 UPSC Interviews; Teaching Experience: 10+ Years', 'Economy', 'Monthly', 'img/aditya.jpg'],
      ['Pallavi Saxena Ma\u2019am', '3 UPSC Interviews; 100 percentile in UGC NET Geography', 'Geography + Disaster Management', 'Monthly', 'img/pallavi.jpg'],
      ['M. Puri Sir', '3 UPSC Interviews; Teaching Experience: 25+ Years', 'Polity & Governance', 'Monthly', 'img/puri.jpg'],
      ['Peeyush Kumar Sir', '50+ Rankers in Top 100', 'Ethics', 'Feb, July', 'img/peeyush.jpg'],
      ['Jasleen Kaur Ma\u2019am', '1 UPSC Interview; 3 UPSC Mains; M.A. in History', 'Miscellaneous', 'Monthly', 'img/jasleen.jpg']
    ].map(r => ({ name: r[0], creds: r[1].split('; ').join('\n'), subject: r[2], when: r[3], photo: r[4] }));
    v.teacherCount = v.teachers.length;

    // Wizard
    const a = this.a3(s);
    const stepIdx = { A1: 0, A2: 1, A3: 2 }[sc] || 0;
    v.wizCancel = () => this.go(s.sqOrigin, { demo: 'default' });
    const isP = s.source === 'pyq';
    v.steps = ['Subjects', isP ? 'Years' : 'Months', 'Preferences'].map((label, k) => ({
      num: String(k + 1), label: label, done: k < stepIdx, notDone: k >= stepIdx,
      cls: k === stepIdx ? 'active' : (k < stepIdx ? 'done' : ''), locked: k >= stepIdx,
      on: () => { if (k < stepIdx) this.go(['A1', 'A2', 'A3'][k]); }
    }));
    const pyqAll = this._pyq || [];
    v.srcTabs = [
      { id: 'ca', title: 'Current Affairs', cap: 'No questions yet · coming soon', off: true, d: 'M4 5h13v14H6a2 2 0 0 1-2-2zM17 9h3v8a2 2 0 0 1-2 2M8 9h5M8 13h5M8 16h3' },
      { id: 'pyq', title: 'UPSC Previous Year Questions', cap: (this._pyq ? pyqAll.length : 494) + ' questions · Prelims 2022–2026', d: 'M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3zM5 17a3 3 0 0 1 3-3h11M9 8h6' }
    ].map(x => ({ title: x.title, cap: x.cap, d: x.d, off: !!x.off, on: s.source === x.id, cls: s.source === x.id ? 'sel' : '', radioCls: s.source === x.id ? 'radio on' : 'radio', tap: () => this.setState({ source: x.id, demo: 'default' }) }));
    if (isP) {
      v.a1Subj = D.PSUBJ.map(sb => {
        const on = s.psubs.indexOf(sb.id) >= 0;
        const mine = pyqAll.filter(q => 'p' + q.s === sb.id);
        const unseen = mine.filter(q => !s.pyqSeen[q.i]).length;
        const cap = this._pyq ? mine.length + ' questions' + (unseen < mine.length ? ' · ' + unseen + ' unseen' : '') : 'Loading…';
        return { name: sb.name, d: sb.d, cap: cap, on: on, cls: on ? 'sel' : '', cbCls: on ? 'on' : '',
          tap: () => { const cur = this.st().psubs; this.setState({ psubs: on ? cur.filter(x => x !== sb.id) : cur.concat(sb.id) }); } };
      });
      v.a2Months = [2026, 2025, 2024, 2023, 2022].map(y => {
        const on = s.years.indexOf(y) >= 0;
        const cnt = pyqAll.filter(q => q.y === y && s.psubs.indexOf('p' + q.s) >= 0).length;
        return { short: String(y), sub: 'Prelims GS I', cap: this._pyq ? cnt + ' in your subjects' : 'Loading…', on: on, dim: false, cls: on ? 'sel' : '', cbCls: on ? 'on' : '',
          tap: () => { const cur = this.st().years; this.setState({ years: on ? cur.filter(x => x !== y) : cur.concat(y) }); } };
      });
      v.a2Title = 'Which years?';
      v.a2Subline = 'UPSC Prelims GS Paper I · pick any';
      v.a2Badge = s.years.length + ' of 5 selected';
      v.a2Note = 'Official UPSC answer keys. Questions dropped by UPSC are left out. Unseen questions are served first, newest year first.';
    } else {
      v.a1Subj = D.SUBJ.map(sb => {
        const on = s.subs.indexOf(sb.id) >= 0;
        return { name: sb.name, d: sb.d, cap: sb.pool + ' questions', on: on, cls: on ? 'sel' : '', cbCls: on ? 'on' : '',
          tap: () => { const cur = this.st().subs; this.setState({ subs: on ? cur.filter(x => x !== sb.id) : cur.concat(sb.id) }); } };
      });
      const capHit = s.months.length >= 3;
      v.a2Months = D.MONTHS.map(m => {
        const on = s.months.indexOf(m.id) >= 0;
        const dim = capHit && !on;
        return { short: m.short, sub: '2026', cap: m.count + ' questions', on: on, dim: dim, cls: on ? 'sel' : '', cbCls: on ? 'on' : '',
          tap: () => { const cur = this.st().months; if (on) this.setState({ months: cur.filter(x => x !== m.id) }); else if (cur.length < 3) this.setState({ months: cur.concat(m.id) }); } };
      });
      v.a2Title = 'Which months?';
      v.a2Subline = 'Choose up to 3';
      v.a2Badge = s.months.length + '/3 selected';
      v.a2Note = 'Mixing months keeps revision spaced. Sep 2026 includes questions up to 29 Sep.';
    }
    v.a3Recap = isP
      ? 'UPSC PYQs · ' + (s.psubs.length ? this.subjLabel(D.PSUBJ.map(x => x.id).filter(id => s.psubs.indexOf(id) >= 0)) : 'No subjects') + ' · ' + (s.years.length ? this.yearsLabel(s.years) : 'No years')
      : 'Current Affairs · ' + (s.subs.length ? this.subjLabel(D.SUBJ.map(x => x.id).filter(id => s.subs.indexOf(id) >= 0)) : 'No subjects') + ' · ' + (s.months.length ? this.monthRangeAsc(s.months) : 'No months');
    v.showDemo = !isP;
    v.exhaustedText = 'You\u2019ve attempted all ' + a.total + ' questions in this filter. Starting a fresh round.';
    v.a3Counts = [10, 20, 30, 'custom'].map(c => ({
      big: c === 'custom' ? 'Custom' : String(c), cap: c === 'custom' ? 'Choose 3–50' : 'questions',
      on: s.count === c, cls: s.count === c ? 'sel' : '', tap: () => this.setState({ count: c })
    }));
    v.isCustom = s.count === 'custom';
    v.customVal = s.custom;
    v.onCustom = (e) => this.setState({ custom: e.target.value });
    v.customHint = a.customBad ? 'Enter a number from 3 to 50' : 'Looks good';
    v.customHintColor = a.customBad ? '#F2B84B' : '#3DBF7A';
    v.a3Modes = [
      { id: 'practice', title: 'Practice', desc: 'See the answer and solution after each question', d: 'M4 19V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v14M4 19h16M9 10l2 2 4-4' },
      { id: 'exam', title: 'Exam', desc: 'Review everything after you submit', d: 'M12 3a9 9 0 1 0 0 18a9 9 0 1 0 0-18zM12 7v5l3 2' }
    ].map(m => ({ title: m.title, desc: m.desc, d: m.d, on: s.mode === m.id, cls: s.mode === m.id ? 'sel' : '', radioCls: s.mode === m.id ? 'radio on' : 'radio', tap: () => this.setState({ mode: m.id }) }));
    v.demoStates = [['default', 'Default'], ['short', 'A3a Short pool'], ['floor', 'A3b Below floor'], ['exhausted', 'A3c Exhausted']].map(d => ({
      label: d[1], cls: s.demo === d[0] ? 'segb on' : 'segb', tap: () => this.setState({ demo: d[0] })
    }));
    v.isExhausted = a.exhausted;
    v.availLine = a.line;
    v.availColor = a.floor ? '#F2B84B' : (a.exhausted ? '#F7D354' : '#FFFFFF');
    v.availIcon = a.floor ? '#F2B84B' : (a.exhausted ? '#F7D354' : '#A3A8B0');
    v.availBg = a.floor ? 'rgba(242, 184, 75, 0.08)' : '#121417';
    if (sc === 'A1') {
      v.wizShowPrev = false; v.wizPrev = () => {};
      const ns = isP ? s.psubs.length : s.subs.length;
      v.wizCounter = this.plural(ns, 'subject', 'subjects') + ' selected';
      v.wizNextLabel = 'Next'; v.wizNextDisabled = ns === 0; v.wizNext = () => this.go('A2');
    } else if (sc === 'A2') {
      v.wizShowPrev = true; v.wizPrev = () => this.go('A1');
      const nm = isP ? s.years.length : s.months.length;
      v.wizCounter = isP ? this.plural(nm, 'year', 'years') + ' selected' : this.plural(nm, 'month', 'months') + ' selected';
      v.wizNextLabel = 'Next'; v.wizNextDisabled = nm === 0; v.wizNext = () => this.go('A3');
    } else {
      v.wizShowPrev = true; v.wizPrev = () => this.go('A2');
      v.wizCounter = a.canStart ? 'Starts with ' + a.n + ' questions · ' + (s.mode === 'practice' ? 'Practice' : 'Exam') : '';
      v.wizNextLabel = 'Start Quiz'; v.wizNextDisabled = !a.canStart;
      v.wizNext = () => { const st = this.st(); const quiz = this.makeQuiz(st); if (!quiz) return; this.go(st.mode === 'practice' ? 'A4' : 'A4b', this.startPatch(quiz)); };
    }

    // Engine
    v.E = sc === 'B3' ? this.engineMQ(s) : this.engineQuiz(s);
    v.examModal = !!s.examModal && isEngine;
    const qz = s.quiz;
    const un = qz ? this.unanswered(qz) : 0;
    v.examModalText = 'You have ' + this.plural(un, 'unanswered question', 'unanswered questions') + '. Submit anyway?';
    v.examReview = () => this.examReview();
    v.examSubmitNow = () => this.finishQuiz(this.st().quiz);
    v.mqModal = !!s.mqModal && sc === 'B3';
    const mqNow = s.mq;
    const leftInSession = mqNow ? mqNow.ids.length - mqNow.ids.filter(x => mqNow.cleared[x]).length : 0;
    v.mqModalText = 'Questions you’ve cleared stay cleared. ' + leftInSession + (leftInSession === 1 ? ' remaining question stays' : ' remaining questions stay') + ' in your Notebook.';
    v.mqKeep = () => this.setState({ mqModal: false });
    v.mqExitNow = () => this.go('B4', { mqModal: false });

    // A5 / A6
    let f = s.finished;
    if (!f) {
      const dq = this.makeQuiz(Object.assign({}, this.defaults()));
      if (dq && dq.qs.length) {
        const res = this.computeRes(dq);
        f = { n: dq.n, mode: dq.mode, source: dq.source, subs: dq.subs, subjLabel: dq.subjLabel, monthLabel: dq.monthLabel, qs: dq.qs, res: res, added: 0 };
      } else {
        f = { n: 1, mode: 'practice', source: 'pyq', subs: [], subjLabel: '', monthLabel: '', qs: [], res: [], added: 0 };
      }
    }
    const cN = f.res.filter(r => r.o === 'c').length, iN = f.res.filter(r => r.o === 'i').length, sN = f.res.filter(r => r.o === 's').length;
    const total = f.secs || 0;
    v.sum = {
      chips: ['Smart Quiz'].concat(f.source === 'pyq' ? ['UPSC PYQs'] : []).concat([f.subjLabel, f.monthLabel, f.n + ' questions', f.mode === 'practice' ? 'Practice' : 'Exam']).map(t => ({ t: t })),
      tiles: [
        { label: 'Correct', val: cN + '/' + f.n, pct: Math.round(cN / f.n * 100), color: '#3DBF7A' },
        { label: 'Incorrect', val: iN + '/' + f.n, pct: Math.round(iN / f.n * 100), color: '#E5534B' },
        { label: 'Skipped', val: sN + '/' + f.n, pct: Math.round(sN / f.n * 100), color: '#6E737B' }
      ],
      stats: [
        { label: 'Accuracy', val: Math.round(cN / f.n * 100) + '%', d: 'M12 3a9 9 0 1 0 0 18a9 9 0 1 0 0-18zM12 8a4 4 0 1 0 0 8a4 4 0 1 0 0-8zM12 11.5v1' },
        { label: 'Time taken', val: this.fmt(total), d: 'M12 3a9 9 0 1 0 0 18a9 9 0 1 0 0-18zM12 7v5l3 2' },
        { label: 'Avg per question', val: this.fmt(total / f.n), d: 'M5 20V10M12 20V4M19 20v-7' }
      ],
      bySubj: f.subs.map(id => {
        let t = 0, c = 0;
        f.qs.forEach((q, i) => { if (q.subj === id) { t++; if (f.res[i].o === 'c') c++; } });
        return { name: this.subj(id).name, pct: t ? Math.round(c / t * 100) : 0, label: c + '/' + t + ' correct' };
      }),
      showAdded: f.added > 0,
      addedText: this.plural(f.added, 'question', 'questions') + ' added to your Mistake Notebook'
    };
    v.reattempt = () => this.go('A1', { demo: 'default' });
    v.viewSolutions = () => this.go('A6', { solTab: 'all' });
    v.backToSummary = () => this.go('A5');
    v.solRecap = 'Smart Quiz · ' + (f.source === 'pyq' ? 'UPSC PYQs · ' : '') + f.subjLabel + ' · ' + f.monthLabel + ' · ' + f.n + ' questions';
    v.solTabs = [['all', 'All', f.n], ['c', 'Correct', cN], ['i', 'Incorrect', iN], ['s', 'Skipped', sN]].map(t => ({
      label: t[1], count: t[2], on: s.solTab === t[0], cls: s.solTab === t[0] ? 'tab on' : 'tab', tap: () => this.setState({ solTab: t[0] })
    }));
    v.solList = f.qs.map((q, i) => {
      const T = this.qOf(q);
      const r = f.res[i];
      return {
        o: r.o, num: 'Q' + (i + 1), text: T.text, subj: this.subj(q.subj).short, month: q.pid ? 'Prelims ' + q.year + ' · Q' + q.qno : this.mlabel(q),
        stCls: r.o === 'c' ? 'st ok' : (r.o === 'i' ? 'st bad' : 'st skip'), stLabel: r.o === 'c' ? 'Correct' : (r.o === 'i' ? 'Incorrect' : 'Skipped'),
        yourDot: r.o === 'c' ? '#3DBF7A' : (r.o === 'i' ? '#E5534B' : '#6E737B'),
        yourColor: r.o === 's' ? '#A3A8B0' : '#FFFFFF',
        yourText: r.o === 's' ? 'Not attempted' : T.opts[r.your],
        showCorrect: r.o !== 'c', correctText: T.opts[T.correct], sol: T.sol
      };
    }).filter(x => s.solTab === 'all' || x.o === s.solTab);

    // B1
    const fB1 = this.byMonths(live, s.nbMonths);
    v.b1ShowEmpty = s.nbEmpty || live.length === 0;
    v.b1Full = !v.b1ShowEmpty;
    v.b1Sub = this.plural(fB1.length, 'question', 'questions') + ' to fix' + (s.nbMonths.length ? ' · ' + this.monthLabelDesc(s.nbMonths) : '');
    v.b1Cta = 'Start Mistake Quiz · ' + fB1.length;
    v.b1CtaDisabled = fB1.length === 0;
    v.b1Start = () => this.launchMQ(null, this.st().nbMonths.slice(), 'B1');
    v.b1Chips = this.monthChips(live, s.nbMonths, arr => this.setState({ nbMonths: arr }), false);
    v.b1Cards = D.SUBJ.map(sb => {
      const n = fB1.filter(i => i.subj === sb.id).length;
      return {
        name: sb.name, d: sb.d, cap: n ? this.plural(n, 'mistake', 'mistakes') : 'No mistakes', has: n > 0, none: n === 0,
        cardCls: n ? 'card hov' : 'card nodata',
        open: () => this.go('B2', { b2Subj: sb.id, b2Months: this.st().nbMonths.slice(), open: null }),
        start: () => this.launchMQ(sb.id, this.st().nbMonths.slice(), 'B1')
      };
    });
    v.b1Demo = [['full', 'Notebook'], ['empty', 'Empty state']].map(d => ({
      label: d[1], cls: (s.nbEmpty ? 'empty' : 'full') === d[0] ? 'segb on' : 'segb', tap: () => this.setState({ nbEmpty: d[0] === 'empty' })
    }));
    v.smartFromB1 = () => this.go('A1', { sqOrigin: 'B1', demo: 'default', nbEmpty: false });

    // B2
    const sb2 = this.subj(s.b2Subj);
    const list2 = live.filter(i => i.subj === sb2.id);
    const f2 = this.byMonths(list2, s.b2Months).slice();
    const missOf = it => it.missed + (s.missBump[it.id] || 0);
    if (s.b2Sort === 'oldest') f2.sort((x, y) => x.key - y.key);
    else if (s.b2Sort === 'most') f2.sort((x, y) => (missOf(y) - missOf(x)) || (y.key - x.key));
    else f2.sort((x, y) => y.key - x.key);
    const openId = s.open === null ? (f2[0] ? f2[0].id : '') : s.open;
    v.b2Name = sb2.name;
    v.b2Heading = sb2.name + ' · ' + this.plural(list2.length, 'mistake', 'mistakes');
    v.b2Chips = this.monthChips(list2, s.b2Months, arr => this.setState({ b2Months: arr, open: null }), true);
    v.b2Sort = s.b2Sort;
    v.onSort = e => this.setState({ b2Sort: e.target.value, open: null });
    v.b2Rows = f2.map((it, k) => {
      const T = this.qOf(it);
      const isOpen = it.id === openId;
      return {
        num: 'Q' + (k + 1), text: T.text, textCls: isOpen ? 'qtext' : 'qtext clamp2', month: it.pid ? 'PYQ ' + it.year + ' · ' + this.subj(it.psubj).short : this.mlabel(it), missed: 'Missed ×' + missOf(it),
        fresh: !!it.fresh, freshLabel: it.pid ? 'New · UPSC PYQ' : 'New from Smart Quiz', isOpen: isOpen, chevCls: isOpen ? 'chev up' : 'chev', yourText: T.opts[it.wrong], correctText: T.opts[T.correct], sol: T.sol,
        date: 'Last missed ' + it.dateText, toggle: () => this.setState({ open: isOpen ? '' : it.id })
      };
    });
    v.b2Empty = f2.length === 0;
    v.b2Bar = this.plural(f2.length, 'question', 'questions') + ' · ' + (f2.length ? this.presentLabel(f2) : this.monthLabelDesc(s.b2Months));
    v.b2Start = () => { const st = this.st(); this.launchMQ(st.b2Subj, st.b2Months.slice(), 'B2'); };

    // B4
    const mq = s.mq || { ids: [], checked: {}, cleared: {}, subjLabel: 'All subjects', monthLabel: 'All months', scope: null, origin: 'B1' };
    const N4 = mq.ids.length;
    const cl4 = mq.ids.filter(x => mq.cleared[x]).length;
    const remIds = mq.ids.filter(x => !s.cleared[x]);
    const ans4 = mq.ids.filter(x => mq.checked[x]).length;
    const all = this.allItems(s);
    const groups = {};
    mq.ids.forEach(x => { const it = all.find(y => y.id === x); if (!it) return; groups[it.subj] = groups[it.subj] || { t: 0, c: 0 }; groups[it.subj].t++; if (mq.cleared[x]) groups[it.subj].c++; });
    v.b4 = {
      recap: 'Mistake Quiz · ' + mq.subjLabel + ' · ' + mq.monthLabel,
      headline: 'Cleared ' + cl4 + ' of ' + N4,
      sub: remIds.length ? remIds.length + ' still in your Notebook' : 'Nothing left to fix in this set',
      clearedN: cl4, remN: remIds.length,
      clearedPct: N4 ? Math.round(cl4 / N4 * 100) : 0, remPct: N4 ? Math.round(remIds.length / N4 * 100) : 0,
      time: this.fmt(mq.startedAt ? Math.round(((mq.endedAt || Date.now()) - mq.startedAt) / 1000) : 0), timeCap: this.plural(ans4, 'question', 'questions') + ' answered',
      rows: D.SUBJ.filter(x => groups[x.id]).map(x => ({ name: x.name, pct: Math.round(groups[x.id].c / groups[x.id].t * 100), label: groups[x.id].c + ' of ' + groups[x.id].t + ' cleared' })),
      hasRem: remIds.length > 0,
      rem: remIds.map(x => { const it = all.find(y => y.id === x); return { text: this.qOf(it).text.split('\n')[0], subj: this.subj(it.psubj || it.subj).short, month: this.mlabel(it) }; }),
      retryLabel: 'Retry remaining ' + remIds.length, retryDisabled: remIds.length === 0
    };
    v.b4Retry = () => { const st = this.st(); const m = st.mq; if (!m) return; this.launchMQ(m.scope, [], m.origin, m.ids.filter(x => !st.cleared[x]), { subjLabel: m.subjLabel, monthLabel: m.monthLabel }); };

    // Toasts
    v.toastTR = !!(s.toast && s.toast.pos === 'tr');
    v.toastBC = !!(s.toast && s.toast.pos === 'bc');
    v.toastText = s.toast ? s.toast.text : '';

    // Reviewer jump menu
    v.jumpOpen = !!s.jumpOpen;
    v.jumpLeft = isEngine ? 1254 : 16;
    v.jpanelLeft = isEngine ? -140 : 0;
    v.toggleJump = () => this.setState({ jumpOpen: !this.st().jumpOpen });
    v.resetProto = () => this.clearAll('A0');
    v.navCA = sc === 'S' ? 'nav' : 'nav on';
    v.navSet = sc === 'S' ? 'nav on' : 'nav';
    v.isS = sc === 'S';
    v.goSettings = () => this.go('S');
    v.setCount = live.length;
    v.setNbLine = this.plural(live.length, 'question', 'questions') + ' in your Mistake Notebook';
    v.setQuizLine = this.plural(s.attempted, 'quiz', 'quizzes') + ' completed · ' + this.plural(Object.keys(s.cleared).length, 'question', 'questions') + ' cleared so far';
    v.setNothing = live.length === 0 && s.attempted === 0 && Object.keys(s.cleared).length === 0;
    v.setAskClear = () => this.setState({ setModal: true });
    v.setModal = !!s.setModal;
    v.setCancel = () => this.setState({ setModal: false });
    v.setConfirm = () => { this.clearAll('S'); this.toast('All responses cleared. Your Notebook is fresh.', 'tr'); };
    const J = [['A0', 'Current Affairs home'], ['A1', 'Smart Quiz · Subjects'], ['A2', 'Smart Quiz · Years'], ['A3', 'Smart Quiz · Preferences'],
      ['A4', 'Quiz engine · Practice'], ['A4b', 'Quiz engine · Exam'], ['A5', 'Session Summary'], ['A6', 'View Solutions'],
      ['B1', 'Mistake Notebook'], ['B1e', 'Notebook · empty state'], ['B2', 'Subject list · Polity'], ['B3', 'Mistake Quiz'], ['B4', 'Mistake Quiz summary'], ['S', 'Settings']];
    const activeCode = sc === 'A3' ? ({ default: 'A3', short: 'A3a', floor: 'A3b', exhausted: 'A3c' }[s.demo]) : (sc === 'B1' && s.nbEmpty ? 'B1e' : sc);
    v.jumps = J.map(j => ({ code: j[0], label: j[1], cls: j[0] === activeCode ? 'jitem on' : 'jitem', on: () => this.jump(j[0]) }));
    return v;
  }
}

ReactDOM.createRoot(document.getElementById("app")).render(React.createElement(Component, {}));
