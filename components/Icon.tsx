'use client';

import type { CSSProperties } from 'react';
import type { SoundDefinition } from '@/types/audio';

export type IconName = SoundDefinition['icon'] | 'home' | 'settings' | 'heart' | 'back' | 'plus' | 'sliders' | 'play' | 'pause' | 'prev' | 'next' | 'moon' | 'timer' | 'star' | 'chevron';

interface IconProps {
  name: IconName;
  size?: number;
  filled?: boolean;
}

export function Icon({ name, size = 24, filled = false }: IconProps) {
  const style: CSSProperties = { width: size, height: size };

  if (name === 'rain') return <span style={style} className="sound-symbol">☁</span>;
  if (name === 'wave') return <span style={style} className="sound-symbol">〰</span>;
  if (name === 'wind') return <span style={style} className="sound-symbol">≋</span>;
  if (name === 'noise') return <span style={style} className="sound-symbol">✿</span>;
  if (name === 'forest') return <span style={style} className="sound-symbol">♠</span>;
  if (name === 'fire') return <span style={style} className="sound-symbol">♨</span>;
  if (name === 'lullaby') return <span style={style} className="sound-symbol">☾</span>;
  if (name === 'baby-room') return <span style={style} className="sound-symbol">♡</span>;

  const common = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.9, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true };

  switch (name) {
    case 'home': return <svg {...common}><path d="m3 10 9-7 9 7"/><path d="M5 9v11h14V9"/><path d="M9 20v-6h6v6"/></svg>;
    case 'settings': return <svg {...common}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.05.05-1.4 1.4-.05-.05a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1.04 1.56V21h-2v-.5a1.7 1.7 0 0 0-1.04-1.56 1.7 1.7 0 0 0-1.88.34l-.05.05-1.4-1.4.05-.05A1.7 1.7 0 0 0 9.4 15a1.7 1.7 0 0 0-1.56-1.04H7v-2h.84A1.7 1.7 0 0 0 9.4 10a1.7 1.7 0 0 0-.34-1.88l-.05-.05 1.4-1.4.05.05a1.7 1.7 0 0 0 1.88.34A1.7 1.7 0 0 0 13.38 5.5V5h2v.5a1.7 1.7 0 0 0 1.04 1.56 1.7 1.7 0 0 0 1.88-.34l.05-.05 1.4 1.4-.05.05A1.7 1.7 0 0 0 19.4 10c.24.63.85 1.04 1.56 1.04H21v2h-.04c-.71 0-1.32.41-1.56 1.04Z"/></svg>;
    case 'heart': return <svg {...common} fill={filled ? 'currentColor' : 'none'}><path d="M20.8 8.8c0 5-8.8 10.2-8.8 10.2S3.2 13.8 3.2 8.8A4.7 4.7 0 0 1 12 6.2a4.7 4.7 0 0 1 8.8 2.6Z"/></svg>;
    case 'back': return <svg {...common}><path d="m15 18-6-6 6-6"/></svg>;
    case 'plus': return <svg {...common}><path d="M12 5v14M5 12h14"/></svg>;
    case 'sliders': return <svg {...common}><path d="M4 7h10M18 7h2M4 12h3M11 12h9M4 17h10M18 17h2"/><circle cx="16" cy="7" r="2"/><circle cx="9" cy="12" r="2"/><circle cx="16" cy="17" r="2"/></svg>;
    case 'play': return <svg {...common} fill="currentColor" stroke="none"><path d="m8 5 11 7-11 7V5Z"/></svg>;
    case 'pause': return <svg {...common} fill="currentColor" stroke="none"><rect x="7" y="5" width="3.5" height="14" rx="1"/><rect x="13.5" y="5" width="3.5" height="14" rx="1"/></svg>;
    case 'prev': return <svg {...common} fill="currentColor" stroke="none"><path d="M7 6h2v12H7zM18 6l-8 6 8 6V6Z"/></svg>;
    case 'next': return <svg {...common} fill="currentColor" stroke="none"><path d="M15 6h2v12h-2zM6 6l8 6-8 6V6Z"/></svg>;
    case 'moon': return <svg {...common}><path d="M20 15.5A8 8 0 0 1 8.5 4 8 8 0 1 0 20 15.5Z"/></svg>;
    case 'timer': return <svg {...common}><circle cx="12" cy="13" r="7"/><path d="M12 9v4l2.5 1.5M9 3h6"/></svg>;
    case 'star': return <svg {...common} fill={filled ? 'currentColor' : 'none'}><path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9L12 3Z"/></svg>;
    case 'chevron': return <svg {...common}><path d="m9 18 6-6-6-6"/></svg>;
  }
}
