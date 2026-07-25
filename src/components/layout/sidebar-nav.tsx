"use client";

import { useNavigationStore } from "@/lib/navigation-store";
import { NavGroup, NavItem } from "@/components/layout/sidebar";
import { MODULES_ORDERED } from "@/constants/modules.registry";

/**
 * Sidebar primary navigation. Pure data → component.
 * Reads the module registry, renders a flat ordered list, marks active.
 *
 * Adding new modules requires ZERO changes here — they appear automatically
 * from the registry. To add a section divider, set `section` on a manifest
 * in the registry (future enhancement; not required today).
 */
export function SidebarNav() {
  const activeModule = useNavigationStore((s) => s.activeModule);
  const navigate = useNavigationStore((s) => s.navigate);

  return (
    <NavGroup label="Workspace">
      {MODULES_ORDERED.map((module) => (
        <NavItem
          key={module.id}
          icon={module.icon}
          label={module.label}
          active={module.id === activeModule}
          onClick={() => navigate(module.id)}
        />
      ))}
    </NavGroup>
  );
}
