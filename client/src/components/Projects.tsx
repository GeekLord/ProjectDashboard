import { useEffect, useState } from 'react';

interface Project {
  id: number;
  name: string;
  description?: string;
  created_by?: number;
  created_at?: string;
  managers?: number[];
}

interface User {
  id: number;
  username: string;
  role: 'admin' | 'project_manager';
}

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [manager, setManager] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [modalProject, setModalProject] = useState<Partial<Project> | null>(null);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');

  const token = localStorage.getItem('token');

  const fetchProjects = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/projects`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to fetch projects');
      setProjects(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setUsers(data.filter((u: User) => u.role === 'project_manager'));
    } catch {}
  };

  useEffect(() => {
    fetchProjects();
    fetchUsers();
    // eslint-disable-next-line
  }, []);

  const filteredProjects = projects.filter(
    p =>
      (!search || p.name.toLowerCase().includes(search.toLowerCase())) &&
      (!manager || (p.managers && p.managers.includes(Number(manager))))
  );

  const openAddModal = () => {
    setModalProject({ name: '', description: '' });
    setModalMode('add');
    setShowModal(true);
  };

  const openEditModal = (project: Project) => {
    setModalProject({ ...project });
    setModalMode('edit');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalProject(null);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this project?')) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/projects/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to delete project');
      fetchProjects();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const method = modalMode === 'add' ? 'POST' : 'PUT';
      const url = modalMode === 'add'
        ? `${import.meta.env.VITE_API_URL}/api/projects`
        : `${import.meta.env.VITE_API_URL}/api/projects/${modalProject?.id}`;
      const body = JSON.stringify({
        name: modalProject?.name,
        description: modalProject?.description,
      });
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body,
      });
      if (!res.ok) throw new Error('Failed to save project');
      closeModal();
      fetchProjects();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Assign/unassign manager
  const handleAssign = async (projectId: number, userId: number, action: 'assign' | 'unassign') => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/projects/${projectId}/assign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ user_id: userId, action }),
      });
      if (!res.ok) throw new Error('Failed to update assignment');
      fetchProjects();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by project name..."
          className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:text-white"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select
          className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:text-white"
          value={manager}
          onChange={e => setManager(e.target.value)}
        >
          <option value="">All Managers</option>
          {users.map(u => (
            <option key={u.id} value={u.id}>{u.username}</option>
          ))}
        </select>
        <button
          className="ml-auto bg-gradient-to-r from-blue-500 to-pink-500 text-white font-semibold px-4 py-2 rounded shadow hover:from-pink-500 hover:to-blue-500 transition-colors"
          onClick={openAddModal}
        >
          + Add Project
        </button>
      </div>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <div className="overflow-x-auto rounded shadow">
        <table className="min-w-full bg-white dark:bg-gray-900">
          <thead>
            <tr className="bg-blue-100 dark:bg-gray-800">
              <th className="p-2 text-left">ID</th>
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Description</th>
              <th className="p-2 text-left">Managers</th>
              <th className="p-2 text-left">Created</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProjects.map(project => (
              <tr key={project.id} className="border-b hover:bg-blue-50 dark:hover:bg-gray-800">
                <td className="p-2">{project.id}</td>
                <td className="p-2">{project.name}</td>
                <td className="p-2">{project.description || '-'}</td>
                <td className="p-2 flex flex-wrap gap-2">
                  {users.map(u => (
                    <span key={u.id}>
                      <button
                        className={`px-2 py-1 rounded text-xs font-semibold transition-colors ${project.managers && project.managers.includes(u.id)
                          ? 'bg-pink-500 text-white hover:bg-pink-700'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-blue-200 dark:hover:bg-blue-800'}`}
                        onClick={() => handleAssign(project.id, u.id, project.managers && project.managers.includes(u.id) ? 'unassign' : 'assign')}
                      >
                        {u.username} {project.managers && project.managers.includes(u.id) ? '✓' : ''}
                      </button>
                    </span>
                  ))}
                </td>
                <td className="p-2">{project.created_at ? new Date(project.created_at).toLocaleDateString() : '-'}</td>
                <td className="p-2 flex gap-2">
                  <button
                    className="px-2 py-1 rounded bg-blue-500 text-white hover:bg-blue-700"
                    onClick={() => openEditModal(project)}
                  >Edit</button>
                  <button
                    className="px-2 py-1 rounded bg-pink-500 text-white hover:bg-pink-700"
                    onClick={() => handleDelete(project.id)}
                  >Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <form
            className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8 w-full max-w-md flex flex-col gap-4 animate-fade-in"
            onSubmit={handleModalSubmit}
          >
            <h2 className="text-2xl font-bold mb-2 text-blue-700 dark:text-pink-400">{modalMode === 'add' ? 'Add Project' : 'Edit Project'}</h2>
            <label className="font-medium">Name</label>
            <input
              type="text"
              className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:text-white"
              value={modalProject?.name || ''}
              onChange={e => setModalProject(p => ({ ...p!, name: e.target.value }))}
              required
            />
            <label className="font-medium">Description</label>
            <textarea
              className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:text-white"
              value={modalProject?.description || ''}
              onChange={e => setModalProject(p => ({ ...p!, description: e.target.value }))}
              rows={3}
            />
            <div className="flex gap-2 mt-4">
              <button
                type="submit"
                className="bg-blue-600 text-white rounded py-2 px-4 font-semibold hover:bg-blue-700 transition-colors"
                disabled={loading}
              >
                {modalMode === 'add' ? 'Add' : 'Save'}
              </button>
              <button
                type="button"
                className="bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white rounded py-2 px-4 font-semibold hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors"
                onClick={closeModal}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Projects; 