const QuestionTracker = ({ questions, answers, onQuestionClick, startNumber = 1 }) => {
  return (
    <div className="flex flex-wrap gap-1.5">
      {questions.map((q, i) => {
        const qNum = q.question_number || (startNumber + i);
        const isAnswered = answers[qNum] && answers[qNum].toString().trim() !== '';

        return (
          <button
            key={qNum}
            onClick={() => onQuestionClick?.(qNum)}
            className={`w-8 h-8 rounded-full text-xs font-bold flex items-center justify-center transition-all ${
              isAnswered
                ? 'bg-green-500 text-white'
                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
            }`}
            title={`Question ${qNum}${isAnswered ? ' (answered)' : ' (unanswered)'}`}
          >
            {qNum}
          </button>
        );
      })}
    </div>
  );
};

export default QuestionTracker;
