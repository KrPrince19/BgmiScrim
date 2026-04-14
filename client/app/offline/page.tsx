import React from 'react';
import Link from 'next/link';

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-[#09090b] flex flex-items-center justify-center p-4">
      <div className="max-w-md w-full bg-[#18181b] border border-[#27272a] rounded-2xl p-8 text-center shadow-2xl">
        <div className="mb-6 flex justify-center text-red-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M1 1l22 22" />
            <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55" />
            <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39" />
            <path d="M10.71 5.05A16 16 0 0 1 22.58 9" />
            <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88" />
            <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
            <path d="M12 20h.01" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-[#fafafa] mb-4">You're Offline</h1>
        <p className="text-[#a1a1aa] mb-8 leading-relaxed">
          It looks like you've lost your connection to the arena. Check your internet settings to get back into the game.
        </p>
        <Link
          href="/"
          className="inline-block w-full py-3 px-6 bg-yellow-500 hover:bg-yellow-600 text-black font-bold rounded-lg transition-colors duration-200"
        >
          Try Again
        </Link>
      </div>
    </div>
  );
}
