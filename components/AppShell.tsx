'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { SOUNDS } from '@/data/sounds';
import { getAudioEngine } from '@/lib/audio';
import type { ActiveSound, SoundId } from '@/types/audio';
import { LibraryPanel } from './LibraryPanel';
import { PlayerPanel } from './PlayerPanel';

const TIMER_OPTIONS = [15, 30, 45, 60];
const FAVORITES_STORAGE_KEY = 'hora-do-descanso:favorites';

export function AppShell() {
  const [activeSounds, setActiveSounds] = useState<ActiveSound[]>([
    SOUNDS[0]
      ? {
          ...SOUNDS[0],
          volume: SOUNDS[0].defaultVolume,
          muted: false,
        }
      : null,
  ].filter(Boolean) as ActiveSound[]);

  const [isPlaying, setIsPlaying] = useState(false);
  const [favorites, setFavorites] = useState<SoundId[]>([]);
  const [remainingSeconds, setRemainingSeconds] = useState(30 * 60);
  const [fadeOutEnabled, setFadeOutEnabled] = useState(false);
  const [timerIndex, setTimerIndex] = useState(1);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);

  const engine = useMemo(() => getAudioEngine(), []);

  useEffect(() => {
    return () => engine.dispose();
  }, [engine]);

  // carrega os favoritos salvos anteriormente
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(FAVORITES_STORAGE_KEY);

      if (!stored) {
        return;
      }

      const parsed: unknown = JSON.parse(stored);

      if (Array.isArray(parsed)) {
        const validIds = new Set(SOUNDS.map((sound) => sound.id));

        const validFavorites = parsed.filter(
          (id): id is SoundId =>
            typeof id === 'string' &&
            validIds.has(id as SoundId),
        );

        setFavorites(validFavorites);
      }
    } catch {
      // mantem os favoritos vazios caso os dados estejam invalidos
    }
  }, []);

  // contador do temporizador
  useEffect(() => {
    if (!isPlaying || remainingSeconds <= 0) {
      return;
    }

    const id = window.setInterval(() => {
      setRemainingSeconds((current) => Math.max(0, current - 1));
    }, 1000);

    return () => window.clearInterval(id);
  }, [isPlaying, remainingSeconds]);

  // quando o temporizador chega a zero
  useEffect(() => {
    if (remainingSeconds !== 0) {
      return;
    }

    engine.stopAll();
    setIsPlaying(false);
  }, [remainingSeconds, engine]);

  const toggleSound = useCallback(
    async (id: SoundId) => {
      const existing = activeSounds.find(
        (sound) => sound.id === id,
      );

      if (existing) {
        engine.stop(id);

        setActiveSounds((current) =>
          current.filter((sound) => sound.id !== id),
        );

        return;
      }

      const definition = SOUNDS.find(
        (sound) => sound.id === id,
      );

      if (!definition) {
        return;
      }

      const next: ActiveSound = {
        ...definition,
        volume: definition.defaultVolume,
        muted: false,
      };

      setActiveSounds((current) => [
        ...current,
        next,
      ]);

      if (isPlaying) {
        await engine.start(id, next.volume);
      }
    },
    [activeSounds, engine, isPlaying],
  );

  const togglePlayback = useCallback(async () => {
    if (!isPlaying) {
      for (const sound of activeSounds) {
        await engine.start(sound.id, sound.volume);
      }

      setIsPlaying(true);
      return;
    }

    engine.stopAll();
    setIsPlaying(false);
  }, [activeSounds, engine, isPlaying]);

  const updateVolume = useCallback(
    (id: SoundId, volume: number) => {
      setActiveSounds((current) =>
        current.map((sound) =>
          sound.id === id
            ? { ...sound, volume }
            : sound,
        ),
      );

      engine.setVolume(id, volume);
    },
    [engine],
  );

  const removeSound = useCallback(
    (id: SoundId) => {
      engine.stop(id);

      setActiveSounds((current) =>
        current.filter((sound) => sound.id !== id),
      );
    },
    [engine],
  );

  // troca para o som anterior ou próximo da biblioteca
  const changePrimarySound = useCallback(
    async (direction: 1 | -1) => {
      const currentId = activeSounds[0]?.id;

      const currentIndex = currentId
        ? SOUNDS.findIndex(
            (sound) => sound.id === currentId,
          )
        : direction === 1
          ? -1
          : 0;

      // Sem som selecionado + anterior = último som.
      if (currentIndex < 0 && direction === -1) {
        const last = SOUNDS[SOUNDS.length - 1];

        const nextSound: ActiveSound = {
          ...last,
          volume: last.defaultVolume,
          muted: false,
        };

        engine.stopAll();
        setActiveSounds([nextSound]);

        if (isPlaying) {
          await engine.start(
            nextSound.id,
            nextSound.volume,
          );
        }

        return;
      }

      const nextIndex =
        (currentIndex + direction + SOUNDS.length) %
        SOUNDS.length;

      const nextDefinition = SOUNDS[nextIndex];

      if (!nextDefinition) {
        return;
      }

      const nextSound: ActiveSound = {
        ...nextDefinition,
        volume: nextDefinition.defaultVolume,
        muted: false,
      };

      engine.stopAll();
      setActiveSounds([nextSound]);

      if (isPlaying) {
        await engine.start(
          nextSound.id,
          nextSound.volume,
        );
      }
    },
    [activeSounds, engine, isPlaying],
  );

  const cycleTimer = useCallback(() => {
    const nextIndex =
      (timerIndex + 1) % TIMER_OPTIONS.length;

    const nextMinutes = TIMER_OPTIONS[nextIndex];

    setTimerIndex(nextIndex);
    setRemainingSeconds(nextMinutes * 60);
  }, [timerIndex]);

  const toggleFade = useCallback(() => {
    setFadeOutEnabled((current) => !current);
  }, []);

  // adiciona e remove favorito e salva imediatamente no navegador
  const toggleFavorite = useCallback((id: SoundId) => {
    setFavorites((current) => {
      const next = current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id];

      try {
        window.localStorage.setItem(
          FAVORITES_STORAGE_KEY,
          JSON.stringify(next),
        );
      } catch {
        //continua funcionando mesmo sem LocalStorage
      }

      return next;
    });
  }, []);

  useEffect(() => {
    if (
      !fadeOutEnabled ||
      !isPlaying ||
      remainingSeconds !== 5 * 60
    ) {
      return;
    }

    void engine.fadeOut(5 * 60);
  }, [
    fadeOutEnabled,
    isPlaying,
    remainingSeconds,
    engine,
  ]);

  return (
    <main className="app-stage">
      <div className="ambient-star ambient-star--one">
        ✦
      </div>

      <div className="ambient-star ambient-star--two">
        ✦
      </div>

      <div className="ambient-star ambient-star--three">
        ★
      </div>

      <div className="ambient-cloud ambient-cloud--left" />
      <div className="ambient-cloud ambient-cloud--right" />

      <div className="app-grid">
        <PlayerPanel
          activeSounds={activeSounds}
          isPlaying={isPlaying}
          remainingSeconds={remainingSeconds}
          fadeOutEnabled={fadeOutEnabled}
          onPlayPause={togglePlayback}
          onVolume={updateVolume}
          onRemove={removeSound}
          onTimer={cycleTimer}
          onFade={toggleFade}
          onOpenLibrary={() =>
            setIsLibraryOpen(true)
          }
          onPrevious={() =>
            void changePrimarySound(-1)
          }
          onNext={() =>
            void changePrimarySound(1)
          }
        />

        <LibraryPanel
          activeSounds={activeSounds}
          favorites={favorites}
          isOpen={isLibraryOpen}
          onClose={() =>
            setIsLibraryOpen(false)
          }
          onToggleFavorite={toggleFavorite}
          onToggleSound={toggleSound}
        />
      </div>
    </main>
  );
}