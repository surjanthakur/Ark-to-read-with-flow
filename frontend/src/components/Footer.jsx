import { motion, useReducedMotion } from 'motion/react';
import gPayQR from '../assets/gpayQR.jpeg';

/* ---------------------------------- motion --------------------------------- */

const spring = { type: 'spring', stiffness: 140, damping: 18, mass: 0.6 };

export default function Footer() {
  const prefersReduced = useReducedMotion();

  /* Container: staggers its direct variant-children */
  const container = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: prefersReduced ? 0 : 0.1,
        delayChildren: prefersReduced ? 0 : 0.05,
      },
    },
  };

  /* Text / block reveal */
  const rise = {
    hidden: { opacity: 0, y: prefersReduced ? 0 : 28 },
    show: {
      opacity: 1,
      y: 0,
      transition: prefersReduced ? { duration: 0 } : spring,
    },
  };

  /* Card reveal — settles on its resting tilt */
  const pop = {
    hidden: {
      opacity: 0,
      scale: prefersReduced ? 1 : 0.92,
      rotate: prefersReduced ? 2 : -3,
    },
    show: {
      opacity: 1,
      scale: 1,
      rotate: 2,
      transition: prefersReduced ? { duration: 0 } : { ...spring, stiffness: 110, damping: 16 },
    },
  };

  const viewport = { once: true, amount: 0.15 };

  return (
    <footer
      className="relative w-full overflow-hidden border-t-4 border-black bg-[#f4f4f0] px-5 pt-14 pb-6 font-sans sm:px-8 md:px-12 md:pt-16"
      style={{
        backgroundImage: `linear-gradient(#e5e5e5 1px, transparent 1px), linear-gradient(90deg, #e5e5e5 1px, transparent 1px)`,
        backgroundSize: '24px 24px',
      }}
    >
      {/* -------------------------------- main grid ------------------------------- */}
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={viewport}
        className="mx-auto grid w-full max-w-6xl grid-cols-1 items-start gap-14 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-16"
      >
        {/* ------------------------------ left column ----------------------------- */}
        <motion.div variants={container} className="flex w-full flex-col gap-6 lg:max-w-xl">
          {/* Donate button */}
          <motion.div variants={rise} className="w-fit">
            <motion.a
              href="https://www.buymeacoffee.com/tsurjan506a"
              target="_blank"
              rel="noreferrer"
              aria-label="Buy me a Diet Coke"
              whileHover={prefersReduced ? undefined : { scale: 1.04, rotate: -1.5 }}
              whileTap={prefersReduced ? undefined : { scale: 0.95 }}
              transition={spring}
              className="inline-block rounded-md outline-offset-4 focus-visible:outline-2 focus-visible:outline-black"
            >
              <img
                src="https://img.buymeacoffee.com/button-api/?text=buy me a Diet Coke&emoji=&slug=tsurjan506a&button_colour=FFDD00&font_colour=000000&font_family=Arial&outline_colour=000000&coffee_colour=ffffff"
                alt="Buy me a Diet Coke"
                className="h-11 w-auto sm:h-12"
              />
            </motion.a>
          </motion.div>

          {/* Social links */}
          <motion.div
            variants={rise}
            className="flex flex-wrap items-center gap-x-5 gap-y-2 text-base font-bold sm:text-lg"
          >
            <span className="text-black/60">easy on DM:</span>

            {[
              { label: 'X', href: 'https://x.com/tsurjan16' },
              {
                label: 'GitHub',
                href: 'https://github.com/surjanthakur?tab=overview&from=2026-10-01&to=2026-10-04',
              },
            ].map(({ label, href }) => (
              <motion.a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                whileHover={prefersReduced ? undefined : { y: -2 }}
                whileTap={prefersReduced ? undefined : { scale: 0.94 }}
                transition={spring}
                className="relative inline-block text-black transition-colors duration-200 hover:text-[#ff8ae2] after:absolute after:-bottom-0.5 after:left-0 after:h-0.5 after:w-full after:origin-left after:scale-x-0 after:bg-[#ff8ae2] after:transition-transform after:duration-300 hover:after:scale-x-100 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black"
              >
                {label}
              </motion.a>
            ))}
          </motion.div>

          {/* Quote card */}
          <motion.blockquote
            variants={rise}
            whileHover={prefersReduced ? undefined : { rotate: 0, y: -5 }}
            transition={spring}
            className="mt-2 max-w-md -rotate-1 rounded-2xl border-2 border-black bg-[#fcf6c5] p-5 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] sm:p-6"
          >
            <p className="text-lg font-bold leading-snug text-black sm:text-xl md:text-2xl">
              “Don’t dig through the internet — let Leely find the best resources for you. Keep
              learning, keep building.”{' '}
              <span className="whitespace-nowrap text-fuchsia-600">*its free now*</span>
            </p>
          </motion.blockquote>
        </motion.div>

        {/* ------------------------------ right column ---------------------------- */}
        <motion.div
          variants={pop}
          className="flex w-full justify-center pb-6 lg:w-auto lg:justify-end lg:pb-4"
        >
          <motion.div
            whileHover={prefersReduced ? undefined : { rotate: 0, scale: 1.02 }}
            whileTap={prefersReduced ? undefined : { scale: 0.99 }}
            transition={spring}
            className="relative w-full max-w-65 rounded-3xl border-4 border-black bg-white p-3.5 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] sm:max-w-75 sm:p-4 lg:max-w-85"
          >
            {/* QR */}
            <div className="aspect-square w-full overflow-hidden rounded-2xl bg-white">
              <img
                src={gPayQR}
                alt="UPI QR code — scan to donate"
                className="h-full w-full object-contain"
              />
            </div>

            {/* SCAN ME badge */}
            <motion.div
              aria-hidden="true"
              animate={prefersReduced ? undefined : { y: [0, -6, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -top-4 -right-4 flex h-14 w-14 rotate-12 items-center justify-center rounded-full border-2 border-black bg-[#c4f75d] text-[10px] font-black leading-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] sm:-top-5 sm:-right-5 sm:h-16 sm:w-16 sm:text-[11px]"
            >
              SCAN ME
            </motion.div>

            {/* Donate sticker */}
            <div className="absolute -bottom-5 left-1/2 w-max -translate-x-1/2 -rotate-3 rounded-2xl border-2 border-black bg-[#c4f75d] px-3 py-1.5 text-[11px] font-black text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] sm:px-4 sm:text-xs">
              donate if you like this idea.
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* -------------------------------- bottom bar ------------------------------ */}
      <motion.div
        variants={rise}
        initial="hidden"
        whileInView="show"
        viewport={viewport}
        className="mx-auto mt-16 flex w-full max-w-6xl justify-center border-t-2 border-black/10 pt-6 sm:justify-end"
      >
        <motion.p
          whileHover={prefersReduced ? undefined : { rotate: 0, scale: 1.05 }}
          whileTap={prefersReduced ? undefined : { scale: 0.96 }}
          transition={spring}
          className="-rotate-1 border-2 border-black bg-[#ff8ae2] px-4 py-1 text-base font-black uppercase tracking-tight text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] sm:text-xl"
        >
          ❤️ by [ Surjan Thakur ]
        </motion.p>
      </motion.div>
    </footer>
  );
}
