import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import listeningService from '../services/listeningService';
import { toast } from 'react-toastify';

const ListeningTestsPage = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTests();
  }, []);

  const loadTests = async () => {
    try {
      const response = await listeningService.getTests();
      setTests(response.data);
    } catch (error) {
      toast.error('Failed to load tests');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-golden-50 to-primary-100 py-12">
        <div className="max-w-7xl mx-auto px-4 flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-golden-50 to-primary-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-heading font-bold text-gray-800">IELTS Listening Tests</h1>
          <p className="text-gray-600 mt-2">Practice your listening skills with our IELTS-style tests</p>
        </div>

        {tests.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tests.map((test) => {
              const bestAttempt = test.attempts?.length > 0
                ? test.attempts.reduce((best, a) => a.band_score > best.band_score ? a : best, test.attempts[0])
                : null;

              return (
                <div key={test.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                  <div className="bg-gradient-to-r from-secondary-500 to-accent-500 p-4">
                    <div className="flex items-center space-x-3">
                      <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center text-2xl">
                        🎧
                      </div>
                      <div className="text-white">
                        <h3 className="font-heading font-bold text-lg">{test.title}</h3>
                        <p className="text-sm text-orange-100">{test.questions_count} questions</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-5">
                    {test.description && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{test.description}</p>
                    )}

                    {bestAttempt ? (
                      <div className="bg-gray-50 rounded-lg p-3 mb-4">
                        <p className="text-xs text-gray-500 mb-1">Your Best Score</p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-700">{bestAttempt.correct_count}/{test.questions_count} correct</span>
                          <span className="px-3 py-1 bg-gradient-to-r from-secondary-500 to-accent-500 text-white rounded-full text-sm font-bold">
                            Band {bestAttempt.band_score}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">Attempted {test.attempts.length} time(s)</p>
                      </div>
                    ) : (
                      <div className="bg-blue-50 rounded-lg p-3 mb-4">
                        <p className="text-sm text-blue-600">Not attempted yet</p>
                      </div>
                    )}

                    <Link
                      to={`/listening-tests/${test.id}`}
                      className="block w-full text-center bg-gradient-to-r from-secondary-500 to-accent-500 text-white py-2 rounded-lg font-semibold hover:opacity-90 transition"
                    >
                      {bestAttempt ? 'Retake Test' : 'Start Test'}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow p-12 text-center">
            <p className="text-gray-500 text-lg">No listening tests available yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListeningTestsPage;
