import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/UI/Button';
import { HiAcademicCap, HiClipboardDocumentCheck, HiLightBulb, HiChartBar } from 'react-icons/hi2';

const features = [
  {
    icon: HiClipboardDocumentCheck,
    title: 'Profile Builder',
    desc: 'Create a comprehensive profile with your skills, projects, and experience.',
  },
  {
    icon: HiLightBulb,
    title: 'AI Assessment',
    desc: 'Get AI-powered gap analysis between your profile and dream job requirements.',
  },
  {
    icon: HiChartBar,
    title: 'Progress Tracker',
    desc: 'Track your preparation progress and mark completed recommendations.',
  },
];

export default function Home() {
  const { user } = useAuth();

  return (
    <div>
      {/* Hero */}
      <section className="py-20 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-primary-50 text-primary-700 text-sm font-medium px-4 py-2 rounded-full mb-6">
            <HiAcademicCap className="text-lg" />
            AI-Powered Placement Preparation
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight mb-4">
            Bridge the gap between
            <span className="text-primary-600"> where you are </span>
            and where you want to be
          </h1>
          <p className="text-lg text-gray-500 mb-8 max-w-2xl mx-auto">
            Get personalized recommendations on skills, certifications, projects,
            and interview prep tailored to your dream job role.
          </p>
          <div className="flex items-center justify-center gap-3">
            {user ? (
              <Link to="/dashboard">
                <Button>Go to Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link to="/signup">
                  <Button>Get Started Free</Button>
                </Link>
                <Link to="/login">
                  <Button variant="outline">Sign In</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-white border-t border-gray-100">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-10">
            How it works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((f) => (
              <div
                key={f.title}
                className="bg-gray-50 rounded-xl p-6 border border-gray-100"
              >
                <f.icon className="text-3xl text-primary-600 mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
