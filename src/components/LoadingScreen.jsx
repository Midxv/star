// src/components/LoadingScreen.jsx
import React from 'react';

const LoadingScreen = () => {
    return (
        <div className="loader-container">
            <div className="netflix-n">
                <div className="left-stroke"></div>
                <div className="mid-stroke"></div>
                <div className="right-stroke"></div>
            </div>
            <style jsx>{`
                .loader-container {
                    position: fixed;
                    top: 0; left: 0; width: 100vw; height: 100vh;
                    background: #01362F;
                    z-index: 9999;
                    display: flex; align-items: center; justify-content: center;
                }

                .netflix-n {
                    width: 40px;
                    height: 80px;
                    position: relative;
                    animation: fadeOut 0.5s ease-out 2.5s forwards;
                }

                /* SHARED STROKE STYLES */
                .left-stroke, .right-stroke, .mid-stroke {
                    position: absolute;
                    background: #E50914; /* Netflix Red */
                    width: 14px;
                    height: 100%;
                    box-shadow: 0 0 20px rgba(229, 9, 20, 0.5);
                }

                .left-stroke {
                    left: 0;
                    transform-origin: bottom;
                    animation: riseUp 0.6s cubic-bezier(0.19, 1, 0.22, 1) forwards;
                }

                .right-stroke {
                    right: 0;
                    transform-origin: bottom;
                    animation: riseUp 0.6s cubic-bezier(0.19, 1, 0.22, 1) 0.6s forwards;
                    opacity: 0; /* Starts hidden */
                }

                .mid-stroke {
                    width: 15px; /* Slightly wider for diagonal */
                    left: 12px;
                    background: #B20710; /* Darker red for depth */
                    transform-origin: top;
                    transform: skewX(-20deg) scaleY(0);
                    animation: slashDown 0.6s cubic-bezier(0.19, 1, 0.22, 1) 0.3s forwards;
                    z-index: 2;
                }

                @keyframes riseUp {
                    0% { transform: scaleY(0); opacity: 1; }
                    100% { transform: scaleY(1); opacity: 1; }
                }

                @keyframes slashDown {
                    0% { transform: skewX(-20deg) scaleY(0); }
                    100% { transform: skewX(-20deg) scaleY(1); }
                }
                
                @keyframes fadeOut {
                    to { opacity: 0; transform: scale(1.5); }
                }
            `}</style>
        </div>
    );
};

export default LoadingScreen;