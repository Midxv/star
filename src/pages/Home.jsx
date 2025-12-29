import React from 'react';
import { ArrowRight, Star, TrendingUp } from 'lucide-react';

const Home = () => {
    return (
        <div className="home-wrapper">

            {/* HERO SECTION */}
            <section className="hero container animate-fade-up">
                <div className="hero-text">
                    <h1>The Next Gen <br /><span className="text-red">Digital Market.</span></h1>
                    <p>Buy, sell, and trade premium assets securely. The future of commerce is here.</p>
                    <div className="hero-btns">
                        <button className="btn-primary">Explore Market</button>
                        <button className="btn-ghost">Sell Item</button>
                    </div>
                </div>

                {/* Abstract 3D shape or Image placeholder */}
                <div className="hero-visual">
                    <div className="red-orb"></div>
                </div>
            </section>

            {/* TRENDING GRID */}
            <section className="container section-trending">
                <div className="section-header">
                    <div className="flex-align">
                        <TrendingUp color="var(--primary)" />
                        <h2>Trending Now</h2>
                    </div>
                    <button className="view-all">View All <ArrowRight size={16} /></button>
                </div>

                <div className="card-grid">
                    <ProductCard title="Neon Cyberpunk UI Kit" price="$49.00" category="Design" />
                    <ProductCard title="SaaS Dashboard Pro" price="$89.00" category="Code" />
                    <ProductCard title="3D Abstract Pack" price="$25.00" category="3D Asset" />
                    <ProductCard title="AI Trading Bot" price="$199.00" category="Software" />
                </div>
            </section>

            <style jsx>{`
        .hero {
          display: flex; align-items: center; justify-content: space-between;
          padding: 100px 24px; min-height: 80vh;
        }
        .hero-text p { font-size: 18px; color: var(--text-muted); margin: 20px 0 40px 0; max-width: 500px; }
        .hero-btns { display: flex; gap: 20px; }

        .red-orb {
          width: 400px; height: 400px;
          background: radial-gradient(circle, var(--primary) 0%, transparent 70%);
          opacity: 0.2; filter: blur(60px);
          animation: pulse 4s infinite ease-in-out;
        }
        @keyframes pulse { 0% { transform: scale(1); } 50% { transform: scale(1.2); } 100% { transform: scale(1); } }

        .section-trending { padding: 50px 24px; }
        .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px; }
        .flex-align { display: flex; align-items: center; gap: 10px; }
        .view-all { background: none; color: var(--text-muted); display: flex; align-items: center; gap: 5px; font-weight: 600; transition: 0.2s; }
        .view-all:hover { color: var(--primary); }

        .card-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 30px; }
      `}</style>
        </div>
    );
};

const ProductCard = ({ title, price, category }) => (
    <div className="product-card">
        <div className="card-image"></div>
        <div className="card-info">
            <div className="card-cat">{category}</div>
            <h3>{title}</h3>
            <div className="card-bottom">
                <span className="price">{price}</span>
                <button className="btn-buy">Buy</button>
            </div>
        </div>
        <style jsx>{`
      .product-card {
        background: var(--bg-card); border: 1px solid var(--border);
        border-radius: var(--radius); overflow: hidden; transition: 0.3s;
        cursor: pointer;
      }
      .product-card:hover { border-color: var(--primary); transform: translateY(-5px); }
      
      .card-image { height: 200px; background: #1a1a1a; width: 100%; }
      .card-info { padding: 20px; }
      .card-cat { color: var(--primary); font-size: 12px; font-weight: 700; text-transform: uppercase; margin-bottom: 5px; }
      .product-card h3 { font-size: 18px; font-weight: 700; margin-bottom: 20px; }
      
      .card-bottom { display: flex; justify-content: space-between; align-items: center; }
      .price { font-size: 18px; font-weight: 600; }
      .btn-buy {
        background: white; color: black; padding: 8px 16px; border-radius: 8px; font-weight: 700; transition: 0.2s;
      }
      .btn-buy:hover { background: var(--primary); color: white; }
    `}</style>
    </div>
);

export default Home;