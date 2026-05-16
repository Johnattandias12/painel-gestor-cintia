# Painel Cintia — Dashboard de Gestão Pública

Painel de controle (analytics) para gestores públicos baseado nos dados gerados pela **Cintia**, agente de IA no WhatsApp que atende cidadãos, redireciona para serviços públicos e atua como ouvidoria digital.

> **Status**: Protótipo navegável (demo) com dados fictícios. Pronto para deploy na Vercel.

---

## 1. Sobre a Cintia

**Cintia** é uma agente de IA conversacional que opera via WhatsApp e cumpre três papéis:

1. **Roteamento de serviços** — O cidadão pergunta "onde renovo meu IPTU?" e a Cintia responde com endereço da secretaria responsável, nome do servidor de contato, telefone e horário de atendimento.
2. **Ouvidoria digital** — Recebe demandas, reclamações, sugestões e elogios. Cada interação vira um registro estruturado no banco.
3. **Avaliação de serviços** — Após o atendimento, a Cintia pede que o cidadão avalie o serviço público (1 a 5 estrelas + comentário opcional), gerando NPS por secretaria.

Todo esse fluxo gera **analytics em tempo real** que o prefeito e secretários acessam por este painel.

---

## 2. Objetivo do Painel

Dar ao **Prefeito** e equipe de gabinete uma visão 360° do município, combinando:

- **Estratégico** (Gabinete) — KPIs macro, metas de governo, alertas executivos
- **Operacional** (Secretarias) — Demandas em aberto, SLA, performance por área
- **Cidadão** (Ouvidoria) — Voz da rua, satisfação, mapa de calor de reclamações
- **Cintia AI** — Performance da própria agente (volume, resolução, retenção)

---

## 3. Identidade Visual

Inspirada na fusão **WhatsApp + IA + Gestão Pública**:

| Token | Hex | Uso |
|---|---|---|
| `--cintia-green` | `#00C896` | Cor primária (Cintia / WhatsApp moderno) |
| `--cintia-deep` | `#0A1628` | Fundo dark mode |
| `--cintia-violet` | `#8B5CF6` | Acento IA (insights, ML) |
| `--cintia-amber` | `#F59E0B` | Destaques, atenção |
| `--cintia-coral` | `#FF6B6B` | Urgência, atrasos |
| `--cintia-sky` | `#38BDF8` | Informacional |

**Tipografia**:
- UI: `Inter` (Google Fonts) — 400/500/600/700
- Dados/Números: `JetBrains Mono` — para KPIs e métricas

**Princípios visuais**:
- SVG refinado em ícones, logo e detalhes (sem ícones rasterizados)
- Dark mode é o padrão (analytics noturno)
- Glow sutil em elementos de IA (Cintia)
- Cards com bordas sutis, não traços pesados
- Animações curtas (200ms) em hover/transições

---

## 4. Estrutura de Módulos (Tabs)

1. **Visão Geral** — KPIs principais + 4 gráficos resumo + alertas
2. **Demandas** — Lista filtrável de demandas dos cidadãos (tabela com SLA, status, secretaria)
3. **Ouvidoria** — NPS, distribuição de avaliações, palavras mais citadas (word cloud SVG)
4. **Mapa de Calor** — Heatmap por bairro (SVG) com top 5 problemas
5. **Secretarias** — Ranking de performance, demandas por área, tempo médio
6. **Cintia AI** — Métricas da agente: conversas/dia, taxa de resolução autônoma, retenção

---

## 5. KPIs Principais (Visão Geral)

- **Cidadãos atendidos** (mês corrente vs. anterior)
- **Demandas resolvidas** (% sobre total)
- **NPS médio** (-100 a +100)
- **Tempo médio de resposta** (horas)
- **Taxa de resolução autônoma da Cintia** (sem intervenção humana)
- **Demandas em atraso** (SLA estourado)

---

## 6. Filtros Globais

- **Período**: 7d / 30d / 90d / 12m / Personalizado
- **Secretaria**: Todas / Saúde / Educação / Obras / Segurança / Fazenda / Assistência Social / Meio Ambiente
- **Status**: Todas / Em aberto / Em andamento / Resolvidas / Atrasadas
- **Bairro** (no módulo de mapa)

---

## 7. Stack Técnica

- **HTML/CSS/JS puro** (sem framework, sem build)
- **Chart.js 4** (CDN) — gráficos de linha, barra, donut, radar
- **Google Fonts** (Inter + JetBrains Mono)
- **SVG inline** para logo, ícones e mapa de calor customizado
- **localStorage** para persistência do tema (dark/light)

---

## 8. Estrutura de Arquivos

```
painel-cintia/
├── README.md            # Este arquivo
├── index.html           # Página principal (todos os módulos)
├── vercel.json          # Config para deploy estático na Vercel
├── .gitignore
├── css/
│   └── styles.css       # Estilos + tokens de tema + dark/light
├── js/
│   ├── data.js          # Dados fictícios (demandas, KPIs, secretarias)
│   ├── charts.js        # Setup Chart.js (todos os gráficos)
│   └── main.js          # Tema, navegação, filtros, render dinâmico
└── assets/
    └── (SVGs ficam inline no HTML para refinamento total)
```

---

## 9. Dados Fictícios

Cidadãos de exemplo no topo da lista de demandas:

1. **Johnattan Dias** (prioridade — aparece primeiro)
2. Emanuel Jr
3. Rodolfo Lobo
4. Paulo Filho (Pepeca)
5. Daniel Vorcaro
6. Alexandre de Moraes

Mais ~30 demandas geradas com nomes variados para popular gráficos e tabela.

---

## 10. Deploy

### Local
Abrir `index.html` direto no navegador. Sem build, sem servidor.

### Vercel
1. Conecte este repositório no painel da Vercel: <https://vercel.com/new>
2. **Framework Preset**: `Other` (estático)
3. **Build Command**: deixe vazio
4. **Output Directory**: `.` (raiz)
5. Deploy. Vercel detecta o `vercel.json` e serve estaticamente.

---

## 11. Roadmap (próximas iterações sugeridas)

- [ ] Conectar a banco real (Supabase / Postgres)
- [ ] Webhook da Cintia (WhatsApp Business API) gravando demandas
- [ ] Autenticação SSO para gestores
- [ ] Exportação PDF dos relatórios
- [ ] Modo apresentação (kioske) para sala do prefeito
- [ ] Alertas em tempo real (websocket) para demandas urgentes

---

## 12. Diretrizes para o Modelo

Quando estiver editando este projeto, siga:

- **Dark mode é padrão.** Toggle persiste em `localStorage` (`cintia-theme`).
- **Identidade visual é sagrada.** Não introduza cores fora da paleta.
- **SVG sempre inline** — não use bibliotecas de ícones externas.
- **Mobile-first não é prioridade** (gestor usa em desktop/tablet), mas o layout deve ser responsivo até 1024px.
- **Sem emojis no código.** Use SVG para ícones.
- **Comentários no código:** apenas quando o "porquê" não for óbvio.
- **Dados fictícios** ficam isolados em `js/data.js`. Para trocar por dados reais, basta substituir esse arquivo.

---

Feito para demonstrar o potencial analítico da **Cintia**.
