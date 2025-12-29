// Dashboard JavaScript

// ===== GLOBAL VARIABLES =====
let charts = {};
let theme = localStorage.getItem('medimitra-theme') || 'light';
let language = localStorage.getItem('medimitra-language') || 'en';

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    // Show loading screen
    showLoadingScreen();
    
    // Initialize after 2 seconds (simulate loading)
    setTimeout(() => {
        initializeDashboard();
        hideLoadingScreen();
    }, 2000);
    
    // Initialize event listeners
    initializeEventListeners();
});

// ===== LOADING SCREEN =====
function showLoadingScreen() {
    document.getElementById('loadingScreen').style.display = 'flex';
}

function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    loadingScreen.style.opacity = '0';
    setTimeout(() => {
        loadingScreen.style.display = 'none';
    }, 500);
}

// ===== DASHBOARD INITIALIZATION =====
function initializeDashboard() {
    // Apply saved theme
    applyTheme(theme);
    
    // Apply saved language
    applyLanguage(language);
    
    // Initialize animated counters
    initializeCounters();
    
    // Initialize charts
    initializeCharts();
    
    // Initialize notifications
    initializeNotifications();
    
    // Update dashboard stats
    updateDashboardStats();
}

// ===== THEME MANAGEMENT =====
function applyTheme(themeName) {
    const body = document.body;
    const themeToggle = document.getElementById('themeToggle');
    
    if (themeName === 'dark') {
        body.classList.add('dark-theme');
        themeToggle.classList.add('dark');
        themeToggle.querySelector('.fa-sun').style.opacity = '0';
        themeToggle.querySelector('.fa-moon').style.opacity = '1';
    } else {
        body.classList.remove('dark-theme');
        themeToggle.classList.remove('dark');
        themeToggle.querySelector('.fa-sun').style.opacity = '1';
        themeToggle.querySelector('.fa-moon').style.opacity = '0';
    }
    
    // Save to localStorage
    localStorage.setItem('medimitra-theme', themeName);
}

// ===== LANGUAGE MANAGEMENT =====
function applyLanguage(lang) {
    const select = document.getElementById('languageSelect');
    select.value = lang;
    
    // Update language-specific content
    const translations = {
        en: {
            welcome: "Welcome back, Dr. Patel. Here's your medical activity summary.",
            dashboard: "Dashboard Overview",
            totalPatients: "Total Patients",
            pendingClaims: "Pending Claims",
            documents: "Documents Processed",
            approvalRate: "Approval Rate",
            recentActivity: "Recent Activity",
            revenueTrend: "Revenue Trend",
            claimsStatus: "Claims Status",
            topProcedures: "Top Procedures",
            processingTime: "Processing Time",
            aiAccuracy: "AI Accuracy"
        },
        hi: {
            welcome: "वापस स्वागत है, डॉ. पटेल। यहां आपकी चिकित्सा गतिविधि सारांश है।",
            dashboard: "डैशबोर्ड अवलोकन",
            totalPatients: "कुल मरीज",
            pendingClaims: "लंबित दावे",
            documents: "प्रसंस्कृत दस्तावेज़",
            approvalRate: "अनुमोदन दर",
            recentActivity: "हाल की गतिविधि",
            revenueTrend: "राजस्व प्रवृत्ति",
            claimsStatus: "दावा स्थिति",
            topProcedures: "शीर्ष प्रक्रियाएं",
            processingTime: "प्रसंस्करण समय",
            aiAccuracy: "एआई सटीकता"
        }
    };
    
    const t = translations[lang] || translations.en;
    
    // Update text content
    document.querySelector('.welcome-text').textContent = t.welcome;
    document.querySelector('.header-left h2').textContent = t.dashboard;
    
    // Update stat titles
    document.querySelectorAll('.stat-content h3').forEach((title, index) => {
        const titles = [t.totalPatients, t.pendingClaims, t.documents, t.approvalRate];
        if (titles[index]) title.textContent = titles[index];
    });
    
    // Update chart titles
    document.querySelectorAll('.chart-header h3').forEach((chartTitle, index) => {
        const titles = [t.revenueTrend, t.claimsStatus, t.topProcedures, t.processingTime, t.aiAccuracy];
        if (titles[index]) {
            const icon = chartTitle.querySelector('i');
            chartTitle.innerHTML = `${icon ? icon.outerHTML : ''} ${titles[index]}`;
        }
    });
    
    // Save to localStorage
    localStorage.setItem('medimitra-language', lang);
}

// ===== ANIMATED COUNTERS =====
function initializeCounters() {
    const counters = document.querySelectorAll('.stat-value[data-count]');
    
    counters.forEach(counter => {
        const target = parseFloat(counter.getAttribute('data-count'));
        const isPercentage = counter.textContent.includes('%');
        const suffix = counter.querySelector('small') ? counter.querySelector('small').textContent : '';
        
        // Reset counter
        counter.textContent = isPercentage ? '0%' : '0';
        if (suffix) {
            const small = document.createElement('small');
            small.textContent = suffix;
            counter.appendChild(small);
        }
        
        // Animate counter
        animateCounter(counter, target, 2000, isPercentage);
    });
}

function animateCounter(element, target, duration, isPercentage) {
    const start = 0;
    const increment = target / (duration / 16); // 60fps
    
    let current = start;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        
        if (isPercentage) {
            element.innerHTML = current.toFixed(1) + '<small>%</small>';
        } else {
            element.textContent = Math.floor(current).toLocaleString();
            // Add back suffix if exists
            const suffix = element.querySelector('small');
            if (suffix) element.appendChild(suffix);
        }
    }, 16);
}

// ===== CHARTS INITIALIZATION =====
function initializeCharts() {
    // Revenue Trend Chart
    const revenueCtx = document.getElementById('revenueChart').getContext('2d');
    charts.revenue = new Chart(revenueCtx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: [{
                label: 'Revenue (₹)',
                data: [45000, 52000, 48000, 62000, 58000, 71000, 68000, 75000, 72000, 81000, 79000, 88000],
                borderColor: '#2563eb',
                backgroundColor: 'rgba(37, 99, 235, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { drawBorder: false },
                    ticks: {
                        callback: function(value) {
                            return '₹' + value.toLocaleString();
                        }
                    }
                },
                x: { grid: { display: false } }
            }
        }
    });
    
    // Claims Status Chart
    const claimsStatusCtx = document.getElementById('claimsStatusChart').getContext('2d');
    charts.claimsStatus = new Chart(claimsStatusCtx, {
        type: 'doughnut',
        data: {
            labels: ['Approved', 'Pending', 'Rejected', 'Processing'],
            datasets: [{
                data: [68, 18, 8, 6],
                backgroundColor: ['#10b981', '#f59e0b', '#ef4444', '#3b82f6'],
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'right' }
            },
            cutout: '70%'
        }
    });
    
    // Top Procedures Chart
    const proceduresCtx = document.getElementById('proceduresChart').getContext('2d');
    charts.procedures = new Chart(proceduresCtx, {
        type: 'bar',
        data: {
            labels: ['Angioplasty', 'Knee Replacement', 'Heart Bypass', 'Chemotherapy', 'Cataract Surgery'],
            datasets: [{
                label: 'Count',
                data: [24, 18, 15, 12, 10],
                backgroundColor: [
                    '#2563eb', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444'
                ],
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
    
    // Processing Time Chart
    const processingCtx = document.getElementById('processingTimeChart').getContext('2d');
    charts.processing = new Chart(processingCtx, {
        type: 'line',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Hours',
                data: [3.5, 3.2, 2.8, 3.1, 2.9, 2.7, 2.5],
                borderColor: '#8b5cf6',
                backgroundColor: 'rgba(139, 92, 246, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return value + ' hrs';
                        }
                    }
                }
            }
        }
    });
    
    // Mini Charts for Stats
    initializeMiniCharts();
}

function initializeMiniCharts() {
    // Patients Mini Chart
    const patientsCtx = document.getElementById('patientsChart').getContext('2d');
    new Chart(patientsCtx, {
        type: 'line',
        data: {
            labels: ['', '', '', '', '', ''],
            datasets: [{
                data: [30, 40, 35, 45, 50, 55],
                borderColor: '#2563eb',
                borderWidth: 2,
                fill: false,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: { x: { display: false }, y: { display: false } }
        }
    });
    
    // Claims Mini Chart
    const claimsCtx = document.getElementById('claimsChart').getContext('2d');
    new Chart(claimsCtx, {
        type: 'line',
        data: {
            labels: ['', '', '', '', '', ''],
            datasets: [{
                data: [50, 45, 40, 35, 30, 25],
                borderColor: '#f59e0b',
                borderWidth: 2,
                fill: false,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: { x: { display: false }, y: { display: false } }
        }
    });
    
    // Documents Mini Chart
    const docsCtx = document.getElementById('documentsChart').getContext('2d');
    new Chart(docsCtx, {
        type: 'line',
        data: {
            labels: ['', '', '', '', '', ''],
            datasets: [{
                data: [20, 25, 30, 35, 40, 45],
                borderColor: '#10b981',
                borderWidth: 2,
                fill: false,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: { x: { display: false }, y: { display: false } }
        }
    });
    
    // Approval Mini Chart
    const approvalCtx = document.getElementById('approvalChart').getContext('2d');
    new Chart(approvalCtx, {
        type: 'line',
        data: {
            labels: ['', '', '', '', '', ''],
            datasets: [{
                data: [90, 91, 92, 93, 94, 95],
                borderColor: '#3b82f6',
                borderWidth: 2,
                fill: false,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: { x: { display: false }, y: { display: false } }
        }
    });
}

// ===== NOTIFICATIONS =====
function initializeNotifications() {
    const notificationBtn = document.querySelector('.notification-btn');
    const markAllReadBtn = document.querySelector('.mark-all-read');
    const notificationItems = document.querySelectorAll('.notification-item.unread');
    const notificationCount = document.querySelector('.notification-count');
    
    // Mark all as read
    markAllReadBtn.addEventListener('click', function() {
        notificationItems.forEach(item => {
            item.classList.remove('unread');
            item.style.backgroundColor = '';
        });
        
        // Update notification count
        notificationCount.textContent = '0';
        notificationCount.style.display = 'none';
        
        // Show confirmation
        showToast('All notifications marked as read');
    });
    
    // Notification item click
    document.querySelectorAll('.notification-item').forEach(item => {
        item.addEventListener('click', function() {
            if (this.classList.contains('unread')) {
                this.classList.remove('unread');
                this.style.backgroundColor = '';
                
                // Update count
                const currentCount = parseInt(notificationCount.textContent);
                if (currentCount > 0) {
                    notificationCount.textContent = currentCount - 1;
                    if (currentCount - 1 === 0) {
                        notificationCount.style.display = 'none';
                    }
                }
            }
        });
    });
}

// ===== EVENT LISTENERS =====
function initializeEventListeners() {
    // Sidebar Toggle
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.querySelector('.sidebar');
    
    sidebarToggle.addEventListener('click', function() {
        sidebar.classList.toggle('active');
    });
    
    // Theme Toggle
    const themeToggle = document.getElementById('themeToggle');
    themeToggle.addEventListener('click', function() {
        theme = theme === 'light' ? 'dark' : 'light';
        applyTheme(theme);
        showToast(`Theme changed to ${theme} mode`);
    });
    
    // Language Selector
    const languageSelect = document.getElementById('languageSelect');
    languageSelect.addEventListener('change', function() {
        language = this.value;
        applyLanguage(language);
        showToast(`Language changed to ${this.options[this.selectedIndex].text}`);
    });
    
    // Search Input
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch(this.value);
        }
    });
    
    // Quick Actions
    document.getElementById('quickUpload').addEventListener('click', () => {
        showToast('Document upload dialog opened');
    });
    
    document.getElementById('quickClaim').addEventListener('click', () => {
        showToast('New claim form opened');
    });
    
    document.getElementById('quickPatient').addEventListener('click', () => {
        showToast('Add patient form opened');
    });
    
    document.getElementById('quickReport').addEventListener('click', () => {
        showToast('Report generation started');
    });
    
    // Logout Buttons
    document.getElementById('logoutBtn').addEventListener('click', logout);
    document.getElementById('logoutBtn2').addEventListener('click', logout);
    
    // AI Assistant
    const aiToggle = document.querySelector('.ai-toggle');
    const aiChat = document.querySelector('.ai-chat');
    const aiClose = document.querySelector('.ai-close');
    const aiInput = document.getElementById('aiInput');
    const aiSend = document.getElementById('aiSend');
    
    aiToggle.addEventListener('click', function() {
        document.querySelector('.ai-assistant').classList.toggle('active');
    });
    
    aiClose.addEventListener('click', function() {
        document.querySelector('.ai-assistant').classList.remove('active');
    });
    
    aiSend.addEventListener('click', function() {
        sendAIMessage(aiInput.value);
        aiInput.value = '';
    });
    
    aiInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendAIMessage(this.value);
            this.value = '';
        }
    });
    
    // Chart Period Selector
    document.querySelector('.chart-period').addEventListener('change', function() {
        updateChartData(this.value);
    });
    
    // View All Buttons
    document.querySelectorAll('.view-all-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const section = this.closest('.card-header').querySelector('h3').textContent;
            showToast(`Viewing all ${section.toLowerCase()}`);
        });
    });
    
    // Patient Actions
    document.querySelectorAll('.action-btn.view').forEach(btn => {
        btn.addEventListener('click', function() {
            const patientId = this.closest('tr').querySelector('td:first-child').textContent;
            showToast(`Viewing patient ${patientId}`);
        });
    });
    
    document.querySelectorAll('.action-btn.edit').forEach(btn => {
        btn.addEventListener('click', function() {
            const patientId = this.closest('tr').querySelector('td:first-child').textContent;
            showToast(`Editing patient ${patientId}`);
        });
    });
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', function(e) {
        // Close notifications dropdown
        if (!e.target.closest('.notifications')) {
            document.querySelector('.notification-dropdown').style.display = 'none';
        }
        
        // Close user menu dropdown
        if (!e.target.closest('.user-menu')) {
            document.querySelector('.user-menu-dropdown').style.display = 'none';
        }
        
        // Close sidebar when clicking outside on mobile
        if (window.innerWidth <= 1200 && 
            !e.target.closest('.sidebar') && 
            !e.target.closest('.sidebar-toggle')) {
            sidebar.classList.remove('active');
        }
    });
}

// ===== DASHBOARD FUNCTIONS =====
function performSearch(query) {
    if (query.trim()) {
        showToast(`Searching for: "${query}"`);
        // In a real app, you would make an API call here
    }
}

function updateDashboardStats() {
    // Simulate updating stats every 30 seconds
    setInterval(() => {
        // Randomly update some stats for demo
        const stats = document.querySelectorAll('.stat-value[data-count]');
        stats.forEach(stat => {
            const current = parseFloat(stat.getAttribute('data-count'));
            const randomChange = (Math.random() - 0.5) * 0.02; // ±2% change
            const newValue = current * (1 + randomChange);
            
            if (stat.textContent.includes('%')) {
                stat.setAttribute('data-count', newValue.toFixed(1));
                stat.innerHTML = newValue.toFixed(1) + '<small>%</small>';
            } else {
                const rounded = Math.round(newValue);
                stat.setAttribute('data-count', rounded);
                stat.textContent = rounded.toLocaleString();
            }
            
            // Update trend indicator
            const changeElement = stat.closest('.stat-content').querySelector('.stat-change');
            if (randomChange > 0) {
                changeElement.className = 'stat-change positive';
                changeElement.innerHTML = '<i class="fas fa-arrow-up"></i> Positive trend';
            } else {
                changeElement.className = 'stat-change negative';
                changeElement.innerHTML = '<i class="fas fa-arrow-down"></i> Negative trend';
            }
        });
    }, 30000);
}

function updateChartData(period) {
    // Simulate updating chart data based on period
    const periods = {
        'Last 7 days': 7,
        'Last 30 days': 30,
        'Last 90 days': 90,
        'Last year': 365
    };
    
    const days = periods[period] || 90;
    showToast(`Updating charts for ${period.toLowerCase()}`);
    
    // Update revenue chart (simulated)
    if (charts.revenue) {
        const newData = Array.from({length: 12}, (_, i) => 
            Math.floor(50000 + Math.random() * 40000 * (i / 12))
        );
        charts.revenue.data.datasets[0].data = newData;
        charts.revenue.update();
    }
}

function sendAIMessage(message) {
    if (!message.trim()) return;
    
    const aiMessages = document.querySelector('.ai-messages');
    
    // Add user message
    const userMessage = document.createElement('div');
    userMessage.className = 'ai-message';
    userMessage.innerHTML = `
        <div class="message-content" style="background: #2563eb; color: white; margin-left: auto; max-width: 80%;">
            ${message}
        </div>
    `;
    aiMessages.appendChild(userMessage);
    
    // Scroll to bottom
    aiMessages.scrollTop = aiMessages.scrollHeight;
    
    // Simulate AI response after 1 second
    setTimeout(() => {
        const responses = [
            "Based on your medical documents, I suggest using ICD-10 code I10 for hypertension.",
            "The claim processing time for this procedure is typically 2-3 business days.",
            "I found 3 similar cases with successful claims using CPT code 99213.",
            "Your approval rate for cardiology procedures is 96%, which is above average.",
            "I recommend attaching the ECG report for better claim approval chances."
        ];
        
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        
        const aiMessage = document.createElement('div');
        aiMessage.className = 'ai-message';
        aiMessage.innerHTML = `
            <div class="message-content">
                ${randomResponse}
            </div>
        `;
        aiMessages.appendChild(aiMessage);
        
        // Scroll to bottom
        aiMessages.scrollTop = aiMessages.scrollHeight;
    }, 1000);
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        showToast('Logging out...');
        
        // Clear user data
        localStorage.removeItem('medimitra-user');
        localStorage.removeItem('medimitra-theme');
        localStorage.removeItem('medimitra-language');
        
        // Redirect to login page after 1 second
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    }
}

// ===== TOAST NOTIFICATION =====
function showToast(message, type = 'info') {
    // Remove existing toast
    const existingToast = document.querySelector('.custom-toast');
    if (existingToast) existingToast.remove();
    
    // Create toast
    const toast = document.createElement('div');
    toast.className = `custom-toast ${type}`;
    toast.innerHTML = `
        <i class="fas fa-${getToastIcon(type)}"></i>
        <span>${message}</span>
        <button class="toast-close">&times;</button>
    `;
    
    // Add styles
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background: ${getToastColor(type)};
        color: white;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        display: flex;
        align-items: center;
        gap: 10px;
        z-index: 1000;
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(toast);
    
    // Close button
    toast.querySelector('.toast-close').addEventListener('click', () => {
        toast.remove();
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (toast.parentNode) {
            toast.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }
    }, 5000);
}

function getToastIcon(type) {
    const icons = {
        'success': 'check-circle',
        'error': 'exclamation-circle',
        'warning': 'exclamation-triangle',
        'info': 'info-circle'
    };
    return icons[type] || 'info-circle';
}

function getToastColor(type) {
    const colors = {
        'success': '#10b981',
        'error': '#ef4444',
        'warning': '#f59e0b',
        'info': '#3b82f6'
    };
    return colors[type] || '#3b82f6';
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .custom-toast .toast-close {
        background: none;
        border: none;
        color: white;
        font-size: 20px;
        cursor: pointer;
        margin-left: 10px;
    }
    
    /* Dark theme styles */
    .dark-theme {
        background: #111827;
        color: #f9fafb;
    }
    
    .dark-theme .sidebar,
    .dark-theme .card,
    .dark-theme .chart-card,
    .dark-theme .activity-card,
    .dark-theme .table-card {
        background: #1f2937;
        border-color: #374151;
    }
    
    .dark-theme .stat-card,
    .dark-theme .ai-chat {
        background: #1f2937;
    }
    
    .dark-theme .main-nav .nav-item {
        color: #d1d5db;
    }
    
    .dark-theme .main-nav .nav-item:hover {
        background: #374151;
    }
    
    .dark-theme .form-control,
    .dark-theme select,
    .dark-theme .search-box input {
        background: #374151;
        border-color: #4b5563;
        color: #f9fafb;
    }
    
    .dark-theme .notification-dropdown,
    .dark-theme .user-menu-dropdown {
        background: #1f2937;
        border: 1px solid #374151;
    }
`;
document.head.appendChild(style);

// Initialize
console.log('Mediमित्र Dashboard initialized successfully!');