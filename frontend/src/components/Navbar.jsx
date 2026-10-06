import ArkLogo from '../assets/lily-logo.png';
import { motion, useScroll } from 'motion/react';

export default function Navbar() {
  const { scrollYProgress } = useScroll();

  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-lg">
      <div
        className=" mx-auto flex h-25 w-full items-center justify-between px-6 sm:px-10 lg:px-14
        "
      >
        {/* ================= LOGO ================= */}
        <a
          href="/"
          className="
            group
            relative
            inline-flex
            items-center
            rounded-md
            py-2
          "
        >
          <img
            src={ArkLogo}
            alt="Ark Agent"
            className="
              h-20
              w-auto
              object-contain
              transition-transform
              duration-200
              group-hover:-rotate-100
            "
          />

          {/* hover underline */}
          <span
            className="
              absolute
              bottom-0
              left-0
              h-1
              w-0
              bg-lime-400
              transition-all
              duration-300
              group-hover:w-full
            "
          />
        </a>
      </div>
      <motion.div
        aria-hidden="true"
        className="absolute bottom-0 left-0 h-1 w-full origin-left bg-black"
        style={{ scaleX: scrollYProgress }}
      />
    </nav>
  );
}
