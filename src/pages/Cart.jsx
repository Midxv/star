import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { Trash2, Lock, ArrowRight, ShoppingBag } from 'lucide-react';

const Cart = () => {
    const navigate = useNavigate();
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [cartItems, setCartItems] = useState([]);

    // LOAD CART FROM LOCAL STORAGE
    useEffect(() => {
        const savedCart = JSON.parse(localStorage.getItem('myCart') || '[]');
        setCartItems(savedCart);
    }, []);

    // SAVE UPDATES TO LOCAL STORAGE
    const saveCart = (newItems) => {
        setCartItems(newItems);
        localStorage.setItem('myCart', JSON.stringify(newItems));
    };

    // Update Quantity (1x to 5x)
    const updateQty = (id, newQty) => {
        const updated = cartItems.map(item =>
            item.id === id ? { ...item, qty: parseInt(newQty) } : item
        );
        saveCart(updated);
    };

    // Remove Item
    const removeItem = (id) => {
        const updated = cartItems.filter(item => item.id !== id);
        saveCart(updated);
    };

    // Calculate Total
    const total = cartItems.reduce((acc, item) => acc + (parseFloat(item.price) * item.qty), 0);

    return (
        <div className="page-wrapper">
            <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />
            <Header onOpenSidebar={() => setSidebarOpen(!isSidebarOpen)} balance={125.00} />

            <div className="cart-container">

                {cartItems.length === 0 ? (
                    <div className="empty-cart">
                        <ShoppingBag size={64} color="#333" />
                        <h2>Your cart is empty</h2>
                        <button className="browse-btn" onClick={() => navigate('/')}>
                            Browse Market
                        </button>
                    </div>
                ) : (
                    <>
                        {/* LEFT: CART ITEMS */}
                        <div className="cart-items">
                            <h1 className="cart-title">Shopping Cart <span className="count">({cartItems.length})</span></h1>
                            <div className="divider"></div>

                            {cartItems.map((item) => (
                                <div className="cart-item" key={item.id}>
                                    {/* Item Image */}
                                    <div className="item-image">
                                        <span className="img-placeholder">CC</span>
                                    </div>

                                    {/* Details */}
                                    <div className="item-details">
                                        <h3>{item.brand} {item.type}</h3>
                                        <p className="item-bin">BIN: {item.bin} | {item.country}</p>
                                        <div className="stock-tag">Instant Delivery</div>
                                    </div>

                                    {/* Quantity & Delete */}
                                    <div className="qty-section">
                                        <select
                                            value={item.qty}
                                            onChange={(e) => updateQty(item.id, e.target.value)}
                                            className="qty-select"
                                        >
                                            {[1,2,3,4,5].map(num => (
                                                <option key={num} value={num}>{num}x</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Price & Remove */}
                                    <div className="price-action-col">
                                        <div className="item-price">
                                            ${(item.price * item.qty).toFixed(2)}
                                        </div>
                                        <button className="delete-btn" onClick={() => removeItem(item.id)}>
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* RIGHT: CHECKOUT BOX */}
                        <div className="checkout-sidebar">
                            <div className="subtotal-card">
                                <div className="subtotal-row">
                                    <span>Subtotal:</span>
                                    <span className="big-price">${total.toFixed(2)}</span>
                                </div>

                                <button className="checkout-btn" onClick={() => navigate('/payment-process')}>
                                    Checkout <ArrowRight size={16} />
                                </button>

                                <div className="trust-badges">
                                    <Lock size={12} color="#00ff88"/> <span>256-bit Encrypted</span>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>

            <style jsx>{`
                .page-wrapper { background: #050505; min-height: 100vh; color: white; }

                .cart-container {
                    max-width: 1200px; margin: 40px auto; padding: 0 20px;
                    display: grid; grid-template-columns: 3fr 1fr; gap: 30px;
                }

                /* EMPTY STATE */
                .empty-cart {
                    grid-column: 1 / -1; display: flex; flex-direction: column;
                    align-items: center; justify-content: center; padding: 100px 0;
                    border: 1px dashed #333; border-radius: 16px; margin-top: 40px;
                }
                .empty-cart h2 { margin: 20px 0; color: #666; font-family: 'JetBrains Mono'; }
                .browse-btn {
                    padding: 12px 30px; background: #ff2a2a; color: white; border: none;
                    font-weight: 700; border-radius: 50px; cursor: pointer; transition: 0.2s;
                }
                .browse-btn:hover { transform: scale(1.05); background: #d92020; }

                /* LEFT COLUMN */
                .cart-items { background: #111; padding: 30px; border-radius: 16px; border: 1px solid #222; }
                .cart-title { font-size: 24px; font-weight: 800; margin-bottom: 20px; }
                .count { color: #666; font-size: 18px; }
                .divider { height: 1px; background: #222; margin-bottom: 30px; }

                .cart-item {
                    display: flex; gap: 20px; border-bottom: 1px solid #222;
                    padding-bottom: 25px; margin-bottom: 25px; align-items: center;
                }
                .cart-item:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }

                .item-image {
                    width: 80px; height: 50px; background: linear-gradient(135deg, #222, #111);
                    border-radius: 6px; display: flex; align-items: center; justify-content: center;
                    border: 1px solid #333;
                }
                .img-placeholder { font-family: 'JetBrains Mono'; color: #666; font-weight: 700; }

                .item-details { flex-grow: 1; }
                .item-details h3 { font-size: 16px; font-weight: 700; margin: 0 0 5px 0; color: #fff; }
                .item-bin { font-family: 'JetBrains Mono'; font-size: 12px; color: #888; margin-bottom: 8px; }
                .stock-tag {
                    display: inline-block; font-size: 10px; color: #00ff88;
                    background: rgba(0,255,136,0.1); padding: 2px 6px; border-radius: 4px;
                }

                /* QTY SELECTOR */
                .qty-select {
                    background: #050505; color: white; border: 1px solid #333;
                    padding: 8px 12px; border-radius: 8px; outline: none; cursor: pointer;
                    font-family: 'JetBrains Mono';
                }
                .qty-select:focus { border-color: #ff2a2a; }

                /* RIGHT SIDE OF ITEM ROW */
                .price-action-col { text-align: right; min-width: 100px; display: flex; flex-direction: column; gap: 10px; align-items: flex-end; }
                .item-price { font-size: 18px; font-weight: 700; color: #fff; font-family: 'JetBrains Mono'; }

                .delete-btn {
                    background: none; border: none; color: #444; font-size: 12px;
                    cursor: pointer; padding: 5px; border-radius: 4px; transition: 0.2s;
                }
                .delete-btn:hover { color: #ff2a2a; background: rgba(255, 42, 42, 0.1); }

                /* RIGHT COLUMN (CHECKOUT) */
                .subtotal-card {
                    background: #111; padding: 25px; border-radius: 16px;
                    border: 1px solid #222; position: sticky; top: 120px;
                }
                .subtotal-row {
                    display: flex; justify-content: space-between; align-items: center;
                    margin-bottom: 25px; font-size: 16px; color: #ccc;
                }
                .big-price { font-size: 24px; font-weight: 800; color: #fff; font-family: 'JetBrains Mono'; }

                .checkout-btn {
                    width: 100%; padding: 15px; background: #ff2a2a; color: white; border: none;
                    border-radius: 8px; font-size: 14px; font-weight: 800; cursor: pointer;
                    display: flex; align-items: center; justify-content: center; gap: 10px;
                    transition: 0.2s; box-shadow: 0 5px 20px rgba(255, 42, 42, 0.2);
                }
                .checkout-btn:hover { background: #d92020; transform: translateY(-2px); }

                .trust-badges {
                    margin-top: 20px; font-size: 11px; display: flex;
                    align-items: center; justify-content: center; gap: 6px; color: #666;
                }

                @media (max-width: 900px) {
                    .cart-container { grid-template-columns: 1fr; }
                    .subtotal-card { position: static; margin-bottom: 30px; order: -1; }
                }
            `}</style>
        </div>
    );
};

export default Cart;