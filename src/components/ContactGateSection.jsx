import React, { useState } from 'react';

export default function ContactGateSection({ onSubmit }) {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        businessName: '',
        email: '',
        phone: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className="min-h-screen bg-[#06021c] flex flex-col items-center justify-center p-6 relative z-10">
            <div className="max-w-xl w-full solid-glassmorphic p-8 sm:p-12 rounded-[2.5rem] shadow-2xl relative overflow-hidden animate-fade-in-up">
                
                {/* Decorative Icon */}
                <div className="w-16 h-16 bg-white/5 border border-white/10 text-[#ff7b1a] rounded-full flex items-center justify-center mx-auto text-2xl mb-6 relative">
                    <i className="fa-solid fa-lock"></i>
                    <div className="absolute inset-0 rounded-full border border-[#ff7b1a]/30 animate-ping"></div>
                </div>

                <div className="text-center mb-8">
                    <h2 className="text-2xl sm:text-3xl font-black text-white mb-3">
                        Your audit is ready — enter your details to unlock your full results.
                    </h2>
                    <p className="text-white/60 font-medium text-sm sm:text-base max-w-md mx-auto">
                        We'll also email you a copy of your report with tips to improve your score. No spam, ever.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <input 
                            type="text" 
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            placeholder="First Name" 
                            required 
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-[#ff7b1a]/50 focus:bg-white/10 transition-colors"
                        />
                        <input 
                            type="text" 
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            placeholder="Last Name" 
                            required 
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-[#ff7b1a]/50 focus:bg-white/10 transition-colors"
                        />
                    </div>
                    <input 
                        type="text" 
                        name="businessName"
                        value={formData.businessName}
                        onChange={handleChange}
                        placeholder="Business Name" 
                        required 
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-[#ff7b1a]/50 focus:bg-white/10 transition-colors"
                    />
                    <input 
                        type="email" 
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Email Address" 
                        required 
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-[#ff7b1a]/50 focus:bg-white/10 transition-colors"
                    />
                    <input 
                        type="tel" 
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Phone Number" 
                        required 
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-[#ff7b1a]/50 focus:bg-white/10 transition-colors"
                    />

                    <div className="pt-4">
                        <button 
                            type="submit" 
                            className="w-full bg-[#ff7b1a] hover:bg-[#e06200] text-white font-black py-4 rounded-xl transition-all shadow-md text-lg hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
                        >
                            <i className="fa-solid fa-unlock-keyhole"></i> Unlock My Results &rarr;
                        </button>
                    </div>

                    <p className="text-center text-[11px] text-white/40 font-medium mt-4 pt-2">
                        By submitting, you agree to be contacted by Voxlumedia. We respect your privacy.
                    </p>
                </form>
            </div>
        </div>
    );
}
