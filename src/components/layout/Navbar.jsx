import { useAuth } from '../../context/AuthContext';
import { LogOut, Menu, Bell } from 'lucide-react';

export default function Navbar({ toggleSidebar }) { // Accept toggle prop
    const { user, logout } = useAuth();

    return (
        <header className="bg-white border-b h-16 px-6 flex items-center justify-between sticky top-0 z-10">
            <div className="flex items-center">
                <button onClick={toggleSidebar} className="mr-4 md:hidden text-gray-600">
                    <Menu size={24} />
                </button>
                <h2 className="text-xl font-semibold text-gray-800 hidden md:block">
                    {user?.role === 'student' ? 'Student Portal' :
                        user?.role === 'parent' ? 'Parent Portal' : 'Security Portal'}
                </h2>
            </div>

            <div className="flex items-center space-x-4">
                <button className="text-gray-500 hover:text-gray-700 relative">
                    <Bell size={20} />
                    <span className="absolute top-0 right-0 block h-2 w-2 rounded-full ring-2 ring-white bg-red-500 transform translate-x-1/2 -translate-y-1/2"></span>
                </button>

                <div className="flex items-center pl-4 border-l">
                    <div className="mr-3 text-right hidden sm:block">
                        <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                        <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                    </div>
                    <button
                        onClick={logout}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        title="Logout"
                    >
                        <LogOut size={20} />
                    </button>
                </div>
            </div>
        </header>
    );
}
