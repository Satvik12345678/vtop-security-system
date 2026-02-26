import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, BookOpen, User, Shield, Clock, FileText, Menu, X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useState } from 'react'; // Import useState

export default function Sidebar({ isOpen, setIsOpen }) { // Receive props
    const { user } = useAuth();
    const location = useLocation();

    const links = {
        student: [
            { name: 'Dashboard', path: '/student', icon: LayoutDashboard },
            { name: 'Academics', path: '/student/academics', icon: BookOpen },
            { name: 'My Profile', path: '/student/profile', icon: User },
        ],
        parent: [
            { name: 'Dashboard', path: '/parent', icon: LayoutDashboard },
            { name: 'Approvals', path: '/parent/approvals', icon: FileText },
        ],
        security: [
            { name: 'Dashboard', path: '/security', icon: LayoutDashboard },
            { name: 'Visitor Entry', path: '/security/entry', icon: Shield },
            { name: 'History', path: '/security/history', icon: Clock },
        ]
    };

    const currentLinks = links[user?.role] || [];

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-20 md:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div className={cn(
                "fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:h-screen border-r",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="flex items-center justify-between h-16 px-6 border-b bg-primary text-primary-foreground">
                    <span className="text-xl font-bold">VTOP</span>
                    <button onClick={() => setIsOpen(false)} className="md:hidden">
                        <X size={24} />
                    </button>
                </div>
                <nav className="p-4 space-y-2">
                    {currentLinks.map((link) => {
                        const Icon = link.icon;
                        const isActive = location.pathname === link.path;
                        return (
                            <Link
                                key={link.path}
                                to={link.path}
                                onClick={() => setIsOpen(false)} // Close on click mobile
                                className={cn(
                                    "flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors",
                                    isActive
                                        ? "bg-primary/10 text-primary font-medium"
                                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                )}
                            >
                                <Icon size={20} />
                                <span>{link.name}</span>
                            </Link>
                        )
                    })}
                </nav>
            </div>
        </>
    );
}
