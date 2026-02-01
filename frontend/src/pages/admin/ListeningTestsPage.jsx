import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import adminService from '../../services/adminService';
import { toast } from 'react-toastify';

const ListeningTestsPage = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    loadTests();
  }, [search]);

  const loadTests = async (page = 1) => {
    setLoading(true);
    try {
      const params = { page };
      if (search) params.search = search;
      const response = await adminService.getListeningTests(params);
      setTests(response.data.data);
      setPagination({
        current_page: response.data.current_page,
        last_page: response.data.last_page,
        total: response.data.total,
      });
    } catch (error) {
      toast.error('Failed to load listening tests');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      await adminService.deleteListeningTest(id);
      toast.success('Test deleted successfully');
      loadTests();
    } catch (error) {
      toast.error(error.message || 'Failed to delete test');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Listening Tests</h1>
        <Link
          to="/admin/listening-tests/create"
          className="bg-gradient-to-r from-secondary-500 to-accent-500 text-white px-6 py-2 rounded-lg font-semibold hover:opacity-90 transition"
        >
          + Create Test
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <input
          type="text"
          placeholder="Search by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
          </div>
        ) : tests.length > 0 ? (
          <>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Questions</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attempts</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tests.map((test) => (
                  <tr key={test.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{test.title}</div>
                      {test.description && (
                        <div className="text-sm text-gray-500 truncate max-w-xs">{test.description}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {test.questions_count}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {test.attempts_count}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        test.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {test.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(test.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                      <Link to={`/admin/listening-tests/${test.id}/results`} className="text-primary-600 hover:text-primary-900">
                        Results
                      </Link>
                      <Link to={`/admin/listening-tests/${test.id}/edit`} className="text-indigo-600 hover:text-indigo-900">
                        Edit
                      </Link>
                      <button onClick={() => handleDelete(test.id, test.title)} className="text-red-600 hover:text-red-900">
                        Delete
                      </button>
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
                    onClick={() => loadTests(pagination.current_page - 1)}
                    disabled={pagination.current_page === 1}
                    className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => loadTests(pagination.current_page + 1)}
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
            <p className="text-gray-500">No listening tests found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListeningTestsPage;
