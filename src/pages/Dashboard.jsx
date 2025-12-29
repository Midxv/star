import { useState, useEffect } from "react";
import { Search, LogOut, Wallet } from 'lucide-react'; // Removed CreditCard import if unused
import { signOut } from "firebase/auth";
import { doc, collection, onSnapshot, query } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";
import { useNavigate } from 'react-router-dom'; // <--- 1. Import Hook

function Dashboard({ user }) { // <--- 2. Receive user as prop (handled by App router now)
    const [balance, setBalance] = useState(0.00);
    const [orders, setOrders] = useState([]);
    const [open, setOpen] = useState(false);
    const [view, setView] = useState('inventory');

    const navigate = useNavigate(); // <--- 3. Initialize Hook

    useEffect(() => {
        if (user) {
            // Balance Listener
            const userRef = doc(db, "users", user.uid);
            const unsubBalance = onSnapshot(userRef, (doc) => {
                if (doc.exists()) setBalance(doc.data().balance);
            });

            // Inventory Listener
            const ordersRef = collection(db, "users", user.uid, "orders");
            const q = query(ordersRef);
            const unsubOrders = onSnapshot(q, (snapshot) => {
                const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setOrders(items);
            });

            return () => {
                unsubBalance();
                unsubOrders();
            };
        }
    }, [user]);

    const handleLogout = () => signOut(auth);

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

                {/* --- 4. THE CONNECTION IS HERE --- */}
                <button
                    className="wallet-btn"
                    onClick={() => navigate('/wallet')}
                >
                    <Wallet size={16} style={{marginRight:'8px'}}/>
                    <span>${balance?.toFixed(2)}</span>
                </button>
            </header>

            {/* Sidebar */}
            <aside className={`sidebar ${open ? "open" : ""}`}>
                <div className="user-info">
                    <div className="status-dot"></div>
                    <span>{user?.email?.split('@')[0]}</span>
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