import { useState, useRef, useEffect } from 'react';

const AudioPlayer = ({ audioUrl, onPlay, onEnded, disabled }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(disabled || false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    setHasPlayed(disabled || false);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
  }, [audioUrl, disabled]);

  const handlePlay = () => {
    if (hasPlayed || !audioRef.current) return;
    audioRef.current.play();
    setIsPlaying(true);
    onPlay?.();
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
    setHasPlayed(true);
    onEnded?.();
  };

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
      <audio
        ref={audioRef}
        src={audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleAudioEnded}
        preload="metadata"
      />

      <div className="flex items-center gap-4">
        <button
          onClick={handlePlay}
          disabled={hasPlayed || isPlaying}
          className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center transition-all ${
            hasPlayed
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : isPlaying
              ? 'bg-primary-600 text-white animate-pulse'
              : 'bg-primary-600 text-white hover:bg-primary-700'
          }`}
        >
          {isPlaying ? (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <rect x="5" y="4" width="3" height="12" rx="1" />
              <rect x="12" y="4" width="3" height="12" rx="1" />
            </svg>
          ) : hasPlayed ? (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
            </svg>
          )}
        </button>

        <div className="flex-1">
          <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
            <div
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      </div>

      {hasPlayed && !isPlaying && (
        <p className="text-xs text-gray-400 mt-2 text-center">Audio has been played</p>
      )}
      {!hasPlayed && !isPlaying && (
        <p className="text-xs text-primary-600 mt-2 text-center font-medium">
          Click play to begin. Audio can only be played once.
        </p>
      )}
    </div>
  );
};

export default AudioPlayer;
