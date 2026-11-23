import React, { useState } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  sendPasswordResetEmail 
} from 'firebase/auth';
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
  const [inviteExpired, setInviteExpired] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

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
      localStorage.setItem('auth_token', token);
      if (setView) setView('dashboard');
    } catch (err) {
      console.warn("Backend sync fallback, proceeding with Firebase session:", err);
      if (setView) setView('dashboard');
    }
  };

  const handleGoogleLogin = async () => {
    if (inviteExpired) return;
    setIsLoading(true);
    setError('');
    try {
      const result = await signInWithPopup(auth, googleProvider);
      await syncToBackend(result.user);
    } catch (err) {
      setError(err.message || 'Google SSO authentication failed.');
      setIsLoading(false);
    }
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    if (inviteExpired) return;

    if (!email || !password) {
      setError('Please provide both your professional email and password.');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      let userCredential;
      if (isRegistering) {
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
        setSuccessMessage('Workspace account created successfully! Synchronizing...');
      } else {
        userCredential = await signInWithEmailAndPassword(auth, email, password);
      }
      await syncToBackend(userCredential.user);
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        setError('An account with this email already exists. Please sign in instead.');
      } else if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        setError('Invalid email or password credentials. Please verify and try again.');
      } else if (err.code === 'auth/weak-password') {
        setError('Password must contain at least 6 characters.');
      } else {
        setError(err.message || 'Authentication failed. Please try again.');
      }
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError("Please enter your work email address first to receive a password reset link.");
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      await sendPasswordResetEmail(auth, email);
      setSuccessMessage("Password reset instructions sent! Please check your inbox.");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0B10] cyber-grid-bg relative p-4 sm:p-6 overflow-hidden">
      
      {/* Background ambient accents (Dark Brand Shell) */}
      <div className="absolute top-[-10%] start-[-5%] w-96 h-96 rounded-full bg-[#00e5ff]/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] end-[-5%] w-96 h-96 rounded-full bg-[#7c3aed]/10 blur-[140px] pointer-events-none" />

      {/* Split-Card Container */}
      <div className="w-full max-w-5xl rounded-3xl bg-[#0F111D] border border-[#1E2235] shadow-2xl overflow-hidden flex flex-col lg:flex-row relative z-10">
        
        {/* LEFT PANEL: Four-Pillar Growth Intelligence Pitch */}
        <div className="w-full lg:w-1/2 p-8 sm:p-12 bg-gradient-to-br from-[#121424] via-[#0F111D] to-[#0A0B10] border-b lg:border-b-0 lg:border-r border-[#1E2235] flex flex-col justify-between relative overflow-hidden">
          
          {/* Subtle decorative grid overlay */}
          <div className="absolute inset-0 cyber-grid-bg opacity-30 pointer-events-none"></div>

          {/* Top Brand Identity */}
          <div className="relative z-10 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-brand-v flex items-center justify-center shadow-[0_0_15px_rgba(0,229,255,0.3)]">
              <span className="text-white font-black text-xl tracking-tighter">V</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-white font-black text-lg tracking-tight">VOXAUDIT</span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase bg-[#00e5ff]/15 border border-[#00e5ff]/30 text-[#00e5ff]">
                  INTELLIGENCE
                </span>
              </div>
              <span className="text-slate-400 text-[10px] font-semibold tracking-wider uppercase block">
                by Voxlumedia · Four-Pillar Platform
              </span>
            </div>
          </div>

          {/* Pitch & Four Pillars */}
          <div className="relative z-10 my-8 sm:my-12">
            <span className="text-[11px] font-bold tracking-wider text-[#00e5ff] uppercase block mb-2 font-mono">
              UNIFIED AUDIT ENGINE
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight tracking-tight mb-4 font-display">
              Four pillars. One audit.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00e5ff] via-[#0094ea] to-[#cf41b2]">
                Actionable digital growth.
              </span>
            </h1>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Replace fragmented SEO and social tools with a unified growth intelligence platform built for agencies, consultants, and ambitious businesses.
            </p>

            {/* 4 Pillars Mini-Matrix */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
                <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-[11px]">
                  <i className="fa-solid fa-magnifying-glass text-[10px]"></i>
                  <span>1. VoxSEO</span>
                </div>
                <p className="text-slate-400 text-[10px] leading-tight">51-point technical crawl & organic search health.</p>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
                <div className="flex items-center gap-1.5 text-pink-400 font-bold text-[11px]">
                  <i className="fa-brands fa-instagram text-[10px]"></i>
                  <span>2. VoxSocial</span>
                </div>
                <p className="text-slate-400 text-[10px] leading-tight">Gemini AI multimodal profile clarity & trust proof.</p>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
                <div className="flex items-center gap-1.5 text-[#cf41b2] font-bold text-[11px]">
                  <i className="fa-solid fa-brain text-[10px]"></i>
                  <span>3. VoxAI Visibility</span>
                </div>
                <p className="text-slate-400 text-[10px] leading-tight">Perplexity & ChatGPT Search recommendation index.</p>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
                <div className="flex items-center gap-1.5 text-blue-400 font-bold text-[11px]">
                  <i className="fa-solid fa-arrow-trend-up text-[10px]"></i>
                  <span>4. Journey & CRO</span>
                </div>
                <p className="text-slate-400 text-[10px] leading-tight">Direct conversion friction & appointment booking analysis.</p>
              </div>
            </div>
          </div>

          {/* Footer note */}
          <div className="relative z-10 pt-4 border-t border-white/5 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Prepared for Agency White-Label & Client Portals</span>
            <span className="font-mono text-[#00e5ff]">Sprint 1 Release</span>
          </div>
        </div>

        {/* RIGHT PANEL: Auth Handlers & Sign-in Form */}
        <div className="w-full lg:w-1/2 p-8 sm:p-12 flex flex-col justify-center bg-[#0C0E18]">
          <div className="max-w-md w-full mx-auto">
            
            {/* Header */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white tracking-tight">
                {isRegistering ? "Create your workspace" : "Welcome back"}
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                {isRegistering 
                  ? "Start running multi-pillar digital health audits in minutes."
                  : "Sign in to access your client audits and growth roadmaps."
                }
              </p>
            </div>

            {/* Expired Invite Notice Simulation Toggle (For testing prototype state) */}
            {inviteExpired && (
              <div className="mb-6 p-4 rounded-xl bg-red-950/40 border border-red-800 text-red-200 text-xs space-y-2 animate-fade-in">
                <div className="flex items-center gap-2 font-bold text-red-300">
                  <i className="fa-solid fa-clock-rotate-left"></i>
                  <span>Workspace Invite Expired</span>
                </div>
                <p className="text-[11px] text-red-200/80 leading-relaxed">
                  This agency client invitation link expired after 14 days. Please contact your agency administrator to issue a refreshed portal link.
                </p>
                <button
                  type="button"
                  onClick={() => setInviteExpired(false)}
                  className="text-[11px] font-bold text-red-400 hover:text-red-300 underline"
                >
                  Return to normal sign-in
                </button>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium flex items-center gap-2.5 animate-fade-in">
                <i className="fa-solid fa-circle-exclamation shrink-0"></i>
                <span>{error}</span>
              </div>
            )}

            {/* Success Message */}
            {successMessage && (
              <div className="mb-6 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium flex items-center gap-2.5 animate-fade-in">
                <i className="fa-solid fa-circle-check shrink-0"></i>
                <span>{successMessage}</span>
              </div>
            )}

            {/* Primary Google SSO Action */}
            <button
              onClick={handleGoogleLogin}
              disabled={isLoading || inviteExpired}
              className="w-full py-3.5 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs transition-all shadow-md flex items-center justify-center gap-3 disabled:opacity-50 hover:scale-[1.01] active:scale-[0.99]"
            >
              {isLoading ? (
                <i className="fa-solid fa-circle-notch fa-spin text-slate-900 text-sm"></i>
              ) : (
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
              )}
              <span>Continue with Google Workspace</span>
            </button>

            {/* Divider */}
            <div className="flex items-center my-6">
              <div className="flex-grow border-t border-[#1E2235]"></div>
              <span className="px-3 text-[11px] font-mono text-slate-500 uppercase tracking-wider">
                or use work email
              </span>
              <div className="flex-grow border-t border-[#1E2235]"></div>
            </div>

            {/* Email Form */}
            <form onSubmit={handleEmailAuth} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1.5">Work Email</label>
                <div className="relative">
                  <i className="fa-regular fa-envelope absolute start-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs"></i>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full bg-[#121422] border border-[#1E2235] focus:border-[#0094ea] text-white rounded-xl ps-9 pe-4 py-3 font-medium outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-slate-300 font-semibold">Password</label>
                  {!isRegistering && (
                    <button
                      type="button"
                      onClick={handleForgotPassword}
                      className="text-[11px] text-[#00e5ff] hover:underline"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <i className="fa-solid fa-lock absolute start-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs"></i>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-[#121422] border border-[#1E2235] focus:border-[#0094ea] text-white rounded-xl ps-9 pe-4 py-3 font-medium outline-none transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || inviteExpired}
                className="w-full py-3 rounded-xl bg-[#0094ea] hover:bg-[#0081cc] text-white font-bold transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
              >
                {isLoading && <i className="fa-solid fa-circle-notch fa-spin text-xs"></i>}
                <span>{isRegistering ? "Register Workspace Account" : "Sign In to Platform"}</span>
              </button>
            </form>

            {/* Toggle Sign-in / Register */}
            <div className="mt-6 text-center text-xs text-slate-400">
              <span>{isRegistering ? "Already have a platform account?" : "Need a new workspace?"} </span>
              <button
                type="button"
                onClick={() => {
                  setIsRegistering(!isRegistering);
                  setError('');
                  setSuccessMessage('');
                }}
                className="text-[#00e5ff] hover:underline font-bold"
              >
                {isRegistering ? "Sign in" : "Create one now"}
              </button>
            </div>

            {/* Terms and Privacy notice */}
            <div className="mt-8 pt-4 border-t border-[#1E2235] text-center text-[11px] text-slate-500 leading-normal">
              By accessing VoxAudit Intelligence, you agree to our{' '}
              <button 
                onClick={() => setShowTermsModal(true)} 
                className="text-slate-400 underline hover:text-slate-300"
              >
                Terms of Service
              </button>{' '}
              and{' '}
              <button 
                onClick={() => setShowTermsModal(true)} 
                className="text-slate-400 underline hover:text-slate-300"
              >
                Agency White-Label Privacy Policy
              </button>.
            </div>

            {/* Prototype State Tester: Toggle Invite Expired */}
            <div className="mt-4 pt-2 text-center">
              <button
                type="button"
                onClick={() => setInviteExpired(!inviteExpired)}
                className="text-[10px] font-mono text-slate-600 hover:text-slate-400 transition-colors"
              >
                [Dev State Toggle: {inviteExpired ? "Reset to Valid Invite" : "Simulate Expired Invite"}]
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Terms & Privacy Modal */}
      {showTermsModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121422] border border-[#1E2235] rounded-3xl p-6 sm:p-8 max-w-lg w-full text-slate-300 text-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#1E2235] pb-3">
              <h4 className="text-base font-bold text-white">Terms & White-Label Privacy Policy</h4>
              <button
                onClick={() => setShowTermsModal(false)}
                className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <div className="space-y-3 max-h-72 overflow-y-auto pe-2 text-[11px] leading-relaxed text-slate-400">
              <p>
                <strong>Agency Data Ownership:</strong> Audits generated under Agency workspaces belong strictly to the subscribing agency tenant. Voxlumedia does not contact or solicit client accounts created by partner agencies.
              </p>
              <p>
                <strong>Methodology & Integrity Guarantee:</strong> In accordance with VA-Intelligence-Design standards, core audit methodologies and evidence tags (Measured, Connected, Estimated) remain verifiable and cannot be altered to produce false digital scores.
              </p>
              <p>
                <strong>Data Processing & Storage:</strong> Public profile information is gathered via authorized crawlers and multimodal AI engines. OAuth connections (e.g. Google Analytics) require explicit consent and may be revoked at any time.
              </p>
            </div>
            <button
              onClick={() => setShowTermsModal(false)}
              className="w-full py-2.5 rounded-xl bg-[#0094ea] text-white font-bold"
            >
              I Understand
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
