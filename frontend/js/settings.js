// User Data Storage
let userData = {
    firstName: 'Dr. Rajesh',
    lastName: 'Kumar',
    email: 'rajesh.kumar@medimitra.com',
    phone: '+91 9876543210',
    organization: 'Apollo Hospital',
    department: 'cardiology',
    bio: 'Senior Cardiologist with 15+ years of experience in cardiac care and medical coding.',
    role: 'Medical Director',
    avatar: null,
    theme: 'light',
    language: 'en',
    timezone: 'IST',
    dateFormat: 'DD/MM/YYYY',
    notifications: {
        email: {
            weeklyReports: true,
            claimUpdates: true,
            codingSuggestions: false,
            productUpdates: true
        },
        push: {
            realTimeAlerts: true,
            teamMessages: false,
            reminders: true
        },
        schedule: {
            quietStart: '22:00',
            quietEnd: '06:00',
            frequency: 'immediate'
        }
    },
    security: {
        twoFactorEnabled: true,
        twoFactorMethod: 'authenticator',
        sessions: []
    },
    preferences: {
        compactMode: false,
        animations: true,
        highContrast: false
    },
    privacy: {
        analytics: true,
        marketing: false,
        thirdPartySharing: false,
        profileVisibility: 'team',
        onlineStatus: true,
        dataRetention: 'never'
    }
};

// DOM Elements
const navItems = document.querySelectorAll('.nav-item');
const sections = document.querySelectorAll('.settings-section');
const userNameEl = document.getElementById('userName');
const userRoleEl = document.getElementById('userRole');
const logoutBtn = document.getElementById('logoutBtn');
const toast = document.getElementById('toast');
const toastMessage = document.querySelector('.toast-message');
const modal = document.getElementById('confirmationModal');
const modalTitle = document.getElementById('modalTitle');
const modalMessage = document.getElementById('modalMessage');
const modalCancel = document.getElementById('modalCancel');
const modalConfirm = document.getElementById('modalConfirm');

// Form Elements
const profileForm = document.getElementById('profileForm');
const passwordForm = document.getElementById('passwordForm');
const avatarInput = document.getElementById('avatarInput');
const avatarPreview = document.getElementById('avatarPreview');
const uploadAvatarBtn = document.getElementById('uploadAvatarBtn');
const removeAvatarBtn = document.getElementById('removeAvatarBtn');

// Initialize the settings page
document.addEventListener('DOMContentLoaded', () => {
    // Load user data from localStorage or use default
    loadUserData();
    
    // Setup event listeners
    setupEventListeners();
    
    // Initialize forms with current data
    populateForms();
    
    // Setup password strength checker
    setupPasswordStrength();
    
    // Setup theme radio buttons
    setupThemeButtons();
});

// Load user data
function loadUserData() {
    const savedData = localStorage.getItem('medimitraUserSettings');
    if (savedData) {
        try {
            userData = { ...userData, ...JSON.parse(savedData) };
        } catch (e) {
            console.error('Error loading user data:', e);
        }
    }
    
    // Update UI with user data
    updateUserInfo();
}

// Save user data
function saveUserData() {
    localStorage.setItem('medimitraUserSettings', JSON.stringify(userData));
}

// Update user info display
function updateUserInfo() {
    userNameEl.textContent = `${userData.firstName} ${userData.lastName}`;
    userRoleEl.textContent = userData.role;
}

// Setup all event listeners
function setupEventListeners() {
    // Navigation
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = item.getAttribute('data-section');
            
            // Update active nav item
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
            
            // Show selected section
            sections.forEach(section => {
                section.classList.remove('active');
                if (section.id === `${sectionId}-section`) {
                    section.classList.add('active');
                }
            });
        });
    });
    
    // Logout button
    logoutBtn.addEventListener('click', () => {
        showConfirmationModal(
            'Logout',
            'Are you sure you want to logout from Mediमित्र?',
            () => {
                // Clear user data and redirect to login
                localStorage.removeItem('medimitraUser');
                localStorage.removeItem('medimitraUserSettings');
                showToast('Logged out successfully');
                setTimeout(() => {
                    // In a real app, this would redirect to login page
                    window.location.href = 'index.html';
                }, 1500);
            }
        );
    });
    
    // Profile form submission
    profileForm.addEventListener('submit', (e) => {
        e.preventDefault();
        saveProfileData();
    });
    
    // Cancel profile button
    document.getElementById('cancelProfile').addEventListener('click', () => {
        populateForms(); // Reset form to current values
    });
    
    // Avatar upload
    uploadAvatarBtn.addEventListener('click', () => {
        avatarInput.click();
    });
    
    avatarInput.addEventListener('change', handleAvatarUpload);
    removeAvatarBtn.addEventListener('click', removeAvatar);
    
    // Password form
    passwordForm.addEventListener('submit', (e) => {
        e.preventDefault();
        changePassword();
    });
    
    // Toggle password visibility
    document.querySelectorAll('.toggle-password').forEach(btn => {
        btn.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const input = document.getElementById(targetId);
            const icon = this.querySelector('i');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });
    
    // Notification settings
    document.getElementById('saveNotifications').addEventListener('click', saveNotificationSettings);
    document.getElementById('resetNotifications').addEventListener('click', resetNotificationSettings);
    
    // Security settings
    document.getElementById('manage2faBtn').addEventListener('click', manageTwoFactor);
    document.getElementById('revokeAllBtn').addEventListener('click', revokeAllSessions);
    
    // Preferences
    document.getElementById('savePreferences').addEventListener('click', savePreferences);
    document.getElementById('resetPreferences').addEventListener('click', resetPreferences);
    document.getElementById('clearCacheBtn').addEventListener('click', clearCache);
    document.getElementById('downloadDataBtn').addEventListener('click', downloadUserData);
    
    // Privacy settings
    document.getElementById('deleteAccountBtn').addEventListener('click', deleteAccount);
    
    // Modal buttons
    modalCancel.addEventListener('click', hideModal);
    document.querySelector('.modal-close').addEventListener('click', hideModal);
    
    // Toast close button
    document.querySelector('.toast-close').addEventListener('click', hideToast);
    
    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            hideModal();
        }
    });
}

// Populate forms with current data
function populateForms() {
    // Profile form
    document.getElementById('firstName').value = userData.firstName;
    document.getElementById('lastName').value = userData.lastName;
    document.getElementById('email').value = userData.email;
    document.getElementById('phone').value = userData.phone;
    document.getElementById('organization').value = userData.organization;
    document.getElementById('department').value = userData.department;
    document.getElementById('bio').value = userData.bio;
    
    // Notification toggles
    document.querySelectorAll('.notification-settings input[type="checkbox"]').forEach(input => {
        const name = input.closest('.toggle-item').querySelector('h4').textContent;
        let value = false;
        
        if (name === 'Weekly Reports') value = userData.notifications.email.weeklyReports;
        if (name === 'Claim Updates') value = userData.notifications.email.claimUpdates;
        if (name === 'Coding Suggestions') value = userData.notifications.email.codingSuggestions;
        if (name === 'Product Updates') value = userData.notifications.email.productUpdates;
        if (name === 'Real-time Alerts') value = userData.notifications.push.realTimeAlerts;
        if (name === 'Team Messages') value = userData.notifications.push.teamMessages;
        if (name === 'Reminders') value = userData.notifications.push.reminders;
        
        input.checked = value;
    });
    
    // Notification schedule
    document.getElementById('quietStart').value = userData.notifications.schedule.quietStart;
    document.getElementById('quietEnd').value = userData.notifications.schedule.quietEnd;
    document.getElementById('notificationFrequency').value = userData.notifications.schedule.frequency;
    
    // Preferences
    document.querySelector(`input[name="theme"][value="${userData.theme}"]`).checked = true;
    document.getElementById('language').value = userData.language;
    document.getElementById('timezone').value = userData.timezone;
    document.getElementById('dateFormat').value = userData.dateFormat;
    
    document.querySelector('input[type="checkbox"][data-pref="compactMode"]').checked = userData.preferences.compactMode;
    document.querySelector('input[type="checkbox"][data-pref="animations"]').checked = userData.preferences.animations;
    document.querySelector('input[type="checkbox"][data-pref="highContrast"]').checked = userData.preferences.highContrast;
    
    // Privacy
    document.getElementById('profileVisibility').value = userData.privacy.profileVisibility;
    document.getElementById('dataRetention').value = userData.privacy.dataRetention;
    
    document.querySelector('input[type="checkbox"][data-privacy="analytics"]').checked = userData.privacy.analytics;
    document.querySelector('input[type="checkbox"][data-privacy="marketing"]').checked = userData.privacy.marketing;
    document.querySelector('input[type="checkbox"][data-privacy="thirdPartySharing"]').checked = userData.privacy.thirdPartySharing;
    document.querySelector('input[type="checkbox"][data-privacy="onlineStatus"]').checked = userData.privacy.onlineStatus;
}

// Save profile data
function saveProfileData() {
    userData.firstName = document.getElementById('firstName').value.trim();
    userData.lastName = document.getElementById('lastName').value.trim();
    userData.email = document.getElementById('email').value.trim();
    userData.phone = document.getElementById('phone').value.trim();
    userData.organization = document.getElementById('organization').value.trim();
    userData.department = document.getElementById('department').value;
    userData.bio = document.getElementById('bio').value.trim();
    
    // Update role based on department
    updateUserRole();
    
    saveUserData();
    updateUserInfo();
    showToast('Profile updated successfully');
}

// Update user role based on department
function updateUserRole() {
    const departmentTitles = {
        'cardiology': 'Cardiologist',
        'orthopedics': 'Orthopedic Surgeon',
        'neurology': 'Neurologist',
        'oncology': 'Oncologist',
        'general': 'General Surgeon',
        'radiology': 'Radiologist',
        'lab': 'Lab Director',
        'administration': 'Medical Director'
    };
    
    userData.role = departmentTitles[userData.department] || 'Medical Professional';
}

// Handle avatar upload
function handleAvatarUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
        showToast('Please select an image file', 'error');
        return;
    }
    
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
        showToast('Image size should be less than 5MB', 'error');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
        userData.avatar = e.target.result;
        updateAvatarPreview();
        saveUserData();
        showToast('Profile picture updated');
    };
    reader.readAsDataURL(file);
}

// Update avatar preview
function updateAvatarPreview() {
    if (userData.avatar) {
        avatarPreview.innerHTML = `<img src="${userData.avatar}" alt="Profile Picture">`;
    } else {
        avatarPreview.innerHTML = '<i class="fas fa-user-md"></i>';
    }
}

// Remove avatar
function removeAvatar() {
    userData.avatar = null;
    updateAvatarPreview();
    avatarInput.value = '';
    saveUserData();
    showToast('Profile picture removed');
}

// Setup password strength checker
function setupPasswordStrength() {
    const passwordInput = document.getElementById('newPassword');
    const strengthBar = document.querySelector('.strength-bar');
    const strengthText = document.getElementById('strengthText');
    
    passwordInput.addEventListener('input', function() {
        const password = this.value;
        const strength = calculatePasswordStrength(password);
        
        // Update strength bar
        strengthBar.style.width = strength.score * 20 + '%';
        
        // Update color based on strength
        if (strength.score < 2) {
            strengthBar.style.background = '#ef4444';
            strengthText.textContent = 'Weak';
            strengthText.style.color = '#ef4444';
        } else if (strength.score < 4) {
            strengthBar.style.background = '#f59e0b';
            strengthText.textContent = 'Moderate';
            strengthText.style.color = '#f59e0b';
        } else {
            strengthBar.style.background = '#10b981';
            strengthText.textContent = 'Strong';
            strengthText.style.color = '#10b981';
        }
        
        // Update requirements
        updatePasswordRequirements(strength);
    });
}

// Calculate password strength
function calculatePasswordStrength(password) {
    let score = 0;
    const requirements = {
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        special: false
    };
    
    if (password.length >= 8) {
        score++;
        requirements.length = true;
    }
    
    if (/[A-Z]/.test(password)) {
        score++;
        requirements.uppercase = true;
    }
    
    if (/[a-z]/.test(password)) {
        score++;
        requirements.lowercase = true;
    }
    
    if (/[0-9]/.test(password)) {
        score++;
        requirements.number = true;
    }
    
    if (/[^A-Za-z0-9]/.test(password)) {
        score++;
        requirements.special = true;
    }
    
    return { score, requirements };
}

// Update password requirements display
function updatePasswordRequirements(strength) {
    const requirements = document.querySelectorAll('.password-requirements li');
    
    requirements.forEach(req => {
        const type = req.className.replace('req-', '');
        if (strength.requirements[type]) {
            req.classList.add('valid');
            req.querySelector('i').style.color = '#10b981';
        } else {
            req.classList.remove('valid');
            req.querySelector('i').style.color = '#9ca3af';
        }
    });
}

// Change password
function changePassword() {
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    // Validation
    if (newPassword !== confirmPassword) {
        showToast('New passwords do not match', 'error');
        return;
    }
    
    const strength = calculatePasswordStrength(newPassword);
    if (strength.score < 3) {
        showToast('Password is too weak. Please use a stronger password.', 'error');
        return;
    }
    
    // In a real app, you would send this to the server
    // For demo, we'll just show a success message
    showToast('Password changed successfully');
    passwordForm.reset();
    
    // Reset strength bar
    document.querySelector('.strength-bar').style.width = '0%';
    document.getElementById('strengthText').textContent = 'Weak';
    document.getElementById('strengthText').style.color = '#9ca3af';
}

// Save notification settings
function saveNotificationSettings() {
    userData.notifications.email.weeklyReports = document.querySelector('input[type="checkbox"][data-notif="weeklyReports"]').checked;
    userData.notifications.email.claimUpdates = document.querySelector('input[type="checkbox"][data-notif="claimUpdates"]').checked;
    userData.notifications.email.codingSuggestions = document.querySelector('input[type="checkbox"][data-notif="codingSuggestions"]').checked;
    userData.notifications.email.productUpdates = document.querySelector('input[type="checkbox"][data-notif="productUpdates"]').checked;
    
    userData.notifications.push.realTimeAlerts = document.querySelector('input[type="checkbox"][data-notif="realTimeAlerts"]').checked;
    userData.notifications.push.teamMessages = document.querySelector('input[type="checkbox"][data-notif="teamMessages"]').checked;
    userData.notifications.push.reminders = document.querySelector('input[type="checkbox"][data-notif="reminders"]').checked;
    
    userData.notifications.schedule.quietStart = document.getElementById('quietStart').value;
    userData.notifications.schedule.quietEnd = document.getElementById('quietEnd').value;
    userData.notifications.schedule.frequency = document.getElementById('notificationFrequency').value;
    
    saveUserData();
    showToast('Notification preferences saved');
}

// Reset notification settings
function resetNotificationSettings() {
    showConfirmationModal(
        'Reset Notifications',
        'Are you sure you want to reset all notification settings to default?',
        () => {
            userData.notifications = {
                email: {
                    weeklyReports: true,
                    claimUpdates: true,
                    codingSuggestions: false,
                    productUpdates: true
                },
                push: {
                    realTimeAlerts: true,
                    teamMessages: false,
                    reminders: true
                },
                schedule: {
                    quietStart: '22:00',
                    quietEnd: '06:00',
                    frequency: 'immediate'
                }
            };
            
            populateForms();
            saveUserData();
            showToast('Notification settings reset to default');
        }
    );
}

// Manage two-factor authentication
function manageTwoFactor() {
    showConfirmationModal(
        'Two-Factor Authentication',
        userData.security.twoFactorEnabled 
            ? 'Are you sure you want to disable two-factor authentication? This makes your account less secure.'
            : 'Do you want to enable two-factor authentication for better security?',
        () => {
            userData.security.twoFactorEnabled = !userData.security.twoFactorEnabled;
            saveUserData();
            showToast(`Two-factor authentication ${userData.security.twoFactorEnabled ? 'enabled' : 'disabled'}`);
            // In a real app, you would redirect to 2FA setup page
        }
    );
}

// Revoke all sessions
function revokeAllSessions() {
    showConfirmationModal(
        'Revoke All Sessions',
        'This will log you out from all other devices. Are you sure?',
        () => {
            // In a real app, you would call API to revoke sessions
            showToast('All other sessions have been revoked');
        }
    );
}

// Setup theme buttons
function setupThemeButtons() {
    document.querySelectorAll('input[name="theme"]').forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.checked) {
                userData.theme = this.value;
                applyTheme();
                saveUserData();
                showToast('Theme preference saved');
            }
        });
    });
}

// Apply theme
function applyTheme() {
    const root = document.documentElement;
    
    if (userData.theme === 'dark') {
        root.style.setProperty('--light', '#111827');
        root.style.setProperty('--dark', '#f9fafb');
        root.style.setProperty('--darker', '#f3f4f6');
        root.style.setProperty('--gray-light', '#374151');
    } else {
        root.style.setProperty('--light', '#f9fafb');
        root.style.setProperty('--dark', '#1f2937');
        root.style.setProperty('--darker', '#111827');
        root.style.setProperty('--gray-light', '#e5e7eb');
    }
}

// Save preferences
function savePreferences() {
    userData.theme = document.querySelector('input[name="theme"]:checked').value;
    userData.language = document.getElementById('language').value;
    userData.timezone = document.getElementById('timezone').value;
    userData.dateFormat = document.getElementById('dateFormat').value;
    
    userData.preferences.compactMode = document.querySelector('input[type="checkbox"][data-pref="compactMode"]').checked;
    userData.preferences.animations = document.querySelector('input[type="checkbox"][data-pref="animations"]').checked;
    userData.preferences.highContrast = document.querySelector('input[type="checkbox"][data-pref="highContrast"]').checked;
    
    applyTheme();
    saveUserData();
    showToast('Preferences saved successfully');
}

// Reset preferences
function resetPreferences() {
    showConfirmationModal(
        'Reset Preferences',
        'Are you sure you want to reset all preferences to default?',
        () => {
            userData.theme = 'light';
            userData.language = 'en';
            userData.timezone = 'IST';
            userData.dateFormat = 'DD/MM/YYYY';
            userData.preferences = {
                compactMode: false,
                animations: true,
                highContrast: false
            };
            
            populateForms();
            applyTheme();
            saveUserData();
            showToast('Preferences reset to default');
        }
    );
}

// Clear cache
function clearCache() {
    showConfirmationModal(
        'Clear Cache',
        'This will clear all cached data. Some settings may need to reload. Continue?',
        () => {
            // In a real app, you would clear application cache
            showToast('Cache cleared successfully');
        }
    );
}

// Download user data
function downloadUserData() {
    const dataStr = JSON.stringify(userData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `medimitra-user-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    showToast('User data download started');
}

// Delete account
function deleteAccount() {
    showConfirmationModal(
        'Delete Account',
        'This action is irreversible. All your data will be permanently deleted. Are you absolutely sure?',
        () => {
            // In a real app, you would call API to delete account
            localStorage.clear();
            showToast('Account deleted successfully');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
        }
    );
}

// Show confirmation modal
function showConfirmationModal(title, message, onConfirm) {
    modalTitle.textContent = title;
    modalMessage.textContent = message;
    modal.classList.add('active');
    
    modalConfirm.onclick = () => {
        onConfirm();
        hideModal();
    };
}

// Hide modal
function hideModal() {
    modal.classList.remove('active');
}

// Show toast notification
function showToast(message, type = 'success') {
    const toastIcon = toast.querySelector('i');
    
    // Set icon based on type
    if (type === 'error') {
        toastIcon.className = 'fas fa-exclamation-circle';
        toast.style.background = '#ef4444';
    } else if (type === 'warning') {
        toastIcon.className = 'fas fa-exclamation-triangle';
        toast.style.background = '#f59e0b';
    } else {
        toastIcon.className = 'fas fa-check-circle';
        toast.style.background = '#10b981';
    }
    
    toastMessage.textContent = message;
    toast.classList.add('show');
    
    // Auto hide after 5 seconds
    setTimeout(hideToast, 5000);
}

// Hide toast
function hideToast() {
    toast.classList.remove('show');
}

// Initialize with current theme
applyTheme();