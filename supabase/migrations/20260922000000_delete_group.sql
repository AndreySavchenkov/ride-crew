-- Lets the group owner delete the group entirely, taking its rides, RSVPs,
-- comments and memberships with it. Same reasoning as leave_group /
-- remove_group_member: there's no DELETE policy on any of these tables, so
-- this has to run as SECURITY DEFINER with the authorization check inside.
--
-- Deletes are explicit and ordered child-first, same as cancel_ride,
-- instead of relying on whatever ON DELETE behaviour each FK happens to
-- have (ride_comments.ride_id does cascade, but ride_rsvps/rides/
-- group_members are not something this function wants to gamble on).
create or replace function public.delete_group(p_group_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_role text;
begin
  if v_user_id is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;

  select role into v_role
  from group_members
  where group_id = p_group_id and user_id = v_user_id;

  if v_role is null then
    raise exception 'group_not_found' using errcode = 'P0002';
  end if;

  if v_role <> 'owner' then
    raise exception 'not_authorized' using errcode = '42501';
  end if;

  delete from ride_comments
  where ride_id in (select id from rides where group_id = p_group_id);

  delete from ride_rsvps
  where ride_id in (select id from rides where group_id = p_group_id);

  delete from rides where group_id = p_group_id;

  delete from group_members where group_id = p_group_id;

  delete from groups where id = p_group_id;
end;
$$;

revoke all on function public.delete_group(uuid) from public;
grant execute on function public.delete_group(uuid) to authenticated;
