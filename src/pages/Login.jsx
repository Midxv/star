import React, { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebaseConfig';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [isRegistering, setIsRegistering] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            if (isRegistering) {
                // 1. Create Auth User
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;

                // 2. Create Firestore Document for Wallet
                await setDoc(doc(db, "users", user.uid), {
                    email: user.email,
                    balance: 0.00, // Initial Wallet Balance
                    createdAt: new Date()
                });

                // 3. Create a placeholder in orders collection (Optional, helps visualiztion in Console)
                // We won't add a dummy card via code, you will do it manually in console as requested.

            } else {
                // Sign In
                await signInWithEmailAndPassword(auth, email, password);
            }
            navigate('/'); // Redirect to Dashboard
        } catch (err) {
            setError(err.message.replace('Firebase: ', ''));
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h1 className="logo text-center">
                    Star<span>Card</span>
                </h1>
                <p className="login-subtitle">
                    {isRegistering ? 'Initialize your secure wallet' : 'Access your marketplace terminal'}
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
                        />
                    </div>

                    <div className="input-group">
                        <label>Security Key</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
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
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #050505;
          background-image: radial-gradient(circle at 50% 0%, #1a0505 0%, #050505 70%);
        }
        .login-box {
          width: 100%;
          max-width: 420px;
          padding: 40px;
          background: rgba(15, 15, 18, 0.6);
          backdrop-filter: blur(20px);
          border: 1px solid #222;
          border-radius: 16px;
          box-shadow: 0 0 40px rgba(0,0,0,0.5);
        }
        .text-center { text-align: center; margin-left: 0; }
        .login-subtitle {
          text-align: center;
          color: #666;
          margin-bottom: 30px;
          font-size: 0.9rem;
        }
        .input-group { margin-bottom: 20px; }
        .input-group label {
          display: block;
          color: #888;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 8px;
        }
        .input-group input {
          width: 100%;
          padding: 14px;
          background: #0a0a0a;
          border: 1px solid #333;
          border-radius: 6px;
          color: white;
          outline: none;
          transition: 0.3s;
        }
        .input-group input:focus {
          border-color: #ff2a2a;
          box-shadow: 0 0 15px rgba(255, 42, 42, 0.1);
        }
        .login-btn {
          width: 100%;
          padding: 14px;
          background: #ff2a2a;
          color: white;
          border: none;
          border-radius: 6px;
          font-weight: 800;
          letter-spacing: 1px;
          margin-top: 10px;
          transition: 0.3s;
        }
        .login-btn:hover {
          background: #d92020;
          box-shadow: 0 0 20px rgba(255, 42, 42, 0.3);
        }
        .toggle-auth {
          text-align: center;
          margin-top: 20px;
          font-size: 0.85rem;
          color: #666;
          cursor: pointer;
        }
        .toggle-auth p:hover { color: #ff2a2a; }
        .error-msg {
          color: #ff2a2a;
          font-size: 0.8rem;
          margin-bottom: 15px;
          text-align: center;
          background: rgba(255, 42, 42, 0.1);
          padding: 10px;
          border-radius: 4px;
        }
      `}</style>
        </div>
    );
};

export default Login;