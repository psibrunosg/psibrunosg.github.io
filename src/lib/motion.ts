export const spring = {
  gentle: { type: "spring", stiffness: 80, damping: 20 },
  snappy: { type: "spring", stiffness: 300, damping: 30 },
  slow:   { type: "spring", stiffness: 40, damping: 18 },
} as const;

export const ease = {
  smooth: [0.25, 0.46, 0.45, 0.94],
  out:    [0.0,  0.0,  0.2,  1.0],
  in:     [0.4,  0.0,  1.0,  1.0],
} as const;

export const fade = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6, ease: ease.out } },
};

export const fadeUp = {
  hidden:  { opacity: 0, y: 32 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: ease.out, delay: i * 0.1 },
  }),
};

export const stagger = {
  container: {
    hidden:  {},
    visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
  },
};
