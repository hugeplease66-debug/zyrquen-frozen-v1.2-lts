'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Sparkles, Sliders, Radio } from 'lucide-react';

interface AmbientAudioSynthProps {
  entropy?: number; // 0.001 to 0.009
  coherence?: number; // 99.98 to 99.999
}

export default function AmbientAudioSynth({
  entropy = 0.0019,
  coherence = 99.992
}: AmbientAudioSynthProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.15);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const osc1Ref = useRef<OscillatorNode | null>(null);
  const osc2Ref = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  const startAudio = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(volume, ctx.currentTime);
      masterGain.connect(ctx.destination);
      gainNodeRef.current = masterGain;

      // Base carrier tone (harmonic fundamental 108 Hz + modulation)
      const baseFreq = 108 + (entropy * 5000);
      const osc1 = ctx.createOscillator();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(baseFreq, ctx.currentTime);

      // Second harmonic overtone (sub-harmonic)
      const osc2 = ctx.createOscillator();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(baseFreq * 1.5, ctx.currentTime);

      const osc2Gain = ctx.createGain();
      osc2Gain.gain.setValueAtTime(0.25, ctx.currentTime);
      osc2.connect(osc2Gain);
      osc2Gain.connect(masterGain);
      osc1.connect(masterGain);

      osc1.start();
      osc2.start();

      osc1Ref.current = osc1;
      osc2Ref.current = osc2;
      setIsPlaying(true);
    } catch {
      // Audio context might be restricted before user gesture
    }
  };

  const stopAudio = () => {
    if (osc1Ref.current) osc1Ref.current.stop();
    if (osc2Ref.current) osc2Ref.current.stop();
    if (audioCtxRef.current) audioCtxRef.current.close();
    audioCtxRef.current = null;
    osc1Ref.current = null;
    osc2Ref.current = null;
    setIsPlaying(false);
  };

  // Modulate frequency based on entropy changes
  useEffect(() => {
    if (osc1Ref.current && audioCtxRef.current) {
      const baseFreq = 108 + (entropy * 5000);
      osc1Ref.current.frequency.setTargetAtTime(baseFreq, audioCtxRef.current.currentTime, 0.5);
      if (osc2Ref.current) {
        osc2Ref.current.frequency.setTargetAtTime(baseFreq * 1.5, audioCtxRef.current.currentTime, 0.5);
      }
    }
  }, [entropy]);

  // Adjust volume
  useEffect(() => {
    if (gainNodeRef.current && audioCtxRef.current) {
      gainNodeRef.current.gain.setTargetAtTime(isPlaying ? volume : 0, audioCtxRef.current.currentTime, 0.1);
    }
  }, [volume, isPlaying]);

  return (
    <div className="flex items-center gap-2 bg-[#0a1224]/80 border border-cyan-500/30 px-3 py-1.5 rounded-xl font-mono text-xs backdrop-blur-md">
      <button
        onClick={isPlaying ? stopAudio : startAudio}
        className={`flex items-center gap-1.5 transition cursor-pointer ${
          isPlaying ? 'text-cyan-300 font-bold' : 'text-slate-400 hover:text-slate-200'
        }`}
        title={isPlaying ? "Mute Atmospheric Sound Generator" : "Play Cybernetic Ambient Sound"}
      >
        {isPlaying ? (
          <>
            <Volume2 className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span className="text-[10px] hidden sm:inline">AMBIENT SYNTH ON</span>
          </>
        ) : (
          <>
            <VolumeX className="w-4 h-4 text-slate-500" />
            <span className="text-[10px] hidden sm:inline">AMBIENT SOUND</span>
          </>
        )}
      </button>

      {isPlaying && (
        <div className="flex items-center gap-1.5 ml-1 border-l border-slate-800 pl-2">
          <input
            type="range"
            min="0.02"
            max="0.4"
            step="0.01"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-14 sm:w-20 h-1 accent-cyan-400 rounded cursor-pointer"
            title="Volume"
          />
          <span className="text-[9px] text-slate-500">{Math.round(volume * 100)}%</span>
        </div>
      )}
    </div>
  );
}
