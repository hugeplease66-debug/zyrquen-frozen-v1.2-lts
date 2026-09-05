// Sovereign Web Audio Synthesizer Engine for ZYRQUEN Ω∞ / MAEW Ω∞
// Generates purely synthesized sounds (No external audio file dependencies)

class SovereignAudioEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtxClass) {
        this.ctx = new AudioCtxClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  // 1. Moo Sound (เสียงมอ 🐃 - Signature Sovereign Bovine Harmonic)
  public playMooSound() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      // Formant filtering for low "Moo" resonance
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(350, now);
      filter.frequency.exponentialRampToValueAtTime(180, now + 1.2);
      filter.Q.setValueAtTime(4, now);

      // Pitch contour starting at ~140Hz sliding down to ~95Hz with subtle vibrato
      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(145, now);
      osc1.frequency.linearRampToValueAtTime(130, now + 0.3);
      osc1.frequency.exponentialRampToValueAtTime(95, now + 1.2);

      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(142, now);
      osc2.frequency.exponentialRampToValueAtTime(92, now + 1.2);

      // Gain Envelope
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.35, now + 0.15);
      gain.gain.exponentialRampToValueAtTime(0.2, now + 0.8);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.25);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 1.3);
      osc2.stop(now + 1.3);
    } catch (e) {
      console.warn('Audio synthesis warning:', e);
    }
  }

  // 2. Quantum Seal Ping (เสียงปิดผนึกบล็อกแคนอนิคัล ⚡)
  public playQuantumPing() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now); // A5
      osc.frequency.exponentialRampToValueAtTime(1760, now + 0.08); // A6
      osc.frequency.exponentialRampToValueAtTime(440, now + 0.35); // A4

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.45);
    } catch (e) {
      console.warn('Audio synthesis warning:', e);
    }
  }

  // 3. Sentinel Siren (เสียงเตือนภัยระบบกักกัน 85°C 🚨)
  public playSirenSound() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      // Dual-tone wobble
      osc.frequency.setValueAtTime(650, now);
      osc.frequency.linearRampToValueAtTime(950, now + 0.2);
      osc.frequency.linearRampToValueAtTime(650, now + 0.4);
      osc.frequency.linearRampToValueAtTime(950, now + 0.6);
      osc.frequency.linearRampToValueAtTime(650, now + 0.8);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.85);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.9);
    } catch (e) {
      console.warn('Audio synthesis warning:', e);
    }
  }

  // 4. HSM Quorum Deca-Seal Chime (เสียงสภา 10/10 อนุมัติ 🏛️)
  public playQuorumChime() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const frequencies = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 (Major Chord)
      const now = this.ctx.currentTime;

      frequencies.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.05);

        gain.gain.setValueAtTime(0.001, now + idx * 0.05);
        gain.gain.linearRampToValueAtTime(0.12, now + idx * 0.05 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + 0.6);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + idx * 0.05);
        osc.stop(now + idx * 0.05 + 0.65);
      });
    } catch (e) {
      console.warn('Audio synthesis warning:', e);
    }
  }
}

export const soundEngine = new SovereignAudioEngine();
