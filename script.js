const data = window.PRACTICE_DATA;
const app = document.querySelector("#app");
const ccppLogo = document.querySelector("#ccppLogo");
const evidenceViewer = document.querySelector("#evidenceViewer");
const viewerImage = document.querySelector("#viewerImage");
const viewerVideo = document.querySelector("#viewerVideo");
const viewerType = document.querySelector("#viewerType");
const viewerTitle = document.querySelector("#viewerTitle");
const viewerCounter = document.querySelector("#viewerCounter");
const viewerCaption = document.querySelector("#viewerCaption");
const viewerLoading = document.querySelector("#viewerLoading");
const openEvidenceFile = document.querySelector("#openEvidenceFile");
const closeEvidenceViewerButton = document.querySelector("#closeEvidenceViewer");
const previousEvidenceButton = document.querySelector("#previousEvidence");
const nextEvidenceButton = document.querySelector("#nextEvidence");
const pdfBook = document.querySelector("#pdfBook");
const bookPages = document.querySelector("#bookPages");
const pdfPageLeft = document.querySelector("#pdfPageLeft");
const pdfPageRight = document.querySelector("#pdfPageRight");
const previousPdfPageButton = document.querySelector("#previousPdfPage");
const nextPdfPageButton = document.querySelector("#nextPdfPage");
const pdfPageStatus = document.querySelector("#pdfPageStatus");

const activities = data.activities;
const axes = data.axes;
let activeAxisFilter = "Todos";
let searchTerm = "";
let pdfJsPromise;
let viewerSession = 0;

const viewerState = {
  activity: null,
  items: [],
  index: 0,
  pdfDocument: null,
  pdfLoadingTask: null,
  pdfRenderTasks: [],
  pdfRenderVersion: 0,
  pdfPage: 1,
};

const GOAL_STATS = {
  1: [["6", "piezas registradas"], ["6", "evidencias visuales"], ["1", "saludo por fecha"]],
  2: [["50+", "participantes"], ["5", "evidencias"], ["1", "video publicado"]],
  3: [["6", "reuniones"], ["1", "frecuencia semanal"], ["4", "evidencias"]],
  4: [["1", "canal digital"], ["2", "evidencias"], ["100%", "identificación opcional"]],
  5: [["4", "sesiones mensuales previstas"], ["70%", "participación objetivo"], ["2", "registros"]],
  6: [["3", "dinámicas ejecutadas"], ["3", "meses de aplicación"], ["70%", "participación objetivo"]],
  7: [["1", "campaña activa"], ["S/ 0", "publicidad pagada"], ["6", "evidencias"]],
  8: [["2", "sedes atendidas"], ["4", "registros visuales"], ["1", "archivo institucional"]],
  9: [["2", "ceremonias coordinadas"], ["1", "curso especializado"], ["4", "evidencias"]],
  10: [["1", "programa protocolar"], ["1", "conducción realizada"], ["4", "evidencias"]],
  11: [["2", "acciones conmemorativas"], ["S/ 400", "presupuesto institucional"], ["16", "evidencias"]],
  12: [["6", "disciplinas"], ["8", "delegaciones"], ["5", "registros visuales"]],
  13: [["15", "medios como meta mínima"], ["1", "canal de prensa"], ["2", "evidencias"]],
  14: [["14", "páginas producidas"], ["4", "páginas como meta mínima"], ["1", "edición digital"]],
  15: [["1", "manual corporativo"], ["1", "archivo editable"], ["1", "versión PDF"]],
  16: [["4", "periódicos murales"], ["4", "niveles actualizados"], ["12", "evidencias"]],
  17: [["17", "videos producidos"], ["16", "videos planificados"], ["106%", "cumplimiento"]],
  18: [["6", "transmisiones"], ["3", "colegiaturas"], ["2", "emisiones IA QUIPU"]],
  19: [["4", "meses programados"], ["80%", "ejecución objetivo"], ["1", "calendario editorial"]],
  20: [["5+", "propuestas"], ["1", "ficha de revisión"], ["6", "capturas"]],
  21: [["5", "tipos de plantilla"], ["1", "guía básica"], ["5", "evidencias"]],
  22: [["22", "evidencias visuales"], ["4", "meses atendidos"], ["0", "piezas con pauta pagada"]],
  23: [["8", "delegaciones registradas"], ["6", "disciplinas"], ["2", "evidencias"]],
};

function assetPath(path) {
  return encodeURI(path);
}

function escapeHTML(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function plural(value, singular, pluralText) {
  return `${value} ${value === 1 ? singular : pluralText}`;
}

function routeForAxis(name) {
  return `#/eje/${encodeURIComponent(name)}`;
}

function routeForActivity(id) {
  return `#/actividad/${id}`;
}

function activitiesForAxis(name) {
  return activities.filter((activity) => activity.axis === name);
}

function coverFor(activity) {
  return activity.media.find((file) => file.type === "image");
}

function totalsFor(list = activities) {
  return list.reduce(
    (totals, activity) => {
      totals.images += activity.counts.images;
      totals.videos += activity.counts.videos;
      totals.documents += activity.counts.documents;
      return totals;
    },
    { images: 0, videos: 0, documents: 0 }
  );
}

function activityCard(activity) {
  const cover = coverFor(activity);
  return `
    <a class="activity-card" href="${routeForActivity(activity.id)}">
      <div class="activity-image">
        ${cover
          ? `<img src="${assetPath(cover.thumb)}" alt="" loading="lazy">`
          : `<div class="image-placeholder" aria-hidden="true"><span>${String(activity.id).padStart(2, "0")}</span></div>`}
        <span class="activity-id">${String(activity.id).padStart(2, "0")}</span>
      </div>
      <div class="activity-copy">
        <p>${escapeHTML(activity.axis)}</p>
        <h3>${escapeHTML(activity.title)}</h3>
        <span>Ver actividad <b aria-hidden="true">→</b></span>
      </div>
    </a>
  `;
}

function axisLink(axis, index, full = false) {
  const axisActivities = activitiesForAxis(axis.name);
  return `
    <a class="axis-link accent-${escapeHTML(axis.accent)} ${full ? "axis-link-full" : ""}" href="${routeForAxis(axis.name)}">
      <span class="axis-number">${String(index + 1).padStart(2, "0")}</span>
      <span class="axis-link-copy">
        <strong>${escapeHTML(axis.name)}</strong>
        ${full ? `<small>${escapeHTML(axis.description)}</small>` : ""}
      </span>
      <span class="axis-count">${plural(axisActivities.length, "actividad", "actividades")}</span>
      <b aria-hidden="true">→</b>
    </a>
  `;
}

function pageIntro(kicker, title, copy = "") {
  return `
    <header class="page-intro">
      <p class="kicker">${escapeHTML(kicker)}</p>
      <h1>${escapeHTML(title)}</h1>
      ${copy ? `<p class="page-lead">${escapeHTML(copy)}</p>` : ""}
    </header>
  `;
}

function renderHome() {
  document.title = "Portafolio de prácticas | Chabely Parizaca";
  app.innerHTML = `
    <section class="profile-hero">
      <div class="profile-hero-inner content-width">
        <div class="profile-photo" aria-label="Espacio para la fotografía de Chabely">
          ${data.practitionerPhoto
            ? `<img src="${assetPath(data.practitionerPhoto)}" alt="Chabely Dianeth Parizaca Pinaso">`
            : `<div class="profile-photo-placeholder" aria-hidden="true"><span>CP</span></div>`}
          <small>Fotografía de la practicante</small>
        </div>

        <div class="profile-copy">
          <p class="kicker">Portafolio de prácticas preprofesionales</p>
          <h1>${escapeHTML(data.practitioner)}</h1>
          <p class="profile-subtitle">Comunicación organizacional aplicada a la vida institucional.</p>

          <dl class="practice-facts">
            <div>
              <dt>Centro de prácticas</dt>
              <dd>Colegio de Contadores Públicos de Puno</dd>
            </div>
            <div>
              <dt>Periodo</dt>
              <dd>13 de abril — 13 de julio de 2026</dd>
            </div>
            <div>
              <dt>Área</dt>
              <dd>Comunicación Organizacional</dd>
            </div>
          </dl>

          <div class="profile-actions">
            <button class="button button-dark" type="button" data-scroll="indice">Ver índice</button>
            <a class="text-link" href="#/actividades">Explorar las 23 actividades <span aria-hidden="true">→</span></a>
          </div>
        </div>
      </div>
    </section>

    <section class="portfolio-index content-width" id="indice">
      <div class="index-heading">
        <div>
          <p class="kicker">Índice del portafolio</p>
          <h2>Ejes y actividades</h2>
        </div>
        <p>Selecciona un eje para conocer su propósito o abre directamente una actividad.</p>
      </div>

      <div class="index-grid">
        ${axes.map((axis, index) => {
          const axisActivities = activitiesForAxis(axis.name);
          return `
            <article class="index-axis accent-${escapeHTML(axis.accent)}">
              <a class="index-axis-title" href="${routeForAxis(axis.name)}">
                <span>${String(index + 1).padStart(2, "0")}</span>
                <strong>${escapeHTML(axis.name)}</strong>
                <small>${plural(axisActivities.length, "actividad", "actividades")}</small>
                <b aria-hidden="true">→</b>
              </a>
              <ol>
                ${axisActivities.map((activity) => `
                  <li>
                    <a href="${routeForActivity(activity.id)}">
                      <span>${String(activity.id).padStart(2, "0")}</span>
                      <strong>${escapeHTML(activity.title)}</strong>
                    </a>
                  </li>
                `).join("")}
              </ol>
            </article>
          `;
        }).join("")}
      </div>
    </section>
  `;
}

function renderAxes() {
  document.title = "Ejes de trabajo | Portafolio de prácticas";
  app.innerHTML = `
    <div class="page-shell content-width">
      ${pageIntro(
        "8 ejes de trabajo",
        "Una práctica, distintas formas de comunicar",
        "Cada eje reúne objetivos concretos y actividades desarrolladas dentro del Colegio de Contadores Públicos de Puno."
      )}
      <section class="axis-list axis-catalog" aria-label="Ejes de trabajo">
        ${axes.map((axis, index) => axisLink(axis, index, true)).join("")}
      </section>
    </div>
  `;
}

function renderAxis(name) {
  const axis = axes.find((item) => item.name === name);
  if (!axis) {
    renderNotFound();
    return;
  }

  const list = activitiesForAxis(axis.name);
  const totals = totalsFor(list);
  document.title = `${axis.name} | Portafolio de prácticas`;
  app.innerHTML = `
    <div class="page-shell content-width">
      <a class="back-link" href="#/ejes"><span aria-hidden="true">←</span> Todos los ejes</a>
      <section class="axis-hero accent-${escapeHTML(axis.accent)}">
        <div>
          <p class="kicker">Eje de trabajo</p>
          <h1>${escapeHTML(axis.name)}</h1>
          <p>${escapeHTML(axis.description)}</p>
        </div>
        <aside class="axis-objective">
          <span>Objetivo</span>
          <p>${escapeHTML(axis.goal)}</p>
        </aside>
      </section>

      <section class="axis-stats" aria-label="Resumen del eje">
        <span><strong>${list.length}</strong> actividades</span>
        <span><strong>${totals.images}</strong> imágenes</span>
        <span><strong>${totals.videos + totals.documents}</strong> archivos</span>
      </section>

      <section class="section axis-activities">
        <div class="section-heading compact-heading">
          <div>
            <p class="kicker">Actividades del eje</p>
            <h2>${plural(list.length, "actividad", "actividades")}</h2>
          </div>
        </div>
        <div class="activity-grid">${list.map(activityCard).join("")}</div>
      </section>
    </div>
  `;
}

function filteredActivities() {
  const query = searchTerm.trim().toLowerCase();
  return activities.filter((activity) => {
    const matchesAxis = activeAxisFilter === "Todos" || activity.axis === activeAxisFilter;
    const searchable = `${activity.title} ${activity.axis} ${activity.description} ${activity.done}`.toLowerCase();
    return matchesAxis && (!query || searchable.includes(query));
  });
}

function renderActivityResults() {
  const grid = document.querySelector("#activityGrid");
  const count = document.querySelector("#resultCount");
  if (!grid || !count) return;

  const list = filteredActivities();
  count.textContent = plural(list.length, "actividad", "actividades");
  grid.innerHTML = list.length
    ? list.map(activityCard).join("")
    : `<div class="empty-state"><strong>Sin resultados</strong><p>Prueba con otro término o selecciona otro eje.</p></div>`;
}

function renderActivities() {
  document.title = "Actividades | Portafolio de prácticas";
  app.innerHTML = `
    <div class="page-shell content-width">
      <div class="activities-heading">
        ${pageIntro(
          "23 actividades",
          "Trabajo realizado",
          "Consulta cada actividad, sus metas y sus evidencias sin salir del portafolio."
        )}
        <p class="result-count" id="resultCount"></p>
      </div>

      <section class="filter-bar" aria-label="Filtros de actividades">
        <label class="search-field">
          <span class="sr-only">Buscar una actividad</span>
          <input id="searchInput" type="search" value="${escapeHTML(searchTerm)}" placeholder="Buscar actividad..." autocomplete="off">
        </label>
        <div class="filter-tabs" id="axisFilters">
          ${["Todos", ...axes.map((axis) => axis.name)].map((name) => `
            <button type="button" data-filter="${escapeHTML(name)}" aria-pressed="${name === activeAxisFilter}">${escapeHTML(name)}</button>
          `).join("")}
        </div>
      </section>

      <section class="activity-grid activity-catalog" id="activityGrid" aria-live="polite"></section>
    </div>
  `;

  document.querySelector("#searchInput").addEventListener("input", (event) => {
    searchTerm = event.target.value;
    renderActivityResults();
  });

  document.querySelector("#axisFilters").addEventListener("click", (event) => {
    const button = event.target.closest("button[data-filter]");
    if (!button) return;
    activeAxisFilter = button.dataset.filter;
    document.querySelectorAll("#axisFilters button").forEach((item) => {
      item.setAttribute("aria-pressed", String(item === button));
    });
    renderActivityResults();
  });

  renderActivityResults();
}

function evidenceLabel(file) {
  if (file.type === "video") return "Video";
  if (file.type === "image") return "Fotografía";
  const extension = file.name.split(".").pop()?.toUpperCase();
  return extension || "Archivo";
}

function evidenceItems(activity) {
  const order = { image: 0, video: 1, document: 2 };
  return [...activity.media].sort((a, b) => (order[a.type] ?? 3) - (order[b.type] ?? 3));
}

function friendlyFileName(file) {
  const names = {
    "invitacion-dia-madre-web.mp4": "Invitación por el Día de la Madre",
    "mensaje-dia-madre-decano-web.mp4": "Mensaje del decano por el Día de la Madre",
    "mensaje-dia-padre-decano-web.mp4": "Mensaje del decano por el Día del Padre",
    "mensaje-dia-padre-web.mp4": "Video por el Día del Padre",
  };
  return names[file.name] || file.name.replace(/-web(?=\.[^.]+$)/i, "");
}

function renderGoalStats(activity) {
  const stats = GOAL_STATS[activity.id] || [
    [String(activity.counts.images + activity.counts.videos + activity.counts.documents), "evidencias"],
    [String(activity.counts.images), "fotografías"],
    [String(activity.counts.documents), "documentos"],
  ];

  return `
    <div class="goal-stats" aria-label="Estadísticas de las metas alcanzadas">
      ${stats.map(([value, label]) => `
        <div>
          <strong>${escapeHTML(value)}</strong>
          <span>${escapeHTML(label)}</span>
        </div>
      `).join("")}
    </div>
  `;
}

function renderEvidenceNavigator(activity) {
  const items = evidenceItems(activity);
  if (!items.length) return `<p class="empty-inline">Esta actividad no incluye evidencias digitales.</p>`;
  const total = items.length;

  return `
    <div class="evidence-navigator">
      <div class="evidence-summary">
        <p>${plural(total, "evidencia disponible", "evidencias disponibles")}</p>
        <div aria-label="Tipos de evidencia">
          <span><strong>${activity.counts.images}</strong> fotos</span>
          <span><strong>${activity.counts.videos}</strong> videos</span>
          <span><strong>${activity.counts.documents}</strong> PDF</span>
        </div>
      </div>
      <button class="evidence-open" type="button" data-open-evidence="${activity.id}" data-evidence-index="0">
        <span>ABRIR VISOR DE EVIDENCIAS</span>
        <b aria-hidden="true">→</b>
      </button>
    </div>
  `;
}

function renderActivity(id) {
  const activity = activities.find((item) => item.id === id);
  if (!activity) {
    renderNotFound();
    return;
  }

  const cover = coverFor(activity);
  const itemList = evidenceItems(activity);
  const coverIndex = cover ? itemList.indexOf(cover) : 0;
  const related = activitiesForAxis(activity.axis).filter((item) => item.id !== activity.id).slice(0, 3);
  const previous = activities.find((item) => item.id === activity.id - 1);
  const next = activities.find((item) => item.id === activity.id + 1);
  document.title = `Actividad ${activity.id} | ${activity.title}`;

  app.innerHTML = `
    <article class="activity-detail">
      <div class="content-width">
        <a class="back-link" href="${routeForAxis(activity.axis)}"><span aria-hidden="true">←</span> ${escapeHTML(activity.axis)}</a>
      </div>

      <header class="detail-header content-width">
        <div class="detail-title">
          <p class="kicker">Actividad ${String(activity.id).padStart(2, "0")}</p>
          <h1>${escapeHTML(activity.title)}</h1>
          <span class="detail-axis">${escapeHTML(activity.axis)}</span>
        </div>
        ${cover ? `
          <button class="detail-cover" type="button" data-open-evidence="${activity.id}" data-evidence-index="${coverIndex}">
            <img src="${assetPath(cover.thumb)}" alt="Evidencia principal de ${escapeHTML(activity.title)}">
          </button>
        ` : `<div class="detail-cover detail-cover-empty"><strong>${String(activity.id).padStart(2, "0")}</strong></div>`}
      </header>

      <div class="detail-layout content-width">
        <aside class="detail-index">
          <p>En esta actividad</p>
          <button type="button" data-scroll="descripcion">Descripción</button>
          <button type="button" data-scroll="realizado">Lo realizado</button>
          <button type="button" data-scroll="metas">Metas alcanzadas</button>
          <button class="detail-evidence-open" type="button" data-open-evidence="${activity.id}" data-evidence-index="0">Abrir evidencias →</button>
          <dl>
            <div><dt>Periodo</dt><dd>13 abr — 13 jul</dd></div>
            <div><dt>Materiales</dt><dd>${activity.counts.images + activity.counts.videos + activity.counts.documents}</dd></div>
          </dl>
        </aside>

        <div class="detail-content">
          <section id="descripcion" class="detail-section">
            <span>01</span>
            <h2>Descripción</h2>
            <p>${escapeHTML(activity.description)}</p>
          </section>
          <section id="realizado" class="detail-section">
            <span>02</span>
            <h2>Lo realizado</h2>
            <p>${escapeHTML(activity.done)}</p>
          </section>
          <section id="metas" class="detail-section">
            <span>03</span>
            <h2>Metas alcanzadas</h2>
            <p>${escapeHTML(activity.goals)}</p>
            ${renderGoalStats(activity)}
          </section>
          ${activity.observation ? `
            <aside class="detail-note">
              <strong>Punto por confirmar</strong>
              <p>${escapeHTML(activity.observation)}</p>
            </aside>
          ` : ""}
          <section id="evidencias" class="detail-section evidence-section">
            <span>04</span>
            <h2>Evidencias</h2>
            ${renderEvidenceNavigator(activity)}
          </section>
        </div>
      </div>

      ${related.length ? `
        <section class="related-section section-tint">
          <div class="content-width">
            <div class="section-heading compact-heading">
              <div><p class="kicker">Continúa explorando</p><h2>Del mismo eje</h2></div>
            </div>
            <div class="activity-grid featured-grid">${related.map(activityCard).join("")}</div>
          </div>
        </section>
      ` : ""}

      <nav class="detail-pager content-width" aria-label="Navegación entre actividades">
        ${previous ? `<a href="${routeForActivity(previous.id)}"><span>Anterior</span><strong>← Actividad ${previous.id}</strong></a>` : `<span></span>`}
        <a class="pager-all" href="#/actividades">Todas las actividades</a>
        ${next ? `<a class="pager-next" href="${routeForActivity(next.id)}"><span>Siguiente</span><strong>Actividad ${next.id} →</strong></a>` : `<span></span>`}
      </nav>
    </article>
  `;
}

function renderNotFound() {
  document.title = "Vista no encontrada | Portafolio de prácticas";
  app.innerHTML = `
    <section class="not-found content-width">
      <p class="kicker">Portafolio de prácticas</p>
      <h1>Esta vista no está disponible.</h1>
      <a class="button button-primary" href="#/inicio">Volver al inicio</a>
    </section>
  `;
}

function currentRoute() {
  const value = window.location.hash.replace(/^#\/?/, "");
  return value ? value.split("/") : ["inicio"];
}

function updateNavigation(section) {
  const active = section === "eje" ? "ejes" : section === "actividad" ? "actividades" : section;
  document.querySelectorAll("[data-nav]").forEach((link) => {
    link.setAttribute("aria-current", link.dataset.nav === active ? "page" : "false");
  });
}

function renderRoute() {
  if (!evidenceViewer.hidden) closeEvidenceViewer();
  const [section, value] = currentRoute();
  updateNavigation(section);

  if (section === "inicio") renderHome();
  else if (section === "ejes" && !value) renderAxes();
  else if (section === "eje" && value) renderAxis(decodeURIComponent(value));
  else if (section === "actividades" && !value) renderActivities();
  else if (section === "actividad" && value) renderActivity(Number(value));
  else renderNotFound();

  window.scrollTo({ top: 0, behavior: "auto" });
  app.focus({ preventScroll: true });
}

function loadPdfJs() {
  if (!pdfJsPromise) {
    pdfJsPromise = import("./assets/vendor/pdfjs/pdf.min.mjs").then((pdfjs) => {
      pdfjs.GlobalWorkerOptions.workerSrc = new URL(
        "assets/vendor/pdfjs/pdf.worker.min.mjs",
        document.baseURI
      ).href;
      return pdfjs;
    });
  }
  return pdfJsPromise;
}

function releasePdfDocument() {
  viewerState.pdfRenderVersion += 1;
  viewerState.pdfRenderTasks.forEach((task) => task.cancel());
  viewerState.pdfRenderTasks = [];
  if (viewerState.pdfLoadingTask) {
    viewerState.pdfLoadingTask.destroy().catch(() => {});
  } else if (viewerState.pdfDocument) {
    viewerState.pdfDocument.destroy().catch(() => {});
  }
  viewerState.pdfLoadingTask = null;
  viewerState.pdfDocument = null;
  viewerState.pdfPage = 1;
}

function resetViewerMedia() {
  viewerImage.hidden = true;
  viewerImage.removeAttribute("src");
  viewerVideo.pause();
  viewerVideo.hidden = true;
  viewerVideo.removeAttribute("src");
  viewerVideo.load();
  pdfBook.hidden = true;
  bookPages.hidden = false;
  viewerLoading.hidden = true;
}

async function renderPdfCanvas(pageNumber, canvas, session, renderVersion) {
  const pdf = viewerState.pdfDocument;
  if (!pdf || pageNumber > pdf.numPages) {
    canvas.hidden = true;
    return;
  }

  const page = await pdf.getPage(pageNumber);
  if (session !== viewerSession || renderVersion !== viewerState.pdfRenderVersion) return;

  const baseViewport = page.getViewport({ scale: 1 });
  const singlePage = window.matchMedia("(max-width: 760px)").matches;
  const availableWidth = singlePage
    ? Math.min(window.innerWidth - 120, 620)
    : Math.min((window.innerWidth - 260) / 2, 560);
  const availableHeight = Math.max(280, window.innerHeight - (singlePage ? 240 : 210));
  const cssScale = Math.max(
    0.25,
    Math.min(availableWidth / baseViewport.width, availableHeight / baseViewport.height)
  );
  const outputScale = Math.min(window.devicePixelRatio || 1, 1.75);
  const viewport = page.getViewport({ scale: cssScale * outputScale });
  const context = canvas.getContext("2d", { alpha: false });

  canvas.width = Math.floor(viewport.width);
  canvas.height = Math.floor(viewport.height);
  canvas.style.width = `${Math.floor(viewport.width / outputScale)}px`;
  canvas.style.height = `${Math.floor(viewport.height / outputScale)}px`;
  canvas.hidden = false;

  const renderTask = page.render({ canvasContext: context, viewport });
  viewerState.pdfRenderTasks.push(renderTask);
  try {
    await renderTask.promise;
  } finally {
    viewerState.pdfRenderTasks = viewerState.pdfRenderTasks.filter((task) => task !== renderTask);
  }
}

async function renderPdfSpread(direction = "") {
  const pdf = viewerState.pdfDocument;
  if (!pdf) return;

  const session = viewerSession;
  viewerState.pdfRenderTasks.forEach((task) => task.cancel());
  viewerState.pdfRenderTasks = [];
  const renderVersion = ++viewerState.pdfRenderVersion;
  const singlePage = window.matchMedia("(max-width: 760px)").matches;
  const rightPage = singlePage ? null : viewerState.pdfPage + 1;
  viewerLoading.textContent = "Preparando páginas...";
  viewerLoading.hidden = false;

  if (direction) {
    bookPages.classList.remove("turn-forward", "turn-backward");
    void bookPages.offsetWidth;
    bookPages.classList.add(direction === "next" ? "turn-forward" : "turn-backward");
  }

  try {
    await Promise.all([
      renderPdfCanvas(viewerState.pdfPage, pdfPageLeft, session, renderVersion),
      rightPage ? renderPdfCanvas(rightPage, pdfPageRight, session, renderVersion) : Promise.resolve((pdfPageRight.hidden = true)),
    ]);
    if (session !== viewerSession || renderVersion !== viewerState.pdfRenderVersion) return;

    const endPage = rightPage && rightPage <= pdf.numPages ? rightPage : viewerState.pdfPage;
    pdfPageStatus.textContent = endPage === viewerState.pdfPage
      ? `Página ${viewerState.pdfPage} de ${pdf.numPages}`
      : `Páginas ${viewerState.pdfPage}–${endPage} de ${pdf.numPages}`;
    previousPdfPageButton.disabled = viewerState.pdfPage <= 1;
    nextPdfPageButton.disabled = endPage >= pdf.numPages;
  } catch (error) {
    if (session !== viewerSession || renderVersion !== viewerState.pdfRenderVersion) return;
    pdfPageStatus.textContent = "No se pudieron preparar estas páginas.";
  } finally {
    if (session === viewerSession && renderVersion === viewerState.pdfRenderVersion) viewerLoading.hidden = true;
  }
}

async function showPdf(item, session) {
  pdfBook.hidden = false;
  viewerLoading.textContent = "Preparando libro digital...";
  viewerLoading.hidden = false;
  pdfPageStatus.textContent = "Cargando documento...";

  try {
    const pdfjs = await loadPdfJs();
    if (session !== viewerSession) return;
    viewerState.pdfLoadingTask = pdfjs.getDocument({ url: assetPath(item.path) });
    viewerState.pdfDocument = await viewerState.pdfLoadingTask.promise;
    viewerState.pdfLoadingTask = null;
    if (session !== viewerSession) return;
    viewerState.pdfPage = 1;
    await renderPdfSpread();
  } catch (error) {
    if (session !== viewerSession) return;
    bookPages.hidden = true;
    pdfPageStatus.textContent = "No se pudo cargar el libro aquí. Usa el icono ↗ para abrir el PDF original.";
    viewerLoading.hidden = true;
  }
}

function updateEvidenceViewer() {
  const item = viewerState.items[viewerState.index];
  if (!item || !viewerState.activity) return;

  const session = ++viewerSession;
  releasePdfDocument();
  resetViewerMedia();

  viewerType.textContent = evidenceLabel(item).toUpperCase();
  viewerTitle.textContent = friendlyFileName(item);
  viewerCounter.textContent = `${viewerState.index + 1} / ${viewerState.items.length}`;
  viewerCaption.textContent = `Actividad ${String(viewerState.activity.id).padStart(2, "0")} · ${viewerState.activity.title}`;
  openEvidenceFile.href = assetPath(item.path);
  previousEvidenceButton.disabled = viewerState.items.length < 2;
  nextEvidenceButton.disabled = viewerState.items.length < 2;

  if (item.type === "image") {
    viewerImage.src = assetPath(item.path);
    viewerImage.alt = `Evidencia de ${viewerState.activity.title}`;
    viewerImage.hidden = false;
  } else if (item.type === "video") {
    viewerVideo.src = assetPath(item.path);
    viewerVideo.hidden = false;
    viewerVideo.load();
  } else if (item.name.toLowerCase().endsWith(".pdf")) {
    showPdf(item, session);
  }
}

function openEvidenceViewer(activityId, index = 0) {
  const activity = activities.find((item) => item.id === Number(activityId));
  const items = activity ? evidenceItems(activity) : [];
  if (!activity || !items.length) return;

  viewerState.activity = activity;
  viewerState.items = items;
  viewerState.index = Math.min(Math.max(Number(index) || 0, 0), items.length - 1);
  evidenceViewer.hidden = false;
  document.body.classList.add("modal-open");
  updateEvidenceViewer();
  closeEvidenceViewerButton.focus();
}

function changeEvidence(step) {
  if (viewerState.items.length < 2) return;
  viewerState.index = (viewerState.index + step + viewerState.items.length) % viewerState.items.length;
  updateEvidenceViewer();
}

function closeEvidenceViewer() {
  viewerSession += 1;
  releasePdfDocument();
  resetViewerMedia();
  evidenceViewer.hidden = true;
  viewerState.activity = null;
  viewerState.items = [];
  document.body.classList.remove("modal-open");
}

function changePdfPages(direction) {
  const pdf = viewerState.pdfDocument;
  if (!pdf) return;
  const step = window.matchMedia("(max-width: 760px)").matches ? 1 : 2;
  const nextPage = direction === "next"
    ? Math.min(viewerState.pdfPage + step, pdf.numPages)
    : Math.max(1, viewerState.pdfPage - step);
  if (nextPage === viewerState.pdfPage) return;
  viewerState.pdfPage = nextPage;
  renderPdfSpread(direction);
}

app.addEventListener("click", (event) => {
  const scrollControl = event.target.closest("[data-scroll]");
  if (scrollControl) {
    document.getElementById(scrollControl.dataset.scroll)?.scrollIntoView({ behavior: "smooth" });
    return;
  }

  const evidenceControl = event.target.closest("[data-open-evidence]");
  if (evidenceControl) {
    openEvidenceViewer(evidenceControl.dataset.openEvidence, evidenceControl.dataset.evidenceIndex);
  }
});

closeEvidenceViewerButton.addEventListener("click", closeEvidenceViewer);
previousEvidenceButton.addEventListener("click", () => changeEvidence(-1));
nextEvidenceButton.addEventListener("click", () => changeEvidence(1));
previousPdfPageButton.addEventListener("click", () => changePdfPages("previous"));
nextPdfPageButton.addEventListener("click", () => changePdfPages("next"));
evidenceViewer.addEventListener("click", (event) => {
  if (event.target === evidenceViewer) closeEvidenceViewer();
});
document.addEventListener("keydown", (event) => {
  if (evidenceViewer.hidden) return;
  if (event.key === "Escape") {
    closeEvidenceViewer();
    return;
  }
  if (event.target === viewerVideo) return;

  const inBookControls = event.target.closest?.(".book-controls");
  if (event.key === "ArrowLeft") {
    event.preventDefault();
    inBookControls ? changePdfPages("previous") : changeEvidence(-1);
  }
  if (event.key === "ArrowRight") {
    event.preventDefault();
    inBookControls ? changePdfPages("next") : changeEvidence(1);
  }
});

let pdfResizeTimer;
window.addEventListener("resize", () => {
  clearTimeout(pdfResizeTimer);
  pdfResizeTimer = setTimeout(() => {
    if (!evidenceViewer.hidden && viewerState.pdfDocument) renderPdfSpread();
  }, 180);
});

ccppLogo.src = assetPath(data.logo);
window.addEventListener("hashchange", renderRoute);
renderRoute();
