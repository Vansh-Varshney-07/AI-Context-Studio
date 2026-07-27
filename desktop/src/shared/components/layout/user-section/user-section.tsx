"use client";

import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { type LucideIcon } from "lucide-react";
import * as React from "react";

import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/utils/cn";

/**
 * UserSection â€” top-right user affordances.
 * Phase 1 ships a deterministic avatar (initials fallback) + menu trigger.
 * Auth/user data wiring is out of scope.
 */
export interface UserSectionProps {
  name: string;
  email?: string;
  avatarUrl?: string;
  menuIcon?: LucideIcon;
  onMenuClick?: () => void;
  className?: string;
}

const Avatar = AvatarPrimitive.Root;
const AvatarImage = AvatarPrimitive.Image;
const AvatarFallback = AvatarPrimitive.Fallback;

export function UserSection({
  name,
  email,
  avatarUrl,
  menuIcon: MenuIcon,
  onMenuClick,
  className,
}: UserSectionProps) {
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="hidden text-right md:block">
        <p className="text-sm font-medium text-text-primary truncate max-w-[140px]">
          {name}
        </p>
        {email ? (
          <p className="text-xs text-text-muted truncate max-w-[140px]">{email}</p>
        ) : null}
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={onMenuClick}
        aria-label={MenuIcon ? "Open user menu" : undefined}
        className="rounded-full"
      >
        <Avatar className="size-8 rounded-full border border-border">
          {avatarUrl ? <AvatarImage src={avatarUrl} alt={name} /> : null}
          <AvatarFallback className="rounded-full bg-accent text-text-inverse text-xs font-semibold">
            {initials || "?"}
          </AvatarFallback>
        </Avatar>
        {MenuIcon ? <MenuIcon className="size-4 text-text-muted" /> : null}
      </Button>
    </div>
  );
}

export { Avatar, AvatarFallback, AvatarImage };
