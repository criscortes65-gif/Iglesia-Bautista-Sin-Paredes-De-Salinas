-- Fotos editables por administradores (foto de "Quiénes somos" + pares de
-- fotos de actividades). Ejecuta esto UNA VEZ en el SQL Editor de Supabase,
-- además de supabase/schema.sql que ya corriste antes.

-- 1) Bucket de Storage donde se guardan las fotos que suban los administradores.
insert into storage.buckets (id, name, public)
values ('photos', 'photos', true)
on conflict (id) do nothing;

-- Cualquiera puede VER las fotos.
drop policy if exists "Public read access to photos" on storage.objects;
create policy "Public read access to photos"
  on storage.objects for select
  to public
  using (bucket_id = 'photos');

-- Solo administradores pueden subir, actualizar o borrar fotos.
drop policy if exists "Admins can upload photos" on storage.objects;
create policy "Admins can upload photos"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'photos'
    and exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

drop policy if exists "Admins can update photos" on storage.objects;
create policy "Admins can update photos"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'photos'
    and exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

drop policy if exists "Admins can delete photos" on storage.objects;
create policy "Admins can delete photos"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'photos'
    and exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

-- 2) Contenido de "Quiénes somos" (una sola fila con el texto y la foto).
create table if not exists public.site_settings (
  id int primary key default 1,
  about_text text not null default 'Somos una iglesia que cree que la fe no tiene paredes: nos reunimos para adorar, servir a nuestra comunidad y crecer juntos en la Palabra. Nuestras puertas están abiertas para todos, sin importar de dónde vengas.',
  about_photo_url text,
  constraint site_settings_singleton check (id = 1)
);

insert into public.site_settings (id) values (1)
on conflict (id) do nothing;

alter table public.site_settings enable row level security;

drop policy if exists "Site settings are publicly viewable" on public.site_settings;
create policy "Site settings are publicly viewable"
  on public.site_settings for select
  to anon, authenticated
  using (true);

drop policy if exists "Only admins can update site settings" on public.site_settings;
create policy "Only admins can update site settings"
  on public.site_settings for update
  to authenticated
  using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

-- 3) Pares de fotos de actividades recientes (Inicio).
create table if not exists public.activity_photos (
  id uuid primary key default gen_random_uuid(),
  caption text not null,
  photo_date text not null,
  image_url_1 text,
  image_url_2 text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

alter table public.activity_photos enable row level security;

drop policy if exists "Activity photos are publicly viewable" on public.activity_photos;
create policy "Activity photos are publicly viewable"
  on public.activity_photos for select
  to anon, authenticated
  using (true);

drop policy if exists "Only admins can insert activity photos" on public.activity_photos;
create policy "Only admins can insert activity photos"
  on public.activity_photos for insert
  to authenticated
  with check (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

drop policy if exists "Only admins can update activity photos" on public.activity_photos;
create policy "Only admins can update activity photos"
  on public.activity_photos for update
  to authenticated
  using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

drop policy if exists "Only admins can delete activity photos" on public.activity_photos;
create policy "Only admins can delete activity photos"
  on public.activity_photos for delete
  to authenticated
  using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

-- Semilla: los 4 pares de ejemplo que ya tenía la página (solo la primera vez).
insert into public.activity_photos (caption, photo_date, sort_order)
select * from (
  values
    ('Retiro de Jóvenes', 'Julio 2026', 1),
    ('Servicio Comunitario', 'Julio 2026', 2),
    ('Confraternidad Dorcas', 'Junio 2026', 3),
    ('Noche Entre Hermanas', 'Junio 2026', 4)
) as seed(caption, photo_date, sort_order)
where not exists (select 1 from public.activity_photos);
