import type { Transition, Variants } from "framer-motion";

/**
 * Canonical easing curves. Mirror the CSS token values in globals.css
 * (kept in sync; do NOT drift).
 */
export const EASE = {
  spring: [0.22, 1, 0.36, 1] as const,
  smooth: [0.4, 0, 0.2, 1] as const,
  out: [0, 0, 0.2, 1] as const,
};

/**
 * Canonical durations in milliseconds.
 */
export const DURATION = {
  fast: 0.16,
  base: 0.22,
  slow: 0.32,
} as const;

/**
 * Shared transition used by interactive surface elements.
 */
export const baseTransition: Transition = {
  duration: DURATION.base,
  ease: EASE.smooth,
};

/**
 * Fade-in variant. Use for static content appearance.
 */
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: DURATION.base, ease: EASE.smooth },
  },
};

/**
 * Slide-up variant. Use for cards entering a list or a pane.
 */
export const slideUp: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.base, ease: EASE.spring },
  },
};

/**
 * Standard card hover interaction. Apply to motion-enabled surface cards.
 * `whileHover`/`whileTap` are intentionally minimal — premium, subtle.
 */
export const cardHover: Variants = {
  rest: { y: 0, scale: 1 },
  hover: {
    y: -2,
    scale: 1.01,
    transition: { duration: DURATION.fast, ease: EASE.spring },
  },
  tap: { scale: 0.99, transition: { duration: DURATION.fast, ease: EASE.out } },
};

/**
 * Stagger container for lists of cards / rows.
 * Children should use `slideUp` (or own variants inheriting initial/visible).
 */
export const listStagger: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.02,
    },
  },
};

/**
 * Page/panel transition between modules. Used by `<MainWorkspace/>`
 * in Phase 3 — kept here so Phase 1 ships the motion vocabulary once.
 */
export const moduleTransition: Variants = {
  hidden: { opacity: 0, y: 6, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: DURATION.slow, ease: EASE.spring },
  },
  exit: {
    opacity: 0,
    y: -6,
    filter: "blur(4px)",
    transition: { duration: DURATION.fast, ease: EASE.out },
  },
};
