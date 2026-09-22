import type { SoundDefinition } from '@/types/audio';

export const SOUNDS: SoundDefinition[] = [
  { id: 'rain', name: 'Chuva', description: 'Gotas suaves de chuva.', category: 'Naturais', icon: 'rain', accent: 'lilac', defaultVolume: 0.6 },
  { id: 'ocean', name: 'Ondas do mar', description: 'O som calmo das ondas.', category: 'Naturais', icon: 'wave', accent: 'blue', defaultVolume: 0.3 },
  { id: 'wind', name: 'Vento', description: 'Brisa suave e relaxante.', category: 'Naturais', icon: 'wind', accent: 'mint', defaultVolume: 0.2 },
  { id: 'white-noise', name: 'Ruído branco', description: 'Som contínuo e uniforme.', category: 'Ruídos', icon: 'noise', accent: 'pink', defaultVolume: 0.4 },
  { id: 'forest', name: 'Floresta', description: 'Sons tranquilos da natureza.', category: 'Ambientes', icon: 'forest', accent: 'green', defaultVolume: 0.25 },
  { id: 'fireplace', name: 'Lareira', description: 'O calor aconchegante do fogo.', category: 'Ambientes', icon: 'fire', accent: 'peach', defaultVolume: 0.25 },
  { id: 'lullaby', name: 'Canções de ninar', description: 'Melodias suaves para relaxar.', category: 'Ambientes', icon: 'moon', accent: 'lavender', defaultVolume: 0.3 },
  { id: 'baby-room', name: 'Ambiente do bebê', description: 'Sons suaves e tranquilos.', category: 'Ambientes', icon: 'heart', accent: 'rose', defaultVolume: 0.25 },
];
