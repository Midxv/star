import React, { useState, useEffect } from 'react';
import { ShoppingCart, Menu } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Header = ({ onOpenSidebar }) => {
    const navigate = useNavigate();
    const [cartCount, setCartCount] = useState(0);

    const updateCartCount = () => {
        const cart = JSON.parse(localStorage.getItem('myCart') || '[]');
        setCartCount(cart.length);
    };

    useEffect(() => {
        updateCartCount();
        window.addEventListener('cartUpdated', updateCartCount);
        return () => window.removeEventListener('cartUpdated', updateCartCount);
    }, []);

    return (
        <nav className="navbar">
            <div className="nav-left">
                <button className="menu-btn" onClick={onOpenSidebar}>
                    <Menu size={24} color="#fff" />
                </button>
            </div>

            <div className="nav-center">
                <Link to="/" className="logo">
                    MasTrMARKET<span className="blink">_</span>
                </Link>
            </div>

            <div className="nav-right">
                {/* WALLET BUTTON REMOVED HERE */}

                <button className="icon-btn" onClick={() => navigate('/cart')}>
                    <ShoppingCart size={24} />
                    {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                </button>
            </div>

            <style jsx>{`
                .navbar {
                    height: 90px;
                    border-bottom: 1px solid #1a1a1a;
                    background: rgba(5, 5, 5, 0.95);
                    backdrop-filter: blur(10px);
                    position: sticky;
                    top: 0;
                    z-index: 1000;
                    display: grid;
                    grid-template-columns: 1fr auto 1fr;
                    align-items: center;
                    padding: 0 30px;
                }

                .nav-left {
                    display: flex;
                    justify-content: flex-start;
                }

                .nav-center {
                    display: flex;
                    justify-content: center;
                }

                .nav-right {
                    display: flex;
                    justify-content: flex-end;
                    align-items: center;
                    gap: 20px;
                }

                .logo {
                    font-family: 'JetBrains Mono', monospace;
                    font-size: 32px;
                    font-weight: 800;
                    color: white;
                    text-decoration: none;
                    letter-spacing: -2px;
                    text-shadow: 0 0 20px rgba(255, 255, 255, 0.2);
                    transition: 0.3s;
                }

                .logo:hover {
                    text-shadow: 0 0 30px rgba(255, 42, 42, 0.6);
                    color: #119990;
                }

                .blink {
                    color: #119990;
                    animation: blinker 1s linear infinite;
                }

                @keyframes blinker {
                    50% {
                        opacity: 0;
                    }
                }

                .menu-btn, .icon-btn {
                    background: none;
                    border: none;
                    cursor: pointer;
                    transition: 0.2s;
                    padding: 0;
                    color: white;
                    position: relative;
                }

                .menu-btn:hover, .icon-btn:hover {
                    transform: scale(1.1);
                    color: #119990;
                }

                .cart-badge {
                    position: absolute;
                    top: -5px;
                    right: -8px;
                    background: #119990;
                    color: white;
                    font-size: 10px;
                    font-weight: bold;
                    width: 16px;
                    height: 16px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                }

                @keyframes popIn {
                    from {
                        transform: scale(0);
                    }
                    to {
                        transform: scale(1);
                    }
                }

                @media (max-width: 768px) {
                    .navbar {
                        padding: 0 15px;
                        height: 70px;
                    }

                    .logo {
                        font-size: 24px;
                    }
                }
            `}</style>
        </nav>
    );
};

export default Header;