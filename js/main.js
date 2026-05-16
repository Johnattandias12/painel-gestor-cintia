/* =========================================================
   PAINEL CINTIA — Main (tema, navegação, render)
   ========================================================= */

(() => {
  const D = window.CINTIA_DATA;

  /* =========================================================
     TEMA: dark padrão, persiste em localStorage
     ========================================================= */
  const THEME_KEY = 'cintia-theme';

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
    // Re-render charts com cores novas
    if (window.CINTIA_CHARTS) {
      setTimeout(() => window.CINTIA_CHARTS.reinit(), 50);
    }
  }

  function initTheme() {
    const saved = localStorage.getItem(THEME_KEY) || 'dark';
    applyTheme(saved);
    const toggle = document.getElementById('themeToggle');
    if (toggle) {
      toggle.addEventListener('click', () => {
        const cur = document.documentElement.getAttribute('data-theme');
        applyTheme(cur === 'dark' ? 'light' : 'dark');
      });
    }
  }

  /* =========================================================
     NAVEGAÇÃO ENTRE SEÇÕES
     ========================================================= */
  const PAGE_META = {
    overview:    { title: 'Visão Geral',    sub: 'Painel executivo · Atualizado há 2 minutos' },
    demandas:    { title: 'Demandas',       sub: 'Registros de solicitações dos cidadãos' },
    ouvidoria:   { title: 'Ouvidoria',      sub: 'Voz do cidadão · avaliações e NPS' },
    mapa:        { title: 'Mapa de Calor',  sub: 'Densidade de demandas por bairro' },
    secretarias: { title: 'Secretarias',    sub: 'Performance e ranking por área' },
    cintia:      { title: 'Cintia AI',      sub: 'Métricas da agente de IA no WhatsApp' },
    config:      { title: 'Configurações',  sub: 'Preferências do painel' }
  };

  function showSection(name) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));

    const sec = document.getElementById('section-' + name);
    if (sec) sec.classList.add('active');

    const navBtn = document.querySelector(`.nav-item[data-section="${name}"]`);
    if (navBtn) navBtn.classList.add('active');

    const meta = PAGE_META[name];
    if (meta) {
      document.getElementById('page-title').textContent = meta.title;
      document.getElementById('page-sub').textContent = meta.sub;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function initNav() {
    document.querySelectorAll('.nav-item[data-section]').forEach(btn => {
      btn.addEventListener('click', () => showSection(btn.dataset.section));
    });
    document.querySelectorAll('[data-goto]').forEach(btn => {
      btn.addEventListener('click', () => showSection(btn.dataset.goto));
    });
  }

  /* =========================================================
     FILTROS GLOBAIS
     ========================================================= */
  function initFilters() {
    // Período (chips)
    document.querySelectorAll('#periodChips .chip').forEach(c => {
      c.addEventListener('click', () => {
        document.querySelectorAll('#periodChips .chip').forEach(x => x.classList.remove('active'));
        c.classList.add('active');
      });
    });

    // Bairros (popula select)
    const sel = document.getElementById('filterBairro');
    if (sel) {
      D.bairros.forEach(b => {
        const opt = document.createElement('option');
        opt.value = b.toLowerCase().replace(/\s+/g, '-');
        opt.textContent = b;
        sel.appendChild(opt);
      });
    }
  }

  /* =========================================================
     RENDER: KPIs principais
     ========================================================= */
  function renderKPIs() {
    const grid = document.getElementById('kpiGrid');
    if (!grid) return;

    const items = [
      {
        label: 'Cidadãos atendidos',
        value: D.kpis.cidadaosAtendidos.valor.toLocaleString('pt-BR'),
        trend: D.kpis.cidadaosAtendidos.deltaPct,
        spark: D.kpis.cidadaosAtendidos.spark,
        sparkColor: '#5f2bdb',
        icon: 'purple',
        svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>'
      },
      {
        label: 'Demandas resolvidas',
        value: D.kpis.demandasResolvidas.taxa.toFixed(1),
        suffix: '%',
        trend: D.kpis.demandasResolvidas.deltaPct,
        spark: D.kpis.demandasResolvidas.spark,
        sparkColor: '#e8247a',
        icon: 'pink',
        svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>'
      },
      {
        label: 'NPS médio',
        value: '+' + D.kpis.npsMedio.valor,
        trend: D.kpis.npsMedio.deltaPct,
        spark: D.kpis.npsMedio.spark,
        sparkColor: '#a78bfa',
        icon: 'magenta',
        svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>'
      },
      {
        label: 'Tempo médio resposta',
        value: D.kpis.tempoMedio.valor,
        trend: D.kpis.tempoMedio.deltaPct,
        spark: D.kpis.tempoMedio.spark,
        sparkColor: '#F59E0B',
        icon: 'amber',
        svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>'
      },
      {
        label: 'Resolução autônoma',
        value: D.kpis.resolucaoAutonoma.valor.toFixed(1),
        suffix: '%',
        trend: D.kpis.resolucaoAutonoma.deltaPct,
        spark: D.kpis.resolucaoAutonoma.spark,
        sparkColor: '#b020c0',
        icon: 'magenta',
        svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></svg>'
      },
      {
        label: 'Demandas em atraso',
        value: D.kpis.demandasAtraso.valor,
        trend: D.kpis.demandasAtraso.deltaPct,
        spark: D.kpis.demandasAtraso.spark,
        sparkColor: '#FF6B6B',
        icon: 'coral',
        svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>'
      },
      {
        label: 'Conversas hoje',
        value: D.kpis.conversasDia.valor.toLocaleString('pt-BR'),
        trend: D.kpis.conversasDia.deltaPct,
        spark: D.kpis.conversasDia.spark,
        sparkColor: '#38BDF8',
        icon: 'sky',
        svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>'
      },
      {
        label: 'Satisfação geral',
        value: D.kpis.satisfacao.valor.toFixed(1),
        suffix: ' / 5',
        trend: D.kpis.satisfacao.deltaPct,
        spark: D.kpis.satisfacao.spark,
        sparkColor: '#F59E0B',
        icon: 'amber',
        svg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>'
      }
    ];

    grid.innerHTML = items.map((it, idx) => {
      const trendClass = it.trend > 0 ? 'up' : (it.trend < 0 ? 'down' : 'neutral');
      const arrow = it.trend >= 0
        ? '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 14l5-5 5 5z"/></svg>'
        : '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17 10l-5 5-5-5z"/></svg>';
      return `
        <div class="kpi-card">
          <div class="kpi-header">
            <div class="kpi-icon ${it.icon}">${it.svg}</div>
            <div class="kpi-label">${it.label}</div>
          </div>
          <div class="kpi-value">${it.value}${it.suffix ? `<small>${it.suffix}</small>` : ''}</div>
          <div class="kpi-trend ${trendClass}">
            ${arrow}
            ${Math.abs(it.trend).toFixed(1)}%
            <span class="lbl">vs. período anterior</span>
          </div>
          <canvas class="kpi-spark" id="spark-${idx}"></canvas>
        </div>
      `;
    }).join('');

    // Sparklines depois do paint
    setTimeout(() => {
      items.forEach((it, idx) => {
        if (window.CINTIA_CHARTS) {
          window.CINTIA_CHARTS.buildSparkline('spark-' + idx, it.spark, it.sparkColor);
        }
      });
    }, 50);
  }

  /* =========================================================
     RENDER: Insight da IA (rotativo)
     ========================================================= */
  function renderInsight() {
    const el = document.getElementById('insightText');
    if (!el) return;
    let idx = 0;
    const updateInsight = () => {
      el.innerHTML = D.insights[idx % D.insights.length];
      idx++;
    };
    updateInsight();
    setInterval(updateInsight, 8000);
  }

  /* =========================================================
     RENDER: Demandas (tabela)
     ========================================================= */
  function getSecNome(id) {
    const s = D.secretarias.find(x => x.id === id);
    return s ? s.nome : id;
  }

  function getSecColorTag(id) {
    const map = { saude: 'pink', educacao: 'sky', obras: 'amber', seguranca: 'purple', fazenda: 'magenta', social: 'pink', meio: 'green', transp: 'purple' };
    return map[id] || 'purple';
  }

  function avatarHtml(nome, variant) {
    const initials = nome.split(' ').slice(0, 2).map(p => p[0]).join('').toUpperCase();
    return `<div class="mini-avatar v${variant}">${initials}</div>`;
  }

  function renderDemandsRecent() {
    const tbody = document.querySelector('#recentDemandsTable tbody');
    if (!tbody) return;
    const recent = D.demandas.slice(0, 6);
    tbody.innerHTML = recent.map(d => `
      <tr>
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
          <div style="font-size:11px; color:var(--text-muted); margin-top:2px;">${d.id} · ${d.canal}</div>
        </td>
        <td><span class="tag ${getSecColorTag(d.secretaria)}">${getSecNome(d.secretaria)}</span></td>
        <td><span class="status-pill ${d.status}">${labelStatus(d.status)}</span></td>
        <td><span class="sla-cell ${d.slaStatus}">${d.sla}</span></td>
      </tr>
    `).join('');
  }

  function labelStatus(s) {
    return { aberto: 'Aberto', andamento: 'Em andamento', resolvido: 'Resolvido', atrasado: 'Atrasado' }[s] || s;
  }

  function renderDemandsFull() {
    const tbody = document.querySelector('#fullDemandsTable tbody');
    if (!tbody) return;
    tbody.innerHTML = D.demandas.map(d => `
      <tr>
        <td style="font-family: var(--font-mono); font-weight: 600; color: var(--text-muted); font-size: 12px;">${d.id}</td>
        <td>
          <div class="cidadao-cell">
            ${avatarHtml(d.cidadao, d.avatarVariant)}
            <div>
              <div class="cidadao-nome">${d.cidadao}</div>
              <div class="cidadao-bairro">${d.bairro}</div>
            </div>
          </div>
        </td>
        <td style="max-width: 280px;">${d.assunto}</td>
        <td><span class="tag">${d.categoria}</span></td>
        <td><span class="tag ${getSecColorTag(d.secretaria)}">${getSecNome(d.secretaria)}</span></td>
        <td><span class="status-pill ${d.status}">${labelStatus(d.status)}</span></td>
        <td><span class="priority-tag ${d.prioridade}">${d.prioridade}</span></td>
        <td><span class="sla-cell ${d.slaStatus}">${d.sla}</span></td>
        <td>
          <div class="row-actions">
            <button class="row-action-btn" title="Ver"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg></button>
            <button class="row-action-btn" title="Atribuir"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg></button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  /* =========================================================
     RENDER: Alertas
     ========================================================= */
  function renderAlertas() {
    const el = document.getElementById('alertList');
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
     RENDER: Distribuição de avaliações
     ========================================================= */
  function renderRatingDistribution() {
    const el = document.getElementById('ratingDistribution');
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
     RENDER: Word cloud (palavras citadas)
     ========================================================= */
  function renderWordCloud() {
    const el = document.getElementById('wordCloud');
    if (!el) return;
    const colors = ['#e8247a', '#5f2bdb', '#b020c0', '#a78bfa', '#FF007B', '#6600FF', '#38BDF8'];
    el.innerHTML = D.topPalavras.map((p, i) => {
      const size = 14 + (p.peso / 100) * 28; // 14 a 42px
      const opacity = 0.5 + (p.peso / 100) * 0.5;
      const color = colors[i % colors.length];
      return `<span style="font-size:${size}px; color:${color}; opacity:${opacity}; font-weight:${p.peso > 70 ? 700 : 500}; padding: 4px 10px; transition: transform 0.2s; cursor: default;" onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'">${p.palavra}</span>`;
    }).join('');
  }

  /* =========================================================
     RENDER: Heatmap (SVG + lista)
     ========================================================= */
  function renderHeatmap() {
    const ptsG = document.getElementById('heatmapPoints');
    const lblG = document.getElementById('heatmapLabels');
    const list = document.getElementById('heatmapList');
    if (!ptsG || !list) return;

    const W = 800, H = 400;
    const max = Math.max(...D.heatmapBairros.map(b => b.total));

    let ptsHtml = '';
    let lblHtml = '';
    D.heatmapBairros.forEach(b => {
      const cx = b.x * W;
      const cy = b.y * H;
      const r = b.raio;
      const intensity = b.total / max;
      const grad = intensity > 0.7 ? 'heatHot' : intensity > 0.4 ? 'heatMed' : 'heatLow';
      ptsHtml += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#${grad})"/>`;
      ptsHtml += `<circle cx="${cx}" cy="${cy}" r="4" fill="${intensity > 0.7 ? '#FF6B6B' : intensity > 0.4 ? '#F59E0B' : '#38BDF8'}" stroke="rgba(255,255,255,0.9)" stroke-width="2"/>`;
      lblHtml += `<text x="${cx}" y="${cy - r - 6}" fill="rgba(255,255,255,0.85)" font-family="Inter, sans-serif" font-size="11" font-weight="600" text-anchor="middle">${b.nome}</text>`;
      lblHtml += `<text x="${cx}" y="${cy - r + 8}" fill="rgba(255,255,255,0.5)" font-family="JetBrains Mono, monospace" font-size="10" text-anchor="middle">${b.total}</text>`;
    });
    ptsG.innerHTML = ptsHtml;
    lblG.innerHTML = lblHtml;

    list.innerHTML = D.heatmapBairros.slice(0, 8).map((b, i) => `
      <div class="heatmap-item">
        <div>
          <div class="heatmap-item-name">${i + 1}. ${b.nome}</div>
          <div class="heatmap-item-meta">Principal: ${b.principal}</div>
        </div>
        <div class="heatmap-item-count">${b.total.toLocaleString('pt-BR')}</div>
      </div>
    `).join('');
  }

  /* =========================================================
     RENDER: Lista de Secretarias (ranking)
     ========================================================= */
  function renderSecretariaList() {
    const el = document.getElementById('secretariaList');
    if (!el) return;
    const sorted = [...D.demandasPorSecretaria].sort((a, b) => b.taxa - a.taxa);
    el.innerHTML = sorted.map((s, i) => {
      const status = s.taxa > 80 ? '' : s.taxa > 70 ? 'warn' : 'danger';
      return `
        <div class="secretaria-row">
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
  }

  /* =========================================================
     RENDER: Chat preview (Cintia)
     ========================================================= */
  function renderChat() {
    const el = document.getElementById('chatPreview');
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
    initTheme();
    initNav();
    initFilters();

    renderKPIs();
    renderInsight();
    renderDemandsRecent();
    renderDemandsFull();
    renderAlertas();
    renderRatingDistribution();
    renderWordCloud();
    renderHeatmap();
    renderSecretariaList();
    renderChat();

    if (window.CINTIA_CHARTS) window.CINTIA_CHARTS.init();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
