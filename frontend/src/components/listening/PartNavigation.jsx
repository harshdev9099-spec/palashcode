const PART_LABELS = {
  1: 'Part 1',
  2: 'Part 2',
  3: 'Part 3',
  4: 'Part 4',
};

const PART_SUBTITLES = {
  1: 'Form Completion',
  2: 'Map / Diagram',
  3: 'Multiple Choice',
  4: 'Notes Completion',
};

const PartNavigation = ({ currentPart, partsUnlocked, onPartChange }) => {
  return (
    <div className="flex gap-1 sm:gap-2">
      {[1, 2, 3, 4].map((partNum) => {
        const isActive = currentPart === partNum;
        const isUnlocked = partsUnlocked[partNum];

        return (
          <button
            key={partNum}
            onClick={() => isUnlocked && onPartChange(partNum)}
            disabled={!isUnlocked}
            className={`relative flex-1 px-2 sm:px-4 py-2 rounded-lg text-center transition-all ${
              isActive
                ? 'bg-primary-600 text-white shadow-md'
                : isUnlocked
                ? 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
            }`}
            title={!isUnlocked ? 'Complete the previous part to unlock' : ''}
          >
            <span className="text-xs sm:text-sm font-bold block">{PART_LABELS[partNum]}</span>
            <span className={`text-[10px] sm:text-xs block ${isActive ? 'text-blue-100' : 'text-gray-400'}`}>
              {PART_SUBTITLES[partNum]}
            </span>
            {!isUnlocked && (
              <span className="absolute -top-1 -right-1 bg-gray-400 text-white rounded-full w-4 h-4 flex items-center justify-center">
                <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default PartNavigation;
