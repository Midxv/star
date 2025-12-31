import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const About = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="page-wrapper">
            <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />
            <Header onOpenSidebar={() => setSidebarOpen(!isSidebarOpen)} />

            <main className="content">
                <div className="text-container">
                    <h1>About <span className="text-red">StarCard</span></h1>
                    <p className="lead">The premier destination for verified digital assets.</p>

                    <div className="section">
                        <h3>Our Mission</h3>
                        <p>StarCard was established to provide a secure, anonymous, and reliable marketplace for high-value digital products. We eliminate the risk of peer-to-peer transactions by acting as a trusted escrow and verification service.</p>
                    </div>

                    <div className="section">
                        <h3>Verification Process</h3>
                        <p>Every asset listed on our platform undergoes a rigorous automated check to ensure validity (Live status) before it is made available for purchase. We guarantee 99.9% valid rates.</p>
                    </div>
                </div>
            </main>

            <style jsx>{`
        .page-wrapper { background: #050505; min-height: 100vh; color: white; }
        .content { max-width: 800px; margin: 0 auto; padding: 60px 20px; }
        
        .text-container { animation: fadeIn 0.5s ease-out; }
        h1 { font-size: 42px; font-weight: 900; margin-bottom: 10px; }
        .text-red { color: #FF3B30; }
        .lead { font-size: 18px; color: #888; margin-bottom: 50px; }
        
        .section { margin-bottom: 40px; }
        h3 { font-size: 22px; margin-bottom: 15px; color: white; border-left: 3px solid #FF3B30; padding-left: 15px; }
        p { color: #aaa; line-height: 1.8; font-size: 15px; }
        
        @keyframes fadeIn { from { opacity:0; transform: translateY(20px); } to { opacity:1; transform: translateY(0); } }
      `}</style>
        </div>
    );
};

export default About;