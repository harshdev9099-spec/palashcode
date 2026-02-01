import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import listeningService from '../services/listeningService';
import { toast } from 'react-toastify';
import AudioPlayer from '../components/listening/AudioPlayer';
import Timer from '../components/listening/Timer';
import PartNavigation from '../components/listening/PartNavigation';
import QuestionTracker from '../components/listening/QuestionTracker';

const QUESTION_TYPE_LABELS = {
  mcq: 'Multiple Choice',
  fill_blank: 'Form / Note Completion',
  sentence_completion: 'Sentence Completion',
  matching: 'Matching Information',
  table_completion: 'Table / Flow-chart Completion',
  map_labeling: 'Map / Diagram Labeling',
};

const WORD_LIMIT_LABELS = {
  1: 'ONE WORD ONLY',
  2: 'NO MORE THAN TWO WORDS',
  3: 'NO MORE THAN THREE WORDS AND/OR A NUMBER',
};

const TEXT_BASED_TYPES = ['fill_blank', 'sentence_completion', 'table_completion'];

const ListeningTestTakePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [test, setTest] = useState(null);
  const [attempt, setAttempt] = useState(null);
  const [answers, setAnswers] = useState({});
  const [currentPart, setCurrentPart] = useState(1);
  const [timeRemaining, setTimeRemaining] = useState(1800);
  const [audioPlayed, setAudioPlayed] = useState({ 1: false, 2: false, 3: false, 4: false });
  const [partsUnlocked, setPartsUnlocked] = useState({ 1: true, 2: false, 3: false, 4: false });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [testStarted, setTestStarted] = useState(false);
  const saveTimerRef = useRef(null);
  const timeRef = useRef(1800);

  useEffect(() => {
    loadTestAndStart();
    return () => {
      if (saveTimerRef.current) clearInterval(saveTimerRef.current);
    };
  }, [id]);

  // Auto-save every 30 seconds
  useEffect(() => {
    if (!attempt || !testStarted) return;
    saveTimerRef.current = setInterval(() => {
      saveProgress();
    }, 30000);
    return () => { if (saveTimerRef.current) clearInterval(saveTimerRef.current); };
  }, [attempt, testStarted]);

  const loadTestAndStart = async () => {
    try {
      const [testRes, startRes] = await Promise.all([
        listeningService.getTest(id),
        listeningService.startTest(id),
      ]);
      setTest(testRes.data.test);
      const att = startRes.data.attempt;
      setAttempt(att);
      setAnswers(att.answers || {});
      setTimeRemaining(att.time_remaining || 1800);
      timeRef.current = att.time_remaining || 1800;
      setCurrentPart(att.current_part || 1);

      const played = att.part_audio_played || { 1: false, 2: false, 3: false, 4: false };
      setAudioPlayed(played);

      // Unlock parts based on audio played status
      const unlocked = { 1: true, 2: false, 3: false, 4: false };
      if (played['1'] || played[1]) unlocked[2] = true;
      if (played['2'] || played[2]) unlocked[3] = true;
      if (played['3'] || played[3]) unlocked[4] = true;
      setPartsUnlocked(unlocked);
      setTestStarted(true);
    } catch (error) {
      toast.error('Failed to load test');
      navigate('/listening-tests');
    } finally {
      setLoading(false);
    }
  };

  const saveProgress = useCallback(async () => {
    if (!attempt) return;
    try {
      await listeningService.saveProgress(attempt.id, {
        answers,
        time_remaining: timeRef.current,
        current_part: currentPart,
      });
    } catch {
      // Silent fail for auto-save
    }
  }, [attempt, answers, currentPart]);

  const handleAnswer = (questionNumber, answer) => {
    setAnswers((prev) => ({ ...prev, [questionNumber]: answer }));
  };

  const handleTimeTick = (newTime) => {
    timeRef.current = newTime;
    setTimeRemaining(newTime);
  };

  const handleTimeUp = () => {
    toast.error('Time is up! Auto-submitting your test.');
    handleSubmit(true);
  };

  const handleTimeWarning = () => {
    toast.warning('5 minutes remaining!', { autoClose: 5000 });
  };

  const handleAudioPlay = async (partNumber) => {
    if (!attempt) return;
    try {
      await listeningService.markAudioPlayed(attempt.id, partNumber);
    } catch {}
  };

  const handleAudioEnded = (partNumber) => {
    setAudioPlayed((prev) => ({ ...prev, [partNumber]: true }));
    if (partNumber < 4) {
      setPartsUnlocked((prev) => ({ ...prev, [partNumber + 1]: true }));
    }
  };

  const handlePartChange = (partNum) => {
    if (!partsUnlocked[partNum]) return;
    setCurrentPart(partNum);
  };

  const handleSubmit = async (autoSubmit = false) => {
    if (!autoSubmit && !showSubmitModal) {
      setShowSubmitModal(true);
      return;
    }

    setSubmitting(true);
    setShowSubmitModal(false);
    try {
      await saveProgress();
      const response = await listeningService.submitTest(attempt.id, answers, timeRef.current);
      toast.success('Test submitted successfully!');
      navigate(`/listening-tests/${id}/result/${response.data.attempt.id}`);
    } catch (error) {
      toast.error(error.message || 'Failed to submit test');
    } finally {
      setSubmitting(false);
    }
  };

  const scrollToQuestion = (qNum) => {
    const el = document.getElementById(`question-${qNum}`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-golden-50 to-primary-100 py-12">
        <div className="max-w-5xl mx-auto px-4 flex flex-col justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mb-4"></div>
          <p className="text-gray-600">Loading test...</p>
        </div>
      </div>
    );
  }

  if (!test || !test.parts || test.parts.length === 0) return null;

  const activePart = test.parts.find((p) => p.part_number === currentPart) || test.parts[0];
  const activeQuestions = activePart.questions || [];
  const allQuestions = test.parts.flatMap((p) => p.questions || []);
  const totalAnswered = allQuestions.filter((q) => {
    const a = answers[q.question_number];
    return a && a.toString().trim() !== '';
  }).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar - Timer + Part Nav */}
      <div className="bg-white shadow-md sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-lg font-bold text-gray-800 truncate">{test.title}</h1>
            <Timer
              initialTime={timeRemaining}
              onTick={handleTimeTick}
              onTimeUp={handleTimeUp}
              onWarning={handleTimeWarning}
            />
          </div>
          <PartNavigation
            currentPart={currentPart}
            partsUnlocked={partsUnlocked}
            onPartChange={handlePartChange}
          />
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Audio Player */}
        <div className="mb-6">
          <AudioPlayer
            audioUrl={activePart.audio_url}
            onPlay={() => handleAudioPlay(currentPart)}
            onEnded={() => handleAudioEnded(currentPart)}
            disabled={audioPlayed[currentPart]}
          />
        </div>

        {/* Part Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h2 className="font-bold text-blue-800 mb-1">{activePart.title}</h2>
          <p className="text-sm text-blue-700">{activePart.instructions}</p>
        </div>

        {/* Map/Diagram Image */}
        {activePart.image_url && (
          <div className="bg-white rounded-lg shadow p-4 mb-6">
            <img
              src={activePart.image_url}
              alt="Map / Diagram"
              className="max-w-full h-auto mx-auto rounded-lg border"
              style={{ maxHeight: '400px' }}
            />
          </div>
        )}

        {/* Questions */}
        <div className="space-y-4 mb-6">
          {activeQuestions.map((q) => {
            const type = q.question_type || 'mcq';
            const isTextBased = TEXT_BASED_TYPES.includes(type);
            const isChoiceBased = type === 'mcq' || type === 'matching';
            const isMapLabeling = type === 'map_labeling';

            return (
              <div key={q.id} id={`question-${q.question_number}`} className="bg-white rounded-xl shadow p-5">
                <div className="flex items-center gap-2 mb-2">
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
                  {isTextBased && q.word_limit && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-700 font-medium">
                      {WORD_LIMIT_LABELS[q.word_limit] || `Max ${q.word_limit} words`}
                    </span>
                  )}
                </div>

                <p className="font-semibold text-gray-800 mb-3">
                  <span className="text-primary-600">Q{q.question_number}.</span> {q.question_text}
                </p>

                {isChoiceBased && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {['a', 'b', 'c', 'd'].map((opt) => {
                      if (!q[`option_${opt}`]) return null;
                      const isSelected = answers[q.question_number] === opt;
                      return (
                        <label key={opt}
                          className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all ${
                            isSelected ? 'border-secondary-500 bg-secondary-50' : 'border-gray-200 hover:border-gray-300'
                          }`}>
                          <input type="radio" name={`q_${q.question_number}`} value={opt}
                            checked={isSelected}
                            onChange={() => handleAnswer(q.question_number, opt)}
                            className="h-4 w-4 text-secondary-600 mr-3" />
                          <span className="text-sm font-medium text-gray-500 uppercase mr-2">{opt}.</span>
                          <span className="text-sm text-gray-700">{q[`option_${opt}`]}</span>
                        </label>
                      );
                    })}
                  </div>
                )}

                {isMapLabeling && (
                  <div className="mt-2">
                    <select
                      value={answers[q.question_number] || ''}
                      onChange={(e) => handleAnswer(q.question_number, e.target.value)}
                      className="w-32 px-4 py-3 border-2 border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500">
                      <option value="">Select</option>
                      {['A', 'B', 'C', 'D', 'E', 'F', 'G'].map((l) => (
                        <option key={l} value={l}>{l}</option>
                      ))}
                    </select>
                  </div>
                )}

                {isTextBased && (
                  <div className="mt-2">
                    <input type="text"
                      value={answers[q.question_number] || ''}
                      onChange={(e) => handleAnswer(q.question_number, e.target.value)}
                      placeholder="Type your answer here..."
                      className="w-full max-w-md px-4 py-3 border-2 border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500 transition-all" />
                    {q.word_limit && (
                      <p className="text-xs text-gray-400 mt-1">
                        Write {WORD_LIMIT_LABELS[q.word_limit]?.toLowerCase() || `no more than ${q.word_limit} words`}
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Bar - Tracker + Actions */}
        <div className="bg-white rounded-xl shadow-lg p-4 sticky bottom-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <p className="text-xs text-gray-500 mb-1">Part {currentPart} Questions</p>
              <QuestionTracker
                questions={activeQuestions}
                answers={answers}
                onQuestionClick={scrollToQuestion}
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">
                {totalAnswered}/{allQuestions.length}
              </span>
              <button onClick={() => setShowReview(true)}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-300 transition">
                Review
              </button>
              <button onClick={() => handleSubmit()}
                disabled={submitting}
                className="bg-gradient-to-r from-secondary-500 to-accent-500 text-white px-6 py-2 rounded-lg text-sm font-bold hover:opacity-90 transition disabled:opacity-50">
                {submitting ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Review Modal */}
      {showReview && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">Review All Answers</h2>
              <button onClick={() => setShowReview(false)} className="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
            </div>
            <div className="p-4 space-y-4">
              {test.parts.map((part) => (
                <div key={part.part_number}>
                  <h3 className="font-bold text-gray-700 mb-2">{part.title}</h3>
                  <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5 mb-4">
                    {(part.questions || []).map((q) => {
                      const a = answers[q.question_number];
                      const isAnswered = a && a.toString().trim() !== '';
                      return (
                        <button key={q.question_number}
                          onClick={() => { setCurrentPart(part.part_number); setShowReview(false); setTimeout(() => scrollToQuestion(q.question_number), 200); }}
                          className={`w-8 h-8 rounded-full text-xs font-bold flex items-center justify-center ${
                            isAnswered ? 'bg-green-500 text-white' : 'bg-red-100 text-red-600'
                          }`}>
                          {q.question_number}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
            <div className="sticky bottom-0 bg-white border-t p-4 flex justify-between items-center">
              <span className="text-sm text-gray-600">{totalAnswered}/{allQuestions.length} answered</span>
              <button onClick={() => setShowReview(false)}
                className="bg-primary-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-700 transition">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Submit Confirmation Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Submit Test?</h2>
            <p className="text-gray-600 mb-2">
              You have answered <strong>{totalAnswered}</strong> out of <strong>{allQuestions.length}</strong> questions.
            </p>
            {totalAnswered < allQuestions.length && (
              <p className="text-red-600 text-sm mb-4">
                {allQuestions.length - totalAnswered} question(s) will be marked as incorrect.
              </p>
            )}
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowSubmitModal(false)}
                className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-semibold hover:bg-gray-300 transition">
                Cancel
              </button>
              <button onClick={() => handleSubmit(true)}
                disabled={submitting}
                className="bg-gradient-to-r from-secondary-500 to-accent-500 text-white px-6 py-2 rounded-lg font-bold hover:opacity-90 transition disabled:opacity-50">
                {submitting ? 'Submitting...' : 'Confirm Submit'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListeningTestTakePage;
