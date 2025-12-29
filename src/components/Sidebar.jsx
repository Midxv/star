import React from 'react';
import { LogOut, X, Box, Wallet as WalletIcon, ShoppingCart, HelpCircle, Info, Shield } from 'lucide-react';
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
        if (onClose) onClose(); // Auto-close on selection
    };

    return (
        <>
            {/* 1. CLICK ANYWHERE TO CLOSE (Overlay) */}
            <div
                className={`sidebar-overlay ${isOpen ? 'active' : ''}`}
                onClick={onClose}
            ></div>

            <aside className={`sidebar ${isOpen ? "open" : ""}`}>

                {/* Header inside Sidebar (Mobile only usually) */}
                <div className="sidebar-header">
                    <span className="user-email">{auth.currentUser?.email?.split('@')[0]}</span>
                    <button className="close-btn" onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>

                {/* MAIN NAVIGATION */}
                <nav className="sidebar-nav">
                    <button
                        className={`side-btn ${location.pathname === '/' ? 'active' : ''}`}
                        onClick={() => handleNavigation('/')}
                    >
                        <Box size={18} /> Inventory
                    </button>

                    <button
                        className={`side-btn ${location.pathname === '/wallet' ? 'active' : ''}`}
                        onClick={() => handleNavigation('/wallet')}
                    >
                        <WalletIcon size={18} /> Wallet
                    </button>

                    <button className="side-btn">
                        <ShoppingCart size={18} /> Market
                    </button>
                </nav>

                {/* SECONDARY LINKS (Support, About, Privacy) */}
                <nav className="sidebar-nav secondary">
                    <button className="side-btn small">
                        <HelpCircle size={16} /> Support
                    </button>
                    <button className="side-btn small">
                        <Info size={16} /> About
                    </button>
                    <button className="side-btn small">
                        <Shield size={16} /> Privacy Policy
                    </button>
                </nav>

                {/* PUSH TO BOTTOM */}
                <div className="spacer"></div>

                {/* DISCONNECT BUTTON (RED) */}
                <button className="disconnect-btn" onClick={handleLogout}>
                    <LogOut size={18} /> Disconnect System
                </button>
            </aside>

            <style jsx>{`
                /* OVERLAY: Covers entire screen to handle 'click outside' */
                .sidebar-overlay {
                    position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
                    background: rgba(0,0,0,0.6); z-index: 1100; /* High Z-index */
                    opacity: 0; pointer-events: none; transition: 0.3s;
                    backdrop-filter: blur(4px);
                }
                .sidebar-overlay.active { opacity: 1; pointer-events: all; }

                /* SIDEBAR CONTAINER */
                .sidebar {
                    position: fixed; top: 0; left: -280px; width: 280px; height: 100vh;
                    background: #0a0a0a; border-right: 1px solid #222;
                    padding: 20px;
                    display: flex; flex-direction: column; /* Flex Column is Key */
                    transition: left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    z-index: 1200; /* Above Header */
                    box-shadow: 10px 0 30px rgba(0,0,0,0.5);
                }
                .sidebar.open { left: 0; }

                /* HEADER INSIDE SIDEBAR */
                .sidebar-header {
                    display: flex; justify-content: space-between; align-items: center;
                    margin-bottom: 30px; padding-bottom: 20px; border-bottom: 1px solid #1a1a1a;
                }
                .user-email { font-family: 'JetBrains Mono', monospace; color: #fff; font-size: 12px; opacity: 0.5; }
                .close-btn { background: none; border: none; color: #fff; cursor: pointer; }

                /* NAVIGATION STYLES */
                .sidebar-nav { display: flex; flex-direction: column; gap: 8px; }
                .secondary { margin-top: 30px; padding-top: 20px; border-top: 1px solid #1a1a1a; }

                .side-btn {
                    display: flex; align-items: center; gap: 12px;
                    padding: 12px 16px; border-radius: 8px;
                    background: transparent; border: none;
                    color: #888; font-weight: 600; cursor: pointer;
                    transition: 0.2s; text-align: left;
                }
                .side-btn:hover { background: #111; color: white; padding-left: 20px; }
                .side-btn.active { background: #111; color: #fff; border-left: 2px solid #ff2a2a; }

                .side-btn.small { font-size: 13px; padding: 10px 16px; }

                /* SPACER pushes content down */
                .spacer { flex-grow: 1; }

                /* DISCONNECT BUTTON (RED & BOTTOM) */
                .disconnect-btn {
                    margin-top: auto; /* Safety fallback */
                    display: flex; align-items: center; justify-content: center; gap: 10px;
                    padding: 16px;
                    background: rgba(255, 42, 42, 0.1);
                    border: 1px solid rgba(255, 42, 42, 0.2);
                    color: #ff2a2a;
                    font-weight: 700; border-radius: 8px; cursor: pointer;
                    transition: 0.3s;
                }
                .disconnect-btn:hover {
                    background: #ff2a2a; color: white;
                    box-shadow: 0 0 20px rgba(255, 42, 42, 0.3);
                }
            `}</style>
        </>
    );
};

export default Sidebar;