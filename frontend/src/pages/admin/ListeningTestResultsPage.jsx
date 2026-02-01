import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import adminService from '../../services/adminService';
import { toast } from 'react-toastify';

const ListeningTestResultsPage = () => {
  const { id } = useParams();
  const [test, setTest] = useState(null);
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async (page = 1) => {
    setLoading(true);
    try {
      const [testRes, attemptsRes] = await Promise.all([
        adminService.getListeningTest(id),
        adminService.getListeningTestResults(id, { page }),
      ]);
      setTest(testRes.data.test);
      setAttempts(attemptsRes.data.data);
      setPagination({
        current_page: attemptsRes.data.current_page,
        last_page: attemptsRes.data.last_page,
        total: attemptsRes.data.total,
      });
    } catch (error) {
      toast.error('Failed to load results');
    } finally {
      setLoading(false);
    }
  };

  const getBandColor = (band) => {
    if (band >= 7) return 'bg-green-100 text-green-800';
    if (band >= 5.5) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <Link to="/admin/listening-tests" className="text-primary-600 hover:underline text-sm mb-2 inline-block">
            &larr; Back to Tests
          </Link>
          <h1 className="text-3xl font-bold text-gray-800">Results: {test?.title}</h1>
          <p className="text-gray-500 mt-1">Total attempts: {pagination?.total || 0}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {attempts.length > 0 ? (
          <>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Band Score</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {attempts.map((attempt) => (
                  <tr key={attempt.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {attempt.user?.first_name} {attempt.user?.last_name}
                      </div>
                      <div className="text-sm text-gray-500">{attempt.user?.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {attempt.correct_count} / {test?.questions?.length || 40}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-sm leading-5 font-bold rounded-full ${getBandColor(attempt.band_score)}`}>
                        {attempt.band_score}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(attempt.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {pagination && pagination.last_page > 1 && (
              <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
                <div className="text-sm text-gray-700">
                  Showing page {pagination.current_page} of {pagination.last_page}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => loadData(pagination.current_page - 1)}
                    disabled={pagination.current_page === 1}
                    className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => loadData(pagination.current_page + 1)}
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
            <p className="text-gray-500">No attempts yet for this test</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListeningTestResultsPage;
