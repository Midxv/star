// src/App.jsx
import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom"; // Added useLocation
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebaseConfig";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Wallet from "./pages/Wallet";
import Processing from "./pages/Processing"; // <--- Import New Page
import LoadingScreen from "./components/LoadingScreen"; // <--- Import Loader

function App() {
    const [user, setUser] = useState(null);
    const [authLoading, setAuthLoading] = useState(true); // Initial Firebase check
    const [pageLoading, setPageLoading] = useState(false); // Navigation loader

    const location = useLocation();

    // 1. Firebase Auth Check (Runs once)
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setAuthLoading(false);
        });
        return () => unsubscribe();
    }, []);

    // 2. Navigation Loader Trigger
    useEffect(() => {
        // Trigger loader on every route change (except initial load which authLoading handles)
        setPageLoading(true);
        const timer = setTimeout(() => {
            setPageLoading(false);
        }, 2000); // Loader stays for 2 seconds (Netflix style intro)

        return () => clearTimeout(timer);
    }, [location.pathname]); // Runs whenever URL path changes

    if (authLoading) return <LoadingScreen />; // Show during initial auth check

    return (
        <>
            {/* Show Loader on top if navigating */}
            {pageLoading && <LoadingScreen />}

            <Routes>
                <Route
                    path="/login"
                    element={!user ? <Login /> : <Navigate to="/" />}
                />

                <Route
                    path="/"
                    element={user ? <Dashboard user={user} /> : <Navigate to="/login" />}
                />

                <Route
                    path="/wallet"
                    element={user ? <Wallet /> : <Navigate to="/login" />}
                />

                {/* NEW PROCESSING ROUTE */}
                <Route
                    path="/payment-process"
                    element={user ? <Processing /> : <Navigate to="/login" />}
                />

                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </>
    );
}

export default App;