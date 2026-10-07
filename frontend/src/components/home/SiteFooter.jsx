import LeelyLogo from '../../assets/read_with_leely_logo.png';
import { NAV } from './homeData.js';

export function SiteFooter() {
  return (
    <footer className="bg-black px-5 py-12 text-white sm:px-8 lg:px-12">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center overflow-hidden rounded-full border-2 border-white bg-lime-300">
            <img src={LeelyLogo} alt="" className="h-6 w-6 object-contain" />
          </span>
          <span className="font-serif text-xl font-bold leading-none">Leely</span>
        </div>

        <nav className="flex flex-wrap gap-x-6 gap-y-3">
          {NAV.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className="font-mono text-xs uppercase tracking-widest text-white/55 transition-colors hover:text-white"
            >
              {n.label}
            </a>
          ))}
        </nav>

        <p className="font-mono text-[10px] uppercase tracking-widest text-white/35">
          © {new Date().getFullYear()} Leely · built for curious people
        </p>
      </div>
    </footer>
  );
}

export default SiteFooter;
