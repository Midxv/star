import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Copy, Clock, CheckCircle, AlertTriangle, AlertOctagon } from 'lucide-react';
import QRCode from "react-qr-code";
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

// Updated Wallet Addresses
const WALLETS = {
    BTC: "bc1qkdhfjn3f49f4vrcc2vj6mfatd38gvr4lyry8hy",
    LTC: "LNRVNVpuCvuJ8pR8YrWWivUf8odRUzJtoa",
    USDT: "0x027aF94B5F85AD6028D226F6699A03cb28eBbC47",
    ETH: "0x027aF94B5F85AD6028D226F6699A03cb28eBbC47"
};

const Processing = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    // Retrieve data passed from Wallet.jsx
    const { cryptoStr, amount } = location.state || { cryptoStr: 'BTC', amount: '0.00' };
    const currentAddress = WALLETS[cryptoStr] || WALLETS.BTC;

    const [timeLeft, setTimeLeft] = useState(900); // 15 minutes
    const [copied, setCopied] = useState(false);
    const [showCancelWarning, setShowCancelWarning] = useState(false);

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
        navigator.clipboard.writeText(currentAddress);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="page-container animate-fade-in">
            <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />
            <Header onOpenSidebar={() => setSidebarOpen(true)} />

            {/* CANCEL WARNING MODAL */}
            {showCancelWarning && (
                <div className="modal-overlay animate-pop">
                    <div className="confirm-card">
                        <AlertOctagon size={48} color="#ef4444" style={{ marginBottom: '15px' }} />
                        <h3>Cancel Payment?</h3>
                        <p>If you have already sent funds, they may be lost if you cancel now.</p>
                        <div className="modal-actions">
                            <button className="btn-stay" onClick={() => setShowCancelWarning(false)}>Go Back</button>
                            <button className="btn-leave" onClick={() => navigate('/wallet')}>Cancel Order</button>
                        </div>
                    </div>
                </div>
            )}

            <div className="process-content">
                <div className="status-badge">
                    <div className="pulsing-dot"></div> AWAITING PAYMENT
                </div>

                <h1 className="amount-display">
                    Send <span className="highlight">€{amount}</span>
                </h1>
                <p className="subtitle">via {cryptoStr} Network</p>

                {/* QR CODE GENERATOR */}
                <div className="qr-box">
                    <div className="qr-frame">
                        <QRCode
                            value={currentAddress}
                            size={160}
                            bgColor="#ffffff"
                            fgColor="#000000"
                            level="M"
                        />
                    </div>
                </div>

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
                            {currentAddress}
                        </code>
                        <button className="copy-btn" onClick={handleCopy}>
                            {copied ? <CheckCircle size={18} color="#00ff88" /> : <Copy size={18} />}
                        </button>
                    </div>
                </div>

                <div className="info-box">
                    <AlertTriangle size={16} color="#e5a50a" />
                    <p>Send the exact amount. Transaction will be automatically detected after 1 confirmation.</p>
                </div>

                {/* CANCEL BUTTON */}
                <button className="cancel-btn" onClick={() => setShowCancelWarning(true)}>
                    Cancel Transaction
                </button>
            </div>

            <style jsx>{`
                .page-container { min-height: 100vh; background: #050505; color: white; padding-bottom: 40px; }
                .process-content { max-width: 500px; margin: 20px auto; text-align: center; padding: 0 20px; }

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
                .subtitle { color: #888; margin-bottom: 20px; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; }

                /* QR Styles */
                .qr-box { display: flex; justify-content: center; margin-bottom: 25px; }
                .qr-frame {
                    background: white; padding: 15px; border-radius: 16px;
                    box-shadow: 0 0 30px rgba(255, 255, 255, 0.1);
                }

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
                    margin-bottom: 0;
                }
                .wallet-text { font-family: 'JetBrains Mono', monospace; font-size: 13px; color: #ccc; overflow-x: auto; max-width: 85%; word-break: break-all; }
                .copy-btn { background: none; border: none; color: #fff; cursor: pointer; transition: 0.2s; }
                .copy-btn:hover { color: #ff2a2a; transform: scale(1.1); }

                .info-box {
                    display: flex; gap: 10px; text-align: left; background: rgba(229, 165, 10, 0.1);
                    padding: 15px; border-radius: 8px; margin-bottom: 30px;
                }
                .info-box p { font-size: 12px; color: #e5a50a; line-height: 1.4; margin: 0; }

                .cancel-btn { background: transparent; border: none; color: #666; font-size: 14px; cursor: pointer; text-decoration: underline; transition: 0.2s; }
                .cancel-btn:hover { color: #ef4444; }

                /* MODAL */
                .modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); backdrop-filter: blur(5px); display: flex; justify-content: center; align-items: center; z-index: 2000; }
                .confirm-card { background: #111; padding: 30px; border-radius: 20px; text-align: center; max-width: 350px; width: 90%; border: 1px solid #333; }
                .confirm-card h3 { color: #fff; margin: 0 0 10px 0; }
                .confirm-card p { color: #888; font-size: 14px; margin-bottom: 25px; }
                .modal-actions { display: flex; gap: 10px; }
                .btn-stay { flex: 1; padding: 12px; background: #222; color: white; border-radius: 8px; font-weight: 600; cursor: pointer; border: none; }
                .btn-leave { flex: 1; padding: 12px; background: #ef4444; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; }

                .animate-fade-in { animation: fadeIn 0.5s ease-out; }
                .animate-pop { animation: popUp 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
                @keyframes fadeIn { from { opacity:0; transform: translateY(10px); } to { opacity:1; transform: translateY(0); }}
                @keyframes popUp { from { opacity:0; transform: scale(0.9); } to { opacity:1; transform: scale(1); }}
            `}</style>
        </div>
    );
};

export default Processing;