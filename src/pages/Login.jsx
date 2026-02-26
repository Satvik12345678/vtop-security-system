import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { User, Shield, Users } from 'lucide-react';
import { cn } from '../lib/utils'; // Assuming you have this utility

export default function Login() {
    const [role, setRole] = useState('student'); // student, parent, security
    const [identifier, setIdentifier] = useState('21BCE1001'); // Default for demo
    const [password, setPassword] = useState('password');
    const { login } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        if (login(role, identifier, password)) {
            navigate('/' + role);
        } else {
            setError('Invalid credentials');
        }
    };

    // Clear or preset identifier when role changes
    const handleRoleChange = (newRole) => {
        setRole(newRole);
        setError('');
        if (newRole === 'student') setIdentifier('21BCE1001');
        if (newRole === 'parent') setIdentifier('9876543210');
        if (newRole === 'security') setIdentifier('G101');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold text-center mb-6 text-primary">VTOP Login</h2>

                <div className="flex justify-center space-x-4 mb-6">
                    <button
                        onClick={() => handleRoleChange('student')}
                        className={cn("flex flex-col items-center p-3 rounded-lg w-24 transition-colors",
                            role === 'student' ? "bg-blue-100 border-2 border-blue-500 text-blue-700" : "bg-gray-50 text-gray-500 hover:bg-gray-100")}
                    >
                        <User className="h-6 w-6 mb-1" />
                        <span className="text-xs font-semibold">Student</span>
                    </button>
                    <button
                        onClick={() => handleRoleChange('parent')}
                        className={cn("flex flex-col items-center p-3 rounded-lg w-24 transition-colors",
                            role === 'parent' ? "bg-purple-100 border-2 border-purple-500 text-purple-700" : "bg-gray-50 text-gray-500 hover:bg-gray-100")}
                    >
                        <Users className="h-6 w-6 mb-1" />
                        <span className="text-xs font-semibold">Parent</span>
                    </button>
                    <button
                        onClick={() => handleRoleChange('security')}
                        className={cn("flex flex-col items-center p-3 rounded-lg w-24 transition-colors",
                            role === 'security' ? "bg-green-100 border-2 border-green-500 text-green-700" : "bg-gray-50 text-gray-500 hover:bg-gray-100")}
                    >
                        <Shield className="h-6 w-6 mb-1" />
                        <span className="text-xs font-semibold">Security</span>
                    </button>
                </div>

                <div className="bg-blue-50 p-3 rounded text-xs text-blue-800 mb-4">
                    <p className="font-bold">Demo Credentials:</p>
                    {role === 'student' && <p>RegNo: 21BCE1001 | Pass: password</p>}
                    {role === 'parent' && <p>Phone: 9876543210 | Pass: password</p>}
                    {role === 'security' && <p>ID: G101 | Pass: password | PIN: 1234</p>}
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {role === 'student' ? 'Registration Number' : role === 'parent' ? 'Phone Number' : 'Guard ID'}
                        </label>
                        <input
                            type="text"
                            value={identifier}
                            onChange={(e) => setIdentifier(e.target.value)}
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                            required
                        />
                    </div>

                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                    <button
                        type="submit"
                        className="w-full bg-primary text-primary-foreground py-2 rounded-md hover:bg-blue-700 transition-colors font-semibold"
                    >
                        Sign In as {role.charAt(0).toUpperCase() + role.slice(1)}
                    </button>
                </form>

                <div className="mt-6 pt-6 border-t text-center">
                    <p className="text-xs text-gray-500 mb-2">Having trouble/Data issues?</p>
                    <button
                        onClick={() => {
                            if (window.confirm('This will delete all visitor records and reset users to default. Continue?')) {
                                import('../context/DatabaseContext').then(() => {
                                    // This is a bit hacky because we are not inside the provider here potentially if we used context hook outside 
                                    // But actually we are inside AuthProvider -> DatabaseProvider.
                                    // Let's use window.location.reload() inside the component or just clear localstorage manually here.
                                    localStorage.removeItem('vtop_users');
                                    localStorage.removeItem('vtop_visitors');
                                    localStorage.removeItem('vtop_requests');
                                    window.location.reload();
                                });
                            }
                        }}
                        className="text-xs text-red-500 hover:text-red-700 underline"
                    >
                        Reset Demo Data
                    </button>
                </div>
            </div>
        </div>
    );
}
