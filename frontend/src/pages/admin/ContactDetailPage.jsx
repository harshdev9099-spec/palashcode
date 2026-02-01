import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import adminService from '../../services/adminService';
import { toast } from 'react-toastify';

const ContactDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [contact, setContact] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reply, setReply] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadContact();
  }, [id]);

  const loadContact = async () => {
    try {
      const response = await adminService.getContactById(id);
      setContact(response.data.contact);
    } catch (error) {
      toast.error('Failed to load contact');
      navigate('/admin/contacts');
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async (e) => {
    e.preventDefault();
    if (!reply.trim()) {
      toast.error('Please enter a reply');
      return;
    }

    setSubmitting(true);
    try {
      const response = await adminService.replyToContact(id, reply);
      setContact(response.data.contact);
      setReply('');
      toast.success('Reply sent successfully');
    } catch (error) {
      toast.error(error.message || 'Failed to send reply');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      const response = await adminService.updateContactStatus(id, newStatus);
      setContact(response.data.contact);
      toast.success('Status updated');
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!contact) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Contact Details</h1>
        <button
          onClick={() => navigate('/admin/contacts')}
          className="text-gray-600 hover:text-gray-800"
        >
          ← Back to Contacts
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contact Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">{contact.subject}</h2>
              <select
                value={contact.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
              >
                <option value="new">New</option>
                <option value="read">Read</option>
                <option value="replied">Replied</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium">{contact.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">
                    <a href={`mailto:${contact.email}`} className="text-primary-600 hover:text-primary-800">
                      {contact.email}
                    </a>
                  </p>
                </div>
                {contact.phone && (
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium">{contact.phone}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-500">Submitted</p>
                  <p className="font-medium">{new Date(contact.created_at).toLocaleString()}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-2">Message</p>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700 whitespace-pre-wrap">{contact.message}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Reply Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Reply</h3>

            {contact.admin_reply ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-green-800">Previous Reply</p>
                  <p className="text-xs text-green-600">
                    {contact.replied_at && new Date(contact.replied_at).toLocaleString()}
                  </p>
                </div>
                <p className="text-gray-700 whitespace-pre-wrap">{contact.admin_reply}</p>
                {contact.replied_by && (
                  <p className="text-xs text-green-600 mt-2">
                    Replied by: {contact.replied_by.first_name} {contact.replied_by.last_name}
                  </p>
                )}
              </div>
            ) : null}

            <form onSubmit={handleReply}>
              <textarea
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                rows="6"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Type your reply here..."
              ></textarea>
              <div className="mt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={submitting || !reply.trim()}
                  className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
                >
                  {submitting ? 'Sending...' : 'Send Reply'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* User Info */}
          {contact.user && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">User Information</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Registered User</p>
                  <p className="font-medium">
                    {contact.user.first_name} {contact.user.last_name}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{contact.user.email}</p>
                </div>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button
                onClick={() => window.open(`mailto:${contact.email}`, '_blank')}
                className="w-full px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 text-sm font-medium"
              >
                Email Contact
              </button>
              {contact.phone && (
                <button
                  onClick={() => window.open(`tel:${contact.phone}`, '_blank')}
                  className="w-full px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 text-sm font-medium"
                >
                  Call Contact
                </button>
              )}
              <button
                onClick={() => handleStatusChange('archived')}
                className="w-full px-4 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 text-sm font-medium"
              >
                Archive
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactDetailPage;
