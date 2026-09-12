"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function createGroup(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/groups/new");
  }

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;

  if (!name?.trim()) {
    throw new Error("Название группы обязательно");
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
    throw new Error("Не удалось создать группу. Попробуй ещё раз");
  }

  const { error: memberError } = await supabase.from("group_members").insert({
    group_id: group.id,
    user_id: user.id,
    role: "owner",
  });

  if (memberError) {
    console.error("Supabase insert error:", memberError);
    throw new Error("Группа создана, но не удалось добавить тебя как владельца");
  }

  revalidatePath("/groups");
  redirect(`/groups/${group.id}`);
}

export async function joinGroup(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const code = (formData.get("code") as string)?.trim();

  if (!user) {
    const next = code ? `/groups/join?code=${encodeURIComponent(code)}` : "/groups/join";
    redirect(`/login?next=${encodeURIComponent(next)}`);
  }

  if (!code) {
    throw new Error("Введи код приглашения");
  }

  const { data, error } = await supabase
    .rpc("join_group_by_invite_code", { p_invite_code: code })
    .single();

  if (error || !data) {
    console.error("Supabase rpc error:", error);
    if (error?.message?.includes("invalid_invite_code")) {
      throw new Error("Такого кода приглашения не существует. Проверь и попробуй ещё раз");
    }
    throw new Error("Не удалось вступить в группу. Попробуй ещё раз");
  }

  const { group_id } = data as { group_id: string; group_name: string };

  revalidatePath("/groups");
  redirect(`/groups/${group_id}`);
}