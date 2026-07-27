"use client";

import { useEffect, useRef } from "react";

/**
 * Simple click outside hook - detects clicks outside a given ref.
 * Replaces @radix-ui/react-use-click-outside which doesn't exist as a separate package.
 */
export function useClickOutside(
  ref: React.RefObject<HTMLElement | null>,
  handler: (event: MouseEvent | TouchEvent) => void
): void {
  useEffect(() => {
    function onEvent(event: MouseEvent | TouchEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        handler(event);
      }
    }

    document.addEventListener("mousedown", onEvent);
    document.addEventListener("touchstart", onEvent);

    return () => {
      document.removeEventListener("mousedown", onEvent);
      document.removeEventListener("touchstart", onEvent);
    };
  }, [ref, handler]);
}
