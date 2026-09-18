// Audio bus for cross-component reactive audio data (3D instruments, visualizers, custom cursor)

export interface AudioSignal {
  isPlaying: boolean;
  rms: number;
  bass: number;
  mid: number;
  high: number;
  channels: { [key: string]: number };
}

type AudioDataListener = (data: AudioSignal) => void;

class AudioBus {
  private listeners: Set<AudioDataListener> = new Set();
  private currentData: AudioSignal = {
    isPlaying: false,
    rms: 0,
    bass: 0,
    mid: 0,
    high: 0,
    channels: { drums: 0, bass: 0, guitar: 0, vocals: 0 }
  };

  subscribe(listener: AudioDataListener): () => void {
    this.listeners.add(listener);
    listener(this.currentData);
    return () => {
      this.listeners.delete(listener);
    };
  }

  emit(data: Partial<AudioSignal>) {
    this.currentData = { ...this.currentData, ...data };
    this.listeners.forEach(fn => fn(this.currentData));
  }

  getData(): AudioSignal {
    return this.currentData;
  }
}

export const audioBus = new AudioBus();
