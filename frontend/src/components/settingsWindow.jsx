import { Sun, MoonStars, Logout6, X } from 'reicon-react';

export default function SettingsPopupWindow({ openSetting, setSetting }) {
  if (!openSetting) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl border border-black/10 bg-white p-5 shadow-xl sm:p-6">
        {/* Header */}

        <div className="relative mb-6">
          <div className="group relative shrink-0">
            <button
              type="button"
              onClick={setSetting}
              className="absolute right-0 top-0 rounded-md p-1 text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-900"
            >
              <X size={25} />
            </button>

            {/* Tooltip */}
            <div className="pointer-events-none absolute bottom-full left-2/2 mb-2 -translate-x-1/2 rounded-lg border border-black/10 bg-white px-3 py-2 text-xs font-medium whitespace-nowrap text-neutral-700 opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100">
              close
            </div>
          </div>

          <h2 className="text-lg font-semibold text-neutral-900">Settings</h2>

          <p className="mt-1 pr-8 text-sm text-neutral-500">Customize your Lily experience.</p>
        </div>

        {/* Theme */}
        <div className="mb-6">
          <p className="mb-3 text-sm font-medium text-neutral-700">Theme</p>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              className="flex items-center justify-center gap-2 rounded-lg border border-black bg-black px-4 py-3 text-sm font-medium text-white transition hover:bg-neutral-800"
            >
              <Sun size={18} />
              Light [default]
            </button>

            <button
              type="button"
              className="flex items-center justify-center gap-2 rounded-lg border border-black/10 bg-neutral-50 px-4 py-3 text-sm font-medium text-neutral-700 transition hover:bg-neutral-100"
            >
              <MoonStars size={18} />
              Dark
            </button>
          </div>
        </div>

        {/* Logout */}
        <button
          type="button"
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600 transition hover:bg-red-100"
        >
          <Logout6 size={18} />
          Logout
        </button>
      </div>
    </div>
  );
}
