// src/pages/Dashboard.jsx
import React, { useState, useEffect } from "react";
import { collection, onSnapshot, query, doc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useNavigate } from 'react-router-dom';
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

const Dashboard = ({ user }) => {
    const [balance, setBalance] = useState(0.00);
    const [orders, setOrders] = useState([]);
    const [isSidebarOpen, setSidebarOpen] = useState(false); // State tracks open/close
    const [view, setView] = useState('inventory');

    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            const unsubBalance = onSnapshot(doc(db, "users", user.uid), (doc) => {
                if (doc.exists()) setBalance(doc.data().balance);
            });
            const q = query(collection(db, "users", user.uid, "orders"));
            const unsubOrders = onSnapshot(q, (snapshot) => {
                setOrders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            });
            return () => { unsubBalance(); unsubOrders(); };
        }
    }, [user]);

    return (
        <>
            {/* Sidebar receives the Close function */}
            <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />

            {/* Header receives the TOGGLE function */}
            <Header
                onOpenSidebar={() => setSidebarOpen(!isSidebarOpen)}
                balance={balance}
            />

            <main className="market">
                {/* ... (Rest of your Dashboard code remains the same) ... */}
            </main>
        </>
    );
}

export default Dashboard;