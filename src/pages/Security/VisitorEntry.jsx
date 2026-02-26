import { useState } from 'react';
import { useDatabase } from '../../context/DatabaseContext';
import Layout from '../../components/layout/Layout';
import { Search, Camera, User, Phone, Users, CheckCircle } from 'lucide-react';

export default function VisitorEntry() {
    const { users, addRequest } = useDatabase();

    // Step 1: Student Search
    const [regNo, setRegNo] = useState('');
    const [student, setStudent] = useState(null);
    const [searchError, setSearchError] = useState('');

    // Step 2: Visitor Details
    const [visitorName, setVisitorName] = useState('');
    const [visitorPhone, setVisitorPhone] = useState('');
    const [relation, setRelation] = useState('Parent');
    const [photo, setPhoto] = useState(null);
    const [requestSent, setRequestSent] = useState(false);

    const handleSearch = (e) => {
        e.preventDefault();
        const found = users.find(u =>
            String(u.regNo).toLowerCase() === String(regNo).toLowerCase() &&
            u.role === 'student'
        );
        if (found) {
            setStudent(found);
            setSearchError('');
        } else {
            setStudent(null);
            setSearchError('Student not found with this Registration Number');
        }
    };

    const handlePhotoUpload = (e) => {
        if (e.target.files && e.target.files[0]) {
            // Create a fake URL for the uploaded file to display it
            const url = URL.createObjectURL(e.target.files[0]);
            setPhoto(url);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!student || !photo) return;

        if (!student.parentId) {
            alert("Error: This student does not have a linked Parent account in the database. Please reset demo data.");
            return;
        }

        const newRequest = {
            studentId: student.id,
            studentName: student.name,
            studentRegNo: student.regNo,
            visitorName,
            visitorPhone,
            relation,
            photoUrl: photo,
            parentId: student.parentId // Link to parent for approval
        };

        addRequest(newRequest);
        setRequestSent(true);
    };

    if (requestSent) {
        return (
            <Layout>
                <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl shadow-sm border max-w-lg mx-auto mt-10">
                    <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-6">
                        <CheckCircle size={40} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Request Sent!</h2>
                    <p className="text-center text-gray-600 mb-6">
                        Approval request has been sent to the parent of <strong>{student.name}</strong>.
                        <br />
                        Please ask the parent to check their portal.
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-blue-700"
                    >
                        Process New Entry
                    </button>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="max-w-2xl mx-auto">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">New Visitor Entry</h1>

                <div className="space-y-6">
                    {/* Step 1: Find Student */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border">
                        <h2 className="text-lg font-semibold mb-4 flex items-center">
                            <span className="bg-blue-100 text-blue-700 h-8 w-8 rounded-full flex items-center justify-center text-sm mr-3">1</span>
                            Verify Student
                        </h2>
                        <form onSubmit={handleSearch} className="flex gap-4">
                            <input
                                type="text"
                                placeholder="Enter Registration Number (e.g. 21BCE1001)"
                                className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                value={regNo}
                                onChange={(e) => setRegNo(e.target.value)}
                            />
                            <button type="submit" className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-black flex items-center">
                                <Search size={18} className="mr-2" />
                                Search
                            </button>
                        </form>
                        {searchError && <p className="text-red-500 mt-2 text-sm">{searchError}</p>}

                        {student && (
                            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
                                <div className="h-12 w-12 bg-green-200 rounded-full flex items-center justify-center text-green-700 mr-4">
                                    <User size={24} />
                                </div>
                                <div>
                                    <p className="font-bold text-green-900">{student.name}</p>
                                    <p className="text-sm text-green-700">{student.regNo} | Student</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Step 2: Visitor Details (Only if student found) */}
                    {student && (
                        <div className="bg-white p-6 rounded-xl shadow-sm border animate-in fade-in slide-in-from-bottom-4">
                            <h2 className="text-lg font-semibold mb-4 flex items-center">
                                <span className="bg-blue-100 text-blue-700 h-8 w-8 rounded-full flex items-center justify-center text-sm mr-3">2</span>
                                Visitor Details
                            </h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Visitor Name</label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                                            <input
                                                required
                                                type="text"
                                                value={visitorName}
                                                onChange={e => setVisitorName(e.target.value)}
                                                className="pl-10 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                                            <input
                                                required
                                                type="tel"
                                                value={visitorPhone}
                                                onChange={e => setVisitorPhone(e.target.value)}
                                                className="pl-10 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Relation to Student</label>
                                    <div className="relative">
                                        <Users className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                                        <select
                                            value={relation}
                                            onChange={e => setRelation(e.target.value)}
                                            className="pl-10 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary appearance-none bg-white"
                                        >
                                            <option>Parent</option>
                                            <option>Guardian</option>
                                            <option>Sibling</option>
                                            <option>Friend</option>
                                            <option>Other</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Visitor Photo</label>
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer relative">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            capture="user"
                                            onChange={handlePhotoUpload}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            required
                                        />
                                        {photo ? (
                                            <img src={photo} alt="Visitor" className="h-40 w-40 object-cover rounded-lg shadow-md" />
                                        ) : (
                                            <>
                                                <Camera className="h-10 w-10 text-gray-400 mb-2" />
                                                <p className="text-sm text-gray-500">Tap to take photo or upload</p>
                                            </>
                                        )}
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <button type="submit" className="w-full py-3 bg-primary text-white font-bold rounded-lg hover:bg-blue-700 shadow-md transition-all transform hover:scale-[1.01]">
                                        Submit Request to Parent
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}
