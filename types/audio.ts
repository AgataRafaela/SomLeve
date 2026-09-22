export type AudioCategory = 'Todos' | 'Naturais' | 'Ruídos' | 'Ambientes' | 'Favoritos';

export type SoundId =
  | 'rain'
  | 'ocean'
  | 'wind'
  | 'white-noise'
  | 'forest'
  | 'fireplace'
  | 'lullaby'
  | 'baby-room';

export interface SoundDefinition {
  id: SoundId;
  name: string;
  description: string;
  category: Exclude<AudioCategory, 'Todos' | 'Favoritos'>;
  icon: 'rain' | 'wave' | 'wind' | 'noise' | 'forest' | 'fire' | 'moon' | 'heart';
  accent: string;
  defaultVolume: number;
}

export interface ActiveSound extends SoundDefinition {
  volume: number;
  muted: boolean;
}
