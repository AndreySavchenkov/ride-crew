import { createClient } from "@/utils/supabase/server";
import { getUser } from "@/utils/supabase/getUser";
import { redirect, notFound } from "next/navigation";
import {CopyInviteCode} from "./copyInviteCode"

export default async function GroupPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getUser();
  if (!user) redirect("/login");

  const supabase = await createClient();

  const { data: group } = await supabase
    .from("groups")
    .select("id, name, description, invite_code, created_by")
    .eq("id", id)
    .single();

  if (!group) notFound();

  const { data: members } = await supabase
    .from("group_members")
    .select("role, profiles(id, full_name, avatar_url)")
    .eq("group_id", id);

  const isOwner = group.created_by === user.id;

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="text-2xl text-foreground">{group.name}</h1>
      {group.description && (
        <p className="mt-2 text-muted-foreground">{group.description}</p>
      )}

      {isOwner && (
        <div className="mt-6 border-2 border-border bg-card p-4">
          <p className="mb-2 font-label text-xs uppercase text-muted-foreground">
            Код приглашения
          </p>
          <CopyInviteCode code={group.invite_code} />
        </div>
      )}

      <div className="mt-8">
        <p className="mb-4 font-label text-xs uppercase text-muted-foreground">
          Участники ({members?.length ?? 0})
        </p>
        <div className="flex flex-col gap-3">
          {members?.map((m: any) => (
            <div
              key={m.profiles.id}
              className="flex items-center gap-3 border-2 border-border bg-card p-3"
            >
              <div className="size-9 shrink-0 overflow-hidden bg-primary">
                {m.profiles.avatar_url && (
                  <img
                    src={m.profiles.avatar_url}
                    alt={m.profiles.full_name}
                    className="h-full w-full object-cover"
                  />
                )}
              </div>
              <span className="text-foreground">{m.profiles.full_name}</span>
              {m.role === "owner" && (
                <span className="ml-auto border border-primary/40 bg-primary/15 px-2.5 py-0.5 font-label text-xs uppercase text-primary">
                  Владелец
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}