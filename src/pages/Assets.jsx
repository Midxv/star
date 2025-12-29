import React, { useState, useEffect } from "react";
import { collection, onSnapshot, query, doc } from "firebase/firestore";
import { db, auth } from "../firebaseConfig";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

const Assets = () => {
    const [balance, setBalance] = useState(0.00);
    const [orders, setOrders] = useState([]);
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const user = auth.currentUser;

    useEffect(() => {
        if (user) {
            // Fetch Balance for Header
            const unsubBalance = onSnapshot(doc(db, "users", user.uid), (doc) => {
                if (doc.exists()) setBalance(doc.data().balance);
            });
            // Fetch Purchased Orders
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

            <main className="assets-container">
                <h1 className="page-title">My Inventory</h1>

                <div className="grid-layout">
                    {orders.length === 0 ? (
                        <div className="empty-state">
                            <h3>No assets found</h3>
                            <p>Purchased items will appear here securely.</p>
                        </div>
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
            </main>

            <style jsx>{`
                .assets-container { max-width: 1200px; margin: 40px auto; padding: 0 20px; }
                .page-title { color: white; margin-bottom: 30px; border-bottom: 1px solid #333; padding-bottom: 15px; }

                .grid-layout { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; }
                
                .cc-card { 
                    background: linear-gradient(145deg, #1a1a1a, #0a0a0a); 
                    border: 1px solid #333; padding: 25px; border-radius: 16px; color: white; 
                    transition: 0.2s; position: relative; overflow: hidden;
                }
                .cc-card:hover { border-color: #ff2a2a; transform: translateY(-5px); }

                .tag { font-size: 10px; background: rgba(255,255,255,0.1); padding: 4px 8px; border-radius: 4px; letter-spacing: 1px; }
                .chip { width: 40px; height: 30px; background: linear-gradient(135deg, #d4af37 0%, #aa8c2c 100%); border-radius: 6px; margin-top: 15px; }
                
                .card-number { font-family: 'JetBrains Mono'; font-size: 22px; margin: 25px 0; letter-spacing: 3px; text-shadow: 0 2px 4px rgba(0,0,0,0.5); }
                .card-bottom { display: flex; justify-content: space-between; font-size: 12px; color: #888; font-family: 'JetBrains Mono'; }

                .empty-state { grid-column: 1 / -1; text-align: center; padding: 60px; border: 1px dashed #333; border-radius: 12px; color: #666; }
                .empty-state h3 { color: #fff; margin-bottom: 10px; }
            `}</style>
        </>
    );
};

export default Assets;