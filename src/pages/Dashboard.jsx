// src/pages/Dashboard.jsx
import React, { useState, useEffect } from "react";
import { onSnapshot, doc } from "firebase/firestore";
import { db, auth } from "../firebaseConfig";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { Shield, Globe, CreditCard, Hash, Check, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Initial Static Data for Live Cards (Authentic BINs, No Debit)
const initialLiveCards = [
    { id: 1, brand: 'VISA', type: 'PLATINUM', country: 'USA', bin: '400022' },
    { id: 2, brand: 'MASTERCARD', type: 'WORLD', country: 'UK', bin: '550000' },
    { id: 3, brand: 'VISA', type: 'SIGNATURE', country: 'FRANCE', bin: '497010' },
    { id: 4, brand: 'MASTERCARD', type: 'GOLD', country: 'GERMANY', bin: '510000' },
    { id: 5, brand: 'VISA', type: 'BUSINESS', country: 'USA', bin: '403600' },
    { id: 6, brand: 'MASTERCARD', type: 'STANDARD', country: 'ITALY', bin: '535500' },
    { id: 7, brand: 'VISA', type: 'INFINITE', country: 'USA', bin: '448500' },
    { id: 8, brand: 'MASTERCARD', type: 'WORLD ELITE', country: 'NETHERLANDS', bin: '522200' },
    { id: 9, brand: 'VISA', type: 'PLATINUM', country: 'SPAIN', bin: '491600' },
    { id: 10, brand: 'VISA', type: 'CREDIT', country: 'USA', bin: '414720' },
    { id: 11, brand: 'MASTERCARD', type: 'PLATINUM', country: 'SWEDEN', bin: '557700' },
    { id: 12, brand: 'VISA', type: 'CLASSIC', country: 'POLAND', bin: '450000' },
    { id: 13, brand: 'MASTERCARD', type: 'TITANIUM', country: 'USA', bin: '546600' },
];

// Out of Stock Cards (Visa/Master Only - No Amex/Discover)
const outOfStockCards = [
    { id: 101, brand: 'VISA', type: 'SIGNATURE', country: 'USA', bin: '401200' },
    { id: 102, brand: 'MASTERCARD', type: 'WORLD', country: 'USA', bin: '540000' },
    { id: 103, brand: 'VISA', type: 'GOLD', country: 'UK', bin: '465800' },
    { id: 104, brand: 'MASTERCARD', type: 'BUSINESS', country: 'USA', bin: '558800' },
    { id: 105, brand: 'VISA', type: 'PLATINUM', country: 'FRANCE', bin: '497100' },
    { id: 106, brand: 'MASTERCARD', type: 'GOLD', country: 'USA', bin: '520010' },
    { id: 107, brand: 'VISA', type: 'INFINITE', country: 'GERMANY', bin: '400010' },
];

const Dashboard = () => {
    const navigate = useNavigate();
    const [balance, setBalance] = useState(0.00);
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [addedItemId, setAddedItemId] = useState(null);

    // State to hold Live Cards with their unique prices
    const [liveInventory, setLiveInventory] = useState(initialLiveCards);

    // --- 1. REAL-TIME BALANCE ---
    useEffect(() => {
        if (auth.currentUser) {
            const unsubBalance = onSnapshot(doc(db, "users", auth.currentUser.uid), (doc) => {
                if (doc.exists()) setBalance(doc.data().balance);
            });
            return () => unsubBalance();
        }
    }, []);

    // --- 2. UNIQUE DYNAMIC PRICING (Every 15 mins) ---
    useEffect(() => {
        const updatePrices = () => {
            const updatedCards = initialLiveCards.map(card => {
                // Generate a unique random price for each card between 1.47 and 2.13
                const randomPrice = (Math.random() * (2.13 - 1.47) + 1.47).toFixed(2);
                return { ...card, price: randomPrice };
            });
            setLiveInventory(updatedCards);
        };

        updatePrices(); // Initial run
        const interval = setInterval(updatePrices, 15 * 60 * 1000); // 15 mins
        return () => clearInterval(interval);
    }, []);

    // --- 3. ADD TO CART LOGIC ---
    const addToCart = (item) => {
        const currentCart = JSON.parse(localStorage.getItem('myCart') || '[]');
        const existingItem = currentCart.find(cartItem => cartItem.id === item.id);

        if (existingItem) {
            existingItem.qty += 1;
            existingItem.price = item.price;
        } else {
            currentCart.push({ ...item, qty: 1 });
        }

        localStorage.setItem('myCart', JSON.stringify(currentCart));
        window.dispatchEvent(new Event("cartUpdated"));

        setAddedItemId(item.id);

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
                        {liveInventory.map((item) => (
                            <tr key={item.id} className="row-pill">
                                <td className={`brand ${item.brand.toLowerCase()}`}>{item.brand}</td>
                                <td>
                                    <span className="type-pill">{item.type}</span>
                                </td>
                                <td>{item.country}</td>
                                <td className="mono">{item.bin}</td>
                                <td className="price">€{item.price}</td>
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
                        {outOfStockCards.map((item) => (
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
                        <h3>STMARKET.</h3>
                        <p>The Best Marketplace for you.</p>
                        <p className="copy">&copy; {new Date().getFullYear()} STMARKET Inc. All rights reserved.</p>
                    </div>
                    <div className="footer-right">
                        <div className="link-group">
                            <h4>Legal</h4>
                            <span onClick={() => navigate('/privacy')}>Terms of Service</span>
                            <span onClick={() => navigate('/privacy')}>Privacy Policy</span>
                            <span onClick={() => navigate('/privacy')}>Refund Policy</span>
                        </div>
                        <div className="link-group">
                            <h4>Support</h4>
                            <span onClick={() => navigate('/support')}>Contact Us</span>
                            <span onClick={() => navigate('/support')}>FAQ</span>
                            <span onClick={() => navigate('/support')}>Status</span>
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
                .brand.amex { color: #0077b6; }
                .brand.discover { color: #f97316; }

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