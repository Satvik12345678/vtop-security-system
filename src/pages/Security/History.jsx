import { useState } from 'react';
import { useDatabase } from '../../context/DatabaseContext';
import Layout from '../../components/layout/Layout';
import { Search, Filter, Download } from 'lucide-react';

export default function History() {
    const { requests, updateVisitorExit } = useDatabase();
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('all');

    const filteredRequests = requests.filter(req => {
        const matchesSearch =
            req.visitorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            req.studentRegNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
            req.visitorPhone.includes(searchTerm);

        const matchesFilter = filter === 'all' || req.status === filter;

        return matchesSearch && matchesFilter;
    }).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    return (
        <Layout>
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row justify-between items-center bg-white p-6 rounded-xl shadow-sm border">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Visitor History Log</h1>
                        <p className="text-gray-500">Comprehensive record of all visitor entries and requests.</p>
                    </div>
                    <button className="mt-4 md:mt-0 flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700">
                        <Download size={18} className="mr-2" />
                        Export CSV
                    </button>
                </div>

                <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                    {/* Filters */}
                    <div className="p-4 border-b bg-gray-50 flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by Visitor Name, RegNo, Phone..."
                                className="pl-10 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center space-x-2">
                            <Filter className="text-gray-400 h-5 w-5" />
                            <select
                                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none bg-white"
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                            >
                                <option value="all">All Status</option>
                                <option value="approved">Approved</option>
                                <option value="rejected">Rejected</option>
                                <option value="pending">Pending</option>
                                <option value="granted">Access Granted</option>
                            </select>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-100 text-gray-600 uppercase font-semibold">
                                <tr>
                                    <th className="px-6 py-4">Visitor</th>
                                    <th className="px-6 py-4">Student</th>
                                    <th className="px-6 py-4">Contact</th>
                                    <th className="px-6 py-4">Time</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Security</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredRequests.map((req) => (
                                    <tr key={req.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                {req.photoUrl && (
                                                    <img src={req.photoUrl} alt="" className="h-8 w-8 rounded-full object-cover mr-3 border" />
                                                )}
                                                <span className="font-medium text-gray-900">{req.visitorName}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-gray-900">{req.studentName}</div>
                                            <div className="text-xs text-gray-500">{req.studentRegNo}</div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">
                                            {req.visitorPhone}
                                            <span className="block text-xs text-gray-400 capitalize">{req.relation}</span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">
                                            <div>In: {new Date(req.timestamp).toLocaleString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                            {req.exitTime && <div className="text-xs text-red-500">Out: {new Date(req.exitTime).toLocaleString([], { hour: '2-digit', minute: '2-digit' })}</div>}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${req.status === 'granted' ? (req.exitTime ? 'bg-gray-100 text-gray-800' : 'bg-green-100 text-green-800') :
                                                    req.status === 'approved' ? 'bg-blue-100 text-blue-800' :
                                                        req.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                            'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {req.status === 'granted' ? (req.exitTime ? 'Checked Out' : 'Allowed In') : req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 text-right">
                                            {req.status === 'granted' && !req.exitTime && (
                                                <button
                                                    className="text-red-600 hover:text-red-900 text-xs font-bold border border-red-200 bg-red-50 px-3 py-1 rounded-md"
                                                    onClick={() => {
                                                        if (window.confirm('Mark this visitor as checked out?')) {
                                                            updateVisitorExit(req.id);
                                                        }
                                                    }}
                                                >
                                                    Check Out
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {filteredRequests.length === 0 && (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                                            No records found matching your criteria.
                                        </td>
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
