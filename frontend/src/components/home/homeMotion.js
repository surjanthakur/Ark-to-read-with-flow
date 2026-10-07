import { useReducedMotion } from 'motion/react';
import { EASE } from './homeData.js';

export function useItemVariants(y = 28) {
  const reduce = useReducedMotion();

  return reduce
    ? { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.3 } } }
    : {
        hidden: { opacity: 0, y },
        visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
      };
}
