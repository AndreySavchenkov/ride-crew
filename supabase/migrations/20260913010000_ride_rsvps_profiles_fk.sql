-- ride_rsvps.user_id referenced auth.users(id) directly, unlike
-- group_members.user_id which references profiles(id). PostgREST can only
-- auto-embed a relation when there's a declared FK between the two exact
-- tables in the select — so `ride_rsvps.select("...profiles(...)")` (used
-- on the ride page to render who's going/maybe/not going) had no
-- relationship to walk and the whole query errored out, silently rendering
-- every RSVP roster as empty even though the rows existed and RLS allowed
-- reading them.
--
-- profiles.id already has its own FK to auth.users(id), so repointing
-- ride_rsvps.user_id at profiles(id) instead preserves the same integrity
-- guarantee while giving PostgREST the direct relationship it needs — same
-- shape as group_members.user_id -> profiles(id).
alter table public.ride_rsvps
  drop constraint ride_rsvps_user_id_fkey;

alter table public.ride_rsvps
  add constraint ride_rsvps_user_id_fkey
  foreign key (user_id) references public.profiles(id) on delete cascade;
