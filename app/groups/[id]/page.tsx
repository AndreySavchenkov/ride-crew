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
      <h1 className="text-2xl font-bold text-white">{group.name}</h1>
      {group.description && (
        <p className="mt-2 text-white/50">{group.description}</p>
      )}

      {isOwner && (
        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="mb-2 text-sm font-medium text-white/70">
            Код приглашения
          </p>
          <CopyInviteCode code={group.invite_code} />
        </div>
      )}

      <div className="mt-8">
        <p className="mb-4 text-sm font-semibold text-white/70">
          Участники ({members?.length ?? 0})
        </p>
        <div className="flex flex-col gap-3">
          {members?.map((m: any) => (
            <div
              key={m.profiles.id}
              className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3"
            >
              <div className="h-9 w-9 shrink-0 overflow-hidden rounded-full bg-[#4F9EFA]">
                {m.profiles.avatar_url && (
                  <img
                    src={m.profiles.avatar_url}
                    alt={m.profiles.full_name}
                    className="h-full w-full object-cover"
                  />
                )}
              </div>
              <span className="text-white">{m.profiles.full_name}</span>
              {m.role === "owner" && (
                <span className="ml-auto rounded-full bg-[#4F9EFA]/20 px-2.5 py-0.5 text-xs font-medium text-[#4F9EFA]">
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