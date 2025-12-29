import React from 'react';
import { ShoppingCart, Menu, Wallet } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Header = ({ onOpenSidebar, balance }) => {
    const navigate = useNavigate();

    return (
        <nav className="navbar">
            {/* LEFT: Mobile Menu Trigger */}
            <div className="nav-left">
                <button className="menu-btn" onClick={onOpenSidebar}>
                    <Menu size={24} color="#fff" />
                </button>
            </div>

            {/* CENTER: Logo */}
            <div className="nav-center">
                <Link to="/" className="logo">
                    STMARKET<span className="blink">_</span>
                </Link>
            </div>

            {/* RIGHT: Actions */}
            <div className="nav-right">
                {/* 1. PILL SHAPED WALLET BUTTON (Clickable) */}
                {balance !== undefined && (
                    <button
                        className="balance-pill"
                        onClick={() => navigate('/wallet')}
                    >
                        <Wallet size={16} />
                        <span>${balance.toFixed(2)}</span>
                    </button>
                )}

                {/* 2. CART BUTTON */}
                <button className="icon-btn" onClick={() => navigate('/cart')}>
                    <ShoppingCart size={24} />
                    <span className="cart-badge">3</span>
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
                    grid-template-columns: 1fr auto 1fr;
                    align-items: center;
                    padding: 0 30px;
                }

                .nav-left { display: flex; justify-content: flex-start; }
                .nav-center { display: flex; justify-content: center; }
                .nav-right { display: flex; justify-content: flex-end; align-items: center; gap: 20px; }

                .logo {
                    font-family: 'JetBrains Mono', monospace;
                    font-size: 32px; font-weight: 800; color: white;
                    text-decoration: none; letter-spacing: -2px;
                    text-shadow: 0 0 20px rgba(255, 255, 255, 0.2);
                }
                .blink { color: #ff2a2a; animation: blinker 1s linear infinite; }
                @keyframes blinker { 50% { opacity: 0; } }

                /* PILL SHAPE WALLET BTN */
                .balance-pill {
                    display: flex; align-items: center; gap: 8px;
                    font-family: 'JetBrains Mono', monospace;
                    color: #00ff88; font-size: 14px; font-weight: 700;
                    background: rgba(0, 255, 136, 0.1);
                    padding: 10px 20px;
                    border-radius: 50px; /* Pill Shape */
                    border: 1px solid rgba(0, 255, 136, 0.2);
                    cursor: pointer; transition: 0.2s;
                }
                .balance-pill:hover {
                    background: rgba(0, 255, 136, 0.2);
                    box-shadow: 0 0 15px rgba(0, 255, 136, 0.2);
                    transform: translateY(-1px);
                }

                .menu-btn, .icon-btn {
                    background: none; border: none; cursor: pointer;
                    transition: transform 0.2s; padding: 0; color: white; position: relative;
                }
                .menu-btn:hover, .icon-btn:hover { transform: scale(1.1); color: #ff2a2a; }

                .cart-badge {
                    position: absolute; top: -5px; right: -8px;
                    background: #ff2a2a; color: white;
                    font-size: 10px; font-weight: bold;
                    width: 16px; height: 16px; border-radius: 50%;
                    display: flex; align-items: center; justify-content: center;
                }

                @media (max-width: 768px) {
                    .navbar { padding: 0 15px; height: 70px; }
                    .logo { font-size: 24px; }
                    .balance-pill span { display: none; } /* Hide text on small mobile */
                }
            `}</style>
        </nav>
    );
};

export default Header;