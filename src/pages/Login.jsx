// src/pages/Login.jsx
import React, { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebaseConfig';
import { doc, setDoc, getDoc, collection, addDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

const Login = () => {
    const [isRegistering, setIsRegistering] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // --- DATABASE & PRELOAD LOGIC (StarCard Version) ---
    const createUserDocument = async (user) => {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        // Only run this for NEW users
        if (!userSnap.exists()) {
            // 1. Create Main User Doc
            await setDoc(userRef, {
                email: user.email,
                balance: 0.00,
                createdAt: new Date()
            });

            // 2. Pre-fill Inventory with 5 HIDDEN Mock Cards
            const inventoryRef = collection(db, "users", user.uid, "orders"); // Using "orders" collection for StarCard

            for (let i = 1; i <= 5; i++) {
                // Generate Mock Card Data
                const expiry = new Date();
                expiry.setDate(expiry.getDate() + 365); // 1 year expiry

                await addDoc(inventoryRef, {
                    type: i % 2 === 0 ? "MASTERCARD" : "VISA",
                    cardName: "STARCARD USER",
                    cardNumber: `4532${Math.floor(Math.random() * 1000000000000)}`,
                    expiry: "12/28",
                    cvv: "123",
                    address: "123 Cyberpunk Ave, Neo Tokyo",
                    isPurchased: false // <--- HIDDEN BY DEFAULT (Change to true in Console)
                });
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            if (isRegistering) {
                // Sign Up
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                await createUserDocument(userCredential.user);
            } else {
                // Sign In
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                await createUserDocument(userCredential.user); // Check/Ensure DB exists on login too
            }
            navigate('/'); // Redirect to Dashboard
        } catch (err) {
            setError(err.message.replace('Firebase: ', ''));
        }
    };

    return (
        <div className="login-container">

            {/* 1. HUGE FASHIONABLE LOGO */}
            <h1 className="brand-header-big">
                Star<span className="gradient-text">Card</span>
            </h1>

            <div className="login-box animate-fade-in">
                <h2 className="welcome-title">
                    {isRegistering ? 'Initialize Wallet' : 'Access Terminal'}
                </h2>
                <p className="login-subtitle">
                    {isRegistering ? 'Secure decentralized marketplace access.' : 'Welcome back, operative.'}
                </p>

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="input-group">
                        <label>Email Access</label>
                        <input
                            type="email"
                            placeholder="user@starcard.io"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="modern-input"
                        />
                    </div>

                    <div className="input-group">
                        <label>Security Key</label>
                        <div className="password-wrapper">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="modern-input"
                            />
                            <button type="button" className="eye-btn" onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? <EyeOff size={22} color="#666"/> : <Eye size={22} color="#666"/>}
                            </button>
                        </div>
                    </div>

                    {error && <div className="error-msg">{error}</div>}

                    <button type="submit" className="login-btn">
                        {isRegistering ? 'INITIALIZE ACCOUNT' : 'AUTHENTICATE'}
                    </button>
                </form>

                <div className="toggle-auth">
                    <p onClick={() => setIsRegistering(!isRegistering)}>
                        {isRegistering ? 'Already have an ID? Login' : 'Need an account? Initialize'}
                    </p>
                </div>
            </div>

            <style jsx>{`
                .login-container {
                    min-height: 100vh;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    background: #050505;
                    background-image: radial-gradient(circle at 50% 0%, #1a0505 0%, #050505 70%);
                    padding: 20px;
                }

                /* HUGE LOGO STYLE */
                .brand-header-big {
                    font-size: 84px;
                    font-weight: 900;
                    color: white;
                    letter-spacing: -3px;
                    margin: 0 0 50px 0;
                    text-align: center;
                    line-height: 1;
                    text-shadow: 0 10px 30px rgba(0,0,0,0.5);
                }

                .gradient-text {
                    background: linear-gradient(135deg, #ff2a2a 0%, #990000 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    text-shadow: 0 0 30px rgba(255, 42, 42, 0.3);
                }

                /* BIGGER CARD */
                .login-box {
                    width: 100%;
                    max-width: 540px; /* Wider */
                    padding: 50px;    /* More padding */
                    background: rgba(15, 15, 18, 0.8);
                    backdrop-filter: blur(20px);
                    border: 1px solid #222;
                    border-radius: 24px;
                    box-shadow: 0 20px 60px rgba(0,0,0,0.6);
                }

                .welcome-title { font-size: 28px; font-weight: 800; color: white; margin: 0 0 10px 0; text-align: center; letter-spacing: -0.5px; }
                .login-subtitle { text-align: center; color: #888; margin-bottom: 40px; font-size: 1rem; }

                .input-group { margin-bottom: 24px; }
                .input-group label {
                    display: block; color: #888; font-size: 0.8rem; text-transform: uppercase;
                    letter-spacing: 1px; margin-bottom: 10px; font-weight: 700;
                }

                .modern-input {
                    width: 100%; padding: 18px 20px; /* Taller inputs */
                    background: #0a0a0a; border: 1px solid #333; border-radius: 12px;
                    color: white; outline: none; font-size: 16px; transition: 0.3s;
                }
                .modern-input:focus { border-color: #ff2a2a; box-shadow: 0 0 0 4px rgba(255, 42, 42, 0.1); }

                .password-wrapper { position: relative; }
                .eye-btn { position: absolute; right: 18px; top: 50%; transform: translateY(-50%); background: none; border: none; padding: 0; cursor: pointer; }

                .login-btn {
                    width: 100%; padding: 20px; /* Bigger button */
                    background: #ff2a2a; color: white; border: none; border-radius: 12px;
                    font-weight: 800; font-size: 16px; letter-spacing: 1px; margin-top: 10px;
                    transition: 0.3s; cursor: pointer; box-shadow: 0 10px 30px rgba(255, 42, 42, 0.2);
                }
                .login-btn:hover { background: #d92020; transform: translateY(-2px); box-shadow: 0 15px 40px rgba(255, 42, 42, 0.3); }

                .toggle-auth { text-align: center; margin-top: 30px; font-size: 0.9rem; color: #666; cursor: pointer; transition: 0.2s; }
                .toggle-auth p:hover { color: #ff2a2a; text-decoration: underline; }

                .error-msg {
                    color: #ff2a2a; font-size: 0.9rem; margin-bottom: 20px; text-align: center;
                    background: rgba(255, 42, 42, 0.1); padding: 15px; border-radius: 8px; border: 1px solid rgba(255, 42, 42, 0.2);
                }

                .animate-fade-in { animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
                @keyframes fadeIn { from { opacity:0; transform: translateY(40px) scale(0.95); } to { opacity:1; transform: translateY(0) scale(1); }}

                @media (max-width: 600px) {
                    .brand-header-big { font-size: 56px; margin-bottom: 30px; }
                    .login-box { padding: 30px; }
                }
            `}</style>
        </div>
    );
};

export default Login;