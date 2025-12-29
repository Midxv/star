import React, { useState, useEffect } from "react";
import { collection, onSnapshot, query, doc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useNavigate } from 'react-router-dom';
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { Shield, Globe, CreditCard, Hash } from 'lucide-react';

// MOCK DATA GENERATOR
const generateMarketData = () => {
    const brands = ['VISA', 'MASTERCARD', 'AMEX', 'DISCOVER'];
    const types = ['PLATINUM', 'GOLD', 'BUSINESS', 'SIGNATURE'];
    const countries = ['USA', 'UK', 'DE', 'JP', 'CA', 'FR'];

    return Array.from({ length: 10 }).map((_, i) => ({
        id: i,
        brand: brands[Math.floor(Math.random() * brands.length)],
        type: types[Math.floor(Math.random() * types.length)],
        country: countries[Math.floor(Math.random() * countries.length)],
        bin: Math.floor(400000 + Math.random() * 199999),
        price: (Math.random() * 50 + 10).toFixed(2)
    }));
};

const Dashboard = ({ user }) => {
    const [balance, setBalance] = useState(0.00);
    const [orders, setOrders] = useState([]);
    const [marketItems] = useState(generateMarketData()); // Init random data
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [view, setView] = useState('inventory');
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            const unsubBalance = onSnapshot(doc(db, "users", user.uid), (doc) => {
                if (doc.exists()) setBalance(doc.data().balance);
            });
            const q = query(collection(db, "users", user.uid, "orders"));
            const unsubOrders = onSnapshot(q, (snapshot) => {
                setOrders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            });
            return () => { unsubBalance(); unsubOrders(); };
        }
    }, [user]);

    return (
        <>
            <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />
            <Header onOpenSidebar={() => setSidebarOpen(!isSidebarOpen)} balance={balance} />

            <main className="market-container">

                {/* TABS */}
                <div className="tabs">
                    <button className={`tab-btn ${view === 'inventory' ? 'active' : ''}`} onClick={() => setView('inventory')}>
                        My Assets
                    </button>
                    <button className={`tab-btn ${view === 'market' ? 'active' : ''}`} onClick={() => setView('market')}>
                        Marketplace
                    </button>
                </div>

                {/* INVENTORY VIEW */}
                {view === 'inventory' && (
                    <div className="grid-layout">
                        {orders.length === 0 ? (
                            <div className="empty-state">No active assets found.</div>
                        ) : (
                            orders.map((card) => (
                                <div className="cc-card" key={card.id}>
                                    <div className="card-top">
                                        <span className="tag">{card.type || 'VISA'}</span>
                                        <div className="chip"></div>
                                    </div>
                                    <div className="card-number">
                                        **** **** **** {card.cardNumber?.slice(12,16) || '0000'}
                                    </div>
                                    <div className="card-bottom">
                                        <span>{card.cardName || 'USER'}</span>
                                        <span>{card.expiry || '00/00'}</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {/* MARKET TABLE VIEW */}
                {view === 'market' && (
                    <div className="table-container">
                        <table className="data-table">
                            <thead>
                            <tr>
                                <th><CreditCard size={14}/> Brand</th>
                                <th><Shield size={14}/> Type</th>
                                <th><Globe size={14}/> Country</th>
                                <th><Hash size={14}/> BIN</th>
                                <th>Price</th>
                                <th>Action</th>
                            </tr>
                            </thead>
                            <tbody>
                            {marketItems.map((item) => (
                                <tr key={item.id}>
                                    <td className={`brand ${item.brand.toLowerCase()}`}>{item.brand}</td>
                                    <td className="type-badge">{item.type}</td>
                                    <td>{item.country}</td>
                                    <td className="mono">{item.bin}</td>
                                    <td className="price">${item.price}</td>
                                    <td>
                                        <button className="buy-btn-small" onClick={() => navigate('/cart')}>
                                            ADD
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>

            <style jsx>{`
                .market-container { max-width: 1200px; margin: 40px auto; padding: 0 20px; }
                
                .tabs { display: flex; gap: 20px; margin-bottom: 30px; border-bottom: 1px solid #222; padding-bottom: 10px; }
                .tab-btn { background: none; border: none; color: #666; font-size: 16px; font-weight: 700; cursor: pointer; padding: 10px 0; }
                .tab-btn.active { color: #ff2a2a; border-bottom: 2px solid #ff2a2a; }

                /* TABLE STYLES */
                .table-container { background: #111; border-radius: 12px; border: 1px solid #222; overflow-x: auto; }
                .data-table { width: 100%; border-collapse: collapse; color: #ddd; min-width: 600px; }
                
                .data-table th { text-align: left; padding: 15px 20px; color: #666; font-size: 12px; text-transform: uppercase; border-bottom: 1px solid #222; }
                .data-table td { padding: 15px 20px; border-bottom: 1px solid #1a1a1a; font-size: 14px; vertical-align: middle; }
                
                .brand { font-weight: 800; }
                .brand.visa { color: #4361ee; }
                .brand.mastercard { color: #ef233c; }
                
                .mono { font-family: 'JetBrains Mono', monospace; color: #888; }
                .price { color: #00ff88; font-weight: 700; font-family: 'JetBrains Mono', monospace; }

                .buy-btn-small {
                    background: #fff; color: #000; border: none; padding: 6px 14px;
                    font-weight: 800; font-size: 12px; cursor: pointer; border-radius: 4px;
                    transition: 0.2s;
                }
                .buy-btn-small:hover { background: #ff2a2a; color: white; }

                /* Simple Card Grid for Inventory */
                .grid-layout { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; }
                .cc-card { background: linear-gradient(145deg, #1a1a1a, #0a0a0a); border: 1px solid #333; padding: 20px; border-radius: 16px; color: white; }
                .chip { width: 35px; height: 25px; background: #d4af37; border-radius: 4px; opacity: 0.7; margin-top: 10px; }
                .card-number { font-family: 'JetBrains Mono'; font-size: 20px; margin: 20px 0; letter-spacing: 2px; }
                .card-bottom { display: flex; justify-content: space-between; font-size: 12px; color: #888; }
            `}</style>
        </>
    );
};

export default Dashboard;