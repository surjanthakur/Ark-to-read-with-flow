import LeelyFlower from '../assets/lily-logo.png';
import { motion, useReducedMotion } from 'motion/react';
import { DashboardRedirectButton } from '../components/export.js';

/* ------------------------------------------------------------------ */
/*  Motion presets                                                     */
/* ------------------------------------------------------------------ */

const EASE = [0.22, 1, 0.36, 1];

const heroReveal = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE },
  },
};

/* Parent orchestrates the stagger, children only declare their own motion */
const collageStagger = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.07, delayChildren: 0.1 },
  },
};

const cardReveal = {
  hidden: { opacity: 0, y: 36 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, ease: EASE },
  },
};

const cardRevealReduced = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.35 } },
};

/* Shared responsive shell for every collage card */
const MOBILE_CARD = 'mx-auto w-full max-w-[340px] lg:mx-0 lg:max-w-none';

/* ------------------------------------------------------------------ */
/*  Card primitive                                                     */
/*  wrapper  → layout + rotation (plain CSS, fully responsive)         */
/*  motion   → opacity / y only (never fights the rotation)            */
/* ------------------------------------------------------------------ */

function CollageCard({
  variants,
  className = '',
  innerClassName = '',
  hoverScale = 1.05,
  lift = -10,
  children,
}) {
  return (
    <div className={className}>
      <motion.div
        variants={variants}
        whileHover={{ scale: hoverScale, y: lift }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className={`h-full w-full cursor-pointer ${innerClassName}`}
        style={{ transformOrigin: 'center center' }}
      >
        {children}
      </motion.div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function HomePage() {
  const prefersReducedMotion = useReducedMotion();
  const cardVariants = prefersReducedMotion ? cardRevealReduced : cardReveal;

  return (
    <main className="min-h-screen overflow-x-hidden bg-transparent">
      <section
        className="relative min-h-screen overflow-hidden border border-[#deddd5] bg-[#f7f6f0] px-5 py-8 sm:px-8 lg:px-12"
        style={{
          backgroundImage: `
            linear-gradient(#deddd5 1px, transparent 1px),
            linear-gradient(90deg, #deddd5 1px, transparent 1px)
          `,
          backgroundSize: '24px 24px',
        }}
      >
        {/* subtle inner wash */}
        <div className="pointer-events-none absolute inset-0 bg-[#f7f6f0]/60" />

        {/* ================= HERO ================= */}
        <motion.div
          className="relative z-10 mx-auto mt-10 max-w-5xl cursor-pointer text-center sm:mt-14 lg:mt-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.35 }}
          variants={heroReveal}
        >
          <h1 className="font-serif text-[34px] leading-[1.05] tracking-[-1px] text-black sm:text-[48px] sm:tracking-[-1.5px] lg:text-[62px] lg:tracking-[-2px] xl:text-[68px]">
            Tell us what you want to learn.
            <br />
            <span
              className="
                inline px-2
                [-webkit-box-decoration-break:clone] [box-decoration-break:clone]
                bg-[linear-gradient(to_top,#f2a9dd_72%,transparent_72%)]
              "
            >
              Leely finds the best resources for you.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl font-mono text-sm leading-6 text-[#55554f] text-pretty sm:mt-7 sm:text-base">
            Read the best articles and blogs out there.
            <br className="hidden sm:block" />
            Don't dig through the internet — we'll find them for you.
          </p>

          {/* Dashboard redirect button — untouched */}
          <div className="mt-8 flex justify-center">
            <DashboardRedirectButton />
          </div>
        </motion.div>

        {/* ================= COLLAGE ================= */}
        {/* mobile: stacked grid · lg+: absolutely positioned stage */}
        <motion.div
          className="
            relative z-10 mx-auto mt-12 grid w-full max-w-7xl grid-cols-1 gap-6
            sm:mt-16 sm:grid-cols-2 sm:gap-8
            lg:mt-20 lg:block lg:h-135
          "
          variants={collageStagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.12 }}
        >
          {/* ---------- 1 · TOP PROMPT (yellow) ---------- */}
          <CollageCard
            variants={cardVariants}
            className={`${MOBILE_CARD} order-1 -rotate-2
              lg:absolute lg:left-[19%] lg:-top-10.75 lg:z-40 lg:w-60 lg:-rotate-6
              xl:left-[25%] xl:w-70.5`}
            innerClassName="rounded-xl border-2 border-black bg-[#ffd55d] px-4 py-3 text-black shadow-[4px_5px_0_#000]"
          >
            <p className="font-mono text-sm font-bold leading-5">
              Help me learn
              <br />
              DBMS from scratch
            </p>
          </CollageCard>

          {/* ---------- 2 · BLACK BOOK ---------- */}
          <CollageCard
            variants={cardVariants}
            className={`${MOBILE_CARD} order-2 rotate-[1.5deg]
              lg:absolute lg:left-[16%] lg:top-5 lg:z-20 lg:h-90 lg:w-57.5 lg:rotate-[4deg]
              xl:left-[22%] xl:top-[25px] xl:h-[390px] xl:w-65`}
            innerClassName="rounded-2xl border-2 border-white bg-[#17252a] p-5 text-white shadow-[6px_7px_0_#000]"
          >
            <div className="flex h-full flex-col justify-between gap-4">
              <div>
                <p className="font-serif text-[34px] font-bold leading-none xl:text-5xl">Learn</p>
                <p className="mt-1 font-serif text-[34px] font-bold leading-none xl:text-5xl">
                  smarter
                </p>
              </div>

              <div
                className="mx-auto flex h-[150px] w-[130px] rotate-[-3deg] items-center justify-center
                  border-2 border-black bg-[#f4f1e8] text-black xl:h-[190px] xl:w-40"
              >
                <div className="text-center">
                  <div className="mx-auto mb-4 h-16 w-16 rounded-full border-2 border-black bg-[#d9a5ed]" />
                  <p className="font-serif text-xl">Leely's</p>
                  <p className="font-mono text-xs">RESOURCE CLUB</p>
                </div>
              </div>

              <p className="font-mono text-[10px] uppercase leading-4 xl:text-xs">
                Articles • Blogs [ finder ]
              </p>
            </div>
          </CollageCard>

          {/* ---------- 3 · LIME INFO CARD ---------- */}
          <CollageCard
            variants={cardVariants}
            className={`${MOBILE_CARD} order-3 rotate-[1deg]
              lg:absolute lg:left-0 lg:top-[90px] lg:z-10 lg:w-[210px] lg:rotate-[-6deg]
              xl:left-[2%] xl:top-[75px] xl:w-[280px]`}
            innerClassName="overflow-hidden rounded-2xl border-2 border-black bg-lime-300 text-black shadow-[5px_6px_0_#000]"
          >
            <div className="flex h-full items-end p-3">
              <div className="w-full rounded-lg bg-white/80 p-4 backdrop-blur">
                <h3 className="font-serif text-lg font-semibold sm:text-xl">
                  How Leely finds your resources
                </h3>

                <ul className="mt-3 space-y-1.5 font-mono text-[11px] leading-5 sm:text-xs">
                  <li>→ Optimizes your query into focused sub-queries</li>
                  <li>→ Finds resources for each query</li>
                  <li>→ Ranks the most relevant resources</li>
                  <li>→ Structures them around your learning needs</li>
                </ul>
              </div>
            </div>
          </CollageCard>

          {/* ---------- 4 · CENTER FLOW CARD ---------- */}
          <CollageCard
            variants={cardVariants}
            className={`${MOBILE_CARD} order-4 rotate-[-1deg]
              lg:absolute lg:left-[42%] lg:top-[60px] lg:z-10 lg:h-[380px] lg:w-[260px] lg:rotate-[-2deg]
              xl:left-[45%] xl:top-[55px] xl:h-[405px] xl:w-[290px]`}
            innerClassName="rounded-2xl border-2 border-black bg-[#f7f4eb] p-4 text-black shadow-[5px_6px_0_#000]"
          >
            <div className="flex h-full flex-col">
              <p className="font-serif text-[26px] leading-tight xl:text-4xl">
                Let it flow with LeelyAgent!
              </p>

              <div className="relative mt-4 flex min-h-[180px] flex-1 items-center justify-center overflow-hidden rounded-full bg-lime-300 p-6">
                <img
                  src={LeelyFlower}
                  alt="LeelyAgent logo"
                  className="h-32 w-auto object-contain xl:h-44"
                />
              </div>

              <div className="mt-3 flex justify-between font-mono text-[10px] xl:text-xs">
                <span>Research</span>
                <span>to</span>
                <span>Learn</span>
              </div>
            </div>
          </CollageCard>

          {/* ---------- 5 · RIGHT ARTICLE CARD ---------- */}
          <CollageCard
            variants={cardVariants}
            className={`${MOBILE_CARD} order-5 rotate-[1.5deg]
              lg:absolute lg:right-0 lg:top-[40px] lg:z-10 lg:h-[300px] lg:w-[250px] lg:rotate-[5deg]
              xl:right-[3%] xl:top-[60px] xl:h-[320px] xl:w-[320px]`}
            innerClassName="rounded-2xl border-2 border-black bg-amber-100 p-5 text-black shadow-[5px_6px_0_#000]"
          >
            <p className="font-mono text-xs text-gray-500">more on...</p>

            <h3 className="mt-5 font-serif text-2xl leading-tight xl:text-3xl">
              Building
              <br />
              persistent multi chat system
            </h3>

            <p className="mt-4 text-sm leading-5 text-gray-600">
              create multiple chats with more context window size, coming in 2nd version — we're
              working on it...
            </p>
          </CollageCard>

          {/* ---------- 6 · LEFT FLOATING PROMPT (blue) ---------- */}
          <CollageCard
            variants={cardVariants}
            className={`${MOBILE_CARD} order-6 rotate-[-1.5deg]
              lg:absolute lg:left-0 lg:top-[400px] lg:z-30 lg:w-[210px] lg:rotate-[-2deg]
              xl:top-[380px] xl:w-[250px]`}
            innerClassName="rounded-xl border-2 border-black bg-blue-200 px-4 py-3 text-black shadow-[4px_5px_0_#000]"
          >
            <p className="font-mono text-sm font-bold leading-5">
              Find me beginner-friendly
              <br />
              articles agentic memory
            </p>
          </CollageCard>

          {/* ---------- 7 · COMING SOON BUBBLE ---------- */}
          <CollageCard
            variants={cardVariants}
            className="order-7 mx-auto h-28 w-28 rotate-[8deg]
              lg:absolute lg:right-[6%] lg:top-[-20px] lg:z-40 lg:h-[104px] lg:w-[104px] lg:rotate-[12deg]
              xl:right-[12%] xl:top-[-10px] xl:h-[112px] xl:w-[112px]"
            innerClassName="flex items-center justify-center rounded-full border-2 border-black bg-lime-300 text-center text-black"
          >
            <div>
              <div className="text-2xl xl:text-3xl">☺</div>
              <p className="mt-1 font-mono text-[9px] font-bold">COMING SOON</p>
            </div>
          </CollageCard>
        </motion.div>
      </section>
    </main>
  );
}
