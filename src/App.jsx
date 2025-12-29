import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebaseConfig";

// Import Pages
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Wallet from "./pages/Wallet"; // Make sure your Wallet file is in src/pages/Wallet.jsx

function App() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    if (loading) return <div style={{height: '100vh', background: '#050505', color: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>Loading Terminal...</div>;

    return (
        <Routes>
            {/* 1. If NOT logged in, show Login. If logged in, go to Dashboard */}
            <Route
                path="/login"
                element={!user ? <Login /> : <Navigate to="/" />}
            />

            {/* 2. Protected Dashboard Route */}
            <Route
                path="/"
                element={user ? <Dashboard user={user} /> : <Navigate to="/login" />}
            />

            {/* 3. Protected Wallet Route */}
            <Route
                path="/wallet"
                element={user ? <Wallet /> : <Navigate to="/login" />}
            />

            {/* 4. Payment Process Route (Placeholder for future) */}
            <Route
                path="/payment-process"
                element={user ? <div>Payment Process Page</div> : <Navigate to="/login" />}
            />

            {/* Catch all - Redirect to Home */}
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    );
}

export default App;