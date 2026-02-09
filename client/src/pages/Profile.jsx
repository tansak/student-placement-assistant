import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { updateProfile } from '../services/api';
import StepIndicator from '../components/ProfileBuilder/StepIndicator';
import EducationStep from '../components/ProfileBuilder/EducationStep';
import SkillsStep from '../components/ProfileBuilder/SkillsStep';
import ExperienceStep from '../components/ProfileBuilder/ExperienceStep';
import ProjectsStep from '../components/ProfileBuilder/ProjectsStep';
import CertificationsStep from '../components/ProfileBuilder/CertificationsStep';
import Button from '../components/UI/Button';
import { HiArrowLeft, HiArrowRight, HiCheck } from 'react-icons/hi2';

const TOTAL_STEPS = 5;

export default function Profile() {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const [education, setEducation] = useState({
    degree: '', branch: '', college: '', graduationYear: null, cgpa: null,
  });
  const [skills, setSkills] = useState([]);
  const [experience, setExperience] = useState([]);
  const [projects, setProjects] = useState([]);
  const [certifications, setCertifications] = useState([]);

  // Load existing profile data
  useEffect(() => {
    if (user?.profile) {
      const p = user.profile;
      if (p.education) {
        setEducation({
          degree: p.education.degree || '',
          branch: p.education.branch || '',
          college: p.education.college || '',
          graduationYear: p.education.graduationYear || null,
          cgpa: p.education.cgpa || null,
        });
      }
      if (p.skills?.length) setSkills(p.skills);
      if (p.experience?.length) setExperience(p.experience);
      if (p.projects?.length) setProjects(p.projects);
      if (p.certifications?.length) setCertifications(p.certifications);
    }
  }, [user]);

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      await updateProfile({ education, skills, experience, projects, certifications });
      await refreshUser();
      setSaved(true);
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const next = () => setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));
  const prev = () => setStep((s) => Math.max(s - 1, 0));

  const renderStep = () => {
    switch (step) {
      case 0: return <EducationStep data={education} onChange={setEducation} />;
      case 1: return <SkillsStep data={skills} onChange={setSkills} />;
      case 2: return <ExperienceStep data={experience} onChange={setExperience} />;
      case 3: return <ProjectsStep data={projects} onChange={setProjects} />;
      case 4: return <CertificationsStep data={certifications} onChange={setCertifications} />;
      default: return null;
    }
  };

  if (saved) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <HiCheck className="text-3xl text-green-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Profile Saved!</h2>
        <p className="text-gray-500 text-sm">Redirecting to dashboard...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-2 text-center">Build Your Profile</h1>
      <p className="text-sm text-gray-500 text-center mb-8">
        Complete each section so our AI can provide the best recommendations
      </p>

      <StepIndicator current={step} />

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8">
        {error && (
          <div className="bg-red-50 text-red-700 text-sm rounded-lg px-4 py-3 mb-4">
            {error}
          </div>
        )}

        {renderStep()}

        {/* Navigation buttons */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
          {step > 0 ? (
            <Button type="button" variant="secondary" onClick={prev}>
              <HiArrowLeft className="mr-1" /> Back
            </Button>
          ) : (
            <div />
          )}

          {step < TOTAL_STEPS - 1 ? (
            <Button type="button" onClick={next}>
              Next <HiArrowRight className="ml-1" />
            </Button>
          ) : (
            <Button type="button" onClick={handleSave} loading={saving}>
              <HiCheck className="mr-1" /> Save Profile
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
