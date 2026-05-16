/* =========================================================
   PAINEL CINTIA — Charts (Chart.js) com paleta brand
   ========================================================= */

window.CINTIA_CHARTS = (() => {
  const charts = {};
  let initialized = false;

  // CintIA Brand
  const BRAND = {
    P: '#5f2bdb',    // purple
    M: '#b020c0',    // magenta
    K: '#e8247a',    // pink
    B: '#1a0ecc',    // deep blue
    lav: '#a78bfa',  // lavender
    purpleDeep: '#6600FF',
    pinkHot: '#FF007B'
  };

  const ACCENT = {
    blue: '#38BDF8',
    green: '#25D366',
    emerald: '#10B981',
    amber: '#F59E0B',
    coral: '#FF6B6B'
  };

  function cssVar(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }

  function commonOpts() {
    const text = cssVar('--text-secondary') || 'rgba(255,255,255,0.6)';
    const grid = cssVar('--chart-grid') || 'rgba(255,255,255,0.05)';
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: { color: text, font: { family: 'Nunito', size: 12, weight: '600' }, usePointStyle: true, padding: 16, boxWidth: 8 }
        },
        tooltip: {
          backgroundColor: cssVar('--bg-elevated') || '#050507',
          titleColor: cssVar('--text-primary') || '#FFF',
          bodyColor: cssVar('--text-secondary') || 'rgba(255,255,255,0.7)',
          borderColor: cssVar('--border-strong') || 'rgba(255,255,255,0.12)',
          borderWidth: 1,
          padding: 14,
          cornerRadius: 12,
          displayColors: true,
          boxPadding: 6,
          titleFont: { family: 'Nunito', size: 13, weight: '700' },
          bodyFont: { family: 'DM Mono', size: 12, weight: '500' }
        }
      },
      scales: {
        x: { ticks: { color: text, font: { family: 'Nunito', size: 10, weight: '600' } }, grid: { color: grid, drawBorder: false } },
        y: { ticks: { color: text, font: { family: 'DM Mono', size: 10 } }, grid: { color: grid, drawBorder: false }, beginAtZero: true }
      }
    };
  }

  function gradient(ctx, h, stops) {
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    stops.forEach(([off, col]) => grad.addColorStop(off, col));
    return grad;
  }

  // Período corrente (controla qual série temporal usar)
  let currentPeriod = '30d';

  function getSerie() {
    return (CINTIA_DATA.seriesByPeriod && CINTIA_DATA.seriesByPeriod[currentPeriod]) || CINTIA_DATA.atendimentosPorDia;
  }

  // --------- Linha duplo: atendimentos CintIA vs Humano ---------
  function buildAtendimentos() {
    const d = getSerie();
    const el = document.getElementById('chartAtendimentos');
    if (!el) return;
    const ctx = el.getContext('2d');

    const grad1 = gradient(ctx, 300, [[0, 'rgba(232,36,122,0.40)'], [0.5, 'rgba(95,43,219,0.20)'], [1, 'rgba(95,43,219,0)']]);
    const grad2 = gradient(ctx, 300, [[0, 'rgba(56,189,248,0.25)'], [1, 'rgba(56,189,248,0)']]);

    charts.atendimentos = new Chart(ctx, {
      type: 'line',
      data: {
        labels: d.labels,
        datasets: [
          {
            label: 'CintIA (autônomo)',
            data: d.cintia,
            borderColor: BRAND.K,
            backgroundColor: grad1,
            tension: 0.4,
            fill: true,
            pointRadius: 0,
            pointHoverRadius: 6,
            pointHoverBackgroundColor: BRAND.K,
            pointHoverBorderColor: '#fff',
            pointHoverBorderWidth: 2.5,
            borderWidth: 2.8
          },
          {
            label: 'Encaminhado humano',
            data: d.humano,
            borderColor: ACCENT.blue,
            backgroundColor: grad2,
            tension: 0.4,
            fill: true,
            pointRadius: 0,
            pointHoverRadius: 6,
            pointHoverBackgroundColor: ACCENT.blue,
            pointHoverBorderColor: '#fff',
            pointHoverBorderWidth: 2.5,
            borderWidth: 2.5,
            borderDash: [4, 4]
          }
        ]
      },
      options: { ...commonOpts(), interaction: { intersect: false, mode: 'index' } }
    });
  }

  // --------- Donut: categorias com paleta brand ---------
  function buildCategoria() {
    const d = CINTIA_DATA.demandasPorCategoria;
    const el = document.getElementById('chartCategoria');
    if (!el) return;

    const brandColors = ['#5f2bdb', '#b020c0', '#e8247a', '#38BDF8', '#a78bfa', '#FF007B', '#1a0ecc'];

    charts.categoria = new Chart(el, {
      type: 'doughnut',
      data: {
        labels: d.map(c => c.nome),
        datasets: [{
          data: d.map(c => c.valor),
          backgroundColor: brandColors.slice(0, d.length),
          borderColor: cssVar('--bg-base'),
          borderWidth: 3,
          hoverOffset: 10,
          hoverBorderWidth: 3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '68%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: { color: cssVar('--text-secondary'), font: { family: 'Nunito', size: 11, weight: '600' }, usePointStyle: true, padding: 12, boxWidth: 8 }
          },
          tooltip: commonOpts().plugins.tooltip
        }
      }
    });
  }

  // --------- Radar: NPS por secretaria ---------
  function buildNpsRadar() {
    const d = CINTIA_DATA.npsPorSecretaria;
    const el = document.getElementById('chartNpsRadar');
    if (!el) return;

    const text = cssVar('--text-secondary');
    const grid = cssVar('--chart-grid');

    charts.npsRadar = new Chart(el, {
      type: 'radar',
      data: {
        labels: d.labels,
        datasets: [
          {
            label: 'Atual',
            data: d.atual,
            backgroundColor: 'rgba(232, 36, 122, 0.22)',
            borderColor: BRAND.K,
            borderWidth: 2.5,
            pointBackgroundColor: BRAND.K,
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointRadius: 4.5
          },
          {
            label: 'Trim. anterior',
            data: d.anterior,
            backgroundColor: 'rgba(95, 43, 219, 0.12)',
            borderColor: BRAND.lav,
            borderWidth: 2,
            borderDash: [5, 5],
            pointBackgroundColor: BRAND.lav,
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointRadius: 3.5
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { labels: { color: text, font: { family: 'Nunito', size: 12, weight: '600' }, usePointStyle: true, padding: 16 } },
          tooltip: commonOpts().plugins.tooltip
        },
        scales: {
          r: {
            angleLines: { color: grid },
            grid: { color: grid },
            pointLabels: { color: text, font: { family: 'Nunito', size: 11, weight: '700' } },
            ticks: { color: text, backdropColor: 'transparent', font: { family: 'DM Mono', size: 9 }, stepSize: 20 },
            min: 0, max: 100
          }
        }
      }
    });
  }

  // --------- Barras horizontais: secretarias ---------
  function buildSecretarias() {
    const d = CINTIA_DATA.demandasPorSecretaria;
    const el = document.getElementById('chartSecretarias');
    if (!el) return;
    const ctx = el.getContext('2d');

    const grad = gradient(ctx, 0, 0); // placeholder

    // Para barras horizontais, gradiente é melhor horizontal (left → right)
    const w = el.width || 600;
    const gradReceived = ctx.createLinearGradient(0, 0, w, 0);
    gradReceived.addColorStop(0, 'rgba(167,139,250,0.4)');
    gradReceived.addColorStop(1, 'rgba(167,139,250,0.7)');

    const gradResolved = ctx.createLinearGradient(0, 0, w, 0);
    gradResolved.addColorStop(0, BRAND.P);
    gradResolved.addColorStop(0.5, BRAND.M);
    gradResolved.addColorStop(1, BRAND.K);

    charts.secretarias = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: d.map(s => s.nome),
        datasets: [
          { label: 'Recebidas', data: d.map(s => s.total), backgroundColor: gradReceived, borderRadius: 8, borderSkipped: false },
          { label: 'Resolvidas', data: d.map(s => s.resolvidas), backgroundColor: gradResolved, borderRadius: 8, borderSkipped: false }
        ]
      },
      options: { ...commonOpts(), indexAxis: 'y' }
    });
  }

  // --------- Barras: tempo de resolução ---------
  function buildTempo() {
    const d = CINTIA_DATA.demandasPorSecretaria;
    const tempos = [38, 22, 56, 72, 18, 28, 42, 34];
    const el = document.getElementById('chartTempoResolucao');
    if (!el) return;

    charts.tempo = new Chart(el, {
      type: 'bar',
      data: {
        labels: d.map(s => s.nome),
        datasets: [{
          label: 'Tempo médio (h)',
          data: tempos,
          backgroundColor: tempos.map(t => t > 48 ? ACCENT.coral : t > 36 ? ACCENT.amber : BRAND.K),
          borderRadius: 10,
          borderSkipped: false
        }]
      },
      options: {
        ...commonOpts(),
        plugins: { ...commonOpts().plugins, legend: { display: false } }
      }
    });
  }

  // --------- Área: conversas CintIA ---------
  function buildConversas() {
    const d = getSerie();
    const el = document.getElementById('chartConversas');
    if (!el) return;
    const ctx = el.getContext('2d');

    const grad = gradient(ctx, 340, [[0, 'rgba(232,36,122,0.55)'], [0.4, 'rgba(95,43,219,0.30)'], [1, 'rgba(95,43,219,0)']]);

    const total = d.cintia.map((c, i) => c + d.humano[i]);

    charts.conversas = new Chart(ctx, {
      type: 'line',
      data: {
        labels: d.labels,
        datasets: [{
          label: 'Conversas/dia',
          data: total,
          borderColor: BRAND.K,
          backgroundColor: grad,
          tension: 0.4,
          fill: true,
          pointRadius: 0,
          pointHoverRadius: 6,
          pointHoverBackgroundColor: BRAND.K,
          pointHoverBorderColor: '#fff',
          pointHoverBorderWidth: 2.5,
          borderWidth: 3
        }]
      },
      options: { ...commonOpts(), plugins: { ...commonOpts().plugins, legend: { display: false } } }
    });
  }

  // --------- Donut pequeno: canais ---------
  function buildCanais() {
    const el = document.getElementById('chartCanais');
    if (!el) return;

    charts.canais = new Chart(el, {
      type: 'doughnut',
      data: {
        labels: ['WhatsApp', 'Web Chat', 'Telefone'],
        datasets: [{
          data: [89, 8, 3],
          backgroundColor: [ACCENT.green, BRAND.P, BRAND.K],
          borderColor: cssVar('--bg-base'),
          borderWidth: 3,
          hoverOffset: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '72%',
        plugins: {
          legend: { position: 'bottom', labels: { color: cssVar('--text-secondary'), font: { family: 'Nunito', size: 11, weight: '600' }, usePointStyle: true, boxWidth: 8, padding: 10 } },
          tooltip: commonOpts().plugins.tooltip
        }
      }
    });
  }

  // --------- Barras: hora do dia ---------
  function buildHoras() {
    const labels = ['0h', '3h', '6h', '9h', '12h', '15h', '18h', '21h'];
    const dados =  [12, 8, 22, 78, 95, 88, 72, 38];
    const el = document.getElementById('chartHoras');
    if (!el) return;
    const ctx = el.getContext('2d');

    const grad = gradient(ctx, 300, [[0, BRAND.K], [0.5, BRAND.M], [1, 'rgba(95,43,219,0.2)']]);

    charts.horas = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          data: dados,
          backgroundColor: grad,
          borderRadius: 8,
          borderSkipped: false
        }]
      },
      options: {
        ...commonOpts(),
        plugins: { ...commonOpts().plugins, legend: { display: false } }
      }
    });
  }

  // --------- Sparklines KPI ---------
  function buildSparkline(canvasId, data, color) {
    const el = document.getElementById(canvasId);
    if (!el) return;
    const ctx = el.getContext('2d');
    const grad = gradient(ctx, 34, [[0, color + '60'], [1, color + '00']]);

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.map((_, i) => i),
        datasets: [{
          data,
          borderColor: color,
          backgroundColor: grad,
          tension: 0.4,
          pointRadius: 0,
          borderWidth: 2,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { enabled: false } },
        scales: { x: { display: false }, y: { display: false } }
      }
    });
  }

  function destroyAll() {
    Object.values(charts).forEach(c => c && c.destroy && c.destroy());
    Object.keys(charts).forEach(k => delete charts[k]);
  }

  // Mapa seção → builders dos charts daquela seção
  // Charts em seções display:none precisam ser construídos APÓS a seção ficar visível,
  // senão a canvas tem 0x0 e o Chart.js renderiza vazio
  const SECTION_BUILDERS = {
    overview:    [buildAtendimentos, buildCategoria],
    ouvidoria:   [buildNpsRadar],
    secretarias: [buildSecretarias, buildTempo],
    cintia:      [buildConversas, buildCanais, buildHoras]
  };
  const builtSections = new Set();

  function buildSection(name) {
    if (builtSections.has(name)) return;
    const builders = SECTION_BUILDERS[name];
    if (!builders) { builtSections.add(name); return; }
    builders.forEach(fn => { try { fn(); } catch (e) { console.warn('[charts]', fn.name, e); } });
    builtSections.add(name);
  }

  function init() {
    if (typeof Chart === 'undefined') {
      setTimeout(init, 80);
      return;
    }
    if (initialized) return;
    Chart.defaults.font.family = 'Nunito, system-ui, sans-serif';
    Chart.defaults.color = cssVar('--text-secondary');

    // Só constrói o overview no init — demais seções lazy load via buildSection()
    buildSection('overview');

    initialized = true;
  }

  function reinit() {
    const visited = Array.from(builtSections);
    destroyAll();
    builtSections.clear();
    initialized = false;
    init();
    // Reconstrói as seções que o usuário já visitou (e estão visíveis agora)
    visited.forEach(s => { if (s !== 'overview') buildSection(s); });
  }

  function updatePeriod(period) {
    currentPeriod = period;
    reinit();
  }

  return { init, reinit, updatePeriod, buildSection, buildSparkline, charts, BRAND, ACCENT };
})();
