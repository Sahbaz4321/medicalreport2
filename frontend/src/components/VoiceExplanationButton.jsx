import React, { useEffect, useRef, useState } from 'react';

const VoiceExplanationButton = ({ text }) => {
  const utterRef = useRef(null);
  const [status, setStatus] = useState('idle'); // idle | playing | paused
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const progressIntervalRef = useRef(null);

  useEffect(() => {
    // Stop playback if the text changes (switching reports)
    if (status !== 'idle') {
      window.speechSynthesis?.cancel();
      setStatus('idle');
      setProgress(0);
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
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

  const startProgressTracking = () => {
    // Simple progress simulation (actual duration tracking is complex)
    const estimatedDuration = Math.max(2000, (text?.length || 0) * 50); // Estimate based on text length
    setDuration(estimatedDuration);
    setProgress(0);
    
    let startTime = Date.now();
    progressIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progressPercent = Math.min((elapsed / estimatedDuration) * 100, 100);
      setProgress(progressPercent);
      
      if (progressPercent >= 100) {
        clearInterval(progressIntervalRef.current);
      }
    }, 100);
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
    utter.rate = 0.9; // Slightly slower for medical content
    utter.pitch = 1.0;
    utter.volume = 1.0;
    
    utter.onstart = () => {
      setStatus('playing');
      startProgressTracking();
    };
    
    utter.onend = () => {
      setStatus('idle');
      setProgress(100);
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
      setTimeout(() => setProgress(0), 1000);
    };
    
    utter.onerror = () => {
      setStatus('idle');
      setProgress(0);
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
    
    utterRef.current = utter;
    window.speechSynthesis.speak(utter);
  };

  const handlePause = () => {
    if (!ensureSupported()) return;
    if (status !== 'playing') return;
    window.speechSynthesis.pause();
    setStatus('paused');
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }
  };

  const handleStop = () => {
    if (!ensureSupported()) return;
    window.speechSynthesis.cancel();
    setStatus('idle');
    setProgress(0);
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }
  };

  return (
    <div className="voice-controls">
      <div className="d-flex align-items-center gap-2">
        <div className="btn-group btn-group-sm" role="group" aria-label="Voice controls">
          <button 
            type="button" 
            className={`btn ${
              status === 'playing' 
                ? 'btn-success' 
                : status === 'paused'
                  ? 'btn-warning'
                  : 'btn-primary'
            } rounded-pill px-3`}
            onClick={handlePlay}
            disabled={!text}
          >
            <i className={`bi ${
              status === 'paused' ? 'bi-play-fill' : 'bi-play-fill'
            } me-1`}></i>
            {status === 'paused' ? 'Resume' : 'Play'}
          </button>
          <button
            type="button"
            className="btn btn-outline-secondary rounded-pill px-3"
            onClick={handlePause}
            disabled={status !== 'playing'}
          >
            <i className="bi bi-pause-fill me-1"></i>
            Pause
          </button>
          <button
            type="button"
            className="btn btn-outline-danger rounded-pill px-3"
            onClick={handleStop}
            disabled={status === 'idle'}
          >
            <i className="bi bi-stop-fill me-1"></i>
            Stop
          </button>
        </div>
        
        {/* Status indicator */}
        <div className="d-flex align-items-center gap-2">
          {status === 'playing' && (
            <div className="d-flex align-items-center">
              <div className="spinner-border spinner-border-sm text-success me-2" role="status">
                <span className="visually-hidden">Playing...</span>
              </div>
              <span className="badge bg-success bg-opacity-10 text-success rounded-pill px-2 py-1">
                <i className="bi bi-volume-up-fill me-1"></i>
                Playing
              </span>
            </div>
          )}
          {status === 'paused' && (
            <span className="badge bg-warning bg-opacity-10 text-warning rounded-pill px-2 py-1">
              <i className="bi bi-pause-fill me-1"></i>
              Paused
            </span>
          )}
        </div>
      </div>
      
      {/* Progress bar */}
      {(status === 'playing' || status === 'paused' || progress > 0) && (
        <div className="mt-2">
          <div className="progress" style={{height: '6px'}}>
            <div 
              className={`progress-bar ${
                status === 'playing' 
                  ? 'bg-success' 
                  : status === 'paused'
                    ? 'bg-warning'
                    : 'bg-primary'
              }`}
              style={{ width: `${progress}%` }}
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              {progress > 5 && `${Math.round(progress)}%`}
            </div>
          </div>
          <div className="d-flex justify-content-between mt-1">
            <small className="text-muted">
              {status === 'playing' ? 'Reading AI explanation...' : status === 'paused' ? 'Paused' : 'Ready'}
            </small>
            <small className="text-muted">
              {text ? `${Math.round(text.length / 5)} words` : 'No text'}
            </small>
          </div>
        </div>
      )}
    </div>
  );
};

export default VoiceExplanationButton;

