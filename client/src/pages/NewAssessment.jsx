import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { createAssessment } from '../services/api';
import Button from '../components/UI/Button';
import { HiSparkles, HiExclamationTriangle } from 'react-icons/hi2';

const JOB_ROLES = [
  'Software Engineer',
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'Data Scientist',
  'Data Analyst',
  'Machine Learning Engineer',
  'DevOps Engineer',
  'Cloud Engineer',
  'Mobile App Developer',
  'Cybersecurity Analyst',
  'Product Manager',
  'QA / Test Engineer',
  'UI/UX Designer',
  'Business Analyst',
  'Database Administrator',
  'System Administrator',
  'AI/ML Researcher',
  'Embedded Systems Engineer',
  'Blockchain Developer',
];

export default function NewAssessment() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [jobRole, setJobRole] = useState('');
  const [custom, setCustom] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const profileReady = user?.profile?.skills?.length > 0;
  const selectedRole = jobRole === '__custom' ? custom.trim() : jobRole;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedRole) return;

    setError('');
    setLoading(true);
    try {
      const res = await createAssessment({ jobRole: selectedRole });
      navigate(`/assessment/${res.data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Assessment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">New Assessment</h1>
      <p className="text-sm text-gray-500 mb-8">
        Select your target job role and our AI will analyze your profile against the requirements
      </p>

      {!profileReady && (
        <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
          <HiExclamationTriangle className="text-xl text-amber-500 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-medium text-amber-800">Profile incomplete</p>
            <p className="text-sm text-amber-700 mt-1">
              You need to add at least your skills before running an assessment.{' '}
              <button
                onClick={() => navigate('/profile')}
                className="underline font-medium"
              >
                Complete your profile
              </button>
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            What role are you targeting?
          </label>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
            {JOB_ROLES.map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => setJobRole(role)}
                className={`text-left text-sm px-3 py-2.5 rounded-lg border transition-colors
                  ${
                    jobRole === role
                      ? 'border-primary-500 bg-primary-50 text-primary-700 font-medium'
                      : 'border-gray-200 text-gray-600 hover:border-primary-300 hover:bg-gray-50'
                  }`}
              >
                {role}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setJobRole('__custom')}
              className={`text-left text-sm px-3 py-2.5 rounded-lg border transition-colors
                ${
                  jobRole === '__custom'
                    ? 'border-primary-500 bg-primary-50 text-primary-700 font-medium'
                    : 'border-gray-200 text-gray-600 hover:border-primary-300 hover:bg-gray-50'
                }`}
            >
              Other...
            </button>
          </div>

          {jobRole === '__custom' && (
            <input
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm mb-4
                focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Type your target role"
              value={custom}
              onChange={(e) => setCustom(e.target.value)}
              autoFocus
            />
          )}

          {error && (
            <div className="bg-red-50 text-red-700 text-sm rounded-lg px-4 py-3 mb-4">
              {error}
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={!selectedRole || !profileReady}
            loading={loading}
          >
            <HiSparkles className="mr-2" />
            {loading ? 'AI is analyzing your profile...' : 'Run AI Assessment'}
          </Button>

          {loading && (
            <p className="text-xs text-gray-400 text-center mt-3">
              This takes 10–20 seconds while our AI reviews your profile
            </p>
          )}
        </div>
      </form>
    </div>
  );
}
