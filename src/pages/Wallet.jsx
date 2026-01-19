import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wallet as WalletIcon, ArrowRight, Check, AlertTriangle, X, Clock, CheckCircle, XCircle } from 'lucide-react';
import { db, auth } from '../firebaseConfig';
import { doc, onSnapshot, getDoc, setDoc, collection, addDoc, query, orderBy } from "firebase/firestore";
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

// --- CRYPTO SVGS (Only BTC, LTC, ETH) ---
const BTCLogo = () => (<svg width="32" height="32" viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="16" fill="#F7931A"/><path d="M23.189 14.02c.314-2.096-1.283-3.223-3.465-3.975l.708-2.84-1.728-.43-.69 2.766c-.453-.113-.919-.22-1.385-.326l.695-2.783L15.596 6l-.708 2.839c-.376-.086-.746-.17-1.104-.255l.002-.006-2.384-.596-.46 1.846s1.283.294 1.256.312c.7.175.826.638.805 1.006l-.806 3.235c.048.012.11.024.18.047-.058-.014-.119-.029-.17-.042l-1.13 4.533c-.085.212-.3.53-.784.41l-1.257-.313-.892 2.057 2.248.56c.418.105.828.215 1.232.318l-.715 2.872 1.727.43.708-2.84c.472.127.93.245 1.378.357l-.701 2.813 1.728.43.716-2.873c2.948.558 5.164.333 6.097-2.333.752-2.146-.037-3.404-1.597-4.213 1.137-.263 1.992-1.013 2.222-2.563zm-3.985 5.602c-.541 2.172-4.205.998-5.392.703l.962-3.86c1.187.295 5.013 0.877 4.43 3.157zm.541-5.636c-.495 1.985-3.547 0.976-4.535.73l.872-3.5c.988.246 3.913.703 3.663 2.77z" fill="white"/></svg>);
const LTCLogo = () => (<svg width="32" height="32" viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="16" fill="#345D9D"/><path d="M23.813 18.496l-1.838.71-2.07 8.29H9.96l4.588-18.364-3.321-1.283 1.167-4.665 4.197 1.621 1.23 4.922 3.749 1.448-1.167 4.666-3.982-1.538-1.748 6.997h6.498l1.735-6.944 2.32.896-1.414 3.245z" fill="white"/></svg>);
const ETHLogo = () => (<svg width="32" height="32" viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="16" fill="#627EEA"/><path d="M16.498 4v8.87l8.127 3.665L16.498 4z" fill="white" fillOpacity=".602"/><path d="M16.498 4L8.372 16.535l8.126-3.665V4z" fill="white"/><path d="M16.498 20.956l8.127-4.713-8.127 3.665v1.048z" fill="white" fillOpacity=".602"/><path d="M16.498 28V20.956l-8.126-4.713L16.498 28z" fill="white"/><path d="M16.498 19.907l8.127-4.713-8.127-3.665v8.378z" fill="white" fillOpacity=".2"/><path d="M8.372 15.194l8.126 4.713V11.53l-8.126 3.664z" fill="white" fillOpacity=".602"/></svg>);

const cryptoOptions = [
    { id: 'BTC', name: 'Bitcoin', icon: <BTCLogo />, color: '#f7931a' },
    { id: 'LTC', name: 'Litecoin', icon: <LTCLogo />, color: '#345d9d' },
    { id: 'ETH', name: 'Ethereum', icon: <ETHLogo />, color: '#627eea' },
];

const Wallet = () => {
    const navigate = useNavigate();
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [balance, setBalance] = useState(0.00);
    const [transactions, setTransactions] = useState([]); // Transaction History State

    const [amount, setAmount] = useState('');
    const [selectedCrypto, setSelectedCrypto] = useState(null);
    const [showErrorToast, setShowErrorToast] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        const initData = async () => {
            if (auth.currentUser) {
                // 1. Ensure Wallet Exists
                const userRef = doc(db, "users", auth.currentUser.uid);
                const snap = await getDoc(userRef);
                if (!snap.exists()) {
                    await setDoc(userRef, {
                        email: auth.currentUser.email,
                        balance: 0.00,
                        createdAt: new Date()
                    });
                }

                // 2. Listen for Balance
                const unsubBalance = onSnapshot(userRef, (doc) => {
                    if (doc.exists()) setBalance(doc.data().balance);
                });

                // 3. Listen for Transactions (Ordered by Date)
                const txRef = collection(db, "users", auth.currentUser.uid, "transactions");
                const q = query(txRef, orderBy("date", "desc"));
                const unsubTx = onSnapshot(q, (snapshot) => {
                    const txList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    setTransactions(txList);
                });

                return () => { unsubBalance(); unsubTx(); };
            }
        };
        initData();
    }, []);

    const handleAmountChange = (e) => setAmount(e.target.value);

    const handleDeposit = async () => {
        if (isProcessing) return;

        const val = parseFloat(amount);

        // --- Validation ---
        if (isNaN(val) || val < 20) {
            setErrorMsg("Minimum deposit amount is €20.00");
            setShowErrorToast(true);
            setTimeout(() => setShowErrorToast(false), 4000);
            return;
        }

        if (!selectedCrypto) {
            setErrorMsg("Please select a network.");
            setShowErrorToast(true);
            setTimeout(() => setShowErrorToast(false), 3000);
            return;
        }

        setIsProcessing(true);

        try {
            // --- SAVE REQUEST TO FIREBASE ---
            // This creates the "Processing" record in the database
            await addDoc(collection(db, "users", auth.currentUser.uid, "transactions"), {
                amount: val.toFixed(2),
                currency: selectedCrypto.id,
                status: 'Processing', // Can be manually changed to 'Success' or 'Declined' in Console
                method: 'Crypto Deposit',
                date: new Date().toISOString()
            });

            // Redirect to Payment Screen
            navigate('/payment-process', {
                state: { cryptoStr: selectedCrypto.id, amount: val.toFixed(2) }
            });

        } catch (e) {
            console.error("Deposit Error:", e);
            setErrorMsg("Connection failed. Try again.");
            setShowErrorToast(true);
        }

        setIsProcessing(false);
    };

    // Helper to format date
    const formatDate = (isoString) => {
        const date = new Date(isoString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit' });
    };

    // Helper for Status Badge
    const getStatusBadge = (status) => {
        const s = status.toLowerCase();
        if (s === 'success') return <span className="badge success"><CheckCircle size={12}/> Success</span>;
        if (s === 'declined') return <span className="badge declined"><XCircle size={12}/> Declined</span>;
        return <span className="badge processing"><Clock size={12}/> Processing</span>;
    };

    return (
        <div className="page-container animate-fade-in">
            <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />
            <Header onOpenSidebar={() => setSidebarOpen(true)} />

            {/* ERROR TOAST */}
            {showErrorToast && (
                <div className="error-toast-fixed">
                    <AlertTriangle size={20} />
                    <span>{errorMsg}</span>
                    <button onClick={() => setShowErrorToast(false)}><X size={16} /></button>
                </div>
            )}

            <div className="wallet-content">

                {/* TOP: Balance Card */}
                <div className="balance-section">
                    <div className="balance-display">
                        <span className="label">Total Balance</span>
                        <h1>€{balance ? balance.toFixed(2) : '0.00'}</h1>
                    </div>
                    <div className="balance-icon">
                        <WalletIcon size={48} color="#FF3B30" />
                    </div>
                </div>

                {/* DEPOSIT FORM */}
                <div className="deposit-container">
                    <div className="deposit-header">
                        <h2>Add Funds</h2>
                        <p>Securely top up your wallet via Crypto.</p>
                    </div>

                    <div className="input-block">
                        <label>Amount (USD)</label>
                        <div className="currency-input">
                            <span className="symbol">€</span>
                            <input
                                type="number"
                                placeholder="0.00"
                                value={amount}
                                onChange={handleAmountChange}
                            />
                        </div>
                    </div>

                    <div className="input-block">
                        <label>Select Network</label>
                        <div className="crypto-grid">
                            {cryptoOptions.map((coin) => (
                                <div
                                    key={coin.id}
                                    className={`crypto-card ${selectedCrypto?.id === coin.id ? 'active' : ''}`}
                                    onClick={() => setSelectedCrypto(coin)}
                                >
                                    <div className="coin-icon">{coin.icon}</div>
                                    <div className="coin-name">{coin.name}</div>
                                    {selectedCrypto?.id === coin.id && <div className="check"><Check size={14}/></div>}
                                </div>
                            ))}
                        </div>
                    </div>

                    <button className="btn-deposit" onClick={handleDeposit} disabled={isProcessing}>
                        {isProcessing ? 'Processing...' : <>Proceed to Payment <ArrowRight size={18} /></>}
                    </button>
                </div>

                {/* TRANSACTION HISTORY */}
                <div className="transactions-section">
                    <h3>Recent Transactions</h3>

                    {transactions.length === 0 ? (
                        <div className="empty-tx">No recent transactions found.</div>
                    ) : (
                        <div className="tx-list">
                            {transactions.map((tx) => (
                                <div className="tx-item" key={tx.id}>
                                    <div className="tx-left">
                                        <div className={`tx-icon ${tx.status.toLowerCase()}`}>
                                            {tx.currency === 'BTC' ? <BTCLogo/> : tx.currency === 'ETH' ? <ETHLogo/> : <LTCLogo/>}
                                        </div>
                                        <div className="tx-info">
                                            <span className="tx-method">{tx.method || 'Deposit'}</span>
                                            <span className="tx-date">{formatDate(tx.date)}</span>
                                        </div>
                                    </div>
                                    <div className="tx-right">
                                        <span className="tx-amount">+€{tx.amount}</span>
                                        {getStatusBadge(tx.status)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>

            <style jsx>{`
                .page-container { min-height: 100vh; padding: 0 0 40px; background: #050505; color: white; }
                .wallet-content { max-width: 600px; margin: 40px auto; padding: 0 20px; }

                .balance-section {
                    background: linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%);
                    border: 1px solid #333; border-radius: 20px; padding: 30px;
                    display: flex; justify-content: space-between; align-items: center;
                    margin-bottom: 30px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);
                }
                .balance-display .label { color: #888; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; }
                .balance-display h1 { font-size: 42px; margin: 5px 0 0; font-family: 'JetBrains Mono', monospace; }
                .balance-icon { opacity: 0.8; }

                .deposit-container { background: #0f0f0f; border: 1px solid #222; border-radius: 24px; padding: 30px; margin-bottom: 30px; }
                .deposit-header { margin-bottom: 30px; text-align: center; }
                .deposit-header h2 { font-size: 24px; margin-bottom: 5px; }
                .deposit-header p { color: #666; font-size: 14px; }

                .input-block { margin-bottom: 25px; }
                .input-block label { display: block; color: #888; font-size: 12px; font-weight: 700; margin-bottom: 10px; text-transform: uppercase; }

                .currency-input {
                    position: relative; background: #050505; border: 1px solid #333; border-radius: 12px;
                    display: flex; align-items: center; transition: 0.3s;
                }
                .currency-input:focus-within { border-color: #FF3B30; box-shadow: 0 0 15px rgba(255, 59, 48, 0.2); }
                .symbol { padding-left: 20px; font-size: 24px; color: #666; font-family: 'JetBrains Mono', monospace; }
                .currency-input input {
                    width: 100%; background: transparent; border: none; outline: none;
                    color: white; font-size: 32px; font-weight: 700; padding: 15px;
                    font-family: 'JetBrains Mono', monospace;
                }

                .crypto-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; }
                .crypto-card {
                    background: #1a1a1a; border: 2px solid transparent; border-radius: 12px;
                    padding: 15px; text-align: center; cursor: pointer; position: relative; transition: 0.2s;
                }
                .crypto-card:hover { border-color: #444; transform: translateY(-2px); }
                .crypto-card.active { border-color: #FF3B30; background: #2a0f0f; }

                .coin-icon { margin-bottom: 8px; }
                .coin-name { font-size: 13px; font-weight: 600; color: #ccc; }
                .check { position: absolute; top: 5px; right: 5px; background: #FF3B30; color: white; border-radius: 50%; width: 16px; height: 16px; display: flex; align-items: center; justify-content: center; }

                .btn-deposit {
                    width: 100%; padding: 16px; background: #FF3B30; color: white;
                    border: none; border-radius: 12px; font-weight: 700; font-size: 16px;
                    cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px; transition: 0.3s;
                }
                .btn-deposit:hover { background: #d32f2f; transform: translateY(-2px); box-shadow: 0 10px 20px rgba(255, 59, 48, 0.3); }
                .btn-deposit:disabled { opacity: 0.5; cursor: not-allowed; }

                .error-toast-fixed { position: fixed; top: 20px; left: 50%; transform: translateX(-50%); background: #fee2e2; color: #ef4444; padding: 12px 20px; border-radius: 50px; display: flex; align-items: center; gap: 10px; font-weight: 600; font-size: 14px; z-index: 2000; box-shadow: 0 10px 30px rgba(0,0,0,0.3); animation: slideDown 0.3s ease-out; }
                .error-toast-fixed button { background: none; border: none; cursor: pointer; color: #ef4444; display: flex; }
                @keyframes slideDown { from { transform: translate(-50%, -20px); opacity: 0; } to { transform: translate(-50%, 0); opacity: 1; } }

                /* TRANSACTION TABLE STYLES */
                .transactions-section h3 { font-size: 18px; color: #fff; margin-bottom: 20px; border-bottom: 1px solid #222; padding-bottom: 10px; }
                .empty-tx { text-align: center; color: #444; padding: 30px; border: 1px dashed #333; border-radius: 12px; font-size: 14px; }

                .tx-list { display: flex; flex-direction: column; gap: 10px; }
                .tx-item { display: flex; justify-content: space-between; align-items: center; background: #111; padding: 15px; border-radius: 12px; border: 1px solid #222; }
                .tx-left { display: flex; align-items: center; gap: 15px; }
                .tx-icon svg { width: 32px; height: 32px; }
                .tx-info { display: flex; flex-direction: column; }
                .tx-method { font-weight: 700; font-size: 14px; color: #fff; }
                .tx-date { font-size: 12px; color: #666; margin-top: 2px; }

                .tx-right { text-align: right; display: flex; flex-direction: column; align-items: flex-end; gap: 5px; }
                .tx-amount { font-family: 'JetBrains Mono'; font-weight: 700; color: #fff; }

                .badge { display: flex; align-items: center; gap: 4px; font-size: 10px; padding: 2px 8px; border-radius: 4px; font-weight: 700; text-transform: uppercase; }
                .badge.processing { background: rgba(255, 165, 0, 0.1); color: orange; }
                .badge.success { background: rgba(0, 255, 136, 0.1); color: #00ff88; }
                .badge.declined { background: rgba(255, 59, 48, 0.1); color: #FF3B30; }

                .animate-fade-in { animation: fadeIn 0.5s ease-out; }
                @keyframes fadeIn { from { opacity:0; transform: translateY(10px); } to { opacity:1; transform: translateY(0); }}
            `}</style>
        </div>
    );
};

export default Wallet;