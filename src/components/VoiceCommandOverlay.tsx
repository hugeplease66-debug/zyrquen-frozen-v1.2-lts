import React from 'react';
import { Mic, MicOff } from 'lucide-react';
import { useVoiceCommand } from '../hooks/useVoiceCommand';
import { ViewType } from '../types';

interface VoiceCommandOverlayProps {
  onNavigate: (view: ViewType) => void;
  onCaptureSnapshot: () => void;
  onNotifyEvent: (type: any, title: string, desc: string, meta?: string, sev?: 'info' | 'warning' | 'critical' | 'success') => void;
}

export const VoiceCommandOverlay: React.FC<VoiceCommandOverlayProps> = ({ onNavigate, onCaptureSnapshot, onNotifyEvent }) => {
  const { isListening, lastCommand, toggleListening } = useVoiceCommand(onNavigate, onCaptureSnapshot, onNotifyEvent);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
      {isListening && (
        <div className="bg-[#070914]/90 border border-cyan-500/30 text-cyan-300 px-4 py-2 rounded-2xl shadow-[0_0_20px_rgba(6,182,212,0.2)] font-mono text-xs flex items-center gap-2 backdrop-blur-xl animate-in fade-in slide-in-from-right-4">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
          </span>
          {lastCommand ? `"${lastCommand}"` : 'Listening for command...'}
        </div>
      )}
      <button
        onClick={toggleListening}
        className={`p-4 rounded-full border-2 transition-all shadow-xl backdrop-blur-xl flex items-center justify-center ${
          isListening 
            ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_30px_rgba(6,182,212,0.4)] animate-pulse'
            : 'bg-[#070914]/80 border-white/10 text-zinc-400 hover:text-white hover:border-cyan-500/40 hover:bg-[#0b0e1e]/90'
        }`}
        title="Voice Command Bridge (Try: 'Open Vault' or 'Capture Snapshot')"
      >
        {isListening ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
      </button>
    </div>
  );
};
