import React from 'react';

export default function LoadingSection({ currentStep, steps }) {
    const progressPercentage = Math.round(((currentStep + 1) / steps.length) * 100);

    return (
        <div className="min-h-screen bg-[#06021c] flex flex-col items-center justify-center p-6 relative z-10">
            <div className="max-w-md w-full solid-glassmorphic p-10 rounded-3xl text-center space-y-8 animate-fade-in-up">
                
                <div className="relative w-28 h-28 mx-auto">
                    <div className="absolute inset-0 rounded-full border-4 border-white/5"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-t-[#ff7b1a] border-r-pink-500 animate-spin"></div>
                    <div className="absolute inset-2 flex items-center justify-center bg-[#0d0735] rounded-full">
                        <i className="fa-solid fa-robot text-[#ff7b1a] text-3xl animate-pulse"></i>
                    </div>
                </div>

                <div>
                    <h2 className="text-2xl font-black text-white mb-2">Analyzing Profile</h2>
                    <p className="text-white/70 font-medium text-sm">
                        Extracting public insights via Vox AI...
                    </p>
                </div>

                <div className="space-y-3">
                    <div className="flex justify-between text-xs font-bold text-white/50">
                        <span>PROGRESS</span>
                        <span className="text-[#ff7b1a]">{progressPercentage}%</span>
                    </div>
                    <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden border border-white/5">
                        <div 
                            className="bg-[#ff7b1a] h-full rounded-full transition-all duration-500 ease-out" 
                            style={{ width: `${progressPercentage}%` }}
                        ></div>
                    </div>
                    
                    <div className="pt-3 text-xs font-bold text-white/90 h-8 flex items-center justify-center">
                        <span className="animate-pulse">{steps[currentStep]}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
