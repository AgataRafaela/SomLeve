'use client';

import { Icon } from './Icon';
import { MixRow } from './MixRow';
import { SoftButton } from './SoftButton';
import type { ActiveSound } from '@/types/audio';
import Image from 'next/image'

interface PlayerPanelProps {
  activeSounds: ActiveSound[];
  isPlaying: boolean;
  remainingSeconds: number;
  fadeOutEnabled: boolean;
  onPlayPause: () => void;
  onVolume: (
    id: ActiveSound['id'],
    volume: number,
  ) => void;
  onRemove: (id: ActiveSound['id']) => void;
  onTimer: () => void;
  onFade: () => void;
  onOpenLibrary: () => void;
  onPrevious: () => void;
  onNext: () => void;
}

export function PlayerPanel({
  activeSounds,
  isPlaying,
  remainingSeconds,
  fadeOutEnabled,
  onPlayPause,
  onVolume,
  onRemove,
  onTimer,
  onFade,
  onOpenLibrary,
  onPrevious,
  onNext,
}: PlayerPanelProps) {
  const minutes = Math.floor(
    remainingSeconds / 60,
  )
    .toString()
    .padStart(2, '0');

  const seconds = (
    remainingSeconds % 60
  )
    .toString()
    .padStart(2, '0');

  return (
    <section className="panel player-panel">
      <div className="panel-top-actions">
        <SoftButton
          aria-label="Abrir biblioteca de sons"
          onClick={onOpenLibrary}
        >
          <Icon name="home" size={24} />
        </SoftButton>

        <SoftButton aria-label="Configurações">
          <Icon name="settings" size={23} />
        </SoftButton>
      </div>
      
      <div className="player-image">
        <Image
          src="/bunny-image.png"
          fill 
          style={{ objectFit: 'contain' }} 
          alt="Desenho de um coelho dormindo em cima de nuvens"
        />
      </div>
  
      <div className="player-intro">
        <h1>Hora do Descanso</h1>

        <p>
          Um ambiente sonoro tranquilo para
          <br />
          momentos de relaxamento.
        </p>
      </div>

      <button
        className="timer-bar"
        onClick={onTimer}
      >
        <span className="timer-icon">
          <Icon name="timer" size={24} />
        </span>

        <span>
          <strong>
            {minutes}:{seconds}
          </strong>

          <small>Tempo restante</small>
        </span>

        <Icon name="chevron" size={20} />
      </button>

      <div className="mix-list">
        {activeSounds.length ? (
          activeSounds.map((sound) => (
            <MixRow
              key={sound.id}
              sound={sound}
              onVolume={(volume) =>
                onVolume(sound.id, volume)
              }
              onOptions={() =>
                onRemove(sound.id)
              }
            />
          ))
        ) : (
          <div className="empty-mix">
            Escolha um som na biblioteca
            para começar.
          </div>
        )}
      </div>

      <div className="player-controls">
        <button
          className={`control-button ${
            fadeOutEnabled
              ? 'is-selected'
              : ''
          }`}
          onClick={onFade}
          aria-label="Ativar fade-out"
        >
          <Icon name="moon" size={24} />
          <span>Fade-out</span>
        </button>

        <button
          className="secondary-control"
          onClick={onPrevious}
          aria-label="Som anterior"
        >
          <Icon name="prev" size={23} />
        </button>

        <button
          className="main-play"
          onClick={onPlayPause}
          aria-label={
            isPlaying
              ? 'Pausar'
              : 'Reproduzir'
          }
        >
          <Icon
            name={
              isPlaying
                ? 'pause'
                : 'play'
            }
            size={30}
          />
        </button>

        <button
          className="secondary-control"
          onClick={onNext}
          aria-label="Próximo som"
        >
          <Icon name="next" size={23} />
        </button>

        <button
          className="control-button"
          onClick={onTimer}
          aria-label="Temporizador"
        >
          <Icon name="timer" size={24} />
          <span>Timer</span>
        </button>
      </div>
    </section>
  );
}