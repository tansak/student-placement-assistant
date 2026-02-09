import { HiCheck } from 'react-icons/hi2';

const steps = ['Education', 'Skills', 'Experience', 'Projects', 'Certifications'];

export default function StepIndicator({ current }) {
  return (
    <div className="flex items-center justify-center gap-1 mb-8">
      {steps.map((label, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <div key={label} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium transition-colors
                  ${done ? 'bg-primary-600 text-white' : ''}
                  ${active ? 'bg-primary-600 text-white ring-4 ring-primary-100' : ''}
                  ${!done && !active ? 'bg-gray-200 text-gray-500' : ''}`}
              >
                {done ? <HiCheck className="text-lg" /> : i + 1}
              </div>
              <span
                className={`text-xs mt-1.5 hidden sm:block ${active ? 'text-primary-700 font-semibold' : 'text-gray-400'}`}
              >
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={`w-8 md:w-14 h-0.5 mx-1 mt-[-1rem] sm:mt-[-0.2rem] ${
                  i < current ? 'bg-primary-600' : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
