import { Settings2, Trash2 } from 'reicon-react';
import { useRef, useState, useEffect } from 'react';
import { SettingsPopupWindow } from '../components/export.js';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { CallAgent } from '../api/agent.api.js';
import { AgentLoader } from '../components/export.js';
import Lilylogo from '../assets/lily-logo.png';
import { ArrowToDownLeft, Magicpen } from 'reicon-react';
import { useAuthContext } from '../context/Auth.js';

export default function Dashboard() {
  const { user, isLoading } = useAuthContext();

  const profileInitials =
    (user?.username || 'default')
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word[0]?.toUpperCase())
      .join('') || 'D';

  const [openSettings, setOpenSettings] = useState(false);

  const [isAgentLoading, setIsAgentLoading] = useState(false);

  const [chats, setChats] = useState(() => {
    try {
      const storedChats = localStorage.getItem('lily_chats');
      return storedChats ? JSON.parse(storedChats) : [];
    } catch {
      console.error('Failed to load chats.');
      return [];
    }
  });

  const textareaRef = useRef(null);

  const chatWindowRef = useRef(null);

  const { register, handleSubmit, reset } = useForm();

  // Save chats to localStorage whenever chats changes
  useEffect(() => {
    if (chats.length === 0) {
      localStorage.removeItem('lily_chats');
    } else {
      localStorage.setItem('lily_chats', JSON.stringify(chats));
    }
  }, [chats]);

  useEffect(() => {
    const chatWindow = chatWindowRef.current;

    if (chatWindow) {
      chatWindow.scrollTo({ top: chatWindow.scrollHeight, behavior: 'smooth' });
    }
  }, [chats, isAgentLoading]);

  const handleSettings = () => {
    setOpenSettings((prev) => !prev);
  };

  const deleteAllChats = () => {
    setChats([]);
    localStorage.removeItem('lily_chats');
  };

  const handleInput = (e) => {
    const textarea = e.target;

    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      e.currentTarget.form?.requestSubmit();
    }
  };

  const onSubmit = async (data) => {
    const userQuery = data.user_query?.trim();

    if (!userQuery) return;

    setIsAgentLoading(true);

    // Add user's query immediately
    const chatIndex = chats.length;

    setChats((prev) => [
      ...prev,
      {
        user_query: userQuery,
        found_resources: [],
      },
    ]);

    try {
      const response = await CallAgent(userQuery);
      const foundResources = response?.found_resources || [];

      // Update the same chat item with agent response
      setChats((prev) =>
        prev.map((chat, index) =>
          index === chatIndex
            ? {
                ...chat,
                found_resources: foundResources,
              }
            : chat
        )
      );
    } catch (err) {
      // Remove the pending chat if request fails
      setChats((prev) => prev.filter((_, index) => index !== chatIndex));
      toast.error(err.response?.data?.detail || "Oop's Something went wrong. Please try again.");
    } finally {
      setIsAgentLoading(false);
      reset();

      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  return (
    <section
      className="h-dvh overflow-hidden bg-[#f4f4f0] text-neutral-900 font-sans selection:bg-[#fcabe7bd] selection:text-black"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)`,
        backgroundSize: '24px 24px',
      }}
    >
      {/* Global Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#f4f4f0]/80 backdrop-blur-sm">
          <div className="bg-white border-4 border-black p-6 rounded-3xl shadow-[8px_8px_0px_0px_#000]">
            <AgentLoader />
          </div>
        </div>
      )}

      <div className="mx-auto flex h-full w-full max-w-6xl flex-col bg-transparent">
        {/* Header - Neo Brutalist Style */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b-4 border-black bg-white px-4 sm:px-8">
          <div className="flex items-center gap-3">
            <div className="border-2 border-black rounded-xl p-1 bg-lime-200 shadow-[2px_2px_0px_0px_#000]">
              <img src={Lilylogo} alt="Lily" className="h-8 w-8 rounded-lg object-cover" />
            </div>
            <span className="hidden sm:block text-sm font-bold tracking-tight uppercase">
              Agent on mission
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden text-sm font-bold bg-[#fcf6c5] px-3 py-1 border-2 border-black rounded-full shadow-[2px_2px_0px_0px_#000] sm:block">
              {user?.username || 'default'}
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#ff8ae2] border-2 border-black shadow-[2px_2px_0px_0px_#000]">
              <h1 className="text-sm font-black leading-none">{profileInitials}</h1>
            </div>
          </div>
        </header>

        {/* Main Chat Area */}
        <div className="flex min-h-0 flex-1 flex-col relative">
          <main
            ref={chatWindowRef}
            className="min-h-0 flex-1 overflow-y-auto px-4 py-6 sm:px-8 sm:py-10"
          >
            <div className="mx-auto flex w-full max-w-4xl flex-col gap-8">
              {/* Empty State - Floating Card */}
              {chats.length === 0 && !isAgentLoading && (
                <div className="flex min-h-[50vh] items-center justify-center">
                  <div className="max-w-lg text-center bg-lime-200 border-4 border-black p-8 rounded-3xl shadow-[12px_12px_0px_0px_#000] -rotate-1 relative">
                    <img
                      src={Lilylogo}
                      alt="Lily"
                      className="mx-auto mb-6 h-24 w-24 rounded-2xl object-cover border-2 border-black bg-[#ff8ae2] p-2 shadow-[4px_4px_0px_0px_#000]"
                    />
                    <span className="text-2xl font-serif font-bold">hey!!</span>

                    <h1 className="text-3xl font-black tracking-tight text-black font-serif sm:text-4xl">
                      Tell me what you want to learn.
                    </h1>

                    <p className="mt-4 text-base font-medium leading-6 text-neutral-700">
                      Read the best articles and blogs out there. Don't dig through the internet —
                      Lily finds them for you.
                    </p>
                  </div>
                </div>
              )}

              {/* Chat History */}
              {chats.map((chat, chatIndex) => (
                <div key={chatIndex} className="space-y-6 sm:space-y-8">
                  {/* User Message Bubble */}
                  <div className="flex justify-end">
                    <div className="w-fit max-w-[92%] sm:max-w-[75%]">
                      <div className="rounded-2xl rounded-br-sm bg-[#1a1a1a] border-2 border-black px-5 py-4 shadow-[4px_4px_0px_0px_#c4f75d]">
                        <p className="wrap-break-word text-base font-medium leading-6 text-white">
                          {chat.user_query}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Agent Resources */}
                  {chat.found_resources?.length > 0 && (
                    <div className="flex justify-start">
                      <div className="w-full max-w-[98%] space-y-4 sm:max-w-[85%]">
                        {chat.found_resources.map((resource, resourceIndex) => (
                          <article
                            key={`${resource.url}-${resourceIndex}`}
                            className="rounded-2xl rounded-tl-sm border-2 border-black bg-[#fcf6c5] p-5 shadow-[6px_6px_0px_0px_#000] transition-transform hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_#000]"
                          >
                            {/* Title */}
                            <h3 className="wrap-break-word py-2 text-lg font-black leading-7 text-black sm:text-xl">
                              {resource.title}
                            </h3>

                            {/* Read Badge */}
                            <div className="flex items-center gap-2 mt-2">
                              <span className="flex items-center text-xs font-bold bg-[#ff8ae2] border-2 border-black px-2 py-1 rounded-md shadow-[2px_2px_0px_0px_#000]">
                                read <ArrowToDownLeft size={16} className="ml-1" />
                              </span>

                              <span className="text-xs font-bold bg-[#c4f75d] border-2 border-black px-2 py-1 rounded-md shadow-[2px_2px_0px_0px_#000]">
                                score: {((resource.score || 0) * 100).toFixed(0)}%
                              </span>
                            </div>

                            {/* URL */}
                            <a
                              href={resource.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-4 block break-all text-sm font-bold text-blue-700 underline decoration-2 underline-offset-2 hover:text-blue-900"
                            >
                              {resource.url}
                            </a>

                            {/* Content Snippet */}
                            <div className="mt-4 bg-white border-2 border-black p-3 rounded-xl shadow-[2px_2px_0px_0px_#000]">
                              <p className="wrap-break-word text-sm leading-6 text-neutral-800 font-medium">
                                <span className="font-black text-black block mb-1">
                                  About this resource:
                                </span>{' '}
                                {resource.content?.split(/\s+/).slice(0, 50).join(' ')}...
                              </p>
                            </div>
                          </article>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* Agent Loading State */}
              {isAgentLoading && (
                <div className="flex justify-start">
                  <div className="w-full max-w-[98%] sm:max-w-[85%]">
                    <div className="rounded-2xl border-2 border-black bg-white p-5 shadow-[4px_4px_0px_0px_#000]">
                      <AgentLoader />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </main>

          {/* Input Area - Floating Brutalist Box */}
          <div className="shrink-0 bg-transparent px-4 py-6 sm:px-8">
            <div className="mx-auto w-full max-w-3xl">
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex items-end gap-2 rounded-3xl border-4 border-black bg-white p-3 shadow-[8px_8px_0px_0px_#000]"
              >
                {/* Settings & Delete */}
                <div className="flex shrink-0 gap-1">
                  <button
                    type="button"
                    onClick={handleSettings}
                    aria-label="Settings"
                    className="flex h-12 w-12 items-center justify-center rounded-xl border-2 border-transparent text-neutral-500 transition hover:border-black hover:bg-[#f4f4f0] hover:text-black hover:shadow-[2px_2px_0px_0px_#000]"
                  >
                    <Settings2 size={22} />
                  </button>
                  <button
                    type="button"
                    onClick={deleteAllChats}
                    aria-label="Delete all chats"
                    className="flex h-12 w-12 items-center justify-center rounded-xl border-2 border-transparent text-red-500 transition hover:border-black hover:bg-[#ff8ae2] hover:text-black hover:shadow-[2px_2px_0px_0px_#000]"
                  >
                    <Trash2 size={22} />
                  </button>
                </div>

                {/* Textarea */}
                <textarea
                  {...register('user_query', {
                    required: 'Please enter a message.',
                    validate: (value) => value.trim().length > 0 || 'Message cannot be empty.',
                  })}
                  ref={(element) => {
                    textareaRef.current = element;
                    register('user_query').ref(element);
                  }}
                  rows={1}
                  onInput={handleInput}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask Lily what you want to learn..."
                  className="max-h-50 min-h-12 flex-1 resize-none overflow-y-auto bg-transparent px-3 py-3 text-base font-medium text-black outline-none placeholder:text-neutral-400"
                />

                {/* Send Button */}
                <button
                  type="submit"
                  aria-label="Send message"
                  disabled={isAgentLoading}
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-lime-200 border-2 border-black text-black shadow-[2px_2px_0px_0px_#000] transition-all hover:bg-[#b0e64a] active:translate-y-1 active:shadow-none disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Magicpen size={22} />
                </button>
              </form>

              {/* Helper Text */}
              <div className="mt-4 flex justify-center">
                <p className="text-xs font-bold text-black bg-[#f4f4f0] border-2 border-black px-3 py-1 rounded-full shadow-[2px_2px_0px_0px_#000]">
                  Press Enter to send · Shift + Enter for a new line
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Popup */}
      <SettingsPopupWindow openSetting={openSettings} setSetting={handleSettings} />
    </section>
  );
}
