import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebaseConfig";

// Pages
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Wallet from "./pages/Wallet";
import Processing from "./pages/Processing";
import Cart from "./pages/Cart";
import Assets from "./pages/Assets"; // <--- New Inventory Page
import Support from "./pages/Support";
import About from "./pages/About";
import Privacy from "./pages/Privacy";
import LoadingScreen from "./components/LoadingScreen";

function App() {
    const [user, setUser] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);
    const [pageLoading, setPageLoading] = useState(false);
    const location = useLocation();

    // 1. Auth Check
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setAuthLoading(false);
        });
        return () => unsubscribe();
    }, []);

    // 2. Page Transition Effect
    useEffect(() => {
        if (!authLoading) {
            setPageLoading(true);
            const timer = setTimeout(() => { setPageLoading(false); }, 1000); // 1s load
            return () => clearTimeout(timer);
        }
    }, [location.pathname, authLoading]);

    if (authLoading) return <LoadingScreen />;

    return (
        <>
            {pageLoading && <LoadingScreen />}

            <Routes>
                {/* Public */}
                <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />

                {/* Protected */}
                <Route path="/" element={user ? <Dashboard user={user} /> : <Navigate to="/login" />} />
                <Route path="/wallet" element={user ? <Wallet /> : <Navigate to="/login" />} />
                <Route path="/payment-process" element={user ? <Processing /> : <Navigate to="/login" />} />
                <Route path="/cart" element={user ? <Cart /> : <Navigate to="/login" />} />
                <Route path="/assets" element={user ? <Assets /> : <Navigate to="/login" />} />

                {/* Info Pages */}
                <Route path="/support" element={user ? <Support /> : <Navigate to="/login" />} />
                <Route path="/about" element={user ? <About /> : <Navigate to="/login" />} />
                <Route path="/privacy" element={user ? <Privacy /> : <Navigate to="/login" />} />

                {/* 404 Redirect */}
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </>
    );
}

export default App;