import './Loader.css';
import { useEffect, useState } from 'react';

export default function AgentLoader() {
  const [messageIndex, setMessageIndex] = useState(0);

  const loadingMessages = [
    'wait for a second...',
    'Understanding your topic...',
    'Optimizing your search...',
    'Finding relevant resources...',
    'Analyzing the resources...',
    'Organizing the best results...',
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev < loadingMessages.length - 1 ? prev + 1 : prev));
    }, 1800);

    return () => clearInterval(interval);
  }, [loadingMessages.length]);

  return (
    <div className="rounded-2xl p-5">
      <div className="flex items-center gap-3">
        <Loader />
        <p className="text-sm text-black/60 transition-opacity duration-300">
          {loadingMessages[messageIndex]}
        </p>
      </div>
    </div>
  );
}

function Loader() {
  return (
    <div className="loadingspinner">
      <div id="square1"></div>
      <div id="square2"></div>
      <div id="square3"></div>
      <div id="square4"></div>
      <div id="square5"></div>
    </div>
  );
}
