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
        if (onClose) onClose();
    };

    // Helper for active class
    const isActive = (path) => location.pathname === path ? 'active' : '';

    return (
        <>
            <div
                className={`sidebar-overlay ${isOpen ? 'active' : ''}`}
                onClick={onClose}
            ></div>

            <aside className={`sidebar ${isOpen ? "open" : ""}`}>

                <div className="sidebar-header">
                    {/* Username Block Red & Block Letters */}
                    <span className="user-email">
                        {auth.currentUser?.email?.split('@')[0].toUpperCase()}
                    </span>
                    <button className="close-btn" onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>

                <nav className="sidebar-nav">
                    {/* 1. MARKET */}
                    <button
                        className={`side-btn ${isActive('/')}`}
                        onClick={() => handleNavigation('/')}
                    >
                        <ShoppingCart size={18} /> Market
                    </button>

                    {/* 2. INVENTORY (Linked to /assets) */}
                    <button
                        className={`side-btn ${isActive('/assets')}`}
                        onClick={() => handleNavigation('/assets')}
                    >
                        <Box size={18} /> Inventory
                    </button>

                    {/* 3. WALLET */}
                    <button
                        className={`side-btn ${isActive('/wallet')}`}
                        onClick={() => handleNavigation('/wallet')}
                    >
                        <WalletIcon size={18} /> Wallet
                    </button>
                </nav>

                {/* INFO PAGES */}
                <nav className="sidebar-nav secondary">
                    <button
                        className={`side-btn small ${isActive('/support')}`}
                        onClick={() => handleNavigation('/support')}
                    >
                        <HelpCircle size={16} /> Support
                    </button>

                    <button
                        className={`side-btn small ${isActive('/about')}`}
                        onClick={() => handleNavigation('/about')}
                    >
                        <Info size={16} /> About
                    </button>

                    <button
                        className={`side-btn small ${isActive('/privacy')}`}
                        onClick={() => handleNavigation('/privacy')}
                    >
                        <Shield size={16} /> Privacy Policy
                    </button>
                </nav>

                <div className="spacer"></div>

                {/* LOGOUT BUTTON */}
                <button className="disconnect-btn" onClick={handleLogout}>
                    <LogOut size={18} /> Logout
                </button>
            </aside>

            <style jsx>{`
                .sidebar-overlay {
                    position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
                    background: rgba(0,0,0,0.6); z-index: 1100;
                    opacity: 0; pointer-events: none; transition: 0.3s;
                    backdrop-filter: blur(4px);
                }
                .sidebar-overlay.active { opacity: 1; pointer-events: all; }

                .sidebar {
                    position: fixed; top: 0; left: -280px; width: 280px; height: 100vh;
                    background: #0a0a0a; border-right: 1px solid #222;
                    padding: 20px; display: flex; flex-direction: column;
                    transition: left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    z-index: 1200; box-shadow: 10px 0 30px rgba(0,0,0,0.5);
                }
                .sidebar.open { left: 0; }

                .sidebar-header {
                    display: flex; justify-content: space-between; align-items: center;
                    margin-bottom: 30px; padding-bottom: 20px; border-bottom: 1px solid #1a1a1a;
                }
                .user-email {
                    font-family: 'JetBrains Mono', monospace;
                    color: #ff2a2a; /* RED */
                    font-size: 16px;
                    font-weight: 800; /* BLOCK LETTERS */
                    letter-spacing: 1px;
                }
                .close-btn { background: none; border: none; color: #fff; cursor: pointer; }

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

                .spacer { flex-grow: 1; }

                .disconnect-btn {
                    margin-top: auto; display: flex; align-items: center; justify-content: center; gap: 10px;
                    padding: 16px; background: rgba(255, 42, 42, 0.1);
                    border: 1px solid rgba(255, 42, 42, 0.2); color: #ff2a2a;
                    font-weight: 700; border-radius: 8px; cursor: pointer; transition: 0.3s;
                }
                .disconnect-btn:hover { background: #ff2a2a; color: white; box-shadow: 0 0 20px rgba(255, 42, 42, 0.3); }
            `}</style>
        </>
    );
};

export default Sidebar;