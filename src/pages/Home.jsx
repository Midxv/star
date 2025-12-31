// src/pages/Home.jsx
import React from 'react';
import { ArrowRight, TrendingUp, ShieldCheck, Zap, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Header'; // Using Header as Navbar

const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="home-wrapper">
            {/* Reusing Header Component for consistency */}
            <Navbar onOpenSidebar={() => {}} />

            {/* HERO SECTION */}
            <section className="hero container-fluid animate-fade-up">
                <div className="hero-content">
                    <div className="hero-text">
                        <div className="badge">Marketplace v4.0</div>
                        <h1>DIGITAL <br /><span className="text-red">ASSETS.</span></h1>
                        <p>The premium marketplace for verified high-balance cards. Secure, instant, and anonymous delivery.</p>

                        <div className="hero-btns">
                            <button className="btn-primary" onClick={() => navigate('/login')}>
                                Get Started
                            </button>
                            <button className="btn-ghost" onClick={() => navigate('/login')}>
                                View Demo
                            </button>
                        </div>

                        <div className="stats-row">
                            <div className="stat"><strong>15k+</strong> Active Users</div>
                            <div className="stat"><strong>$4M+</strong> Volume</div>
                            <div className="stat"><strong>99%</strong> Uptime</div>
                        </div>
                    </div>

                    <div className="hero-visual">
                        <div className="red-glow-circle"></div>
                        <div className="card-mockup glass">
                            <div className="chip"></div>
                            <div className="number">**** **** **** 8892</div>
                            <div className="expiry">EXP 12/28</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FEATURES GRID */}
            <section className="features container-fluid">
                <div className="feature-card">
                    <ShieldCheck size={32} color="#FF3B30" />
                    <h3>Secure Escrow</h3>
                    <p>Funds are held safely until product delivery is confirmed.</p>
                </div>
                <div className="feature-card">
                    <Zap size={32} color="#FF3B30" />
                    <h3>Instant Delivery</h3>
                    <p>Automated systems deliver your assets immediately after payment.</p>
                </div>
                <div className="feature-card">
                    <Globe size={32} color="#FF3B30" />
                    <h3>Global Access</h3>
                    <p>Access inventory from USA, Europe, and Asia instantly.</p>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="footer">
                <p>&copy; 2025 StarCard Inc. Anonymous Marketplace.</p>
            </footer>

            <style jsx>{`
        .home-wrapper { min-height: 100vh; background: #050505; color: white; overflow-x: hidden; }
        
        .container-fluid { padding: 0 50px; }
        
        .hero { padding-top: 60px; padding-bottom: 100px; }
        .hero-content { display: grid; grid-template-columns: 1fr 1fr; align-items: center; gap: 50px; }
        
        .badge { color: #FF3B30; border: 1px solid #FF3B30; padding: 6px 12px; border-radius: 50px; font-size: 12px; font-weight: 700; width: fit-content; margin-bottom: 25px; text-transform: uppercase; background: rgba(255, 59, 48, 0.1); }
        
        .hero-text h1 { font-size: 80px; line-height: 1; font-weight: 900; letter-spacing: -3px; margin-bottom: 20px; }
        .hero-text p { font-size: 18px; color: #888; margin-bottom: 40px; max-width: 500px; line-height: 1.6; }
        
        .hero-btns { display: flex; gap: 20px; margin-bottom: 60px; }
        .btn-primary { background: #FF3B30; color: white; padding: 16px 36px; border-radius: 6px; font-weight: 700; text-transform: uppercase; font-size: 14px; border: none; cursor: pointer; transition: 0.3s; }
        .btn-primary:hover { background: #d32f2f; box-shadow: 0 0 30px rgba(255, 59, 48, 0.4); transform: translateY(-2px); }
        .btn-ghost { background: transparent; color: white; padding: 16px 36px; border-radius: 6px; font-weight: 700; text-transform: uppercase; font-size: 14px; border: 1px solid #333; cursor: pointer; transition: 0.3s; }
        .btn-ghost:hover { border-color: #FF3B30; color: #FF3B30; }

        .stats-row { display: flex; gap: 60px; border-top: 1px solid #222; padding-top: 30px; }
        .stat strong { display: block; font-size: 32px; color: white; margin-bottom: 5px; }
        .stat { color: #666; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; font-weight: 700; }

        /* VISUALS */
        .hero-visual { position: relative; height: 500px; display: flex; justify-content: center; align-items: center; }
        .red-glow-circle { position: absolute; width: 500px; height: 500px; background: #FF3B30; border-radius: 50%; opacity: 0.15; filter: blur(100px); animation: pulse 6s infinite ease-in-out; }
        
        .card-mockup { width: 340px; height: 210px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); border-radius: 20px; backdrop-filter: blur(15px); position: relative; z-index: 2; transform: rotate(-10deg) translateY(-20px); box-shadow: 0 30px 60px rgba(0,0,0,0.6); transition: 0.5s; }
        .card-mockup:hover { transform: rotate(0deg) scale(1.05); border-color: #FF3B30; }
        .card-mockup .chip { width: 45px; height: 35px; background: linear-gradient(135deg, #d4af37 0%, #aa8c2c 100%); border-radius: 6px; position: absolute; top: 30px; left: 30px; opacity: 0.9; }
        .card-mockup .number { position: absolute; top: 90px; left: 30px; font-family: monospace; font-size: 22px; letter-spacing: 2px; text-shadow: 0 2px 4px rgba(0,0,0,0.5); }
        .card-mockup .expiry { position: absolute; bottom: 30px; right: 30px; font-family: monospace; font-size: 14px; color: #ccc; }

        @keyframes pulse { 0%, 100% { opacity: 0.15; transform: scale(1); } 50% { opacity: 0.25; transform: scale(1.1); } }

        /* FEATURES */
        .features { display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px; padding-bottom: 80px; }
        .feature-card { background: #0f0f0f; border: 1px solid #222; padding: 30px; border-radius: 16px; transition: 0.3s; }
        .feature-card:hover { border-color: #FF3B30; transform: translateY(-5px); }
        .feature-card h3 { font-size: 20px; margin: 20px 0 10px; }
        .feature-card p { color: #888; font-size: 15px; line-height: 1.5; }

        .footer { border-top: 1px solid #222; padding: 40px; text-align: center; color: #444; font-size: 13px; }

        @media (max-width: 900px) {
          .hero-content { grid-template-columns: 1fr; text-align: center; }
          .hero-text p { margin: 0 auto 40px; }
          .hero-btns { justify-content: center; }
          .stats-row { justify-content: center; }
          .hero-visual { display: none; }
          .features { grid-template-columns: 1fr; }
        }
      `}</style>
        </div>
    );
};

export default Home;