import type { SoundId } from '@/types/audio';

type SoundNodes = { source: AudioBufferSourceNode; gain: GainNode };
const BUFFER_SECONDS = 8;

export class AudioEngine {
  private context: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private nodes = new Map<SoundId, SoundNodes>();

  private getContext(): AudioContext {
    if (!this.context) {
      const AudioContextClass = window.AudioContext ||
        (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) throw new Error('Web Audio API não é suportada neste navegador.');
      this.context = new AudioContextClass();
      this.masterGain = new GainNode(this.context, { gain: 0.9 });
      this.masterGain.connect(this.context.destination);
    }
    return this.context;
  }

  private async resume() {
    const context = this.getContext();
    if (context.state === 'suspended') await context.resume();
    return context;
  }

  async start(soundId: SoundId, volume: number): Promise<void> {
    if (this.nodes.has(soundId)) { this.setVolume(soundId, volume); return; }
    const context = await this.resume();
    const buffer = this.createSoundBuffer(context, soundId);
    const source = new AudioBufferSourceNode(context, { buffer, loop: true });
    const gain = new GainNode(context, { gain: 0 });
    source.connect(gain).connect(this.masterGain!);
    source.start();
    const now = context.currentTime;
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(Math.max(volume, 0.0001), now + 0.35);
    this.nodes.set(soundId, { source, gain });
  }

  stop(soundId: SoundId): void {
    const node = this.nodes.get(soundId);
    if (!node || !this.context) return;
    const now = this.context.currentTime;
    node.gain.gain.cancelScheduledValues(now);
    node.gain.gain.setValueAtTime(Math.max(node.gain.gain.value, 0.0001), now);
    node.gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);
    node.source.stop(now + 0.21);
    this.nodes.delete(soundId);
  }

  setVolume(soundId: SoundId, volume: number): void {
    const node = this.nodes.get(soundId);
    if (!node || !this.context) return;
    const now = this.context.currentTime;
    node.gain.gain.cancelScheduledValues(now);
    node.gain.gain.setTargetAtTime(Math.max(volume, 0.0001), now, 0.04);
  }

  async fadeOut(seconds: number): Promise<void> {
    if (!this.context || !this.masterGain) return;
    const now = this.context.currentTime;
    this.masterGain.gain.cancelScheduledValues(now);
    this.masterGain.gain.setValueAtTime(Math.max(this.masterGain.gain.value, 0.0001), now);
    this.masterGain.gain.exponentialRampToValueAtTime(0.0001, now + seconds);
    window.setTimeout(() => {
      this.stopAll();
      if (this.masterGain && this.context) this.masterGain.gain.setValueAtTime(0.9, this.context.currentTime);
    }, seconds * 1000);
  }

  stopAll(): void { for (const id of [...this.nodes.keys()]) this.stop(id); }
  dispose(): void { this.stopAll(); void this.context?.close(); this.context = null; this.masterGain = null; }

  private createSoundBuffer(context: AudioContext, soundId: SoundId): AudioBuffer {
    const sampleRate = context.sampleRate;
    const length = sampleRate * BUFFER_SECONDS;
    const buffer = context.createBuffer(1, length, sampleRate);
    const data = buffer.getChannelData(0);
    switch (soundId) {
      case 'white-noise': this.fillWhiteNoise(data); break;
      case 'rain': this.fillRain(data); break;
      case 'ocean': this.fillOcean(data); break;
      case 'wind': this.fillBrownNoise(data); break;
      case 'forest': this.fillForest(data); break;
      case 'fireplace': this.fillFireplace(data); break;
      case 'lullaby': this.fillLullaby(data, sampleRate); break;
      case 'baby-room': this.fillBabyRoom(data, sampleRate); break;
    }
    return buffer;
  }

  private fillWhiteNoise(data: Float32Array) { for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1; }

  private fillBrownNoise(data: Float32Array) {
    let last = 0;
    for (let i = 0; i < data.length; i++) { const white = Math.random() * 2 - 1; last = (last + 0.025 * white) / 1.025; data[i] = last * 3.5; }
  }

  private fillRain(data: Float32Array) {
    let last = 0;
    for (let i = 0; i < data.length; i++) { const white = Math.random() * 2 - 1; last = 0.75 * last + 0.25 * white; const drop = Math.random() < 0.0018 ? (Math.random() * 2 - 1) * 0.9 : 0; data[i] = last * 0.55 + drop; }
  }

  private fillOcean(data: Float32Array) {
    let slow = 0;
    for (let i = 0; i < data.length; i++) { const t = i / data.length; const wave = Math.sin(t * Math.PI * 6) * 0.18; slow = slow * 0.998 + (Math.random() * 2 - 1) * 0.002; const swell = Math.max(0, Math.sin(t * Math.PI * 2 - 0.7)) ** 2; data[i] = (wave + slow * 4 + (Math.random() * 2 - 1) * 0.12) * (0.3 + swell); }
  }

  private fillForest(data: Float32Array) {
    this.fillBrownNoise(data);
    for (let i = 0; i < data.length; i++) { const t = i / data.length; const bird = Math.sin(2 * Math.PI * (880 + 300 * Math.sin(t * Math.PI * 2)) * t) * 0.05; data[i] = data[i] * 0.25 + bird * (Math.sin(t * Math.PI * 10) ** 16); }
  }

  private fillFireplace(data: Float32Array) {
    for (let i = 0; i < data.length; i++) { const crackle = Math.random() < 0.0025 ? (Math.random() * 2 - 1) : 0; const low = Math.sin((i / data.length) * Math.PI * 18) * 0.03; data[i] = crackle + low + (Math.random() * 2 - 1) * 0.015; }
  }

  private fillLullaby(data: Float32Array, sampleRate: number) {
    const notes = [261.63, 329.63, 392, 329.63, 293.66, 349.23, 440, 349.23];
    const noteLength = sampleRate;
    for (let i = 0; i < data.length; i++) { const noteIndex = Math.floor(i / noteLength) % notes.length; const local = (i % noteLength) / noteLength; const envelope = Math.sin(Math.PI * Math.min(local, 1 - local)) ** 2; data[i] = Math.sin((2 * Math.PI * notes[noteIndex] * i) / sampleRate) * envelope * 0.14; }
  }

  private fillBabyRoom(data: Float32Array, sampleRate: number) {
    let brown = 0;
    for (let i = 0; i < data.length; i++) { brown = brown * 0.995 + (Math.random() * 2 - 1) * 0.005; const tone = Math.sin((2 * Math.PI * 174 * i) / sampleRate) * 0.018; data[i] = brown * 0.55 + tone; }
  }
}
