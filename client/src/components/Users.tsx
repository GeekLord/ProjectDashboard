import { useEffect, useState } from 'react';

interface User {
  id: number;
  username: string;
  role: 'admin' | 'project_manager';
  last_login_ip?: string;
  last_login_at?: string;
  created_at?: string;
}

const ROLES = [
  { value: '', label: 'All Roles' },
  { value: 'admin', label: 'Admin' },
  { value: 'project_manager', label: 'Project Manager' },
];

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [modalUser, setModalUser] = useState<Partial<User> | null>(null);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');

  const token = localStorage.getItem('token');

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to fetch users');
      setUsers(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line
  }, []);

  const filteredUsers = users.filter(
    u =>
      (!role || u.role === role) &&
      (u.username.toLowerCase().includes(search.toLowerCase()) ||
        u.id.toString().includes(search))
  );

  const openAddModal = () => {
    setModalUser({ username: '', password: '', role: 'project_manager' });
    setModalMode('add');
    setShowModal(true);
  };

  const openEditModal = (user: User) => {
    setModalUser({ ...user, password: '' });
    setModalMode('edit');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalUser(null);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this user?')) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to delete user');
      fetchUsers();
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
        ? `${import.meta.env.VITE_API_URL}/api/users`
        : `${import.meta.env.VITE_API_URL}/api/users/${modalUser?.id}`;
      const body = JSON.stringify({
        username: modalUser?.username,
        password: modalUser?.password,
        role: modalUser?.role,
      });
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body,
      });
      if (!res.ok) throw new Error('Failed to save user');
      closeModal();
      fetchUsers();
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
          placeholder="Search by username or ID..."
          className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:text-white"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select
          className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:text-white"
          value={role}
          onChange={e => setRole(e.target.value)}
        >
          {ROLES.map(r => (
            <option key={r.value} value={r.value}>{r.label}</option>
          ))}
        </select>
        <button
          className="ml-auto bg-gradient-to-r from-blue-500 to-pink-500 text-white font-semibold px-4 py-2 rounded shadow hover:from-pink-500 hover:to-blue-500 transition-colors"
          onClick={openAddModal}
        >
          + Add User
        </button>
      </div>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <div className="overflow-x-auto rounded shadow">
        <table className="min-w-full bg-white dark:bg-gray-900">
          <thead>
            <tr className="bg-blue-100 dark:bg-gray-800">
              <th className="p-2 text-left">ID</th>
              <th className="p-2 text-left">Username</th>
              <th className="p-2 text-left">Role</th>
              <th className="p-2 text-left">Last Login IP</th>
              <th className="p-2 text-left">Last Login</th>
              <th className="p-2 text-left">Created</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id} className="border-b hover:bg-blue-50 dark:hover:bg-gray-800">
                <td className="p-2">{user.id}</td>
                <td className="p-2">{user.username}</td>
                <td className="p-2 capitalize">{user.role.replace('_', ' ')}</td>
                <td className="p-2">{user.last_login_ip || '-'}</td>
                <td className="p-2">{user.last_login_at ? new Date(user.last_login_at).toLocaleString() : '-'}</td>
                <td className="p-2">{user.created_at ? new Date(user.created_at).toLocaleDateString() : '-'}</td>
                <td className="p-2 flex gap-2">
                  <button
                    className="px-2 py-1 rounded bg-blue-500 text-white hover:bg-blue-700"
                    onClick={() => openEditModal(user)}
                  >Edit</button>
                  <button
                    className="px-2 py-1 rounded bg-pink-500 text-white hover:bg-pink-700"
                    onClick={() => handleDelete(user.id)}
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
            <h2 className="text-2xl font-bold mb-2 text-blue-700 dark:text-pink-400">{modalMode === 'add' ? 'Add User' : 'Edit User'}</h2>
            <label className="font-medium">Username</label>
            <input
              type="text"
              className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:text-white"
              value={modalUser?.username || ''}
              onChange={e => setModalUser(u => ({ ...u!, username: e.target.value }))}
              required
            />
            <label className="font-medium">Password {modalMode === 'edit' && <span className="text-xs text-gray-400">(leave blank to keep unchanged)</span>}</label>
            <input
              type="password"
              className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:text-white"
              value={modalUser?.password || ''}
              onChange={e => setModalUser(u => ({ ...u!, password: e.target.value }))}
              required={modalMode === 'add'}
            />
            <label className="font-medium">Role</label>
            <select
              className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:text-white"
              value={modalUser?.role || 'project_manager'}
              onChange={e => setModalUser(u => ({ ...u!, role: e.target.value as User['role'] }))}
              required
            >
              <option value="admin">Admin</option>
              <option value="project_manager">Project Manager</option>
            </select>
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

export default Users; 