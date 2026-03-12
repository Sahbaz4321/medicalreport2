import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, Square, Volume2 } from 'lucide-react';

const VoiceExplanationButton = ({ text }) => {
  const utterRef = useRef(null);
  const [status, setStatus] = useState('idle');
  
  useEffect(() => {
    if (status !== 'idle') {
      window.speechSynthesis?.cancel();
      setStatus('idle');
    }
  }, [text]);

  const ensureSupported = () => {
    if (!window.speechSynthesis) {
      alert('Speech synthesis is not supported in this browser.');
      return false;
    }
    return true;
  };

  const handlePlay = () => {
    if (!ensureSupported()) return;
    if (!text) return;

    if (status === 'paused') {
      window.speechSynthesis.resume();
      setStatus('playing');
      return;
    }

    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 0.9;
    utter.pitch = 1.0;
    utter.volume = 1.0;

    utter.onstart = () => setStatus('playing');
    utter.onend = () => setStatus('idle');
    utter.onerror = () => setStatus('idle');

    utterRef.current = utter;
    window.speechSynthesis.speak(utter);
  };

  const handlePause = () => {
    if (!ensureSupported()) return;
    if (status !== 'playing') return;
    window.speechSynthesis.pause();
    setStatus('paused');
  };

  const handleStop = () => {
    if (!ensureSupported()) return;
    window.speechSynthesis.cancel();
    setStatus('idle');
  };

  return (
    <div className="inline-flex items-center bg-white border border-gray-200 rounded-full shadow-sm p-1">
      <div className="px-3 flex items-center gap-2 border-r border-gray-100">
        <Volume2 className={`w-4 h-4 ${status === 'playing' ? 'text-blue-500 animate-pulse' : 'text-gray-400'}`} />
        <span className="text-sm font-medium text-gray-600 hidden sm:inline-block">Listen</span>
      </div>
      
      <div className="flex items-center px-1 gap-1">
        <button
          onClick={handlePlay}
          disabled={!text || status === 'playing'}
          className={`p-2 rounded-full transition-colors ${status === 'playing' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100 text-gray-600'} disabled:opacity-50`}
          title="Play"
        >
          <Play className="w-4 h-4" />
        </button>
        
        <button
          onClick={handlePause}
          disabled={status !== 'playing'}
          className="p-2 rounded-full hover:bg-gray-100 text-gray-600 disabled:opacity-50 transition-colors"
          title="Pause"
        >
          <Pause className="w-4 h-4" />
        </button>

        <button
          onClick={handleStop}
          disabled={status === 'idle'}
          className="p-2 rounded-full hover:bg-red-50 text-red-500 disabled:opacity-50 transition-colors"
          title="Stop"
        >
          <Square className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default VoiceExplanationButton;
