import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebaseConfig";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Wallet from "./pages/Wallet";
import Processing from "./pages/Processing";
import Cart from "./pages/Cart"; // <--- IMPORT CART
import LoadingScreen from "./components/LoadingScreen";

function App() {
    const [user, setUser] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);
    const [pageLoading, setPageLoading] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setAuthLoading(false);
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        setPageLoading(true);
        const timer = setTimeout(() => { setPageLoading(false); }, 2000);
        return () => clearTimeout(timer);
    }, [location.pathname]);

    if (authLoading) return <LoadingScreen />;

    return (
        <>
            {pageLoading && <LoadingScreen />}
            <Routes>
                <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
                <Route path="/" element={user ? <Dashboard user={user} /> : <Navigate to="/login" />} />
                <Route path="/wallet" element={user ? <Wallet /> : <Navigate to="/login" />} />
                <Route path="/payment-process" element={user ? <Processing /> : <Navigate to="/login" />} />

                {/* NEW CART ROUTE */}
                <Route path="/cart" element={user ? <Cart /> : <Navigate to="/login" />} />

                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </>
    );
}

export default App;