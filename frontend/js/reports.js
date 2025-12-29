// Sample Data for Reports
const sampleData = {
    claims: [
        {
            id: 'CLM-2024-00123',
            patient: 'Rajesh Kumar',
            hospital: 'Apollo Hospital',
            procedure: 'Angioplasty',
            amount: '₹1,25,000',
            status: 'approved',
            date: '2024-12-20'
        },
        {
            id: 'CLM-2024-00124',
            patient: 'Priya Sharma',
            hospital: 'Fortis Hospital',
            procedure: 'Knee Replacement',
            amount: '₹2,50,000',
            status: 'pending',
            date: '2024-12-21'
        },
        {
            id: 'CLM-2024-00125',
            patient: 'Amit Patel',
            hospital: 'Medanta Hospital',
            procedure: 'Cataract Surgery',
            amount: '₹45,000',
            status: 'rejected',
            date: '2024-12-22'
        },
        {
            id: 'CLM-2024-00126',
            patient: 'Sunita Verma',
            hospital: 'AIIMS Delhi',
            procedure: 'Chemotherapy',
            amount: '₹85,000',
            status: 'approved',
            date: '2024-12-23'
        },
        {
            id: 'CLM-2024-00127',
            patient: 'Rohit Gupta',
            hospital: 'Max Hospital',
            procedure: 'Appendectomy',
            amount: '₹65,000',
            status: 'processing',
            date: '2024-12-24'
        },
        {
            id: 'CLM-2024-00128',
            patient: 'Anjali Singh',
            hospital: 'Kokilaben Hospital',
            procedure: 'Heart Bypass',
            amount: '₹3,20,000',
            status: 'approved',
            date: '2024-12-25'
        },
        {
            id: 'CLM-2024-00129',
            patient: 'Vikram Joshi',
            hospital: 'Nanavati Hospital',
            procedure: 'Spine Surgery',
            amount: '₹1,80,000',
            status: 'pending',
            date: '2024-12-26'
        }
    ],
    
    revenueData: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        currentYear: [85000, 92000, 105000, 112000, 125000, 118000, 132000, 145000, 158000, 165000, 172000, 189000],
        previousYear: [78000, 81000, 89000, 95000, 102000, 98000, 108000, 112000, 120000, 125000, 130000, 135000]
    },
    
    claimsDistribution: {
        labels: ['Approved', 'Pending', 'Rejected', 'Processing'],
        data: [68, 18, 8, 6],
        colors: ['#10b981', '#f59e0b', '#ef4444', '#3b82f6']
    },
    
    topProcedures: {
        labels: ['Angioplasty', 'Knee Replacement', 'Heart Bypass', 'Chemotherapy', 'Cataract Surgery'],
        data: [24, 18, 15, 12, 10],
        colors: ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444']
    },
    
    accuracyByDept: {
        labels: ['Cardiology', 'Orthopedics', 'Neurology', 'Oncology', 'General Surgery'],
        data: [96.5, 94.2, 92.8, 95.1, 93.7],
        colors: ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444']
    },
    
    processingTime: {
        labels: ['Apollo', 'Fortis', 'Medanta', 'AIIMS', 'Max'],
        data: [2.8, 3.5, 2.9, 4.2, 3.1],
        colors: ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444']
    },
    
    revenueByProvider: {
        labels: ['Star Health', 'HDFC Ergo', 'ICICI Lombard', 'Bajaj Allianz', 'New India'],
        data: [32, 25, 18, 15, 10],
        colors: ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444']
    }
};

// Initialize Charts
let revenueChart, claimsChart, proceduresChart, accuracyChart, timeChart, revenueBreakdownChart;

// DOM Elements
const periodSelect = document.getElementById('periodSelect');
const exportBtn = document.getElementById('exportBtn');
const refreshBtn = document.getElementById('refreshBtn');
const searchInput = document.getElementById('searchInput');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');
const loadingOverlay = document.getElementById('loadingOverlay');
const claimsTableBody = document.querySelector('.data-table tbody');

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    showLoading();
    
    // Initialize charts
    initializeCharts();
    
    // Populate claims table
    populateClaimsTable();
    
    // Setup event listeners
    setupEventListeners();
    
    // Hide loading after 1.5 seconds
    setTimeout(hideLoading, 1500);
});

// Initialize all charts
function initializeCharts() {
    // Revenue Trend Chart
    const revenueCtx = document.getElementById('revenueChart').getContext('2d');
    revenueChart = new Chart(revenueCtx, {
        type: 'line',
        data: {
            labels: sampleData.revenueData.labels,
            datasets: [
                {
                    label: 'Current Year',
                    data: sampleData.revenueData.currentYear,
                    borderColor: '#2563eb',
                    backgroundColor: 'rgba(37, 99, 235, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
                },
                {
                    label: 'Previous Year',
                    data: sampleData.revenueData.previousYear,
                    borderColor: '#d1d5db',
                    backgroundColor: 'rgba(209, 213, 219, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4,
                    borderDash: [5, 5]
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        usePointStyle: true,
                        padding: 20
                    }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                        label: function(context) {
                            return `₹${context.parsed.y.toLocaleString()}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        drawBorder: false
                    },
                    ticks: {
                        callback: function(value) {
                            return '₹' + value.toLocaleString();
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });

    // Claims Distribution Chart
    const claimsCtx = document.getElementById('claimsChart').getContext('2d');
    claimsChart = new Chart(claimsCtx, {
        type: 'doughnut',
        data: {
            labels: sampleData.claimsDistribution.labels,
            datasets: [{
                data: sampleData.claimsDistribution.data,
                backgroundColor: sampleData.claimsDistribution.colors,
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        usePointStyle: true,
                        padding: 20
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.label}: ${context.parsed}%`;
                        }
                    }
                }
            },
            cutout: '65%'
        }
    });

    // Top Procedures Chart
    const proceduresCtx = document.getElementById('proceduresChart').getContext('2d');
    proceduresChart = new Chart(proceduresCtx, {
        type: 'bar',
        data: {
            labels: sampleData.topProcedures.labels,
            datasets: [{
                label: 'Number of Procedures',
                data: sampleData.topProcedures.data,
                backgroundColor: sampleData.topProcedures.colors,
                borderWidth: 0,
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        drawBorder: false
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });

    // Accuracy by Department Chart
    const accuracyCtx = document.getElementById('accuracyChart').getContext('2d');
    accuracyChart = new Chart(accuracyCtx, {
        type: 'bar',
        data: {
            labels: sampleData.accuracyByDept.labels,
            datasets: [{
                label: 'Accuracy %',
                data: sampleData.accuracyByDept.data,
                backgroundColor: sampleData.accuracyByDept.colors,
                borderWidth: 0,
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    grid: {
                        drawBorder: false
                    },
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });

    // Processing Time Chart
    const timeCtx = document.getElementById('timeChart').getContext('2d');
    timeChart = new Chart(timeCtx, {
        type: 'bar',
        data: {
            labels: sampleData.processingTime.labels,
            datasets: [{
                label: 'Hours',
                data: sampleData.processingTime.data,
                backgroundColor: sampleData.processingTime.colors,
                borderWidth: 0,
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        drawBorder: false
                    },
                    ticks: {
                        callback: function(value) {
                            return value + ' hrs';
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });

    // Revenue Breakdown Chart
    const revenueBreakdownCtx = document.getElementById('revenueBreakdownChart').getContext('2d');
    revenueBreakdownChart = new Chart(revenueBreakdownCtx, {
        type: 'pie',
        data: {
            labels: sampleData.revenueByProvider.labels,
            datasets: [{
                data: sampleData.revenueByProvider.data,
                backgroundColor: sampleData.revenueByProvider.colors,
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        usePointStyle: true,
                        padding: 20
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.label}: ${context.parsed}%`;
                        }
                    }
                }
            }
        }
    });
}

// Populate claims table
function populateClaimsTable() {
    claimsTableBody.innerHTML = '';
    
    sampleData.claims.forEach(claim => {
        const row = document.createElement('tr');
        
        // Get status badge class
        let statusClass = '';
        let statusText = '';
        switch(claim.status) {
            case 'approved':
                statusClass = 'approved';
                statusText = 'Approved';
                break;
            case 'pending':
                statusClass = 'pending';
                statusText = 'Pending';
                break;
            case 'rejected':
                statusClass = 'rejected';
                statusText = 'Rejected';
                break;
            case 'processing':
                statusClass = 'processing';
                statusText = 'Processing';
                break;
        }
        
        row.innerHTML = `
            <td>${claim.id}</td>
            <td><strong>${claim.patient}</strong></td>
            <td>${claim.hospital}</td>
            <td>${claim.procedure}</td>
            <td>${claim.amount}</td>
            <td><span class="status-badge ${statusClass}">${statusText}</span></td>
            <td>${claim.date}</td>
            <td>
                <button class="action-btn view" data-id="${claim.id}">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="action-btn download" data-id="${claim.id}">
                    <i class="fas fa-download"></i>
                </button>
            </td>
        `;
        
        claimsTableBody.appendChild(row);
    });
    
    // Add event listeners to action buttons
    document.querySelectorAll('.action-btn.view').forEach(btn => {
        btn.addEventListener('click', function() {
            const claimId = this.getAttribute('data-id');
            viewClaimDetails(claimId);
        });
    });
    
    document.querySelectorAll('.action-btn.download').forEach(btn => {
        btn.addEventListener('click', function() {
            const claimId = this.getAttribute('data-id');
            downloadClaim(claimId);
        });
    });
}

// Setup event listeners
function setupEventListeners() {
    // Period select change
    periodSelect.addEventListener('change', function() {
        showLoading();
        setTimeout(() => {
            updateChartsByPeriod(this.value);
            hideLoading();
        }, 1000);
    });
    
    // Export button
    exportBtn.addEventListener('click', exportReport);
    
    // Refresh button
    refreshBtn.addEventListener('click', refreshData);
    
    // Search input
    searchInput.addEventListener('input', filterTable);
    
    // Pagination buttons
    prevBtn.addEventListener('click', goToPrevPage);
    nextBtn.addEventListener('click', goToNextPage);
    
    // Tab switching
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // Update active tab button
            tabBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Show corresponding tab content
            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === `${tabId}-tab`) {
                    content.classList.add('active');
                }
            });
        });
    });
    
    // Action buttons in table
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('view-btn') || 
            e.target.closest('.view-btn')) {
            const claimId = e.target.closest('.view-btn').getAttribute('data-id');
            viewClaimDetails(claimId);
        }
        
        if (e.target.classList.contains('download-btn') || 
            e.target.closest('.download-btn')) {
            const claimId = e.target.closest('.download-btn').getAttribute('data-id');
            downloadClaim(claimId);
        }
    });
}

// Update charts based on selected period
function updateChartsByPeriod(period) {
    // This function would normally fetch new data from API
    // For demo, we'll just show a message and simulate data change
    console.log(`Updating charts for period: ${period}`);
    
    // Simulate data change by slightly modifying existing data
    const factor = period === 'today' ? 0.1 : 
                  period === 'week' ? 0.3 : 
                  period === 'quarter' ? 2 : 
                  period === 'year' ? 4 : 1;
    
    // Update revenue chart
    revenueChart.data.datasets[0].data = sampleData.revenueData.currentYear.map(val => val * factor);
    revenueChart.update();
}

// Export report
function exportReport() {
    showLoading();
    
    // Simulate export process
    setTimeout(() => {
        hideLoading();
        
        // Show export options modal (simplified for demo)
        const format = prompt('Choose export format: PDF, Excel, or CSV', 'PDF');
        if (format) {
            alert(`Report exported as ${format} format successfully!`);
            
            // Simulate file download
            const link = document.createElement('a');
            link.download = `MediMitra_Report_${new Date().toISOString().split('T')[0]}.${format.toLowerCase()}`;
            link.href = '#';
            link.click();
        }
    }, 1500);
}

// Refresh data
function refreshData() {
    showLoading();
    
    // Simulate API call
    setTimeout(() => {
        // Update summary stats with random variations
        document.querySelectorAll('.stat-value').forEach((el, index) => {
            const current = parseFloat(el.textContent.replace(/[^0-9.]/g, ''));
            const variation = (Math.random() - 0.5) * 0.05; // +/- 5%
            const newValue = current * (1 + variation);
            
            if (index === 0) { // Revenue
                el.textContent = `₹${Math.round(newValue).toLocaleString()}`;
            } else if (index === 1) { // Claims
                el.textContent = Math.round(newValue);
            } else if (index === 2) { // Accuracy
                el.textContent = `${newValue.toFixed(1)}%`;
            } else { // Processing time
                el.textContent = `${newValue.toFixed(1)} hours`;
            }
        });
        
        // Update charts
        updateChartsRandomly();
        
        // Show success message
        showNotification('Data refreshed successfully!', 'success');
        
        hideLoading();
    }, 2000);
}

// Update charts with random data
function updateChartsRandomly() {
    // Revenue chart
    revenueChart.data.datasets[0].data = revenueChart.data.datasets[0].data.map(val => 
        val * (0.95 + Math.random() * 0.1)
    );
    revenueChart.update();
    
    // Claims distribution
    claimsChart.data.datasets[0].data = claimsChart.data.datasets[0].data.map(val => 
        Math.max(1, Math.round(val * (0.9 + Math.random() * 0.2)))
    );
    claimsChart.update();
    
    // Procedures chart
    proceduresChart.data.datasets[0].data = proceduresChart.data.datasets[0].data.map(val => 
        Math.max(1, Math.round(val * (0.9 + Math.random() * 0.2)))
    );
    proceduresChart.update();
}

// Filter table based on search input
function filterTable() {
    const searchTerm = searchInput.value.toLowerCase();
    const rows = claimsTableBody.querySelectorAll('tr');
    
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm) ? '' : 'none';
    });
}

// Pagination functions
let currentPage = 1;
const rowsPerPage = 5;

function goToPrevPage() {
    if (currentPage > 1) {
        currentPage--;
        updatePagination();
    }
}

function goToNextPage() {
    const totalPages = Math.ceil(sampleData.claims.length / rowsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        updatePagination();
    }
}

function updatePagination() {
    // Update page numbers
    document.querySelectorAll('.page-number').forEach((el, index) => {
        el.classList.remove('active');
        if (index === currentPage - 1) {
            el.classList.add('active');
        }
    });
    
    // Update table info
    const startRow = (currentPage - 1) * rowsPerPage + 1;
    const endRow = Math.min(currentPage * rowsPerPage, sampleData.claims.length);
    
    document.getElementById('startRow').textContent = startRow;
    document.getElementById('endRow').textContent = endRow;
    document.getElementById('totalRows').textContent = sampleData.claims.length;
    
    // Show/hide pagination buttons
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage * rowsPerPage >= sampleData.claims.length;
}

// View claim details
function viewClaimDetails(claimId) {
    const claim = sampleData.claims.find(c => c.id === claimId);
    if (claim) {
        // Show claim details in a modal (simplified for demo)
        const details = `
            Claim ID: ${claim.id}
            Patient: ${claim.patient}
            Hospital: ${claim.hospital}
            Procedure: ${claim.procedure}
            Amount: ${claim.amount}
            Status: ${claim.status}
            Date: ${claim.date}
        `;
        alert(`Claim Details:\n\n${details}`);
    }
}

// Download claim
function downloadClaim(claimId) {
    showLoading();
    
    setTimeout(() => {
        hideLoading();
        alert(`Downloading claim ${claimId}...\n\nIn a real application, this would download a PDF of the claim details.`);
        
        // Simulate download
        const link = document.createElement('a');
        link.download = `${claimId}_Details.pdf`;
        link.href = '#';
        link.click();
    }, 1000);
}

// Show/hide loading overlay
function showLoading() {
    loadingOverlay.classList.add('active');
}

function hideLoading() {
    loadingOverlay.classList.remove('active');
}

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
        <span>${message}</span>
        <button class="notification-close">&times;</button>
    `;
    
    // Add styles for notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background: ${type === 'success' ? '#10b981' : '#3b82f6'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        display: flex;
        align-items: center;
        gap: 10px;
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    
    // Add close button event
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.remove();
    });
    
    // Add to body
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

// Initialize pagination
updatePagination();

// Add notification styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        font-size: 20px;
        cursor: pointer;
        margin-left: 10px;
    }
`;
document.head.appendChild(style);