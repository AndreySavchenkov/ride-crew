"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getTranslations } from "next-intl/server";
import { getViewerLocale } from "@/utils/get-viewer-locale";

export async function createGroup(formData: FormData) {
  const supabase = await createClient();
  const locale = await getViewerLocale();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${locale}/login?next=/groups/new`);
  }

  const t = await getTranslations({ locale, namespace: "GroupActions" });

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;

  if (!name?.trim()) {
    throw new Error(t("nameRequired"));
  }

  const { data: group, error: groupError } = await supabase
    .from("groups")
    .insert({
      name: name.trim(),
      description: description?.trim() || null,
      created_by: user.id,
    })
    .select()
    .single();

  if (groupError || !group) {
    console.error("Supabase insert error:", groupError);
    throw new Error(t("createFailed"));
  }

  const { error: memberError } = await supabase.from("group_members").insert({
    group_id: group.id,
    user_id: user.id,
    role: "owner",
  });

  if (memberError) {
    console.error("Supabase insert error:", memberError);
    throw new Error(t("ownerAddFailed"));
  }

  revalidatePath("/groups");
  redirect(`/${locale}/groups/${group.id}`);
}

export async function joinGroup(formData: FormData) {
  const supabase = await createClient();
  const locale = await getViewerLocale();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const code = (formData.get("code") as string)?.trim();

  if (!user) {
    const next = code ? `/groups/join?code=${encodeURIComponent(code)}` : "/groups/join";
    redirect(`/${locale}/login?next=${encodeURIComponent(next)}`);
  }

  const t = await getTranslations({ locale, namespace: "GroupActions" });

  if (!code) {
    throw new Error(t("codeRequired"));
  }

  const { data, error } = await supabase
    .rpc("join_group_by_invite_code", { p_invite_code: code })
    .single();

  if (error || !data) {
    console.error("Supabase rpc error:", error);
    if (error?.message?.includes("invalid_invite_code")) {
      throw new Error(t("codeNotFound"));
    }
    throw new Error(t("joinFailed"));
  }

  const { group_id } = data as { group_id: string; group_name: string };

  revalidatePath("/groups");
  redirect(`/${locale}/groups/${group_id}`);
}

export async function leaveGroup(groupId: string) {
  const supabase = await createClient();
  const locale = await getViewerLocale();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${locale}/login?next=/groups/${groupId}`);
  }

  const t = await getTranslations({ locale, namespace: "GroupActions" });

  const { error } = await supabase.rpc("leave_group", { p_group_id: groupId });

  if (error) {
    console.error("Supabase rpc error:", error);
    if (error.message?.includes("owner_cannot_leave")) {
      throw new Error(t("ownerCantLeave"));
    }
    throw new Error(t("leaveFailed"));
  }

  revalidatePath("/groups");
  redirect(`/${locale}/groups`);
}

export async function removeMember(groupId: string, userId: string) {
  const supabase = await createClient();
  const locale = await getViewerLocale();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${locale}/login?next=/groups/${groupId}`);
  }

  const t = await getTranslations({ locale, namespace: "GroupActions" });

  const { error } = await supabase.rpc("remove_group_member", {
    p_group_id: groupId,
    p_user_id: userId,
  });

  if (error) {
    console.error("Supabase rpc error:", error);
    if (error.message?.includes("not_authorized")) {
      throw new Error(t("onlyOwnerCanRemove"));
    }
    throw new Error(t("removeFailed"));
  }

  revalidatePath(`/groups/${groupId}`);
}

export async function deleteGroup(groupId: string) {
  const supabase = await createClient();
  const locale = await getViewerLocale();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${locale}/login?next=/groups/${groupId}`);
  }

  const t = await getTranslations({ locale, namespace: "GroupActions" });

  const { error } = await supabase.rpc("delete_group", { p_group_id: groupId });

  if (error) {
    console.error("Supabase rpc error:", error);
    if (error.message?.includes("not_authorized")) {
      throw new Error(t("onlyOwnerCanDelete"));
    }
    throw new Error(t("deleteFailed"));
  }

  revalidatePath("/groups");
  redirect(`/${locale}/groups`);
}
