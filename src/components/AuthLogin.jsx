import React, { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, sendPasswordResetEmail } from 'firebase/auth';
import { auth, googleProvider } from '../utils/firebase';

const LOGO_URL = "https://raw.githubusercontent.com/lengkongandreuw/voxsocial/main/assets/vsllogo.png";

export default function AuthLogin({ setView }) {
    const [showEmailForm, setShowEmailForm] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';

    // Helper to sync user to backend after successful Firebase login
    const syncToBackend = async (user) => {
        try {
            const token = await user.getIdToken();
            const res = await fetch(`${API_BASE}/auth/sync`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (res.ok) {
                localStorage.setItem('auth_token', token);
                if (setView) setView('landing');
            } else {
                console.warn("Backend sync failed, but user is logged in via Firebase.");
                localStorage.setItem('auth_token', token); // still log them in
                if (setView) setView('landing');
            }
        } catch (err) {
            console.error("Sync error:", err);
            // Still proceed
            if (setView) setView('landing');
        }
    };

    const handleGoogleLogin = async () => {
        setIsLoading(true);
        setError('');
        try {
            const result = await signInWithPopup(auth, googleProvider);
            await syncToBackend(result.user);
        } catch (err) {
            setError(err.message || 'Google Login Failed');
            setIsLoading(false);
        }
    };

    const handleEmailAuth = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            setError('Please enter both email and password.');
            return;
        }

        setIsLoading(true);
        setError('');
        setSuccessMessage('');

        try {
            let userCredential;
            if (isRegistering) {
                userCredential = await createUserWithEmailAndPassword(auth, email, password);
                setSuccessMessage('Account created successfully! Logging you in...');
            } else {
                userCredential = await signInWithEmailAndPassword(auth, email, password);
            }
            await syncToBackend(userCredential.user);
        } catch (err) {
            // Provide more user-friendly messages for common Firebase errors
            if (err.code === 'auth/email-already-in-use') {
                setError('Email is already registered. Please sign in instead.');
            } else if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
                setError('Invalid email or password.');
            } else {
                setError(err.message);
            }
            setIsLoading(false);
        }
    };

    const handleForgotPassword = async () => {
        if (!email) {
            setError("Please enter your email address first to reset password.");
            return;
        }
        setIsLoading(true);
        setError('');
        try {
            await sendPasswordResetEmail(auth, email);
            setSuccessMessage("Password reset email sent! Please check your inbox.");
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#06021c] cyber-grid-bg relative overflow-hidden">
            {/* Background glowing orbs */}
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#00E676]/10 blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[#ff7b1a]/10 blur-[120px] pointer-events-none"></div>

            <div className="w-full max-w-[1100px] min-h-[700px] flex mx-4 md:mx-8 rounded-[40px] overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] z-10 animate-fade-in-up bg-[#0c0735]/80 backdrop-blur-xl relative">

                {/* Left Side: Branding & Presentation (Hidden on mobile) */}
                <div className="hidden lg:flex flex-col justify-between w-1/2 p-12 relative overflow-hidden bg-gradient-to-br from-[#120a45]/90 to-[#06021c]/90 border-r border-white/5">
                    <div className="absolute inset-0 cyber-grid-bg opacity-20"></div>
                    <div className="absolute top-[20%] right-[-10%] w-64 h-64 bg-[#00E676]/20 blur-[80px] rounded-full"></div>
                    <div className="absolute bottom-[-10%] left-[-10%] w-64 h-64 bg-[#ff7b1a]/20 blur-[80px] rounded-full"></div>

                    <div className="relative z-10 flex items-center gap-3">
                        <img src={LOGO_URL} alt="Logo" className="w-10 h-10 object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]" />
                        <span className="text-white font-black text-2xl tracking-tight">VOXLUMEDIA</span>
                    </div>

                    <div className="relative z-10 flex-grow flex flex-col justify-center mt-12">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 w-max mb-6">
                            <span className="w-2 h-2 rounded-full bg-[#00E676] animate-pulse"></span>
                            <span className="text-xs font-bold text-white/80 uppercase tracking-widest">AI-Powered Audit</span>
                        </div>
                        <h1 className="text-5xl font-black text-white leading-tight mb-6 drop-shadow-lg">
                            Analyze. <br /> Optimize. <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E676] to-[#00C853]">Dominate.</span>
                        </h1>
                        <p className="text-white/60 text-lg font-medium max-w-sm leading-relaxed">
                            Join thousands of creators and businesses using VoxSocial to unlock their profile's true growth potential.
                        </p>
                    </div>

                    {/* Simple Tagline */}
                    <div className="relative z-10 mt-auto">
                        <div className="flex items-center gap-2 text-white/40 text-sm font-medium">
                            <i className="fa-solid fa-bolt text-[#00E676]/70 text-xs"></i>
                            <span>Advanced Profile Insights</span>
                        </div>
                    </div>
                </div>

                {/* Right Side: Auth Form */}
                <div className="w-full lg:w-1/2 p-8 sm:p-16 flex flex-col justify-center relative bg-[#06021c]/40">

                    {/* Header Section for Mobile (since left side is hidden) */}
                    <div className="flex flex-col items-center mb-10 lg:items-start lg:text-left">
                        <div className="w-16 h-16 rounded-2xl overflow-hidden flex items-center justify-center mb-6 bg-white/5 border border-white/10 shadow-lg lg:hidden">
                            <img src={LOGO_URL} className="w-10 h-10 object-contain" alt="VoxSocial Logo" />
                        </div>
                        <h2 className="text-3xl font-black text-white tracking-tight mb-2">Welcome Back</h2>
                        <p className="text-sm font-semibold text-white/50">Sign in to continue to VoxSocial & VoxSEO Audit</p>
                    </div>

                    <div className="w-full max-w-sm mx-auto lg:mx-0">
                        {/* Error & Success Messages */}
                        {error && (
                            <div className="mb-6 bg-rose-500/10 border border-rose-500/20 text-rose-400 px-4 py-3 rounded-xl text-xs font-bold text-left flex items-center gap-3 animate-fade-in-up">
                                <i className="fa-solid fa-circle-exclamation text-lg"></i>
                                {error}
                            </div>
                        )}
                        {successMessage && (
                            <div className="mb-6 bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-3 rounded-xl text-xs font-bold text-left flex items-center gap-3 animate-fade-in-up">
                                <i className="fa-solid fa-circle-check text-lg"></i>
                                {successMessage}
                            </div>
                        )}

                        {/* Primary OAuth Action */}
                        {!showEmailForm && (
                            <button
                                onClick={handleGoogleLogin}
                                disabled={isLoading}
                                className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-100 text-[#06021c] font-extrabold px-6 py-4 rounded-xl transition-all shadow-md hover:shadow-lg active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed mb-6 group"
                            >
                                {isLoading ? (
                                    <i className="fa-solid fa-spinner fa-spin text-lg"></i>
                                ) : (
                                    <div className="w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-white transition-colors">
                                        <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-4 h-4" />
                                    </div>
                                )}
                                <span>{isLoading ? 'Authenticating...' : 'Continue with Google'}</span>
                            </button>
                        )}

                        {/* Divider */}
                        <div className="flex items-center gap-4 mb-6">
                            <div className="h-px bg-white/10 flex-1"></div>
                            <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">OR</span>
                            <div className="h-px bg-white/10 flex-1"></div>
                        </div>

                        {/* Email Login Form Toggle */}
                        {!showEmailForm ? (
                            <button
                                onClick={() => {
                                    setShowEmailForm(true);
                                    setIsRegistering(false);
                                }}
                                className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold px-6 py-4 rounded-xl transition-all active:scale-95 mb-3"
                            >
                                <i className="fa-regular fa-envelope"></i>
                                <span>Continue with Email</span>
                            </button>
                        ) : (
                            <form onSubmit={handleEmailAuth} className="space-y-5 animate-fade-in">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-white/60 uppercase tracking-wider pl-1">Email Address</label>
                                    <div className="relative">
                                        <i className="fa-regular fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-white/30"></i>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="name@company.com"
                                            disabled={isLoading}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl text-white text-sm pl-11 pr-4 py-3.5 focus:outline-none focus:border-[#00E676]/50 focus:bg-white/10 focus:shadow-[0_0_15px_rgba(0,230,118,0.1)] transition-all placeholder-white/20"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-white/60 uppercase tracking-wider pl-1">Password</label>
                                    <div className="relative">
                                        <i className="fa-solid fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-white/30"></i>
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="••••••••"
                                            disabled={isLoading}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl text-white text-sm pl-11 pr-4 py-3.5 focus:outline-none focus:border-[#00E676]/50 focus:bg-white/10 focus:shadow-[0_0_15px_rgba(0,230,118,0.1)] transition-all placeholder-white/20"
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-between items-center pb-2">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsRegistering(!isRegistering);
                                            setError('');
                                            setSuccessMessage('');
                                        }}
                                        className="text-[10px] font-bold text-white/50 hover:text-white transition-colors"
                                    >
                                        {isRegistering ? 'Already have an account?' : 'Need an account?'}
                                    </button>
                                    {!isRegistering && (
                                        <button type="button" onClick={handleForgotPassword} className="text-[10px] font-bold text-[#00E676] hover:text-[#00C853] transition-colors">
                                            Forgot password?
                                        </button>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full flex items-center justify-center gap-2 bg-[#00E676] hover:bg-[#00C853] text-[#06021c] font-black px-6 py-4 rounded-xl transition-all shadow-[0_4px_15px_rgba(0,230,118,0.3)] hover:shadow-[0_6px_22px_rgba(0,230,118,0.5)] active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {isLoading && showEmailForm ? (
                                        <i className="fa-solid fa-spinner fa-spin"></i>
                                    ) : (
                                        <span>{isRegistering ? 'Create Account' : 'Sign In'}</span>
                                    )}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowEmailForm(false);
                                        setError('');
                                    }}
                                    disabled={isLoading}
                                    className="w-full text-[11px] font-bold text-white/40 hover:text-white/80 transition-colors py-2 mt-2"
                                >
                                    &larr; Back to all login options
                                </button>
                            </form>
                        )}
                    </div>

                    {/* Footer Info */}
                    <p className="text-center text-[10px] font-semibold text-white/30 mt-auto pt-8">
                        By continuing, you agree to <span className="text-[#00E676] font-black tracking-wide">Voxlumedia™</span> <br />
                        <a href="https://voxlumedia.com/voxlumedia-terms-conditions/" target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-[#00E676] transition-colors underline decoration-white/20 hover:decoration-[#00E676]/50">Terms of Service</a> and <a href="https://voxlumedia.com/voxlumedia-privacy-policy/" target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-[#00E676] transition-colors underline decoration-white/20 hover:decoration-[#00E676]/50">Privacy Policy</a>.
                    </p>
                </div>
            </div>
        </div>
    );
}
