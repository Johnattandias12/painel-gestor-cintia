/* =========================================================
   PAINEL CINTIA — Dados Fictícios (Demo)
   ========================================================= */

window.CINTIA_DATA = (() => {

  const secretarias = [
    { id: 'saude',     nome: 'Saúde',              cor: '#FF6B6B', icone: 'heart' },
    { id: 'educacao',  nome: 'Educação',           cor: '#38BDF8', icone: 'book' },
    { id: 'obras',     nome: 'Obras e Infra',      cor: '#F59E0B', icone: 'wrench' },
    { id: 'seguranca', nome: 'Segurança',          cor: '#8B5CF6', icone: 'shield' },
    { id: 'fazenda',   nome: 'Fazenda',            cor: '#00C896', icone: 'wallet' },
    { id: 'social',    nome: 'Assistência Social', cor: '#EC4899', icone: 'users' },
    { id: 'meio',      nome: 'Meio Ambiente',      cor: '#22C55E', icone: 'leaf' },
    { id: 'transp',    nome: 'Transporte',         cor: '#A855F7', icone: 'bus' }
  ];

  const bairros = [
    'Centro', 'Jardim das Flores', 'Vila Nova', 'Boa Vista', 'Santa Mônica',
    'Parque Industrial', 'Bela Vista', 'Conjunto Habitacional', 'Alto da Serra', 'Litoral Norte'
  ];

  const categorias = [
    'Iluminação Pública', 'Saúde / Posto', 'Limpeza Urbana', 'Buraco na Via',
    'Vagas em Creche', 'Segurança Pública', 'IPTU / Tributos', 'Transporte Coletivo',
    'Coleta de Lixo', 'Poda de Árvore', 'Esgoto', 'Pavimentação', 'Escola',
    'Documentação', 'Assistência Social'
  ];

  /* =========================================================
     DEMANDAS — Cidadãos específicos em primeiro
     ========================================================= */
  const demandas = [
    {
      id: 'D-7891',
      cidadao: 'Johnattan Dias',
      avatarVariant: 1,
      bairro: 'Centro',
      categoria: 'Iluminação Pública',
      secretaria: 'obras',
      assunto: 'Poste queimado em frente à Rua das Acácias, 432',
      status: 'andamento',
      prioridade: 'alta',
      sla: '2h restantes',
      slaStatus: 'warn',
      data: '2026-05-15',
      avaliacao: null,
      canal: 'WhatsApp'
    },
    {
      id: 'D-7890',
      cidadao: 'Emanuel Jr',
      avatarVariant: 2,
      bairro: 'Jardim das Flores',
      categoria: 'Coleta de Lixo',
      secretaria: 'meio',
      assunto: 'Caminhão de lixo não passou por 3 dias consecutivos',
      status: 'aberto',
      prioridade: 'alta',
      sla: '6h restantes',
      slaStatus: 'warn',
      data: '2026-05-15',
      avaliacao: null,
      canal: 'WhatsApp'
    },
    {
      id: 'D-7889',
      cidadao: 'Rodolfo Lobo',
      avatarVariant: 3,
      bairro: 'Vila Nova',
      categoria: 'Saúde / Posto',
      secretaria: 'saude',
      assunto: 'Falta de medicamento controlado na UBS Vila Nova',
      status: 'andamento',
      prioridade: 'alta',
      sla: '4h restantes',
      slaStatus: 'warn',
      data: '2026-05-14',
      avaliacao: null,
      canal: 'WhatsApp'
    },
    {
      id: 'D-7888',
      cidadao: 'Paulo Filho (Pepeca)',
      avatarVariant: 4,
      bairro: 'Boa Vista',
      categoria: 'Buraco na Via',
      secretaria: 'obras',
      assunto: 'Buraco grande na Av. Beira-Rio, próximo ao número 1200',
      status: 'aberto',
      prioridade: 'media',
      sla: '1d 8h',
      slaStatus: 'ok',
      data: '2026-05-14',
      avaliacao: null,
      canal: 'WhatsApp'
    },
    {
      id: 'D-7887',
      cidadao: 'Daniel Vorcaro',
      avatarVariant: 5,
      bairro: 'Alto da Serra',
      categoria: 'IPTU / Tributos',
      secretaria: 'fazenda',
      assunto: 'Dúvida sobre parcelamento de IPTU 2026',
      status: 'resolvido',
      prioridade: 'baixa',
      sla: 'Resolvido em 38min',
      slaStatus: 'ok',
      data: '2026-05-13',
      avaliacao: 5,
      canal: 'WhatsApp'
    },
    {
      id: 'D-7886',
      cidadao: 'Alexandre de Moraes',
      avatarVariant: 6,
      bairro: 'Centro',
      categoria: 'Documentação',
      secretaria: 'fazenda',
      assunto: 'Solicitação de 2ª via de certidão negativa de débitos',
      status: 'resolvido',
      prioridade: 'media',
      sla: 'Resolvido em 2h12min',
      slaStatus: 'ok',
      data: '2026-05-13',
      avaliacao: 4,
      canal: 'WhatsApp'
    },
    {
      id: 'D-7885',
      cidadao: 'Maria Aparecida Silva',
      avatarVariant: 1,
      bairro: 'Conjunto Habitacional',
      categoria: 'Vagas em Creche',
      secretaria: 'educacao',
      assunto: 'Pedido de vaga em creche para criança de 2 anos',
      status: 'andamento',
      prioridade: 'media',
      sla: '12h restantes',
      slaStatus: 'ok',
      data: '2026-05-13',
      avaliacao: null,
      canal: 'WhatsApp'
    },
    {
      id: 'D-7884',
      cidadao: 'Carlos Eduardo Pereira',
      avatarVariant: 2,
      bairro: 'Santa Mônica',
      categoria: 'Segurança Pública',
      secretaria: 'seguranca',
      assunto: 'Solicita ronda preventiva na praça do bairro',
      status: 'atrasado',
      prioridade: 'alta',
      sla: '-4h (atrasado)',
      slaStatus: 'danger',
      data: '2026-05-12',
      avaliacao: null,
      canal: 'WhatsApp'
    },
    {
      id: 'D-7883',
      cidadao: 'Fernanda Costa Lima',
      avatarVariant: 3,
      bairro: 'Bela Vista',
      categoria: 'Poda de Árvore',
      secretaria: 'meio',
      assunto: 'Galho de árvore tocando fios elétricos',
      status: 'andamento',
      prioridade: 'alta',
      sla: '8h restantes',
      slaStatus: 'ok',
      data: '2026-05-12',
      avaliacao: null,
      canal: 'WhatsApp'
    },
    {
      id: 'D-7882',
      cidadao: 'José Roberto Almeida',
      avatarVariant: 4,
      bairro: 'Litoral Norte',
      categoria: 'Esgoto',
      secretaria: 'obras',
      assunto: 'Vazamento de esgoto na Rua dos Coqueiros',
      status: 'atrasado',
      prioridade: 'alta',
      sla: '-2d (atrasado)',
      slaStatus: 'danger',
      data: '2026-05-11',
      avaliacao: null,
      canal: 'WhatsApp'
    },
    {
      id: 'D-7881',
      cidadao: 'Ana Beatriz Souza',
      avatarVariant: 5,
      bairro: 'Parque Industrial',
      categoria: 'Transporte Coletivo',
      secretaria: 'transp',
      assunto: 'Sugestão de novo itinerário para linha 304',
      status: 'aberto',
      prioridade: 'baixa',
      sla: '3d 4h',
      slaStatus: 'ok',
      data: '2026-05-11',
      avaliacao: null,
      canal: 'WhatsApp'
    },
    {
      id: 'D-7880',
      cidadao: 'Rafael Mendes Tavares',
      avatarVariant: 6,
      bairro: 'Centro',
      categoria: 'Assistência Social',
      secretaria: 'social',
      assunto: 'Cadastro em programa de auxílio emergencial',
      status: 'resolvido',
      prioridade: 'media',
      sla: 'Resolvido em 1d 4h',
      slaStatus: 'ok',
      data: '2026-05-10',
      avaliacao: 5,
      canal: 'WhatsApp'
    }
  ];

  /* =========================================================
     KPIs PRINCIPAIS
     ========================================================= */
  const kpis = {
    cidadaosAtendidos: { valor: 12847, deltaPct: 18.4, trend: 'up', spark: [78,82,90,88,95,102,110,108,118,125,132,140] },
    demandasResolvidas: { valor: 9234, taxa: 71.9, deltaPct: 4.2, trend: 'up', spark: [62,64,66,68,67,69,70,71,70,71,72,71.9] },
    npsMedio: { valor: 72, deltaPct: 8.0, trend: 'up', spark: [58,60,63,65,68,69,70,71,71,72,72,72] },
    tempoMedio: { valor: '1h 42min', deltaPct: -12.5, trend: 'up', spark: [2.5,2.4,2.3,2.1,2.0,1.9,1.85,1.8,1.75,1.7,1.72,1.7] },
    resolucaoAutonoma: { valor: 64.3, deltaPct: 5.7, trend: 'up', spark: [52,54,56,58,59,60,61,62,63,63,64,64.3] },
    demandasAtraso: { valor: 47, deltaPct: -22.0, trend: 'up', spark: [80,75,70,68,65,60,58,55,52,50,48,47] },
    conversasDia: { valor: 1284, deltaPct: 14.3, trend: 'up', spark: [900,950,1000,1050,1100,1120,1150,1180,1200,1230,1260,1284] },
    satisfacao: { valor: 4.6, deltaPct: 2.2, trend: 'up', spark: [4.2,4.3,4.3,4.4,4.4,4.5,4.5,4.5,4.6,4.6,4.6,4.6] }
  };

  /* =========================================================
     SÉRIE TEMPORAL — Atendimentos por dia (30 dias)
     ========================================================= */
  const diasLabels = Array.from({ length: 30 }, (_, i) => {
    const d = new Date(2026, 3, 16 + i);
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
  });

  const atendimentosPorDia = {
    labels: diasLabels,
    cintia:   [780,820,805,890,920,950,830,870,910,1020,1080,950,990,1050,1110,1180,1100,1050,1120,1190,1230,1180,1140,1200,1260,1310,1280,1250,1290,1320],
    humano:   [220,210,230,260,250,280,210,240,260,290,310,260,280,300,330,360,330,310,340,360,380,360,350,370,400,420,400,390,410,430]
  };

  /* =========================================================
     DEMANDAS POR CATEGORIA (donut)
     ========================================================= */
  const demandasPorCategoria = [
    { nome: 'Iluminação Pública', valor: 1842, cor: '#F59E0B' },
    { nome: 'Buraco na Via', valor: 1320, cor: '#FF6B6B' },
    { nome: 'Saúde / Posto', valor: 1180, cor: '#38BDF8' },
    { nome: 'Coleta de Lixo', valor: 980, cor: '#22C55E' },
    { nome: 'Documentação', valor: 740, cor: '#00C896' },
    { nome: 'Vagas em Creche', valor: 620, cor: '#8B5CF6' },
    { nome: 'Outros', valor: 2145, cor: '#64748B' }
  ];

  /* =========================================================
     DEMANDAS POR SECRETARIA
     ========================================================= */
  const demandasPorSecretaria = [
    { id: 'obras',     nome: 'Obras',     total: 3162, resolvidas: 2240, taxa: 70.8 },
    { id: 'saude',     nome: 'Saúde',     total: 1948, resolvidas: 1632, taxa: 83.8 },
    { id: 'meio',      nome: 'Meio Amb.', total: 1620, resolvidas: 1290, taxa: 79.6 },
    { id: 'educacao',  nome: 'Educação',  total: 1290, resolvidas: 1080, taxa: 83.7 },
    { id: 'fazenda',   nome: 'Fazenda',   total: 1148, resolvidas: 1102, taxa: 96.0 },
    { id: 'seguranca', nome: 'Segurança', total: 920,  resolvidas: 612,  taxa: 66.5 },
    { id: 'transp',    nome: 'Transporte',total: 620,  resolvidas: 460,  taxa: 74.2 },
    { id: 'social',    nome: 'Assist. Social', total: 539, resolvidas: 480, taxa: 89.0 }
  ];

  /* =========================================================
     NPS POR SECRETARIA (radar)
     ========================================================= */
  const npsPorSecretaria = {
    labels: ['Saúde', 'Educação', 'Obras', 'Segurança', 'Fazenda', 'Social', 'Meio Amb.', 'Transp.'],
    atual:   [68, 76, 52, 41, 84, 79, 71, 58],
    anterior:[58, 70, 48, 38, 78, 72, 65, 54]
  };

  /* =========================================================
     DISTRIBUIÇÃO DE AVALIAÇÕES (1 a 5)
     ========================================================= */
  const distribuicaoAvaliacoes = [
    { estrelas: 5, count: 4820, pct: 62.3 },
    { estrelas: 4, count: 1640, pct: 21.2 },
    { estrelas: 3, count: 720,  pct: 9.3 },
    { estrelas: 2, count: 320,  pct: 4.1 },
    { estrelas: 1, count: 240,  pct: 3.1 }
  ];

  /* =========================================================
     HEATMAP POR BAIRRO (densidade de demandas)
     ========================================================= */
  const heatmapBairros = [
    { nome: 'Centro',                  total: 1842, principal: 'Iluminação',  x: 0.5, y: 0.5, raio: 80 },
    { nome: 'Jardim das Flores',       total: 1320, principal: 'Coleta Lixo', x: 0.28, y: 0.32, raio: 65 },
    { nome: 'Vila Nova',               total: 980,  principal: 'Saúde',       x: 0.72, y: 0.28, raio: 55 },
    { nome: 'Boa Vista',               total: 820,  principal: 'Buracos',     x: 0.18, y: 0.65, raio: 48 },
    { nome: 'Santa Mônica',            total: 740,  principal: 'Segurança',   x: 0.78, y: 0.62, raio: 44 },
    { nome: 'Parque Industrial',       total: 620,  principal: 'Esgoto',      x: 0.85, y: 0.82, raio: 38 },
    { nome: 'Bela Vista',              total: 540,  principal: 'Poda Árvore', x: 0.42, y: 0.78, raio: 34 },
    { nome: 'Conj. Habitacional',      total: 510,  principal: 'Creche',      x: 0.62, y: 0.85, raio: 32 },
    { nome: 'Alto da Serra',           total: 420,  principal: 'Transporte',  x: 0.12, y: 0.18, raio: 28 },
    { nome: 'Litoral Norte',           total: 380,  principal: 'Esgoto',      x: 0.92, y: 0.45, raio: 26 }
  ];

  /* =========================================================
     CONVERSA CINTIA (preview)
     ========================================================= */
  const chatCintia = [
    { from: 'user', text: 'Oi, precisava saber onde renovo minha carteira de vacinação.', time: '14:32' },
    { from: 'cintia', text: 'Oi! Sou a <b>Cintia</b>, assistente da Prefeitura. A renovação é feita na <b>UBS mais próxima do seu bairro</b>. Qual o seu CEP?', time: '14:32' },
    { from: 'user', text: '08540-150', time: '14:33' },
    { from: 'cintia', text: 'Perfeito! A unidade mais próxima é a <b>UBS Jardim das Flores</b>.<br><br>Endereço: Rua das Margaridas, 215<br>Horário: Seg a Sex, 7h às 17h<br>Telefone: (11) 4567-8900<br>Responsável: Enf. Patrícia Souza', time: '14:33' },
    { from: 'user', text: 'Top! Obrigado', time: '14:34' },
    { from: 'cintia', text: 'Por nada! Avalie meu atendimento de 1 a 5 estrelas para eu melhorar ainda mais.', time: '14:34' }
  ];

  /* =========================================================
     ALERTAS DO PREFEITO
     ========================================================= */
  const alertas = [
    { tipo: 'danger', titulo: '47 demandas com SLA estourado', desc: 'Maior parte em Obras (28) e Segurança (12). Requer ação imediata.', time: 'há 12 min' },
    { tipo: 'warn',   titulo: 'Aumento de 32% em reclamações de iluminação', desc: 'Bairros Centro e Jardim das Flores concentram 60% dos casos.', time: 'há 1h' },
    { tipo: 'info',   titulo: 'Pico de atendimentos previsto', desc: 'Modelo prevê +40% de demandas amanhã (feriado prolongado).', time: 'há 2h' },
    { tipo: 'success',titulo: 'Meta de NPS Saúde batida', desc: 'NPS subiu de 58 para 68 (+10pts) no último trimestre.', time: 'há 5h' }
  ];

  /* =========================================================
     PALAVRAS MAIS CITADAS (word cloud simulado)
     ========================================================= */
  const topPalavras = [
    { palavra: 'demora',      peso: 100 },
    { palavra: 'buraco',      peso: 92 },
    { palavra: 'iluminação',  peso: 88 },
    { palavra: 'lixo',        peso: 78 },
    { palavra: 'obrigado',    peso: 72 },
    { palavra: 'rápido',      peso: 68 },
    { palavra: 'esgoto',      peso: 62 },
    { palavra: 'creche',      peso: 58 },
    { palavra: 'remédio',     peso: 54 },
    { palavra: 'urgente',     peso: 50 },
    { palavra: 'parabéns',    peso: 46 },
    { palavra: 'segurança',   peso: 42 }
  ];

  /* =========================================================
     INSIGHTS GERADOS PELA IA (mock)
     ========================================================= */
  const insights = [
    'Resolução autônoma da <b>Cintia subiu para 64,3%</b> esta semana — economia estimada de R$ 142mil/mês em atendimento humano.',
    'Bairros do <b>Centro e Jardim das Flores</b> respondem por 38% das demandas. Sugestão: força-tarefa de Obras concentrada nessas regiões nas próximas 2 semanas.',
    'Secretaria de <b>Segurança</b> tem o pior NPS (41pts) e 12 demandas em atraso. Recomenda-se revisão do fluxo de atendimento da ouvidoria de Segurança.',
    'Sextas-feiras concentram 22% mais demandas que a média semanal. Considere reforço de equipe nesses dias.'
  ];

  return {
    secretarias, bairros, categorias, demandas, kpis,
    atendimentosPorDia, demandasPorCategoria, demandasPorSecretaria,
    npsPorSecretaria, distribuicaoAvaliacoes, heatmapBairros,
    chatCintia, alertas, topPalavras, insights
  };
})();
