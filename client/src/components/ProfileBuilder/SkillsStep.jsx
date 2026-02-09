import { useState } from 'react';
import Button from '../UI/Button';
import { HiXMark, HiPlus } from 'react-icons/hi2';

const SUGGESTIONS = [
  'JavaScript', 'Python', 'Java', 'C++', 'React', 'Node.js', 'SQL',
  'MongoDB', 'Git', 'Docker', 'AWS', 'TypeScript', 'HTML/CSS',
  'Machine Learning', 'Data Structures', 'REST APIs',
];

export default function SkillsStep({ data, onChange }) {
  const [input, setInput] = useState('');

  const addSkill = (skill) => {
    const trimmed = skill.trim();
    if (trimmed && !data.includes(trimmed)) {
      onChange([...data, trimmed]);
    }
    setInput('');
  };

  const removeSkill = (skill) => {
    onChange(data.filter((s) => s !== skill));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill(input);
    }
  };

  const unusedSuggestions = SUGGESTIONS.filter((s) => !data.includes(s));

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-1">Skills</h3>
      <p className="text-sm text-gray-500 mb-6">Add your technical and soft skills</p>

      <div className="flex gap-2 mb-4">
        <input
          className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 text-sm
            focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder="Type a skill and press Enter"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <Button type="button" onClick={() => addSkill(input)} disabled={!input.trim()}>
          <HiPlus />
        </Button>
      </div>

      {data.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {data.map((skill) => (
            <span
              key={skill}
              className="inline-flex items-center gap-1 bg-primary-50 text-primary-700 text-sm
                font-medium px-3 py-1.5 rounded-full"
            >
              {skill}
              <button
                type="button"
                onClick={() => removeSkill(skill)}
                className="hover:text-primary-900"
              >
                <HiXMark className="text-base" />
              </button>
            </span>
          ))}
        </div>
      )}

      {unusedSuggestions.length > 0 && (
        <div>
          <p className="text-xs text-gray-400 mb-2">Quick add:</p>
          <div className="flex flex-wrap gap-1.5">
            {unusedSuggestions.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => addSkill(s)}
                className="text-xs px-3 py-1.5 rounded-full border border-gray-200
                  text-gray-500 hover:border-primary-300 hover:text-primary-600 transition-colors"
              >
                + {s}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
