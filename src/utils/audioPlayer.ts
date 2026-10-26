/**
 * Synthesizes tranquil bookstore ambiance & page turn sounds via Web Audio API.
 * 100% self-contained, no external MP3 dependencies.
 */

class SoundscapeManager {
  private ctx: AudioContext | null = null;
  private noiseNode: AudioNode | null = null;
  private gainNode: GainNode | null = null;
  private isPlaying: boolean = false;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Play peaceful library & rain ambient soundscape
  public toggleAmbiance(onStateChange?: (playing: boolean) => void): boolean {
    this.initCtx();
    if (!this.ctx) return false;

    if (this.isPlaying) {
      this.stopAmbiance();
      if (onStateChange) onStateChange(false);
      return false;
    } else {
      this.startAmbiance();
      if (onStateChange) onStateChange(true);
      return true;
    }
  }

  private startAmbiance() {
    if (!this.ctx) return;
    this.stopAmbiance();

    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    // Generate soft brown noise (mimics warm rain & cozy quiet room)
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      data[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = data[i];
      data[i] *= 3.5; // Gain compensation
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = buffer;
    whiteNoise.loop = true;

    // Filter to warm deep frequency
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(380, this.ctx.currentTime);

    this.gainNode = this.ctx.createGain();
    this.gainNode.gain.setValueAtTime(0.001, this.ctx.currentTime);
    this.gainNode.gain.exponentialRampToValueAtTime(0.12, this.ctx.currentTime + 1.5);

    whiteNoise.connect(filter);
    filter.connect(this.gainNode);
    this.gainNode.connect(this.ctx.destination);

    whiteNoise.start(0);
    this.noiseNode = whiteNoise;
    this.isPlaying = true;
  }

  public stopAmbiance() {
    if (this.gainNode && this.ctx) {
      this.gainNode.gain.linearRampToValueAtTime(0.0001, this.ctx.currentTime + 0.5);
      setTimeout(() => {
        try {
          if (this.noiseNode && 'stop' in this.noiseNode) {
            (this.noiseNode as AudioBufferSourceNode).stop();
          }
        } catch {
          // Ignore if already stopped
        }
        this.noiseNode = null;
      }, 500);
    }
    this.isPlaying = false;
  }

  // Play a crisp paper page flip sound
  public playPageTurn() {
    try {
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      // Quick swoosh
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(140, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(45, this.ctx.currentTime + 0.15);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1200, this.ctx.currentTime);
      filter.Q.setValueAtTime(1.5, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.18, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.18);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.2);
    } catch {
      // Audio might be muted
    }
  }

  public getStatus() {
    return this.isPlaying;
  }
}

export const soundscape = new SoundscapeManager();
