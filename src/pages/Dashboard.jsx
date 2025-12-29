import React, { useState, useEffect } from "react";
import { collection, onSnapshot, query, doc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useNavigate } from 'react-router-dom';
import Sidebar from "../components/Sidebar";
import Header from "../components/Header"; // <--- Import the new Header

const Dashboard = ({ user }) => {
    const [balance, setBalance] = useState(0.00);
    const [orders, setOrders] = useState([]);
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

            {/* NEW HEADER IMPLEMENTATION */}
            <Header
                onOpenSidebar={() => setSidebarOpen(true)}
                balance={balance} // Pass balance to header if you want it there
            />

            <main className="market">

                {/* Optional: Add a "Add Funds" button prominently since search is gone */}
                <div style={{gridColumn: '1/-1', display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px'}}>
                    <h2 style={{margin:0}}>My Secure Cards</h2>
                    <button
                        onClick={() => navigate('/wallet')}
                        style={{
                            background:'#ff2a2a', color:'white', border:'none',
                            padding:'10px 20px', borderRadius:'4px', fontWeight:'bold', cursor:'pointer'
                        }}
                    >
                        + Add Funds
                    </button>
                </div>

                {view === 'inventory' && (
                    <>
                        {orders.length === 0 ? (
                            <div style={{gridColumn: '1/-1', textAlign:'center', color:'#666', padding:'50px'}}>
                                No cards in inventory.
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