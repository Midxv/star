// src/pages/Home.jsx
import React, { useState, useEffect } from 'react';
import { Plus, Globe, Server, Smartphone, Shield, Star, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { db, auth } from '../firebaseConfig';
import { doc, onSnapshot } from "firebase/firestore";

const Home = () => {
    const navigate = useNavigate();
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [balance, setBalance] = useState(0.00);

    // Balance Listener
    useEffect(() => {
        if (auth.currentUser) {
            const unsub = onSnapshot(doc(db, "users", auth.currentUser.uid), (doc) => {
                if (doc.exists()) setBalance(doc.data().balance);
            });
            return () => unsub();
        }
    }, []);

    const handleOrder = (productType) => {
        navigate('/order', { state: { product: productType } });
    };

    return (
        <div className="dashboard-container">

            {/* SIDEBAR COMPONENT */}
            <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />

            {/* HEADER & BALANCE SECTION */}
            <div className="hero-section">

                {/* Hamburger Menu */}
                <div className="top-nav">
                    <button className="menu-btn" onClick={() => setSidebarOpen(true)}>
                        <Menu size={28} color="#1e1b4b" />
                    </button>
                </div>

                {/* Logo */}
                <h1 className="brand-title-dashboard">
                    Super<span style={{ color: 'var(--primary)' }}>Proxy</span>
                </h1>

                {/* Balance Card */}
                <div className="balance-card animate-pop">
                    <p className="balance-label">Available Balance</p>
                    <h2 className="balance-value">${balance ? balance.toFixed(2) : '0.00'}</h2>

                    <button
                        className="btn-add-funds"
                        onClick={() => navigate('/wallet')}
                    >
                        <Plus size={18} strokeWidth={3} /> Add Funds
                    </button>
                </div>

            </div>

            {/* PRODUCT CARDS */}
            <div className="products-grid">
                <ProductCard
                    icon={<Globe size={32} className="icon-blue" />}
                    title="Residential" price="$1.75 / GB" desc="Ethical IPs for scraping & unblocking."
                    onClick={() => handleOrder('Residential')}
                />
                <ProductCard
                    icon={<Server size={32} className="icon-red" />}
                    title="ISP Proxies" price="$2.40 / IP" desc="High speed static IPs for accounts."
                    onClick={() => handleOrder('ISP')}
                />
                <ProductCard
                    icon={<Shield size={32} className="icon-violet" />}
                    title="Datacenter" price="$1.39 / IP" desc="99.9% Uptime with 10Gbps speeds."
                    onClick={() => handleOrder('Datacenter')}
                />
                <ProductCard
                    icon={<Smartphone size={32} className="icon-orange" />}
                    title="Mobile 4G/5G" price="$10.00 / Mo" desc="Real carrier networks for verification."
                    onClick={() => handleOrder('Mobile')}
                />
            </div>

            {/* REVIEWS */}
            <div className="reviews-section">
                <div className="reviews-header">
                    <Star fill="#00b67a" stroke="none" size={28} />
                    <h3 style={{ fontSize: '24px', margin: 0, fontWeight: '800' }}>Customers Review</h3>
                </div>

                <div className="reviews-grid">
                    <ReviewCard user="Daniel R." text="Honestly, I was skeptical at first because of the price, but the ISP proxies are actually cleaner than the ones I bought for $5/IP elsewhere." />
                    <ReviewCard user="Sarah J." text="Support is super responsive. I had an issue setting up the rotation and they fixed it in like 5 minutes. Solid service." />
                    <ReviewCard user="Mike B." text="Been using their residential pool for sneaker drops for 3 months. No bans yet, speeds are decent. Good value for money." />
                    <ReviewCard user="Kevin T." text="The dashboard is just easy to use. No complicated setup, just bought the plan and got the IPs instantly. Works for me." />
                </div>
            </div>

        </div>
    );
};

// --- SUB-COMPONENTS ---
const ProductCard = ({ icon, title, price, desc, onClick }) => (
    <div className="product-card" onClick={onClick}>
        <div style={{ background: '#f3f4f6', width: 'fit-content', padding: '12px', borderRadius: '14px', marginBottom: '15px' }}>
            {icon}
        </div>
        <h3>{title}</h3>
        <p className="desc">{desc}</p>
        <div className="price-tag">{price}</div>
    </div>
);

const ReviewCard = ({ user, text }) => (
    <div className="review-card-white">
        <div style={{ display: 'flex', gap: '4px', marginBottom: '12px' }}>
            {[1,2,3,4,5].map(i => <Star key={i} size={14} fill="#00b67a" stroke="none" />)}
        </div>
        <p className="review-text">"{text}"</p>
        <p className="review-user">{user}</p>
    </div>
);

export default Home;