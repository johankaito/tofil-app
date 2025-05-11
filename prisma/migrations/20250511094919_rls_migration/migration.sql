-- ==========================================================
-- 🔐  Helper functions
-- ==========================================================
create or replace function is_admin() returns boolean language sql stable as $$
  select exists(select 1 from public."User" where id = auth.uid() and type = 'ADMIN');
$$;
create or replace function is_owner() returns boolean language sql stable as $$
  select exists(select 1 from public."User" where id = auth.uid() and type = 'OWNER');
$$;
create or replace function is_manager() returns boolean language sql stable as $$
  select exists(select 1 from public."User" where id = auth.uid() and type = 'MANAGER');
$$;
create or replace function is_contractor() returns boolean language sql stable as $$
  select exists(select 1 from public."User" where id = auth.uid() and type = 'CONTRACTOR');
$$;

-- ==========================================================
-- 🗄  Enable RLS on tables
-- ==========================================================
alter table public."User"         enable row level security;
alter table public."Organisation" enable row level security;
alter table public."Location"     enable row level security;
alter table public."Job"          enable row level security;

-- ==========================================================
-- 👤  USER POLICIES
-- ==========================================================
create policy user_select on public."User" for select using ( auth.uid() is not null );
create policy user_insert on public."User" for insert  with check ( true );
create policy user_update on public."User" for update using ( is_admin() or id = auth.uid() ) with check ( is_admin() or id = auth.uid() );
create policy user_delete on public."User" for delete using ( is_admin() );

-- ==========================================================
-- 🏢  ORGANISATION POLICIES
-- ==========================================================
create policy org_select on public."Organisation" for select using ( is_admin() or ownerId = auth.uid() );
create policy org_insert on public."Organisation" for insert  with check ( is_admin() or is_owner() );
create policy org_update on public."Organisation" for update using ( is_admin() or ownerId = auth.uid() ) with check ( is_admin() or ownerId = auth.uid() );
create policy org_delete on public."Organisation" for delete using ( is_admin() );

-- ==========================================================
-- 📍  LOCATION POLICIES
-- ==========================================================
create policy loc_select on public."Location" for select using (
       is_admin()
    or organisationId in (select id from public."Organisation" where ownerId = auth.uid())
    or id = (select managerLocationId from public."User" where id = auth.uid())
);
create policy loc_insert on public."Location" for insert  with check (
       is_admin()
    or organisationId in (select id from public."Organisation" where ownerId = auth.uid())
);
create policy loc_update on public."Location" for update using (
       is_admin()
    or organisationId in (select id from public."Organisation" where ownerId = auth.uid())
) with check ( using );
create policy loc_delete on public."Location" for delete using ( is_admin() );

-- ==========================================================
-- 📄  JOB POLICIES
-- ==========================================================
create policy job_select on public."Job" for select using (
       is_admin()
    or ownerId = auth.uid()
    or (is_manager() and locationId = (select managerLocationId from public."User" where id = auth.uid()))
    or (is_contractor() and (status = 'AVAILABLE' or contractorId = auth.uid()))
);
create policy job_insert on public."Job" for insert  with check ( ownerId = auth.uid() );
create policy job_update on public."Job" for update using (
       is_admin()
    or (ownerId = auth.uid() and status in ('PENDING_REVIEW','AVAILABLE'))
    or (is_contractor() and contractorId = auth.uid())
) with check ( using );
create policy job_delete on public."Job" for delete using ( is_admin() );