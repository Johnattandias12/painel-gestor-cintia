/* =========================================================
   PAINEL CINTIA — Charts (Chart.js)
   ========================================================= */

window.CINTIA_CHARTS = (() => {
  const charts = {};
  let initialized = false;

  function cssVar(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }

  function commonOpts() {
    const text = cssVar('--text-secondary') || '#94A3B8';
    const grid = cssVar('--chart-grid') || 'rgba(255,255,255,0.05)';
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: { color: text, font: { family: 'Inter', size: 12, weight: '500' }, usePointStyle: true, padding: 16 }
        },
        tooltip: {
          backgroundColor: cssVar('--bg-elevated') || '#0F1E36',
          titleColor: cssVar('--text-primary') || '#F1F5F9',
          bodyColor: cssVar('--text-secondary') || '#94A3B8',
          borderColor: cssVar('--border-strong') || 'rgba(255,255,255,0.12)',
          borderWidth: 1,
          padding: 12,
          cornerRadius: 8,
          displayColors: true,
          boxPadding: 4,
          titleFont: { family: 'Inter', size: 12, weight: '600' },
          bodyFont: { family: 'JetBrains Mono', size: 12 }
        }
      },
      scales: {
        x: { ticks: { color: text, font: { family: 'Inter', size: 10 } }, grid: { color: grid, drawBorder: false } },
        y: { ticks: { color: text, font: { family: 'JetBrains Mono', size: 10 } }, grid: { color: grid, drawBorder: false }, beginAtZero: true }
      }
    };
  }

  // --------- Linha duplo: atendimentos Cintia vs Humano ---------
  function buildAtendimentos() {
    const d = CINTIA_DATA.atendimentosPorDia;
    const ctx = document.getElementById('chartAtendimentos');
    if (!ctx) return;

    const grad1 = ctx.getContext('2d').createLinearGradient(0, 0, 0, 280);
    grad1.addColorStop(0, 'rgba(0, 200, 150, 0.35)');
    grad1.addColorStop(1, 'rgba(0, 200, 150, 0)');

    const grad2 = ctx.getContext('2d').createLinearGradient(0, 0, 0, 280);
    grad2.addColorStop(0, 'rgba(139, 92, 246, 0.25)');
    grad2.addColorStop(1, 'rgba(139, 92, 246, 0)');

    charts.atendimentos = new Chart(ctx, {
      type: 'line',
      data: {
        labels: d.labels,
        datasets: [
          {
            label: 'Cintia (autônomo)',
            data: d.cintia,
            borderColor: '#00C896',
            backgroundColor: grad1,
            tension: 0.4,
            fill: true,
            pointRadius: 0,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: '#00C896',
            pointHoverBorderColor: '#fff',
            pointHoverBorderWidth: 2,
            borderWidth: 2.5
          },
          {
            label: 'Encaminhado humano',
            data: d.humano,
            borderColor: '#8B5CF6',
            backgroundColor: grad2,
            tension: 0.4,
            fill: true,
            pointRadius: 0,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: '#8B5CF6',
            pointHoverBorderColor: '#fff',
            pointHoverBorderWidth: 2,
            borderWidth: 2.5
          }
        ]
      },
      options: { ...commonOpts(), interaction: { intersect: false, mode: 'index' } }
    });
  }

  // --------- Donut: categorias ---------
  function buildCategoria() {
    const d = CINTIA_DATA.demandasPorCategoria;
    const ctx = document.getElementById('chartCategoria');
    if (!ctx) return;

    charts.categoria = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: d.map(c => c.nome),
        datasets: [{
          data: d.map(c => c.valor),
          backgroundColor: d.map(c => c.cor),
          borderColor: cssVar('--bg-card'),
          borderWidth: 3,
          hoverOffset: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '65%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: { color: cssVar('--text-secondary'), font: { family: 'Inter', size: 11 }, usePointStyle: true, padding: 12, boxWidth: 8 }
          },
          tooltip: commonOpts().plugins.tooltip
        }
      }
    });
  }

  // --------- Radar: NPS por secretaria ---------
  function buildNpsRadar() {
    const d = CINTIA_DATA.npsPorSecretaria;
    const ctx = document.getElementById('chartNpsRadar');
    if (!ctx) return;

    const text = cssVar('--text-secondary');
    const grid = cssVar('--chart-grid');

    charts.npsRadar = new Chart(ctx, {
      type: 'radar',
      data: {
        labels: d.labels,
        datasets: [
          {
            label: 'Atual',
            data: d.atual,
            backgroundColor: 'rgba(0, 200, 150, 0.2)',
            borderColor: '#00C896',
            borderWidth: 2,
            pointBackgroundColor: '#00C896',
            pointRadius: 4
          },
          {
            label: 'Trim. anterior',
            data: d.anterior,
            backgroundColor: 'rgba(139, 92, 246, 0.1)',
            borderColor: '#8B5CF6',
            borderWidth: 2,
            borderDash: [4, 4],
            pointBackgroundColor: '#8B5CF6',
            pointRadius: 3
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { labels: { color: text, font: { family: 'Inter', size: 12 }, usePointStyle: true, padding: 16 } },
          tooltip: commonOpts().plugins.tooltip
        },
        scales: {
          r: {
            angleLines: { color: grid },
            grid: { color: grid },
            pointLabels: { color: text, font: { family: 'Inter', size: 11, weight: '500' } },
            ticks: { color: text, backdropColor: 'transparent', font: { family: 'JetBrains Mono', size: 9 }, stepSize: 20 },
            min: 0, max: 100
          }
        }
      }
    });
  }

  // --------- Barras horizontais: demandas por secretaria ---------
  function buildSecretarias() {
    const d = CINTIA_DATA.demandasPorSecretaria;
    const ctx = document.getElementById('chartSecretarias');
    if (!ctx) return;

    charts.secretarias = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: d.map(s => s.nome),
        datasets: [
          { label: 'Recebidas', data: d.map(s => s.total), backgroundColor: 'rgba(56, 189, 248, 0.6)', borderRadius: 6, borderSkipped: false },
          { label: 'Resolvidas', data: d.map(s => s.resolvidas), backgroundColor: 'rgba(0, 200, 150, 0.85)', borderRadius: 6, borderSkipped: false }
        ]
      },
      options: { ...commonOpts(), indexAxis: 'y' }
    });
  }

  // --------- Barras: tempo de resolução ---------
  function buildTempo() {
    const d = CINTIA_DATA.demandasPorSecretaria;
    const tempos = [38, 22, 56, 72, 18, 28, 42, 34]; // horas
    const ctx = document.getElementById('chartTempoResolucao');
    if (!ctx) return;

    charts.tempo = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: d.map(s => s.nome),
        datasets: [{
          label: 'Tempo médio (h)',
          data: tempos,
          backgroundColor: tempos.map(t => t > 48 ? '#FF6B6B' : t > 36 ? '#F59E0B' : '#00C896'),
          borderRadius: 8,
          borderSkipped: false
        }]
      },
      options: {
        ...commonOpts(),
        plugins: {
          ...commonOpts().plugins,
          legend: { display: false }
        }
      }
    });
  }

  // --------- Área: conversas Cintia ---------
  function buildConversas() {
    const d = CINTIA_DATA.atendimentosPorDia;
    const ctx = document.getElementById('chartConversas');
    if (!ctx) return;

    const grad = ctx.getContext('2d').createLinearGradient(0, 0, 0, 320);
    grad.addColorStop(0, 'rgba(0, 200, 150, 0.5)');
    grad.addColorStop(1, 'rgba(0, 200, 150, 0)');

    const total = d.cintia.map((c, i) => c + d.humano[i]);

    charts.conversas = new Chart(ctx, {
      type: 'line',
      data: {
        labels: d.labels,
        datasets: [{
          label: 'Conversas/dia',
          data: total,
          borderColor: '#00C896',
          backgroundColor: grad,
          tension: 0.4,
          fill: true,
          pointRadius: 0,
          pointHoverRadius: 5,
          borderWidth: 2.5
        }]
      },
      options: { ...commonOpts(), plugins: { ...commonOpts().plugins, legend: { display: false } } }
    });
  }

  // --------- Donut pequeno: canais ---------
  function buildCanais() {
    const ctx = document.getElementById('chartCanais');
    if (!ctx) return;

    charts.canais = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['WhatsApp', 'Web Chat', 'Telefone'],
        datasets: [{
          data: [89, 8, 3],
          backgroundColor: ['#00C896', '#38BDF8', '#8B5CF6'],
          borderColor: cssVar('--bg-card'),
          borderWidth: 3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        plugins: {
          legend: { position: 'bottom', labels: { color: cssVar('--text-secondary'), font: { family: 'Inter', size: 11 }, usePointStyle: true, boxWidth: 8 } },
          tooltip: commonOpts().plugins.tooltip
        }
      }
    });
  }

  // --------- Barras: hora do dia ---------
  function buildHoras() {
    const labels = ['0', '3', '6', '9', '12', '15', '18', '21'];
    const dados =  [12, 8, 22, 78, 95, 88, 72, 38];
    const ctx = document.getElementById('chartHoras');
    if (!ctx) return;

    charts.horas = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          data: dados,
          backgroundColor: ctx.getContext('2d').createLinearGradient(0, 0, 0, 200) || '#00C896',
          borderRadius: 6,
          borderSkipped: false
        }]
      },
      options: {
        ...commonOpts(),
        plugins: { ...commonOpts().plugins, legend: { display: false } }
      }
    });

    // gradiente vertical nas barras
    const grad = ctx.getContext('2d').createLinearGradient(0, 0, 0, 200);
    grad.addColorStop(0, '#00C896');
    grad.addColorStop(1, 'rgba(0, 200, 150, 0.2)');
    charts.horas.data.datasets[0].backgroundColor = grad;
    charts.horas.update();
  }

  // --------- Sparklines nos KPI cards ---------
  function buildSparkline(canvasId, data, color) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.map((_, i) => i),
        datasets: [{
          data,
          borderColor: color,
          backgroundColor: 'transparent',
          tension: 0.4,
          pointRadius: 0,
          borderWidth: 1.8
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

  function init() {
    if (typeof Chart === 'undefined') {
      // Chart.js ainda não carregou — tenta de novo
      setTimeout(init, 80);
      return;
    }
    if (initialized) return;
    Chart.defaults.font.family = 'Inter, system-ui, sans-serif';
    Chart.defaults.color = cssVar('--text-secondary');

    buildAtendimentos();
    buildCategoria();
    buildNpsRadar();
    buildSecretarias();
    buildTempo();
    buildConversas();
    buildCanais();
    buildHoras();

    initialized = true;
  }

  function reinit() {
    destroyAll();
    initialized = false;
    init();
  }

  return { init, reinit, buildSparkline, charts };
})();
