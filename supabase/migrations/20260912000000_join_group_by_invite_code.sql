-- Lets an authenticated user join a group by invite code without needing
-- read access to the `groups` table beforehand (avoids widening RLS just
-- to let a non-member look a group up by code, and avoids letting a client
-- enumerate invite codes).
--
-- SECURITY DEFINER runs this with the function owner's privileges, so it
-- can see `groups` regardless of the caller's row-level access — the only
-- thing exposed to the caller is "did this code match a group, and here's
-- its id", not the ability to query `groups` freely.
create or replace function public.join_group_by_invite_code(p_invite_code text)
returns table (group_id uuid, group_name text)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_group_id uuid;
  v_group_name text;
  v_user_id uuid := auth.uid();
begin
  if v_user_id is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;

  select id, name into v_group_id, v_group_name
  from groups
  where upper(trim(invite_code)) = upper(trim(p_invite_code));

  if v_group_id is null then
    raise exception 'invalid_invite_code' using errcode = 'P0002';
  end if;

  if not exists (
    select 1 from group_members
    where group_members.group_id = v_group_id
      and group_members.user_id = v_user_id
  ) then
    insert into group_members (group_id, user_id, role)
    values (v_group_id, v_user_id, 'member');
  end if;

  return query select v_group_id, v_group_name;
end;
$$;

-- Only signed-in app users may call this — not anon, not the public API root.
revoke all on function public.join_group_by_invite_code(text) from public;
grant execute on function public.join_group_by_invite_code(text) to authenticated;
