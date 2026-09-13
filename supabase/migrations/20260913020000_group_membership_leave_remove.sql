-- group_members has no DELETE policy at all (verified via pg_policies), so
-- both leaving a group and removing a member need to go through a
-- SECURITY DEFINER function that enforces the rule itself — same pattern as
-- join_group_by_invite_code, update_ride, and cancel_ride.

-- Any member can leave, except the owner (there's no ownership-transfer or
-- delete-group flow yet, so an ownerless group would be unrecoverable).
create or replace function public.leave_group(p_group_id uuid)
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
    raise exception 'not_a_member' using errcode = 'P0002';
  end if;

  if v_role = 'owner' then
    raise exception 'owner_cannot_leave' using errcode = '42501';
  end if;

  delete from group_members
  where group_id = p_group_id and user_id = v_user_id;
end;
$$;

revoke all on function public.leave_group(uuid) from public;
grant execute on function public.leave_group(uuid) to authenticated;

-- Only the owner can remove someone else; can't remove yourself this way
-- (use leave_group) and can't remove an owner.
create or replace function public.remove_group_member(p_group_id uuid, p_user_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_caller_id uuid := auth.uid();
  v_caller_role text;
  v_target_role text;
begin
  if v_caller_id is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;

  select role into v_caller_role
  from group_members
  where group_id = p_group_id and user_id = v_caller_id;

  if v_caller_role is distinct from 'owner' then
    raise exception 'not_authorized' using errcode = '42501';
  end if;

  if p_user_id = v_caller_id then
    raise exception 'cannot_remove_self' using errcode = '42501';
  end if;

  select role into v_target_role
  from group_members
  where group_id = p_group_id and user_id = p_user_id;

  if v_target_role is null then
    raise exception 'not_a_member' using errcode = 'P0002';
  end if;

  if v_target_role = 'owner' then
    raise exception 'cannot_remove_owner' using errcode = '42501';
  end if;

  delete from group_members
  where group_id = p_group_id and user_id = p_user_id;
end;
$$;

revoke all on function public.remove_group_member(uuid, uuid) from public;
grant execute on function public.remove_group_member(uuid, uuid) to authenticated;
