/* =========================================================
   PAINEL CINTIA — Main (tema, navegação, render, interações)
   ========================================================= */

(() => {
  const D = window.CINTIA_DATA;
  if (!D) { console.error('CINTIA_DATA não carregou'); return; }

  // Estado global de filtros
  const STATE = {
    periodo: '30d',
    secretaria: 'all',
    bairro: 'all',
    search: '',
    section: 'overview'
  };

  /* =========================================================
     UTILS
     ========================================================= */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  function safe(fn, name) {
    try { fn(); } catch (e) { console.warn(`[Cintia] erro em ${name}:`, e); }
  }

  function labelStatus(s) {
    return { aberto: 'Aberto', andamento: 'Em andamento', resolvido: 'Resolvido', atrasado: 'Atrasado' }[s] || s;
  }

  function getSecNome(id) {
    const s = D.secretarias.find(x => x.id === id);
    return s ? s.nome : id;
  }

  function getSecColorTag(id) {
    const map = { saude: 'pink', educacao: 'sky', obras: 'amber', seguranca: 'purple', fazenda: 'magenta', social: 'pink', meio: 'green', transp: 'purple' };
    return map[id] || 'purple';
  }

  function avatarHtml(nome, variant) {
    const initials = nome.split(' ').slice(0, 2).map(p => p[0] || '').join('').toUpperCase();
    return `<div class="mini-avatar v${variant}">${initials}</div>`;
  }

  function bairroSlug(b) { return b.toLowerCase().replace(/\s+/g, '-'); }

  /* =========================================================
     TOAST
     ========================================================= */
  function toast(msg, duration = 2400) {
    const t = $('#toast');
    if (!t) return;
    $('#toastMsg').textContent = msg;
    t.classList.add('show');
    clearTimeout(toast._tm);
    toast._tm = setTimeout(() => t.classList.remove('show'), duration);
  }

  /* =========================================================
     TEMA
     ========================================================= */
  const THEME_KEY = 'cintia-theme';

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
    if (window.CINTIA_CHARTS) setTimeout(() => window.CINTIA_CHARTS.reinit(), 60);
  }

  function initTheme() {
    const saved = localStorage.getItem(THEME_KEY) || 'dark';
    applyTheme(saved);
    const tg = $('#themeToggle');
    if (tg) tg.addEventListener('click', () => {
      const cur = document.documentElement.getAttribute('data-theme');
      const next = cur === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      toast(`Tema ${next === 'dark' ? 'escuro' : 'claro'} ativado`);
    });
  }

  /* =========================================================
     NAVEGAÇÃO
     ========================================================= */
  const PAGE_META = {
    overview:    { title: 'Visão Geral',    sub: 'Painel executivo · Atualizado há 2 minutos' },
    demandas:    { title: 'Demandas',       sub: 'Registros de solicitações dos cidadãos' },
    ouvidoria:   { title: 'Ouvidoria',      sub: 'Voz do cidadão · avaliações e NPS' },
    mapa:        { title: 'Mapa de Calor',  sub: 'Densidade de demandas por bairro' },
    secretarias: { title: 'Secretarias',    sub: 'Performance e ranking por área' },
    cintia:      { title: 'CintIA Core',    sub: 'Métricas da agente de IA no WhatsApp' },
    config:      { title: 'Configurações',  sub: 'Preferências do painel' }
  };

  function showSection(name) {
    STATE.section = name;
    $$('.section').forEach(s => s.classList.remove('active'));
    $$('.nav-item').forEach(b => b.classList.remove('active'));

    const sec = $('#section-' + name);
    if (sec) sec.classList.add('active');
    const btn = $(`.nav-item[data-section="${name}"]`);
    if (btn) btn.classList.add('active');

    const meta = PAGE_META[name];
    if (meta) {
      $('#page-title').textContent = meta.title;
      $('#page-sub').textContent = meta.sub;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function initNav() {
    $$('.nav-item[data-section]').forEach(btn => {
      btn.addEventListener('click', () => showSection(btn.dataset.section));
    });
    $$('[data-goto]').forEach(btn => {
      btn.addEventListener('click', () => showSection(btn.dataset.goto));
    });
  }

  /* =========================================================
     FILTROS GLOBAIS — funcionais
     ========================================================= */
  function applyFilters() {
    renderDemandsRecent();
    renderDemandsFull();
  }

  function applyPeriod() {
    renderKPIs();
    if (window.CINTIA_CHARTS && window.CINTIA_CHARTS.updatePeriod) {
      window.CINTIA_CHARTS.updatePeriod(STATE.periodo);
    }
    const sub = $('#page-sub');
    if (sub && STATE.section === 'overview') {
      const map = { '7d': 'Últimos 7 dias', '30d': 'Últimos 30 dias', '90d': 'Últimos 90 dias', '12m': 'Últimos 12 meses' };
      sub.textContent = `Painel executivo · ${map[STATE.periodo] || ''}`;
    }
  }

  function initFilters() {
    // Período
    $$('#periodChips .chip').forEach(c => {
      c.addEventListener('click', () => {
        $$('#periodChips .chip').forEach(x => x.classList.remove('active'));
        c.classList.add('active');
        STATE.periodo = c.dataset.p;
        toast(`Período: ${c.textContent.trim()}`);
        applyPeriod();
        applyFilters();
      });
    });

    // Bairros (popula)
    const selB = $('#filterBairro');
    if (selB) {
      D.bairros.forEach(b => {
        const opt = document.createElement('option');
        opt.value = bairroSlug(b);
        opt.textContent = b;
        selB.appendChild(opt);
      });
      selB.addEventListener('change', e => {
        STATE.bairro = e.target.value;
        applyFilters();
      });
    }

    // Secretaria
    const selS = $('#filterSecretaria');
    if (selS) selS.addEventListener('change', e => {
      STATE.secretaria = e.target.value;
      applyFilters();
    });

    // Search
    const search = $('.search-box input');
    if (search) {
      search.addEventListener('input', e => {
        STATE.search = e.target.value.toLowerCase().trim();
        applyFilters();
      });
    }

    // Export
    const btnExport = $('.btn-export');
    if (btnExport) btnExport.addEventListener('click', exportXLSX);
  }

  function filteredDemandas() {
    return D.demandas.filter(d => {
      if (STATE.secretaria !== 'all' && d.secretaria !== STATE.secretaria) return false;
      if (STATE.bairro !== 'all' && bairroSlug(d.bairro) !== STATE.bairro) return false;
      if (STATE.search) {
        const blob = `${d.cidadao} ${d.assunto} ${d.categoria} ${d.id} ${d.bairro}`.toLowerCase();
        if (!blob.includes(STATE.search)) return false;
      }
      return true;
    });
  }

  /* =========================================================
     EXPORT XLSX (SheetJS) — colunas separadas e formatadas
     ========================================================= */
  function exportXLSX() {
    const list = filteredDemandas();
    if (!list.length) { toast('Nenhuma demanda para exportar'); return; }
    if (typeof XLSX === 'undefined') { toast('Biblioteca XLSX não carregou ainda — tente em 2s'); return; }

    const head = ['Protocolo', 'Cidadão', 'Bairro', 'Assunto', 'Categoria', 'Secretaria', 'Status', 'Prioridade', 'SLA', 'Canal', 'Data', 'Avaliação'];
    const rows = list.map(d => [
      d.id, d.cidadao, d.bairro, d.assunto, d.categoria, getSecNome(d.secretaria),
      labelStatus(d.status), d.prioridade, d.sla, d.canal, d.data, d.avaliacao || ''
    ]);

    const ws = XLSX.utils.aoa_to_sheet([head, ...rows]);

    // Larguras das colunas
    ws['!cols'] = [
      { wch: 12 }, { wch: 26 }, { wch: 20 }, { wch: 48 }, { wch: 22 },
      { wch: 22 }, { wch: 16 }, { wch: 12 }, { wch: 22 }, { wch: 12 }, { wch: 14 }, { wch: 10 }
    ];

    // Linha 1 (cabeçalho) com altura maior
    ws['!rows'] = [{ hpx: 28 }];

    // Aplicar negrito no cabeçalho via cell styles (SheetJS community não estiliza, mas mantemos a estrutura)
    head.forEach((_, idx) => {
      const cell = ws[XLSX.utils.encode_cell({ r: 0, c: idx })];
      if (cell) cell.s = { font: { bold: true } };
    });

    // Worksheet 2 — KPIs do período atual
    const k = D.kpisByPeriod[STATE.periodo] || D.kpis;
    const kpiData = [
      ['Indicador', 'Valor', 'Variação (%)'],
      ['Cidadãos atendidos', k.cidadaosAtendidos.valor, k.cidadaosAtendidos.deltaPct],
      ['Demandas resolvidas (taxa %)', k.demandasResolvidas.taxa, k.demandasResolvidas.deltaPct],
      ['NPS médio', k.npsMedio.valor, k.npsMedio.deltaPct],
      ['Tempo médio de resposta', k.tempoMedio.valor, k.tempoMedio.deltaPct],
      ['Resolução autônoma (%)', k.resolucaoAutonoma.valor, k.resolucaoAutonoma.deltaPct],
      ['Demandas em atraso', k.demandasAtraso.valor, k.demandasAtraso.deltaPct],
      ['Conversas hoje', k.conversasDia.valor, k.conversasDia.deltaPct],
      ['Satisfação geral', k.satisfacao.valor, k.satisfacao.deltaPct]
    ];
    const wsKpi = XLSX.utils.aoa_to_sheet(kpiData);
    wsKpi['!cols'] = [{ wch: 32 }, { wch: 18 }, { wch: 16 }];

    // Worksheet 3 — Performance secretarias
    const secData = [
      ['Secretaria', 'Total recebidas', 'Resolvidas', 'Taxa (%)'],
      ...D.demandasPorSecretaria.map(s => [s.nome, s.total, s.resolvidas, s.taxa])
    ];
    const wsSec = XLSX.utils.aoa_to_sheet(secData);
    wsSec['!cols'] = [{ wch: 24 }, { wch: 16 }, { wch: 14 }, { wch: 12 }];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Demandas');
    XLSX.utils.book_append_sheet(wb, wsKpi, 'KPIs');
    XLSX.utils.book_append_sheet(wb, wsSec, 'Secretarias');

    const filename = `painel-cintia-${STATE.periodo}-${new Date().toISOString().slice(0, 10)}.xlsx`;
    XLSX.writeFile(wb, filename);
    toast(`${list.length} demandas exportadas em XLSX (3 abas)`);
  }

  /* =========================================================
     KPIs principais
     ========================================================= */
  function renderKPIs() {
    const grid = $('#kpiGrid');
    if (!grid) return;

    const k = (D.kpisByPeriod && D.kpisByPeriod[STATE.periodo]) || D.kpis;

    const items = [
      { label: 'Cidadãos atendidos', value: k.cidadaosAtendidos.valor.toLocaleString('pt-BR'), trend: k.cidadaosAtendidos.deltaPct, icon: 'purple', goto: 'cintia',
        svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>' },
      { label: 'Demandas resolvidas', value: k.demandasResolvidas.taxa.toFixed(1), suffix: '%', trend: k.demandasResolvidas.deltaPct, icon: 'pink', goto: 'demandas',
        svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>' },
      { label: 'NPS médio', value: '+' + k.npsMedio.valor, trend: k.npsMedio.deltaPct, icon: 'magenta', goto: 'ouvidoria',
        svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>' },
      { label: 'Tempo médio resposta', value: k.tempoMedio.valor, trend: k.tempoMedio.deltaPct, icon: 'amber', goto: 'cintia',
        svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>' },
      { label: 'Resolução autônoma', value: k.resolucaoAutonoma.valor.toFixed(1), suffix: '%', trend: k.resolucaoAutonoma.deltaPct, icon: 'magenta', goto: 'cintia',
        svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></svg>' },
      { label: 'Demandas em atraso', value: k.demandasAtraso.valor, trend: k.demandasAtraso.deltaPct, icon: 'coral', goto: 'demandas',
        svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>' },
      { label: 'Conversas hoje', value: k.conversasDia.valor.toLocaleString('pt-BR'), trend: k.conversasDia.deltaPct, icon: 'sky', goto: 'cintia',
        svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>' },
      { label: 'Satisfação geral', value: k.satisfacao.valor.toFixed(1), suffix: ' / 5', trend: k.satisfacao.deltaPct, icon: 'amber', goto: 'ouvidoria',
        svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>' }
    ];

    grid.innerHTML = items.map((it, idx) => {
      const trendClass = it.trend > 0 ? 'up' : (it.trend < 0 ? 'down' : 'neutral');
      const arrow = it.trend >= 0
        ? '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 14l5-5 5 5z"/></svg>'
        : '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17 10l-5 5-5-5z"/></svg>';
      const gradClass = (idx === 1 || idx === 2) ? 'grad' : '';
      return `
        <div class="kpi-card" data-goto="${it.goto}">
          <div class="kpi-header">
            <div class="kpi-icon ${it.icon}">${it.svg}</div>
            <div class="kpi-label">${it.label}</div>
          </div>
          <div class="kpi-value ${gradClass}">${it.value}${it.suffix ? `<small>${it.suffix}</small>` : ''}</div>
          <span class="kpi-trend ${trendClass}">
            ${arrow}
            ${Math.abs(it.trend).toFixed(1)}%
            <span class="lbl">vs. período anterior</span>
          </span>
        </div>
      `;
    }).join('');

    // Cards clicáveis
    $$('#kpiGrid .kpi-card').forEach(card => {
      card.addEventListener('click', () => {
        const goto = card.dataset.goto;
        if (goto) showSection(goto);
      });
    });
  }

  /* =========================================================
     INSIGHT rotativo
     ========================================================= */
  function renderInsight() {
    const el = $('#insightText');
    if (!el) return;
    let idx = 0;
    const tick = () => {
      el.style.opacity = 0;
      setTimeout(() => {
        el.innerHTML = D.insights[idx % D.insights.length];
        el.style.transition = 'opacity 0.4s ease';
        el.style.opacity = 1;
        idx++;
      }, 200);
    };
    tick();
    setInterval(tick, 9000);
  }

  /* =========================================================
     DEMANDAS — tabelas
     ========================================================= */
  function rowHtml(d, withActions = false) {
    return `
      <tr data-id="${d.id}">
        ${withActions ? `<td style="font-family: var(--font-mono); font-weight: 600; color: var(--text-muted); font-size: 12px;">${d.id}</td>` : ''}
        <td>
          <div class="cidadao-cell">
            ${avatarHtml(d.cidadao, d.avatarVariant)}
            <div>
              <div class="cidadao-nome">${d.cidadao}</div>
              <div class="cidadao-bairro">${d.bairro}</div>
            </div>
          </div>
        </td>
        <td style="max-width: 280px;">
          <div style="font-weight:500; color:var(--text-primary);">${d.assunto}</div>
          ${!withActions ? `<div style="font-size:11px; color:var(--text-muted); margin-top:2px;">${d.id} · ${d.canal}</div>` : ''}
        </td>
        ${withActions ? `<td><span class="tag">${d.categoria}</span></td>` : ''}
        <td><span class="tag ${getSecColorTag(d.secretaria)}">${getSecNome(d.secretaria)}</span></td>
        <td><span class="status-pill ${d.status}">${labelStatus(d.status)}</span></td>
        ${withActions ? `<td><span class="priority-tag ${d.prioridade}">${d.prioridade}</span></td>` : ''}
        <td><span class="sla-cell ${d.slaStatus}">${d.sla}</span></td>
        ${withActions ? `<td>
          <div class="row-actions">
            <button class="row-action-btn" title="Ver detalhes" data-action="view"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg></button>
            <button class="row-action-btn" title="Atribuir"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg></button>
          </div>
        </td>` : ''}
      </tr>
    `;
  }

  function emptyRow(cols, msg) {
    return `<tr><td colspan="${cols}"><div class="empty-state">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
      ${msg}
    </div></td></tr>`;
  }

  function renderDemandsRecent() {
    const tbody = $('#recentDemandsTable tbody');
    if (!tbody) return;
    const list = filteredDemandas().slice(0, 6);
    tbody.innerHTML = list.length
      ? list.map(d => rowHtml(d, false)).join('')
      : emptyRow(5, 'Nenhuma demanda corresponde aos filtros atuais.');
    bindRowClicks(tbody);
  }

  function renderDemandsFull() {
    const tbody = $('#fullDemandsTable tbody');
    if (!tbody) return;
    const list = filteredDemandas();
    tbody.innerHTML = list.length
      ? list.map(d => rowHtml(d, true)).join('')
      : emptyRow(9, 'Nenhuma demanda corresponde aos filtros atuais.');
    bindRowClicks(tbody);
  }

  function bindRowClicks(tbody) {
    $$('tr[data-id]', tbody).forEach(tr => {
      tr.style.cursor = 'pointer';
      tr.addEventListener('click', e => {
        if (e.target.closest('.row-action-btn')) return;
        openDemandModal(tr.dataset.id);
      });
    });
    $$('button[data-action="view"]', tbody).forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        const tr = btn.closest('tr');
        if (tr) openDemandModal(tr.dataset.id);
      });
    });
  }

  /* =========================================================
     MODAL detalhe demanda
     ========================================================= */
  function openDemandModal(id) {
    const d = D.demandas.find(x => x.id === id);
    if (!d) return;
    const body = $('#modalBody');
    if (!body) return;

    body.innerHTML = `
      <div class="modal-head">
        ${avatarHtml(d.cidadao, d.avatarVariant).replace('mini-avatar', 'mini-avatar').replace(/width:32px;height:32px/, 'width:48px;height:48px')}
        <div>
          <div class="modal-title">${d.cidadao}</div>
          <div class="modal-id">${d.id} · ${d.canal} · ${d.bairro}</div>
        </div>
      </div>
      <div class="modal-assunto">${d.assunto}</div>
      <div class="modal-row"><span class="lbl">Categoria</span><span class="val">${d.categoria}</span></div>
      <div class="modal-row"><span class="lbl">Secretaria</span><span class="val"><span class="tag ${getSecColorTag(d.secretaria)}">${getSecNome(d.secretaria)}</span></span></div>
      <div class="modal-row"><span class="lbl">Status</span><span class="val"><span class="status-pill ${d.status}">${labelStatus(d.status)}</span></span></div>
      <div class="modal-row"><span class="lbl">Prioridade</span><span class="val"><span class="priority-tag ${d.prioridade}">${d.prioridade}</span></span></div>
      <div class="modal-row"><span class="lbl">SLA</span><span class="val sla-cell ${d.slaStatus}">${d.sla}</span></div>
      <div class="modal-row"><span class="lbl">Data</span><span class="val" style="font-family: var(--font-mono); font-size: 12.5px;">${d.data}</span></div>
      ${d.avaliacao ? `<div class="modal-row"><span class="lbl">Avaliação</span><span class="val">${'★'.repeat(d.avaliacao)}${'☆'.repeat(5 - d.avaliacao)}</span></div>` : ''}
      <div class="modal-actions">
        <button class="modal-btn-secondary" data-action="close-modal">Fechar</button>
        <button class="btn-export" data-action="resolve">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          Marcar como resolvida
        </button>
      </div>
    `;

    $('#modalBackdrop').classList.add('open');

    $('[data-action="close-modal"]', body).addEventListener('click', closeModal);
    $('[data-action="resolve"]', body).addEventListener('click', () => {
      closeModal();
      toast(`Demanda ${d.id} marcada como resolvida`);
    });
  }

  function closeModal() {
    const m = $('#modalBackdrop');
    if (m) m.classList.remove('open');
  }

  function initModal() {
    const backdrop = $('#modalBackdrop');
    const close = $('#modalClose');
    if (close) close.addEventListener('click', closeModal);
    if (backdrop) backdrop.addEventListener('click', e => { if (e.target === backdrop) closeModal(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
  }

  /* =========================================================
     ALERTAS
     ========================================================= */
  function renderAlertas() {
    const el = $('#alertList');
    if (!el) return;
    const iconMap = {
      danger: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
      warn:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>',
      info:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>',
      success:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>'
    };
    el.innerHTML = D.alertas.map(a => `
      <div class="alert-row ${a.tipo}">
        <div class="alert-icon">${iconMap[a.tipo] || iconMap.info}</div>
        <div class="alert-body">
          <div class="alert-title">${a.titulo}</div>
          <div class="alert-desc">${a.desc}</div>
        </div>
        <div class="alert-time">${a.time}</div>
      </div>
    `).join('');
  }

  /* =========================================================
     AVALIAÇÕES
     ========================================================= */
  function renderRatingDistribution() {
    const el = $('#ratingDistribution');
    if (!el) return;
    el.innerHTML = D.distribuicaoAvaliacoes.map(r => `
      <div class="rating-bar-row">
        <div class="rate-label">
          ${r.estrelas}
          <svg class="star-icon filled" viewBox="0 0 24 24" fill="currentColor"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
        </div>
        <div class="rating-bar"><div class="rating-bar-fill" style="width: ${r.pct}%"></div></div>
        <span class="rating-bar-count">${r.count.toLocaleString('pt-BR')}</span>
      </div>
    `).join('');
  }

  /* =========================================================
     WORD CLOUD
     ========================================================= */
  function renderWordCloud() {
    const el = $('#wordCloud');
    if (!el) return;
    const colors = ['#e8247a', '#5f2bdb', '#b020c0', '#a78bfa', '#FF007B', '#6600FF', '#38BDF8'];
    el.innerHTML = D.topPalavras.map((p, i) => {
      const size = 14 + (p.peso / 100) * 30;
      const opacity = 0.55 + (p.peso / 100) * 0.45;
      const color = colors[i % colors.length];
      return `<span style="font-size:${size}px; color:${color}; opacity:${opacity}; font-weight:${p.peso > 70 ? 800 : 600};">${p.palavra}</span>`;
    }).join('');
  }

  /* =========================================================
     HEATMAP
     ========================================================= */
  function renderHeatmap() {
    const ptsG = $('#heatmapPoints');
    const lblG = $('#heatmapLabels');
    const list = $('#heatmapList');
    if (!ptsG || !lblG || !list) return;

    const W = 800, H = 400;
    const max = Math.max(...D.heatmapBairros.map(b => b.total));

    let ptsHtml = '', lblHtml = '';
    D.heatmapBairros.forEach(b => {
      const cx = b.x * W, cy = b.y * H, r = b.raio;
      const intensity = b.total / max;
      const grad = intensity > 0.7 ? 'heatHot' : intensity > 0.4 ? 'heatMed' : 'heatLow';
      const dotColor = intensity > 0.7 ? '#e8247a' : intensity > 0.4 ? '#b020c0' : '#5f2bdb';
      ptsHtml += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#${grad})"/>`;
      ptsHtml += `<circle cx="${cx}" cy="${cy}" r="5" fill="${dotColor}" stroke="rgba(255,255,255,0.9)" stroke-width="2"/>`;
      lblHtml += `<text x="${cx}" y="${cy - r - 8}" fill="rgba(255,255,255,0.9)" font-family="Nunito, sans-serif" font-size="12" font-weight="700" text-anchor="middle">${b.nome}</text>`;
      lblHtml += `<text x="${cx}" y="${cy - r + 6}" fill="rgba(255,255,255,0.55)" font-family="DM Mono, monospace" font-size="10" text-anchor="middle">${b.total}</text>`;
    });
    ptsG.innerHTML = ptsHtml;
    lblG.innerHTML = lblHtml;

    list.innerHTML = D.heatmapBairros.slice(0, 8).map((b, i) => `
      <div class="heatmap-item" data-bairro="${bairroSlug(b.nome)}">
        <div>
          <div class="heatmap-item-name">${i + 1}. ${b.nome}</div>
          <div class="heatmap-item-meta">Principal: ${b.principal}</div>
        </div>
        <div class="heatmap-item-count">${b.total.toLocaleString('pt-BR')}</div>
      </div>
    `).join('');

    // Clique no bairro filtra demandas e vai pra seção
    $$('.heatmap-item').forEach(it => {
      it.style.cursor = 'pointer';
      it.addEventListener('click', () => {
        const slug = it.dataset.bairro;
        const sel = $('#filterBairro');
        if (sel) sel.value = slug;
        STATE.bairro = slug;
        applyFilters();
        showSection('demandas');
        toast(`Filtrando demandas de ${it.querySelector('.heatmap-item-name').textContent.replace(/^\d+\.\s*/, '')}`);
      });
    });
  }

  /* =========================================================
     SECRETARIAS
     ========================================================= */
  function renderSecretariaList() {
    const el = $('#secretariaList');
    if (!el) return;
    const sorted = [...D.demandasPorSecretaria].sort((a, b) => b.taxa - a.taxa);
    el.innerHTML = sorted.map((s, i) => {
      const status = s.taxa > 80 ? '' : s.taxa > 70 ? 'warn' : 'danger';
      return `
        <div class="secretaria-row" data-sec="${s.id}">
          <div class="secretaria-rank">#${i + 1}</div>
          <div class="secretaria-info">
            <div class="secretaria-nome">${s.nome}</div>
            <div class="secretaria-meta">${s.resolvidas.toLocaleString('pt-BR')} de ${s.total.toLocaleString('pt-BR')} resolvidas</div>
          </div>
          <div class="secretaria-progress"><div class="secretaria-progress-fill ${status}" style="width: ${s.taxa}%"></div></div>
          <div class="secretaria-pct">${s.taxa.toFixed(1)}%</div>
        </div>
      `;
    }).join('');

    $$('.secretaria-row').forEach(row => {
      row.style.cursor = 'pointer';
      row.addEventListener('click', () => {
        const sec = row.dataset.sec;
        const sel = $('#filterSecretaria');
        if (sel) sel.value = sec;
        STATE.secretaria = sec;
        applyFilters();
        showSection('demandas');
        toast(`Filtrando demandas: ${getSecNome(sec)}`);
      });
    });
  }

  /* =========================================================
     CHAT preview
     ========================================================= */
  function renderChat() {
    const el = $('#chatPreview');
    if (!el) return;
    el.innerHTML = D.chatCintia.map(m => `
      <div class="chat-msg ${m.from}">
        ${m.text}
        <div class="chat-time">${m.time}</div>
      </div>
    `).join('');
  }

  /* =========================================================
     INIT
     ========================================================= */
  function init() {
    safe(initTheme, 'theme');
    safe(initNav, 'nav');
    safe(initFilters, 'filters');
    safe(initModal, 'modal');

    safe(renderKPIs, 'kpis');
    safe(renderInsight, 'insight');
    safe(renderDemandsRecent, 'demands-recent');
    safe(renderDemandsFull, 'demands-full');
    safe(renderAlertas, 'alertas');
    safe(renderRatingDistribution, 'rating');
    safe(renderWordCloud, 'wordcloud');
    safe(renderHeatmap, 'heatmap');
    safe(renderSecretariaList, 'secretarias');
    safe(renderChat, 'chat');

    if (window.CINTIA_CHARTS) safe(() => window.CINTIA_CHARTS.init(), 'charts-init');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
