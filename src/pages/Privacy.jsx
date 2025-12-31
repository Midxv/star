import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const Privacy = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="page-wrapper">
            <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />
            <Header onOpenSidebar={() => setSidebarOpen(!isSidebarOpen)} />

            <main className="content">
                <h1>Privacy Policy</h1>
                <p className="last-updated">Last Updated: October 24, 2025</p>

                <div className="policy-text">
                    <h3>1. Introduction</h3>
                    <p>StarCard ("we", "our", "us") is committed to protecting your privacy. This Privacy Policy explains how we handle data in our decentralized ecosystem. By using our service, you agree to the collection and use of information in accordance with this policy.</p>

                    <h3>2. Data Collection</h3>
                    <p>We practice data minimalism. We do not collect personal identifiers such as names, physical addresses, or phone numbers unless explicitly provided for support cases. We collect:<br/>- Account credentials (email, hashed passwords)<br/>- Transaction logs (internal wallet history)<br/>- Access logs for security monitoring.</p>

                    <h3>3. Zero-Knowledge Analytics</h3>
                    <p>We utilize privacy-focused analytics that do not track user behavior across other sites. Your browsing habits on StarCard remain confidential and are not sold to third-party advertisers.</p>

                    <h3>4. Security of Funds</h3>
                    <p>Wallet balances are stored in a secure, encrypted database. While we implement industry-standard security measures, user are advised to enable 2FA where available and use unique passwords.</p>

                    <h3>5. Changes to This Policy</h3>
                    <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.</p>
                </div>
            </main>

            <style jsx>{`
        .page-wrapper { background: #050505; min-height: 100vh; color: white; }
        .content { max-width: 900px; margin: 0 auto; padding: 60px 20px; }
        
        h1 { font-size: 36px; font-weight: 800; margin-bottom: 10px; }
        .last-updated { color: #666; font-size: 14px; margin-bottom: 40px; }
        
        .policy-text { background: #111; padding: 40px; border-radius: 16px; border: 1px solid #222; }
        h3 { font-size: 18px; color: #fff; margin: 30px 0 15px; }
        h3:first-child { margin-top: 0; }
        p { color: #999; line-height: 1.7; font-size: 14px; }
      `}</style>
        </div>
    );
};

export default Privacy;