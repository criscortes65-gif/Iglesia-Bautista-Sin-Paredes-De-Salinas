# Iglesia Bautista Sin Paredes de Salinas

Aplicación web responsive (móvil y escritorio) para la iglesia: anuncios, ministerios, calendario de actividades, podcasts y notificaciones.

## Secciones

- **Inicio** — aviso del culto en vivo por Facebook (domingos 10:00 a.m.), sección "Quiénes somos" con foto y descripción de la iglesia, pares de fotos de actividades recientes, formulario para crear anuncios y el feed de anuncios.
- **Calendario** — vista de mes con eventos y los cultos dominicales por Facebook.
- **Podcasts** — *Más Allá de las Paredes* y *Entre Hermanas*, con lista de episodios y reproductor simulado (enlaces de búsqueda a Spotify y YouTube).
- **Ministerios** — Jóvenes, Grupos Dinámicos, Dorcas, Damas Solteras, Grupo de Oración y 3 en la Palabra, con detalle y anuncios por ministerio.
- **Notificaciones** — nuevo capítulo de podcast, anuncio de ministerio, recordatorio de evento y anuncio general.
- **Perfil** — inicio de sesión / creación de cuenta, rol (administrador o miembro), preferencias de notificaciones y datos de la iglesia.

## Administradores y anuncios

Los anuncios se guardan en una base de datos (Supabase), no en el navegador, así que los ve todo el que visite la página. Solo las cuentas con rol **admin** pueden publicar — el resto de la gente solo los lee.

**Cómo asignar administradores:**
1. Ejecuta una sola vez el archivo `supabase/schema.sql` en el SQL Editor de tu proyecto de Supabase (crea las tablas `profiles` y `announcements`, y las reglas de seguridad).
2. Cada persona crea su cuenta desde **Perfil → Crear cuenta** en la app. Por defecto todos entran con rol `user` (no pueden publicar).
3. En Supabase, ve a **Table Editor → profiles**, busca la fila de la persona (por su correo) y cambia `role` de `user` a `admin`.

Ese cambio de rol solo se hace desde el panel de Supabase, nunca desde la app — así nadie puede volverse administrador por su cuenta.

## Cómo ejecutar

Es un sitio estático (HTML/CSS/JS sin dependencias). Para verlo localmente:

```bash
python3 -m http.server 8000
```

y abre `http://localhost:8000`. Necesitas conexión a internet: la app carga la librería de Supabase desde un CDN y se conecta a la base de datos de anuncios/usuarios en `js/supabase-config.js` (la clave ahí es la "publishable key", pensada para ser pública — la seguridad la dan las reglas de `supabase/schema.sql`, no el secreto de esa clave).

## Personalización pendiente

- **Fotos reales**: reemplaza los recuadros `📷` en `js/app.js` (`ACTIVITY_PHOTO_GROUPS`) y el de "Quiénes somos" (`#about-photo` en `index.html`) por imágenes reales en `assets/photos/`.
- **Descripción de "Quiénes somos"**: el texto en `index.html` (`.about-body p`) es un borrador — ajústalo con la descripción oficial de la iglesia.
- **Eventos del calendario**: los eventos en `SAMPLE_EVENTS` (`js/app.js`) son de ejemplo — actualízalos con el horario real de cada ministerio.
- **Enlaces de Spotify/YouTube**: por ahora abren una búsqueda del nombre del podcast; reemplázalos por los enlaces directos cuando estén disponibles.
