"use client";

import { useEffect } from "react";

/**
 * Custom hook for keyboard event handling.
 * Supports multiple keys with callbacks.
 */
export function useKeyboard(handlers: Record<string, () => void>) {
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const handler = handlers[e.key];
      if (handler) {
        e.preventDefault();
        handler();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handlers]);
}
