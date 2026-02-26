import { useAuth } from '../../context/AuthContext';
import Layout from '../../components/layout/Layout';
import { Calendar, Clock, Book, UserCheck } from 'lucide-react';

export default function StudentDashboard() {
    const { user } = useAuth();

    const schedule = [
        { time: '09:00 AM - 09:50 AM', course: 'CSE1001 - Problem Solving and Programming', venue: 'SJT-101', type: 'Theory' },
        { time: '10:00 AM - 10:50 AM', course: 'MAT1001 - Calculus for Engineers', venue: 'SJT-205', type: 'Theory' },
        { time: '02:00 PM - 03:50 PM', course: 'CSE1001 - Problem Solving and Programming', venue: 'SJT-LAB-2', type: 'Lab' },
    ];

    return (
        <Layout>
            <div className="space-y-6">
                {/* Header Section */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-6 text-white shadow-lg">
                    <h1 className="text-2xl font-bold mb-2">Welcome back, {user?.name}!</h1>
                    <p className="opacity-90">Registration Number: {user?.regNo} | Program: B.Tech CSE</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-gray-500 text-sm font-medium">Avg. Attendance</h3>
                            <UserCheck className="text-green-500 h-5 w-5" />
                        </div>
                        <p className="text-2xl font-bold text-gray-800">88.5%</p>
                        <p className="text-xs text-green-600 mt-1">Good Standing</p>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-gray-500 text-sm font-medium">CGPA</h3>
                            <Book className="text-blue-500 h-5 w-5" />
                        </div>
                        <p className="text-2xl font-bold text-gray-800">9.2</p>
                        <p className="text-xs text-gray-500 mt-1">Last Semester</p>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-gray-500 text-sm font-medium">Credits Earned</h3>
                            <Book className="text-purple-500 h-5 w-5" />
                        </div>
                        <p className="text-2xl font-bold text-gray-800">45</p>
                        <p className="text-xs text-gray-500 mt-1">Out of 160</p>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-gray-500 text-sm font-medium">Upcoming Exams</h3>
                            <Calendar className="text-orange-500 h-5 w-5" />
                        </div>
                        <p className="text-2xl font-bold text-gray-800">2</p>
                        <p className="text-xs text-gray-500 mt-1">Next: CAT-1 (Oct 15)</p>
                    </div>
                </div>

                {/* Schedule Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border p-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                            <Clock className="mr-2 h-5 w-5 text-primary" />
                            Today's Schedule
                        </h2>
                        <div className="space-y-4">
                            {schedule.map((cls, index) => (
                                <div key={index} className="flex items-start p-4 bg-gray-50 rounded-lg border border-gray-100 hover:bg-blue-50 transition-colors">
                                    <div className="min-w-[140px] font-semibold text-gray-700">{cls.time}</div>
                                    <div>
                                        <h4 className="font-bold text-gray-900">{cls.course}</h4>
                                        <p className="text-sm text-gray-600">Venue: {cls.venue} • <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${cls.type === 'Theory' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>{cls.type}</span></p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border p-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Notifications</h2>
                        <ul className="space-y-3">
                            <li className="text-sm text-gray-600 border-b pb-2">
                                <span className="block font-semibold text-gray-800 mb-1">Fee Payment Due</span>
                                Last date for Fall Semester fee payment is Oct 20th.
                            </li>
                            <li className="text-sm text-gray-600 border-b pb-2">
                                <span className="block font-semibold text-gray-800 mb-1">Holiday Declared</span>
                                Oct 2nd is a holiday for Gandhi Jayanti.
                            </li>
                            <li className="text-sm text-gray-600">
                                <span className="block font-semibold text-gray-800 mb-1">Guest Lecture</span>
                                AI in Healthcare - Sep 30th @ Anna Audi.
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
