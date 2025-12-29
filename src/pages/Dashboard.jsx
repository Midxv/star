import React, { useState, useEffect } from "react";
import { onSnapshot, doc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { Shield, Globe, CreditCard, Hash, Check } from 'lucide-react';

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
        price: (Math.random() * 50 + 10).toFixed(2),
        qty: 1
    }));
};

const Dashboard = ({ user }) => {
    const [balance, setBalance] = useState(0.00);
    const [marketItems] = useState(generateMarketData());
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [addedItemId, setAddedItemId] = useState(null);

    useEffect(() => {
        if (user) {
            const unsubBalance = onSnapshot(doc(db, "users", user.uid), (doc) => {
                if (doc.exists()) setBalance(doc.data().balance);
            });
            return () => unsubBalance();
        }
    }, [user]);

    const addToCart = (item) => {
        const currentCart = JSON.parse(localStorage.getItem('myCart') || '[]');
        const existingItem = currentCart.find(cartItem => cartItem.id === item.id);

        if (existingItem) {
            existingItem.qty += 1;
        } else {
            currentCart.push({ ...item, qty: 1 });
        }

        localStorage.setItem('myCart', JSON.stringify(currentCart));
        window.dispatchEvent(new Event("cartUpdated"));

        setAddedItemId(item.id);
        setTimeout(() => setAddedItemId(null), 1000);
    };

    return (
        <>
            <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />
            <Header onOpenSidebar={() => setSidebarOpen(!isSidebarOpen)} balance={balance} />

            <main className="market-container">
                <h1 className="section-title">Marketplace</h1>

                <div className="table-pill-container">
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
                            <tr key={item.id} className="row-pill">
                                <td className={`brand ${item.brand.toLowerCase()}`}>{item.brand}</td>
                                <td>
                                    <span className="type-pill">{item.type}</span>
                                </td>
                                <td>{item.country}</td>
                                <td className="mono">{item.bin}</td>
                                <td className="price">${item.price}</td>
                                <td>
                                    <button
                                        className={`buy-pill-btn ${addedItemId === item.id ? 'added' : ''}`}
                                        onClick={() => addToCart(item)}
                                    >
                                        {addedItemId === item.id ? <Check size={14}/> : 'ADD'}
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
                .section-title {
                    color: white; margin-bottom: 30px; font-size: 32px;
                    font-weight: 800; text-align: center; letter-spacing: -1px;
                }

                /* PILL CONTAINER FOR TABLE */
                .table-pill-container {
                    background: #111;
                    border-radius: 40px; /* Big Pill Shape */
                    border: 1px solid #222;
                    padding: 20px;
                    overflow-x: auto;
                }

                .data-table { width: 100%; border-collapse: separate; border-spacing: 0 10px; color: #ddd; min-width: 700px; }

                .data-table th {
                    text-align: left; padding: 15px 30px; color: #666;
                    font-size: 12px; text-transform: uppercase; letter-spacing: 1px;
                }

                /* ROW STYLING */
                .row-pill td {
                    padding: 20px 30px;
                    background: #0a0a0a;
                    border-top: 1px solid #1a1a1a;
                    border-bottom: 1px solid #1a1a1a;
                    transition: 0.2s;
                }

                /* Round left/right ends of rows */
                .row-pill td:first-child { border-top-left-radius: 50px; border-bottom-left-radius: 50px; border-left: 1px solid #1a1a1a; }
                .row-pill td:last-child { border-top-right-radius: 50px; border-bottom-right-radius: 50px; border-right: 1px solid #1a1a1a; }

                /* Hover Effect */
                .row-pill:hover td { background: #151515; transform: translateY(-2px); border-color: #333; }

                .brand { font-weight: 800; font-size: 15px; }
                .brand.visa { color: #4361ee; }
                .brand.mastercard { color: #ef233c; }

                .type-pill {
                    font-size: 10px; background: #222; color: #aaa;
                    padding: 6px 12px; border-radius: 20px; letter-spacing: 0.5px;
                }

                .mono { font-family: 'JetBrains Mono', monospace; color: #888; }
                .price { color: #fff; font-weight: 800; font-family: 'JetBrains Mono', monospace; font-size: 16px; }

                /* BUTTON PILL */
                .buy-pill-btn {
                    background: #fff; color: #000; border: none;
                    padding: 10px 24px; font-weight: 800; font-size: 12px;
                    cursor: pointer; border-radius: 50px; /* Pill */
                    transition: 0.2s; min-width: 80px;
                    display: flex; align-items: center; justify-content: center;
                }
                .buy-pill-btn:hover { background: #ff2a2a; color: white; transform: scale(1.05); }

                .buy-pill-btn.added {
                    background: #00ff88; color: #000; pointer-events: none;
                }
            `}</style>
        </>
    );
};

export default Dashboard;