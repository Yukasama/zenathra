export const ANIMATION_VARIANTS = {
  hidden: {
    opacity: 0,
    y: 10,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      damping: 30,
      stiffness: 200,
      duration: 0.2,
    },
  },
  exit: {
    opacity: 0,
    y: 10,
    transition: {
      ease: "easeInOut",
      duration: 0.2,
    },
  },
  tap: {
    scale: 0.95,
  },
};
