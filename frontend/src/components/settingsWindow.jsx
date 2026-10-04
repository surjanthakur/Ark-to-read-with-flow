import { Logout6, X } from 'reicon-react';
import { useAuthContext } from '../context/Auth.js';
import { useNavigate } from 'react-router-dom';

export default function SettingsPopupWindow({ openSetting, setSetting }) {
  const { logoutUser } = useAuthContext();

  const navigate = useNavigate();

  const handleLogout = async () => {
    const success = await logoutUser();

    if (success) {
      navigate('/');
    }
  };

  if (!openSetting) return null;

  return (
    <section className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      {/* Modal Container - Neo-Brutalist Card */}
      <div className="relative w-full max-w-md rounded-3xl border-4 border-black bg-[#fcf6c5] p-6 shadow-[12px_12px_0px_0px_#000] sm:p-8">
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
          <h2 className="text-3xl font-black uppercase tracking-tight text-black">Settings</h2>
          <p className="mt-2 text-sm font-bold text-neutral-600">
            if you want to take break it's OK.
          </p>
        </div>

        {/* Logout Button - Chunky & Interactive */}
        <button
          onClick={handleLogout}
          type="button"
          className="group flex w-full items-center justify-center gap-3 rounded-xl border-2 border-black bg-white px-4 py-4 text-base font-black text-black shadow-[4px_4px_0px_0px_#000] transition-all hover:bg-[#ff8ae2] hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_#000] active:translate-y-1 active:shadow-none"
        >
          <Logout6
            size={20}
            strokeWidth={3}
            className="transition-transform group-hover:-translate-x-1"
          />
          LOGOUT
        </button>
      </div>
    </section>
  );
}
