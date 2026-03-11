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
    async function loadCharts() {
        try {
            const response = await fetch('data.php');
            if (!response.ok) throw new Error('Network response was not ok');

            const data = await response.json();

            // Charts
            createChart('salesChart', 'bar', 'Sales', data.sales, '#0d6efd', data.months);
            createChart('usersChart', 'line', 'Users', data.users, '#198754', data.months);

            // Stats Cards
            const totalSales = data.sales.reduce((sum, val) => sum + val, 0);
            const totalUsers = data.users.reduce((sum, val) => sum + val, 0);
            const totalOrders = data.orders.reduce((sum, val) => sum + val, 0);
            const totalRevenue = data.orders.reduce((sum, val, i) => sum + val * data.averageOrderValue[i], 0);

            // Update DOM
            document.getElementById('totalSales').textContent = `₱${totalSales.toLocaleString()}`;
            document.getElementById('totalUsers').textContent = totalUsers.toLocaleString();
            document.getElementById('totalOrders').textContent = totalOrders.toLocaleString();
            document.getElementById('totalRevenue').textContent = `₱${totalRevenue.toLocaleString()}`;

        } catch (err) {
            console.error('Failed to load chart data:', err);
        }
    }

    // Call loadCharts
    loadCharts();
});