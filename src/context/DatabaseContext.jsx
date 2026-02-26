import { createContext, useContext, useState, useEffect } from 'react';

const DatabaseContext = createContext();

export const useDatabase = () => useContext(DatabaseContext);

export const DatabaseProvider = ({ children }) => {
    // Initial Mock Data
    const [users, setUsers] = useState([
        { id: 'S101', role: 'student', name: 'Satvik', regNo: '21BCE1001', password: 'password', parentId: 'P101' },
        { id: 'P101', role: 'parent', name: 'Mr. Sharma', phone: '9876543210', password: 'password', studentId: 'S101' },
        { id: 'G101', role: 'security', name: 'Guard A', pin: '1234', password: 'password' },
    ]);

    const [visitors, setVisitors] = useState([]);
    const [requests, setRequests] = useState([]);
    const [isInitialized, setIsInitialized] = useState(false);

    // Load from local storage on mount
    useEffect(() => {
        const storedUsers = localStorage.getItem('vtop_users');
        const storedVisitors = localStorage.getItem('vtop_visitors');
        const storedRequests = localStorage.getItem('vtop_requests');

        if (storedUsers) setUsers(JSON.parse(storedUsers));
        if (storedVisitors) setVisitors(JSON.parse(storedVisitors));
        if (storedRequests) setRequests(JSON.parse(storedRequests));

        setIsInitialized(true);
    }, []);

    // Save to local storage whenever data changes
    useEffect(() => {
        if (!isInitialized) return;
        localStorage.setItem('vtop_users', JSON.stringify(users));
        localStorage.setItem('vtop_visitors', JSON.stringify(visitors));
        localStorage.setItem('vtop_requests', JSON.stringify(requests));
    }, [users, visitors, requests, isInitialized]);

    const addVisitor = (visitor) => {
        const newVisitor = { ...visitor, id: Date.now().toString() };
        setVisitors([...visitors, newVisitor]);
        return newVisitor;
    };

    const addRequest = (request) => {
        const newRequest = { ...request, id: Date.now().toString(), status: 'pending', timestamp: new Date().toISOString() };
        setRequests([...requests, newRequest]);
        return newRequest;
    };

    const updateRequestStatus = (requestId, status, otp = null) => {
        setRequests(requests.map(req =>
            req.id === requestId ? { ...req, status, otp } : req
        ));
    };

    const updateVisitorExit = (requestId) => {
        const exitTime = new Date().toISOString();

        // Update active visitors list
        setVisitors(visitors.map(v =>
            v.id === requestId ? { ...v, exitTime } : v
        ));

        // Update requests log as well to show checked out status there if needed (optional but good for consistency)
        setRequests(requests.map(req =>
            req.id === requestId ? { ...req, exitTime } : req
        ));
    };

    const resetDatabase = () => {
        localStorage.removeItem('vtop_users');
        localStorage.removeItem('vtop_visitors');
        localStorage.removeItem('vtop_requests');
        window.location.reload();
    };

    return (
        <DatabaseContext.Provider value={{ users, visitors, requests, addVisitor, addRequest, updateRequestStatus, updateVisitorExit, resetDatabase }}>
            {children}
        </DatabaseContext.Provider>
    );
};
