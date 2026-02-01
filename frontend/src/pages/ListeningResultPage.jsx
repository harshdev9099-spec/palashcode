import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import listeningService from '../services/listeningService';
import { toast } from 'react-toastify';

const TEXT_BASED_TYPES = ['fill_blank', 'sentence_completion', 'table_completion'];

const QUESTION_TYPE_LABELS = {
  mcq: 'Multiple Choice',
  fill_blank: 'Form / Note Completion',
  sentence_completion: 'Sentence Completion',
  matching: 'Matching Information',
  table_completion: 'Table / Flow-chart Completion',
  map_labeling: 'Map / Diagram Labeling',
};

const ListeningResultPage = () => {
  const { id, attemptId } = useParams();
  const [attempt, setAttempt] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadAttempt(); }, [attemptId]);

  const loadAttempt = async () => {
    try {
      const response = await listeningService.getAttempt(attemptId);
      setAttempt(response.data.attempt);
    } catch (error) {
      toast.error('Failed to load result');
    } finally {
      setLoading(false);
    }
  };

  const getBandBg = (band) => {
    if (band >= 7) return 'from-green-400 to-green-600';
    if (band >= 5.5) return 'from-yellow-400 to-yellow-600';
    return 'from-red-400 to-red-600';
  };

  const checkAnswer = (q, userAnswer) => {
    if (!userAnswer) return false;
    const type = q.question_type || 'mcq';
    if (TEXT_BASED_TYPES.includes(type)) {
      return userAnswer.trim().toLowerCase() === q.correct_answer.trim().toLowerCase();
    }
    return userAnswer.toLowerCase() === q.correct_answer.toLowerCase();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-golden-50 to-primary-100 py-12">
        <div className="max-w-4xl mx-auto px-4 flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        </div>
      </div>
    );
  }

  if (!attempt) return null;

  const hasParts = attempt.test?.parts?.length > 0;
  const allQuestions = hasParts
    ? attempt.test.parts.flatMap((p) => p.questions || [])
    : attempt.test?.questions || [];
  const totalQuestions = allQuestions.length || 40;

  // Part-wise stats
  const partStats = hasParts
    ? attempt.test.parts.map((part) => {
        const qs = part.questions || [];
        const correct = qs.filter((q) => checkAnswer(q, attempt.answers?.[q.question_number])).length;
        return { partNumber: part.part_number, title: part.title, total: qs.length, correct };
      })
    : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-golden-50 to-primary-100 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Score Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 text-center">
          <h1 className="text-2xl font-heading font-bold text-gray-800 mb-2">{attempt.test?.title}</h1>
          <p className="text-gray-500 mb-6">Completed on {new Date(attempt.submitted_at || attempt.created_at).toLocaleString()}</p>

          <div className={`inline-block bg-gradient-to-r ${getBandBg(attempt.band_score)} rounded-full px-8 py-4 mb-6`}>
            <p className="text-white text-sm font-medium">Band Score</p>
            <p className="text-white text-5xl font-display font-bold">{attempt.band_score}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto mb-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500">Correct Answers</p>
              <p className="text-2xl font-bold text-green-600">{attempt.correct_count}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-500">Total Questions</p>
              <p className="text-2xl font-bold text-gray-700">{totalQuestions}</p>
            </div>
          </div>

          {/* Part-wise breakdown */}
          {partStats.length > 0 && (
            <div className="grid grid-cols-4 gap-2 max-w-lg mx-auto mb-6">
              {partStats.map((ps) => (
                <div key={ps.partNumber} className="bg-gray-50 rounded-lg p-3 text-center">
                  <p className="text-xs text-gray-500 mb-1">Part {ps.partNumber}</p>
                  <p className="text-lg font-bold text-gray-700">{ps.correct}/{ps.total}</p>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-center space-x-4">
            <Link to="/listening-tests"
              className="bg-gradient-to-r from-secondary-500 to-accent-500 text-white px-6 py-2 rounded-lg font-semibold hover:opacity-90 transition">
              Back to Tests
            </Link>
            <Link to="/my-attempts"
              className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-semibold hover:bg-gray-300 transition">
              My Attempts
            </Link>
          </div>
        </div>

        {/* Answer Review */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-heading font-bold text-gray-800 mb-4">Answer Review</h2>

          {hasParts ? (
            <div className="space-y-6">
              {attempt.test.parts.map((part) => (
                <div key={part.part_number}>
                  <h3 className="text-lg font-bold text-gray-700 mb-3 pb-2 border-b">{part.title}</h3>
                  <div className="space-y-3">
                    {(part.questions || []).map((q) => renderAnswerItem(q, attempt, checkAnswer))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {allQuestions.map((q) => renderAnswerItem(q, attempt, checkAnswer))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

function renderAnswerItem(q, attempt, checkAnswer) {
  const userAnswer = attempt.answers?.[q.question_number];
  const type = q.question_type || 'mcq';
  const isTextBased = TEXT_BASED_TYPES.includes(type);
  const isCorrect = checkAnswer(q, userAnswer);

  return (
    <div key={q.id}
      className={`p-4 rounded-lg border-2 ${
        isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
      }`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
              type === 'mcq' ? 'bg-green-100 text-green-700' :
              type === 'fill_blank' ? 'bg-blue-100 text-blue-700' :
              type === 'sentence_completion' ? 'bg-purple-100 text-purple-700' :
              type === 'matching' ? 'bg-orange-100 text-orange-700' :
              type === 'map_labeling' ? 'bg-pink-100 text-pink-700' :
              'bg-teal-100 text-teal-700'
            }`}>
              {QUESTION_TYPE_LABELS[type] || type}
            </span>
          </div>
          <p className="font-medium text-gray-800">
            <span className="text-gray-500">Q{q.question_number}.</span> {q.question_text}
          </p>
          <div className="mt-2 text-sm space-y-1">
            {userAnswer ? (
              <p>
                Your answer:{' '}
                <span className={`font-semibold ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                  {(isTextBased || type === 'map_labeling')
                    ? userAnswer
                    : `${q[`option_${userAnswer}`] || userAnswer} (${userAnswer.toUpperCase()})`
                  }
                </span>
              </p>
            ) : (
              <p className="text-red-600 font-medium">Not answered</p>
            )}
            {!isCorrect && (
              <p>
                Correct answer:{' '}
                <span className="font-semibold text-green-700">
                  {(isTextBased || type === 'map_labeling')
                    ? q.correct_answer
                    : `${q[`option_${q.correct_answer}`] || q.correct_answer} (${q.correct_answer.toUpperCase()})`
                  }
                </span>
              </p>
            )}
          </div>
        </div>
        <span className={`text-2xl ${isCorrect ? 'text-green-500' : 'text-red-500'}`}>
          {isCorrect ? '\u2713' : '\u2717'}
        </span>
      </div>
    </div>
  );
}

export default ListeningResultPage;
