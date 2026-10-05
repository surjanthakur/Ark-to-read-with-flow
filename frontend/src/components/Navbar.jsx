import ArkLogo from '../assets/lily-logo.png';
import { useAuthContext } from '../context/Auth.js';
import { Handshake } from 'reicon-react';
import { motion, useScroll } from 'motion/react';

export default function Navbar() {
  const { user, isAuthenticated, loginUser } = useAuthContext();
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

        {isAuthenticated && (
          <h2 className="flex font-mono text-sm font-bold text-black sm:text-base">
            Welcome
            <Handshake size={24} weight="filled" color="black" /> , {user?.username}
          </h2>
        )}

        {/* ================= GOOGLE LOGIN ================= */}
        {!isAuthenticated && (
          <button
            onClick={loginUser}
            type="button"
            className="
              group
              flex
              min-h-14
              items-center
              justify-center
              gap-3
              rounded-xl
              border-2
              border-black
              bg-[#caff8a]
              px-6
              font-mono
              text-sm
              font-bold
              text-black
              shadow-[4px_5px_0px_#000]
              transition-all
              duration-200

              hover:-translate-y-1
              hover:bg-[#d6ff9b]
              hover:shadow-[6px_7px_0px_#000]

              active:translate-y-0
              active:shadow-[2px_3px_0px_#000]

              focus-visible:outline-2
              focus-visible:outline-offset-4
              focus-visible:outline-black
              "
          >
            <img
              src="https://cdn.reicon.dev/logos/google/original.svg"
              alt="Google"
              width={22}
              height={22}
              className="
                transition-transform
                duration-200
                group-hover:scale-110
                "
            />

            <span>Continue with Google</span>
          </button>
        )}
      </div>
      <motion.div
        aria-hidden="true"
        className="absolute bottom-0 left-0 h-1 w-full origin-left bg-black"
        style={{ scaleX: scrollYProgress }}
      />
    </nav>
  );
}
