import { motion } from 'motion/react';
import { DashboardRedirectButton } from '../export.js';
import { STEPS, WHY } from './homeData.js';
import { useItemVariants } from './homeMotion.js';
import { Eyebrow, Reveal, RevealGroup } from './homeShared.jsx';

export function Features() {
  const item = useItemVariants(28);

  return (
    <section
      id="features"
      className="relative scroll-mt-24 overflow-hidden border-b-2 border-black bg-[#17252a] px-5 py-20 text-white sm:px-8 lg:px-12 lg:py-28"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-0 h-96 w-96 rounded-full bg-lime-300/20 blur-[130px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-[#f2a9dd]/20 blur-[130px]"
      />

      <div className="relative mx-auto max-w-7xl">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <Reveal className="lg:sticky lg:top-32">
              <Eyebrow className="border-white/25 bg-white/10 text-white shadow-none">
                ⚙ how it works
              </Eyebrow>

              <h2 className="mt-6 font-serif text-[32px] leading-[1.06] tracking-[-1px] text-balance sm:text-[44px] lg:text-[52px] lg:tracking-[-1.6px]">
                From a messy thought to a clean reading list.
              </h2>

              <p className="mt-6 max-w-md font-mono text-sm leading-6 text-white/60">
                Four steps. No prompt engineering degree required. Leely handles the searching,
                filtering and sorting so you can get straight to the reading.
              </p>

              <div className="mt-8">
                <DashboardRedirectButton />
              </div>
            </Reveal>
          </div>

          <RevealGroup
            className="flex flex-col gap-4 lg:col-span-7"
            stagger={0.1}
            amount={0.1}
            role="list"
          >
            {STEPS.map((step) => (
              <motion.div
                key={step.n}
                role="listitem"
                variants={item}
                className="group relative flex gap-5 rounded-2xl border-2 border-white/12 bg-white/4 p-5 backdrop-blur-sm transition-colors duration-300 hover:border-white/35 hover:bg-white/8 sm:p-6"
              >
                <span
                  className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl border-2 border-black font-mono text-sm font-bold text-black shadow-[3px_3px_0_#000] transition-transform duration-300 group-hover:-rotate-6 ${step.color}`}
                >
                  {step.n}
                </span>

                <div className="pt-0.5">
                  <h3 className="font-serif text-xl leading-snug sm:text-2xl">{step.title}</h3>
                  <p className="mt-2 font-mono text-xs leading-5 text-white/55 sm:text-[13px] sm:leading-6">
                    {step.body}
                  </p>
                </div>
              </motion.div>
            ))}
          </RevealGroup>
        </div>

        <RevealGroup
          className="mt-20 grid gap-5 sm:grid-cols-2 lg:mt-24 lg:grid-cols-3"
          stagger={0.09}
          amount={0.15}
        >
          {WHY.map((w) => (
            <motion.div
              key={w.title}
              variants={item}
              whileHover={{ y: -6 }}
              transition={{ type: 'spring', stiffness: 320, damping: 22 }}
              className="rounded-2xl border-2 border-white/12 bg-white/4 p-6 backdrop-blur-sm transition-colors duration-300 hover:border-white/35"
            >
              <span
                className={`grid h-11 w-11 place-items-center rounded-xl border-2 border-black text-lg shadow-[3px_3px_0_#000] ${w.bg}`}
              >
                {w.icon}
              </span>
              <h3 className="mt-4 font-serif text-xl">{w.title}</h3>
              <p className="mt-2 font-mono text-xs leading-5 text-white/55">{w.body}</p>
            </motion.div>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}

export default Features;
