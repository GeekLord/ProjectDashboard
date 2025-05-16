import { useState, useEffect } from 'react';
import DynamicForm, { FormField } from './DynamicForm';
import EntriesTable, { Entry } from './EntriesTable';

const EntriesPage = () => {
  const [tab, setTab] = useState<'new' | 'list'>('new');
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState<any | null>(null);
  const [formSchema, setFormSchema] = useState<FormField[] | null>(null);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch assigned projects on mount
  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/projects', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        if (!res.ok) throw new Error('Failed to fetch projects');
        const data = await res.json();
        setProjects(data);
        if (data.length > 0) setSelectedProject(data[0]);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  // Fetch form schema when selectedProject changes
  useEffect(() => {
    if (!selectedProject) return;
    const fetchFormSchema = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/forms/${selectedProject.id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        if (!res.ok) throw new Error('Failed to fetch form schema');
        const data = await res.json();
        setFormSchema(data.schema);
      } catch (err: any) {
        setError(err.message);
        setFormSchema(null);
      } finally {
        setLoading(false);
      }
    };
    fetchFormSchema();
  }, [selectedProject]);

  // Fetch entries for the current user
  useEffect(() => {
    if (tab !== 'list') return;
    const fetchEntries = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/entries', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        if (!res.ok) throw new Error('Failed to fetch entries');
        const data = await res.json();
        setEntries(data.filter((e: Entry) => selectedProject ? e.project_id === selectedProject.id : true));
      } catch (err: any) {
        setError(err.message);
        setEntries([]);
      } finally {
        setLoading(false);
      }
    };
    fetchEntries();
  }, [tab, selectedProject]);

  const handleProjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const proj = projects.find(p => p.id === Number(e.target.value));
    setSelectedProject(proj);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex gap-4 mb-4">
        <button
          className={`px-4 py-2 rounded font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${tab === 'new' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-200'}`}
          onClick={() => setTab('new')}
          aria-label="Switch to New Entry tab"
        >
          New Entry
        </button>
        <button
          className={`px-4 py-2 rounded font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${tab === 'list' ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-200'}`}
          onClick={() => setTab('list')}
          aria-label="Switch to My Entries tab"
        >
          My Entries
        </button>
      </div>
      {error && <div className="text-red-500">{error}</div>}
      <div className="mb-4">
        <label htmlFor="project-select" className="mr-2 font-semibold">Project:</label>
        <select
          id="project-select"
          value={selectedProject?.id || ''}
          onChange={handleProjectChange}
          className="px-2 py-1 rounded border dark:bg-gray-800 dark:text-gray-100"
          aria-label="Select project"
        >
          {projects.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </div>
      <div>
        {tab === 'new' ? (
          <div>
            {/* DynamicForm will go here */}
            <div className="text-gray-500">DynamicForm placeholder</div>
          </div>
        ) : (
          <div>
            {/* EntriesTable will go here */}
            <div className="text-gray-500">EntriesTable placeholder</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EntriesPage; 