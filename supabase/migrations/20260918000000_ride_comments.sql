-- Comments on a ride. user_id points at profiles(id) directly (not
-- auth.users(id)) from the start, so PostgREST can embed the author the
-- same way group_members/ride_rsvps do — see
-- 20260913010000_ride_rsvps_profiles_fk.sql for what happens when that FK
-- is missing.
create table public.ride_comments (
  id uuid primary key default gen_random_uuid(),
  ride_id uuid not null references public.rides(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now()
);

create index ride_comments_ride_id_idx on public.ride_comments(ride_id);

alter table public.ride_comments enable row level security;

-- Same "member of the ride's group" shape as the ride_rsvps policies.
create policy "ride_comments: members can select"
  on public.ride_comments for select
  using (
    exists (
      select 1 from rides
      join group_members on group_members.group_id = rides.group_id
      where rides.id = ride_comments.ride_id
        and group_members.user_id = auth.uid()
    )
  );

create policy "ride_comments: members can insert own"
  on public.ride_comments for insert
  with check (
    user_id = auth.uid()
    and exists (
      select 1 from rides
      join group_members on group_members.group_id = rides.group_id
      where rides.id = ride_comments.ride_id
        and group_members.user_id = auth.uid()
    )
  );

-- Authors can delete their own comments. No update policy — comments
-- aren't editable, only postable/removable, so there's nothing to enforce.
create policy "ride_comments: author can delete own"
  on public.ride_comments for delete
  using (user_id = auth.uid());
