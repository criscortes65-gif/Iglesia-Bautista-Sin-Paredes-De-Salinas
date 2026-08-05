# Iglesia Bautista Sin Paredes de Salinas

Aplicación web responsive (móvil y escritorio) para la iglesia: anuncios, ministerios, calendario de actividades, podcasts y notificaciones.

## Secciones

- **Inicio** — aviso del culto en vivo por Facebook (domingos 10:00 a.m.), sección "Quiénes somos" con foto y descripción de la iglesia, pares de fotos de actividades recientes, formulario para crear anuncios y el feed de anuncios.
- **Calendario** — vista de mes con eventos y los cultos dominicales por Facebook.
- **Podcasts** — *Más Allá de las Paredes* y *Entre Hermanas*, con lista de episodios y reproductor simulado (enlaces de búsqueda a Spotify y YouTube).
- **Ministerios** — Jóvenes, Grupos Dinámicos, Dorcas, Damas Solteras, Grupo de Oración y 3 en la Palabra, con detalle y anuncios por ministerio.
- **Notificaciones** — nuevo capítulo de podcast, anuncio de ministerio, recordatorio de evento y anuncio general.
- **Perfil** — preferencias de notificaciones y datos de la iglesia.

## Cómo ejecutar

Es un sitio estático (HTML/CSS/JS sin dependencias). Para verlo localmente:

```bash
python3 -m http.server 8000
```

y abre `http://localhost:8000`.

## Personalización pendiente

- **Fotos reales**: reemplaza los recuadros `📷` en `js/app.js` (`ACTIVITY_PHOTO_GROUPS`) y el de "Quiénes somos" (`#about-photo` en `index.html`) por imágenes reales en `assets/photos/`.
- **Descripción de "Quiénes somos"**: el texto en `index.html` (`.about-body p`) es un borrador — ajústalo con la descripción oficial de la iglesia.
- **Eventos del calendario**: los eventos en `SAMPLE_EVENTS` (`js/app.js`) son de ejemplo — actualízalos con el horario real de cada ministerio.
- **Enlaces de Spotify/YouTube**: por ahora abren una búsqueda del nombre del podcast; reemplázalos por los enlaces directos cuando estén disponibles.
