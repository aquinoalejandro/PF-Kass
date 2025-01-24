import React, { useState, useEffect } from "react";

const Kass = () => {
    const [destroyed, setDestroyed] = useState(false);
    const [timeLeft, setTimeLeft] = useState(30);
    const [score, setScore] = useState(0);
    const [highscore, setHighscore] = useState(Number(localStorage.getItem("highscore")) || 0);
    const [gameEnded, setGameEnded] = useState(false);

    useEffect(() => {
        let timer;
        let scoreInterval;
        let checkGameEndInterval;

        if (destroyed && !gameEnded) {
            timer = setInterval(() => {
                setTimeLeft((prevTimeLeft) => {
                    if (prevTimeLeft <= 1) {
                        setGameEnded(true);
                        return 0;
                    }
                    return prevTimeLeft - 1;
                });
            }, 1000);

            scoreInterval = setInterval(() => {
                if (window.KICKASSGAME && window.KICKASSGAME.menuManager) {
                    const currentScore = window.KICKASSGAME.menuManager.numPoints;
                    setScore(currentScore);
                    if (currentScore > highscore) {
                        setHighscore(currentScore);
                    }
                }
            }, 100);

            // Check if all elements are destroyed
            checkGameEndInterval = setInterval(() => {
                if (window.KICKASSGAME && window.KICKASSGAME.bulletManager) {
                    if (window.KICKASSGAME.bulletManager.enemyIndex.length === 0) {
                        localStorage.setItem("highscore", highscore);
                        window.location.reload();
                    }
                }
            }, 1000);
        }

        return () => {
            clearInterval(timer);
            clearInterval(scoreInterval);
            clearInterval(checkGameEndInterval);
        };
    }, [destroyed, gameEnded, highscore]);

    const handleDestroy = () => {
        if (destroyed) {
            return;
        }

        // Remove any existing game instances
        if (window.KICKASSGAME) {
            try {
                window.KICKASSGAME.destroy();
            } catch (e) {
                console.log("Game already destroyed");
            }
        }

        // Remove any existing scripts
        const existingScript = document.querySelector('script[src*="kickass-mysite.js"]');
        if (existingScript && existingScript.parentNode) {
            existingScript.parentNode.removeChild(existingScript);
        }

        setDestroyed(true);

        const script = document.createElement("script");
        script.src = "//hi.kickassapp.com/kickass-mysite.js";
        script.onload = () => {
            console.log("Script loaded");
        };
        document.body.appendChild(script);
    };

    const handlePlayAgain = () => {
        localStorage.setItem("highscore", highscore);
        window.location.reload();
    };

    return (
        <div>
            <button 
                onClick={handleDestroy}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
                Bored?
            </button>
            {destroyed && (
                <div className="fixed inset-0 flex items-center justify-center">
                    <div className="bg-black bg-opacity-50 p-4 rounded text-white text-center">
                        {gameEnded ? (
                            <div className="space-y-4">
                                <h2 className="text-3xl font-bold mb-4">
                                    {timeLeft === 0 ? "Time's Up!" : "You destroyed everything!"}
                                </h2>
                                <div className="text-2xl font-bold">
                                    Final Score: {score}
                                </div>
                                <div className="text-2xl font-bold">
                                    Highscore: {highscore}
                                </div>
                                <button
                                    onClick={handlePlayAgain}
                                    className="mt-4 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                                >
                                    Play Again
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="text-2xl font-bold mb-2">
                                    Score: {score}
                                </div>
                                <div className="text-2xl font-bold mb-2">
                                    Highscore: {highscore}
                                </div>
                                <div className="text-xl">
                                    Time left: {timeLeft}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Kass;