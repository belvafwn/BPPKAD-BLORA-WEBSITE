// Global variables
let currentChart = null;
let currentData = [];

// Utility Functions
function formatRupiah(amount) {
    if (!amount || amount === 0) return 'Rp 0';
    
    const number = parseFloat(amount);
    if (isNaN(number)) return 'Rp 0';
    
    // Convert to billions if amount is large
    if (number >= 1000000000) {
        return 'Rp ' + (number / 1000000000).toFixed(1) + ' M';
    } else if (number >= 1000000) {
        return 'Rp ' + (number / 1000000).toFixed(1) + ' Jt';
    } else if (number >= 1000) {
        return 'Rp ' + (number / 1000).toFixed(0) + ' Rb';
    }
    
    return 'Rp ' + number.toLocaleString('id-ID');
}

function parseRupiah(str) {
    if (!str) return 0;
    // Remove all non-digit characters except dots and commas
    return parseFloat(str.toString().replace(/[^\d.-]/g, '')) || 0;
}

function showAlert(message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;
    
    // Insert at the beginning of main content
    const mainContent = document.querySelector('.main-content .container');
    if (mainContent) {
        mainContent.insertBefore(alertDiv, mainContent.firstChild);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            alertDiv.remove();
        }, 5000);
    }
}

function hideAlert() {
    const alerts = document.querySelectorAll('.alert');
    alerts.forEach(alert => alert.remove());
}

// Chart Functions
function createBarChart(canvasId, data, options = {}) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return null;
    
    // Destroy existing chart
    if (currentChart) {
        currentChart.destroy();
    }
    
    const defaultOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: !!options.title,
                text: options.title || ''
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: function(value) {
                        return formatRupiah(value);
                    }
                }
            },
            x: {
                ticks: {
                    maxRotation: 45,
                    minRotation: 0
                }
            }
        }
    };
    
    const chartOptions = { ...defaultOptions, ...options.chartOptions };
    
    currentChart = new Chart(ctx, {
        type: 'bar',
        data: data,
        options: chartOptions
    });
    
    return currentChart;
}

function createLineChart(canvasId, data, options = {}) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return null;
    
    // Destroy existing chart
    if (currentChart) {
        currentChart.destroy();
    }
    
    const defaultOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: !!options.title,
                text: options.title || ''
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: function(value) {
                        return formatRupiah(value);
                    }
                }
            }
        }
    };
    
    const chartOptions = { ...defaultOptions, ...options.chartOptions };
    
    currentChart = new Chart(ctx, {
        type: 'line',
        data: data,
        options: chartOptions
    });
    
    return currentChart;
}

// Data Processing Functions
function processDataForChart(data, kategori) {
    if (!data || data.length === 0) return null;
    
    // Group by subcategory
    const groupedData = {};
    data.forEach(item => {
        if (item.kategori === kategori) {
            const key = item.subkategori;
            if (!groupedData[key]) {
                groupedData[key] = {
                    anggaran: 0,
                    realisasi: 0,
                    items: []
                };
            }
            groupedData[key].anggaran += parseFloat(item.anggaran || 0);
            groupedData[key].realisasi += parseFloat(item.realisasi || 0);
            groupedData[key].items.push(item);
        }
    });
    
    const labels = Object.keys(groupedData);
    const anggaranData = labels.map(label => groupedData[label].anggaran);
    const realisasiData = labels.map(label => groupedData[label].realisasi);
    
    return {
        labels: labels,
        datasets: [
            {
                label: 'Anggaran',
                data: anggaranData,
                backgroundColor: 'rgba(54, 162, 235, 0.8)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            },
            {
                label: 'Realisasi',
                data: realisasiData,
                backgroundColor: 'rgba(75, 192, 192, 0.8)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }
        ]
    };
}

function processDataForTrendChart(data, kategori) {
    if (!data || data.length === 0) return null;
    
    const years = [2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024];
    const filteredData = data.filter(item => item.kategori === kategori);
    
    // Group by year
    const yearlyData = {};
    years.forEach(year => {
        yearlyData[year] = {
            anggaran: 0,
            realisasi: 0
        };
    });
    
    filteredData.forEach(item => {
        const year = parseInt(item.tahun);
        if (yearlyData[year]) {
            yearlyData[year].anggaran += parseFloat(item.anggaran || 0);
            yearlyData[year].realisasi += parseFloat(item.realisasi || 0);
        }
    });
    
    const anggaranData = years.map(year => yearlyData[year].anggaran);
    const realisasiData = years.map(year => yearlyData[year].realisasi);
    
    return {
        labels: years,
        datasets: [
            {
                label: 'Anggaran',
                data: anggaranData,
                borderColor: 'rgba(54, 162, 235, 1)',
                backgroundColor: 'rgba(54, 162, 235, 0.1)',
                fill: false,
                tension: 0.1
            },
            {
                label: 'Realisasi',
                data: realisasiData,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.1)',
                fill: false,
                tension: 0.1
            }
        ]
    };
}

// Data Table Functions
function createDataTable(containerId, data, kategori) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const filteredData = data.filter(item => item.kategori === kategori);
    
    if (filteredData.length === 0) {
        container.innerHTML = `
            <div class="alert alert-info">
                Belum ada data untuk kategori ${kategori}
            </div>
        `;
        return;
    }
    
    let tableHTML = `
        <div class="data-table">
            <table>
                <thead>
                    <tr>
                        <th>Tahun</th>
                        <th>Subkategori</th>
                        <th>Isi Subkategori</th>
                        <th>Anggaran</th>
                        <th>Realisasi</th>
                        <th>Persentase</th>
                        <th>Aksi</th>
                    </tr>
                </thead>
                <tbody>
    `;
    
    filteredData.forEach(item => {
        const anggaran = parseFloat(item.anggaran || 0);
        const realisasi = parseFloat(item.realisasi || 0);
        const persentase = anggaran > 0 ? ((realisasi / anggaran) * 100).toFixed(2) : 0;
        
        tableHTML += `
            <tr>
                <td>${item.tahun}</td>
                <td>${item.subkategori}</td>
                <td>${item.isi_subkategori || '-'}</td>
                <td>${formatRupiah(anggaran)}</td>
                <td>${formatRupiah(realisasi)}</td>
                <td>${persentase}%</td>
                <td>
                    <button class="btn btn-danger btn-small" onclick="confirmDelete(${item.id})">
                        Hapus
                    </button>
                </td>
            </tr>
        `;
    });
    
    tableHTML += `
                </tbody>
            </table>
        </div>
    `;
    
    container.innerHTML = tableHTML;
}

// Delete Functions
async function confirmDelete(id) {
    if (confirm('Apakah Anda yakin ingin menghapus data ini?')) {
        try {
            await deleteApbdData(id);
            showAlert('Data berhasil dihapus!', 'success');
            // Reload the current page data
            location.reload();
        } catch (error) {
            showAlert('Gagal menghapus data: ' + error.message, 'error');
        }
    }
}

// Form Functions
function setupForm() {
    const form = document.getElementById('apbdForm');
    if (!form) return;
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(form);
        const data = {
            kategori: formData.get('kategori'),
            subkategori: formData.get('subkategori'),
            isi_subkategori: formData.get('isi_subkategori'),
            tahun: formData.get('tahun'),
            anggaran: formData.get('anggaran'),
            realisasi: formData.get('realisasi')
        };
        
        // Validate required fields
        if (!data.kategori || !data.subkategori || !data.tahun) {
            showAlert('Kategori, Subkategori, dan Tahun harus diisi!', 'error');
            return;
        }
        
        try {
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.innerHTML = '<span class="loading"></span> Menyimpan...';
            submitBtn.disabled = true;
            
            await addApbdData(data);
            showAlert('Data berhasil ditambahkan!', 'success');
            form.reset();
            
            // Reload data if we're on a category page
            if (typeof loadCategoryData === 'function') {
                setTimeout(() => loadCategoryData(), 1000);
            }
            
        } catch (error) {
            showAlert('Gagal menambahkan data: ' + error.message, 'error');
        } finally {
            const submitBtn = form.querySelector('button[type="submit"]');
            submitBtn.textContent = 'Tambah Data';
            submitBtn.disabled = false;
        }
    });
}

// Navigation Functions
function setActiveNavigation(currentPage) {
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
}

// Auto-set active navigation based on current page
document.addEventListener('DOMContentLoaded', function() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    setActiveNavigation(currentPage);
    setupForm();
});

// Export functions for global access
window.chartUtils = {
    createBarChart,
    createLineChart,
    processDataForChart,
    processDataForTrendChart,
    createDataTable,
    confirmDelete
};

// Loading state management
function showLoading(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = '<div class="text-center"><span class="loading"></span> Memuat data...</div>';
    }
}

function hideLoading(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        const loadingDiv = element.querySelector('.loading');
        if (loadingDiv && loadingDiv.parentElement) {
            loadingDiv.parentElement.remove();
        }
    }
}