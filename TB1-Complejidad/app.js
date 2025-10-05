// Datos simulados
const mockUser = { nombre: 'María' };
const mockKpis = {
  saldo: 3250.75,
  gastoMes: 1250.5,
  ahorro: 480.0,
};
const mockGastosPorCategoria = [
  { categoria: 'Alimentación', valor: 420 },
  { categoria: 'Transporte', valor: 210 },
  { categoria: 'Educación', valor: 350 },
  { categoria: 'Entretenimiento', valor: 140 },
  { categoria: 'Salud', valor: 130 },
];
const mockEvolucionGasto = {
  labels: ['Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep'],
  data: [980, 1120, 1060, 1180, 1250, 1220],
};

const routes = ['dashboard','transacciones','metas','analisis','reportes'];

// Utilidades UI
function formatMoney(n) {
  return new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN', maximumFractionDigits: 2 }).format(n);
}

function setActive(route) {
  document.querySelectorAll('.nav-item').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.route === route);
  });
}

function mountGreeting() {
  const h = document.getElementById('greetingText');
  h.textContent = `Hola, ${mockUser.nombre}`;
}

function closeAuth() {
  const overlay = document.getElementById('authOverlay');
  overlay.style.display = 'none';
}

// Renderizadores de vistas
function renderDashboard(container) {
  container.innerHTML = `
    <section class="grid cols-3">
      <div class="card kpi"><span class="label">Saldo total</span><span class="value">${formatMoney(mockKpis.saldo)}</span></div>
      <div class="card kpi"><span class="label">Gasto del mes</span><span class="value">${formatMoney(mockKpis.gastoMes)}</span></div>
      <div class="card kpi"><span class="label">Ahorro logrado</span><span class="value">${formatMoney(mockKpis.ahorro)}</span></div>
    </section>
    <section class="grid cols-2">
      <div class="card"><h3>Gastos por categoría</h3><canvas id="pieChart" height="160"></canvas></div>
      <div class="card"><h3>Evolución mensual</h3><canvas id="lineChart" height="160"></canvas></div>
    </section>
  `;

  // Gráfico circular
  const pieCtx = document.getElementById('pieChart');
  new Chart(pieCtx, {
    type: 'pie',
    data: {
      labels: mockGastosPorCategoria.map(x => x.categoria),
      datasets: [{ data: mockGastosPorCategoria.map(x => x.valor), backgroundColor: ['#39B54A','#63C57B','#8DD5A4','#B7E5CD','#DFF6E9'] }]
    },
    options: { plugins: { legend: { position: 'bottom' } } }
  });

  // Gráfico de línea
  const lineCtx = document.getElementById('lineChart');
  new Chart(lineCtx, {
    type: 'line',
    data: {
      labels: mockEvolucionGasto.labels,
      datasets: [{ label: 'Gasto (S/)', data: mockEvolucionGasto.data, borderColor: '#004C6D', backgroundColor: 'rgba(0,76,109,0.12)', fill: true, tension: 0.35 }]
    },
    options: { plugins: { legend: { display: false } }, scales: { y: { beginAtZero: false } } }
  });
}

function renderTransacciones(container) {
  container.innerHTML = `
    <section class="card">
      <div class="row">
        <input type="date" id="fInicio" />
        <input type="date" id="fFin" />
        <select id="fCategoria">
          <option value="">Todas</option>
          ${mockGastosPorCategoria.map(x => `<option>${x.categoria}</option>`).join('')}
        </select>
        <span class="chip">Ingresos: <strong>${formatMoney(2200)}</strong></span>
        <span class="chip">Egresos: <strong>${formatMoney(1250)}</strong></span>
        <span class="chip">Balance: <strong>${formatMoney(950)}</strong></span>
      </div>
    </section>
    <section class="card">
      <table>
        <thead>
          <tr>
            <th>Fecha</th><th>Categoría</th><th>Subcategoría</th><th>Descripción</th><th>Método</th><th>Monto</th>
          </tr>
        </thead>
        <tbody>
          ${[
            { fecha: '2025-09-30', cat: 'Alimentación', sub: 'Almuerzo', desc: 'Menu universitario', metodo: 'Yape', monto: -12.5 },
            { fecha: '2025-09-29', cat: 'Educación', sub: 'Libros', desc: 'Apuntes y textos', metodo: 'Tarjeta', monto: -85 },
            { fecha: '2025-09-28', cat: 'Transporte', sub: 'Bus', desc: 'Movilidad', metodo: 'Efectivo', monto: -3 },
            { fecha: '2025-09-25', cat: 'Ingresos', sub: 'Beca', desc: 'Beca parcial', metodo: 'Transferencia', monto: 600 },
          ].map(t => `
            <tr>
              <td>${t.fecha}</td>
              <td>${t.cat}</td>
              <td>${t.sub}</td>
              <td>${t.desc}</td>
              <td>${t.metodo}</td>
              <td style="color:${t.monto<0?'#b91c1c':'#065f46'}">${formatMoney(t.monto)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </section>
    <button class="btn btn-primary fab" id="addTxBtn">+ Agregar Transacción</button>
  `;
}

function renderMetas(container) {
  const metas = [
    { titulo: 'Ahorrar para laptop', objetivo: 2500, progreso: 0.42 },
    { titulo: 'Fondo de emergencia', objetivo: 1500, progreso: 0.28 },
  ];
  container.innerHTML = `
    <section class="row">
      <button class="btn btn-primary" id="nuevaMetaBtn">Nueva meta</button>
      <span class="muted">Marca metas cumplidas cuando llegues al 100%.</span>
    </section>
    <section class="grid cols-2">
      ${metas.map(m => `
        <div class="card">
          <div class="row" style="justify-content: space-between;">
            <h3>${m.titulo}: <span class="muted">${formatMoney(m.objetivo)}</span></h3>
            <button class="btn btn-outline">Marcar cumplida</button>
          </div>
          <div class="progress"><div class="bar" style="width:${Math.round(m.progreso*100)}%"></div></div>
          <div class="muted">Progreso: ${Math.round(m.progreso*100)}%</div>
        </div>
      `).join('')}
    </section>
  `;
}

function renderAnalisis(container) {
  container.innerHTML = `
    <section class="card">
      <div class="row" style="justify-content: space-between;">
        <h3>Grafo financiero (simulado)</h3>
        <div class="row">
          <button class="btn btn-outline" data-algo="bfs">BFS</button>
          <button class="btn btn-outline" data-algo="dfs">DFS</button>
          <button class="btn btn-outline" data-algo="dijkstra">Dijkstra</button>
          <button class="btn btn-outline" data-algo="bellman">Bellman-Ford</button>
          <button class="btn btn-outline" data-algo="floyd">Floyd-Warshall</button>
        </div>
      </div>
      <canvas id="graphCanvas" height="220"></canvas>
      <div class="muted" id="algoInfo">Tiempo: 0 ms • Complejidad: O(1)</div>
    </section>
    <section class="card">
      <h3>Insight</h3>
      <p>Tu ruta de gasto óptima reduce 15% tus egresos (simulado).</p>
    </section>
  `;

  drawGraph();
  document.querySelectorAll('[data-algo]').forEach(btn => {
    btn.addEventListener('click', () => runAlgo(btn.dataset.algo));
  });
}

function renderReportes(container) {
  container.innerHTML = `
    <section class="grid cols-2">
      <div class="card">
        <h3>Comparación mensual</h3>
        <canvas id="reportChart" height="160"></canvas>
      </div>
      <div class="card">
        <h3>Exportar</h3>
        <div class="row">
          <button class="btn btn-outline" id="csvBtn">Exportar CSV</button>
          <button class="btn btn-primary" id="pdfBtn">Generar reporte mensual</button>
        </div>
        <p class="muted">Alertas: Sobreendeudamiento leve en entretenimiento; ahorro por debajo de meta.</p>
      </div>
    </section>
  `;

  const ctx = document.getElementById('reportChart');
  new Chart(ctx, {
    type: 'bar',
    data: { labels: ['Jul', 'Ago', 'Sep'], datasets: [
      { label: 'Ingresos', data: [2000, 2100, 2200], backgroundColor: '#39B54A' },
      { label: 'Egresos', data: [1200, 1250, 1300], backgroundColor: '#004C6D' }
    ]},
    options: { plugins: { legend: { position: 'bottom' } }, responsive: true }
  });

  document.getElementById('csvBtn').addEventListener('click', exportCSV);
  document.getElementById('pdfBtn').addEventListener('click', exportPDF);
}

// Grafo simulado
function drawGraph() {
  const canvas = document.getElementById('graphCanvas');
  const ctx = canvas.getContext('2d');
  const nodes = [
    { x: 60, y: 100, r: 18, label: 'Alim.' },
    { x: 160, y: 60, r: 18, label: 'Transp.' },
    { x: 240, y: 110, r: 18, label: 'Educ.' },
    { x: 320, y: 70, r: 18, label: 'Entre.' },
    { x: 400, y: 120, r: 18, label: 'Salud' },
  ];
  const edges = [ [0,1],[1,2],[2,3],[3,4],[0,2],[1,3] ];
  ctx.clearRect(0,0,canvas.width, canvas.height);
  ctx.strokeStyle = '#93c5fd';
  ctx.lineWidth = 2;
  edges.forEach(([a,b]) => {
    ctx.beginPath();
    ctx.moveTo(nodes[a].x, nodes[a].y);
    ctx.lineTo(nodes[b].x, nodes[b].y);
    ctx.stroke();
  });
  nodes.forEach(n => {
    ctx.fillStyle = '#004C6D';
    ctx.beginPath();
    ctx.arc(n.x, n.y, n.r, 0, Math.PI*2);
    ctx.fill();
    ctx.fillStyle = 'white';
    ctx.font = '12px Poppins';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(n.label, n.x, n.y);
  });
}

function runAlgo(kind) {
  const start = performance.now();
  // Simulación de costo temporal y complejidad
  const complexities = {
    bfs: 'O(V + E)',
    dfs: 'O(V + E)',
    dijkstra: 'O(E log V)',
    bellman: 'O(V · E)',
    floyd: 'O(V^3)'
  };
  // Simula trabajo
  for (let i = 0; i < 5e5; i++) {}
  const elapsed = Math.round(performance.now() - start);
  const info = document.getElementById('algoInfo');
  info.textContent = `Tiempo: ${elapsed} ms • Complejidad: ${complexities[kind] || 'O(1)'}`;
}

// Exportaciones
function exportCSV() {
  const rows = [
    ['Fecha','Categoría','Monto'],
    ['2025-09-30','Alimentación','-12.5'],
    ['2025-09-29','Educación','-85'],
    ['2025-09-25','Ingresos','600']
  ];
  const csv = rows.map(r => r.join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'finanzen_reporte.csv'; a.click();
  URL.revokeObjectURL(url);
}

async function exportPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.setFont('helvetica','bold');
  doc.text('Reporte Mensual - FinanZen', 14, 20);
  doc.setFont('helvetica','normal');
  doc.text(`Saldo: ${formatMoney(mockKpis.saldo)}`, 14, 32);
  doc.text(`Gasto del mes: ${formatMoney(mockKpis.gastoMes)}`, 14, 40);
  doc.text(`Ahorro: ${formatMoney(mockKpis.ahorro)}`, 14, 48);
  doc.text('Comparación (Jul-Ago-Sep): Ingresos [2000,2100,2200], Egresos [1200,1250,1300]', 14, 60, { maxWidth: 180 });
  doc.save('finanzen_reporte.pdf');
}

// Router simple
function navigate(route) {
  const container = document.getElementById('viewContainer');
  setActive(route);
  if (route === 'dashboard') return renderDashboard(container);
  if (route === 'transacciones') return renderTransacciones(container);
  if (route === 'metas') return renderMetas(container);
  if (route === 'analisis') return renderAnalisis(container);
  if (route === 'reportes') return renderReportes(container);
}

// Init
document.addEventListener('DOMContentLoaded', () => {
  // Iconos
  if (window.lucide) window.lucide.createIcons();

  // Login simulado
  const authForm = document.getElementById('authForm');
  authForm.addEventListener('submit', (e) => {
    e.preventDefault();
    closeAuth();
    mountGreeting();
    navigate('dashboard');
  });
  document.getElementById('signupBtn').addEventListener('click', () => {
    closeAuth();
    mountGreeting();
    navigate('dashboard');
  });

  // Sidebar toggle móvil
  const sidebar = document.getElementById('sidebar');
  const menuToggle = document.getElementById('menuToggle');
  menuToggle.addEventListener('click', () => sidebar.classList.toggle('open'));

  // Navegación
  document.querySelectorAll('.nav-item[data-route]').forEach(btn => {
    btn.addEventListener('click', () => {
      navigate(btn.dataset.route);
      if (sidebar.classList.contains('open')) sidebar.classList.remove('open');
    });
  });
  document.getElementById('logoutBtn').addEventListener('click', () => {
    // Reinicia al login
    document.getElementById('authOverlay').style.display = 'grid';
    document.getElementById('viewContainer').innerHTML = '';
    setActive('');
    document.getElementById('greetingText').textContent = 'Hola';
  });
});


