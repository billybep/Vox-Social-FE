export const playSynthTick = (frequency = 600, type = 'sine', duration = 0.05, volume = 0.05) => {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        osc.type = type;
        osc.frequency.value = frequency;
        gainNode.gain.setValueAtTime(volume, ctx.currentTime);
        // Efek penurunan volume cepat ala mesin retro-futuristik
        gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
        
        osc.connect(gainNode);
        gainNode.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + duration);
    } catch (e) {
        // Gagal memutar audio diabaikan (karena kebijakan autoplay browser)
    }
};
