
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useDatabase } from '../../context/DatabaseContext';
import Layout from '../../components/layout/Layout';
import { Shield, Clock, UserCheck, Users, PlusCircle, Check, X, BarChart } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function SecurityDashboard() {
    const { user } = useAuth();
    const { visitors, requests, updateRequestStatus, addVisitor } = useDatabase();
    const navigate = useNavigate();

    // Modal State
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [otp, setOtp] = useState('');
    const [pin, setPin] = useState('');
    const [error, setError] = useState('');

    const activeVisitors = visitors.filter(v => !v.exitTime).length;
    const pendingRequests = requests.filter(r => r.status === 'pending').length;
    const totalVisitorsToday = visitors.filter(v => new Date(v.entryTime).toDateString() === new Date().toDateString()).length;

    // Filter for approved requests that need security verification
    const approvedRequests = requests.filter(r => r.status === 'approved');

    const handleVerify = (e) => {
        e.preventDefault();

        // 1. Verify OTP
        if (otp !== selectedRequest.otp) {
            setError('Invalid OTP provided by visitor.');
            return;
        }

        // 2. Verify Security PIN
        if (pin !== user.pin) {
            setError('Invalid Security PIN.');
            return;
        }

        // Success
        updateRequestStatus(selectedRequest.id, 'granted');
        addVisitor({
            ...selectedRequest,
            securityId: user.id,
            entryTime: new Date().toISOString()
        });

        // Reset
        setSelectedRequest(null);
        setOtp('');
        setPin('');
        setError('');
    };

    return (
        <Layout>
            <div className="space-y-6 relative">
                {/* Verification Modal */}
                {selectedRequest && (
                    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                            <div className="p-6 border-b bg-primary text-primary-foreground">
                                <h3 className="text-xl font-bold">Verify Entry: {selectedRequest.visitorName}</h3>
                                <p className="text-sm opacity-90">Student: {selectedRequest.studentName}</p>
                            </div>

                            <div className="p-6 space-y-4">
                                <div className="flex justify-center mb-4">
                                    {selectedRequest.photoUrl ? (
                                        <img src={selectedRequest.photoUrl} className="h-24 w-24 rounded-full object-cover border-4 border-gray-100" />
                                    ) : (
                                        <div className="h-24 w-24 rounded-full bg-gray-100 flex items-center justify-center"><UserCheck size={32} /></div>
                                    )}
                                </div>

                                <form onSubmit={handleVerify} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Enter Visitor OTP</label>
                                        <input
                                            type="text"
                                            placeholder="****"
                                            className="w-full text-center text-2xl tracking-widest px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary uppercase"
                                            value={otp}
                                            onChange={e => setOtp(e.target.value)}
                                            maxLength={4}
                                            required
                                            autoFocus
                                        />
                                        <p className="text-xs text-gray-400 mt-1 text-center">Ask visitor for the OTP sent to parent</p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Enter Security PIN</label>
                                        <input
                                            type="password"
                                            placeholder="****"
                                            className="w-full text-center text-2xl tracking-widest px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                                            value={pin}
                                            onChange={e => setPin(e.target.value)}
                                            maxLength={4}
                                            required
                                        />
                                    </div>

                                    {error && <p className="text-red-500 text-sm text-center font-medium bg-red-50 p-2 rounded">{error}</p>}

                                    <div className="flex gap-3 pt-2">
                                        <button
                                            type="button"
                                            onClick={() => { setSelectedRequest(null); setError(''); }}
                                            className="flex-1 py-2 border rounded-lg hover:bg-gray-50 text-gray-600 font-medium"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-bold shadow-md"
                                        >
                                            Grant Access
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}

                <div className="flex flex-col md:flex-row justify-between items-center bg-white p-6 rounded-xl shadow-sm border">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Security Control Panel</h1>
                        <p className="text-gray-500">Welcome, Officer {user?.name}</p>
                    </div>
                    <Link to="/security/entry" className="mt-4 md:mt-0 flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md">
                        <PlusCircle className="mr-2 h-5 w-5" />
                        New Visitor Entry
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/security/history')}>
                        <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 mb-4">
                            <Clock size={24} />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800">History Log</h3>
                        <p className="text-sm text-gray-500">View past records</p>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/security/analytics')}>
                        <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600 mb-4">
                            <BarChart size={24} />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800">Analytics</h3>
                        <p className="text-sm text-gray-500">View stats & Flagged Students</p>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-l-4 border-l-blue-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Active Visitors</p>
                                <p className="text-3xl font-bold text-gray-800">{activeVisitors}</p>
                            </div>
                            <div className="p-3 bg-blue-100 rounded-full text-blue-600">
                                <Users size={24} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-l-4 border-l-orange-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Pending Approvals</p>
                                <p className="text-3xl font-bold text-gray-800">{pendingRequests}</p>
                            </div>
                            <div className="p-3 bg-orange-100 rounded-full text-orange-600">
                                <Clock size={24} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-l-4 border-l-green-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Total Entries Today</p>
                                <p className="text-3xl font-bold text-gray-800">{totalVisitorsToday}</p>
                            </div>
                            <div className="p-3 bg-green-100 rounded-full text-green-600">
                                <Shield size={24} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Approved Requests Section - Priority */}
                {approvedRequests.length > 0 && (
                    <div className="bg-green-50 rounded-xl shadow-sm border border-green-200 overflow-hidden">
                        <div className="px-6 py-4 border-b border-green-100 bg-green-100/50">
                            <h3 className="text-lg font-bold text-green-900 flex items-center">
                                <Check className="mr-2 h-5 w-5" />
                                Ready for Entry (Parent Approved)
                            </h3>
                        </div>
                        <div className="divide-y divide-green-100">
                            {approvedRequests.map(req => (
                                <div key={req.id} className="p-4 flex items-center justify-between hover:bg-green-100/30 transition-colors">
                                    <div className="flex items-center space-x-4">
                                        {req.photoUrl && <img src={req.photoUrl} className="h-12 w-12 rounded-full object-cover" />}
                                        <div>
                                            <p className="font-bold text-green-900">{req.visitorName}</p>
                                            <p className="text-sm text-green-700">Visiting: {req.studentName} ({req.relation})</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setSelectedRequest(req)}
                                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 shadow-sm font-semibold text-sm"
                                    >
                                        Verify & Grant Access
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                    <div className="px-6 py-4 border-b">
                        <h3 className="text-lg font-bold text-gray-800">Recent Visitor Activity</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50 text-gray-600 uppercase">
                                <tr>
                                    <th className="px-6 py-3">Visitor Name</th>
                                    <th className="px-6 py-3">Student</th>
                                    <th className="px-6 py-3">Type</th>
                                    <th className="px-6 py-3">Time</th>
                                    <th className="px-6 py-3">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {requests.slice().sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 5).map((req) => (
                                    <tr key={req.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-3 font-medium">{req.visitorName}</td>
                                        <td className="px-6 py-3">{req.studentName} <span className="text-gray-400 text-xs">({req.studentRegNo})</span></td>
                                        <td className="px-6 py-3">{req.relation}</td>
                                        <td className="px-6 py-3">{new Date(req.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                                        <td className="px-6 py-3">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${req.status === 'granted' ? 'bg-green-100 text-green-800' :
                                                    req.status === 'approved' ? 'bg-blue-100 text-blue-800' :
                                                        req.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                            'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {req.status === 'granted' ? 'Allowed In' : req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                                {requests.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-8 text-center text-gray-500">No recent activity</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
