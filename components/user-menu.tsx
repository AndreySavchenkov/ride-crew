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
      <DropdownMenuTrigger className="glass-button py-1 pr-3.5 pl-1 normal-case focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
        <Avatar className="size-7">
          <AvatarImage src={avatarUrl} alt={name} referrerPolicy="no-referrer" />
          <AvatarFallback className="bg-primary font-label text-xs text-primary-foreground">
            {fallbackName}
          </AvatarFallback>
        </Avatar>
        <span className="hidden font-label text-xs uppercase text-foreground sm:inline">{name}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">{children}</DropdownMenuContent>
    </DropdownMenu>
  );
}
