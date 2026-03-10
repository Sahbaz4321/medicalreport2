import React, { useEffect, useRef, useState } from 'react';

const VoiceExplanationButton = ({ text }) => {
  const utterRef = useRef(null);
  const [status, setStatus] = useState('idle'); // idle | playing | paused

  useEffect(() => {
    // Stop playback if the text changes (switching reports)
    if (status !== 'idle') {
      window.speechSynthesis?.cancel();
      setStatus('idle');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

    // Resume if paused
    if (status === 'paused') {
      window.speechSynthesis.resume();
      setStatus('playing');
      return;
    }

    // Start fresh
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.onend = () => setStatus('idle');
    utter.onerror = () => setStatus('idle');
    utterRef.current = utter;
    setStatus('playing');
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
    <div className="btn-group btn-group-sm" role="group" aria-label="Voice controls">
      <button type="button" className="btn btn-outline-secondary" onClick={handlePlay}>
        <i className="bi bi-play-fill me-1"></i>
        {status === 'paused' ? 'Resume' : 'Play'}
      </button>
      <button
        type="button"
        className="btn btn-outline-secondary"
        onClick={handlePause}
        disabled={status !== 'playing'}
      >
        <i className="bi bi-pause-fill me-1"></i>
        Pause
      </button>
      <button
        type="button"
        className="btn btn-outline-secondary"
        onClick={handleStop}
        disabled={status === 'idle'}
      >
        <i className="bi bi-stop-fill me-1"></i>
        Stop
      </button>
    </div>
  );
};

export default VoiceExplanationButton;

