import LeelyFlower from '../../assets/lily-logo.png';
import { DashboardRedirectButton } from '../export.js';
import { Reveal } from './homeShared.jsx';

export function FinalCTA() {
  return (
    <section className="relative overflow-hidden border-b-2 border-black bg-[#f2a9dd] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          backgroundImage:
            'linear-gradient(#00000014 1px, transparent 1px), linear-gradient(90deg, #00000014 1px, transparent 1px)',
          backgroundSize: '26px 26px',
        }}
      />

      <Reveal className="relative mx-auto flex max-w-3xl flex-col items-center text-center">
        <span className="grid h-20 w-20 place-items-center overflow-hidden rounded-full border-2 border-black bg-[#f7f6f0] shadow-[5px_5px_0_#000]">
          <img src={LeelyFlower} alt="Leely" className="h-14 w-14 object-contain" />
        </span>

        <h2 className="mt-8 font-serif text-[34px] leading-[1.04] tracking-[-1.2px] text-balance sm:text-[48px] lg:text-[60px] lg:tracking-[-2px]">
          Stop searching.
          <br />
          Start reading.
        </h2>

        <p className="mt-6 max-w-lg font-mono text-sm leading-6 text-black/65">
          Tell Leely what you want to learn and get a ranked, de-duplicated reading list in seconds.
        </p>

        <div className="mt-9">
          <DashboardRedirectButton />
        </div>
      </Reveal>
    </section>
  );
}

export default FinalCTA;
