// src/pages/Processing.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Copy, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

// Mock Wallet Addresses
const WALLETS = {
    BTC: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
    LTC: "ltc1q5ggl234abc56def78ghi90jklmn12opq34rst",
    USDT: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F"
};

const Processing = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Retrieve data passed from Wallet.jsx
    const { cryptoStr, amount } = location.state || { cryptoStr: 'BTC', amount: '0.00' };

    const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
    const [copied, setCopied] = useState(false);

    // Countdown Logic
    useEffect(() => {
        if (timeLeft === 0) return;
        const intervalId = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);
        return () => clearInterval(intervalId);
    }, [timeLeft]);

    // Format Time (MM:SS)
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(WALLETS[cryptoStr] || WALLETS.BTC);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="page-container">
            <Sidebar />
            <Header onOpenSidebar={() => {}} />

            <div className="process-content">
                <div className="status-badge">
                    <div className="pulsing-dot"></div> AWAITING PAYMENT
                </div>

                <h1 className="amount-display">
                    Send <span className="highlight">${amount}</span>
                </h1>
                <p className="subtitle">via {cryptoStr} Network</p>

                {/* TIMER */}
                <div className={`timer-box ${timeLeft < 60 ? 'urgent' : ''}`}>
                    <Clock size={20} />
                    <span>{formatTime(timeLeft)}</span>
                </div>

                {/* ADDRESS BOX */}
                <div className="address-card">
                    <label>Wallet Address ({cryptoStr})</label>
                    <div className="address-row">
                        <code className="wallet-text">
                            {WALLETS[cryptoStr] || WALLETS.BTC}
                        </code>
                        <button className="copy-btn" onClick={handleCopy}>
                            {copied ? <CheckCircle size={18} color="#00ff88" /> : <Copy size={18} />}
                        </button>
                    </div>
                    <div className="qr-placeholder">
                        [ QR CODE SCANNER AREA ]
                    </div>
                </div>

                <div className="info-box">
                    <AlertTriangle size={16} color="#e5a50a" />
                    <p>Send the exact amount. Transaction will be automatically detected after 1 confirmation.</p>
                </div>

                <button className="cancel-btn" onClick={() => navigate('/wallet')}>
                    Cancel Transaction
                </button>
            </div>

            <style jsx>{`
                .page-container { min-height: 100vh; background: #050505; color: white; padding-bottom: 40px; }
                .process-content { max-width: 500px; margin: 40px auto; text-align: center; padding: 0 20px; }

                .status-badge {
                    display: inline-flex; align-items: center; gap: 8px;
                    background: rgba(255, 165, 0, 0.1); color: orange;
                    padding: 6px 16px; border-radius: 20px; font-size: 12px; font-weight: 700; letter-spacing: 1px;
                    margin-bottom: 20px; border: 1px solid rgba(255, 165, 0, 0.2);
                }
                .pulsing-dot { width: 8px; height: 8px; background: orange; border-radius: 50%; animation: pulse 1.5s infinite; }
                @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.4; } 100% { opacity: 1; } }

                .amount-display { font-size: 32px; font-weight: 800; margin-bottom: 5px; }
                .highlight { color: #ff2a2a; }
                .subtitle { color: #888; margin-bottom: 30px; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; }

                .timer-box {
                    background: #111; border: 1px solid #222; width: fit-content; margin: 0 auto 30px;
                    padding: 10px 25px; border-radius: 8px; font-family: 'JetBrains Mono', monospace;
                    font-size: 24px; display: flex; align-items: center; gap: 10px; color: #fff;
                }
                .timer-box.urgent { border-color: #ff2a2a; color: #ff2a2a; animation: shake 0.5s; }

                .address-card { background: #111; border: 1px solid #333; border-radius: 16px; padding: 25px; text-align: left; margin-bottom: 20px; }
                .address-card label { display: block; color: #666; font-size: 12px; font-weight: 700; margin-bottom: 10px; text-transform: uppercase; }
                
                .address-row {
                    display: flex; justify-content: space-between; align-items: center;
                    background: #050505; border: 1px solid #222; border-radius: 8px; padding: 12px;
                    margin-bottom: 20px;
                }
                .wallet-text { font-family: 'JetBrains Mono', monospace; font-size: 13px; color: #ccc; overflow-x: auto; max-width: 85%; }
                .copy-btn { background: none; border: none; color: #fff; cursor: pointer; transition: 0.2s; }
                .copy-btn:hover { color: #ff2a2a; transform: scale(1.1); }

                .qr-placeholder {
                    height: 150px; background: #050505; border: 2px dashed #333; border-radius: 8px;
                    display: flex; align-items: center; justify-content: center; color: #444; font-size: 12px; font-weight: 700;
                }

                .info-box {
                    display: flex; gap: 10px; text-align: left; background: rgba(229, 165, 10, 0.1);
                    padding: 15px; border-radius: 8px; margin-bottom: 30px;
                }
                .info-box p { font-size: 12px; color: #e5a50a; line-height: 1.4; margin: 0; }

                .cancel-btn { background: transparent; border: none; color: #666; font-size: 14px; cursor: pointer; text-decoration: underline; }
                .cancel-btn:hover { color: white; }
            `}</style>
        </div>
    );
};

export default Processing;