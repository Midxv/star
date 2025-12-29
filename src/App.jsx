import { useState, useEffect } from "react";
import { Search, CreditCard, LogOut, Wallet } from 'lucide-react';
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, collection, onSnapshot, query } from "firebase/firestore";
import { auth, db } from "./firebaseConfig";
import Login from "./pages/Login";

function App() {
    const [user, setUser] = useState(null);
    const [balance, setBalance] = useState(0.00);
    const [orders, setOrders] = useState([]); // This stores your manual cards
    const [open, setOpen] = useState(false);
    const [view, setView] = useState('inventory'); // 'market' or 'inventory'

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);

            if (currentUser) {
                // 1. Listen to Balance
                const userRef = doc(db, "users", currentUser.uid);
                onSnapshot(userRef, (doc) => {
                    if (doc.exists()) setBalance(doc.data().balance);
                });

                // 2. Listen to Orders (Inventory)
                const ordersRef = collection(db, "users", currentUser.uid, "orders");
                const q = query(ordersRef);
                onSnapshot(q, (snapshot) => {
                    const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    setOrders(items);
                });
            }
        });
        return () => unsubscribe();
    }, []);

    const handleLogout = () => signOut(auth);

    if (!user) return <Login />;

    return (
        <>
            {/* Header */}
            <header className="header">
                <div className="hamburger" onClick={() => setOpen(!open)}>
                    <span></span><span></span><span></span>
                </div>

                <h1 className="logo">Star<span>Card</span></h1>

                <div className="search-bar">
                    <Search size={16} color="#666" />
                    <input type="text" placeholder="Search inventory..." />
                </div>

                <button className="wallet-btn">
                    <Wallet size={16} style={{marginRight:'8px'}}/>
                    <span>${balance?.toFixed(2)}</span>
                </button>
            </header>

            {/* Sidebar */}
            <aside className={`sidebar ${open ? "open" : ""}`}>
                <div className="user-info">
                    <div className="status-dot"></div>
                    <span>{user.email.split('@')[0]}</span>
                </div>
                <button className={`side-btn ${view === 'inventory' ? 'active' : ''}`} onClick={() => setView('inventory')}>My Inventory</button>
                <button className={`side-btn ${view === 'market' ? 'active' : ''}`} onClick={() => setView('market')}>Marketplace</button>
                <div className="divider"></div>
                <button className="side-btn logout" onClick={handleLogout}>
                    <LogOut size={16} style={{marginRight:'8px'}}/> Disconnect
                </button>
            </aside>

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
                                        {/* Visual Chip */}
                                        <div style={{width:'30px', height:'20px', background:'#ddd', borderRadius:'4px', opacity:'0.2'}}></div>
                                    </div>

                                    <div className="card-details-block">
                                        <label>Cardholder</label>
                                        <span className="info-text">{card.cardName || 'Unknown'}</span>
                                    </div>

                                    <div className="card-number">
                                        {/* Formats standard 16 digit to groups */}
                                        <span>{card.cardNumber?.slice(0,4) || '****'}</span>
                                        <span>{card.cardNumber?.slice(4,8) || '****'}</span>
                                        <span>{card.cardNumber?.slice(8,12) || '****'}</span>
                                        <span>{card.cardNumber?.slice(12,16) || '****'}</span>
                                    </div>

                                    <div className="card-bottom">
                                        <div>
                                            <small>EXPIRY</small>
                                            <span className="info-text">{card.expiry || 'MM/YY'}</span>
                                        </div>
                                        <div>
                                            <small>CVV</small>
                                            <span className="info-text text-red">{card.cvv || '***'}</span>
                                        </div>
                                    </div>

                                    <div className="card-address">
                                        <small>BILLING ADDRESS</small>
                                        <p>{card.address || 'No address provided'}</p>
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

            <style jsx>{`
        /* Extra styles for the specific card data view */
        .user-info { padding: 0 20px 20px; display: flex; align-items: center; gap: 10px; color: #fff; font-weight: 700; border-bottom: 1px solid #222; margin-bottom: 10px; }
        .status-dot { width: 8px; height: 8px; background: #00ff88; borderRadius: 50%; box-shadow: 0 0 10px #00ff88; }
        
        .card-details-block { margin-bottom: 15px; }
        .card-details-block label { font-size: 0.65rem; color: #666; font-weight: 700; display: block; margin-bottom: 4px; }
        
        .info-text { font-family: "JetBrains Mono", monospace; color: #fff; font-size: 0.9rem; }
        .text-red { color: #ff2a2a; }

        .card-address { margin-top: 15px; border-top: 1px solid #222; padding-top: 10px; }
        .card-address p { font-size: 0.8rem; color: #aaa; margin-top: 4px; line-height: 1.4; }

        .side-btn.active { color: #fff; background: #1a1a1a; border-left: 2px solid #ff2a2a; }
        .side-btn.logout:hover { color: #ff2a2a; }
      `}</style>
        </>
    );
}

export default App;