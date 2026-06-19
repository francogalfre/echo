-- Storage bucket for organization (project) logos.
--
-- Public read so the logo URL stored in organization.logo is served directly.
-- Writes are performed server-side with the Supabase service role AFTER a Better
-- Auth membership check, so no RLS write policies are defined: RLS on
-- storage.objects already blocks anon/authenticated writes, and the service role
-- bypasses RLS. Echo does not use Supabase Auth, so auth.uid()-based policies
-- would never match.
--
-- Object path convention: logo/<organizationId>/<filename>

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'organizations',
  'organizations',
  true,
  1048576, -- 1 MB
  array['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;
