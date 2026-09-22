'use client';

import { Icon } from './Icon';
import type { ActiveSound, SoundDefinition } from '@/types/audio';

interface SoundCardProps {
  sound: SoundDefinition;
  active?: ActiveSound;
  favorite: boolean;
  onToggleFavorite: () => void;
  onToggle: () => void;
}

export function SoundCard({ sound, active, favorite, onToggleFavorite, onToggle }: SoundCardProps) {
  const isActive = Boolean(active);
  return (
    <article className={`sound-card sound-card--${sound.accent} ${isActive ? 'is-active' : ''}`}>
      <div className="sound-icon"><Icon name={sound.icon} size={31} /></div>
      <div className="sound-copy">
        <h3>{sound.name}</h3>
        <p>{sound.description}</p>
      </div>
      <button className="icon-action" onClick={onToggleFavorite} aria-label={favorite ? `Remover ${sound.name} dos favoritos` : `Adicionar ${sound.name} aos favoritos`}>
        <Icon name="heart" filled={favorite} size={22} />
      </button>
      <button className="add-button" onClick={onToggle} aria-label={isActive ? `Remover ${sound.name}` : `Adicionar ${sound.name}`}>
        <Icon name={isActive ? 'pause' : 'plus'} size={23} />
      </button>
    </article>
  );
}
