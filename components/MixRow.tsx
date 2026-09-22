'use client';

import { Icon } from './Icon';
import type { ActiveSound } from '@/types/audio';

interface MixRowProps {
  sound: ActiveSound;
  onVolume: (volume: number) => void;
  onOptions: () => void;
}

export function MixRow({ sound, onVolume, onOptions }: MixRowProps) {
  return (
    <div className={`mix-row mix-row--${sound.accent}`}>
      <div className="mix-icon"><Icon name={sound.icon} size={27} /></div>
      <div className="mix-content">
        <div className="mix-heading">
          <strong>{sound.name}</strong>
          <span>{Math.round(sound.volume * 100)}%</span>
        </div>
        <input aria-label={`Volume de ${sound.name}`} type="range" min="0" max="1" step="0.01" value={sound.volume} onChange={(e) => onVolume(Number(e.target.value))} />
      </div>
      <button className="mini-control" onClick={onOptions} aria-label={`Opções de ${sound.name}`}><Icon name="sliders" size={22} /></button>
    </div>
  );
}
