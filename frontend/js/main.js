// Enhanced animations for flow steps
document.addEventListener('DOMContentLoaded', () => {
    // Pulse animation for AI container
    const aiPulse = document.querySelector('.ai-pulse');
    
    setInterval(() => {
        aiPulse.style.transform = 'scale(1.05)';
        setTimeout(() => {
            aiPulse.style.transform = 'scale(1)';
        }, 500);
    }, 3000);
    
    // Floating animation for features
    const features = document.querySelectorAll('.feature');
    features.forEach((feature, index) => {
        feature.style.animation = `float 3s ease-in-out ${index * 0.2}s infinite alternate`;
    });
    
    // Add CSS for float animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes float {
            0% { transform: translateY(0px); }
            100% { transform: translateY(-10px); }
        }
        
        .feature {
            animation-play-state: paused;
        }
        
        .feature:hover {
            animation-play-state: running;
        }
    `;
    document.head.appendChild(style);
    
    // Glowing effect for primary button
    const primaryBtn = document.querySelector('.btn-primary');
    setInterval(() => {
        primaryBtn.style.boxShadow = '0 4px 20px rgba(37, 99, 235, 0.6)';
        setTimeout(() => {
            primaryBtn.style.boxShadow = '0 4px 15px rgba(37, 99, 235, 0.3)';
        }, 1000);
    }, 5000);
    
    // Language selector animation
    const langSelect = document.getElementById('languageSelect');
    langSelect.addEventListener('focus', () => {
        langSelect.style.transform = 'scale(1.05)';
    });
    
    langSelect.addEventListener('blur', () => {
        langSelect.style.transform = 'scale(1)';
    });
});