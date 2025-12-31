import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { Mail, Copy, Check } from 'lucide-react';

const Support = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [copied, setCopied] = useState(false);
    const supportEmail = "marketsupport@tuta.io"; // Fake Darkweb Mail

    const handleCopy = () => {
        navigator.clipboard.writeText(supportEmail);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="page-wrapper">
            <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />
            <Header onOpenSidebar={() => setSidebarOpen(!isSidebarOpen)} />

            <main className="content">
                <div className="support-card">
                    <div className="icon-box">
                        <Mail size={40} color="#FF3B30" />
                    </div>
                    <h1>Help & Support</h1>
                    <p>For operational security, all support inquiries are handled via our email channel.</p>

                    <div className="email-box" onClick={handleCopy}>
                        <code>{supportEmail}</code>
                        <button className="copy-btn">
                            {copied ? <Check size={18} color="#00ff88"/> : <Copy size={18} />}
                        </button>
                    </div>

                    <p className="note">Expect a response within 2-4 hours.</p>
                </div>
            </main>

            <style jsx>{`
        .page-wrapper { background: #050505; min-height: 100vh; color: white; }
        .content { display: flex; align-items: center; justify-content: center; min-height: 80vh; padding: 20px; }
        
        .support-card {
          background: #111; border: 1px solid #222; padding: 50px;
          border-radius: 24px; text-align: center; max-width: 500px; width: 100%;
          box-shadow: 0 20px 50px rgba(0,0,0,0.5);
        }
        .icon-box { background: rgba(255, 59, 48, 0.1); width: 80px; height: 80px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; }
        
        h1 { font-size: 28px; margin-bottom: 15px; font-weight: 800; }
        p { color: #888; margin-bottom: 30px; line-height: 1.6; }
        
        .email-box {
          background: #050505; border: 1px solid #333; padding: 15px 20px;
          border-radius: 12px; display: flex; justify-content: space-between; align-items: center;
          cursor: pointer; transition: 0.2s;
        }
        .email-box:hover { border-color: #FF3B30; }
        code { font-family: 'JetBrains Mono', monospace; font-size: 16px; color: #fff; }
        .copy-btn { background: none; border: none; color: #666; cursor: pointer; }
        
        .note { font-size: 12px; margin-top: 25px; color: #555; }
      `}</style>
        </div>
    );
};

export default Support;