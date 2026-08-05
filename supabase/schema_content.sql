-- Ministerios, podcasts/episodios y eventos del calendario editables por
-- administradores. Ejecuta esto UNA VEZ en el SQL Editor de Supabase,
-- además de schema.sql y schema_photos.sql que ya corriste antes.

-- ============ MINISTERIOS ============

create table if not exists public.ministries (
  id text primary key,
  name text not null,
  icon text not null default '🤝',
  description text not null default '',
  sort_order int not null default 0
);

alter table public.ministries enable row level security;

drop policy if exists "Ministries are publicly viewable" on public.ministries;
create policy "Ministries are publicly viewable"
  on public.ministries for select
  to anon, authenticated
  using (true);

drop policy if exists "Only admins can insert ministries" on public.ministries;
create policy "Only admins can insert ministries"
  on public.ministries for insert
  to authenticated
  with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

drop policy if exists "Only admins can update ministries" on public.ministries;
create policy "Only admins can update ministries"
  on public.ministries for update
  to authenticated
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

drop policy if exists "Only admins can delete ministries" on public.ministries;
create policy "Only admins can delete ministries"
  on public.ministries for delete
  to authenticated
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

insert into public.ministries (id, name, icon, description, sort_order)
select * from (
  values
    ('jovenes', 'Jóvenes', '🔥', 'Espacio para que los jóvenes de la iglesia crezcan en su fe, sirvan juntos y construyan comunidad.', 1),
    ('grupos-dinamicos', 'Grupos Dinámicos', '🌐', 'Grupos pequeños que se reúnen para estudiar la Palabra, orar y apoyarse mutuamente.', 2),
    ('dorcas', 'Dorcas', '🧵', 'Ministerio de servicio y ayuda práctica a la congregación y la comunidad.', 3),
    ('damas-solteras', 'Damas Solteras', '🌷', 'Comunidad para damas solteras enfocada en el crecimiento espiritual y la amistad.', 4),
    ('grupo-oracion', 'Grupo de Oración', '🙏', 'Tiempo dedicado a interceder en oración por la iglesia, las familias y la comunidad.', 5),
    ('tres-en-la-palabra', '3 en la Palabra', '📖', 'Estudio bíblico en grupos pequeños de tres personas para profundizar juntos en la Palabra.', 6)
) as seed(id, name, icon, description, sort_order)
where not exists (select 1 from public.ministries);

-- ============ PODCASTS Y EPISODIOS ============

create table if not exists public.podcasts (
  id text primary key,
  name text not null,
  description text not null default '',
  cover text not null default 'cover-a',
  spotify_query text not null default '',
  youtube_query text not null default '',
  sort_order int not null default 0
);

alter table public.podcasts enable row level security;

drop policy if exists "Podcasts are publicly viewable" on public.podcasts;
create policy "Podcasts are publicly viewable"
  on public.podcasts for select
  to anon, authenticated
  using (true);

drop policy if exists "Only admins can insert podcasts" on public.podcasts;
create policy "Only admins can insert podcasts"
  on public.podcasts for insert
  to authenticated
  with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

drop policy if exists "Only admins can update podcasts" on public.podcasts;
create policy "Only admins can update podcasts"
  on public.podcasts for update
  to authenticated
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

drop policy if exists "Only admins can delete podcasts" on public.podcasts;
create policy "Only admins can delete podcasts"
  on public.podcasts for delete
  to authenticated
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

insert into public.podcasts (id, name, description, cover, spotify_query, youtube_query, sort_order)
select * from (
  values
    ('mas-alla-de-las-paredes', 'Más Allá de las Paredes', 'Conducido por varios miembros del equipo de la iglesia. Disponible en Spotify y YouTube.', 'cover-a', 'Más Allá de las Paredes podcast', 'Más Allá de las Paredes podcast Iglesia Bautista Sin Paredes de Salinas', 1),
    ('entre-hermanas', 'Entre Hermanas', 'Dirigido por las damas de la iglesia, para las damas y para toda la congregación.', 'cover-b', 'Entre Hermanas podcast', 'Entre Hermanas podcast Iglesia Bautista Sin Paredes de Salinas', 2)
) as seed(id, name, description, cover, spotify_query, youtube_query, sort_order)
where not exists (select 1 from public.podcasts);

create table if not exists public.podcast_episodes (
  id uuid primary key default gen_random_uuid(),
  podcast_id text not null references public.podcasts (id) on delete cascade,
  title text not null,
  episode_date date not null default current_date,
  duration text not null default ''
);

alter table public.podcast_episodes enable row level security;

drop policy if exists "Episodes are publicly viewable" on public.podcast_episodes;
create policy "Episodes are publicly viewable"
  on public.podcast_episodes for select
  to anon, authenticated
  using (true);

drop policy if exists "Only admins can insert episodes" on public.podcast_episodes;
create policy "Only admins can insert episodes"
  on public.podcast_episodes for insert
  to authenticated
  with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

drop policy if exists "Only admins can update episodes" on public.podcast_episodes;
create policy "Only admins can update episodes"
  on public.podcast_episodes for update
  to authenticated
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

drop policy if exists "Only admins can delete episodes" on public.podcast_episodes;
create policy "Only admins can delete episodes"
  on public.podcast_episodes for delete
  to authenticated
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

insert into public.podcast_episodes (podcast_id, title, episode_date, duration)
select * from (
  values
    ('mas-alla-de-las-paredes', 'Episodio 1: Bienvenidos', date '2026-07-26', '24:10'),
    ('mas-alla-de-las-paredes', 'Episodio 2: Fe en comunidad', date '2026-07-19', '31:45'),
    ('mas-alla-de-las-paredes', 'Episodio 3: Sin paredes, sin límites', date '2026-07-12', '28:02'),
    ('entre-hermanas', 'Episodio 1: Hermanas en la fe', date '2026-07-28', '22:30'),
    ('entre-hermanas', 'Episodio 2: Identidad en Cristo', date '2026-07-21', '27:15'),
    ('entre-hermanas', 'Episodio 3: Servir con amor', date '2026-07-14', '25:50')
) as seed(podcast_id, title, episode_date, duration)
where not exists (select 1 from public.podcast_episodes);

-- ============ EVENTOS DEL CALENDARIO ============

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  event_date date not null,
  event_time text not null default '',
  ministry_id text references public.ministries (id) on delete set null
);

alter table public.events enable row level security;

drop policy if exists "Events are publicly viewable" on public.events;
create policy "Events are publicly viewable"
  on public.events for select
  to anon, authenticated
  using (true);

drop policy if exists "Only admins can insert events" on public.events;
create policy "Only admins can insert events"
  on public.events for insert
  to authenticated
  with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

drop policy if exists "Only admins can update events" on public.events;
create policy "Only admins can update events"
  on public.events for update
  to authenticated
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

drop policy if exists "Only admins can delete events" on public.events;
create policy "Only admins can delete events"
  on public.events for delete
  to authenticated
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

insert into public.events (title, event_date, event_time, ministry_id)
select * from (
  values
    ('Reunión de Jóvenes', date '2026-08-07', '6:00 p.m.', 'jovenes'),
    ('Grupo de Oración', date '2026-08-08', '9:00 a.m.', 'grupo-oracion'),
    ('Encuentro Damas Solteras', date '2026-08-12', '7:00 p.m.', 'damas-solteras'),
    ('Confraternidad Dorcas', date '2026-08-15', '10:00 a.m.', 'dorcas'),
    ('3 en la Palabra', date '2026-08-19', '7:00 p.m.', 'tres-en-la-palabra'),
    ('Grupos Dinámicos', date '2026-08-22', '6:30 p.m.', 'grupos-dinamicos')
) as seed(title, event_date, event_time, ministry_id)
where not exists (select 1 from public.events);
