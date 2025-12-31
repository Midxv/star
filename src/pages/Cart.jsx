import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { Trash2, ArrowRight, ShoppingBag, CheckCircle, AlertOctagon } from 'lucide-react';
import { db, auth } from '../firebaseConfig';
import { doc, getDoc, updateDoc, addDoc, collection } from "firebase/firestore";

const Cart = () => {
    const navigate = useNavigate();
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState(false); // Success Screen State
    const [showErrorToast, setShowErrorToast] = useState(false);

    useEffect(() => {
        const savedCart = JSON.parse(localStorage.getItem('myCart') || '[]');
        setCartItems(savedCart);
    }, []);

    const saveCart = (newItems) => {
        setCartItems(newItems);
        localStorage.setItem('myCart', JSON.stringify(newItems));
        window.dispatchEvent(new Event("cartUpdated"));
    };

    const updateQty = (id, newQty) => {
        const updated = cartItems.map(item =>
            item.id === id ? { ...item, qty: parseInt(newQty) } : item
        );
        saveCart(updated);
    };

    const removeItem = (id) => {
        const updated = cartItems.filter(item => item.id !== id);
        saveCart(updated);
    };

    const total = cartItems.reduce((acc, item) => acc + (parseFloat(item.price) * item.qty), 0);

    // --- CHECKOUT LOGIC ---
    const handleCheckout = async () => {
        if (isProcessing) return;
        setIsProcessing(true);

        if (!auth.currentUser) {
            navigate('/login');
            return;
        }

        const userRef = doc(db, "users", auth.currentUser.uid);

        try {
            // 1. Check Balance
            const userSnap = await getDoc(userRef);
            const currentBalance = userSnap.data().balance || 0;

            if (currentBalance >= total) {
                // --- SUCCESS ---

                // 1. Deduct Balance
                const newBalance = currentBalance - total;
                await updateDoc(userRef, { balance: newBalance });

                // 2. Add items to user's 'orders' collection (Inventory)
                const ordersRef = collection(db, "users", auth.currentUser.uid, "orders");

                // Add each item as a separate order/card
                for (const item of cartItems) {
                    for (let i = 0; i < item.qty; i++) {
                        await addDoc(ordersRef, {
                            type: item.type,
                            brand: item.brand,
                            bin: item.bin,
                            country: item.country,
                            price: item.price,
                            cardName: "STARCARD USER",
                            cardNumber: `4${Math.floor(Math.random() * 1000000000000000)}`, // Mock Number
                            expiry: `${Math.floor(Math.random() * 12) + 1}/${Math.floor(Math.random() * 5) + 26}`,
                            cvv: `${Math.floor(Math.random() * 899) + 100}`,
                            date: new Date().toISOString(),
                            isPurchased: true
                        });
                    }
                }

                // 3. Clear Cart
                saveCart([]);

                // 4. Show Success Screen
                setOrderSuccess(true);

            } else {
                // --- FAIL: Insufficient Funds ---
                setShowErrorToast(true);
                setTimeout(() => {
                    navigate('/wallet'); // Redirect to Wallet
                }, 2000);
            }

        } catch (e) {
            console.error("Checkout Error:", e);
            alert("Transaction failed. Please try again.");
        }
        setIsProcessing(false);
    };

    if (orderSuccess) {
        return (
            <div className="success-screen">
                <div className="success-card">
                    <div className="check-circle-anim">
                        <CheckCircle size={80} color="#00ff88" />
                    </div>
                    <h1>Order Placed!</h1>
                    <p>Your cards have been added to your inventory.</p>
                    <button className="btn-inventory" onClick={() => navigate('/inventory')}>
                        Go to Inventory
                    </button>
                </div>
                <style jsx>{`
                    .success-screen {
                        height: 100vh; background: #050505; color: white;
                        display: flex; align-items: center; justify-content: center;
                    }
                    .success-card {
                        text-align: center; background: #111; padding: 60px;
                        border-radius: 40px; border: 1px solid #222;
                        box-shadow: 0 20px 50px rgba(0,0,0,0.5);
                        animation: popUp 0.5s cubic-bezier(0.16, 1, 0.3, 1);
                    }
                    .check-circle-anim { margin-bottom: 30px; animation: bounce 1s infinite; }
                    h1 { font-size: 32px; font-weight: 800; margin-bottom: 10px; }
                    p { color: #888; margin-bottom: 40px; font-family: 'JetBrains Mono'; }
                    
                    .btn-inventory {
                        background: #00ff88; color: black; border: none;
                        padding: 15px 40px; border-radius: 50px; font-weight: 800;
                        font-size: 16px; cursor: pointer; transition: 0.2s;
                        box-shadow: 0 0 20px rgba(0, 255, 136, 0.4);
                    }
                    .btn-inventory:hover { transform: scale(1.05); background: white; }

                    @keyframes popUp { from { opacity: 0; transform: scale(0.8); } to { opacity: 1; transform: scale(1); } }
                    @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
                `}</style>
            </div>
        );
    }

    return (
        <div className="page-wrapper">
            <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />
            <Header onOpenSidebar={() => setSidebarOpen(!isSidebarOpen)} />

            {/* ERROR TOAST */}
            {showErrorToast && (
                <div className="error-toast">
                    <AlertOctagon size={24} />
                    <span>Insufficient Balance! Redirecting...</span>
                </div>
            )}

            <div className="cart-container">

                {cartItems.length === 0 ? (
                    <div className="empty-cart">
                        <ShoppingBag size={64} color="#333" />
                        <h2>Cart Empty</h2>
                        <button className="browse-btn" onClick={() => navigate('/')}>
                            Find Items
                        </button>
                    </div>
                ) : (
                    <>
                        {/* LEFT: CART ITEMS */}
                        <div className="cart-list">
                            <h1 className="cart-header">Your Bag <span className="count">({cartItems.length})</span></h1>

                            {cartItems.map((item) => (
                                <div className="cart-pill-item" key={item.id}>
                                    <div className="item-image-circle">
                                        <span className="img-text">CC</span>
                                    </div>

                                    <div className="item-details">
                                        <h3>{item.brand} {item.type}</h3>
                                        <p className="item-sub">{item.bin} • {item.country}</p>
                                    </div>

                                    <div className="qty-wrapper">
                                        <select
                                            value={item.qty}
                                            onChange={(e) => updateQty(item.id, e.target.value)}
                                            className="qty-pill"
                                        >
                                            {[1,2,3,4,5].map(num => (
                                                <option key={num} value={num}>{num}x</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="price-col">
                                        <div className="item-price">
                                            ${(item.price * item.qty).toFixed(2)}
                                        </div>
                                        <button className="delete-icon" onClick={() => removeItem(item.id)}>
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* RIGHT: CHECKOUT */}
                        <div className="checkout-sidebar">
                            <div className="total-pill-card">
                                <div className="subtotal-row">
                                    <span>Total</span>
                                    <span className="big-price">${total.toFixed(2)}</span>
                                </div>

                                <button
                                    className="checkout-pill-btn"
                                    onClick={handleCheckout}
                                    disabled={isProcessing}
                                >
                                    {isProcessing ? 'Processing...' : (
                                        <>Checkout <ArrowRight size={18} /></>
                                    )}
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>

            <style jsx>{`
                .page-wrapper { background: #050505; min-height: 100vh; color: white; }

                .cart-container {
                    max-width: 1000px; margin: 40px auto; padding: 0 20px;
                    display: grid; grid-template-columns: 1.5fr 1fr; gap: 40px;
                }

                /* EMPTY STATE */
                .empty-cart {
                    grid-column: 1 / -1; display: flex; flex-direction: column;
                    align-items: center; justify-content: center; padding: 80px 0;
                    background: #111; border-radius: 40px; border: 1px solid #222;
                }
                .empty-cart h2 { margin: 20px 0; color: #666; font-family: 'JetBrains Mono'; }
                .browse-btn {
                    padding: 15px 40px; background: #ff2a2a; color: white; border: none;
                    font-weight: 800; border-radius: 50px; cursor: pointer; transition: 0.2s;
                }
                .browse-btn:hover { transform: scale(1.05); box-shadow: 0 10px 30px rgba(255, 42, 42, 0.2); }

                /* LIST */
                .cart-header { font-size: 28px; font-weight: 800; margin-bottom: 30px; letter-spacing: -1px; }
                .count { color: #666; font-size: 18px; font-weight: 400; }

                .cart-pill-item {
                    display: flex; gap: 20px; background: #111;
                    padding: 20px; border-radius: 50px;
                    margin-bottom: 20px; align-items: center;
                    border: 1px solid #222; transition: 0.2s;
                }
                .cart-pill-item:hover { border-color: #333; transform: translateY(-3px); }

                .item-image-circle {
                    width: 60px; height: 60px; background: #222;
                    border-radius: 50%; display: flex; align-items: center; justify-content: center;
                    flex-shrink: 0;
                }
                .img-text { font-family: 'JetBrains Mono'; color: #666; font-weight: 800; }

                .item-details { flex-grow: 1; }
                .item-details h3 { font-size: 16px; font-weight: 700; margin: 0; color: #fff; }
                .item-sub { font-family: 'JetBrains Mono'; font-size: 12px; color: #666; margin-top: 5px; }

                .qty-pill {
                    background: #000; color: white; border: 1px solid #333;
                    padding: 10px 15px; border-radius: 30px; outline: none; cursor: pointer;
                    font-family: 'JetBrains Mono'; font-size: 12px; appearance: none; text-align: center;
                }
                .qty-pill:hover { border-color: #555; }

                .price-col { text-align: right; display: flex; align-items: center; gap: 20px; margin-right: 10px; }
                .item-price { font-size: 18px; font-weight: 700; color: #fff; font-family: 'JetBrains Mono'; }

                .delete-icon {
                    background: #222; border: none; color: #666; width: 40px; height: 40px;
                    border-radius: 50%; display: flex; align-items: center; justify-content: center;
                    cursor: pointer; transition: 0.2s;
                }
                .delete-icon:hover { background: #ff2a2a; color: white; transform: rotate(10deg); }

                /* TOTAL CARD */
                .total-pill-card {
                    background: #111; padding: 40px; border-radius: 40px;
                    border: 1px solid #222; position: sticky; top: 120px;
                    text-align: center;
                }
                .subtotal-row {
                    display: flex; justify-content: space-between; align-items: center;
                    margin-bottom: 30px; font-size: 18px; color: #888;
                }
                .big-price { font-size: 32px; font-weight: 800; color: #fff; font-family: 'JetBrains Mono'; }

                .checkout-pill-btn {
                    width: 100%; padding: 20px; background: #ff2a2a; color: white; border: none;
                    border-radius: 50px; font-size: 16px; font-weight: 800; cursor: pointer;
                    display: flex; align-items: center; justify-content: center; gap: 10px;
                    transition: 0.2s; box-shadow: 0 10px 40px rgba(255, 42, 42, 0.2);
                }
                .checkout-pill-btn:hover { transform: scale(1.02); background: #fff; color: #000; }
                .checkout-pill-btn:disabled { opacity: 0.5; cursor: not-allowed; }

                /* ERROR TOAST */
                .error-toast {
                    position: fixed; top: 20px; left: 50%; transform: translateX(-50%);
                    background: #fee2e2; color: #ef4444; padding: 15px 30px;
                    border-radius: 50px; font-weight: 800; display: flex; align-items: center; gap: 10px;
                    z-index: 2000; box-shadow: 0 10px 40px rgba(0,0,0,0.5);
                    animation: slideDown 0.3s ease;
                }
                @keyframes slideDown { from { transform: translate(-50%, -20px); opacity: 0; } to { transform: translate(-50%, 0); opacity: 1; } }

                @media (max-width: 900px) {
                    .cart-container { grid-template-columns: 1fr; }
                    .total-pill-card { position: static; margin-bottom: 30px; order: -1; }
                }
            `}</style>
        </div>
    );
};

export default Cart;