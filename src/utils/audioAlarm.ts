/**
 * Web Audio API based industrial siren and alert chime synthesizer.
 * Operates without external media files and handles audio context initialization cleanly.
 */

class AudioAlarmSystem {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private currentSirenOsc: OscillatorNode | null = null;
  private sirenInterval: number | null = null;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted) {
      this.stopContinuousSiren();
    }
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  /**
   * High-priority dual-frequency warble siren for Fire & Smoke critical alerts
   */
  public playCriticalSiren() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 1.2);

      // Frequency modulation for European / Industrial warning siren
      osc.frequency.setValueAtTime(880, this.ctx.currentTime); // A5
      osc.frequency.linearRampToValueAtTime(587.33, this.ctx.currentTime + 0.3); // D5
      osc.frequency.linearRampToValueAtTime(880, this.ctx.currentTime + 0.6);
      osc.frequency.linearRampToValueAtTime(587.33, this.ctx.currentTime + 0.9);
      osc.frequency.linearRampToValueAtTime(440, this.ctx.currentTime + 1.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 1.25);
    } catch {
      // Audio playback silently suppressed if blocked by browser policy
    }
  }

  /**
   * Double chime for PPE violation warning
   */
  public playWarningChime() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();

      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(520, now);
      gain1.gain.setValueAtTime(0.15, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc1.connect(gain1);
      gain1.connect(this.ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.25);

      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(780, now + 0.15);
      gain2.gain.setValueAtTime(0.15, now + 0.15);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

      osc2.connect(gain2);
      gain2.connect(this.ctx.destination);
      osc2.start(now + 0.15);
      osc2.stop(now + 0.45);
    } catch {
      // Audio playback safely handled
    }
  }

  /**
   * Positive acknowledgement tone
   */
  public playAckChime() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.18);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.22);
    } catch {
      // Ignore
    }
  }

  public stopContinuousSiren() {
    if (this.sirenInterval) {
      clearInterval(this.sirenInterval);
      this.sirenInterval = null;
    }
    if (this.currentSirenOsc) {
      try {
        this.currentSirenOsc.stop();
        this.currentSirenOsc.disconnect();
      } catch {
        // Safe disconnect
      }
      this.currentSirenOsc = null;
    }
  }
}

export const audioAlarm = new AudioAlarmSystem();
