import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full">
      <form
        className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md flex flex-col gap-4 animate-fade-in"
        onSubmit={handleSubmit}
        aria-label="Sign in form"
      >
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-1">Morsel Project Dashboard</h1>
        <p className="text-center text-gray-500 mb-4">Sign in to your account</p>
        <label htmlFor="email" className="text-gray-700 font-medium">
          Email
        </label>
        <input
          id="email"
          type="email"
          className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          autoFocus
        />
        <label htmlFor="password" className="text-gray-700 font-medium">
          Password
        </label>
        <input
          id="password"
          type="password"
          className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        {error && <div className="text-red-500 text-sm text-center">{error}</div>}
        <button
          type="submit"
          className="bg-blue-600 text-white rounded py-2 mt-2 font-semibold hover:bg-blue-700 transition-colors disabled:opacity-60"
          disabled={loading}
          aria-label="Sign In"
        >
          {loading ? 'Signing In...' : 'Sign In'}
        </button>
        <a
          href="#"
          className="text-blue-600 text-center mt-2 hover:underline"
          tabIndex={0}
          aria-label="Forgot Password?"
        >
          Forgot Password?
        </a>
      </form>
    </div>
  );
};

export default LoginPage; 