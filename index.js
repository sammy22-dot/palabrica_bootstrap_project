import { chartData } from './data.js'; // make sure file is in the same folder

document.addEventListener('DOMContentLoaded', () => {
    // this the sidebar toggle
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.querySelector('.sidebar');

    sidebarToggle.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
            // Mobile: toggle show/hide
            sidebar.classList.toggle('show');
        } else {
            // Desktop: toggle collapsed
            sidebar.classList.toggle('collapsed');
        }
    });

    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768 && sidebar.classList.contains('show')) {
            if (!sidebar.contains(e.target) && e.target !== sidebarToggle) {
                sidebar.classList.remove('show');
            }
        }
    });

    // Chart.js Helper Function
    function createChart(canvasId, type, label, data, color, labels = null) {
        const ctx = document.getElementById(canvasId).getContext('2d');

        // Destroy previous chart instance if exists
        if (ctx.chart) ctx.chart.destroy();

        ctx.chart = new Chart(ctx, {
            type: type,
            data: {
                labels: labels || data.map((_, i) => i + 1),
                datasets: [{
                    label: label,
                    data: data,
                    backgroundColor: type === 'bar' ? color : 'rgba(0,0,0,0)',
                    borderColor: color,
                    borderWidth: 2,
                    fill: type === 'line' ? false : true,
                    tension: 0.3
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: true },
                    tooltip: { mode: 'index', intersect: false }
                },
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });
    }

    // loads mydata sets from data.php
    function loadCharts() {
        // ===== Charts =====
        createChart('salesChart', 'bar', 'Sales', chartData.sales, '#0d6efd', chartData.months);
        createChart('usersChart', 'line', 'Users', chartData.users, '#198754', chartData.months);

        // ===== Stats Cards =====
        const totalSales = chartData.sales.reduce((sum, val) => sum + val, 0);
        const totalUsers = chartData.users.reduce((sum, val) => sum + val, 0);
        const totalOrders = chartData.orders.reduce((sum, val) => sum + val, 0);
        const totalRevenue = chartData.orders.reduce((sum, val, i) => sum + val * chartData.averageOrderValue[i], 0);

        document.getElementById('totalSales').textContent = `₱${totalSales.toLocaleString()}`;
        document.getElementById('totalUsers').textContent = totalUsers.toLocaleString();
        document.getElementById('totalOrders').textContent = totalOrders.toLocaleString();
        document.getElementById('totalRevenue').textContent = `₱${totalRevenue.toLocaleString()}`;
    }

    // Call it
    loadCharts();
});
