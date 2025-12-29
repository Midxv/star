import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, History, Wallet as WalletIcon, AlertTriangle, Check, ArrowRight } from 'lucide-react';
import { db, auth } from '../firebaseConfig';
import { doc, onSnapshot } from "firebase/firestore";
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

// --- CRYPTO SVGS ---
const BTCLogo = () => (<svg width="32" height="32" viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="16" fill="#F7931A"/><path d="M23.189 14.02c.314-2.096-1.283-3.223-3.465-3.975l.708-2.84-1.728-.43-.69 2.766c-.453-.113-.919-.22-1.385-.326l.695-2.783L15.596 6l-.708 2.839c-.376-.086-.746-.17-1.104-.255l.002-.006-2.384-.596-.46 1.846s1.283.294 1.256.312c.7.175.826.638.805 1.006l-.806 3.235c.048.012.11.024.18.047-.058-.014-.119-.029-.17-.042l-1.13 4.533c-.085.212-.3.53-.784.41l-1.257-.313-.892 2.057 2.248.56c.418.105.828.215 1.232.318l-.715 2.872 1.727.43.708-2.84c.472.127.93.245 1.378.357l-.701 2.813 1.728.43.716-2.873c2.948.558 5.164.333 6.097-2.333.752-2.146-.037-3.404-1.597-4.213 1.137-.263 1.992-1.013 2.222-2.563zm-3.985 5.602c-.541 2.172-4.205.998-5.392.703l.962-3.86c1.187.295 5.013 0.877 4.43 3.157zm.541-5.636c-.495 1.985-3.547 0.976-4.535.73l.872-3.5c.988.246 3.913.703 3.663 2.77z" fill="white"/></svg>);
const LTCLogo = () => (<svg width="32" height="32" viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="16" fill="#345D9D"/><path d="M23.813 18.496l-1.838.71-2.07 8.29H9.96l4.588-18.364-3.321-1.283 1.167-4.665 4.197 1.621 1.23 4.922 3.749 1.448-1.167 4.666-3.982-1.538-1.748 6.997h6.498l1.735-6.944 2.32.896-1.414 3.245z" fill="white"/></svg>);
const USDTLogo = () => (<svg width="32" height="32" viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="16" fill="#26A17B"/><path d="M18.657 17.757c0 1.302-.67 2.53-1.794 3.487-1.126.958-2.707 1.537-4.419 1.537-1.712 0-3.293-.58-4.42-1.537-1.125-.957-1.794-2.185-1.794-3.487h-.175V26h12.782v-8.243h-.18zm-6.213-3.935c1.062 0 2.06.344 2.87.93.81.587 1.324 1.386 1.324 2.26 0 .873-.514 1.672-1.324 2.26-.81.585-1.808.93-2.87.93-1.062 0-2.06-.345-2.87-.93-.81-.588-1.324-1.387-1.324-2.26 0-.874.514-1.673 1.324-2.26.81-.586 1.808-.93 2.87-.93zm6.398.93V10H26V6H6v4h7.157v4.752c1.125-.957 2.708-1.537 4.419-1.537 1.712 0 3.294.58 4.42 1.537V14.752z" fill="white"/></svg>);

const cryptoOptions = [
    { id: 'BTC', name: 'Bitcoin', icon: <BTCLogo />, color: '#f7931a' },
    { id: 'LTC', name: 'Litecoin', icon: <LTCLogo />, color: '#345d9d' },
    { id: 'USDT', name: 'Tether', icon: <USDTLogo />, color: '#26a17b' },
];

const Wallet = () => {
    const navigate = useNavigate();
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [balance, setBalance] = useState(0.00);

    // Form State
    const [amount, setAmount] = useState('');
    const [selectedCrypto, setSelectedCrypto] = useState(null);
    const [error, setError] = useState('');

    // 1. Fetch Real Balance
    useEffect(() => {
        if (auth.currentUser) {
            const unsub = onSnapshot(doc(db, "users", auth.currentUser.uid), (doc) => {
                if (doc.exists()) setBalance(doc.data().balance);
            });
            return () => unsub();
        }
    }, []);

    // 2. Handle Amount Logic
    const handleAmountChange = (e) => {
        setError('');
        setAmount(e.target.value);
    };

    // 3. Validation & Submit
    const handleDeposit = () => {
        const val = parseFloat(amount);

        if (isNaN(val)) return setError("Please enter a valid amount.");
        if (val < 10) return setError("Minimum deposit is $10.00");
        if (val > 200) return setError("Maximum deposit is $200.00");
        if (!selectedCrypto) return setError("Please select a crypto network.");

        // Redirect to the existing PaymentProcessPage
        navigate('/payment-process', {
            state: {
                cryptoStr: selectedCrypto.id,
                amount: val.toFixed(2)
            }
        });
    };

    return (
        <div className="page-container animate-fade-in">
            <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />
            <Header onOpenSidebar={() => setSidebarOpen(true)} />

            <div className="wallet-content">

                {/* TOP: Balance Card */}
                <div className="balance-section">
                    <div className="balance-display">
                        <span className="label">Total Balance</span>
                        <h1>${balance?.toFixed(2)}</h1>
                    </div>
                    <div className="balance-icon">
                        <WalletIcon size={48} color="#FF3B30" />
                    </div>
                </div>

                <div className="deposit-container">
                    <div className="deposit-header">
                        <h2>Add Funds</h2>
                        <p>Securely top up your wallet via Crypto.</p>
                    </div>

                    {/* 1. AMOUNT INPUT */}
                    <div className="input-block">
                        <label>Amount (USD)</label>
                        <div className="currency-input">
                            <span className="symbol">$</span>
                            <input
                                type="number"
                                placeholder="0.00"
                                value={amount}
                                onChange={handleAmountChange}
                                className={error ? 'error-border' : ''}
                            />
                        </div>

                        <div className="limits-row">
                            <span className={parseFloat(amount) < 10 && amount ? 'text-red' : ''}>Min: $10</span>
                            <span className={parseFloat(amount) > 200 ? 'text-red' : ''}>Max: $200</span>
                        </div>
                    </div>

                    {/* 2. CRYPTO SELECTOR */}
                    <div className="input-block">
                        <label>Select Network</label>
                        <div className="crypto-grid">
                            {cryptoOptions.map((coin) => (
                                <div
                                    key={coin.id}
                                    className={`crypto-card ${selectedCrypto?.id === coin.id ? 'active' : ''}`}
                                    onClick={() => { setError(''); setSelectedCrypto(coin); }}
                                >
                                    <div className="coin-icon">{coin.icon}</div>
                                    <div className="coin-name">{coin.name}</div>
                                    {selectedCrypto?.id === coin.id && <div className="check"><Check size={14}/></div>}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ERROR MESSAGE */}
                    {error && (
                        <div className="error-box">
                            <AlertTriangle size={18} /> {error}
                        </div>
                    )}

                    {/* 3. ACTION BUTTON */}
                    <button className="btn-deposit" onClick={handleDeposit}>
                        Proceed to Payment <ArrowRight size={18} />
                    </button>

                </div>

                {/* RECENT TRANSACTIONS (Placeholder) */}
                <div className="transactions-section">
                    <h3><History size={18} /> Recent Deposits</h3>
                    <div className="empty-tx">No recent transactions found.</div>
                </div>

            </div>

            <style jsx>{`
        .page-container { min-height: 100vh; padding: 0 20px 40px; background: #050505; color: white; }
        .wallet-content { max-width: 600px; margin: 0 auto; }

        /* BALANCE CARD */
        .balance-section {
          background: linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%);
          border: 1px solid #333;
          border-radius: 20px;
          padding: 30px;
          display: flex; justify-content: space-between; align-items: center;
          margin-bottom: 30px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        }
        .balance-display .label { color: #888; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; }
        .balance-display h1 { font-size: 42px; margin: 5px 0 0; font-family: 'JetBrains Mono', monospace; }
        .balance-icon { opacity: 0.8; }

        /* DEPOSIT CONTAINER */
        .deposit-container {
          background: #0f0f0f;
          border: 1px solid #222;
          border-radius: 24px;
          padding: 30px;
          margin-bottom: 30px;
        }
        .deposit-header { margin-bottom: 30px; text-align: center; }
        .deposit-header h2 { font-size: 24px; margin-bottom: 5px; }
        .deposit-header p { color: #666; font-size: 14px; }

        /* INPUTS */
        .input-block { margin-bottom: 25px; }
        .input-block label { display: block; color: #888; font-size: 12px; font-weight: 700; margin-bottom: 10px; text-transform: uppercase; }
        
        .currency-input {
          position: relative;
          background: #050505;
          border: 1px solid #333;
          border-radius: 12px;
          display: flex; align-items: center;
          transition: 0.3s;
        }
        .currency-input:focus-within { border-color: #FF3B30; box-shadow: 0 0 15px rgba(255, 59, 48, 0.2); }
        .symbol { padding-left: 20px; font-size: 24px; color: #666; font-family: 'JetBrains Mono', monospace; }
        .currency-input input {
          width: 100%; background: transparent; border: none; outline: none;
          color: white; font-size: 32px; font-weight: 700; padding: 15px;
          font-family: 'JetBrains Mono', monospace;
        }
        .error-border { border-color: #FF3B30 !important; }

        .limits-row { display: flex; justify-content: space-between; margin-top: 8px; font-size: 12px; color: #666; }
        .text-red { color: #FF3B30; }

        /* CRYPTO GRID */
        .crypto-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; }
        .crypto-card {
          background: #1a1a1a; border: 2px solid transparent; border-radius: 12px;
          padding: 15px; text-align: center; cursor: pointer; position: relative;
          transition: 0.2s;
        }
        .crypto-card:hover { border-color: #444; transform: translateY(-2px); }
        .crypto-card.active { border-color: #FF3B30; background: #2a0f0f; }
        
        .coin-icon { margin-bottom: 8px; }
        .coin-name { font-size: 13px; font-weight: 600; color: #ccc; }
        .check { position: absolute; top: 5px; right: 5px; background: #FF3B30; color: white; border-radius: 50%; width: 16px; height: 16px; display: flex; align-items: center; justify-content: center; }

        /* BUTTONS & ALERTS */
        .error-box { 
          background: rgba(255, 59, 48, 0.1); color: #FF3B30; padding: 12px; 
          border-radius: 8px; font-size: 13px; display: flex; align-items: center; gap: 8px;
          margin-bottom: 20px; border: 1px solid rgba(255, 59, 48, 0.3);
        }

        .btn-deposit {
          width: 100%; padding: 16px; background: #FF3B30; color: white;
          border: none; border-radius: 12px; font-weight: 700; font-size: 16px;
          cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px;
          transition: 0.3s;
        }
        .btn-deposit:hover { background: #d32f2f; transform: translateY(-2px); box-shadow: 0 10px 20px rgba(255, 59, 48, 0.3); }

        /* TRANSACTIONS */
        .transactions-section h3 { font-size: 16px; color: #888; display: flex; align-items: center; gap: 8px; margin-bottom: 15px; }
        .empty-tx { text-align: center; color: #444; padding: 20px; border: 1px dashed #333; border-radius: 12px; font-size: 14px; }

        .animate-fade-in { animation: fadeIn 0.5s ease-out; }
        @keyframes fadeIn { from { opacity:0; transform: translateY(10px); } to { opacity:1; transform: translateY(0); }}
      `}</style>
        </div>
    );
};

export default Wallet;