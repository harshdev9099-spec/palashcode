import { useAuth } from '../context/AuthContext';

const DashboardPage = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-golden-50 to-primary-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-secondary-500 to-accent-500 rounded-2xl shadow-xl p-8 mb-8 text-white">
          <div className="flex items-center space-x-4">
            <div className="h-16 w-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl">
              {user?.first_name?.charAt(0)?.toUpperCase()}
            </div>
            <div>
              <h1 className="text-3xl font-heading font-bold mb-1">
                Welcome back, {user?.first_name}! 🎓
              </h1>
              <p className="text-orange-100">
                Here's what's happening with your IELTS preparation
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-2xl rounded-2xl p-8"  >

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* User Information Card */}
            <div className="bg-gradient-to-br from-primary-500 to-golden-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center mb-4">
                <svg className="h-8 w-8 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <h3 className="text-lg font-heading font-semibold">User Information</h3>
              </div>
              <div className="space-y-2 text-sm">
                <p><strong>Name:</strong> {user?.full_name}</p>
                <p><strong>Email:</strong> {user?.email}</p>
                {user?.mobile_number && (
                  <p><strong>Mobile:</strong> {user.mobile_number}</p>
                )}
                <p><strong>Status:</strong> {user?.email_verified_at ? '✓ Verified' : 'Not Verified'}</p>
              </div>
            </div>

            {/* Courses Card */}
            <div className="bg-gradient-to-br from-secondary-500 to-accent-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center mb-4">
                <svg className="h-8 w-8 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <h3 className="text-lg font-heading font-semibold">Courses</h3>
              </div>
              <div className="text-4xl font-display font-bold mb-2">0</div>
              <p className="text-sm text-orange-100">Active courses</p>
            </div>

            {/* Progress Card */}
            <div className="bg-gradient-to-br from-accent-500 to-accent-700 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center mb-4">
                <svg className="h-8 w-8 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <h3 className="text-lg font-heading font-semibold">Progress</h3>
              </div>
              <div className="text-4xl font-display font-bold mb-2">0%</div>
              <p className="text-sm text-red-100">Overall completion</p>
            </div>
          </div>

          {/* Getting Started Section */}
          <div className="bg-gradient-to-r from-primary-50 to-golden-50 border-2 border-primary-200 rounded-xl p-6 shadow-md">
            <div className="flex items-center mb-6">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-secondary-400 to-accent-500 flex items-center justify-center mr-3">
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h2 className="text-2xl font-heading font-bold bg-gradient-to-r from-secondary-600 to-accent-600 bg-clip-text text-transparent">
                Getting Started
              </h2>
            </div>
            <ul className="space-y-4">
              <li className="flex items-start group hover:bg-white/70 p-3 rounded-lg transition-colors duration-200">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-secondary-400 to-accent-500 flex items-center justify-center mr-3 flex-shrink-0 shadow-md">
                  <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-earth-800 group-hover:text-secondary-600 transition-colors duration-200">Complete Your Profile</p>
                  <p className="text-sm text-earth-600">Add more details to personalize your learning experience</p>
                </div>
              </li>
              <li className="flex items-start group hover:bg-white/70 p-3 rounded-lg transition-colors duration-200">
                <div className="h-8 w-8 rounded-full bg-earth-300 flex items-center justify-center mr-3 flex-shrink-0">
                  <svg className="h-5 w-5 text-earth-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-earth-800 group-hover:text-secondary-600 transition-colors duration-200">Browse Our Courses</p>
                  <p className="text-sm text-earth-600">Explore IELTS preparation courses tailored to your needs</p>
                </div>
              </li>
              <li className="flex items-start group hover:bg-white/70 p-3 rounded-lg transition-colors duration-200">
                <div className="h-8 w-8 rounded-full bg-earth-300 flex items-center justify-center mr-3 flex-shrink-0">
                  <svg className="h-5 w-5 text-earth-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-earth-800 group-hover:text-secondary-600 transition-colors duration-200">Take Your First Practice Test</p>
                  <p className="text-sm text-earth-600">Assess your current level and track your progress</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
