import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import LeelyLogo from '../../assets/read_with_leely_logo.png';
import { DashboardRedirectButton } from '../export.js';
import { CARD, SHADOW } from './homeData.js';
import { useItemVariants } from './homeMotion.js';
import { Eyebrow, RevealGroup } from './homeShared.jsx';

function FloatingSticker({ children, className = '', rotate = 0, y }) {
  return (
    <motion.div
      style={{ y }}
      className={`pointer-events-none absolute z-20 hidden xl:block ${className}`}
    >
      <div
        style={{ rotate: `${rotate}deg` }}
        className="rounded-xl border-2 border-black bg-white px-3.5 py-2 font-mono text-[11px] font-bold uppercase tracking-wide shadow-[4px_4px_0_#000]"
      >
        {children}
      </div>
    </motion.div>
  );
}

export function Hero() {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const item = useItemVariants(34);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -70]);
  const y4 = useTransform(scrollYProgress, [0, 1], [0, 90]);

  return (
    <section
      id="home"
      ref={ref}
      className="relative isolate scroll-mt-24 overflow-hidden border-b-2 border-black bg-[#f7f6f0] px-5 pb-20 pt-14 sm:px-8 sm:pb-24 sm:pt-20 lg:px-12 lg:pb-28 lg:pt-24"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(#deddd5 1px, transparent 1px), linear-gradient(90deg, #deddd5 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_55%_at_50%_45%,rgba(247,246,240,0.95)_0%,rgba(247,246,240,0.55)_55%,rgba(247,246,240,0)_100%)]"
      />

      <FloatingSticker y={reduce ? undefined : y1} rotate={-11} className="left-[4%] top-[18%]">
        🚫 no tab hoarding
      </FloatingSticker>
      <FloatingSticker y={reduce ? undefined : y2} rotate={9} className="right-[5%] top-[22%]">
        ⚡ ~3s per search
      </FloatingSticker>
      <FloatingSticker y={reduce ? undefined : y3} rotate={7} className="bottom-[16%] left-[7%]">
        📚 10k+ sources indexed
      </FloatingSticker>
      <FloatingSticker y={reduce ? undefined : y4} rotate={-8} className="bottom-[13%] right-[6%]">
        ★ built for curious minds
      </FloatingSticker>

      <RevealGroup
        className="relative z-10 mx-auto flex max-w-4xl flex-col items-center text-center"
        stagger={0.1}
        amount={0.25}
      >
        <motion.div variants={item}>
          <Eyebrow className="shadow-[3px_3px_0_#000]">
            <span className="h-1.5 w-1.5 rounded-full bg-lime-400" />
            AI-powered blog finder
          </Eyebrow>
        </motion.div>

        <motion.h1
          variants={item}
          className="mt-6 font-serif text-[36px] font-normal leading-[1.03] tracking-[-1.2px] text-black text-balance sm:text-[52px] sm:tracking-[-1.6px] lg:text-[68px] lg:tracking-[-2.2px] xl:text-[76px]"
        >
          Tell us what you want to learn.
          <br />
          <span
            className="
              mt-2 inline px-2
              [-webkit-box-decoration-break:clone] [box-decoration-break:clone]
              bg-[linear-gradient(to_top,#f2a9dd_68%,transparent_68%)]
            "
          >
            Leely finds the best blogs for you.
          </span>
        </motion.h1>

        <motion.p
          variants={item}
          className="mx-auto mt-7 max-w-xl font-mono text-sm leading-6 text-[#55554f] text-pretty sm:text-base sm:leading-7"
        >
          Read the best articles and blogs out there.
          <br className="hidden sm:block" /> Don&apos;t dig through the internet — we&apos;ll find
          them for you.
        </motion.p>

        <motion.div variants={item} className="mt-9 flex flex-col items-center gap-4 sm:flex-row">
          <DashboardRedirectButton />
          <a
            href="#features"
            className="group inline-flex items-center gap-2 rounded-xl border-2 border-black bg-white px-5 py-3 font-mono text-sm font-bold uppercase tracking-wide shadow-[4px_4px_0_#000] transition-transform hover:-translate-y-0.5 active:translate-x-0.75 active:translate-y-0.75 active:shadow-none"
          >
            How it works
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </a>
        </motion.div>

        <motion.dl
          variants={item}
          className="mt-12 grid w-full max-w-2xl grid-cols-1 gap-3 sm:grid-cols-3"
        >
          {[
            ['10k+', 'blogs indexed'],
            ['~3s', 'average search'],
            ['$0', 'while in beta'],
          ].map(([value, label]) => (
            <div key={label} className={`${CARD} ${SHADOW} bg-white/80 px-4 py-3 backdrop-blur-sm`}>
              <dt className="font-serif text-2xl font-bold leading-none">{value}</dt>
              <dd className="mt-1 font-mono text-[10px] uppercase tracking-[0.16em] text-black/55">
                {label}
              </dd>
            </div>
          ))}
        </motion.dl>
      </RevealGroup>
    </section>
  );
}

export function HeroLogoBadge() {
  return (
    <span className="grid h-20 w-20 place-items-center overflow-hidden rounded-full border-2 border-black bg-[#f7f6f0] shadow-[5px_5px_0_#000]">
      <img src={LeelyLogo} alt="Leely" className="h-14 w-14 object-contain" />
    </span>
  );
}
