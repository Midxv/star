import React from 'react';
import { ShoppingCart, Menu, Wallet } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header = ({ onOpenSidebar, balance }) => {
    return (
        <nav className="navbar">
            {/* LEFT: Mobile Menu Trigger */}
            <div className="nav-left">
                <button className="menu-btn" onClick={onOpenSidebar}>
                    <Menu size={24} color="#fff" />
                </button>
            </div>

            {/* CENTER: The Big Logo */}
            <div className="nav-center">
                <Link to="/" className="logo">
                    STMARKET<span className="blink">_</span>
                </Link>
            </div>

            {/* RIGHT: Actions */}
            <div className="nav-right">
                {/* Optional: Show Balance in Header if passed */}
                {balance !== undefined && (
                    <div className="balance-tag">
                        <Wallet size={16} /> ${balance.toFixed(2)}
                    </div>
                )}
                <button className="icon-btn">
                    <ShoppingCart size={24} />
                </button>
            </div>

            <style jsx>{`
                .navbar {
                    height: 90px;
                    border-bottom: 1px solid #1a1a1a;
                    background: rgba(5, 5, 5, 0.95);
                    backdrop-filter: blur(10px);
                    position: sticky; top: 0; z-index: 1000;
                    display: grid;
                    grid-template-columns: 1fr auto 1fr; /* 3 Columns: Left, Center, Right */
                    align-items: center;
                    padding: 0 30px;
                }

                .nav-left { display: flex; justify-content: flex-start; }
                .nav-center { display: flex; justify-content: center; }
                .nav-right { display: flex; justify-content: flex-end; align-items: center; gap: 20px; }

                /* LOGO STYLES */
                .logo {
                    font-family: 'JetBrains Mono', monospace; /* Cool Tech Font */
                    font-size: 42px; /* BIG */
                    font-weight: 800;
                    color: white;
                    text-decoration: none;
                    letter-spacing: -2px;
                    text-shadow: 0 0 20px rgba(255, 255, 255, 0.2);
                    transition: 0.3s;
                }
                .logo:hover {
                    text-shadow: 0 0 30px rgba(255, 42, 42, 0.6);
                    color: #fff;
                }
                
                .blink {
                    color: #ff2a2a;
                    animation: blinker 1s linear infinite;
                }
                @keyframes blinker { 50% { opacity: 0; } }

                /* BUTTONS */
                .menu-btn, .icon-btn {
                    background: none; border: none; cursor: pointer;
                    transition: transform 0.2s; padding: 0;
                    color: white;
                }
                .menu-btn:hover, .icon-btn:hover { transform: scale(1.1); color: #ff2a2a; }

                /* BALANCE TAG (Optional header display) */
                .balance-tag {
                    display: flex; align-items: center; gap: 8px;
                    font-family: 'JetBrains Mono', monospace;
                    color: #00ff88; font-size: 14px;
                    background: rgba(0, 255, 136, 0.1);
                    padding: 6px 12px; border-radius: 4px;
                }

                @media (max-width: 768px) {
                    .logo { font-size: 28px; } /* Smaller on mobile */
                    .navbar { padding: 0 15px; height: 70px; }
                }
            `}</style>
        </nav>
    );
};

export default Header;