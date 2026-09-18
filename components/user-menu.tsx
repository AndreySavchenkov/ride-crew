"use client";

import type { ReactNode } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function UserMenu({
  name,
  avatarUrl,
  fallbackName,
  children,
}: {
  name: string;
  avatarUrl?: string;
  fallbackName: string;
  children: ReactNode;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex cursor-pointer items-center gap-2.5 border-2 border-border bg-card py-1.5 pr-3.5 pl-1.5 transition-colors hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background">
        <Avatar className="size-7 rounded-none border border-border">
          <AvatarImage src={avatarUrl} alt={name} referrerPolicy="no-referrer" />
          <AvatarFallback className="rounded-none bg-primary font-label text-xs text-primary-foreground">
            {fallbackName}
          </AvatarFallback>
        </Avatar>
        <span className="font-label text-xs uppercase text-foreground">{name}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">{children}</DropdownMenuContent>
    </DropdownMenu>
  );
}
