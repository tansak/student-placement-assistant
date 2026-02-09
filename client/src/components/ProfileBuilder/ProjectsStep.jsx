import { useState } from 'react';
import Input from '../UI/Input';
import Button from '../UI/Button';
import { HiPlus, HiTrash, HiXMark } from 'react-icons/hi2';

const empty = { name: '', description: '', techStack: [], link: '' };

export default function ProjectsStep({ data, onChange }) {
  const [techInputs, setTechInputs] = useState({});

  const add = () => onChange([...data, { ...empty }]);
  const remove = (i) => onChange(data.filter((_, idx) => idx !== i));

  const update = (i, field, value) => {
    const updated = data.map((item, idx) =>
      idx === i ? { ...item, [field]: value } : item
    );
    onChange(updated);
  };

  const addTech = (i) => {
    const val = (techInputs[i] || '').trim();
    if (val && !data[i].techStack.includes(val)) {
      update(i, 'techStack', [...data[i].techStack, val]);
    }
    setTechInputs({ ...techInputs, [i]: '' });
  };

  const removeTech = (i, tech) => {
    update(i, 'techStack', data[i].techStack.filter((t) => t !== tech));
  };

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-1">Projects</h3>
      <p className="text-sm text-gray-500 mb-6">
        Showcase projects you&apos;ve built (optional)
      </p>

      {data.length === 0 && (
        <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-300 mb-4">
          <p className="text-sm text-gray-400 mb-3">No projects added yet</p>
          <Button type="button" variant="outline" onClick={add}>
            <HiPlus className="mr-1" /> Add Project
          </Button>
        </div>
      )}

      <div className="space-y-6">
        {data.map((proj, i) => (
          <div key={i} className="bg-gray-50 rounded-xl border border-gray-200 p-5 relative">
            <button
              type="button"
              onClick={() => remove(i)}
              className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition-colors"
            >
              <HiTrash />
            </button>
            <Input
              label="Project Name"
              placeholder="e.g. E-Commerce Platform"
              value={proj.name}
              onChange={(e) => update(i, 'name', e.target.value)}
              className="mb-4"
            />
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                rows={3}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm
                  focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                placeholder="What does this project do?"
                value={proj.description}
                onChange={(e) => update(i, 'description', e.target.value)}
              />
            </div>

            {/* Tech stack tags */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Tech Stack</label>
              <div className="flex gap-2 mb-2">
                <input
                  className="flex-1 px-3 py-2 rounded-lg border border-gray-300 text-sm
                    focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Add technology"
                  value={techInputs[i] || ''}
                  onChange={(e) => setTechInputs({ ...techInputs, [i]: e.target.value })}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addTech(i);
                    }
                  }}
                />
                <Button type="button" onClick={() => addTech(i)} disabled={!(techInputs[i] || '').trim()}>
                  <HiPlus />
                </Button>
              </div>
              {proj.techStack.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {proj.techStack.map((t) => (
                    <span
                      key={t}
                      className="inline-flex items-center gap-1 bg-primary-50 text-primary-700 text-xs
                        font-medium px-2.5 py-1 rounded-full"
                    >
                      {t}
                      <button type="button" onClick={() => removeTech(i, t)} className="hover:text-primary-900">
                        <HiXMark />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <Input
              label="Link (optional)"
              placeholder="https://github.com/you/project"
              value={proj.link}
              onChange={(e) => update(i, 'link', e.target.value)}
            />
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
