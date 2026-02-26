import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DatabaseProvider } from './context/DatabaseContext';
import Login from './pages/Login';
import StudentDashboard from './pages/Student/Dashboard';
import ParentDashboard from './pages/Parent/Dashboard';
import SecurityDashboard from './pages/Security/Dashboard';
import VisitorEntry from './pages/Security/VisitorEntry';
import History from './pages/Security/History';
import Analytics from './pages/Security/Analytics';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/login" />;

  return children;
};

function App() {
  return (
    <DatabaseProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />

            <Route path="/student/*" element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentDashboard />
              </ProtectedRoute>
            } />

            <Route path="/parent/*" element={
              <ProtectedRoute allowedRoles={['parent']}>
                <ParentDashboard />
              </ProtectedRoute>
            } />

            <Route path="/security/*" element={
              <ProtectedRoute allowedRoles={['security']}>
                <Routes>
                  <Route path="/" element={<SecurityDashboard />} />
                  <Route path="/entry" element={<VisitorEntry />} />
                  <Route path="/history" element={<History />} />
                  <Route path="/analytics" element={<Analytics />} />
                </Routes>
              </ProtectedRoute>
            } />

            <Route path="/" element={<Navigate to="/login" />} />
          </Routes>
        </Router>
      </AuthProvider>
    </DatabaseProvider>
  );
}

export default App;
