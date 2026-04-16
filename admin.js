let orders = JSON.parse(localStorage.getItem('orders')) || [];  // Retrieve orders from localStorage
orders = orders.map(order => ({ ...order, status: order.status || 'new' }));

function getStatusLabel(status) {
    switch (status) {
        case 'new':
            return 'Awaiting Admin';
        case 'accepted':
            return 'Pending';
        case 'completed':
            return 'Completed';
        case 'cancelled':
            return 'Cancelled';
        default:
            return 'Unknown';
    }
}

// Function to display orders
function displayOrders() {
    const ordersContainer = document.getElementById('orders-list');
    ordersContainer.innerHTML = '';  // Clear current orders display

    if (orders.length === 0) {
        ordersContainer.innerHTML = '<h2>No orders available</h2>';
        return;
    }

    let ordersHTML = '<table style="width:100%; border-collapse: collapse;">';
    ordersHTML += '<tr style="border: 1px solid #ddd; padding: 8px;">';
    ordersHTML += '<th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Name</th>';
    ordersHTML += '<th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Email</th>';
    ordersHTML += '<th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Date</th>';
    ordersHTML += '<th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Product</th>';
    ordersHTML += '<th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Quantity</th>';
    ordersHTML += '<th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Price</th>';
    ordersHTML += '<th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Status</th>';
    ordersHTML += '<th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Action</th>';
    ordersHTML += '</tr>';
    
    orders.forEach((order, index) => {
        ordersHTML += '<tr style="border: 1px solid #ddd;">';
        ordersHTML += `<td style="border: 1px solid #ddd; padding: 8px;">${order.name || 'N/A'}</td>`;
        ordersHTML += `<td style="border: 1px solid #ddd; padding: 8px;">${order.email || 'N/A'}</td>`;
        ordersHTML += `<td style="border: 1px solid #ddd; padding: 8px;">${order.date || 'N/A'}</td>`;
        ordersHTML += `<td style="border: 1px solid #ddd; padding: 8px;">${order.product || order.name || 'N/A'}</td>`;
        ordersHTML += `<td style="border: 1px solid #ddd; padding: 8px;">${order.quantity || 'N/A'}</td>`;
        ordersHTML += `<td style="border: 1px solid #ddd; padding: 8px;">₱${order.price || 'N/A'}</td>`;
        ordersHTML += `<td style="border: 1px solid #ddd; padding: 8px;">${getStatusLabel(order.status)}</td>`;

        let actionHTML = '';
        if (order.status === 'new') {
            actionHTML = `<button onclick="acceptOrder(${index})">Accept</button> <button onclick="refuseOrder(${index})">Refuse</button>`;
        } else if (order.status === 'accepted') {
            actionHTML = `<button onclick="completeOrder(${index})">Done</button>`;
        } else {
            actionHTML = `<span style="font-weight: bold;">${getStatusLabel(order.status)}</span>`;
        }

        ordersHTML += `<td style="border: 1px solid #ddd; padding: 8px;">${actionHTML}</td>`;
        ordersHTML += '</tr>';
    });
    ordersHTML += '</table>';

    ordersContainer.innerHTML = ordersHTML;
}

function saveOrders() {
    localStorage.setItem('orders', JSON.stringify(orders));
}

function acceptOrder(index) {
    orders[index].status = 'accepted';
    saveOrders();
    displayOrders();
}

function refuseOrder(index) {
    orders[index].status = 'cancelled';
    saveOrders();
    displayOrders();
}

function completeOrder(index) {
    orders[index].status = 'completed';
    saveOrders();
    displayOrders();
}

// Initial orders display
document.addEventListener('DOMContentLoaded', () => {
    displayOrders();  // Display the current orders on page load
});
