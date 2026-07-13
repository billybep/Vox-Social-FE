import React from 'react';

export default function LogoutModal({ isOpen, onConfirm, onCancel }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/60 backdrop-blur-md animate-fade-in"
                onClick={onCancel}
            ></div>

            {/* Modal Content */}
            <div className="relative w-full max-w-sm bg-[#0c0735] border border-white/10 p-6 sm:p-8 rounded-3xl shadow-[0_0_40px_rgba(0,0,0,0.5)] animate-fade-in-up overflow-hidden">
                {/* Decorative background glow */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-rose-500/20 blur-[60px] rounded-full pointer-events-none"></div>

                <div className="flex flex-col items-center text-center relative z-10">
                    <div className="w-14 h-14 bg-rose-500/10 border border-rose-500/20 rounded-full flex items-center justify-center mb-5 text-rose-400">
                        <i className="fa-solid fa-arrow-right-from-bracket text-xl"></i>
                    </div>
                    
                    <h3 className="text-xl font-black text-white mb-2 tracking-tight">Sign Out</h3>
                    <p className="text-sm font-semibold text-white/50 mb-8">
                        Are you sure you want to log out of your account? You will need to sign in again to access the dashboard.
                    </p>

                    <div className="flex items-center gap-3 w-full">
                        <button
                            onClick={onCancel}
                            className="flex-1 px-4 py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white font-bold text-sm transition-all active:scale-95"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            className="flex-1 px-4 py-3 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-sm shadow-[0_0_15px_rgba(244,63,94,0.3)] hover:shadow-[0_0_25px_rgba(244,63,94,0.5)] transition-all active:scale-95"
                        >
                            Yes, Log Out
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
