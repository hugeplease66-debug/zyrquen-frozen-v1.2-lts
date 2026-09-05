import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Mic, MicOff, Command } from 'lucide-react';
import { ViewType } from '../types';

interface VoiceCommandBridgeProps {
  onCaptureSnapshot: () => void;
  onSwitchView: (view: ViewType) => void;
}

export const VoiceCommandBridge: React.FC<VoiceCommandBridgeProps> = ({
  onCaptureSnapshot,
  onSwitchView,
}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [lastCommand, setLastCommand] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  const callbacksRef = useRef({ onCaptureSnapshot, onSwitchView });

  useEffect(() => {
    callbacksRef.current = { onCaptureSnapshot, onSwitchView };
  }, [onCaptureSnapshot, onSwitchView]);

  useEffect(() => {
    // @ts-ignore
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn('SpeechRecognition API not supported in this browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = (event: any) => {
      const current = event.resultIndex;
      const resultText = event.results[current][0].transcript.toLowerCase().trim();
      setTranscript(resultText);
      
      // Process Command using latest callbacks
      const text = resultText;
      const cbs = callbacksRef.current;
      
      // Command: Take Snapshot
      if (text.includes('take snapshot') || text.includes('capture snapshot') || text.includes('trigger snapshot')) {
        cbs.onCaptureSnapshot();
        setLastCommand('take snapshot');
        return;
      }

      // Command: Switch View
      const views: Record<string, ViewType> = {
        'dashboard': 'dashboard',
        'executive command': 'dashboard',
        'council': 'council',
        'quantum': 'quantum',
        'nexus': 'nexus',
        'matrix': 'matrix',
        'vault': 'vault',
        'archive': 'archive',
        'forge': 'forge',
        'ledger': 'ledger',
        'pulse': 'pulse',
        'console': 'console',
        'security': 'security',
        'zero trust': 'security',
        'settings': 'settings',
        'production': 'production',
        'readiness': 'production',
        'legal': 'legal',
        'law': 'legal',
        'pdpa': 'legal',
        'statute': 'legal',
        'compliance': 'legal',
      };

      for (const [key, viewName] of Object.entries(views)) {
        if (text.includes(key)) {
          cbs.onSwitchView(viewName);
          setLastCommand(`switch to ${viewName}`);
          return;
        }
      }
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error', event.error);
      if (event.error === 'not-allowed' || event.error === 'network') {
        setIsListening(false);
      }
    };

    recognition.onend = () => {
      if (isListening) {
        try {
          recognition.start();
        } catch(e) {
           // Ignore
        }
      }
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [isListening]);

  const toggleListening = useCallback(() => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current?.start();
        setIsListening(true);
        setLastCommand(null);
        setTranscript('Listening...');
      } catch (err) {
        console.error("Could not start listening", err);
      }
    }
  }, [isListening]);

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={toggleListening}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-xl font-mono text-xs transition-all ${
          isListening 
            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-[0_0_15px_rgba(244,63,94,0.3)] animate-pulse' 
            : 'bg-[#070914]/80 text-cyan-400 border border-cyan-500/20 hover:bg-cyan-500/10'
        }`}
        title="Toggle Voice Commands"
      >
        {isListening ? <Mic className="w-3.5 h-3.5" /> : <MicOff className="w-3.5 h-3.5" />}
        <span className="hidden sm:inline">{isListening ? 'Voice Active' : 'Voice Cmd'}</span>
      </button>

      {isListening && (
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/60 border border-white/10 font-mono text-xs max-w-[200px] overflow-hidden whitespace-nowrap">
          <Command className="w-3.5 h-3.5 text-zinc-400" />
          <span className="text-zinc-300 truncate">
            {lastCommand ? `Cmd: ${lastCommand}` : transcript || 'Listening...'}
          </span>
        </div>
      )}
    </div>
  );
};
