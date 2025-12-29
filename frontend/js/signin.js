// DOM Ready
document.addEventListener('DOMContentLoaded', function() {
    // Initialize form
    initSigninForm();
    initPasswordToggle();
    initForgotPassword();
    initDemoCredentials();
});

// Initialize sign-in form
function initSigninForm() {
    const form = document.getElementById('signinForm');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const remember = document.getElementById('remember').checked;
        
        // Basic validation
        if (!email || !password) {
            showToast('Please fill in all fields', 'error');
            return;
        }
        
        // Email validation
        if (!isValidEmail(email)) {
            showToast('Please enter a valid email address', 'error');
            return;
        }
        
        // Simulate API call
        simulateSignin(email, password, remember);
    });
}

// Initialize password visibility toggle
function initPasswordToggle() {
    const toggleBtn = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');
    
    toggleBtn.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        
        // Toggle eye icon
        const icon = this.querySelector('i');
        icon.className = type === 'password' ? 'fas fa-eye' : 'fas fa-eye-slash';
    });
}

// Initialize forgot password
function initForgotPassword() {
    const forgotLink = document.getElementById('forgotPassword');
    
    forgotLink.addEventListener('click', function(e) {
        e.preventDefault();
        openForgotPasswordModal();
    });
}

// Initialize demo credentials
function initDemoCredentials() {
    // Auto-fill on click of demo credentials
    document.querySelectorAll('.use-demo-btn, .copy-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    });
}

// Open forgot password modal
function openForgotPasswordModal() {
    const modal = document.getElementById('forgotPasswordModal');
    modal.style.display = 'flex';
}

// Close modal
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = 'none';
}

// Send reset link
function sendResetLink() {
    const email = document.getElementById('resetEmail').value;
    
    if (!email || !isValidEmail(email)) {
        showToast('Please enter a valid email address', 'error');
        return;
    }
    
    // Simulate API call
    showToast('Reset link sent to your email', 'success');
    closeModal('forgotPasswordModal');
    
    // Reset form
    document.getElementById('resetEmail').value = '';
}

// Simulate sign-in process
function simulateSignin(email, password, remember) {
    // Show loading state
    const submitBtn = document.querySelector('.signin-btn');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>Signing in...</span>';
    submitBtn.disabled = true;
    
    // Simulate API delay
    setTimeout(() => {
        // Check for demo credentials
        if (email === 'demo@medimitra.com' && password === 'demo123') {
            showToast('Successfully signed in!', 'success');
            
            // Redirect to dashboard after delay
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1500);
        } else {
            // Simulate error for non-demo credentials
            showToast('Invalid email or password', 'error');
            
            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }, 1500);
}

// Use demo credentials
function useDemoCredentials() {
    document.getElementById('email').value = 'demo@medimitra.com';
    document.getElementById('password').value = 'demo123';
    document.getElementById('remember').checked = true;
    
    showToast('Demo credentials applied', 'info');
}

// Copy to clipboard
function copyToClipboard(elementId) {
    const element = document.getElementById(elementId);
    const text = element.textContent;
    
    navigator.clipboard.writeText(text).then(() => {
        // Show copied feedback
        const originalText = element.textContent;
        element.textContent = 'Copied!';
        element.style.color = '#4caf50';
        
        setTimeout(() => {
            element.textContent = originalText;
            element.style.color = '';
        }, 1500);
        
        showToast('Copied to clipboard', 'success');
    }).catch(err => {
        console.error('Failed to copy: ', err);
        showToast('Failed to copy', 'error');
    });
}

// Show toast notification
function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    
    // Clear any existing timeout
    if (toast.timeoutId) {
        clearTimeout(toast.timeoutId);
    }
    
    // Set message and type
    toast.textContent = message;
    toast.className = `toast ${type}`;
    
    // Show toast
    toast.style.display = 'flex';
    
    // Auto-hide after 3 seconds
    toast.timeoutId = setTimeout(() => {
        toast.style.display = 'none';
    }, 3000);
}

// Email validation
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Close modal when clicking outside
window.addEventListener('click', function(e) {
    const modal = document.getElementById('forgotPasswordModal');
    if (e.target === modal) {
        closeModal('forgotPasswordModal');
    }
});

// Handle Enter key in form
document.getElementById('email').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        document.getElementById('signinForm').dispatchEvent(new Event('submit'));
    }
});

document.getElementById('password').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        document.getElementById('signinForm').dispatchEvent(new Event('submit'));
    }
});