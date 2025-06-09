'use client';

import dynamic from 'next/dynamic';

// Dynamically import LottiePlayer to prevent SSR issues
const LottiePlayer = dynamic(() => import('react-lottie-player').then(mod => mod.default), {
  ssr: false
});

export default function LottieBg({
  json,
  className = '',
}: {
  json: object;
  className?: string;
}) {
  return (
    <LottiePlayer
      loop
      play
      animationData={json}
      className={`absolute inset-0 w-full h-full object-cover pointer-events-none ${className}`}
    />
  );
}