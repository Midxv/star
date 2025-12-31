import React, { useState, useEffect } from "react";
import { collection, onSnapshot, query, orderBy, doc } from "firebase/firestore";
import { db, auth } from "../firebaseConfig";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { Shield, Globe, CreditCard, Hash, Activity, PackageOpen } from 'lucide-react';

const Assets = () => {
    const [balance, setBalance] = useState(0.00);
    const [orders, setOrders] = useState([]);
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const user = auth.currentUser;

    useEffect(() => {
        if (user) {
            // 1. Fetch Real-time Balance
            const unsubBalance = onSnapshot(doc(db, "users", user.uid), (doc) => {
                if (doc.exists()) setBalance(doc.data().balance);
            });

            // 2. Fetch Orders (Assets) - Ordered by newest first
            // Note: If 'date' field exists in your Cart.jsx logic, we sort by it.
            // If not, it defaults to natural order.
            const q = query(collection(db, "users", user.uid, "orders"));

            const unsubOrders = onSnapshot(q, (snapshot) => {
                const fetchedOrders = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                // Sort client-side if needed, or use orderBy in query if indexes exist
                setOrders(fetchedOrders);
            });

            return () => { unsubBalance(); unsubOrders(); };
        }
    }, [user]);

    return (
        <div className="page-wrapper">
            <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />
            <Header onOpenSidebar={() => setSidebarOpen(!isSidebarOpen)} />

            <main className="assets-container">
                <h1 className="page-title">My Inventory</h1>

                {orders.length === 0 ? (
                    // --- EMPTY STATE ---
                    <div className="empty-state">
                        <div className="icon-circle">
                            <PackageOpen size={48} color="#444" />
                        </div>
                        <h3>No Assets Found</h3>
                        <p>Purchased cards will appear here automatically.</p>
                    </div>
                ) : (
                    // --- ASSETS TABLE ---
                    <div className="table-pill-container">
                        <table className="data-table">
                            <thead>
                            <tr>
                                <th><CreditCard size={14}/> Brand</th>
                                <th><Shield size={14}/> Type</th>
                                <th><Globe size={14}/> Country</th>
                                <th><Hash size={14}/> BIN</th>
                                <th><Activity size={14}/> Status</th>
                            </tr>
                            </thead>
                            <tbody>
                            {orders.map((item) => (
                                <tr key={item.id} className="row-pill">
                                    <td className={`brand ${item.brand?.toLowerCase()}`}>
                                        {item.brand || 'UNKNOWN'}
                                    </td>
                                    <td>
                                        <span className="type-pill">{item.type || 'N/A'}</span>
                                    </td>
                                    <td className="country-text">{item.country || 'Global'}</td>
                                    <td className="mono">{item.bin || '------'}</td>
                                    <td>
                                        <div className="status-badge processing">
                                            <span className="dot"></span>
                                            Processing
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>

            <style jsx>{`
                .page-wrapper { background: #050505; min-height: 100vh; color: white; }
                .assets-container { max-width: 1200px; margin: 40px auto; padding: 0 20px; }
                
                .page-title { 
                    color: white; margin-bottom: 30px; font-size: 32px; 
                    font-weight: 800; letter-spacing: -1px;
                }

                /* --- TABLE STYLES --- */
                .table-pill-container {
                    background: #111;
                    border-radius: 24px;
                    border: 1px solid #222;
                    padding: 20px;
                    overflow-x: auto;
                    box-shadow: 0 20px 50px rgba(0,0,0,0.3);
                }

                .data-table { width: 100%; border-collapse: separate; border-spacing: 0 8px; color: #ddd; min-width: 700px; }

                .data-table th {
                    text-align: left; padding: 15px 25px; color: #666;
                    font-size: 12px; text-transform: uppercase; letter-spacing: 1px; font-weight: 700;
                }
                .data-table th svg { vertical-align: text-bottom; margin-right: 5px; opacity: 0.7; }

                /* ROW STYLING */
                .row-pill td {
                    padding: 20px 25px;
                    background: #0a0a0a;
                    border-top: 1px solid #1a1a1a;
                    border-bottom: 1px solid #1a1a1a;
                    transition: 0.2s;
                    vertical-align: middle;
                }

                .row-pill td:first-child { border-top-left-radius: 16px; border-bottom-left-radius: 16px; border-left: 1px solid #1a1a1a; }
                .row-pill td:last-child { border-top-right-radius: 16px; border-bottom-right-radius: 16px; border-right: 1px solid #1a1a1a; }

                .row-pill:hover td { background: #151515; border-color: #333; }

                /* CELL CONTENT */
                .brand { font-weight: 800; font-size: 15px; letter-spacing: 0.5px; }
                .brand.visa { color: #4361ee; }
                .brand.mastercard { color: #ef233c; }
                .brand.amex { color: #0077b6; }

                .type-pill {
                    font-size: 10px; background: #222; color: #aaa;
                    padding: 6px 12px; border-radius: 20px; letter-spacing: 0.5px; text-transform: uppercase; font-weight: 700;
                }

                .country-text { font-size: 14px; font-weight: 500; color: #ccc; }
                .mono { font-family: 'JetBrains Mono', monospace; color: #888; font-size: 14px; letter-spacing: 1px; }

                /* STATUS BADGE */
                .status-badge {
                    display: inline-flex; align-items: center; gap: 8px;
                    padding: 6px 12px; border-radius: 50px;
                    font-size: 11px; font-weight: 700; text-transform: uppercase;
                }
                .status-badge.processing {
                    background: rgba(245, 158, 11, 0.1); color: #f59e0b; border: 1px solid rgba(245, 158, 11, 0.2);
                }
                .dot {
                    width: 6px; height: 6px; border-radius: 50%; background: #f59e0b;
                    animation: pulse 1.5s infinite;
                }

                @keyframes pulse {
                    0% { opacity: 1; } 50% { opacity: 0.4; } 100% { opacity: 1; }
                }

                /* EMPTY STATE */
                .empty-state {
                    display: flex; flex-direction: column; align-items: center; justify-content: center;
                    padding: 80px 0; background: #111; border-radius: 24px; border: 1px dashed #333;
                }
                .icon-circle {
                    width: 80px; height: 80px; background: #1a1a1a; border-radius: 50%;
                    display: flex; align-items: center; justify-content: center; margin-bottom: 20px;
                }
                .empty-state h3 { color: #fff; margin-bottom: 5px; font-size: 20px; }
                .empty-state p { color: #666; font-size: 14px; }
            `}</style>
        </div>
    );
};

export default Assets;