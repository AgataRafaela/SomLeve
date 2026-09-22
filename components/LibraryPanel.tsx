'use client';

import { useMemo, useState } from 'react';
import { SOUNDS } from '@/data/sounds';
import { Icon } from './Icon';
import { SoundCard } from './SoundCard';
import type {
  ActiveSound,
  AudioCategory,
} from '@/types/audio';

const categories: AudioCategory[] = [
  'Todos',
  'Naturais',
  'Ruídos',
  'Ambientes',
  'Favoritos',
];

interface LibraryPanelProps {
  activeSounds: ActiveSound[];
  favorites: string[];
  isOpen: boolean;
  onClose: () => void;
  onToggleFavorite: (
    id: ActiveSound['id'],
  ) => void;
  onToggleSound: (
    id: ActiveSound['id'],
  ) => void;
}

export function LibraryPanel({
  activeSounds,
  favorites,
  isOpen,
  onClose,
  onToggleFavorite,
  onToggleSound,
}: LibraryPanelProps) {
  const [category, setCategory] =
    useState<AudioCategory>('Todos');

  const visibleSounds = useMemo(() => {
    if (category === 'Todos') {
      return SOUNDS;
    }

    if (category === 'Favoritos') {
      return SOUNDS.filter((sound) =>
        favorites.includes(sound.id),
      );
    }

    return SOUNDS.filter(
      (sound) =>
        sound.category === category,
    );
  }, [category, favorites]);

  return (
    <section
      className={`panel library-panel ${
        isOpen
          ? 'is-mobile-open'
          : ''
      }`}
    >
      <div className="library-header">
        <button
          className="round-nav"
          onClick={onClose}
          aria-label="Voltar para o player"
        >
          <Icon
            name="back"
            size={25}
          />
        </button>

        <div>
          <h2>Biblioteca de Sons</h2>

          <p>
            Escolha seus sons favoritos
            ou combine
            <br />
            para criar o ambiente ideal.
          </p>
        </div>

        <button
          className="round-nav"
          onClick={() =>
            setCategory('Favoritos')
          }
          aria-label="Mostrar favoritos"
        >
          <Icon
            name="heart"
            filled={
              category === 'Favoritos'
            }
            size={23}
          />
        </button>
      </div>

      <div
        className="category-tabs"
        role="tablist"
        aria-label="Categorias de sons"
      >
        {categories.map((item) => (
          <button
            key={item}
            className={
              category === item
                ? 'active'
                : ''
            }
            onClick={() =>
              setCategory(item)
            }
          >
            {item}
          </button>
        ))}
      </div>

      <div className="sound-list">
        {visibleSounds.map((sound) => (
          <SoundCard
            key={sound.id}
            sound={sound}
            active={activeSounds.find(
              (item) =>
                item.id === sound.id,
            )}
            favorite={favorites.includes(
              sound.id,
            )}
            onToggleFavorite={() =>
              onToggleFavorite(
                sound.id,
              )
            }
            onToggle={() =>
              onToggleSound(sound.id)
            }
          />
        ))}

        {!visibleSounds.length && (
          <div className="empty-library">
            Você ainda não adicionou
            sons aos favoritos.
          </div>
        )}
      </div>

      <div className="safety-tip">
        <div className="tip-star">
          <Icon
            name="star"
            filled
            size={22}
          />
        </div>

        <div>
          <strong>Dica de uso</strong>

          <p>
            Mantenha o volume em um nível
            confortável
            <br />
            e nunca deixe o dispositivo
            muito perto do bebê.
          </p>
        </div>

        <Icon
          name="chevron"
          size={18}
        />
      </div>
    </section>
  );
}
