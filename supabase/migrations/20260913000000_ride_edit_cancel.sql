-- Lets a ride's creator edit or cancel it. Ownership is enforced inside the
-- function (created_by = auth.uid()) rather than relying on an UPDATE/DELETE
-- RLS policy existing on `rides` — same reasoning as
-- join_group_by_invite_code: this is a single, auditable place that grants
-- exactly the "edit/cancel your own ride" capability, nothing broader.

create or replace function public.update_ride(
  p_ride_id uuid,
  p_title text,
  p_description text,
  p_starts_at timestamptz,
  p_location text,
  p_route_url text,
  p_route_points jsonb,
  p_distance_km numeric,
  p_elevation_gain_m numeric
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_created_by uuid;
begin
  if v_user_id is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;

  select created_by into v_created_by from rides where id = p_ride_id;

  if v_created_by is null then
    raise exception 'ride_not_found' using errcode = 'P0002';
  end if;

  if v_created_by <> v_user_id then
    raise exception 'not_authorized' using errcode = '42501';
  end if;

  update rides
  set title = p_title,
      description = p_description,
      starts_at = p_starts_at,
      location = p_location,
      route_url = p_route_url,
      route_points = p_route_points,
      distance_km = p_distance_km,
      elevation_gain_m = p_elevation_gain_m
  where id = p_ride_id;
end;
$$;

revoke all on function public.update_ride(
  uuid, text, text, timestamptz, text, text, jsonb, numeric, numeric
) from public;
grant execute on function public.update_ride(
  uuid, text, text, timestamptz, text, text, jsonb, numeric, numeric
) to authenticated;

-- Cancelling a ride removes its RSVPs too, so we don't leave orphaned rows
-- regardless of whatever FK/RLS (if any) exists on ride_rsvps.
create or replace function public.cancel_ride(p_ride_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_created_by uuid;
begin
  if v_user_id is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;

  select created_by into v_created_by from rides where id = p_ride_id;

  if v_created_by is null then
    raise exception 'ride_not_found' using errcode = 'P0002';
  end if;

  if v_created_by <> v_user_id then
    raise exception 'not_authorized' using errcode = '42501';
  end if;

  delete from ride_rsvps where ride_id = p_ride_id;
  delete from rides where id = p_ride_id;
end;
$$;

revoke all on function public.cancel_ride(uuid) from public;
grant execute on function public.cancel_ride(uuid) to authenticated;
