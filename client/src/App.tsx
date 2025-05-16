import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardShell from './components/DashboardShell';
import Projects from './components/Projects';
import Forms from './components/Forms';
import EntriesPage from './components/EntriesPage';
import Users from './components/Users';

const DashboardHome = () => <div className="text-lg text-gray-700 dark:text-pink-200">Dashboard overview and stats go here.</div>;

const App = () => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-400 via-purple-300 to-pink-400 animate-gradient-x dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute>
              <DashboardShell>
                <Routes>
                  <Route path="" element={<DashboardHome />} />
                  <Route path="projects" element={<Projects />} />
                  <Route path="users" element={<Users />} />
                  <Route path="forms" element={<Forms />} />
                  <Route path="entries" element={<EntriesPage />} />
                </Routes>
              </DashboardShell>
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </div>
  );
};

export default App;
