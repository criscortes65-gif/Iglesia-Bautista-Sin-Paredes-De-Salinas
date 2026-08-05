-- Iglesia Bautista Sin Paredes de Salinas — esquema de base de datos
--
-- Cómo usarlo:
-- 1. Entra a tu proyecto en https://supabase.com/dashboard
-- 2. Ve a "SQL Editor" → "New query"
-- 3. Pega todo este archivo y presiona "Run"
--
-- Esto crea:
--   - profiles: un rol (user/admin) por cada persona que se registra
--   - announcements: los anuncios que se muestran en Inicio
--   - reglas de seguridad (RLS) para que SOLO los administradores puedan
--     crear, editar o borrar anuncios; cualquiera puede leerlos.
--
-- Cómo asignar el primer administrador (tú):
-- 1. Entra a la app y crea tu cuenta desde Perfil → Crear cuenta.
-- 2. En Supabase, ve a "Table Editor" → tabla "profiles".
-- 3. Busca tu fila (por tu correo) y cambia la columna "role" de "user" a "admin".
-- Repite el paso 2-3 para cualquier otra persona que quieras hacer administradora.

create extension if not exists pgcrypto;

-- ---------- profiles ----------

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  role text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "Profiles are viewable by authenticated users" on public.profiles;
create policy "Profiles are viewable by authenticated users"
  on public.profiles for select
  to authenticated
  using (true);

-- Crea automáticamente una fila en "profiles" (con role = 'user') cada vez
-- que alguien se registra. El rol solo se cambia manualmente desde el
-- Table Editor (nunca desde la app), así nadie puede volverse admin solo.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, role)
  values (new.id, new.email, 'user');
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ---------- announcements ----------

create table if not exists public.announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  detail text not null,
  category text not null check (category in ('General', 'Podcast', 'Ministerio')),
  ministry_id text,
  event_date date not null default current_date,
  created_by uuid references auth.users (id),
  created_at timestamptz not null default now()
);

alter table public.announcements enable row level security;

drop policy if exists "Announcements are publicly viewable" on public.announcements;
create policy "Announcements are publicly viewable"
  on public.announcements for select
  to anon, authenticated
  using (true);

drop policy if exists "Only admins can insert announcements" on public.announcements;
create policy "Only admins can insert announcements"
  on public.announcements for insert
  to authenticated
  with check (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

drop policy if exists "Only admins can update announcements" on public.announcements;
create policy "Only admins can update announcements"
  on public.announcements for update
  to authenticated
  using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

drop policy if exists "Only admins can delete announcements" on public.announcements;
create policy "Only admins can delete announcements"
  on public.announcements for delete
  to authenticated
  using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

-- ---------- anuncios de ejemplo (opcional) ----------
-- Puedes borrar este bloque si no quieres estos anuncios de ejemplo.

insert into public.announcements (title, detail, category, ministry_id, event_date)
values
  ('Nuevo capítulo: Más Allá de las Paredes', 'Ya está disponible el episodio 1 en Spotify y YouTube.', 'Podcast', null, '2026-07-26'),
  ('Nuevo capítulo: Entre Hermanas', 'Las hermanas comparten un nuevo episodio para toda la congregación.', 'Podcast', null, '2026-07-28'),
  ('Reunión de Jóvenes este viernes', 'Ven a compartir con el ministerio de jóvenes. Todos son bienvenidos.', 'Ministerio', 'jovenes', '2026-08-01'),
  ('Noche de oración', 'El grupo de oración se reúne para interceder por la iglesia y la comunidad.', 'Ministerio', 'grupo-oracion', '2026-07-30'),
  ('Recuerda: culto en vivo por Facebook', 'Cada domingo a las 10:00 a.m. transmitimos el culto en vivo.', 'General', null, '2026-08-02')
on conflict do nothing;
