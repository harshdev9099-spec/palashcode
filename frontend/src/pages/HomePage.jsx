import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';

const HomePage = () => {
  const { isAuthenticated } = useAuth();

  const stats = [
    { value: '10,000+', label: 'Students Trained' },
    { value: '95%', label: 'Success Rate' },
    { value: '8.0+', label: 'Average Band Score' },
    { value: '50+', label: 'Expert Tutors' },
  ];

  const features = [
    {
      icon: (
        <svg className="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      title: 'Comprehensive Study Material',
      description: 'Access 2000+ practice tests, sample answers, and study guides designed by IELTS experts.',
      gradient: 'from-primary-500 to-golden-500'
    },
    {
      icon: (
        <svg className="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      ),
      title: 'Live Interactive Classes',
      description: 'Join live sessions with certified IELTS trainers and get real-time feedback on your performance.',
      gradient: 'from-secondary-500 to-accent-500'
    },
    {
      icon: (
        <svg className="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      title: 'AI-Powered Performance Tracking',
      description: 'Track your progress with detailed analytics and get personalized study recommendations.',
      gradient: 'from-accent-500 to-accent-700'
    },
    {
      icon: (
        <svg className="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Flexible Learning',
      description: 'Study at your own pace with 24/7 access to all course materials and recorded sessions.',
      gradient: 'from-secondary-600 to-accent-600'
    },
    {
      icon: (
        <svg className="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
        </svg>
      ),
      title: 'Speaking Practice Sessions',
      description: 'Regular one-on-one speaking sessions with expert tutors to boost your confidence.',
      gradient: 'from-primary-600 to-secondary-500'
    },
    {
      icon: (
        <svg className="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
      ),
      title: 'Score Guarantee',
      description: 'Achieve your target band score or get a full refund. We stand by our results!',
      gradient: 'from-accent-600 to-accent-800'
    },
  ];

  const courses = [
    {
      title: 'IELTS Foundation',
      duration: '4 Weeks',
      level: 'Beginner',
      targetBand: '5.0 - 6.0',
      features: ['Basic Grammar & Vocabulary', '100+ Practice Tests', 'Weekly Mock Tests', 'Email Support'],
      price: '$99',
      popular: false
    },
    {
      title: 'IELTS Mastery',
      duration: '8 Weeks',
      level: 'Intermediate',
      targetBand: '6.5 - 7.5',
      features: ['Advanced Techniques', '500+ Practice Tests', 'Daily Live Classes', '1-on-1 Speaking Sessions', 'Priority Support'],
      price: '$199',
      popular: true
    },
    {
      title: 'IELTS Pro',
      duration: '12 Weeks',
      level: 'Advanced',
      targetBand: '8.0+',
      features: ['Expert Strategies', 'Unlimited Practice', 'Daily Live Sessions', 'Weekly 1-on-1 Tutoring', 'Score Guarantee', '24/7 Premium Support'],
      price: '$299',
      popular: false
    },
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      band: '8.5',
      image: '👩‍🎓',
      text: 'Palash Academy transformed my IELTS journey! I improved from 6.5 to 8.5 in just 8 weeks. The instructors are amazing!',
      country: 'India'
    },
    {
      name: 'Mohammed Ali',
      band: '8.0',
      image: '👨‍💼',
      text: 'The speaking sessions were game-changers. Got my dream band score and now studying in the UK. Thank you!',
      country: 'Pakistan'
    },
    {
      name: 'Priya Sharma',
      band: '7.5',
      image: '👩‍💻',
      text: 'Best investment ever! The study materials are comprehensive and the mock tests are exactly like the real exam.',
      country: 'India'
    },
  ];

  const faqs = [
    {
      question: 'How long does it take to prepare for IELTS?',
      answer: 'It depends on your current English level. Our courses range from 4-12 weeks, with most students achieving their target score within 8 weeks of focused study.'
    },
    {
      question: 'Do you offer a score guarantee?',
      answer: 'Yes! Our IELTS Pro course comes with a score guarantee. If you don\'t achieve your target band score, you get a full refund.'
    },
    {
      question: 'Can I access course materials after completion?',
      answer: 'Absolutely! You get lifetime access to all course materials, practice tests, and recorded sessions even after course completion.'
    },
    {
      question: 'What if I miss a live class?',
      answer: 'All live classes are recorded and available within 24 hours. You can watch them anytime at your convenience.'
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-secondary-500 via-accent-500 to-accent-700 bg-gradient-animated">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="text-center animate-fade-in-up">
            <div className="inline-flex items-center bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 mb-8">
              <span className="text-golden-300 mr-2">⭐</span>
              <span className="text-white text-sm font-medium">Rated 4.9/5 by 10,000+ Students</span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-black text-white mb-6 leading-tight">
              Master IELTS &<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-golden-200 via-primary-200 to-golden-300">
                Achieve Your Dreams
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-orange-50 mb-8 max-w-3xl mx-auto leading-relaxed">
              Get expert guidance, comprehensive study materials, and personalized coaching to{' '}
              <span className="text-golden-200 font-semibold">BREAKTHROUGH</span> your target band score
            </p>

            {/* Band Score Badges */}
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              <div className="band-score band-9 text-sm md:text-base">🎯 Band 9.0 Achievers</div>
              <div className="band-score band-7-8 text-sm md:text-base">⚡ Average Score: 8.0+</div>
              <div className="band-score band-5-6 text-sm md:text-base">📈 95% Success Rate</div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {isAuthenticated ? (
                <Link to="/dashboard">
                  <Button variant="primary" className="text-lg px-10 py-5 bg-white text-secondary-600 hover:bg-golden-50 shadow-2xl hover:shadow-golden-500/50 transition-all duration-300 transform hover:scale-105">
                    Go to Dashboard →
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/register">
                    <Button variant="primary" className="text-lg px-10 py-5 bg-white text-secondary-600 hover:bg-golden-50 shadow-2xl hover:shadow-golden-500/50 transition-all duration-300 transform hover:scale-105">
                      🚀 Start Your Journey FREE
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button variant="outline" className="text-lg px-10 py-5 bg-transparent text-white border-2 border-white hover:bg-white hover:text-secondary-600 transition-all duration-300">
                      Sign In
                    </Button>
                  </Link>
                </>
              )}
            </div>

            <p className="text-orange-100 text-sm mt-4">✨ No credit card required • Start learning instantly</p>
          </div>

          {/* Floating Elements */}
          <div className="hidden lg:block">
            <div className="absolute top-20 left-10 animate-float">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 shadow-xl">
                <p className="text-white font-bold text-2xl">📚</p>
              </div>
            </div>
            <div className="absolute bottom-20 right-10 animate-float" style={{ animationDelay: '1s' }}>
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 shadow-xl">
                <p className="text-white font-bold text-2xl">🎓</p>
              </div>
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
          </svg>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center transform hover:scale-110 transition-transform duration-300">
                <div className="text-4xl md:text-5xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-secondary-600 to-accent-600 mb-2">
                  {stat.value}
                </div>
                <div className="text-earth-700 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gradient-to-b from-white to-primary-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-4">
              Why Choose <span className="gradient-text">Palash Academy</span>?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to ace IELTS, all in one comprehensive platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="feature-card bg-white p-8 rounded-2xl shadow-lg hover-lift"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${feature.gradient} text-white mb-6 shadow-lg`}>
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-heading font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Courses Section */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-4">
              Choose Your <span className="gradient-text">Perfect Plan</span>
            </h2>
            <p className="text-xl text-gray-600">
              Flexible plans designed to match your goals and timeline
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {courses.map((course, index) => (
              <div
                key={index}
                className={`relative bg-white rounded-2xl shadow-xl overflow-hidden transform hover:scale-105 transition-all duration-300 ${
                  course.popular ? 'ring-4 ring-secondary-500' : ''
                }`}
              >
                {course.popular && (
                  <div className="absolute top-0 right-0 bg-gradient-to-r from-secondary-500 to-accent-500 text-white px-6 py-2 rounded-bl-2xl font-bold text-sm">
                    🔥 MOST POPULAR
                  </div>
                )}

                <div className="p-8">
                  <h3 className="text-2xl font-heading font-bold text-gray-900 mb-2">{course.title}</h3>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-sm bg-primary-100 text-secondary-700 px-3 py-1 rounded-full font-medium">
                      {course.level}
                    </span>
                    <span className="text-sm bg-accent-100 text-accent-700 px-3 py-1 rounded-full font-medium">
                      Band {course.targetBand}
                    </span>
                  </div>

                  <div className="mb-6">
                    <span className="text-5xl font-display font-bold text-gray-900">{course.price}</span>
                    <span className="text-gray-500">/{course.duration}</span>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {course.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start">
                        <svg className="h-6 w-6 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Link to="/register">
                    <Button
                      variant={course.popular ? 'primary' : 'outline'}
                      className={`w-full py-4 text-lg font-semibold ${
                        course.popular
                          ? 'bg-gradient-to-r from-secondary-500 to-accent-500 hover:from-secondary-600 hover:to-accent-600'
                          : ''
                      }`}
                    >
                      Get Started →
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="bg-gradient-to-b from-primary-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-4">
              Success <span className="gradient-text">Stories</span>
            </h2>
            <p className="text-xl text-gray-600">
              Real results from real students who achieved their dreams
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-xl p-8 hover-lift"
              >
                <div className="flex items-center mb-6">
                  <div className="text-5xl mr-4">{testimonial.image}</div>
                  <div>
                    <h4 className="font-heading font-bold text-gray-900">{testimonial.name}</h4>
                    <p className="text-gray-500 text-sm">{testimonial.country}</p>
                    <div className="flex items-center mt-1">
                      <span className="band-score band-9 text-xs px-2 py-1">Band {testimonial.band}</span>
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 italic leading-relaxed">
                  "{testimonial.text}"
                </p>
                <div className="flex mt-4 text-yellow-400">
                  {'⭐'.repeat(5)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-4">
              Frequently Asked <span className="gradient-text">Questions</span>
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to know about our IELTS courses
            </p>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-gradient-to-r from-primary-50 to-golden-50 rounded-xl p-6 hover:shadow-lg transition-shadow duration-300 border border-primary-100"
              >
                <h3 className="text-xl font-heading font-bold text-earth-900 mb-3">
                  {faq.question}
                </h3>
                <p className="text-earth-700 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Final CTA Section */}
      <div className="bg-gradient-to-r from-secondary-600 via-accent-600 to-accent-700 bg-gradient-animated py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
            Ready to Achieve Your Target Band Score?
          </h2>
          <p className="text-xl text-orange-100 mb-10 max-w-2xl mx-auto">
            Join thousands of successful students who transformed their IELTS scores with Palash Academy
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {!isAuthenticated && (
              <>
                <Link to="/register">
                  <Button className="text-lg px-10 py-5 bg-white text-secondary-600 hover:bg-golden-50 shadow-2xl transform hover:scale-105 transition-all duration-300">
                    🎯 Start Free Trial Now
                  </Button>
                </Link>
                <Link to="/login">
                  <Button className="text-lg px-10 py-5 bg-transparent text-white border-2 border-white hover:bg-white hover:text-secondary-600 transition-all duration-300">
                    Already a Member? Sign In
                  </Button>
                </Link>
              </>
            )}
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-8 text-white">
            <div className="flex items-center">
              <svg className="h-6 w-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>No hidden fees</span>
            </div>
            <div className="flex items-center">
              <svg className="h-6 w-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Cancel anytime</span>
            </div>
            <div className="flex items-center">
              <svg className="h-6 w-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Lifetime access</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
