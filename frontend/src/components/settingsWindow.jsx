import { Sun, MoonStars, Logout6, X } from 'reicon-react';
import { useAuthContext } from '../context/Auth.js';
import { useTheme } from '../context/ThemeToggleContext.js';
import { useNavigate } from 'react-router-dom';

export default function SettingsPopupWindow({ openSetting, setSetting }) {
  const { isAuthenticated, logoutUser } = useAuthContext();
  const { themeMode, lightTheme, darkTheme } = useTheme();

  const navigate = useNavigate();

  const handleLogout = async () => {
    await logoutUser();
    if (!isAuthenticated) navigate('/');
  };

  if (!openSetting) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl border border-black/10 bg-white p-5 text-neutral-900 shadow-xl sm:p-6 dark:border-white/10 dark:bg-neutral-900 dark:text-neutral-100">
        {/* Header */}

        <div className="relative mb-6">
          <div className="group relative shrink-0">
            <button
              type="button"
              aria-label="Close settings"
              onClick={setSetting}
              className="absolute right-0 top-0 rounded-md p-1 text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-900 dark:hover:bg-neutral-800 dark:hover:text-white"
            >
              <X size={25} />
            </button>

            {/* Tooltip */}
            <div className="pointer-events-none absolute bottom-full left-2/2 mb-2 -translate-x-1/2 rounded-lg border border-black/10 bg-white px-3 py-2 text-xs font-medium whitespace-nowrap text-neutral-700 opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100 dark:border-white/10 dark:bg-neutral-800 dark:text-neutral-200">
              close
            </div>
          </div>

          <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">Settings</h2>

          <p className="mt-1 pr-8 text-sm text-neutral-500 dark:text-neutral-400">
            Customize your Lily experience.
          </p>
        </div>

        {/* Theme */}
        <div className="mb-6">
          <p className="mb-3 text-sm font-medium text-neutral-700 dark:text-neutral-300">Theme</p>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={lightTheme}
              aria-pressed={themeMode === 'light'}
              className={`flex items-center justify-center gap-2 rounded-lg border px-4 py-3 text-sm font-medium transition ${themeMode === 'light' ? 'border-black bg-black text-white hover:bg-neutral-800' : 'border-black/10 bg-neutral-50 text-neutral-700 hover:bg-neutral-100 dark:border-white/10 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700'}`}
            >
              <Sun size={18} />
              Light [default]
            </button>

            <button
              type="button"
              onClick={darkTheme}
              aria-pressed={themeMode === 'dark'}
              className={`flex items-center justify-center gap-2 rounded-lg border px-4 py-3 text-sm font-medium transition ${themeMode === 'dark' ? 'border-neutral-700 bg-neutral-800 text-white hover:bg-neutral-700' : 'border-black/10 bg-neutral-50 text-neutral-700 hover:bg-neutral-100 dark:border-white/10 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700'}`}
            >
              <MoonStars size={18} />
              Dark
            </button>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          type="button"
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600 transition hover:bg-red-100 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300 dark:hover:bg-red-950/70"
        >
          <Logout6 size={18} />
          Logout
        </button>
      </div>
    </div>
  );
}
