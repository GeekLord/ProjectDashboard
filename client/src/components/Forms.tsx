import { useEffect, useState } from 'react';

interface Project {
  id: number;
  name: string;
}

interface FormField {
  name: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'textarea' | 'dropdown';
  required: boolean;
  options?: string[]; // for dropdown
}

const FIELD_TYPES = [
  { value: 'text', label: 'Text' },
  { value: 'number', label: 'Number' },
  { value: 'date', label: 'Date' },
  { value: 'textarea', label: 'Textarea' },
  { value: 'dropdown', label: 'Dropdown' },
];

const Forms = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const [fields, setFields] = useState<FormField[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const token = localStorage.getItem('token');

  const fetchProjects = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/projects`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setProjects(data);
    } catch {}
  };

  const fetchForm = async (projectId: number) => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/forms/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setFields(JSON.parse(data.schema));
      } else {
        setFields([]); // No form yet
      }
    } catch {
      setFields([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    if (selectedProject) fetchForm(selectedProject);
  }, [selectedProject]);

  const handleAddField = () => {
    setFields([...fields, { name: '', label: '', type: 'text', required: false }]);
  };

  const handleRemoveField = (idx: number) => {
    setFields(fields.filter((_, i) => i !== idx));
  };

  const handleFieldChange = (idx: number, key: keyof FormField, value: any) => {
    setFields(fields.map((f, i) => (i === idx ? { ...f, [key]: value } : f)));
  };

  const handleOptionsChange = (idx: number, options: string) => {
    setFields(fields.map((f, i) => (i === idx ? { ...f, options: options.split(',').map(o => o.trim()) } : f)));
  };

  const handleMoveField = (from: number, to: number) => {
    if (to < 0 || to >= fields.length) return;
    const updated = [...fields];
    const [moved] = updated.splice(from, 1);
    updated.splice(to, 0, moved);
    setFields(updated);
  };

  const handleSave = async () => {
    if (!selectedProject) return;
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/forms/${selectedProject}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ schema: fields }),
      });
      if (!res.ok) throw new Error('Failed to save form');
      setSuccess('Form saved!');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
        <select
          className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:text-white"
          value={selectedProject || ''}
          onChange={e => setSelectedProject(Number(e.target.value))}
        >
          <option value="">Select Project</option>
          {projects.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
        <button
          className="ml-auto bg-gradient-to-r from-blue-500 to-pink-500 text-white font-semibold px-4 py-2 rounded shadow hover:from-pink-500 hover:to-blue-500 transition-colors"
          onClick={handleAddField}
          disabled={!selectedProject}
        >
          + Add Field
        </button>
      </div>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      {success && <div className="text-green-600 mb-2">{success}</div>}
      {selectedProject && (
        <div className="overflow-x-auto rounded shadow bg-white dark:bg-gray-900 p-4">
          <table className="min-w-full">
            <thead>
              <tr className="bg-blue-100 dark:bg-gray-800">
                <th className="p-2 text-left">Label</th>
                <th className="p-2 text-left">Name</th>
                <th className="p-2 text-left">Type</th>
                <th className="p-2 text-left">Required</th>
                <th className="p-2 text-left">Options</th>
                <th className="p-2 text-left">Order</th>
                <th className="p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {fields.map((field, idx) => (
                <tr key={idx} className="border-b hover:bg-blue-50 dark:hover:bg-gray-800">
                  <td className="p-2">
                    <input
                      type="text"
                      className="border rounded px-2 py-1 w-32 dark:bg-gray-800 dark:text-white"
                      value={field.label}
                      onChange={e => handleFieldChange(idx, 'label', e.target.value)}
                      required
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="text"
                      className="border rounded px-2 py-1 w-32 dark:bg-gray-800 dark:text-white"
                      value={field.name}
                      onChange={e => handleFieldChange(idx, 'name', e.target.value)}
                      required
                    />
                  </td>
                  <td className="p-2">
                    <select
                      className="border rounded px-2 py-1 dark:bg-gray-800 dark:text-white"
                      value={field.type}
                      onChange={e => handleFieldChange(idx, 'type', e.target.value)}
                    >
                      {FIELD_TYPES.map(ft => (
                        <option key={ft.value} value={ft.value}>{ft.label}</option>
                      ))}
                    </select>
                  </td>
                  <td className="p-2 text-center">
                    <input
                      type="checkbox"
                      checked={field.required}
                      onChange={e => handleFieldChange(idx, 'required', e.target.checked)}
                    />
                  </td>
                  <td className="p-2">
                    {field.type === 'dropdown' ? (
                      <input
                        type="text"
                        className="border rounded px-2 py-1 w-32 dark:bg-gray-800 dark:text-white"
                        value={field.options?.join(', ') || ''}
                        onChange={e => handleOptionsChange(idx, e.target.value)}
                        placeholder="Option1, Option2"
                      />
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="p-2 flex gap-1">
                    <button
                      type="button"
                      className="px-2 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-blue-200 dark:hover:bg-blue-800"
                      onClick={() => handleMoveField(idx, idx - 1)}
                      disabled={idx === 0}
                    >↑</button>
                    <button
                      type="button"
                      className="px-2 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-blue-200 dark:hover:bg-blue-800"
                      onClick={() => handleMoveField(idx, idx + 1)}
                      disabled={idx === fields.length - 1}
                    >↓</button>
                  </td>
                  <td className="p-2">
                    <button
                      type="button"
                      className="px-2 py-1 rounded bg-pink-500 text-white hover:bg-pink-700"
                      onClick={() => handleRemoveField(idx)}
                    >Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            className="mt-6 bg-gradient-to-r from-blue-500 to-pink-500 text-white font-semibold px-6 py-2 rounded shadow hover:from-pink-500 hover:to-blue-500 transition-colors"
            onClick={handleSave}
            disabled={loading}
          >
            Save Form
          </button>
        </div>
      )}
    </div>
  );
};

export default Forms; 