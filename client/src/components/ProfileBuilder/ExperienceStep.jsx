import Input from '../UI/Input';
import Button from '../UI/Button';
import { HiPlus, HiTrash } from 'react-icons/hi2';

const empty = { title: '', company: '', duration: '', description: '' };

export default function ExperienceStep({ data, onChange }) {
  const add = () => onChange([...data, { ...empty }]);

  const remove = (i) => onChange(data.filter((_, idx) => idx !== i));

  const update = (i, field, value) => {
    const updated = data.map((item, idx) =>
      idx === i ? { ...item, [field]: value } : item
    );
    onChange(updated);
  };

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-1">Experience</h3>
      <p className="text-sm text-gray-500 mb-6">
        Add internships, jobs, or relevant work experience (optional)
      </p>

      {data.length === 0 && (
        <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-300 mb-4">
          <p className="text-sm text-gray-400 mb-3">No experience added yet</p>
          <Button type="button" variant="outline" onClick={add}>
            <HiPlus className="mr-1" /> Add Experience
          </Button>
        </div>
      )}

      <div className="space-y-6">
        {data.map((exp, i) => (
          <div key={i} className="bg-gray-50 rounded-xl border border-gray-200 p-5 relative">
            <button
              type="button"
              onClick={() => remove(i)}
              className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition-colors"
            >
              <HiTrash />
            </button>
            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <Input
                label="Job Title / Role"
                placeholder="e.g. Software Intern"
                value={exp.title}
                onChange={(e) => update(i, 'title', e.target.value)}
              />
              <Input
                label="Company"
                placeholder="e.g. Google"
                value={exp.company}
                onChange={(e) => update(i, 'company', e.target.value)}
              />
            </div>
            <Input
              label="Duration"
              placeholder="e.g. Jun 2024 – Aug 2024"
              value={exp.duration}
              onChange={(e) => update(i, 'duration', e.target.value)}
              className="mb-4"
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                rows={3}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm
                  focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                placeholder="What did you work on?"
                value={exp.description}
                onChange={(e) => update(i, 'description', e.target.value)}
              />
            </div>
          </div>
        ))}
      </div>

      {data.length > 0 && (
        <button
          type="button"
          onClick={add}
          className="mt-4 text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
        >
          <HiPlus /> Add another
        </button>
      )}
    </div>
  );
}
