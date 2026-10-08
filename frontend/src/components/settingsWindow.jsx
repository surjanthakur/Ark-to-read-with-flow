import { X } from 'reicon-react';
import useThemeContext from '../context/useThemeContext.js';

export default function SettingsPopupWindow({ openSetting, setSetting }) {
  const { theme, setTheme } = useThemeContext();

  if (!openSetting) return null;

  return (
    <section className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      {/* Modal Container - Neo-Brutalist Card */}
      <div className="relative w-full max-w-md rounded-3xl border-4 border-black bg-[#fcf6c5] p-6 text-black shadow-[12px_12px_0px_0px_#000] transition-colors duration-300 dark:border-neutral-500 dark:bg-neutral-900 dark:text-white dark:shadow-[12px_12px_0px_0px_#c4f75d] sm:p-8">
        {/* Close Button - Floating Circle */}
        <button
          type="button"
          aria-label="Close settings"
          onClick={() => setSetting(false)} // Assuming setSetting toggles the boolean
          className="absolute -right-4 -top-4 flex h-12 w-12 items-center justify-center rounded-full border-2 border-black bg-[#ff8ae2] text-black shadow-[3px_3px_0px_0px_#000] transition-all hover:-translate-y-1 hover:shadow-[5px_5px_0px_0px_#000] active:translate-y-1 active:shadow-none"
        >
          <X size={24} strokeWidth={3} />
        </button>

        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-black uppercase tracking-tight text-black dark:text-white">
            Settings
          </h2>
          <p className="mt-2 text-sm font-bold text-neutral-600 dark:text-neutral-300">
            if you want to take break it's OK.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-black uppercase tracking-wide">Appearance</h3>
          <div className="mt-3 grid grid-cols-2 gap-3">
            {['light', 'dark'].map((option) => (
              <button
                key={option}
                type="button"
                aria-pressed={theme === option}
                onClick={() => setTheme(option)}
                className={`rounded-xl border-2 border-black px-4 py-3 text-sm font-black capitalize shadow-[3px_3px_0px_0px_#000] transition-all duration-200 active:translate-y-0.5 active:shadow-none dark:border-neutral-300 dark:shadow-[3px_3px_0px_0px_#c4f75d] ${
                  theme === option
                    ? 'bg-[#c4f75d] text-black'
                    : 'bg-white text-black hover:bg-neutral-100 dark:bg-neutral-800 dark:text-white dark:hover:bg-neutral-700'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
