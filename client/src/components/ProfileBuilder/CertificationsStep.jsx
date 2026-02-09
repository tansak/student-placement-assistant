import Input from '../UI/Input';
import Button from '../UI/Button';
import { HiPlus, HiTrash } from 'react-icons/hi2';

const empty = { name: '', issuer: '', year: '' };

export default function CertificationsStep({ data, onChange }) {
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
      <h3 className="text-lg font-semibold text-gray-900 mb-1">Certifications</h3>
      <p className="text-sm text-gray-500 mb-6">
        Add any certifications or courses you&apos;ve completed (optional)
      </p>

      {data.length === 0 && (
        <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-300 mb-4">
          <p className="text-sm text-gray-400 mb-3">No certifications added yet</p>
          <Button type="button" variant="outline" onClick={add}>
            <HiPlus className="mr-1" /> Add Certification
          </Button>
        </div>
      )}

      <div className="space-y-4">
        {data.map((cert, i) => (
          <div key={i} className="bg-gray-50 rounded-xl border border-gray-200 p-5 relative">
            <button
              type="button"
              onClick={() => remove(i)}
              className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition-colors"
            >
              <HiTrash />
            </button>
            <div className="grid sm:grid-cols-3 gap-4">
              <Input
                label="Certification Name"
                placeholder="e.g. AWS Cloud Practitioner"
                value={cert.name}
                onChange={(e) => update(i, 'name', e.target.value)}
                className="sm:col-span-2"
              />
              <Input
                label="Year"
                type="number"
                placeholder="2024"
                value={cert.year}
                onChange={(e) => update(i, 'year', e.target.value ? Number(e.target.value) : '')}
              />
            </div>
            <Input
              label="Issuer"
              placeholder="e.g. Amazon Web Services"
              value={cert.issuer}
              onChange={(e) => update(i, 'issuer', e.target.value)}
              className="mt-4"
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
