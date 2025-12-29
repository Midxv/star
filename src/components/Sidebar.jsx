// src/components/Sidebar.jsx
import React from 'react';
import { LogOut, X, Box, Wallet as WalletIcon, ShoppingCart } from 'lucide-react';
import { signOut } from "firebase/auth";
import { auth } from '../firebaseConfig';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        signOut(auth);
        navigate('/login');
    };

    const handleNavigation = (path) => {
        navigate(path);
        if (onClose) onClose(); // Close sidebar on mobile after clicking
    };

    return (
        <>
            {/* Dark Overlay for Mobile */}
            <div
                className={`sidebar-overlay ${isOpen ? 'active' : ''}`}
                onClick={onClose}
            ></div>

            <aside className={`sidebar ${isOpen ? "open" : ""}`}>
                {/* Close Button (Mobile Only) */}
                <button className="close-btn" onClick={onClose}>
                    <X size={24} />
                </button>

                {/* User Profile */}
                <div className="user-info">
                    <div className="status-dot"></div>
                    <span>{auth.currentUser?.email?.split('@')[0] || 'Operative'}</span>
                </div>

                {/* Navigation Links */}
                <nav className="sidebar-nav">
                    <button
                        className={`side-btn ${location.pathname === '/' ? 'active' : ''}`}
                        onClick={() => handleNavigation('/')}
                    >
                        <Box size={18} style={{marginRight:'10px'}}/> Inventory
                    </button>

                    <button
                        className={`side-btn ${location.pathname === '/wallet' ? 'active' : ''}`}
                        onClick={() => handleNavigation('/wallet')}
                    >
                        <WalletIcon size={18} style={{marginRight:'10px'}}/> Wallet
                    </button>

                    {/* Placeholder for future Market page */}
                    <button className="side-btn">
                        <ShoppingCart size={18} style={{marginRight:'10px'}}/> Market
                    </button>
                </nav>

                <div className="divider"></div>

                <button className="side-btn logout" onClick={handleLogout}>
                    <LogOut size={16} style={{marginRight:'8px'}}/> Disconnect
                </button>
            </aside>

            <style jsx>{`
                .sidebar-overlay {
                    position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
                    background: rgba(0,0,0,0.6); z-index: 998;
                    opacity: 0; pointer-events: none; transition: 0.3s;
                    backdrop-filter: blur(2px);
                }
                .sidebar-overlay.active { opacity: 1; pointer-events: all; }

                .sidebar-nav { display: flex; flex-direction: column; gap: 5px; }

                .close-btn {
                    position: absolute; top: 20px; right: 20px;
                    background: none; border: none; color: #666; cursor: pointer;
                    display: none;
                }

                @media (max-width: 768px) {
                    .close-btn { display: block; }
                }
            `}</style>
        </>
    );
};

export default Sidebar;