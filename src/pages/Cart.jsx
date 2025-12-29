import React from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { Trash2, Lock, CheckCircle } from 'lucide-react';

const Cart = () => {
    const navigate = useNavigate();

    // Mock Cart Items
    const cartItems = [
        { id: 1, title: 'VISA Platinum - USA', bin: '414720', price: 45.00 },
        { id: 2, title: 'MASTERCARD Gold - UK', bin: '510510', price: 32.50 },
        { id: 3, title: 'AMEX Corporate - DE', bin: '378200', price: 60.00 },
    ];

    const total = cartItems.reduce((acc, item) => acc + item.price, 0);

    return (
        <div className="page-wrapper">
            <Sidebar />
            <Header onOpenSidebar={() => {}} balance={125.00} />

            <div className="cart-container">

                {/* LEFT: CART ITEMS */}
                <div className="cart-items">
                    <h1 className="cart-title">Shopping Cart</h1>
                    <div className="divider"></div>

                    {cartItems.map((item) => (
                        <div className="cart-item" key={item.id}>
                            <div className="item-image">
                                <span className="img-placeholder">CC</span>
                            </div>
                            <div className="item-details">
                                <h3>{item.title}</h3>
                                <p className="stock-status">In Stock</p>
                                <p className="item-bin">BIN: {item.bin}</p>
                                <div className="item-actions">
                                    <button className="delete-btn">Delete</button>
                                    <span className="separator">|</span>
                                    <button className="save-btn">Save for later</button>
                                </div>
                            </div>
                            <div className="item-price">
                                ${item.price.toFixed(2)}
                            </div>
                        </div>
                    ))}
                </div>

                {/* RIGHT: CHECKOUT BOX (Amazon Style) */}
                <div className="checkout-sidebar">
                    <div className="subtotal-card">
                        <div className="subtotal-row">
                            <span>Subtotal ({cartItems.length} items):</span>
                            <span className="big-price">${total.toFixed(2)}</span>
                        </div>

                        <div className="gift-check">
                            <input type="checkbox" /> This order contains a gift
                        </div>

                        <button className="checkout-btn" onClick={() => navigate('/payment-process')}>
                            Proceed to Checkout
                        </button>
                    </div>

                    <div className="trust-badges">
                        <Lock size={14} /> Secure Transaction
                    </div>
                </div>

            </div>

            <style jsx>{`
                .page-wrapper { background: #eaeded; min-height: 100vh; color: #0f1111; } /* Amazon light grey bg */
                
                .cart-container {
                    max-width: 1400px; margin: 20px auto; padding: 0 20px;
                    display: grid; grid-template-columns: 3fr 1fr; gap: 20px;
                }

                /* LEFT COLUMN */
                .cart-items { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
                .cart-title { font-size: 28px; font-weight: 400; margin-bottom: 10px; }
                .divider { height: 1px; background: #ddd; margin-bottom: 20px; }

                .cart-item { display: flex; gap: 20px; border-bottom: 1px solid #ddd; padding-bottom: 20px; margin-bottom: 20px; }
                
                .item-image { 
                    width: 100px; height: 60px; background: #333; border-radius: 4px; 
                    display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;
                }

                .item-details { flex-grow: 1; }
                .item-details h3 { font-size: 18px; font-weight: 500; margin: 0 0 5px 0; color: #0f1111; }
                .stock-status { color: #007600; font-size: 12px; margin-bottom: 5px; }
                .item-bin { font-size: 12px; color: #565959; margin-bottom: 10px; }
                
                .item-actions button {
                    background: none; border: none; color: #007185; font-size: 12px; cursor: pointer; padding: 0;
                }
                .item-actions button:hover { text-decoration: underline; }
                .separator { margin: 0 10px; color: #ddd; }

                .item-price { font-size: 18px; font-weight: 700; text-align: right; }

                /* RIGHT COLUMN */
                .subtotal-card {
                    background: white; padding: 20px; border-radius: 8px; 
                    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                }
                .subtotal-row { font-size: 18px; margin-bottom: 15px; }
                .big-price { font-weight: 700; margin-left: 5px; }
                
                .gift-check { font-size: 14px; margin-bottom: 20px; display: flex; align-items: center; gap: 5px; }

                .checkout-btn {
                    width: 100%; padding: 10px; background: #ffd814; border: 1px solid #fcd200;
                    border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer;
                    box-shadow: 0 2px 5px rgba(213, 217, 217, 0.5);
                }
                .checkout-btn:hover { background: #f7ca00; }

                .trust-badges { margin-top: 15px; font-size: 12px; color: #565959; display: flex; align-items: center; gap: 5px; justify-content: center; }

                @media (max-width: 900px) {
                    .cart-container { grid-template-columns: 1fr; }
                }
            `}</style>
        </div>
    );
};

export default Cart;