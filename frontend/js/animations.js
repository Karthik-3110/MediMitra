// Landing page animations
document.addEventListener('DOMContentLoaded', function() {
    // Animate flow steps
    const flowSteps = document.querySelectorAll('.flow-step');
    flowSteps.forEach((step, index) => {
        step.style.animationDelay = `${index * 0.5}s`;
    });

    // Language selector
    const languageSelect = document.getElementById('languageSelect');
    if (languageSelect) {
        languageSelect.addEventListener('change', function() {
            const selectedLanguage = this.value;
            // In a real application, you would implement language switching here
            alert(`Language changed to: ${this.options[this.selectedIndex].text}`);
            // You could use i18n or fetch language files here
        });
    }

    // Animate elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe all features
    document.querySelectorAll('.feature').forEach(feature => {
        observer.observe(feature);
    });

    // Add CSS for animation
    const style = document.createElement('style');
    style.textContent = `
        .feature {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.5s ease, transform 0.5s ease;
        }
        
        .feature.animate-in {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(style);
});

// AI Pulse animation enhancement
function createParticle() {
    const pulseContainer = document.querySelector('.ai-pulse');
    if (!pulseContainer) return;

    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.cssText = `
        position: absolute;
        width: 4px;
        height: 4px;
        background: var(--primary-color);
        border-radius: 50%;
        pointer-events: none;
    `;

    const angle = Math.random() * Math.PI * 2;
    const distance = 40 + Math.random() * 20;
    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance;

    particle.style.left = '50%';
    particle.style.top = '50%';
    particle.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`;

    pulseContainer.appendChild(particle);

    // Animate particle
    particle.animate([
        { opacity: 1, transform: `translate(-50%, -50%) translate(${x}px, ${y}px)` },
        { opacity: 0, transform: `translate(-50%, -50%) translate(${x * 1.5}px, ${y * 1.5}px)` }
    ], {
        duration: 1000 + Math.random() * 500,
        easing: 'ease-out'
    }).onfinish = () => {
        particle.remove();
    };
}

// Create particles periodically
if (document.querySelector('.ai-pulse')) {
    setInterval(createParticle, 300);
}