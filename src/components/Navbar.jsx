import React from 'react';
import { Search, ShoppingCart, User } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="container nav-content">

                {/* LOGO */}
                <Link to="/" className="logo">
                    MARKET<span className="text-red">.</span>
                </Link>

                {/* SEARCH BAR */}
                <div className="search-bar">
                    <Search size={18} color="#666" />
                    <input type="text" placeholder="Search premium assets..." />
                </div>

                {/* ACTIONS */}
                <div className="nav-actions">
                    <button className="icon-btn"><ShoppingCart size={22} /></button>
                    <button className="btn-primary-small">Connect Wallet</button>
                </div>

            </div>

            <style jsx>{`
        .navbar {
          height: var(--nav-height);
          border-bottom: 1px solid var(--border);
          background: rgba(0,0,0,0.8); /* Glass effect */
          backdrop-filter: blur(10px);
          position: sticky; top: 0; z-index: 100;
        }
        .nav-content { display: flex; justify-content: space-between; align-items: center; height: 100%; }
        
        .logo { font-size: 24px; font-weight: 900; letter-spacing: -1px; color: white; }
        
        .search-bar {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 50px;
          padding: 10px 20px;
          display: flex; align-items: center; gap: 10px;
          width: 400px;
          transition: 0.3s;
        }
        .search-bar:focus-within { border-color: var(--primary); box-shadow: 0 0 15px var(--primary-glow); }
        .search-bar input { background: transparent; border: none; outline: none; color: white; width: 100%; }

        .nav-actions { display: flex; align-items: center; gap: 20px; }
        .icon-btn { background: none; color: white; transition: 0.2s; }
        .icon-btn:hover { color: var(--primary); }

        .btn-primary-small {
          background: var(--primary); color: white;
          padding: 10px 20px; border-radius: 50px; font-weight: 700; font-size: 14px;
          transition: 0.3s;
        }
        .btn-primary-small:hover { background: var(--primary-hover); box-shadow: 0 0 15px var(--primary-glow); }
      `}</style>
        </nav>
    );
};

export default Navbar;