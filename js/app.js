/* Iglesia Bautista Sin Paredes de Salinas — app de anuncios, ministerios,
   calendario y podcasts. Todos los datos de ejemplo (eventos, horarios,
   fotos) son marcadores de posición: reemplázalos aquí con la información
   real de la iglesia. */

(function () {
  "use strict";

  /* ---------------- Data ---------------- */

  const DEFAULT_MINISTRIES = [
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

  const DEFAULT_PODCASTS = [
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

  const DEFAULT_ABOUT_TEXT = "Somos una iglesia que cree que la fe no tiene paredes: nos reunimos para adorar, servir a nuestra comunidad y crecer juntos en la Palabra. Nuestras puertas están abiertas para todos, sin importar de dónde vengas.";

  const DEFAULT_ACTIVITY_PHOTOS = [
    { id: "p1", caption: "Retiro de Jóvenes", date: "Julio 2026", img1: null, img2: null },
    { id: "p2", caption: "Servicio Comunitario", date: "Julio 2026", img1: null, img2: null },
    { id: "p3", caption: "Confraternidad Dorcas", date: "Junio 2026", img1: null, img2: null },
    { id: "p4", caption: "Noche Entre Hermanas", date: "Junio 2026", img1: null, img2: null },
  ];

  /* Sample calendar events — edit dates/titles with the real church schedule. */
  const DEFAULT_EVENTS = [
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

  let remoteAnnouncements = [];
  let notifications = store.get("ibsp:notifications", buildDefaultNotifications());
  let selectedCalendarDate = null;
  let currentCalendarMonth = new Date(2026, 7, 1); // August 2026
  let currentShowId = null;
  let currentMinistryId = null;

  let player = { playing: false, progress: 0, timer: null, title: "", show: "" };

  let currentUser = null;
  let currentRole = "guest"; // "guest" | "user" | "admin"

  let aboutSettings = { about_text: DEFAULT_ABOUT_TEXT, about_photo_url: null };
  let activityPhotos = DEFAULT_ACTIVITY_PHOTOS;
  let editingAbout = false;
  let editingPhotoPairId = null;
  let creatingPhotoPair = false;

  let ministries = DEFAULT_MINISTRIES;
  let podcasts = DEFAULT_PODCASTS;
  let events = DEFAULT_EVENTS;
  let editingMinistryId = null;
  let creatingMinistry = false;
  let editingShowId = null;
  let creatingPodcast = false;
  let editingEpisodeId = null;
  let creatingEpisode = false;
  let editingEventId = null;
  let creatingEvent = false;

  function buildDefaultNotifications() {
    const list = [];
    DEFAULT_PODCASTS.forEach((show) => {
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
    const source = remoteAnnouncements.length ? remoteAnnouncements : DEFAULT_ANNOUNCEMENTS;
    return [...source].sort((a, b) => (a.date < b.date ? 1 : -1));
  }

  async function loadAnnouncements() {
    if (!sbClient) {
      remoteAnnouncements = [];
      return;
    }
    try {
      const { data, error } = await sbClient
        .from("announcements")
        .select("*")
        .order("event_date", { ascending: false });
      if (error) {
        console.error("No se pudieron cargar los anuncios desde Supabase:", error.message);
        remoteAnnouncements = [];
        return;
      }
      remoteAnnouncements = data.map((row) => ({
        id: row.id,
        title: row.title,
        detail: row.detail,
        category: row.category,
        ministryId: row.ministry_id || undefined,
        date: row.event_date,
      }));
    } catch (e) {
      console.error("No se pudo conectar con Supabase para cargar anuncios:", e);
      remoteAnnouncements = [];
    }
  }

  async function uploadPhoto(file) {
    const path = Date.now() + "-" + Math.random().toString(36).slice(2) + "-" + file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
    const { error } = await sbClient.storage.from("photos").upload(path, file);
    if (error) throw error;
    const { data } = sbClient.storage.from("photos").getPublicUrl(path);
    return data.publicUrl;
  }

  async function loadSiteSettings() {
    if (!sbClient) return;
    try {
      const { data, error } = await sbClient.from("site_settings").select("*").eq("id", 1).single();
      if (error) {
        console.error("No se pudo cargar 'Quiénes somos' desde Supabase:", error.message);
        return;
      }
      aboutSettings = { about_text: data.about_text || DEFAULT_ABOUT_TEXT, about_photo_url: data.about_photo_url };
    } catch (e) {
      console.error("No se pudo conectar con Supabase para cargar 'Quiénes somos':", e);
    }
  }

  async function loadActivityPhotos() {
    if (!sbClient) return;
    try {
      const { data, error } = await sbClient.from("activity_photos").select("*").order("sort_order", { ascending: true });
      if (error) {
        console.error("No se pudieron cargar las fotos de actividades desde Supabase:", error.message);
        return;
      }
      activityPhotos = data.map((row) => ({
        id: row.id,
        caption: row.caption,
        date: row.photo_date,
        img1: row.image_url_1,
        img2: row.image_url_2,
      }));
    } catch (e) {
      console.error("No se pudo conectar con Supabase para cargar fotos de actividades:", e);
    }
  }

  async function loadMinistries() {
    if (!sbClient) return;
    try {
      const { data, error } = await sbClient.from("ministries").select("*").order("sort_order", { ascending: true });
      if (error) {
        console.error("No se pudieron cargar los ministerios desde Supabase:", error.message);
        return;
      }
      ministries = data.map((row) => ({ id: row.id, name: row.name, icon: row.icon, description: row.description }));
    } catch (e) {
      console.error("No se pudo conectar con Supabase para cargar ministerios:", e);
    }
  }

  async function loadPodcasts() {
    if (!sbClient) return;
    try {
      const { data: showRows, error } = await sbClient.from("podcasts").select("*").order("sort_order", { ascending: true });
      if (error) {
        console.error("No se pudieron cargar los podcasts desde Supabase:", error.message);
        return;
      }
      const { data: epRows, error: epError } = await sbClient
        .from("podcast_episodes")
        .select("*")
        .order("episode_date", { ascending: false });
      if (epError) {
        console.error("No se pudieron cargar los episodios desde Supabase:", epError.message);
      }
      podcasts = showRows.map((row, idx) => ({
        id: row.id,
        name: row.name,
        description: row.description,
        cover: idx % 2 === 0 ? "cover-a" : "cover-b",
        spotifyQuery: row.spotify_query,
        youtubeQuery: row.youtube_query,
        episodes: (epRows || [])
          .filter((ep) => ep.podcast_id === row.id)
          .map((ep) => ({ id: ep.id, title: ep.title, date: ep.episode_date, duration: ep.duration })),
      }));
    } catch (e) {
      console.error("No se pudo conectar con Supabase para cargar podcasts:", e);
    }
  }

  async function loadEvents() {
    if (!sbClient) return;
    try {
      const { data, error } = await sbClient.from("events").select("*").order("event_date", { ascending: true });
      if (error) {
        console.error("No se pudieron cargar los eventos desde Supabase:", error.message);
        return;
      }
      events = data.map((row) => ({
        id: row.id,
        title: row.title,
        date: row.event_date,
        time: row.event_time,
        ministryId: row.ministry_id || undefined,
      }));
    } catch (e) {
      console.error("No se pudo conectar con Supabase para cargar eventos:", e);
    }
  }

  function ministryById(id) {
    return ministries.find((m) => m.id === id);
  }

  function formatDate(iso) {
    const d = new Date(iso + "T00:00:00");
    return d.toLocaleDateString("es", { day: "numeric", month: "short", year: "numeric" });
  }

  const ACCENT_MAP = { á: "a", à: "a", ä: "a", â: "a", é: "e", è: "e", ë: "e", ê: "e", í: "i", ì: "i", ï: "i", î: "i", ó: "o", ò: "o", ö: "o", ô: "o", ú: "u", ù: "u", ü: "u", û: "u", ñ: "n" };

  function slugify(text) {
    return text
      .toLowerCase()
      .replace(/[áàäâéèëêíìïîóòöôúùüûñ]/g, (ch) => ACCENT_MAP[ch] || ch)
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
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

  /* ---------------- Inicio: "Quiénes somos" ---------------- */

  function renderAbout() {
    const wrap = document.getElementById("about-card");
    const isAdmin = currentRole === "admin";

    if (isAdmin && editingAbout) {
      wrap.innerHTML = `
        <div class="card">
          <form id="about-edit-form" class="edit-form">
            <label>Foto (opcional, deja vacío para no cambiarla)
              <input type="file" id="about-photo-input" accept="image/*" />
            </label>
            <label>Descripción
              <textarea id="about-text-input" rows="4">${aboutSettings.about_text}</textarea>
            </label>
            <div class="edit-form-actions">
              <button type="submit" class="btn-primary">Guardar</button>
              <button type="button" class="btn-secondary" id="about-cancel-btn">Cancelar</button>
            </div>
            <p class="form-message" id="about-edit-message"></p>
          </form>
        </div>
      `;
      document.getElementById("about-cancel-btn").addEventListener("click", () => {
        editingAbout = false;
        renderAbout();
      });
      document.getElementById("about-edit-form").addEventListener("submit", async (e) => {
        e.preventDefault();
        const messageEl = document.getElementById("about-edit-message");
        messageEl.textContent = "Guardando...";
        messageEl.className = "form-message";
        try {
          const fileInput = document.getElementById("about-photo-input");
          let photoUrl = aboutSettings.about_photo_url;
          if (fileInput.files[0]) {
            photoUrl = await uploadPhoto(fileInput.files[0]);
          }
          const text = document.getElementById("about-text-input").value.trim();
          const { error } = await sbClient
            .from("site_settings")
            .update({ about_text: text, about_photo_url: photoUrl })
            .eq("id", 1);
          if (error) throw error;
          await loadSiteSettings();
          editingAbout = false;
          renderAbout();
        } catch (err) {
          messageEl.textContent = "No se pudo guardar: " + err.message;
          messageEl.className = "form-message error";
        }
      });
      return;
    }

    wrap.innerHTML = `
      <div class="card about-card">
        <div class="about-photo">${aboutSettings.about_photo_url ? `<img src="${aboutSettings.about_photo_url}" alt="Foto de la iglesia" />` : "📷"}</div>
        <div class="about-body">
          <strong>Iglesia Bautista Sin Paredes de Salinas</strong>
          <p>${aboutSettings.about_text}</p>
          ${isAdmin ? `<button class="edit-btn" id="about-edit-btn" type="button">✎ Editar</button>` : ""}
        </div>
      </div>
    `;
    if (isAdmin) {
      document.getElementById("about-edit-btn").addEventListener("click", () => {
        editingAbout = true;
        renderAbout();
      });
    }
  }

  /* ---------------- Inicio: photo pairs ---------------- */

  function renderPhotoPairs() {
    const wrap = document.getElementById("photo-pairs");
    const isAdmin = currentRole === "admin";

    let html = activityPhotos.map((g) => {
      if (isAdmin && editingPhotoPairId === g.id) {
        return `
          <div class="photo-pair-card">
            <form class="edit-form card" data-edit-pair="${g.id}">
              <label>Título<input type="text" name="caption" value="${g.caption}" required /></label>
              <label>Fecha<input type="text" name="date" value="${g.date}" required /></label>
              <label>Foto 1 (opcional)<input type="file" name="photo1" accept="image/*" /></label>
              <label>Foto 2 (opcional)<input type="file" name="photo2" accept="image/*" /></label>
              <div class="edit-form-actions">
                <button type="submit" class="btn-primary">Guardar</button>
                <button type="button" class="btn-secondary" data-cancel-pair>Cancelar</button>
              </div>
              <p class="form-message" data-pair-message></p>
            </form>
          </div>
        `;
      }
      return `
        <div class="photo-pair-card">
          <div class="photo-pair-grid">
            <div class="photo-slot">${g.img1 ? `<img src="${g.img1}" alt="" />` : "📷"}</div>
            <div class="photo-slot">${g.img2 ? `<img src="${g.img2}" alt="" />` : "📷"}</div>
          </div>
          <div class="photo-pair-caption">
            <span>${g.caption}<span class="photo-pair-date">${g.date}</span></span>
            ${isAdmin ? `
              <span class="photo-pair-admin-actions">
                <button class="icon-btn" data-edit-pair-btn="${g.id}" type="button" aria-label="Editar">✎</button>
                <button class="icon-btn" data-delete-pair-btn="${g.id}" type="button" aria-label="Eliminar">✕</button>
              </span>
            ` : ""}
          </div>
        </div>
      `;
    }).join("");

    if (isAdmin) {
      if (creatingPhotoPair) {
        html += `
          <div class="photo-pair-card">
            <form class="edit-form card" id="create-pair-form">
              <label>Título<input type="text" name="caption" placeholder="Ej: Bautismos" required /></label>
              <label>Fecha<input type="text" name="date" placeholder="Ej: Agosto 2026" required /></label>
              <label>Foto 1<input type="file" name="photo1" accept="image/*" /></label>
              <label>Foto 2<input type="file" name="photo2" accept="image/*" /></label>
              <div class="edit-form-actions">
                <button type="submit" class="btn-primary">Agregar</button>
                <button type="button" class="btn-secondary" id="cancel-create-pair">Cancelar</button>
              </div>
              <p class="form-message" id="create-pair-message"></p>
            </form>
          </div>
        `;
      } else {
        html += `<button class="photo-pair-add" id="add-pair-btn" type="button">+ Agregar par de fotos</button>`;
      }
    }

    wrap.innerHTML = html;

    if (!isAdmin) return;

    if (document.getElementById("add-pair-btn")) {
      document.getElementById("add-pair-btn").addEventListener("click", () => {
        creatingPhotoPair = true;
        renderPhotoPairs();
      });
    }
    if (document.getElementById("cancel-create-pair")) {
      document.getElementById("cancel-create-pair").addEventListener("click", () => {
        creatingPhotoPair = false;
        renderPhotoPairs();
      });
    }
    if (document.getElementById("create-pair-form")) {
      document.getElementById("create-pair-form").addEventListener("submit", async (e) => {
        e.preventDefault();
        const form = e.target;
        const messageEl = document.getElementById("create-pair-message");
        messageEl.textContent = "Guardando...";
        messageEl.className = "form-message";
        try {
          const caption = form.caption.value.trim();
          const date = form.date.value.trim();
          const photo1 = form.photo1.files[0];
          const photo2 = form.photo2.files[0];
          const img1 = photo1 ? await uploadPhoto(photo1) : null;
          const img2 = photo2 ? await uploadPhoto(photo2) : null;
          const { error } = await sbClient.from("activity_photos").insert({
            caption,
            photo_date: date,
            image_url_1: img1,
            image_url_2: img2,
            sort_order: activityPhotos.length,
          });
          if (error) throw error;
          await loadActivityPhotos();
          creatingPhotoPair = false;
          renderPhotoPairs();
        } catch (err) {
          messageEl.textContent = "No se pudo agregar: " + err.message;
          messageEl.className = "form-message error";
        }
      });
    }

    wrap.querySelectorAll("[data-edit-pair-btn]").forEach((btn) => {
      btn.addEventListener("click", () => {
        editingPhotoPairId = btn.dataset.editPairBtn;
        renderPhotoPairs();
      });
    });
    wrap.querySelectorAll("[data-delete-pair-btn]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        if (!confirm("¿Eliminar este par de fotos?")) return;
        const { error } = await sbClient.from("activity_photos").delete().eq("id", btn.dataset.deletePairBtn);
        if (error) {
          alert("No se pudo eliminar: " + error.message);
          return;
        }
        await loadActivityPhotos();
        renderPhotoPairs();
      });
    });
    wrap.querySelectorAll("[data-cancel-pair]").forEach((btn) => {
      btn.addEventListener("click", () => {
        editingPhotoPairId = null;
        renderPhotoPairs();
      });
    });
    wrap.querySelectorAll("[data-edit-pair]").forEach((form) => {
      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const id = form.dataset.editPair;
        const messageEl = form.querySelector("[data-pair-message]");
        messageEl.textContent = "Guardando...";
        messageEl.className = "form-message";
        try {
          const current = activityPhotos.find((p) => String(p.id) === id);
          const caption = form.caption.value.trim();
          const date = form.date.value.trim();
          const photo1 = form.photo1.files[0];
          const photo2 = form.photo2.files[0];
          const img1 = photo1 ? await uploadPhoto(photo1) : current.img1;
          const img2 = photo2 ? await uploadPhoto(photo2) : current.img2;
          const { error } = await sbClient
            .from("activity_photos")
            .update({ caption, photo_date: date, image_url_1: img1, image_url_2: img2 })
            .eq("id", id);
          if (error) throw error;
          await loadActivityPhotos();
          editingPhotoPairId = null;
          renderPhotoPairs();
        } catch (err) {
          messageEl.textContent = "No se pudo guardar: " + err.message;
          messageEl.className = "form-message error";
        }
      });
    });
  }

  /* ---------------- Inicio: announcement form ---------------- */

  function populateMinistrySelect() {
    const sel = document.getElementById("ann-ministry");
    sel.innerHTML = ministries.map((m) => `<option value="${m.id}">${m.name}</option>`).join("");
  }

  document.getElementById("ann-category").addEventListener("change", (e) => {
    document.getElementById("ann-ministry-wrap").hidden = e.target.value !== "Ministerio";
  });

  function updateCreateAnnouncementVisibility() {
    const isAdmin = currentRole === "admin";
    document.getElementById("create-announcement-block").hidden = !isAdmin;
    document.getElementById("non-admin-hint").hidden = isAdmin;
  }

  document.getElementById("announcement-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    if (currentRole !== "admin") return;
    const title = document.getElementById("ann-title").value.trim();
    const detail = document.getElementById("ann-detail").value.trim();
    const category = document.getElementById("ann-category").value;
    const ministryId = category === "Ministerio" ? document.getElementById("ann-ministry").value : null;
    if (!title || !detail) return;

    const messageEl = document.getElementById("ann-message");
    messageEl.textContent = "Publicando...";
    messageEl.className = "form-message";

    const eventDate = new Date().toISOString().slice(0, 10);
    const { error } = await sbClient.from("announcements").insert({
      title,
      detail,
      category,
      ministry_id: ministryId,
      event_date: eventDate,
      created_by: currentUser.id,
    });

    if (error) {
      messageEl.textContent = "No se pudo publicar: " + error.message;
      messageEl.className = "form-message error";
      return;
    }

    const typeMap = { General: "general", Podcast: "podcast", Ministerio: "ministerio" };
    notifications = [{
      id: "n-" + Date.now(),
      type: typeMap[category],
      title,
      message: detail,
      date: eventDate,
      read: false,
    }, ...notifications];
    store.set("ibsp:notifications", notifications);

    await loadAnnouncements();
    e.target.reset();
    document.getElementById("ann-ministry-wrap").hidden = true;
    messageEl.textContent = "";
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
    const allEvents = [...events];
    // Add recurring Sunday live-stream services for the visible month.
    const d = new Date(year, month, 1);
    while (d.getMonth() === month) {
      if (d.getDay() === 0) {
        allEvents.push({
          title: "Culto en vivo por Facebook",
          date: d.toISOString().slice(0, 10),
          time: "10:00 a.m.",
        });
      }
      d.setDate(d.getDate() + 1);
    }
    return allEvents.filter((e) => {
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

  function eventFormFields(e) {
    return `
      <label>Título<input type="text" name="title" value="${e ? e.title : ""}" required /></label>
      <label>Fecha<input type="date" name="date" value="${e ? e.date : ""}" required /></label>
      <label>Hora (texto libre, ej: 7:00 p.m.)<input type="text" name="time" value="${e ? e.time : ""}" required /></label>
      <label>Ministerio (opcional)
        <select name="ministryId">
          <option value="">— Ninguno —</option>
          ${ministries.map((m) => `<option value="${m.id}" ${e && e.ministryId === m.id ? "selected" : ""}>${m.name}</option>`).join("")}
        </select>
      </label>
    `;
  }

  function renderEventsList() {
    const year = currentCalendarMonth.getFullYear();
    const month = currentCalendarMonth.getMonth();
    const isAdmin = currentRole === "admin";
    let monthEvents = eventsForMonth(year, month);
    if (selectedCalendarDate) {
      monthEvents = monthEvents.filter((e) => e.date === selectedCalendarDate);
    }
    const list = document.getElementById("events-list");

    let html = "";
    if (!monthEvents.length) {
      html += `<div class="empty-state">No hay eventos para mostrar.</div>`;
    } else {
      html += monthEvents.map((e) => {
        if (isAdmin && e.id && editingEventId === e.id) {
          return `
            <form class="edit-form card" data-edit-event="${e.id}">
              ${eventFormFields(e)}
              <div class="edit-form-actions">
                <button type="submit" class="btn-primary">Guardar</button>
                <button type="button" class="btn-secondary" data-cancel-event>Cancelar</button>
              </div>
              <p class="form-message" data-event-message></p>
            </form>
          `;
        }
        const d = new Date(e.date + "T00:00:00");
        const ministry = e.ministryId ? ministryById(e.ministryId) : null;
        return `
          <div class="event-item">
            <div class="event-date-box">
              <span class="day">${d.getDate()}</span>
              <span class="mon">${MONTH_NAMES[d.getMonth()].slice(0, 3)}</span>
            </div>
            <div style="flex:1">
              <strong>${e.title}</strong>
              <span>${e.time}${ministry ? " · " + ministry.name : ""}</span>
            </div>
            ${isAdmin && e.id ? `
              <div class="event-admin-row">
                <button class="icon-btn" data-edit-event-btn="${e.id}" type="button" aria-label="Editar">✎</button>
                <button class="icon-btn" data-delete-event-btn="${e.id}" type="button" aria-label="Eliminar">✕</button>
              </div>
            ` : ""}
          </div>
        `;
      }).join("");
    }

    if (isAdmin) {
      if (creatingEvent) {
        html += `
          <form class="edit-form card event-add-card" id="create-event-form">
            ${eventFormFields(null)}
            <div class="edit-form-actions">
              <button type="submit" class="btn-primary">Agregar</button>
              <button type="button" class="btn-secondary" id="cancel-create-event">Cancelar</button>
            </div>
            <p class="form-message" id="create-event-message"></p>
          </form>
        `;
      } else {
        html += `<button class="edit-btn" id="add-event-btn" type="button">+ Agregar evento</button>`;
      }
    }

    list.innerHTML = html;

    if (!isAdmin) return;

    if (document.getElementById("add-event-btn")) {
      document.getElementById("add-event-btn").addEventListener("click", () => {
        creatingEvent = true;
        renderEventsList();
      });
    }
    if (document.getElementById("cancel-create-event")) {
      document.getElementById("cancel-create-event").addEventListener("click", () => {
        creatingEvent = false;
        renderEventsList();
      });
    }
    if (document.getElementById("create-event-form")) {
      document.getElementById("create-event-form").addEventListener("submit", async (e) => {
        e.preventDefault();
        const form = e.target;
        const messageEl = document.getElementById("create-event-message");
        messageEl.textContent = "Guardando...";
        messageEl.className = "form-message";
        try {
          const { error } = await sbClient.from("events").insert({
            title: form.title.value.trim(),
            event_date: form.date.value,
            event_time: form.time.value.trim(),
            ministry_id: form.ministryId.value || null,
          });
          if (error) throw error;
          await loadEvents();
          creatingEvent = false;
          renderEventsList();
        } catch (err) {
          messageEl.textContent = "No se pudo agregar: " + err.message;
          messageEl.className = "form-message error";
        }
      });
    }

    list.querySelectorAll("[data-edit-event-btn]").forEach((btn) => {
      btn.addEventListener("click", () => {
        editingEventId = btn.dataset.editEventBtn;
        renderEventsList();
      });
    });
    list.querySelectorAll("[data-delete-event-btn]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        if (!confirm("¿Eliminar este evento?")) return;
        const { error } = await sbClient.from("events").delete().eq("id", btn.dataset.deleteEventBtn);
        if (error) {
          alert("No se pudo eliminar: " + error.message);
          return;
        }
        await loadEvents();
        renderCalendar();
      });
    });
    list.querySelectorAll("[data-cancel-event]").forEach((btn) => {
      btn.addEventListener("click", () => {
        editingEventId = null;
        renderEventsList();
      });
    });
    list.querySelectorAll("[data-edit-event]").forEach((form) => {
      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const id = form.dataset.editEvent;
        const messageEl = form.querySelector("[data-event-message]");
        messageEl.textContent = "Guardando...";
        messageEl.className = "form-message";
        try {
          const { error } = await sbClient
            .from("events")
            .update({
              title: form.title.value.trim(),
              event_date: form.date.value,
              event_time: form.time.value.trim(),
              ministry_id: form.ministryId.value || null,
            })
            .eq("id", id);
          if (error) throw error;
          await loadEvents();
          editingEventId = null;
          renderCalendar();
        } catch (err) {
          messageEl.textContent = "No se pudo guardar: " + err.message;
          messageEl.className = "form-message error";
        }
      });
    });
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

  function showFormFields(s) {
    return `
      <label>Nombre<input type="text" name="name" value="${s ? s.name : ""}" required /></label>
      <label>Descripción<textarea name="description" rows="2" required>${s ? s.description : ""}</textarea></label>
      <label>Búsqueda en Spotify<input type="text" name="spotifyQuery" value="${s ? s.spotifyQuery : ""}" required /></label>
      <label>Búsqueda en YouTube<input type="text" name="youtubeQuery" value="${s ? s.youtubeQuery : ""}" required /></label>
    `;
  }

  function renderShows() {
    const wrap = document.getElementById("podcast-shows");
    const isAdmin = currentRole === "admin";

    let html = podcasts.map((show) => {
      if (isAdmin && editingShowId === show.id) {
        return `
          <form class="edit-form card" data-edit-show="${show.id}">
            ${showFormFields(show)}
            <div class="edit-form-actions">
              <button type="submit" class="btn-primary">Guardar</button>
              <button type="button" class="btn-secondary" data-cancel-show>Cancelar</button>
            </div>
            <p class="form-message" data-show-message></p>
          </form>
        `;
      }
      return `
        <div class="show-card">
          <button class="show-open" data-show="${show.id}" type="button">
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
          ${isAdmin ? `
            <div class="show-admin-row">
              <button class="icon-btn" data-edit-show-btn="${show.id}" type="button" aria-label="Editar">✎</button>
              <button class="icon-btn" data-delete-show-btn="${show.id}" type="button" aria-label="Eliminar">✕</button>
            </div>
          ` : ""}
        </div>
      `;
    }).join("");

    if (isAdmin) {
      if (creatingPodcast) {
        html += `
          <form class="edit-form card" id="create-show-form">
            ${showFormFields(null)}
            <div class="edit-form-actions">
              <button type="submit" class="btn-primary">Agregar</button>
              <button type="button" class="btn-secondary" id="cancel-create-show">Cancelar</button>
            </div>
            <p class="form-message" id="create-show-message"></p>
          </form>
        `;
      } else {
        html += `<button class="show-add" id="add-show-btn" type="button">+ Agregar podcast</button>`;
      }
    }

    wrap.innerHTML = html;

    wrap.querySelectorAll(".show-open").forEach((card) => {
      card.addEventListener("click", () => openShow(card.dataset.show));
    });

    if (!isAdmin) return;

    if (document.getElementById("add-show-btn")) {
      document.getElementById("add-show-btn").addEventListener("click", () => {
        creatingPodcast = true;
        renderShows();
      });
    }
    if (document.getElementById("cancel-create-show")) {
      document.getElementById("cancel-create-show").addEventListener("click", () => {
        creatingPodcast = false;
        renderShows();
      });
    }
    if (document.getElementById("create-show-form")) {
      document.getElementById("create-show-form").addEventListener("submit", async (e) => {
        e.preventDefault();
        const form = e.target;
        const messageEl = document.getElementById("create-show-message");
        messageEl.textContent = "Guardando...";
        messageEl.className = "form-message";
        try {
          const id = slugify(form.name.value.trim()) || "podcast-" + Date.now();
          const { error } = await sbClient.from("podcasts").insert({
            id,
            name: form.name.value.trim(),
            description: form.description.value.trim(),
            spotify_query: form.spotifyQuery.value.trim(),
            youtube_query: form.youtubeQuery.value.trim(),
            sort_order: podcasts.length,
          });
          if (error) throw error;
          await loadPodcasts();
          creatingPodcast = false;
          renderShows();
        } catch (err) {
          messageEl.textContent = "No se pudo agregar: " + err.message;
          messageEl.className = "form-message error";
        }
      });
    }

    wrap.querySelectorAll("[data-edit-show-btn]").forEach((btn) => {
      btn.addEventListener("click", () => {
        editingShowId = btn.dataset.editShowBtn;
        renderShows();
      });
    });
    wrap.querySelectorAll("[data-delete-show-btn]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        if (!confirm("¿Eliminar este podcast y todos sus episodios?")) return;
        const { error } = await sbClient.from("podcasts").delete().eq("id", btn.dataset.deleteShowBtn);
        if (error) {
          alert("No se pudo eliminar: " + error.message);
          return;
        }
        await loadPodcasts();
        renderShows();
      });
    });
    wrap.querySelectorAll("[data-cancel-show]").forEach((btn) => {
      btn.addEventListener("click", () => {
        editingShowId = null;
        renderShows();
      });
    });
    wrap.querySelectorAll("[data-edit-show]").forEach((form) => {
      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const id = form.dataset.editShow;
        const messageEl = form.querySelector("[data-show-message]");
        messageEl.textContent = "Guardando...";
        messageEl.className = "form-message";
        try {
          const { error } = await sbClient
            .from("podcasts")
            .update({
              name: form.name.value.trim(),
              description: form.description.value.trim(),
              spotify_query: form.spotifyQuery.value.trim(),
              youtube_query: form.youtubeQuery.value.trim(),
            })
            .eq("id", id);
          if (error) throw error;
          await loadPodcasts();
          editingShowId = null;
          renderShows();
        } catch (err) {
          messageEl.textContent = "No se pudo guardar: " + err.message;
          messageEl.className = "form-message error";
        }
      });
    });
  }

  function episodeFormFields(ep) {
    return `
      <label>Título<input type="text" name="title" value="${ep ? ep.title : ""}" required /></label>
      <label>Fecha<input type="date" name="date" value="${ep ? ep.date : ""}" required /></label>
      <label>Duración (ej: 24:10)<input type="text" name="duration" value="${ep ? ep.duration : ""}" required /></label>
    `;
  }

  function openShow(showId) {
    currentShowId = showId;
    const show = podcasts.find((s) => s.id === showId);
    const isAdmin = currentRole === "admin";
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
    renderEpisodesList(show, isAdmin);
  }

  function renderEpisodesList(show, isAdmin) {
    const list = document.getElementById("episodes-list");

    let html = show.episodes.map((ep) => {
      if (isAdmin && editingEpisodeId === ep.id) {
        return `
          <form class="edit-form card" data-edit-episode="${ep.id}">
            ${episodeFormFields(ep)}
            <div class="edit-form-actions">
              <button type="submit" class="btn-primary">Guardar</button>
              <button type="button" class="btn-secondary" data-cancel-episode>Cancelar</button>
            </div>
            <p class="form-message" data-episode-message></p>
          </form>
        `;
      }
      return `
        <div class="episode-item">
          <button class="episode-open" data-episode="${ep.id}" type="button">
            <span class="episode-play">▶</span>
            <div>
              <strong>${ep.title}</strong>
              <span>${formatDate(ep.date)} · ${ep.duration}</span>
            </div>
          </button>
          ${isAdmin ? `
            <div class="episode-admin-row">
              <button class="icon-btn" data-edit-episode-btn="${ep.id}" type="button" aria-label="Editar">✎</button>
              <button class="icon-btn" data-delete-episode-btn="${ep.id}" type="button" aria-label="Eliminar">✕</button>
            </div>
          ` : ""}
        </div>
      `;
    }).join("");

    if (isAdmin) {
      if (creatingEpisode) {
        html += `
          <form class="edit-form card" id="create-episode-form">
            ${episodeFormFields(null)}
            <div class="edit-form-actions">
              <button type="submit" class="btn-primary">Agregar</button>
              <button type="button" class="btn-secondary" id="cancel-create-episode">Cancelar</button>
            </div>
            <p class="form-message" id="create-episode-message"></p>
          </form>
        `;
      } else {
        html += `<button class="edit-btn" id="add-episode-btn" type="button">+ Agregar episodio</button>`;
      }
    }

    list.innerHTML = html;

    list.querySelectorAll(".episode-open").forEach((btn) => {
      btn.addEventListener("click", () => {
        const ep = show.episodes.find((e) => e.id === btn.dataset.episode);
        playEpisode(show.name, ep.title);
      });
    });

    if (!isAdmin) return;

    if (document.getElementById("add-episode-btn")) {
      document.getElementById("add-episode-btn").addEventListener("click", () => {
        creatingEpisode = true;
        renderEpisodesList(show, isAdmin);
      });
    }
    if (document.getElementById("cancel-create-episode")) {
      document.getElementById("cancel-create-episode").addEventListener("click", () => {
        creatingEpisode = false;
        renderEpisodesList(show, isAdmin);
      });
    }
    if (document.getElementById("create-episode-form")) {
      document.getElementById("create-episode-form").addEventListener("submit", async (e) => {
        e.preventDefault();
        const form = e.target;
        const messageEl = document.getElementById("create-episode-message");
        messageEl.textContent = "Guardando...";
        messageEl.className = "form-message";
        try {
          const { error } = await sbClient.from("podcast_episodes").insert({
            podcast_id: show.id,
            title: form.title.value.trim(),
            episode_date: form.date.value,
            duration: form.duration.value.trim(),
          });
          if (error) throw error;
          await loadPodcasts();
          creatingEpisode = false;
          openShow(show.id);
        } catch (err) {
          messageEl.textContent = "No se pudo agregar: " + err.message;
          messageEl.className = "form-message error";
        }
      });
    }

    list.querySelectorAll("[data-edit-episode-btn]").forEach((btn) => {
      btn.addEventListener("click", () => {
        editingEpisodeId = btn.dataset.editEpisodeBtn;
        renderEpisodesList(show, isAdmin);
      });
    });
    list.querySelectorAll("[data-delete-episode-btn]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        if (!confirm("¿Eliminar este episodio?")) return;
        const { error } = await sbClient.from("podcast_episodes").delete().eq("id", btn.dataset.deleteEpisodeBtn);
        if (error) {
          alert("No se pudo eliminar: " + error.message);
          return;
        }
        await loadPodcasts();
        openShow(show.id);
      });
    });
    list.querySelectorAll("[data-cancel-episode]").forEach((btn) => {
      btn.addEventListener("click", () => {
        editingEpisodeId = null;
        renderEpisodesList(show, isAdmin);
      });
    });
    list.querySelectorAll("[data-edit-episode]").forEach((form) => {
      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const id = form.dataset.editEpisode;
        const messageEl = form.querySelector("[data-episode-message]");
        messageEl.textContent = "Guardando...";
        messageEl.className = "form-message";
        try {
          const { error } = await sbClient
            .from("podcast_episodes")
            .update({
              title: form.title.value.trim(),
              episode_date: form.date.value,
              duration: form.duration.value.trim(),
            })
            .eq("id", id);
          if (error) throw error;
          await loadPodcasts();
          editingEpisodeId = null;
          openShow(show.id);
        } catch (err) {
          messageEl.textContent = "No se pudo guardar: " + err.message;
          messageEl.className = "form-message error";
        }
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

  function ministryFormFields(m) {
    return `
      <label>Ícono (emoji)<input type="text" name="icon" value="${m ? m.icon : "🤝"}" maxlength="4" required /></label>
      <label>Nombre<input type="text" name="name" value="${m ? m.name : ""}" required /></label>
      <label>Descripción<textarea name="description" rows="3" required>${m ? m.description : ""}</textarea></label>
    `;
  }

  function renderMinistries() {
    const grid = document.getElementById("ministries-grid");
    const isAdmin = currentRole === "admin";

    let html = ministries.map((m) => {
      if (isAdmin && editingMinistryId === m.id) {
        return `
          <form class="ministry-card edit-form" data-edit-ministry="${m.id}">
            ${ministryFormFields(m)}
            <div class="edit-form-actions">
              <button type="submit" class="btn-primary">Guardar</button>
              <button type="button" class="btn-secondary" data-cancel-ministry>Cancelar</button>
            </div>
            <p class="form-message" data-ministry-message></p>
          </form>
        `;
      }
      return `
        <div class="ministry-card">
          <button class="ministry-open" data-ministry="${m.id}" type="button">
            <div class="ministry-icon">${m.icon}</div>
            <strong>${m.name}</strong>
            <p>${m.description}</p>
          </button>
          ${isAdmin ? `
            <div class="ministry-admin-row">
              <button class="icon-btn" data-edit-ministry-btn="${m.id}" type="button" aria-label="Editar">✎</button>
              <button class="icon-btn" data-delete-ministry-btn="${m.id}" type="button" aria-label="Eliminar">✕</button>
            </div>
          ` : ""}
        </div>
      `;
    }).join("");

    if (isAdmin) {
      if (creatingMinistry) {
        html += `
          <form class="ministry-card edit-form" id="create-ministry-form">
            ${ministryFormFields(null)}
            <div class="edit-form-actions">
              <button type="submit" class="btn-primary">Agregar</button>
              <button type="button" class="btn-secondary" id="cancel-create-ministry">Cancelar</button>
            </div>
            <p class="form-message" id="create-ministry-message"></p>
          </form>
        `;
      } else {
        html += `<button class="ministry-card ministry-add" id="add-ministry-btn" type="button">+ Agregar ministerio</button>`;
      }
    }

    grid.innerHTML = html;

    grid.querySelectorAll(".ministry-open").forEach((card) => {
      card.addEventListener("click", () => openMinistry(card.dataset.ministry));
    });

    if (!isAdmin) return;

    if (document.getElementById("add-ministry-btn")) {
      document.getElementById("add-ministry-btn").addEventListener("click", () => {
        creatingMinistry = true;
        renderMinistries();
      });
    }
    if (document.getElementById("cancel-create-ministry")) {
      document.getElementById("cancel-create-ministry").addEventListener("click", () => {
        creatingMinistry = false;
        renderMinistries();
      });
    }
    if (document.getElementById("create-ministry-form")) {
      document.getElementById("create-ministry-form").addEventListener("submit", async (e) => {
        e.preventDefault();
        const form = e.target;
        const messageEl = document.getElementById("create-ministry-message");
        messageEl.textContent = "Guardando...";
        messageEl.className = "form-message";
        try {
          const id = slugify(form.name.value.trim()) || "ministerio-" + Date.now();
          const { error } = await sbClient.from("ministries").insert({
            id,
            name: form.name.value.trim(),
            icon: form.icon.value.trim() || "🤝",
            description: form.description.value.trim(),
            sort_order: ministries.length,
          });
          if (error) throw error;
          await loadMinistries();
          populateMinistrySelect();
          creatingMinistry = false;
          renderMinistries();
        } catch (err) {
          messageEl.textContent = "No se pudo agregar: " + err.message;
          messageEl.className = "form-message error";
        }
      });
    }

    grid.querySelectorAll("[data-edit-ministry-btn]").forEach((btn) => {
      btn.addEventListener("click", () => {
        editingMinistryId = btn.dataset.editMinistryBtn;
        renderMinistries();
      });
    });
    grid.querySelectorAll("[data-delete-ministry-btn]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        if (!confirm("¿Eliminar este ministerio?")) return;
        const { error } = await sbClient.from("ministries").delete().eq("id", btn.dataset.deleteMinistryBtn);
        if (error) {
          alert("No se pudo eliminar: " + error.message);
          return;
        }
        await loadMinistries();
        populateMinistrySelect();
        renderMinistries();
      });
    });
    grid.querySelectorAll("[data-cancel-ministry]").forEach((btn) => {
      btn.addEventListener("click", () => {
        editingMinistryId = null;
        renderMinistries();
      });
    });
    grid.querySelectorAll("[data-edit-ministry]").forEach((form) => {
      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const id = form.dataset.editMinistry;
        const messageEl = form.querySelector("[data-ministry-message]");
        messageEl.textContent = "Guardando...";
        messageEl.className = "form-message";
        try {
          const { error } = await sbClient
            .from("ministries")
            .update({
              name: form.name.value.trim(),
              icon: form.icon.value.trim() || "🤝",
              description: form.description.value.trim(),
            })
            .eq("id", id);
          if (error) throw error;
          await loadMinistries();
          populateMinistrySelect();
          editingMinistryId = null;
          renderMinistries();
        } catch (err) {
          messageEl.textContent = "No se pudo guardar: " + err.message;
          messageEl.className = "form-message error";
        }
      });
    });
  }

  function openMinistry(id) {
    currentMinistryId = id;
    const m = ministryById(id);
    document.getElementById("ministry-detail-block").hidden = false;
    const relatedAnnouncements = allAnnouncements().filter((a) => a.ministryId === id);
    const relatedEvents = events.filter((e) => e.ministryId === id);

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

  /* ---------------- Autenticación ---------------- */

  function renderAuthSection() {
    const wrap = document.getElementById("auth-section");

    if (!sbClient) {
      wrap.innerHTML = `
        <div class="card">
          <p class="form-message error">No se pudo conectar con el servidor de cuentas. Revisa tu conexión a internet y recarga la página.</p>
        </div>
      `;
      return;
    }

    if (!currentUser) {
      wrap.innerHTML = `
        <div class="card auth-card">
          <div class="auth-tabs">
            <button class="auth-tab active" data-auth-tab="login" type="button">Iniciar sesión</button>
            <button class="auth-tab" data-auth-tab="signup" type="button">Crear cuenta</button>
          </div>
          <form id="login-form" class="form-card auth-form">
            <label>Correo electrónico<input type="email" id="login-email" required /></label>
            <label>Contraseña<input type="password" id="login-password" required /></label>
            <button type="submit" class="btn-primary">Iniciar sesión</button>
            <p class="form-message" id="login-message"></p>
          </form>
          <form id="signup-form" class="form-card auth-form" hidden>
            <label>Correo electrónico<input type="email" id="signup-email" required /></label>
            <label>Contraseña (mínimo 6 caracteres)<input type="password" id="signup-password" required minlength="6" /></label>
            <button type="submit" class="btn-primary">Crear cuenta</button>
            <p class="form-message" id="signup-message"></p>
          </form>
        </div>
      `;

      wrap.querySelectorAll(".auth-tab").forEach((btn) => {
        btn.addEventListener("click", () => {
          const target = btn.dataset.authTab;
          wrap.querySelectorAll(".auth-tab").forEach((b) => b.classList.toggle("active", b === btn));
          document.getElementById("login-form").hidden = target !== "login";
          document.getElementById("signup-form").hidden = target !== "signup";
        });
      });

      document.getElementById("login-form").addEventListener("submit", async (e) => {
        e.preventDefault();
        const email = document.getElementById("login-email").value.trim();
        const password = document.getElementById("login-password").value;
        const messageEl = document.getElementById("login-message");
        messageEl.textContent = "Entrando...";
        messageEl.className = "form-message";
        const { error } = await sbClient.auth.signInWithPassword({ email, password });
        if (error) {
          messageEl.textContent = error.message;
          messageEl.className = "form-message error";
        }
      });

      document.getElementById("signup-form").addEventListener("submit", async (e) => {
        e.preventDefault();
        const email = document.getElementById("signup-email").value.trim();
        const password = document.getElementById("signup-password").value;
        const messageEl = document.getElementById("signup-message");
        messageEl.textContent = "Creando cuenta...";
        messageEl.className = "form-message";
        const { data, error } = await sbClient.auth.signUp({ email, password });
        if (error) {
          messageEl.textContent = error.message;
          messageEl.className = "form-message error";
          return;
        }
        messageEl.textContent = data.session
          ? "Cuenta creada."
          : "Cuenta creada. Revisa tu correo para confirmarla antes de iniciar sesión.";
        messageEl.className = "form-message success";
      });
      return;
    }

    const badgeClass = currentRole === "admin" ? "role-badge admin" : "role-badge";
    const roleLabel = currentRole === "admin" ? "Administrador" : "Miembro";
    wrap.innerHTML = `
      <div class="card profile-card">
        <div class="avatar">🙏</div>
        <div>
          <strong>${currentUser.email}</strong><br />
          <span class="${badgeClass}">${roleLabel}</span>
        </div>
      </div>
      <button class="btn-secondary" id="logout-btn" type="button">Cerrar sesión</button>
    `;
    document.getElementById("logout-btn").addEventListener("click", async () => {
      await sbClient.auth.signOut();
    });
  }

  function resetEditingState() {
    editingAbout = false;
    editingPhotoPairId = null;
    creatingPhotoPair = false;
    editingMinistryId = null;
    creatingMinistry = false;
    editingShowId = null;
    creatingPodcast = false;
    editingEpisodeId = null;
    creatingEpisode = false;
    editingEventId = null;
    creatingEvent = false;
  }

  function rerenderEditableContent() {
    renderAbout();
    renderPhotoPairs();
    renderMinistries();
    renderShows();
    renderCalendar();
    if (!document.getElementById("episodes-block").hidden && currentShowId) {
      openShow(currentShowId);
    }
  }

  async function refreshAuth() {
    if (!sbClient) {
      currentUser = null;
      currentRole = "guest";
      renderAuthSection();
      updateCreateAnnouncementVisibility();
      rerenderEditableContent();
      return;
    }
    try {
      const { data: { session } } = await sbClient.auth.getSession();
      currentUser = session ? session.user : null;
      if (currentUser) {
        const { data: profile, error } = await sbClient
          .from("profiles")
          .select("role")
          .eq("id", currentUser.id)
          .single();
        currentRole = error ? "user" : profile.role;
      } else {
        currentRole = "guest";
      }
    } catch (e) {
      console.error("No se pudo conectar con Supabase para verificar la sesión:", e);
      currentUser = null;
      currentRole = "guest";
    }
    renderAuthSection();
    updateCreateAnnouncementVisibility();
    resetEditingState();
    rerenderEditableContent();
  }

  if (sbClient) {
    sbClient.auth.onAuthStateChange((event) => {
      if (event === "INITIAL_SESSION") return;
      refreshAuth().then(() => loadAnnouncements().then(renderFeed));
    });
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

  async function init() {
    populateMinistrySelect();
    renderAbout();
    renderPhotoPairs();
    renderCalendar();
    renderShows();
    renderMinistries();
    renderNotifications();
    updateBadge();

    await Promise.all([
      loadSiteSettings(),
      loadActivityPhotos(),
      loadAnnouncements(),
      loadMinistries(),
      loadPodcasts(),
      loadEvents(),
    ]);
    populateMinistrySelect();
    renderAbout();
    renderPhotoPairs();
    renderMinistries();
    renderShows();
    renderCalendar();
    renderFeed();

    await refreshAuth();
  }

  init();
})();
