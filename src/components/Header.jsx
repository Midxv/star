// src/components/Header.jsx
import React from 'react';
import { Search, ShoppingCart, Menu } from 'lucide-react';
import { Link } from 'react-router-dom';

// Prop 'onOpenSidebar' allows the hamburger button to open the Sidebar
const Header = ({ onOpenSidebar }) => {
    return (
        <nav className="navbar">
            <div className="container-fluid nav-content">

                {/* LOGO */}
                <Link to="/" className="logo">
                    MARKET<span className="text-red">.</span>
                </Link>

                {/* SEARCH BAR */}
                <div className="search-container">
                    <div className="search-bar">
                        <Search size={18} color="#666" />
                        <input type="text" placeholder="Search assets..." />
                    </div>
                </div>

                {/* ACTIONS */}
                <div className="nav-actions">
                    <button className="icon-btn"><ShoppingCart size={24} /></button>

                    {/* Mobile Menu Button - Triggers Sidebar */}
                    <button className="mobile-menu" onClick={onOpenSidebar}>
                        <Menu size={24} />
                    </button>
                </div>

            </div>

            <style jsx>{`
                .navbar {
                    height: 80px; /* matched to global CSS var if exists */
                    border-bottom: 1px solid #1a1a1a;
                    background: rgba(0, 0, 0, 0.9);
                    backdrop-filter: blur(20px);
                    position: sticky; top: 0; z-index: 1000;
                    display: flex; align-items: center; padding: 0 20px;
                }

                .nav-content {
                    display: grid;
                    grid-template-columns: auto 1fr auto;
                    align-items: center;
                    width: 100%;
                }

                .logo {
                    font-size: 28px; font-weight: 900; letter-spacing: -1px;
                    color: white; margin-right: 40px; text-decoration: none;
                }
                .text-red { color: #ff2a2a; }

                .search-container { display: flex; justify-content: center; }

                .search-bar {
                    background: #0f0f0f;
                    border: 1px solid #222;
                    padding: 10px 20px;
                    display: flex; align-items: center; gap: 12px;
                    width: 100%; max-width: 500px;
                    border-radius: 8px;
                }
                .search-bar input {
                    background: transparent; border: none; outline: none;
                    color: white; width: 100%; font-size: 15px;
                }

                .nav-actions { display: flex; align-items: center; gap: 20px; }
                .icon-btn { background: none; color: white; border: none; cursor: pointer; }
                .mobile-menu { background: none; color: white; border: none; cursor: pointer; display: none; }

                @media (max-width: 768px) {
                    .search-container { display: none; }
                    .mobile-menu { display: block; }
                }
            `}</style>
        </nav>
    );
};

export default Header;