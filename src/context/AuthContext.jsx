import { createContext, useContext, useState } from 'react';
import { useDatabase } from './DatabaseContext';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const { users } = useDatabase();
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('vtop_user');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const login = (role, identifier, password) => {
        const foundUser = users.find(u =>
            u.role === role &&
            u.password === password &&
            (String(u.regNo).toLowerCase() === String(identifier).toLowerCase() ||
                String(u.phone) === String(identifier) ||
                String(u.id).toLowerCase() === String(identifier).toLowerCase())
        );

        if (foundUser) {
            setUser(foundUser);
            localStorage.setItem('vtop_user', JSON.stringify(foundUser));
            return true;
        }
        return false;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('vtop_user');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
