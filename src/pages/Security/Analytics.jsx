import { useState, useEffect } from 'react';
import { useDatabase } from '../../context/DatabaseContext';
import Layout from '../../components/layout/Layout';
import { BarChart, FileSpreadsheet, AlertTriangle, Users } from 'lucide-react';
import * as XLSX from 'xlsx';

export default function Analytics() {
    const { requests, users } = useDatabase();
    const [stats, setStats] = useState({
        totalVisits: 0,
        highFreqWeekly: [],
        highFreqMonthly: [],
        studentStats: {}
    });

    useEffect(() => {
        calculateStats();
    }, [requests]);

    const calculateStats = () => {
        const now = new Date();
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

        const studentVisits = {}; // { regNo: { total: 0, weekly: 0, monthly: 0, name: '' } }

        requests.forEach(req => {
            const reqDate = new Date(req.timestamp);
            const regNo = req.studentRegNo;

            if (!studentVisits[regNo]) {
                studentVisits[regNo] = {
                    total: 0,
                    weekly: 0,
                    monthly: 0,
                    name: req.studentName,
                    regNo: regNo
                };
            }

            // Count only approved/granted/checked-out visits (ignoring rejected/pending if desired, but usually security cares about attempts too. Let's count 'granted' and 'checked-out' which means they entered)
            // Actually, requirements say "visits", which implies they entered. So status should be 'granted' (which covers checked out too in our logic if we kept it simple, or we check if status is granted/checked out)
            // In our current logic: status 'granted' means allowed in. 'Checked Out' is just a UI state derived from exitTime.
            if (req.status === 'granted') {
                studentVisits[regNo].total++;

                if (reqDate >= oneWeekAgo) {
                    studentVisits[regNo].weekly++;
                }
                if (reqDate >= oneMonthAgo) {
                    studentVisits[regNo].monthly++;
                }
            }
        });

        const highFreqWeekly = Object.values(studentVisits).filter(s => s.weekly > 3);
        const highFreqMonthly = Object.values(studentVisits).filter(s => s.monthly > 5);

        setStats({
            totalVisits: requests.filter(r => r.status === 'granted').length,
            highFreqWeekly,
            highFreqMonthly,
            studentStats: studentVisits
        });
    };

    const downloadExcel = () => {
        // Sheet 1: All Logs
        const logsData = requests.map(req => ({
            'Visitor Name': req.visitorName,
            'Student Name': req.studentName,
            'Student RegNo': req.studentRegNo,
            'Relation': req.relation,
            'Phone': req.visitorPhone,
            'Time In': new Date(req.timestamp).toLocaleString(),
            'Time Out': req.exitTime ? new Date(req.exitTime).toLocaleString() : '-',
            'Status': req.status
        }));
        const worksheetLogs = XLSX.utils.json_to_sheet(logsData);

        // Sheet 2: Student Stats
        const statsData = Object.values(stats.studentStats).map(s => ({
            'Student Name': s.name,
            'RegNo': s.regNo,
            'Total Visits': s.total,
            'Visits (Last 7 Days)': s.weekly,
            'Visits (Last 30 Days)': s.monthly,
            'Flag (Weekly > 3)': s.weekly > 3 ? 'YES' : 'No',
            'Flag (Monthly > 5)': s.monthly > 5 ? 'YES' : 'No'
        }));
        const worksheetStats = XLSX.utils.json_to_sheet(statsData);

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheetLogs, "Visitor Logs");
        XLSX.utils.book_append_sheet(workbook, worksheetStats, "Student Statistics");

        XLSX.writeFile(workbook, "VTOP_Security_Analytics.xlsx");
    };

    return (
        <Layout>
            <div className="max-w-6xl mx-auto space-y-8">
                <div className="flex flex-col md:flex-row justify-between items-center bg-white p-6 rounded-xl shadow-sm border">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Security Analytics</h1>
                        <p className="text-gray-500">Visitor insights and high-frequency alerts.</p>
                    </div>
                    <button
                        onClick={downloadExcel}
                        className="mt-4 md:mt-0 flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 shadow-sm"
                    >
                        <FileSpreadsheet size={18} className="mr-2" />
                        Export to Excel
                    </button>
                </div>

                {/* Alerts Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-orange-200">
                        <div className="flex items-center mb-4">
                            <AlertTriangle className="text-orange-500 mr-2" />
                            <h2 className="text-lg font-bold text-gray-800">Weekly Alerts ({">"}3 Visits)</h2>
                        </div>
                        {stats.highFreqWeekly.length === 0 ? (
                            <p className="text-gray-500 text-sm">No students exceeded weekly limits.</p>
                        ) : (
                            <ul className="space-y-3">
                                {stats.highFreqWeekly.map(s => (
                                    <li key={s.regNo} className="flex justify-between items-center bg-orange-50 p-3 rounded-lg border border-orange-100">
                                        <div>
                                            <p className="font-bold text-gray-800">{s.name}</p>
                                            <p className="text-xs text-gray-500">{s.regNo}</p>
                                        </div>
                                        <div className="px-3 py-1 bg-white rounded-full text-xs font-bold text-orange-600 border border-orange-200">
                                            {s.weekly} visits
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-red-200">
                        <div className="flex items-center mb-4">
                            <AlertTriangle className="text-red-500 mr-2" />
                            <h2 className="text-lg font-bold text-gray-800">Monthly Alerts ({">"}5 Visits)</h2>
                        </div>
                        {stats.highFreqMonthly.length === 0 ? (
                            <p className="text-gray-500 text-sm">No students exceeded monthly limits.</p>
                        ) : (
                            <ul className="space-y-3">
                                {stats.highFreqMonthly.map(s => (
                                    <li key={s.regNo} className="flex justify-between items-center bg-red-50 p-3 rounded-lg border border-red-100">
                                        <div>
                                            <p className="font-bold text-gray-800">{s.name}</p>
                                            <p className="text-xs text-gray-500">{s.regNo}</p>
                                        </div>
                                        <div className="px-3 py-1 bg-white rounded-full text-xs font-bold text-red-600 border border-red-200">
                                            {s.monthly} visits
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

                {/* All Students Stats Table */}
                <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                    <div className="p-4 border-b bg-gray-50 flex items-center">
                        <Users className="text-gray-400 mr-2" />
                        <h2 className="font-semibold text-gray-700">Student Visit Statistics</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-100 text-gray-600 uppercase font-semibold">
                                <tr>
                                    <th className="px-6 py-4">Student</th>
                                    <th className="px-6 py-4">Total Visits</th>
                                    <th className="px-6 py-4">This Week</th>
                                    <th className="px-6 py-4">This Month</th>
                                    <th className="px-6 py-4">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {Object.values(stats.studentStats).map((s) => (
                                    <tr key={s.regNo} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900">{s.name}</div>
                                            <div className="text-xs text-gray-500">{s.regNo}</div>
                                        </td>
                                        <td className="px-6 py-4">{s.total}</td>
                                        <td className="px-6 py-4">{s.weekly}</td>
                                        <td className="px-6 py-4">{s.monthly}</td>
                                        <td className="px-6 py-4">
                                            {(s.weekly > 3 || s.monthly > 5) ? (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                    Flagged
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                    Normal
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {Object.keys(stats.studentStats).length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                                            No visit data available yet.
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
