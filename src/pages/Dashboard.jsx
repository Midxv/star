// src/pages/Dashboard.jsx
import React, { useState, useEffect } from "react";
import { Search, Wallet } from 'lucide-react';
import { collection, onSnapshot, query, doc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useNavigate } from 'react-router-dom'; // <--- CRITICAL IMPORT
import Sidebar from "../components/Sidebar";    // <--- IMPORT SIDEBAR COMPONENT

const Dashboard = ({ user }) => {
    const [balance, setBalance] = useState(0.00);
    const [orders, setOrders] = useState([]);
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [view, setView] = useState('inventory');

    const navigate = useNavigate(); // <--- INITIALIZE HOOK

    useEffect(() => {
        if (user) {
            // 1. Balance Listener
            const unsubBalance = onSnapshot(doc(db, "users", user.uid), (doc) => {
                if (doc.exists()) setBalance(doc.data().balance);
            });

            // 2. Inventory Listener
            const q = query(collection(db, "users", user.uid, "orders"));
            const unsubOrders = onSnapshot(q, (snapshot) => {
                setOrders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            });

            return () => { unsubBalance(); unsubOrders(); };
        }
    }, [user]);

    return (
        <>
            {/* Sidebar Component (Handles navigation & logout internally) */}
            <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />

            {/* Header */}
            <header className="header">
                <div className="hamburger" onClick={() => setSidebarOpen(true)}>
                    <span></span><span></span><span></span>
                </div>

                <h1 className="logo">Star<span>Card</span></h1>

                <div className="search-bar">
                    <Search size={16} color="#666" />
                    <input type="text" placeholder="Search inventory..." />
                </div>

                {/* --- CLICK EVENT FIXED HERE --- */}
                <button
                    className="wallet-btn"
                    onClick={() => navigate('/wallet')}
                >
                    <Wallet size={16} style={{marginRight:'8px'}}/>
                    <span>${balance?.toFixed(2)}</span>
                </button>
            </header>

            {/* Main Content */}
            <main className="market">
                {view === 'inventory' && (
                    <>
                        <h2 style={{gridColumn: '1/-1', marginBottom: '20px'}}>My Secure Cards</h2>
                        {orders.length === 0 ? (
                            <div style={{gridColumn: '1/-1', textAlign:'center', color:'#666', padding:'50px'}}>
                                No cards in inventory. Add funds or purchase from market.
                            </div>
                        ) : (
                            orders.map((card) => (
                                <div className="cc-card" key={card.id}>
                                    <div className="card-top">
                                        <span className="tag">{card.type || 'VISA'} · PREMIUM</span>
                                        <div style={{width:'30px', height:'20px', background:'#ddd', borderRadius:'4px', opacity:'0.2'}}></div>
                                    </div>
                                    <div className="card-details-block">
                                        <label>Cardholder</label>
                                        <span className="info-text">{card.cardName || 'Unknown'}</span>
                                    </div>
                                    <div className="card-number">
                                        <span>{card.cardNumber?.slice(0,4) || '****'}</span>
                                        <span>{card.cardNumber?.slice(4,8) || '****'}</span>
                                        <span>{card.cardNumber?.slice(8,12) || '****'}</span>
                                        <span>{card.cardNumber?.slice(12,16) || '****'}</span>
                                    </div>
                                    <div className="card-bottom">
                                        <div><small>EXPIRY</small><span className="info-text">{card.expiry || 'MM/YY'}</span></div>
                                        <div><small>CVV</small><span className="info-text text-red">{card.cvv || '***'}</span></div>
                                    </div>
                                </div>
                            ))
                        )}
                    </>
                )}

                {view === 'market' && (
                    <div style={{gridColumn: '1/-1', textAlign:'center', color:'#444', marginTop:'50px'}}>
                        <h2>Marketplace Offline</h2>
                        <p>Restocking new high-balance cards...</p>
                    </div>
                )}
            </main>
        </>
    );
}

export default Dashboard;