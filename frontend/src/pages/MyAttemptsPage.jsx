import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import listeningService from '../services/listeningService';
import { toast } from 'react-toastify';

const MyAttemptsPage = () => {
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    loadAttempts();
  }, []);

  const loadAttempts = async (page = 1) => {
    setLoading(true);
    try {
      const response = await listeningService.getAttempts({ page });
      setAttempts(response.data.data);
      setPagination({
        current_page: response.data.current_page,
        last_page: response.data.last_page,
        total: response.data.total,
      });
    } catch (error) {
      toast.error('Failed to load attempts');
    } finally {
      setLoading(false);
    }
  };

  const getBandColor = (band) => {
    if (band >= 7) return 'bg-green-100 text-green-800';
    if (band >= 5.5) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-golden-50 to-primary-100 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-heading font-bold text-gray-800">My Attempts</h1>
          <p className="text-gray-600 mt-2">Review your past listening test attempts</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
            </div>
          ) : attempts.length > 0 ? (
            <>
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Test</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Band</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {attempts.map((attempt) => (
                    <tr key={attempt.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {attempt.test?.title || 'Deleted Test'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {attempt.correct_count} correct
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-sm font-bold rounded-full ${getBandColor(attempt.band_score)}`}>
                          {attempt.band_score}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(attempt.created_at).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        {attempt.test && (
                          <Link
                            to={`/listening-tests/${attempt.listening_test_id}/result/${attempt.id}`}
                            className="text-primary-600 hover:text-primary-900 text-sm font-medium"
                          >
                            View Details
                          </Link>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {pagination && pagination.last_page > 1 && (
                <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
                  <div className="text-sm text-gray-700">Page {pagination.current_page} of {pagination.last_page}</div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => loadAttempts(pagination.current_page - 1)}
                      disabled={pagination.current_page === 1}
                      className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => loadAttempts(pagination.current_page + 1)}
                      disabled={pagination.current_page === pagination.last_page}
                      className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">You haven't taken any tests yet.</p>
              <Link
                to="/listening-tests"
                className="inline-block bg-gradient-to-r from-secondary-500 to-accent-500 text-white px-6 py-2 rounded-lg font-semibold hover:opacity-90 transition"
              >
                Browse Tests
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyAttemptsPage;
