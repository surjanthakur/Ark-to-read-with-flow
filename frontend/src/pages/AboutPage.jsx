const reasons = [
  {
    title: 'I wanted a calmer way to learn',
    body: 'The internet is noisy, fragmented, and full of recycled advice. I wanted a tool that cuts through the clutter and gives me a clear, trustworthy path to learn something well.',
    accent: 'bg-[#ffd55d]',
  },
  {
    title: 'I was tired of tab-hoarding',
    body: 'Most of my research lives in half-open tabs, unread articles, and screenshots I never revisit. Leely turns that chaos into one ranked reading list I can actually finish.',
    accent: 'bg-[#a5c8ff]',
  },
  {
    title: 'I wanted to build something useful',
    body: 'This project is my answer to a problem I kept running into: learning something new should feel focused, not like a scavenger hunt across the web.',
    accent: 'bg-[#f2a9dd]',
  },
];

import { ArrowLeft5 } from 'reicon-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#f7f6f0] text-black">
      <main className="mx-auto max-w-6xl px-5 py-16 sm:px-8 lg:px-12 lg:py-20">
        <header className="mx-auto max-w-4xl text-center">
          <a
            href="/"
            className="inline-flex items-center gap-2 rounded-full border-2 border-black bg-lime-300 px-4 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-black shadow-[3px_3px_0_#000]"
          >
            <ArrowLeft5 size={25} /> back to home
          </a>

          <h1 className="mt-8 font-serif text-[42px] leading-[0.96] tracking-[-1.4px] text-black sm:text-[56px] lg:text-[72px] lg:tracking-[-2.4px]">
            Why I built this project.
          </h1>

          <p className="mx-auto mt-6 max-w-2xl font-mono text-sm leading-7 text-black/70 sm:text-base">
            I built Leely because learning online should feel intentional, not exhausting. I wanted
            a tool that helps people find the best reading material faster and keep momentum without
            the usual chaos.
          </p>
        </header>

        <section className="mt-16 grid gap-6 md:grid-cols-3">
          {reasons.map((reason) => (
            <article
              key={reason.title}
              className={`rounded-[28px] border-2 border-black p-6 shadow-[7px_7px_0_#000] ${reason.accent}`}
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border-2 border-black bg-white text-lg shadow-[3px_3px_0_#000]">
                ✦
              </div>
              <h2 className="font-serif text-2xl leading-tight tracking-tight text-black">
                {reason.title}
              </h2>
              <p className="mt-4 font-mono text-sm leading-6 text-black/75">{reason.body}</p>
            </article>
          ))}
        </section>

        <section className="mt-16 rounded-4xl border-2 border-black bg-[#1a1a1a] p-8 text-white shadow-[10px_10px_0_#000] sm:p-10 lg:p-12">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <p className="font-mono text-[11px] font-bold uppercase tracking-[0.28em] text-lime-300">
                the problem
              </p>
              <h2 className="mt-4 font-serif text-3xl tracking-[-0.06em] text-white sm:text-4xl">
                The internet is full of good ideas, but the path to them is messy.
              </h2>
            </div>

            <p className="font-mono text-sm leading-7 text-white/75 sm:text-base">
              Good resources are scattered across blogs, research papers, engineering notes, and
              personal essays. Instead of giving people a clean next step, most platforms bury the
              best material behind SEO noise, duplication, and endless tabs.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
