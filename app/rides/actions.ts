"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getTranslations } from "next-intl/server";
import { getViewerLocale } from "@/utils/get-viewer-locale";

export async function createRide(formData: FormData) {
  const supabase = await createClient();
  const locale = await getViewerLocale();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const groupId = formData.get("group_id") as string;

  if (!user) {
    redirect(`/${locale}/login?next=/groups/${groupId}/rides/new`);
  }

  const t = await getTranslations({ locale, namespace: "RideActions" });

  const title = formData.get("title") as string;
  const startsAt = formData.get("starts_at") as string;
  const location = formData.get("location") as string;
  const description = formData.get("description") as string;
  const routeUrl = formData.get("route_url") as string;
  const routePointsRaw = formData.get("route_points") as string;
  const distanceKmRaw = formData.get("distance_km") as string;
  const elevationGainMRaw = formData.get("elevation_gain_m") as string;

  if (!groupId) {
    throw new Error(t("groupRequired"));
  }
  if (!title?.trim()) {
    throw new Error(t("titleRequired"));
  }
  if (!startsAt) {
    throw new Error(t("dateRequired"));
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
    throw new Error(t("createFailed"));
  }

  revalidatePath(`/groups/${groupId}`);
  redirect(`/${locale}/rides/${ride.id}`);
}

export async function updateRide(formData: FormData) {
  const supabase = await createClient();
  const locale = await getViewerLocale();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const rideId = formData.get("ride_id") as string;

  if (!user) {
    redirect(`/${locale}/login?next=/rides/${rideId}/edit`);
  }

  const t = await getTranslations({ locale, namespace: "RideActions" });

  const title = formData.get("title") as string;
  const startsAt = formData.get("starts_at") as string;
  const location = formData.get("location") as string;
  const description = formData.get("description") as string;
  const routeUrl = formData.get("route_url") as string;
  const routePointsRaw = formData.get("route_points") as string;
  const distanceKmRaw = formData.get("distance_km") as string;
  const elevationGainMRaw = formData.get("elevation_gain_m") as string;

  if (!rideId) {
    throw new Error(t("rideRequired"));
  }
  if (!title?.trim()) {
    throw new Error(t("titleRequired"));
  }
  if (!startsAt) {
    throw new Error(t("dateRequired"));
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
      throw new Error(t("onlyOwnerCanEdit"));
    }
    throw new Error(t("updateFailed"));
  }

  revalidatePath(`/rides/${rideId}`);
  redirect(`/${locale}/rides/${rideId}`);
}

export async function cancelRide(rideId: string, groupId: string) {
  const supabase = await createClient();
  const locale = await getViewerLocale();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${locale}/login?next=/rides/${rideId}`);
  }

  const t = await getTranslations({ locale, namespace: "RideActions" });

  const { error } = await supabase.rpc("cancel_ride", { p_ride_id: rideId });

  if (error) {
    console.error("Supabase rpc error:", error);
    if (error.message?.includes("not_authorized")) {
      throw new Error(t("onlyOwnerCanCancel"));
    }
    throw new Error(t("cancelFailed"));
  }

  revalidatePath(`/groups/${groupId}`);
  redirect(`/${locale}/groups/${groupId}`);
}

export async function setRsvp(rideId: string, status: "going" | "maybe" | "not_going") {
  const supabase = await createClient();
  const locale = await getViewerLocale();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${locale}/login?next=/rides/${rideId}`);
  }

  const { error } = await supabase.from("ride_rsvps").upsert({
    ride_id: rideId,
    user_id: user.id,
    status,
  });

  if (error) {
    console.error("Supabase upsert error:", error);
    const t = await getTranslations({ locale, namespace: "RideActions" });
    throw new Error(t("rsvpFailed"));
  }

  revalidatePath(`/rides/${rideId}`);
}

export async function addComment(formData: FormData) {
  const supabase = await createClient();
  const locale = await getViewerLocale();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const rideId = formData.get("ride_id") as string;

  if (!user) {
    redirect(`/${locale}/login?next=/rides/${rideId}`);
  }

  const t = await getTranslations({ locale, namespace: "RideActions" });

  const body = (formData.get("body") as string)?.trim();
  if (!body) {
    throw new Error(t("commentRequired"));
  }

  const { error } = await supabase.from("ride_comments").insert({
    ride_id: rideId,
    user_id: user.id,
    body,
  });

  if (error) {
    console.error("Supabase insert error:", error);
    throw new Error(t("commentFailed"));
  }

  revalidatePath(`/rides/${rideId}`);
}

export async function deleteComment(commentId: string, rideId: string) {
  const supabase = await createClient();
  const locale = await getViewerLocale();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${locale}/login?next=/rides/${rideId}`);
  }

  const { error } = await supabase.from("ride_comments").delete().eq("id", commentId);

  if (error) {
    console.error("Supabase delete error:", error);
    const t = await getTranslations({ locale, namespace: "RideActions" });
    throw new Error(t("commentDeleteFailed"));
  }

  revalidatePath(`/rides/${rideId}`);
}
