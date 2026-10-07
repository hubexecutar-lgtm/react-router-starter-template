// BRAIN-NOCT-001 · palco do cérebro para os mockups. Porte do <script> de "Brain Home v2.html" (Claude Design 343a6542…)
// para um módulo montável nas duas rotas. Mudanças em relação ao original estão marcadas com [BRAIN-NOCT].
// Contrato de motion e callouts: igual ao protótipo (0,03 rad/s; limiar de 8 px; histerese 0,32/0,12; permanência de 6 s).
import * as THREE from 'three';
import { loadBrainAssets } from '../fonte-design/brain-scene.js';
import { createHollowBrain } from '../fonte-design/brain-hollow.js';

const ICON = {
  plan: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3.5" y="5" width="17" height="15" rx="1.5"/><path d="M3.5 10h17M8 3v4m8-4v4"/></svg>',
  stop: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="8.5"/><path d="m6 6 12 12"/></svg>',
  mem: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="11" width="10" height="10" rx="1"/><rect x="11" y="3" width="10" height="10" rx="1"/></svg>',
  flex: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M19.5 9A8 8 0 0 0 5 7.5M4.5 15A8 8 0 0 0 19 16.5M5 3.5v4h4M19 20.5v-4h-4"/></svg>',
};
const PLAY = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 4.5v15l13-7.5z"/></svg>';
const PAUSE = '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>';
const CLOSE = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>';
const CHEV = '<svg viewBox="0 0 24 24" width="16" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 6 6 6-6 6"/></svg>';

// Âncoras = acessos conceituais a redes distribuídas, não localização clínica (RC-BRAIN-CRITIQUE-001 §6).
// [BRAIN-NOCT] id = nó do grafo (rc-graph.json), para ?foco= continuar compatível com o site.
// Textos de Planejamento, Controle inibitório e Flexibilidade = rascunho do protótipo; Memória de trabalho = mockup do usuário.
export const FX = [
  { id: 'COG-PLANEJAMENTO', name: 'Planejamento', icon: 'plan', dir: [1, 0.25, 0.3], priority: 1, summary: 'Define metas, organiza passos e prioriza ações.',
    lead: 'Define metas, organiza passos e prioriza ações antes de começar.', demand: 'Transformar um objetivo em uma sequência de etapas com ordem e prazo.',
    risk: 'Começar sem rota, subestimar o tempo e travar na primeira decisão.', help: 'Quebrar a meta em próximos passos visíveis, cada um com data.' },
  { id: 'COG-MEMORIA-TRABALHO', name: 'Memória de trabalho', icon: 'mem', dir: [0.2, 0.85, 0.5], priority: 2, summary: 'Mantém e manipula informações no curto prazo.',
    lead: 'Mantém e manipula informações durante uma tarefa.', demand: 'Lidar com várias informações.',
    risk: 'Perder o fio da tarefa.', help: 'Use listas e blocos visuais.' },
  { id: 'COG-CONTROLE-INIBITORIO', name: 'Controle inibitório', icon: 'stop', dir: [0.55, -0.55, 0.65], priority: 3, summary: 'Ajuda a focar e evitar distrações.',
    lead: 'Ajuda a focar no que importa e a segurar respostas automáticas.', demand: 'Manter a atenção na tarefa diante de estímulos concorrentes.',
    risk: 'Responder no impulso e trocar de tarefa a cada notificação.', help: 'Reduzir gatilhos no ambiente: notificações desligadas e blocos de foco com horário.' },
  { id: 'COG-FLEXIBILIDADE', name: 'Flexibilidade', icon: 'flex', dir: [-0.65, 0.55, 0.55], priority: 4, summary: 'Permite adaptar estratégias e lidar com mudanças.',
    lead: 'Permite adaptar estratégias e lidar com mudanças de plano.', demand: 'Ajustar o caminho quando as condições ou prioridades mudam.',
    risk: 'Insistir em uma abordagem que não funciona e desorganizar-se com imprevistos.', help: 'Prever um plano B e revisar o plano em checkpoints curtos.' },
];

export const M = { speed: 0.03, dragRadPx: 0.003, threshold: 8, dwellMs: 6000, settleMs: 300, enter: 0.32, leave: 0.12 };
const HOME = { x: 0.16, y: -0.42 };

/**
 * @param {{ stage: HTMLElement, panel: HTMLElement, controls: HTMLElement, pager?: HTMLElement, variant: 'preview'|'full', assetBase: string }} o
 */
export async function mountBrain(o) {
  const { stage, panel, controls, pager, variant } = o;
  const q = (sel) => controls.querySelector(sel);
  const st = { paused: false, reduced: matchMedia('(prefers-reduced-motion: reduce)').matches, inView: true, sel: -1, shown: [], settledAt: 0 };
  try { const s = JSON.parse(localStorage.getItem('rc-home-brain') || 'null'); if (s && typeof s.reduced === 'boolean') st.reduced = s.reduced; } catch {}
  const rot = { x: HOME.x, y: HOME.y, anim: null };
  let dirty = true;

  // ---------- DOM ----------
  const markers = FX.map((f, i) => {
    const mk = document.createElement('button'); mk.className = 'mk hidden'; mk.type = 'button';
    mk.setAttribute('aria-label', f.name); mk.setAttribute('aria-pressed', 'false'); mk.dataset.function = f.id; mk.innerHTML = `<i>${ICON[f.icon]}</i>`;
    mk.onclick = () => select(i, false);
    // [BRAIN-NOCT] callouts automáticos são decorativos para leitor de tela: o conteúdo está no painel (aria-live).
    const co = document.createElement('button'); co.className = 'co'; co.type = 'button'; co.tabIndex = -1; co.setAttribute('aria-hidden', 'true');
    co.innerHTML = `<i class="c tl"></i><i class="c tr"></i><i class="c bl"></i><i class="c br"></i><b>${f.name}</b><span>${f.summary}</span>`;
    co.onclick = () => select(i, false);
    for (const el of [mk, co]) el.addEventListener('pointerdown', (e) => e.stopPropagation());
    stage.querySelector('[data-markers]').append(mk); stage.querySelector('[data-callouts]').append(co);
    return { mk, co, p: null, n: null, facing: -1, sx: 0, sy: 0, inside: false };
  });

  const nextLink = (f) => variant === 'preview'
    ? `<a class="more" href="mapa.html?foco=${f.id}">Abrir ${f.name.toLocaleLowerCase('pt-BR')} no Mapa ›</a>`
    : `<a class="more" href="#relacoes">Explorar as relações de ${f.name.toLocaleLowerCase('pt-BR')} ›</a>`;
  function renderPanel() {
    if (st.sel < 0) {
      panel.innerHTML = `<h2>Funções executivas</h2><p class="lead">Quatro capacidades que sustentam a execução. Escolha uma para ver demanda, dificuldade e apoio.</p>
        ${FX.map((f, i) => `<button class="pick" data-i="${i}"><span class="ic">${ICON[f.icon]}</span><span><b>${f.name}</b><span>${f.summary}</span></span>${CHEV}</button>`).join('')}
        <p class="note">Os marcadores indicam acessos a redes distribuídas, não regiões clínicas exatas.</p>`;
      panel.querySelectorAll('.pick').forEach((el) => el.onclick = () => select(+el.dataset.i, true));
    } else {
      const f = FX[st.sel];
      panel.innerHTML = `<button class="close" aria-label="Fechar e voltar à lista">${CLOSE}</button>
        <h2>${ICON[f.icon]}${f.name}</h2><p class="lead">${f.lead}</p>
        <div class="row"><b>Demanda</b><span>${f.demand}</span></div>
        <div class="row"><b>Dificuldade possível</b><span>${f.risk}</span></div>
        <div class="row"><b>Estratégia de apoio</b><span>${f.help}</span></div>
        ${nextLink(f)}`;
      panel.querySelector('.close').onclick = () => { st.sel = -1; st.shown = []; st.settledAt = performance.now(); writeFoco(); syncUI(); renderPanel(); markers[0].mk.focus(); };
    }
  }
  // [BRAIN-NOCT] paginador do mockup (mobile): um ponto por função + visão geral.
  if (pager) {
    pager.innerHTML = [-1, ...FX.keys()].map((i) => `<button type="button" data-i="${i}" aria-label="${i < 0 ? 'Visão geral' : FX[i].name}"></button>`).join('');
    pager.querySelectorAll('button').forEach((b) => b.onclick = () => { const i = +b.dataset.i; if (i < 0) { st.sel = -1; st.shown = []; writeFoco(); renderPanel(); syncUI(); } else select(i, true); });
  }
  function writeFoco() {
    if (variant !== 'full') return;
    const url = new URL(location.href);
    if (st.sel >= 0) url.searchParams.set('foco', FX[st.sel].id); else url.searchParams.delete('foco');
    history.replaceState(history.state, '', url);
  }
  function syncUI() {
    const still = st.paused || st.reduced;
    q('[data-pause]').innerHTML = still ? `${PLAY}Girar` : `${PAUSE}Pausar`;
    q('[data-pause]').setAttribute('aria-pressed', String(still));
    q('[data-rm]').setAttribute('aria-checked', String(st.reduced));
    document.documentElement.style.setProperty('--t-fast', st.reduced ? '0ms' : '');
    markers.forEach((m, i) => m.mk.setAttribute('aria-pressed', String(i === st.sel)));
    pager?.querySelectorAll('button').forEach((b) => b.setAttribute('aria-current', String(+b.dataset.i === st.sel)));
    stage.dataset.motion = still || st.sel >= 0 ? 'paused' : 'rotating';
    dirty = true;
  }
  function select(i, fromList) {
    st.sel = i; st.paused = true; rot.anim = null;
    if (fromList && markers[i].facing < M.enter && markers[i].p) aimAt(i); // traz uma âncora escondida; clique em pin visível não move o objeto
    writeFoco(); renderPanel(); syncUI();
  }

  // ---------- cena ----------
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2)); renderer.outputColorSpace = THREE.SRGBColorSpace; renderer.setClearColor(0xffffff, 0);
  const scene = new THREE.Scene(), camera = new THREE.PerspectiveCamera(34, 1, 0.1, 40);
  const pivot = new THREE.Group(); scene.add(pivot);
  let brain, dist = 6.6;
  function frame() {
    const w = stage.clientWidth || 1, h = stage.clientHeight || 1;
    renderer.setSize(w, h, false); camera.aspect = w / h;
    const t = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    dist = Math.max(2.4 / (t * camera.aspect * 0.96), 1.85 / (t * 0.96));
    camera.position.set(0, 0.1, dist); camera.lookAt(0, 0, 0); camera.updateProjectionMatrix();
    brain?.setView(dist, renderer.getPixelRatio()); dirty = true;
  }
  function aimAt(i) {
    const p = markers[i].p, y = Math.atan2(-p.x, p.z) + 0.3;
    const dy = ((y - rot.y + Math.PI) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI) - Math.PI;
    if (st.reduced) { rot.y += dy; rot.x = 0.12; } else rot.anim = { fx: rot.x, fy: rot.y, x: 0.12, y: rot.y + dy, t: 0 };
  }

  // ---------- projeção + callouts por orientação ----------
  const v = new THREE.Vector3(), nn = new THREE.Vector3(), toCam = new THREE.Vector3();
  function project() {
    const w = stage.clientWidth, h = stage.clientHeight;
    for (const m of markers) {
      v.copy(m.p).applyMatrix4(pivot.matrixWorld);
      nn.copy(m.n).applyQuaternion(pivot.quaternion);
      toCam.copy(camera.position).sub(v).normalize();
      m.facing = nn.dot(toCam);
      v.project(camera);
      m.sx = (v.x * 0.5 + 0.5) * w; m.sy = (-v.y * 0.5 + 0.5) * h;
      m.inside = m.sx > 24 && m.sx < w - 24 && m.sy > 24 && m.sy < h - 24;
    }
  }
  function updateAuto(now, dragging) {
    if (st.sel >= 0 || dragging || now - st.settledAt < M.settleMs) return;
    const slots = stage.clientWidth < 600 ? 1 : 2;
    const ok = (i) => markers[i].inside && markers[i].facing > M.leave;
    st.shown = st.shown.filter((s) => ok(s.i));
    const cands = FX.map((f, i) => i).filter((i) => markers[i].inside && markers[i].facing > M.enter && !st.shown.some((s) => s.i === i))
      .sort((a, b) => (FX[a].priority - markers[a].facing * 2) - (FX[b].priority - markers[b].facing * 2));
    for (const i of cands) {
      if (st.shown.length < slots) { st.shown.push({ i, since: now }); continue; }
      const old = st.shown.findIndex((s) => now - s.since > M.dwellMs);
      if (old >= 0) st.shown[old] = { i, since: now };
    }
  }
  const R = (a, b) => !(a.r < b.l || b.r < a.l || a.b < b.t || b.b < a.t);
  function placeOverlay() {
    const w = stage.clientWidth, h = stage.clientHeight;
    const active = st.sel >= 0 ? [st.sel] : st.shown.map((s) => s.i);
    const taken = [];
    markers.forEach((m, i) => {
      const front = m.facing > -0.05 && m.inside;
      m.mk.classList.toggle('hidden', !front);
      m.mk.style.transform = `translate(${m.sx.toFixed(1)}px, ${m.sy.toFixed(1)}px)`;
      m.mk.style.opacity = front ? Math.min(1, 0.35 + m.facing * 1.6).toFixed(2) : '0';
      m.mk.tabIndex = front ? 0 : -1;
      m.mk.classList.toggle('on', active.includes(i));
    });
    const order = [...active].sort((a, b) => (a === st.sel ? -1 : b === st.sel ? 1 : 0));
    markers.forEach((m) => m._co = false);
    for (const i of order) {
      const m = markers[i]; if (i !== st.sel && !(m.facing > M.leave && m.inside)) continue;
      const cw = m.co.offsetWidth, ch = m.co.offsetHeight, right = m.sx < w * 0.55;
      let x = right ? m.sx + 30 : m.sx - 30 - cw, y = m.sy - ch / 2;
      x = Math.max(4, Math.min(w - cw - 4, x)); y = Math.max(4, Math.min(h - ch - 4, y));
      // [BRAIN-NOCT] Em palco estreito o clamp lateral jogava o callout sobre o próprio pin (achado C-07 do CRITIQUE):
      // se o retângulo cobre o alvo de 44 px do pin, o callout vai para cima ou para baixo dele.
      if (R({ l: x, t: y, r: x + cw, b: y + ch }, { l: m.sx - 22, t: m.sy - 22, r: m.sx + 22, b: m.sy + 22 })) {
        x = Math.max(4, Math.min(w - cw - 4, m.sx - cw / 2));
        y = m.sy - 30 - ch >= 4 ? m.sy - 30 - ch : Math.min(h - ch - 4, m.sy + 30);
      }
      const box = { l: x, t: y, r: x + cw, b: y + ch };
      if (taken.some((t) => R(t, box))) continue;
      taken.push(box); m._co = true;
      m.co.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
    }
    markers.forEach((m, i) => { m.co.classList.toggle('show', m._co); m.co.classList.toggle('sel', i === st.sel); });
  }

  // ---------- gestos: toque ≠ arraste horizontal ≠ rolagem vertical ----------
  let g = null;
  stage.addEventListener('pointerdown', (e) => {
    if (!e.isPrimary || e.button !== 0) return;
    g = { id: e.pointerId, x0: e.clientX, y0: e.clientY, x: e.clientX, y: e.clientY, type: e.pointerType, active: false };
  });
  stage.addEventListener('pointermove', (e) => {
    if (!g || g.id !== e.pointerId) return;
    const dx = e.clientX - g.x0, dy = e.clientY - g.y0;
    if (!g.active) {
      if (Math.hypot(dx, dy) < M.threshold) return;
      if (Math.abs(dy) > Math.abs(dx) && g.type === 'touch') { g = null; return; }
      g.active = true; g.x = e.clientX; g.y = e.clientY; rot.anim = null; st.paused = true; syncUI();
      stage.setPointerCapture(e.pointerId); stage.classList.add('dragging');
    }
    rot.y += (e.clientX - g.x) * M.dragRadPx;
    if (g.type !== 'touch') rot.x = THREE.MathUtils.clamp(rot.x + (e.clientY - g.y) * M.dragRadPx * 0.6, -0.5, 1.1);
    g.x = e.clientX; g.y = e.clientY; dirty = true;
  });
  const end = () => { if (g?.active) st.settledAt = performance.now(); g = null; stage.classList.remove('dragging'); };
  ['pointerup', 'pointercancel', 'lostpointercapture'].forEach((t) => stage.addEventListener(t, end));
  stage.addEventListener('keydown', (e) => {
    if (e.target !== stage) return;
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); st.paused = true; rot.anim = null; rot.y += e.key === 'ArrowRight' ? 0.2 : -0.2; st.settledAt = performance.now(); syncUI(); }
    else if (e.key === ' ') { e.preventDefault(); togglePause(); }
  });
  // [BRAIN-NOCT] Esc fecha o detalhe de qualquer foco dentro do palco ou do painel.
  for (const el of [stage, panel]) el.addEventListener('keydown', (e) => { if (e.key === 'Escape' && st.sel >= 0) { st.sel = -1; writeFoco(); renderPanel(); syncUI(); } });
  panel.addEventListener('focusin', () => { if (!st.paused) { st.paused = true; syncUI(); } });
  // [BRAIN-NOCT] A11Y-04: um pin com foco não pode girar para o verso (ficaria oculto com o foco nele, WCAG 2.4.7/2.4.11).
  stage.querySelector('[data-markers]').addEventListener('focusin', () => { if (!st.paused) { st.paused = true; syncUI(); } });

  function togglePause() {
    if (st.paused || st.reduced) { st.paused = false; if (st.reduced) { st.reduced = false; save(); } st.sel = -1; st.shown = []; writeFoco(); renderPanel(); }
    else st.paused = true;
    st.settledAt = performance.now(); syncUI();
  }
  const save = () => { try { localStorage.setItem('rc-home-brain', JSON.stringify({ reduced: st.reduced })); } catch {} };
  q('[data-pause]').onclick = togglePause;
  q('[data-reset]').onclick = () => { rot.anim = null; rot.x = HOME.x; rot.y = HOME.y; st.paused = true; st.sel = -1; st.shown = []; st.settledAt = 0; writeFoco(); renderPanel(); syncUI(); };
  q('[data-rm]').onclick = (e) => { e.preventDefault(); st.reduced = !st.reduced; rot.anim = null; save(); syncUI(); };
  new IntersectionObserver(([en]) => { st.inView = en.isIntersecting; }, { threshold: 0.05 }).observe(stage);

  let last = 0;
  function tick(t) {
    requestAnimationFrame(tick);
    const dt = last ? Math.min((t - last) / 1000, 0.05) : 0; last = t;
    if (!st.inView || document.hidden) { last = 0; return; }
    if (rot.anim) {
      rot.anim.t = Math.min(1, rot.anim.t + dt / 0.9); const e = 1 - Math.pow(1 - rot.anim.t, 3);
      rot.x = rot.anim.fx + (rot.anim.x - rot.anim.fx) * e; rot.y = rot.anim.fy + (rot.anim.y - rot.anim.fy) * e;
      if (rot.anim.t >= 1) { rot.anim = null; st.settledAt = t; } dirty = true;
    } else if (!st.paused && !st.reduced && !g?.active && st.sel < 0) { rot.y += dt * M.speed; dirty = true; }
    pivot.rotation.set(rot.x, rot.y, 0); pivot.updateMatrixWorld();
    project(); updateAuto(t, !!g?.active || !!rot.anim); placeOverlay();
    if (dirty) { renderer.render(scene, camera); dirty = false; }
  }

  renderPanel(); syncUI();
  const api = { st, rot, select, markers, togglePause, setRotation: (y, x = HOME.x) => { rot.anim = null; rot.y = y; rot.x = x; dirty = true; } };
  window.__brain = api;
  try {
    // [BRAIN-NOCT] ?nowebgl=1 força o fallback (estado de captura).
    if (new URLSearchParams(location.search).has('nowebgl') || !renderer.getContext()) throw new Error('WebGL indisponível');
    const assets = await loadBrainAssets(o.assetBase);
    brain = createHollowBrain(assets);
    pivot.add(brain.root);
    FX.forEach((f, i) => { const a = brain.anchor(f.dir); markers[i].p = a.p; markers[i].n = a.n; });
    stage.prepend(renderer.domElement); stage.querySelector('.loading')?.remove();
    new ResizeObserver(frame).observe(stage); frame();
    // [BRAIN-NOCT] Mapa: ?foco= abre a função pedida.
    const foco = new URLSearchParams(location.search).get('foco');
    const fi = FX.findIndex((f) => f.id === foco);
    if (variant === 'full' && fi >= 0) { project(); select(fi, true); }
    requestAnimationFrame(tick);
    stage.dataset.status = 'ready'; api.stats = brain.stats;
  } catch (err) {
    console.warn(err.message); stage.classList.add('failed'); stage.dataset.status = 'fallback';
    markers.forEach((m) => m.mk.remove());
    q('[data-pause]').disabled = true; q('[data-reset]').disabled = true;
  }
  return api;
}
