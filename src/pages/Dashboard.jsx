import React, { useState, useEffect } from "react";
import { onSnapshot, doc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useNavigate } from 'react-router-dom';
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { Shield, Globe, CreditCard, Hash } from 'lucide-react';

const generateMarketData = () => {
    const brands = ['VISA', 'MASTERCARD', 'AMEX', 'DISCOVER'];
    const types = ['PLATINUM', 'GOLD', 'BUSINESS', 'SIGNATURE'];
    const countries = ['USA', 'UK', 'DE', 'JP', 'CA', 'FR'];

    return Array.from({ length: 15 }).map((_, i) => ({
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
    const [marketItems] = useState(generateMarketData());
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            const unsubBalance = onSnapshot(doc(db, "users", user.uid), (doc) => {
                if (doc.exists()) setBalance(doc.data().balance);
            });
            return () => unsubBalance();
        }
    }, [user]);

    return (
        <>
            <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />
            <Header onOpenSidebar={() => setSidebarOpen(!isSidebarOpen)} balance={balance} />

            <main className="market-container">
                <h1 className="section-title">Live Market</h1>

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
            </main>

            <style jsx>{`
                .market-container { max-width: 1200px; margin: 40px auto; padding: 0 20px; }
                .section-title { color: white; margin-bottom: 20px; font-size: 24px; font-weight: 800; }

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
            `}</style>
        </>
    );
};

export default Dashboard;