import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getAssessments, deleteAssessment } from '../services/api';
import Button from '../components/UI/Button';
import {
  HiPlus,
  HiDocumentText,
  HiClock,
  HiTrash,
  HiChevronRight,
  HiCheckCircle,
  HiUserCircle,
} from 'react-icons/hi2';

export default function Dashboard() {
  const { user } = useAuth();
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAssessments()
      .then((res) => setAssessments(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm('Delete this assessment? This cannot be undone.')) return;
    try {
      await deleteAssessment(id);
      setAssessments((prev) => prev.filter((a) => a._id !== id));
    } catch {
      // ignore
    }
  };

  const totalCompleted = assessments.reduce(
    (sum, a) => sum + (a.completedItems?.length || 0),
    0
  );
  const totalItems = assessments.reduce((sum, a) => {
    const r = a.result;
    if (!r) return sum;
    return (
      sum +
      (r.skillGaps?.length || 0) +
      (r.recommendedCertifications?.length || 0) +
      (r.projectSuggestions?.length || 0) +
      (r.resumeTips?.length || 0) +
      (r.interviewTips?.length || 0)
    );
  }, 0);

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome, {user?.name}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Your placement preparation hub
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/profile">
            <Button variant="outline">
              <HiUserCircle className="mr-1" /> Edit Profile
            </Button>
          </Link>
          <Link to="/new-assessment">
            <Button>
              <HiPlus className="mr-1" /> New Assessment
            </Button>
          </Link>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid sm:grid-cols-4 gap-4 mb-10">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-sm text-gray-500 mb-1">Assessments</p>
          <p className="text-2xl font-bold text-gray-900">{assessments.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-sm text-gray-500 mb-1">Items Completed</p>
          <p className="text-2xl font-bold text-green-600">{totalCompleted}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-sm text-gray-500 mb-1">Items Remaining</p>
          <p className="text-2xl font-bold text-amber-600">
            {Math.max(0, totalItems - totalCompleted)}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-sm text-gray-500 mb-1">Profile</p>
          <p className="text-2xl font-bold text-primary-600">
            {user?.profile?.skills?.length > 0 ? 'Complete' : 'Incomplete'}
          </p>
        </div>
      </div>

      {/* Assessment History */}
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Assessment History
      </h2>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary-200 border-t-primary-600" />
        </div>
      ) : assessments.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-10 text-center">
          <HiDocumentText className="text-4xl text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 mb-1">No assessments yet</p>
          <p className="text-sm text-gray-400 mb-4">
            Build your profile, then run an AI assessment to get started
          </p>
          <div className="flex items-center justify-center gap-2">
            <Link to="/profile">
              <Button variant="outline">Build Profile</Button>
            </Link>
            <Link to="/new-assessment">
              <Button>Run Assessment</Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {assessments.map((a) => {
            const r = a.result || {};
            const itemTotal =
              (r.skillGaps?.length || 0) +
              (r.recommendedCertifications?.length || 0) +
              (r.projectSuggestions?.length || 0) +
              (r.resumeTips?.length || 0) +
              (r.interviewTips?.length || 0);
            const done = a.completedItems?.length || 0;
            const pct = itemTotal > 0 ? Math.round((done / itemTotal) * 100) : 0;

            return (
              <Link
                key={a._id}
                to={`/assessment/${a._id}`}
                className="flex items-center gap-4 bg-white rounded-xl border border-gray-200 p-5
                  hover:border-primary-300 hover:shadow-sm transition-all group"
              >
                {/* Progress ring */}
                <div className="shrink-0 relative w-12 h-12">
                  <svg className="w-12 h-12 -rotate-90" viewBox="0 0 36 36">
                    <circle
                      cx="18" cy="18" r="15.5"
                      fill="none" stroke="#e5e7eb" strokeWidth="3"
                    />
                    <circle
                      cx="18" cy="18" r="15.5"
                      fill="none"
                      stroke={pct === 100 ? '#16a34a' : '#3b82f6'}
                      strokeWidth="3"
                      strokeDasharray={`${pct} 100`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-gray-700">
                    {pct === 100 ? (
                      <HiCheckCircle className="text-green-600 text-lg" />
                    ) : (
                      `${pct}%`
                    )}
                  </span>
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{a.jobRole}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                      <HiClock className="text-sm" />
                      {new Date(a.createdAt).toLocaleDateString()}
                    </span>
                    <span className="text-xs text-gray-400">
                      {done}/{itemTotal} items
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <button
                  onClick={(e) => handleDelete(e, a._id)}
                  className="shrink-0 p-2 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Delete"
                >
                  <HiTrash />
                </button>
                <HiChevronRight className="shrink-0 text-gray-300 group-hover:text-primary-500 transition-colors" />
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
