const data = window.PRACTICE_DATA;
const app = document.querySelector("#app");
const ccppLogo = document.querySelector("#ccppLogo");
const lightbox = document.querySelector("#lightbox");
const lightboxImage = document.querySelector("#lightboxImage");
const lightboxCaption = document.querySelector("#lightboxCaption");
const closeLightboxButton = document.querySelector("#closeLightbox");

const activities = data.activities;
const axes = data.axes;
let activeAxisFilter = "Todos";
let searchTerm = "";

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
  const featured = [activities[9], activities[16], activities[22]].filter(Boolean);
  const heroCover = coverFor(activities[9]) || coverFor(activities[7]);

  document.title = "Portafolio de prácticas | Chabely Parizaca";
  app.innerHTML = `
    <section class="home-hero" style="--hero-image: url('${assetPath(heroCover?.path || data.hero)}')">
      <div class="hero-inner">
        <p class="hero-kicker">Comunicación Organizacional · 2026</p>
        <h1>Prácticas<br>preprofesionales</h1>
        <p class="hero-lead">Colegio de Contadores Públicos de Puno</p>
        <div class="practitioner-line">
          <span>Practicante</span>
          <strong>${escapeHTML(data.practitioner)}</strong>
        </div>
        <div class="hero-actions">
          <a class="button button-primary" href="#/ejes">Explorar ejes</a>
          <a class="button button-ghost" href="#/actividades">Ver actividades</a>
        </div>
      </div>
      <div class="hero-period" aria-label="Periodo de prácticas">
        <span>Inicio<br><strong>13 abr</strong></span>
        <i aria-hidden="true"></i>
        <span>Fin<br><strong>13 jul</strong></span>
      </div>
    </section>

    <section class="home-summary content-width" aria-label="Resumen">
      <div><strong>23</strong><span>actividades</span></div>
      <div><strong>8</strong><span>ejes de trabajo</span></div>
      <div><strong>3 meses</strong><span>de experiencia</span></div>
      <p>Una experiencia enfocada en comunicación interna, protocolo, identidad, contenidos y presencia digital.</p>
    </section>

    <section class="section content-width">
      <div class="section-heading compact-heading">
        <div>
          <p class="kicker">Áreas de experiencia</p>
          <h2>Explora por eje</h2>
        </div>
        <a class="text-link" href="#/ejes">Ver descripción de todos <span aria-hidden="true">→</span></a>
      </div>
      <div class="axis-list home-axis-list">
        ${axes.map((axis, index) => axisLink(axis, index)).join("")}
      </div>
    </section>

    <section class="section section-tint">
      <div class="content-width">
        <div class="section-heading compact-heading">
          <div>
            <p class="kicker">Trabajo realizado</p>
            <h2>Actividades destacadas</h2>
          </div>
          <a class="text-link" href="#/actividades">Ver las 23 actividades <span aria-hidden="true">→</span></a>
        </div>
        <div class="activity-grid featured-grid">
          ${featured.map(activityCard).join("")}
        </div>
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
  const extension = file.name.split(".").pop()?.toUpperCase();
  return extension || "Archivo";
}

function renderEvidenceFiles(activity) {
  const files = activity.media.filter((file) => file.type !== "image");
  if (!files.length) return `<p class="empty-inline">Esta actividad no incluye archivos adicionales.</p>`;

  return `
    <div class="file-list">
      ${files.map((file) => `
        <a href="${assetPath(file.path)}" target="_blank" rel="noopener">
          <span>${escapeHTML(evidenceLabel(file))}</span>
          <strong>${escapeHTML(file.name)}</strong>
          <b aria-hidden="true">↗</b>
        </a>
      `).join("")}
    </div>
  `;
}

function renderGallery(activity) {
  const images = activity.media.filter((file) => file.type === "image");
  if (!images.length) return `<p class="empty-inline">Esta actividad no incluye imágenes.</p>`;

  return `
    <div class="gallery">
      ${images.map((file) => `
        <button type="button" data-full="${assetPath(file.path)}" data-caption="${escapeHTML(activity.title)}">
          <img src="${assetPath(file.thumb)}" alt="Evidencia de ${escapeHTML(activity.title)}" loading="lazy">
        </button>
      `).join("")}
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
          <button class="detail-cover" type="button" data-full="${assetPath(cover.path)}" data-caption="${escapeHTML(activity.title)}">
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
          <button type="button" data-scroll="evidencias">Evidencias</button>
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
            ${renderEvidenceFiles(activity)}
            ${renderGallery(activity)}
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

function openLightbox(path, caption) {
  lightboxImage.src = path;
  lightboxImage.alt = caption;
  lightboxCaption.textContent = caption;
  lightbox.hidden = false;
  document.body.classList.add("modal-open");
  closeLightboxButton.focus();
}

function closeLightbox() {
  lightbox.hidden = true;
  lightboxImage.src = "";
  document.body.classList.remove("modal-open");
}

app.addEventListener("click", (event) => {
  const scrollControl = event.target.closest("[data-scroll]");
  if (scrollControl) {
    document.getElementById(scrollControl.dataset.scroll)?.scrollIntoView({ behavior: "smooth" });
    return;
  }

  const preview = event.target.closest("[data-full]");
  if (preview) openLightbox(preview.dataset.full, preview.dataset.caption || "Evidencia");
});

closeLightboxButton.addEventListener("click", closeLightbox);
lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) closeLightbox();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !lightbox.hidden) closeLightbox();
});

ccppLogo.src = assetPath(data.logo);
window.addEventListener("hashchange", renderRoute);
renderRoute();
