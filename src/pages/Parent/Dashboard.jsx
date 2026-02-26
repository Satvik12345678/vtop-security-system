import { useState } from 'react';
import { useDatabase } from '../../context/DatabaseContext';
import { useAuth } from '../../context/AuthContext';
import Layout from '../../components/layout/Layout';
import { CheckCircle, XCircle, Clock, Shield, User } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function ParentDashboard() {
    const { user } = useAuth();
    const { requests, updateRequestStatus, users } = useDatabase();

    // Filter requests for this parent
    const myRequests = requests.filter(r => r.parentId === user?.id).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    return (
        <Layout>
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border">
                    <h1 className="text-2xl font-bold text-gray-800">Parent Portal</h1>
                    <p className="text-gray-500">Manage visitor approvals for your ward.</p>
                </div>

                <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                        <Clock className="mr-2 text-primary" />
                        Visitor Requests
                    </h2>

                    {myRequests.length === 0 ? (
                        <div className="text-center py-12 bg-white rounded-xl border border-dashed">
                            <p className="text-gray-500">No visitor requests found.</p>
                        </div>
                    ) : (
                        myRequests.map(request => (
                            <RequestCard key={request.id} request={request} onUpdate={updateRequestStatus} />
                        ))
                    )}
                </div>

                <div className="mt-8 p-4 bg-gray-100 rounded-lg text-xs font-mono text-gray-500">
                    <p className="font-bold mb-2">Debug Info (For Troubleshooting):</p>
                    <p>Current User ID: {user?.id} ({user?.name})</p>
                    <p>Total Requests in DB: {requests?.length || 0}</p>
                    <p>My Requests Count: {myRequests?.length || 0}</p>
                    <details>
                        <summary className="cursor-pointer text-blue-500">View Raw Request Data</summary>
                        <pre className="mt-2 text-[10px] overflow-auto max-h-40">
                            {JSON.stringify(requests, null, 2)}
                        </pre>
                    </details>
                </div>
            </div>
        </Layout>
    );
}

function RequestCard({ request, onUpdate }) {
    const [verificationRegNo, setVerificationRegNo] = useState('');
    const [error, setError] = useState('');
    const [showOtp, setShowOtp] = useState(false);

    const isPending = request.status === 'pending';

    const handleApprove = (e) => {
        e.preventDefault();
        if (verificationRegNo !== request.studentRegNo) {
            setError('Incorrect Student Registration Number.');
            return;
        }

        // Generate 4-digit OTP
        const otp = Math.floor(1000 + Math.random() * 9000).toString();
        onUpdate(request.id, 'approved', otp);
        setShowOtp(true);
        setError('');
    };

    const handleReject = () => {
        onUpdate(request.id, 'rejected');
    };

    return (
        <div className={cn(
            "bg-white rounded-xl shadow-sm border overflow-hidden",
            isPending ? "border-l-4 border-l-yellow-500" :
                request.status === 'approved' ? "border-l-4 border-l-green-500" : "border-l-4 border-l-red-500"
        )}>
            <div className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                    {/* Photo Section */}
                    <div className="w-full md:w-48 flex-shrink-0">
                        <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 border">
                            {request.photoUrl ? (
                                <img src={request.photoUrl} alt="Visitor" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                    <User size={48} />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Details Section */}
                    <div className="flex-1 space-y-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">{request.visitorName}</h3>
                                <p className="text-sm text-gray-500 flex items-center mt-1">
                                    {request.relation} • {request.visitorPhone}
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                    Requested at: {new Date(request.timestamp).toLocaleString()}
                                </p>
                            </div>
                            <div className={cn(
                                "px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide",
                                isPending ? "bg-yellow-100 text-yellow-800" :
                                    request.status === 'approved' ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                            )}>
                                {request.status}
                            </div>
                        </div>

                        {/* Action Section */}
                        {isPending ? (
                            <div className="bg-gray-50 p-4 rounded-lg border">
                                <p className="text-sm font-medium text-gray-700 mb-3">To approve, enter Student's Registration Number:</p>
                                <form onSubmit={handleApprove} className="flex flex-col sm:flex-row gap-3">
                                    <input
                                        type="text"
                                        placeholder="e.g. 21BCE1001"
                                        className="flex-1 px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:outline-none"
                                        value={verificationRegNo}
                                        onChange={(e) => setVerificationRegNo(e.target.value)}
                                        required
                                    />
                                    <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium flex items-center justify-center">
                                        <CheckCircle size={18} className="mr-2" />
                                        Approve
                                    </button>
                                    <button type="button" onClick={handleReject} className="px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 font-medium flex items-center justify-center">
                                        <XCircle size={18} className="mr-2" />
                                        Reject
                                    </button>
                                </form>
                                {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
                            </div>
                        ) : (
                            request.status === 'approved' && request.otp && (
                                <div className="bg-green-50 p-4 rounded-lg border border-green-200 flex flex-col items-center justify-center text-center">
                                    <p className="text-green-800 font-medium mb-1">Access Granted</p>
                                    <p className="text-sm text-green-700 mb-2">Share this OTP with Security:</p>
                                    <div className="text-3xl font-mono font-bold tracking-widest text-green-900 bg-white px-4 py-2 rounded border border-green-200">
                                        {request.otp}
                                    </div>
                                </div>
                            )
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
