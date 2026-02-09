import Input from '../UI/Input';

export default function EducationStep({ data, onChange }) {
  const update = (field, value) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-1">Education</h3>
      <p className="text-sm text-gray-500 mb-6">Tell us about your academic background</p>

      <div className="space-y-4">
        <Input
          label="Degree"
          placeholder="e.g. B.Tech, B.E., M.Tech, BCA, MCA"
          value={data.degree || ''}
          onChange={(e) => update('degree', e.target.value)}
        />
        <Input
          label="Branch / Specialization"
          placeholder="e.g. Computer Science, Information Technology"
          value={data.branch || ''}
          onChange={(e) => update('branch', e.target.value)}
        />
        <Input
          label="College / University"
          placeholder="e.g. IIT Delhi, VIT Vellore"
          value={data.college || ''}
          onChange={(e) => update('college', e.target.value)}
        />
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Graduation Year"
            type="number"
            placeholder="e.g. 2025"
            value={data.graduationYear || ''}
            onChange={(e) => update('graduationYear', e.target.value ? Number(e.target.value) : null)}
          />
          <Input
            label="CGPA / Percentage"
            type="number"
            step="0.01"
            placeholder="e.g. 8.5"
            value={data.cgpa || ''}
            onChange={(e) => update('cgpa', e.target.value ? Number(e.target.value) : null)}
          />
        </div>
      </div>
    </div>
  );
}
