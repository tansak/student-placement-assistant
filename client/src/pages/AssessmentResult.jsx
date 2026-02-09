import { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getAssessment, completeItem, uncompleteItem } from '../services/api';
import {
  HiArrowLeft,
  HiAcademicCap,
  HiLightBulb,
  HiWrenchScrewdriver,
  HiDocumentText,
  HiChatBubbleLeftRight,
  HiExclamationCircle,
  HiArrowUpCircle,
  HiCheckCircle,
} from 'react-icons/hi2';

const priorityBadge = {
  high: 'bg-red-100 text-red-700',
  medium: 'bg-amber-100 text-amber-700',
  low: 'bg-green-100 text-green-700',
};

function Section({ icon: Icon, title, color, count, total, children }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className={`flex items-center justify-between px-6 py-4 border-b border-gray-100`}>
        <div className={`flex items-center gap-2 ${color}`}>
          <Icon className="text-xl" />
          <h2 className="font-semibold">{title}</h2>
        </div>
        {total > 0 && (
          <span className="text-xs font-medium text-gray-400">
            {count}/{total} done
          </span>
        )}
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

function CheckItem({ category, item, label, completed, onToggle, children }) {
  const [busy, setBusy] = useState(false);

  const handleClick = async () => {
    setBusy(true);
    await onToggle(category, item, !completed);
    setBusy(false);
  };

  return (
    <div
      className={`flex gap-3 group ${completed ? 'opacity-60' : ''}`}
    >
      <button
        type="button"
        onClick={handleClick}
        disabled={busy}
        className="shrink-0 mt-0.5"
      >
        <div
          className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors
            ${
              completed
                ? 'bg-primary-600 border-primary-600 text-white'
                : 'border-gray-300 text-transparent group-hover:border-primary-400'
            }
            ${busy ? 'opacity-50' : ''}`}
        >
          <HiCheckCircle className="text-sm" />
        </div>
      </button>
      <div className={`flex-1 ${completed ? 'line-through' : ''}`}>
        {label && <p className="font-medium text-gray-900">{label}</p>}
        {children}
      </div>
    </div>
  );
}

export default function AssessmentResult() {
  const { id } = useParams();
  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getAssessment(id)
      .then((res) => setAssessment(res.data))
      .catch(() => setError('Failed to load assessment'))
      .finally(() => setLoading(false));
  }, [id]);

  const isCompleted = useCallback(
    (category, item) => {
      if (!assessment) return false;
      return assessment.completedItems?.some(
        (ci) => ci.category === category && ci.item === item
      );
    },
    [assessment]
  );

  const handleToggle = async (category, item, shouldComplete) => {
    try {
      const res = shouldComplete
        ? await completeItem(id, { category, item })
        : await uncompleteItem(id, { category, item });
      setAssessment(res.data);
    } catch {
      // silently fail — UI stays in sync from state
    }
  };

  // Count helpers
  const countCompleted = (category, items) =>
    items.filter((_, i) => isCompleted(category, `${i}`)).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary-200 border-t-primary-600" />
      </div>
    );
  }

  if (error || !assessment) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <HiExclamationCircle className="text-4xl text-red-400 mx-auto mb-3" />
        <p className="text-gray-600">{error || 'Assessment not found'}</p>
        <Link to="/dashboard" className="text-primary-600 text-sm hover:underline mt-2 block">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const r = assessment.result;
  const totalItems =
    r.skillGaps.length +
    r.recommendedCertifications.length +
    r.projectSuggestions.length +
    r.resumeTips.length +
    r.interviewTips.length;
  const doneItems = assessment.completedItems?.length || 0;
  const pct = totalItems > 0 ? Math.round((doneItems / totalItems) * 100) : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-8">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-primary-600 mb-4"
        >
          <HiArrowLeft /> Back to Dashboard
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">
          Assessment: {assessment.jobRole}
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          {new Date(assessment.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      </div>

      {/* Summary + Progress */}
      <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl p-6 sm:p-8 text-white mb-6">
        <div className="flex items-start gap-3 mb-5">
          <HiArrowUpCircle className="text-2xl mt-0.5 shrink-0 opacity-80" />
          <div>
            <h2 className="font-semibold text-lg mb-2">Overall Assessment</h2>
            <p className="text-primary-100 leading-relaxed">{r.summary}</p>
          </div>
        </div>
        {/* Progress bar */}
        <div className="bg-white/20 rounded-full h-3 overflow-hidden">
          <div
            className="bg-white h-full rounded-full transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="flex items-center justify-between mt-2 text-sm text-primary-200">
          <span>Progress</span>
          <span className="font-semibold text-white">{doneItems}/{totalItems} items ({pct}%)</span>
        </div>
      </div>

      <div className="space-y-6">
        {/* Skill Gaps */}
        <Section
          icon={HiWrenchScrewdriver}
          title="Skill Gaps"
          color="text-red-700"
          count={countCompleted('skill', r.skillGaps)}
          total={r.skillGaps.length}
        >
          <div className="space-y-4">
            {r.skillGaps.map((gap, i) => (
              <CheckItem
                key={i}
                category="skill"
                item={`${i}`}
                completed={isCompleted('skill', `${i}`)}
                onToggle={handleToggle}
              >
                <div className="flex items-start gap-2">
                  <span
                    className={`shrink-0 text-xs font-semibold px-2 py-0.5 rounded-full ${
                      priorityBadge[gap.priority] || priorityBadge.medium
                    }`}
                  >
                    {gap.priority}
                  </span>
                  <div>
                    <p className="font-medium text-gray-900">{gap.skill}</p>
                    <p className="text-sm text-gray-500 mt-0.5">{gap.description}</p>
                  </div>
                </div>
              </CheckItem>
            ))}
          </div>
        </Section>

        {/* Recommended Certifications */}
        <Section
          icon={HiAcademicCap}
          title="Recommended Certifications"
          color="text-amber-700"
          count={countCompleted('cert', r.recommendedCertifications)}
          total={r.recommendedCertifications.length}
        >
          <div className="space-y-4">
            {r.recommendedCertifications.map((cert, i) => (
              <CheckItem
                key={i}
                category="cert"
                item={`${i}`}
                label={cert.name}
                completed={isCompleted('cert', `${i}`)}
                onToggle={handleToggle}
              >
                <p className="text-sm text-gray-500 mt-0.5">{cert.reason}</p>
              </CheckItem>
            ))}
          </div>
        </Section>

        {/* Project Suggestions */}
        <Section
          icon={HiLightBulb}
          title="Project Suggestions"
          color="text-green-700"
          count={countCompleted('project', r.projectSuggestions)}
          total={r.projectSuggestions.length}
        >
          <div className="space-y-5">
            {r.projectSuggestions.map((proj, i) => (
              <CheckItem
                key={i}
                category="project"
                item={`${i}`}
                label={proj.name}
                completed={isCompleted('project', `${i}`)}
                onToggle={handleToggle}
              >
                <p className="text-sm text-gray-500 mt-0.5">{proj.description}</p>
                {proj.skills?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {proj.skills.map((s) => (
                      <span
                        key={s}
                        className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                )}
              </CheckItem>
            ))}
          </div>
        </Section>

        {/* Resume Tips */}
        <Section
          icon={HiDocumentText}
          title="Resume Tips"
          color="text-purple-700"
          count={countCompleted('resume', r.resumeTips)}
          total={r.resumeTips.length}
        >
          <div className="space-y-3">
            {r.resumeTips.map((tip, i) => (
              <CheckItem
                key={i}
                category="resume"
                item={`${i}`}
                completed={isCompleted('resume', `${i}`)}
                onToggle={handleToggle}
              >
                <p className="text-sm text-gray-700">{tip}</p>
              </CheckItem>
            ))}
          </div>
        </Section>

        {/* Interview Tips */}
        <Section
          icon={HiChatBubbleLeftRight}
          title="Interview Preparation"
          color="text-blue-700"
          count={countCompleted('interview', r.interviewTips)}
          total={r.interviewTips.length}
        >
          <div className="space-y-3">
            {r.interviewTips.map((tip, i) => (
              <CheckItem
                key={i}
                category="interview"
                item={`${i}`}
                completed={isCompleted('interview', `${i}`)}
                onToggle={handleToggle}
              >
                <p className="text-sm text-gray-700">{tip}</p>
              </CheckItem>
            ))}
          </div>
        </Section>
      </div>
    </div>
  );
}
