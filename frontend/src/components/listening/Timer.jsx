import { useState, useEffect, useRef } from 'react';

const Timer = ({ initialTime, onTick, onTimeUp, onWarning }) => {
  const [timeRemaining, setTimeRemaining] = useState(initialTime);
  const warningShownRef = useRef(false);

  useEffect(() => {
    setTimeRemaining(initialTime);
    warningShownRef.current = false;
  }, [initialTime]);

  useEffect(() => {
    if (timeRemaining <= 0) {
      onTimeUp?.();
      return;
    }

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        const next = prev - 1;
        onTick?.(next);

        if (next === 300 && !warningShownRef.current) {
          warningShownRef.current = true;
          onWarning?.();
        }

        if (next <= 0) {
          clearInterval(interval);
          onTimeUp?.();
          return 0;
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const isWarning = timeRemaining <= 300;
  const isCritical = timeRemaining <= 60;

  return (
    <div
      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-lg font-bold transition-all ${
        isCritical
          ? 'bg-red-100 text-red-700 animate-pulse'
          : isWarning
          ? 'bg-red-50 text-red-600'
          : 'bg-blue-50 text-blue-700'
      }`}
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </span>
    </div>
  );
};

export default Timer;
