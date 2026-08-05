/* Iglesia Bautista Sin Paredes de Salinas — app de anuncios, ministerios,
   calendario y podcasts. Todos los datos de ejemplo (eventos, horarios,
   fotos) son marcadores de posición: reemplázalos aquí con la información
   real de la iglesia. */

(function () {
  "use strict";

  /* ---------------- Data ---------------- */

  const MINISTRIES = [
    { id: "jovenes", name: "Jóvenes", icon: "🔥",
      description: "Espacio para que los jóvenes de la iglesia crezcan en su fe, sirvan juntos y construyan comunidad." },
    { id: "grupos-dinamicos", name: "Grupos Dinámicos", icon: "🌐",
      description: "Grupos pequeños que se reúnen para estudiar la Palabra, orar y apoyarse mutuamente." },
    { id: "dorcas", name: "Dorcas", icon: "🧵",
      description: "Ministerio de servicio y ayuda práctica a la congregación y la comunidad." },
    { id: "damas-solteras", name: "Damas Solteras", icon: "🌷",
      description: "Comunidad para damas solteras enfocada en el crecimiento espiritual y la amistad." },
    { id: "grupo-oracion", name: "Grupo de Oración", icon: "🙏",
      description: "Tiempo dedicado a interceder en oración por la iglesia, las familias y la comunidad." },
    { id: "tres-en-la-palabra", name: "3 en la Palabra", icon: "📖",
      description: "Estudio bíblico en grupos pequeños de tres personas para profundizar juntos en la Palabra." },
  ];

  const PODCASTS = [
    {
      id: "mas-alla-de-las-paredes",
      name: "Más Allá de las Paredes",
      cover: "cover-a",
      description: "Conducido por varios miembros del equipo de la iglesia. Disponible en Spotify y YouTube.",
      spotifyQuery: "Más Allá de las Paredes podcast",
      youtubeQuery: "Más Allá de las Paredes podcast Iglesia Bautista Sin Paredes de Salinas",
      episodes: [
        { title: "Episodio 1: Bienvenidos", duration: "24:10", date: "2026-07-26" },
        { title: "Episodio 2: Fe en comunidad", duration: "31:45", date: "2026-07-19" },
        { title: "Episodio 3: Sin paredes, sin límites", duration: "28:02", date: "2026-07-12" },
      ],
    },
    {
      id: "entre-hermanas",
      name: "Entre Hermanas",
      cover: "cover-b",
      description: "Dirigido por las damas de la iglesia, para las damas y para toda la congregación.",
      spotifyQuery: "Entre Hermanas podcast",
      youtubeQuery: "Entre Hermanas podcast Iglesia Bautista Sin Paredes de Salinas",
      episodes: [
        { title: "Episodio 1: Hermanas en la fe", duration: "22:30", date: "2026-07-28" },
        { title: "Episodio 2: Identidad en Cristo", duration: "27:15", date: "2026-07-21" },
        { title: "Episodio 3: Servir con amor", duration: "25:50", date: "2026-07-14" },
      ],
    },
  ];

  const DEFAULT_ANNOUNCEMENTS = [
    { id: "a1", title: "Nuevo capítulo: Más Allá de las Paredes", detail: "Ya está disponible el episodio 1 en Spotify y YouTube.", category: "Podcast", date: "2026-07-26" },
    { id: "a2", title: "Nuevo capítulo: Entre Hermanas", detail: "Las hermanas comparten un nuevo episodio para toda la congregación.", category: "Podcast", date: "2026-07-28" },
    { id: "a3", title: "Reunión de Jóvenes este viernes", detail: "Ven a compartir con el ministerio de jóvenes. Todos son bienvenidos.", category: "Ministerio", ministryId: "jovenes", date: "2026-08-01" },
    { id: "a4", title: "Noche de oración", detail: "El grupo de oración se reúne para interceder por la iglesia y la comunidad.", category: "Ministerio", ministryId: "grupo-oracion", date: "2026-07-30" },
    { id: "a5", title: "Recuerda: culto en vivo por Facebook", detail: "Cada domingo a las 10:00 a.m. transmitimos el culto en vivo.", category: "General", date: "2026-08-02" },
  ];

  const ACTIVITY_PHOTO_GROUPS = [
    { id: "p1", caption: "Retiro de Jóvenes", date: "Julio 2026" },
    { id: "p2", caption: "Servicio Comunitario", date: "Julio 2026" },
    { id: "p3", caption: "Confraternidad Dorcas", date: "Junio 2026" },
    { id: "p4", caption: "Noche Entre Hermanas", date: "Junio 2026" },
  ];

  /* Sample calendar events — edit dates/titles with the real church schedule. */
  const SAMPLE_EVENTS = [
    { title: "Reunión de Jóvenes", date: "2026-08-07", time: "6:00 p.m.", ministryId: "jovenes" },
    { title: "Grupo de Oración", date: "2026-08-08", time: "9:00 a.m.", ministryId: "grupo-oracion" },
    { title: "Encuentro Damas Solteras", date: "2026-08-12", time: "7:00 p.m.", ministryId: "damas-solteras" },
    { title: "Confraternidad Dorcas", date: "2026-08-15", time: "10:00 a.m.", ministryId: "dorcas" },
    { title: "3 en la Palabra", date: "2026-08-19", time: "7:00 p.m.", ministryId: "tres-en-la-palabra" },
    { title: "Grupos Dinámicos", date: "2026-08-22", time: "6:30 p.m.", ministryId: "grupos-dinamicos" },
  ];

  const NOTIF_TYPE_META = {
    podcast: { icon: "🎙️", label: "Podcast", pref: "podcast" },
    ministerio: { icon: "🤝", label: "Ministerio", pref: "ministerio" },
    evento: { icon: "📅", label: "Evento", pref: "evento" },
    general: { icon: "📣", label: "General", pref: "general" },
  };

  /* ---------------- State ---------------- */

  const store = {
    get(key, fallback) {
      try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : fallback;
      } catch (e) {
        return fallback;
      }
    },
    set(key, value) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (e) { /* storage unavailable */ }
    },
  };

  let customAnnouncements = store.get("ibsp:customAnnouncements", []);
  let notifications = store.get("ibsp:notifications", buildDefaultNotifications());
  let selectedCalendarDate = null;
  let currentCalendarMonth = new Date(2026, 7, 1); // August 2026
  let currentShowId = null;
  let currentMinistryId = null;

  let player = { playing: false, progress: 0, timer: null, title: "", show: "" };

  function buildDefaultNotifications() {
    const list = [];
    PODCASTS.forEach((show) => {
      const ep = show.episodes[0];
      list.push({
        id: "n-podcast-" + show.id,
        type: "podcast",
        title: "Nuevo capítulo: " + show.name,
        message: ep.title,
        date: ep.date,
        read: false,
      });
    });
    list.push({
      id: "n-ministerio-jovenes",
      type: "ministerio",
      title: "Jóvenes: Reunión este viernes",
      message: "Ven a compartir con el ministerio de jóvenes.",
      date: "2026-08-01",
      read: false,
    });
    list.push({
      id: "n-evento-oracion",
      type: "evento",
      title: "Recordatorio: Grupo de Oración",
      message: "Tu evento comienza pronto — sábado 9:00 a.m.",
      date: "2026-08-08",
      read: false,
    });
    list.push({
      id: "n-general-culto",
      type: "general",
      title: "Culto en vivo por Facebook",
      message: "Este domingo, 10:00 a.m.",
      date: "2026-08-02",
      read: true,
    });
    return list;
  }

  function allAnnouncements() {
    return [...customAnnouncements, ...DEFAULT_ANNOUNCEMENTS].sort((a, b) => (a.date < b.date ? 1 : -1));
  }

  function ministryById(id) {
    return MINISTRIES.find((m) => m.id === id);
  }

  function formatDate(iso) {
    const d = new Date(iso + "T00:00:00");
    return d.toLocaleDateString("es", { day: "numeric", month: "short", year: "numeric" });
  }

  /* ---------------- Navigation ---------------- */

  function showScreen(name) {
    document.querySelectorAll(".screen").forEach((s) => s.classList.toggle("active", s.dataset.screen === name));
    document.querySelectorAll(".nav-item").forEach((b) => b.classList.toggle("active", b.dataset.screenTarget === name));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  document.querySelectorAll("[data-screen-target]").forEach((btn) => {
    btn.addEventListener("click", () => showScreen(btn.dataset.screenTarget));
  });

  /* ---------------- Inicio: photo pairs ---------------- */

  function renderPhotoPairs() {
    const wrap = document.getElementById("photo-pairs");
    wrap.innerHTML = ACTIVITY_PHOTO_GROUPS.map((g) => `
      <div class="photo-pair-card">
        <div class="photo-pair-grid">
          <div class="photo-slot" data-photo-slot="${g.id}-1">📷</div>
          <div class="photo-slot" data-photo-slot="${g.id}-2">📷</div>
        </div>
        <div class="photo-pair-caption">${g.caption}<span class="photo-pair-date">${g.date}</span></div>
      </div>
    `).join("");
  }

  /* ---------------- Inicio: announcement form ---------------- */

  function populateMinistrySelect() {
    const sel = document.getElementById("ann-ministry");
    sel.innerHTML = MINISTRIES.map((m) => `<option value="${m.id}">${m.name}</option>`).join("");
  }

  document.getElementById("ann-category").addEventListener("change", (e) => {
    document.getElementById("ann-ministry-wrap").hidden = e.target.value !== "Ministerio";
  });

  document.getElementById("announcement-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const title = document.getElementById("ann-title").value.trim();
    const detail = document.getElementById("ann-detail").value.trim();
    const category = document.getElementById("ann-category").value;
    const ministryId = category === "Ministerio" ? document.getElementById("ann-ministry").value : undefined;
    if (!title || !detail) return;

    const item = {
      id: "custom-" + Date.now(),
      title,
      detail,
      category,
      ministryId,
      date: new Date().toISOString().slice(0, 10),
    };
    customAnnouncements = [item, ...customAnnouncements];
    store.set("ibsp:customAnnouncements", customAnnouncements);

    const typeMap = { General: "general", Podcast: "podcast", Ministerio: "ministerio" };
    notifications = [{
      id: "n-" + item.id,
      type: typeMap[category],
      title: title,
      message: detail,
      date: item.date,
      read: false,
    }, ...notifications];
    store.set("ibsp:notifications", notifications);

    e.target.reset();
    document.getElementById("ann-ministry-wrap").hidden = true;
    renderFeed();
    renderNotifications();
    updateBadge();
    showScreen("inicio");
  });

  function feedIconAndClass(item) {
    if (item.category === "Podcast") return { icon: "🎙️", cls: "tag-podcast" };
    if (item.category === "Ministerio") return { icon: "🤝", cls: "tag-ministerio" };
    return { icon: "📣", cls: "tag-general" };
  }

  function renderFeed() {
    const list = document.getElementById("feed-list");
    const items = allAnnouncements();
    if (!items.length) {
      list.innerHTML = `<div class="empty-state">Aún no hay anuncios.</div>`;
      return;
    }
    list.innerHTML = items.map((item) => {
      const { icon, cls } = feedIconAndClass(item);
      const ministry = item.ministryId ? ministryById(item.ministryId) : null;
      return `
        <div class="feed-item ${cls}">
          <div class="feed-icon">${icon}</div>
          <div class="feed-body">
            <p class="feed-title">${item.title}</p>
            <p class="feed-detail">${item.detail}</p>
            <div class="feed-meta">
              <span class="feed-chip">${ministry ? ministry.name : item.category}</span>
              <span>${formatDate(item.date)}</span>
            </div>
          </div>
        </div>
      `;
    }).join("");
  }

  /* ---------------- Calendario ---------------- */

  const MONTH_NAMES = ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];
  const DOW_NAMES = ["dom","lun","mar","mié","jue","vie","sáb"];

  function eventsForMonth(year, month) {
    const events = [...SAMPLE_EVENTS];
    // Add recurring Sunday live-stream services for the visible month.
    const d = new Date(year, month, 1);
    while (d.getMonth() === month) {
      if (d.getDay() === 0) {
        events.push({
          title: "Culto en vivo por Facebook",
          date: d.toISOString().slice(0, 10),
          time: "10:00 a.m.",
        });
      }
      d.setDate(d.getDate() + 1);
    }
    return events.filter((e) => {
      const ed = new Date(e.date + "T00:00:00");
      return ed.getFullYear() === year && ed.getMonth() === month;
    }).sort((a, b) => (a.date > b.date ? 1 : -1));
  }

  function renderCalendar() {
    const year = currentCalendarMonth.getFullYear();
    const month = currentCalendarMonth.getMonth();
    document.getElementById("cal-month-label").textContent = `${MONTH_NAMES[month]} ${year}`;

    const grid = document.getElementById("calendar-grid");
    const firstDow = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const monthEvents = eventsForMonth(year, month);
    const eventDates = new Set(monthEvents.map((e) => e.date));

    const todayIso = new Date().toISOString().slice(0, 10);

    let html = DOW_NAMES.map((d) => `<div class="cal-dow">${d}</div>`).join("");
    for (let i = 0; i < firstDow; i++) html += `<div class="cal-day empty"></div>`;
    for (let day = 1; day <= daysInMonth; day++) {
      const iso = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      const isToday = iso === todayIso;
      const isSelected = iso === selectedCalendarDate;
      html += `
        <button class="cal-day ${isToday ? "today" : ""} ${isSelected ? "selected" : ""}" data-date="${iso}">
          ${day}
          ${eventDates.has(iso) ? '<span class="dot"></span>' : ""}
        </button>
      `;
    }
    grid.innerHTML = html;

    grid.querySelectorAll(".cal-day[data-date]").forEach((btn) => {
      btn.addEventListener("click", () => {
        selectedCalendarDate = btn.dataset.date === selectedCalendarDate ? null : btn.dataset.date;
        renderCalendar();
        renderEventsList();
      });
    });

    renderEventsList();
  }

  function renderEventsList() {
    const year = currentCalendarMonth.getFullYear();
    const month = currentCalendarMonth.getMonth();
    let events = eventsForMonth(year, month);
    if (selectedCalendarDate) {
      events = events.filter((e) => e.date === selectedCalendarDate);
    }
    const list = document.getElementById("events-list");
    if (!events.length) {
      list.innerHTML = `<div class="empty-state">No hay eventos para mostrar.</div>`;
      return;
    }
    list.innerHTML = events.map((e) => {
      const d = new Date(e.date + "T00:00:00");
      const ministry = e.ministryId ? ministryById(e.ministryId) : null;
      return `
        <div class="event-item">
          <div class="event-date-box">
            <span class="day">${d.getDate()}</span>
            <span class="mon">${MONTH_NAMES[d.getMonth()].slice(0, 3)}</span>
          </div>
          <div>
            <strong>${e.title}</strong>
            <span>${e.time}${ministry ? " · " + ministry.name : ""}</span>
          </div>
        </div>
      `;
    }).join("");
  }

  document.getElementById("cal-prev").addEventListener("click", () => {
    currentCalendarMonth = new Date(currentCalendarMonth.getFullYear(), currentCalendarMonth.getMonth() - 1, 1);
    selectedCalendarDate = null;
    renderCalendar();
  });
  document.getElementById("cal-next").addEventListener("click", () => {
    currentCalendarMonth = new Date(currentCalendarMonth.getFullYear(), currentCalendarMonth.getMonth() + 1, 1);
    selectedCalendarDate = null;
    renderCalendar();
  });

  /* ---------------- Podcasts ---------------- */

  function renderShows() {
    const wrap = document.getElementById("podcast-shows");
    wrap.innerHTML = PODCASTS.map((show) => `
      <button class="show-card" data-show="${show.id}">
        <div class="show-cover ${show.cover}">🎙️</div>
        <div>
          <h3>${show.name}</h3>
          <p>${show.description}</p>
          <div class="platform-links">
            <span class="platform-link spotify">Spotify</span>
            <span class="platform-link youtube">YouTube</span>
          </div>
        </div>
      </button>
    `).join("");

    wrap.querySelectorAll(".show-card").forEach((card) => {
      card.addEventListener("click", () => openShow(card.dataset.show));
    });
  }

  function openShow(showId) {
    currentShowId = showId;
    const show = PODCASTS.find((s) => s.id === showId);
    document.getElementById("episodes-block").hidden = false;
    document.getElementById("episodes-header").innerHTML = `
      <h3>${show.name}</h3>
      <p>${show.description}</p>
      <div class="platform-links" style="margin-bottom:14px">
        <a class="platform-link spotify" target="_blank" rel="noopener"
           href="https://open.spotify.com/search/${encodeURIComponent(show.spotifyQuery)}">▶ Buscar en Spotify</a>
        <a class="platform-link youtube" target="_blank" rel="noopener"
           href="https://www.youtube.com/results?search_query=${encodeURIComponent(show.youtubeQuery)}">▶ Buscar en YouTube</a>
      </div>
    `;
    const list = document.getElementById("episodes-list");
    list.innerHTML = show.episodes.map((ep, idx) => `
      <button class="episode-item" data-episode="${idx}">
        <span class="episode-play">▶</span>
        <div>
          <strong>${ep.title}</strong>
          <span>${formatDate(ep.date)} · ${ep.duration}</span>
        </div>
      </button>
    `).join("");
    list.querySelectorAll(".episode-item").forEach((btn) => {
      btn.addEventListener("click", () => {
        const ep = show.episodes[Number(btn.dataset.episode)];
        playEpisode(show.name, ep.title);
      });
    });
  }

  document.getElementById("back-to-shows").addEventListener("click", () => {
    document.getElementById("episodes-block").hidden = true;
  });

  /* ---------------- Mini player (simulated) ---------------- */

  function playEpisode(show, title) {
    clearInterval(player.timer);
    player = { playing: true, progress: 0, timer: null, title, show };
    document.getElementById("mini-player").hidden = false;
    document.getElementById("mini-player-title").textContent = title;
    document.getElementById("mini-player-show").textContent = show;
    document.getElementById("mini-player-toggle").textContent = "⏸";
    startPlayerTimer();
  }

  function startPlayerTimer() {
    player.timer = setInterval(() => {
      player.progress = Math.min(100, player.progress + 1);
      document.getElementById("mini-player-progress").style.width = player.progress + "%";
      if (player.progress >= 100) {
        clearInterval(player.timer);
        player.playing = false;
        document.getElementById("mini-player-toggle").textContent = "▶";
      }
    }, 400);
  }

  document.getElementById("mini-player-toggle").addEventListener("click", () => {
    if (!player.title) return;
    player.playing = !player.playing;
    document.getElementById("mini-player-toggle").textContent = player.playing ? "⏸" : "▶";
    if (player.playing) {
      startPlayerTimer();
    } else {
      clearInterval(player.timer);
    }
  });

  document.getElementById("mini-player-close").addEventListener("click", () => {
    clearInterval(player.timer);
    player = { playing: false, progress: 0, timer: null, title: "", show: "" };
    document.getElementById("mini-player").hidden = true;
  });

  /* ---------------- Ministerios ---------------- */

  function renderMinistries() {
    const grid = document.getElementById("ministries-grid");
    grid.innerHTML = MINISTRIES.map((m) => `
      <button class="ministry-card" data-ministry="${m.id}">
        <div class="ministry-icon">${m.icon}</div>
        <strong>${m.name}</strong>
        <p>${m.description}</p>
      </button>
    `).join("");
    grid.querySelectorAll(".ministry-card").forEach((card) => {
      card.addEventListener("click", () => openMinistry(card.dataset.ministry));
    });
  }

  function openMinistry(id) {
    currentMinistryId = id;
    const m = ministryById(id);
    document.getElementById("ministry-detail-block").hidden = false;
    const relatedAnnouncements = allAnnouncements().filter((a) => a.ministryId === id);
    const relatedEvents = SAMPLE_EVENTS.filter((e) => e.ministryId === id);

    document.getElementById("ministry-detail").innerHTML = `
      <div class="ministry-detail-head">
        <div class="ministry-icon">${m.icon}</div>
        <h2>${m.name}</h2>
      </div>
      <div class="card ministry-detail-body">
        <p>${m.description}</p>
        <div class="info-row"><b>Reuniones</b><span>${relatedEvents.map((e) => e.time).join(", ") || "Consulta con la iglesia"}</span></div>
        <div class="info-row"><b>Contacto</b><span>Habla con el equipo de la iglesia para más información</span></div>
      </div>
      <div class="block">
        <div class="block-head"><h2>Anuncios de este ministerio</h2></div>
        <div class="feed">
          ${relatedAnnouncements.length
            ? relatedAnnouncements.map((item) => {
                const { icon, cls } = feedIconAndClass(item);
                return `
                  <div class="feed-item ${cls}">
                    <div class="feed-icon">${icon}</div>
                    <div class="feed-body">
                      <p class="feed-title">${item.title}</p>
                      <p class="feed-detail">${item.detail}</p>
                      <div class="feed-meta"><span>${formatDate(item.date)}</span></div>
                    </div>
                  </div>
                `;
              }).join("")
            : `<div class="empty-state">Sin anuncios por ahora.</div>`}
        </div>
      </div>
    `;
  }

  document.getElementById("back-to-ministries").addEventListener("click", () => {
    document.getElementById("ministry-detail-block").hidden = true;
  });

  /* ---------------- Notificaciones ---------------- */

  function renderNotifications() {
    const list = document.getElementById("notif-list");
    const sorted = [...notifications].sort((a, b) => (a.date < b.date ? 1 : -1));
    if (!sorted.length) {
      list.innerHTML = `<div class="empty-state">No tienes notificaciones.</div>`;
      return;
    }
    list.innerHTML = sorted.map((n) => {
      const meta = NOTIF_TYPE_META[n.type] || NOTIF_TYPE_META.general;
      return `
        <button class="notif-item ${n.read ? "" : "unread"}" data-notif="${n.id}">
          <div class="feed-icon" style="background:var(--blue)">${meta.icon}</div>
          <div>
            <strong>${n.title}</strong>
            <p>${n.message}</p>
            <time>${formatDate(n.date)} · ${meta.label}</time>
          </div>
          ${n.read ? "" : '<span class="unread-dot"></span>'}
        </button>
      `;
    }).join("");

    list.querySelectorAll(".notif-item").forEach((btn) => {
      btn.addEventListener("click", () => {
        const n = notifications.find((x) => x.id === btn.dataset.notif);
        if (n) n.read = true;
        store.set("ibsp:notifications", notifications);
        renderNotifications();
        updateBadge();
      });
    });
  }

  function updateBadge() {
    const unread = notifications.filter((n) => !n.read).length;
    const badge = document.getElementById("notif-badge");
    badge.textContent = String(unread);
    badge.hidden = unread === 0;
  }

  /* ---------------- Perfil ---------------- */

  const prefs = store.get("ibsp:prefs", { podcast: true, ministerio: true, evento: true, general: true });
  document.querySelectorAll("[data-pref]").forEach((input) => {
    input.checked = prefs[input.dataset.pref];
    input.addEventListener("change", () => {
      prefs[input.dataset.pref] = input.checked;
      store.set("ibsp:prefs", prefs);
    });
  });

  /* ---------------- Init ---------------- */

  populateMinistrySelect();
  renderPhotoPairs();
  renderFeed();
  renderCalendar();
  renderShows();
  renderMinistries();
  renderNotifications();
  updateBadge();
})();
