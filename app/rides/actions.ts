"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function createRide(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const groupId = formData.get("group_id") as string;

  if (!user) {
    redirect(`/login?next=/groups/${groupId}/rides/new`);
  }
  const title = formData.get("title") as string;
  const startsAt = formData.get("starts_at") as string;
  const location = formData.get("location") as string;
  const description = formData.get("description") as string;
  const routeUrl = formData.get("route_url") as string;
  const routePointsRaw = formData.get("route_points") as string;
  const distanceKmRaw = formData.get("distance_km") as string;
  const elevationGainMRaw = formData.get("elevation_gain_m") as string;

  if (!groupId) {
    throw new Error("Не указана группа");
  }
  if (!title?.trim()) {
    throw new Error("Название покатушки обязательно");
  }
  if (!startsAt) {
    throw new Error("Укажи дату и время покатушки");
  }

  let routePoints: [number, number][] | null = null;
  if (routePointsRaw) {
    try {
      routePoints = JSON.parse(routePointsRaw);
    } catch {
      routePoints = null;
    }
  }

  const { data: ride, error: rideError } = await supabase
    .from("rides")
    .insert({
      group_id: groupId,
      created_by: user.id,
      title: title.trim(),
      description: description?.trim() || null,
      starts_at: new Date(startsAt).toISOString(),
      location: location?.trim() || null,
      route_url: routeUrl?.trim() || null,
      route_points: routePoints,
      distance_km: distanceKmRaw ? Number(distanceKmRaw) : null,
      elevation_gain_m: elevationGainMRaw ? Number(elevationGainMRaw) : null,
    })
    .select()
    .single();

  if (rideError || !ride) {
    console.error("Supabase insert error:", rideError);
    throw new Error("Не удалось создать покатушку. Попробуй ещё раз");
  }

  revalidatePath(`/groups/${groupId}`);
  redirect(`/rides/${ride.id}`);
}

export async function updateRide(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const rideId = formData.get("ride_id") as string;

  if (!user) {
    redirect(`/login?next=/rides/${rideId}/edit`);
  }

  const title = formData.get("title") as string;
  const startsAt = formData.get("starts_at") as string;
  const location = formData.get("location") as string;
  const description = formData.get("description") as string;
  const routeUrl = formData.get("route_url") as string;
  const routePointsRaw = formData.get("route_points") as string;
  const distanceKmRaw = formData.get("distance_km") as string;
  const elevationGainMRaw = formData.get("elevation_gain_m") as string;

  if (!rideId) {
    throw new Error("Не указана покатушка");
  }
  if (!title?.trim()) {
    throw new Error("Название покатушки обязательно");
  }
  if (!startsAt) {
    throw new Error("Укажи дату и время покатушки");
  }

  let routePoints: [number, number][] | null = null;
  if (routePointsRaw) {
    try {
      routePoints = JSON.parse(routePointsRaw);
    } catch {
      routePoints = null;
    }
  }

  const { error } = await supabase.rpc("update_ride", {
    p_ride_id: rideId,
    p_title: title.trim(),
    p_description: description?.trim() || null,
    p_starts_at: new Date(startsAt).toISOString(),
    p_location: location?.trim() || null,
    p_route_url: routeUrl?.trim() || null,
    p_route_points: routePoints,
    p_distance_km: distanceKmRaw ? Number(distanceKmRaw) : null,
    p_elevation_gain_m: elevationGainMRaw ? Number(elevationGainMRaw) : null,
  });

  if (error) {
    console.error("Supabase rpc error:", error);
    if (error.message?.includes("not_authorized")) {
      throw new Error("Только автор может редактировать эту покатушку");
    }
    throw new Error("Не удалось сохранить изменения. Попробуй ещё раз");
  }

  revalidatePath(`/rides/${rideId}`);
  redirect(`/rides/${rideId}`);
}

export async function cancelRide(rideId: string, groupId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?next=/rides/${rideId}`);
  }

  const { error } = await supabase.rpc("cancel_ride", { p_ride_id: rideId });

  if (error) {
    console.error("Supabase rpc error:", error);
    if (error.message?.includes("not_authorized")) {
      throw new Error("Только автор может отменить эту покатушку");
    }
    throw new Error("Не удалось отменить покатушку. Попробуй ещё раз");
  }

  revalidatePath(`/groups/${groupId}`);
  redirect(`/groups/${groupId}`);
}

export async function setRsvp(rideId: string, status: "going" | "maybe" | "not_going") {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?next=/rides/${rideId}`);
  }

  const { error } = await supabase.from("ride_rsvps").upsert({
    ride_id: rideId,
    user_id: user.id,
    status,
  });

  if (error) {
    console.error("Supabase upsert error:", error);
    throw new Error("Не удалось сохранить ответ");
  }

  revalidatePath(`/rides/${rideId}`);
}
