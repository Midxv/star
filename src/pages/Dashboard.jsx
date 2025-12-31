// src/pages/Dashboard.jsx
import React, { useState, useEffect } from "react";
import { onSnapshot, doc } from "firebase/firestore";
import { db, auth } from "../firebaseConfig";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { Shield, Globe, CreditCard, Hash, Check, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Helper to generate data within specific constraints
const generateData = (count, status) => {
    const brands = ['VISA', 'MASTERCARD']; // Only Visa & Master
    const types = ['PLATINUM', 'GOLD', 'BUSINESS', 'SIGNATURE', 'INFINITE', 'WORLD'];
    const countries = ['USA', 'UK', 'DE', 'JP', 'CA', 'FR'];

    return Array.from({ length: count }).map((_, i) => ({
        id: status === 'live' ? `live-${i}` : `oos-${i}`,
        brand: brands[Math.floor(Math.random() * brands.length)],
        type: types[Math.floor(Math.random() * types.length)],
        country: countries[Math.floor(Math.random() * countries.length)],
        bin: Math.floor(400000 + Math.random() * 199999),
        // Random price between 1.47 and 2.13
        price: (Math.random() * (2.13 - 1.47) + 1.47).toFixed(2),
        qty: 1,
        status: status
    }));
};

const Dashboard = () => {
    const navigate = useNavigate();
    const [balance, setBalance] = useState(0.00);
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [addedItemId, setAddedItemId] = useState(null);

    // 13 Live Items, 7 Out of Stock Items
    const [liveItems] = useState(generateData(13, 'live'));
    const [oosItems] = useState(generateData(7, 'oos'));

    // Real-time Balance
    useEffect(() => {
        if (auth.currentUser) {
            const unsubBalance = onSnapshot(doc(db, "users", auth.currentUser.uid), (doc) => {
                if (doc.exists()) setBalance(doc.data().balance);
            });
            return () => unsubBalance();
        }
    }, []);

    // Add to Cart & Redirect
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

        // Redirect to Cart after short delay for visual feedback
        setTimeout(() => {
            setAddedItemId(null);
            navigate('/cart');
        }, 500);
    };

    return (
        <>
            <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />
            <Header onOpenSidebar={() => setSidebarOpen(!isSidebarOpen)} balance={balance} />

            <main className="market-container">

                {/* --- LIVE INVENTORY --- */}
                <h1 className="section-title">
                    Live Inventory <span className="live-dot"></span>
                </h1>

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
                        {liveItems.map((item) => (
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
                                        className={`buy-pill-btn glow-green ${addedItemId === item.id ? 'added' : ''}`}
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

                {/* --- OUT OF STOCK SECTION --- */}
                <h2 className="section-subtitle">Unavailable / Out of Stock</h2>

                <div className="table-pill-container faded">
                    <table className="data-table">
                        <thead>
                        <tr>
                            <th>Brand</th>
                            <th>Type</th>
                            <th>Country</th>
                            <th>BIN</th>
                            <th>Status</th>
                        </tr>
                        </thead>
                        <tbody>
                        {oosItems.map((item) => (
                            <tr key={item.id} className="row-pill disabled">
                                <td className={`brand ${item.brand.toLowerCase()}`}>{item.brand}</td>
                                <td><span className="type-pill">{item.type}</span></td>
                                <td>{item.country}</td>
                                <td className="mono">{item.bin}</td>
                                <td>
                                    <span className="status-sold-out">
                                        <XCircle size={14} style={{marginRight:5, verticalAlign:'text-bottom'}}/>
                                        SOLD OUT
                                    </span>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

            </main>

            {/* --- PROFESSIONAL FOOTER --- */}
            <footer className="footer">
                <div className="footer-content">
                    <div className="footer-left">
                        <h3>Star<span>Card</span></h3>
                        <p>The premium marketplace for verified digital assets.</p>
                        <p className="copy">&copy; {new Date().getFullYear()} StarCard Inc. All rights reserved.</p>
                    </div>
                    <div className="footer-right">
                        <div className="link-group">
                            <h4>Legal</h4>
                            <span>Terms of Service</span>
                            <span>Privacy Policy</span>
                            <span>Refund Policy</span>
                        </div>
                        <div className="link-group">
                            <h4>Support</h4>
                            <span>Contact Us</span>
                            <span>FAQ</span>
                            <span>Status</span>
                        </div>
                    </div>
                </div>
            </footer>

            <style jsx>{`
                .market-container { max-width: 1200px; margin: 40px auto; padding: 0 20px; min-height: 80vh; }
                
                .section-title {
                    color: white; margin-bottom: 20px; font-size: 32px;
                    font-weight: 800; letter-spacing: -1px; display: flex; align-items: center; gap: 12px;
                }
                .live-dot { 
                    width: 12px; height: 12px; background: #00ff88; border-radius: 50%; 
                    box-shadow: 0 0 15px #00ff88; animation: pulse 2s infinite; 
                }
                @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.5; } 100% { opacity: 1; } }

                .section-subtitle {
                    color: #666; margin-top: 60px; margin-bottom: 20px; font-size: 24px;
                    font-weight: 800; letter-spacing: -1px;
                }

                /* TABLE CONTAINER */
                .table-pill-container {
                    background: #111;
                    border-radius: 40px;
                    border: 1px solid #222;
                    padding: 20px;
                    overflow-x: auto;
                }
                .table-pill-container.faded { border-color: #1a1a1a; opacity: 0.7; pointer-events: none; }

                .data-table { width: 100%; border-collapse: separate; border-spacing: 0 10px; color: #ddd; min-width: 700px; }

                .data-table th {
                    text-align: left; padding: 15px 30px; color: #666;
                    font-size: 12px; text-transform: uppercase; letter-spacing: 1px;
                }

                /* ROWS */
                .row-pill td {
                    padding: 20px 30px;
                    background: #0a0a0a;
                    border-top: 1px solid #1a1a1a;
                    border-bottom: 1px solid #1a1a1a;
                    transition: 0.2s;
                }
                .row-pill td:first-child { border-top-left-radius: 50px; border-bottom-left-radius: 50px; border-left: 1px solid #1a1a1a; }
                .row-pill td:last-child { border-top-right-radius: 50px; border-bottom-right-radius: 50px; border-right: 1px solid #1a1a1a; }

                .row-pill:hover td { background: #151515; transform: translateY(-2px); border-color: #333; }
                
                /* Disabled Row Style */
                .row-pill.disabled td { background: #080808; border-color: #151515; color: #555; }
                .row-pill.disabled:hover td { transform: none; background: #080808; }

                .brand { font-weight: 800; font-size: 15px; }
                .brand.visa { color: #4361ee; }
                .brand.mastercard { color: #ef233c; }

                .type-pill {
                    font-size: 10px; background: #222; color: #aaa;
                    padding: 6px 12px; border-radius: 20px; letter-spacing: 0.5px;
                }

                .mono { font-family: 'JetBrains Mono', monospace; color: #888; }
                .price { color: #fff; font-weight: 800; font-family: 'JetBrains Mono', monospace; font-size: 16px; }
                
                .status-sold-out { color: #ef233c; font-weight: 800; font-size: 12px; letter-spacing: 1px; display: flex; align-items: center; }

                /* GLOWING BUY BUTTON */
                .buy-pill-btn {
                    background: #fff; color: #000; border: none;
                    padding: 10px 24px; font-weight: 800; font-size: 12px;
                    cursor: pointer; border-radius: 50px;
                    transition: 0.2s; min-width: 80px;
                    display: flex; align-items: center; justify-content: center;
                }
                .buy-pill-btn.glow-green {
                    box-shadow: 0 0 10px rgba(0, 255, 136, 0.5);
                    animation: btn-pulse 2s infinite;
                }
                @keyframes btn-pulse {
                    0% { box-shadow: 0 0 5px rgba(0, 255, 136, 0.4); }
                    50% { box-shadow: 0 0 15px rgba(0, 255, 136, 0.7); }
                    100% { box-shadow: 0 0 5px rgba(0, 255, 136, 0.4); }
                }
                .buy-pill-btn:hover { background: #00ff88; color: black; transform: scale(1.05); }
                .buy-pill-btn.added { background: #00ff88; color: #000; pointer-events: none; }

                /* FOOTER */
                .footer { border-top: 1px solid #222; background: #0a0a0a; padding: 60px 20px; margin-top: 80px; }
                .footer-content { max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; flex-wrap: wrap; gap: 40px; }
                
                .footer-left h3 { font-size: 24px; font-weight: 900; color: white; margin-bottom: 10px; }
                .footer-left h3 span { color: #ef233c; }
                .footer-left p { color: #666; font-size: 14px; margin-bottom: 5px; }
                .footer-left .copy { margin-top: 20px; color: #444; font-size: 12px; }

                .footer-right { display: flex; gap: 60px; }
                .link-group h4 { color: #fff; font-size: 14px; margin-bottom: 15px; text-transform: uppercase; letter-spacing: 1px; }
                .link-group span { display: block; color: #888; font-size: 14px; margin-bottom: 10px; cursor: pointer; transition: 0.2s; }
                .link-group span:hover { color: #ef233c; transform: translateX(5px); }

                @media (max-width: 768px) {
                    .footer-content { flex-direction: column; text-align: center; }
                    .footer-right { flex-direction: column; gap: 30px; }
                }
            `}</style>
        </>
    );
};

export default Dashboard;