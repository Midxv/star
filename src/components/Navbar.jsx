import React from 'react';
import { Search, ShoppingCart, Menu } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="container-fluid nav-content">

                {/* LOGO (Far Left) */}
                <Link to="/" className="logo">
                    MARKET<span className="text-red">.</span>
                </Link>

                {/* SEARCH BAR (Centered) */}
                <div className="search-container">
                    <div className="search-bar">
                        <Search size={18} color="#666" />
                        <input type="text" placeholder="Search assets..." />
                    </div>
                </div>

                {/* ACTIONS (Far Right) */}
                <div className="nav-actions">
                    <button className="icon-btn"><ShoppingCart size={24} /></button>
                    <button className="btn-primary-small">Connect Wallet</button>
                    <button className="mobile-menu"><Menu size={24} /></button>
                </div>

            </div>

            <style jsx>{`
                .navbar {
                    height: var(--nav-height);
                    border-bottom: 1px solid var(--border);
                    background: rgba(0, 0, 0, 0.9);
                    backdrop-filter: blur(20px);
                    position: sticky; top: 0; z-index: 1000;
                    display: flex; align-items: center;
                }

                /* Ensures full width spread */
                .nav-content {
                    display: grid;
                    grid-template-columns: auto 1fr auto; /* Left, Center, Right */
                    align-items: center;
                    width: 100%;
                }

                .logo {
                    font-size: 28px;
                    font-weight: 900;
                    letter-spacing: -1px;
                    color: white;
                    margin-right: 40px;
                }

                .search-container { display: flex; justify-content: center; }

                .search-bar {
                    background: var(--bg-card);
                    border: 1px solid var(--border);
                    padding: 12px 24px;
                    display: flex; align-items: center; gap: 12px;
                    width: 100%; max-width: 500px;
                    transition: 0.3s;
                    border-radius: 4px;
                }
                .search-bar:focus-within {
                    border-color: var(--primary);
                    box-shadow: 0 0 20px var(--primary-glow);
                }
                .search-bar input {
                    background: transparent;
                    border: none;
                    outline: none;
                    color: white;
                    width: 100%;
                    font-size: 15px;
                }

                .nav-actions { display: flex; align-items: center; gap: 30px; }
                .icon-btn { background: none; color: white; transition: 0.2s; padding: 0; }
                .icon-btn:hover { color: var(--primary); transform: scale(1.1); }

                .btn-primary-small {
                    background: var(--primary); color: white;
                    padding: 12px 28px; border-radius: 2px;
                    font-weight: 700; font-size: 14px; text-transform: uppercase;
                    transition: 0.3s;
                }
                .btn-primary-small:hover {
                    background: var(--primary-hover);
                    box-shadow: 0 0 15px var(--primary-glow);
                }

                .mobile-menu { display: none; background: none; color: white; }

                @media (max-width: 768px) {
                    .search-container { display: none; } /* Hide search on mobile for clean look */
                    .mobile-menu { display: block; }
                    .btn-primary-small { display: none; }
                }
            `}</style>
        </nav>
    );
};

export default Navbar;