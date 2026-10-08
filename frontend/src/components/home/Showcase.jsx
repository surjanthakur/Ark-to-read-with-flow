import LeelyLogo from '../../assets/read_with_leely_logo.png';
import { CARD, MOBILE_CARD, SHADOW, TOPICS } from './homeData.js';
import { useItemVariants } from './homeMotion.js';
import { CollageCard, Eyebrow, Reveal, RevealGroup } from './homeShared.jsx';

export function Showcase() {
  const item = useItemVariants(36);

  return (
    <section
      id="showcase"
      className="relative scroll-mt-24 overflow-hidden border-b-2 border-black bg-[#f7f6f0] px-5 py-20 sm:px-8 lg:px-12 lg:py-28"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          backgroundImage:
            'linear-gradient(#deddd5 1px, transparent 1px), linear-gradient(90deg, #deddd5 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      <div className="relative mx-auto max-w-7xl">
        <Reveal className="mb-12 flex flex-col gap-5 sm:mb-16 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Eyebrow className="shadow-[3px_3px_0_#000]">✦ the showcase</Eyebrow>
            <h2 className="mt-5 max-w-2xl font-serif text-[32px] leading-[1.06] tracking-[-1px] text-black sm:text-[44px] lg:text-[54px] lg:tracking-[-1.6px]">
              A reading shelf that looks as good as it reads.
            </h2>
          </div>
          <p className="max-w-sm font-mono text-sm leading-6 text-[#55554f]">
            <span className="text-blue-500 underline">Ranked articles and blogs</span>, topic
            clusters and a workspace that stays out of your way. Here&apos;s a peek at what&apos;s
            inside.
          </p>
        </Reveal>

        <RevealGroup
          className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-7 lg:auto-rows-16 lg:grid-cols-12 lg:gap-5"
          stagger={0.08}
          amount={0.08}
        >
          <CollageCard
            variants={item}
            rotateOnHover={-1}
            className={`${MOBILE_CARD} order-1 -rotate-2 lg:col-span-3 lg:col-start-1 lg:row-span-2 lg:row-start-1 lg:h-full`}
            innerClassName={`${CARD} ${SHADOW} flex h-full items-center bg-[#ffd55d] px-4 py-4`}
          >
            <p className="font-mono text-sm text-black font-bold leading-5">
              finds multiple blogs &amp; articles
              <br />a lot of options to choose from
            </p>
          </CollageCard>

          <CollageCard
            variants={item}
            rotateOnHover={2}
            className={`${MOBILE_CARD} order-2 rotate-[1.5deg] lg:col-span-4 lg:col-start-9 lg:row-span-5 lg:row-start-1 lg:h-full lg:rotate-1`}
            innerClassName={`${CARD} h-full bg-[#17252a] p-5 text-white shadow-[6px_7px_0_#000] border-white`}
          >
            <div className="flex h-full flex-col justify-between gap-4">
              <div>
                <p className="font-serif text-[32px] font-bold leading-none xl:text-5xl">Learn</p>
                <p className="mt-1 font-serif text-[32px] font-bold leading-none xl:text-5xl">
                  smarter
                </p>
              </div>

              <div className="mx-auto flex h-37.5 w-32.5 -rotate-3 items-center justify-center border-2 border-black bg-[#f4f1e8] text-black xl:h-42 xl:w-37.5">
                <div className="text-center">
                  <div className="mx-auto mb-3 h-14 w-14 rounded-full border-2 border-black bg-[#d9a5ed] xl:h-16 xl:w-16" />
                  <p className="font-serif text-xl">Leely&apos;s</p>
                  <p className="font-mono text-[10px] tracking-wider">RESOURCE CLUB</p>
                </div>
              </div>

              <p className="font-mono text-[10px] uppercase leading-4 tracking-wider xl:text-xs">
                Articles • Blogs [ finder ]
              </p>
            </div>
          </CollageCard>

          <CollageCard
            variants={item}
            rotateOnHover={1}
            className={`${MOBILE_CARD} order-3 rotate-1 sm:col-span-2 lg:col-span-3 lg:col-start-1 lg:row-span-4 lg:row-start-3 lg:h-full lg:-rotate-1`}
            innerClassName={`${CARD} ${SHADOW} flex h-full flex-col justify-between gap-4 overflow-hidden bg-lime-300 p-5`}
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] text-black font-bold uppercase tracking-[0.18em]">
                Topics we cover
              </span>
              <span className="text-lg leading-none">✦</span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {TOPICS.map((t) => (
                <span
                  key={t}
                  className="rounded-full border-2 text-black border-black bg-white px-2.5 py-1 font-mono text-[10px] font-bold leading-none"
                >
                  {t}
                </span>
              ))}
            </div>

            <p className="font-mono text-[10px] leading-4 text-black/65">
              …and whatever else you&apos;re curious about this week.
            </p>
          </CollageCard>

          <CollageCard
            variants={item}
            lift={-12}
            className={`${MOBILE_CARD} order-4 -rotate-1 sm:col-span-2 lg:col-span-5 lg:col-start-4 lg:row-span-8 lg:row-start-1 lg:h-full lg:rotate-0`}
            innerClassName={`${CARD} ${SHADOW} h-full bg-[#f7f4eb] p-4 sm:p-5`}
          >
            <div className="flex h-full flex-col">
              <p className="font-serif text-[26px] text-black leading-tight xl:text-4xl">
                Let it flow with LeelyAgent!
              </p>

              <div className="relative mt-4 flex min-h-45 flex-1 items-center justify-center overflow-hidden rounded-full bg-lime-300">
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(255,255,255,0.65),transparent_62%)]"
                />
                <img
                  src={LeelyLogo}
                  alt="LeelyAgent"
                  className="relative h-32 w-auto object-contain lg:h-52 xl:h-60"
                />
              </div>

              <div className="mt-3 flex text-black justify-between font-mono text-[10px] uppercase tracking-widest xl:text-xs">
                <span>Research</span>
                <span className="text-black/40">→</span>
                <span>Learn</span>
              </div>
            </div>
          </CollageCard>

          <CollageCard
            variants={item}
            rotateOnHover={2}
            className={`${MOBILE_CARD} order-5 text-black rotate-[1.5deg] lg:col-span-4 lg:col-start-9 lg:row-span-3 lg:row-start-6 lg:h-full lg:rotate-1`}
            innerClassName={`${CARD} ${SHADOW} h-full overflow-hidden bg-amber-100 p-5`}
          >
            <span className="inline-block rounded-full border-2 border-black bg-white px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-widest">
              coming soon...
            </span>

            <h3 className="mt-4 font-serif text-2xl leading-tight xl:text-3xl">
              Building persistent
              <br />
              multi-chat systems
            </h3>

            <p className="mt-3 text-sm leading-5 text-gray-600">
              Create multiple chats with a bigger context window. Landing in v2 — we&apos;re on it.
            </p>
          </CollageCard>

          <CollageCard
            variants={item}
            rotateOnHover={-2}
            className={`${MOBILE_CARD} order-6 text-black rotate-[-1.5deg] lg:col-span-3 lg:col-start-1 lg:row-span-2 lg:row-start-7 lg:h-full lg:-rotate-2`}
            innerClassName={`${CARD} ${SHADOW} flex h-full items-center bg-[#a5c8ff] px-4 py-4`}
          >
            <p className="font-mono text-sm font-bold leading-5">
              IT&apos;S FREE NOW!
              <br />
              <span className="font-normal text-black/65">no card, no catch.</span>
            </p>
          </CollageCard>
        </RevealGroup>
      </div>
    </section>
  );
}

export default Showcase;
