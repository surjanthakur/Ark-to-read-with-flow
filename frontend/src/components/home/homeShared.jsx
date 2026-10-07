import { motion, useReducedMotion } from 'motion/react';
import { EASE } from './homeData.js';

export function Reveal({ children, className = '', delay = 0, y = 24, amount = 0.25 }) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: reduce ? 0 : y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{
        duration: reduce ? 0.3 : 0.65,
        ease: EASE,
        delay: reduce ? 0 : delay,
      }}
    >
      {children}
    </motion.div>
  );
}

export function RevealGroup({
  children,
  className = '',
  stagger = 0.08,
  delay = 0.05,
  amount = 0.15,
  role,
}) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      role={role}
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: reduce ? 0 : stagger,
            delayChildren: delay,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

export function Eyebrow({ children, className = '' }) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border-2 border-black bg-white px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-black ${className}`}
    >
      {children}
    </span>
  );
}

export function Marquee({
  items,
  speed = 28,
  reverse = false,
  className = '',
  itemClassName = '',
}) {
  const reduce = useReducedMotion();
  const row = [...items, ...items];

  return (
    <div className={`overflow-hidden ${className}`}>
      <motion.div
        className="flex w-max items-center"
        animate={reduce ? undefined : { x: reverse ? ['-50%', '0%'] : ['0%', '-50%'] }}
        transition={{ duration: speed, ease: 'linear', repeat: Infinity }}
      >
        {row.map((item, i) => (
          <span
            key={`${item}-${i}`}
            aria-hidden={i >= items.length}
            className={`flex shrink-0 items-center gap-6 whitespace-nowrap px-6 ${itemClassName}`}
          >
            {item}
            <span className="text-[0.7em] opacity-50">✦</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}

export function CollageCard({
  variants,
  className = '',
  innerClassName = '',
  lift = -10,
  rotateOnHover = 0,
  children,
}) {
  return (
    <div className={className}>
      <motion.div
        variants={variants}
        whileHover={{ y: lift, rotate: rotateOnHover, scale: 1.015 }}
        whileTap={{ scale: 0.985 }}
        transition={{ type: 'spring', stiffness: 320, damping: 22 }}
        className={`h-full w-full ${innerClassName}`}
        style={{ transformOrigin: 'center center' }}
      >
        {children}
      </motion.div>
    </div>
  );
}
