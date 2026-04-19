let orders = JSON.parse(localStorage.getItem('orders')) || [];

function normalizeOrders() {
    let changed = false;
    orders.forEach((order, index) => {
        if (!order.orderId) {
            order.orderId = `legacy_${order.email || 'guest'}_${order.date || index}_${index}`;
            changed = true;
        }
        if (!order.status) {
            order.status = 'new';
            changed = true;
        }
    });
    if (changed) {
        localStorage.setItem('orders', JSON.stringify(orders));
    }
}

function getStatusInfo(status) {
    switch (status) {
        case 'new':
            return { label: 'Awaiting Admin Review', class: 'status-awaiting', icon: '⏳' };
        case 'accepted':
            return { label: 'Accepted - Pending', class: 'status-pending', icon: '📦' };
        case 'completed':
            return { label: 'Completed', class: 'status-completed', icon: '✅' };
        case 'cancelled':
            return { label: 'Cancelled', class: 'status-cancelled', icon: '❌' };
        default:
            return { label: 'Unknown Status', class: '', icon: '❓' };
    }
}

function displayOrders() {
    orders = JSON.parse(localStorage.getItem('orders')) || [];
    normalizeOrders();

    const ordersContainer = document.getElementById('orders-list');
    ordersContainer.innerHTML = '';

    if (orders.length === 0) {
        ordersContainer.innerHTML = '<h2>No orders available</h2>';
        return;
    }

    const groupedOrders = {};
    orders.forEach(order => {
        if (!groupedOrders[order.orderId]) {
            groupedOrders[order.orderId] = [];
        }
        groupedOrders[order.orderId].push(order);
    });

    let ordersHTML = '<div class="admin-orders">';
    Object.keys(groupedOrders).reverse().forEach(orderId => {
        const orderGroup = groupedOrders[orderId];
        const firstOrder = orderGroup[0];
        const statusInfo = getStatusInfo(firstOrder.status);
        const totalPrice = orderGroup.reduce((sum, order) => sum + order.price, 0);

        ordersHTML += `
            <div class="admin-order-card">
                <div class="admin-order-header">
                    <div>
                        <h3>Order #${orderId}</h3>
                        <p><strong>Customer:</strong> ${firstOrder.name || 'N/A'}</p>
                        <p><strong>Email:</strong> ${firstOrder.email || 'N/A'}</p>
                        <p><strong>Date:</strong> ${firstOrder.date || 'N/A'}</p>
                    </div>
                    <div class="status-badge ${statusInfo.class}">
                        <span class="status-icon">${statusInfo.icon}</span>
                        <span class="status-label">${statusInfo.label}</span>
                    </div>
                </div>
                <div class="admin-order-items">
                    <table style="width:100%; border-collapse: collapse;">
                        <tr>
                            <th style="text-align:left; padding:8px; border-bottom:1px solid #ddd;">Product</th>
                            <th style="text-align:left; padding:8px; border-bottom:1px solid #ddd;">Quantity</th>
                            <th style="text-align:left; padding:8px; border-bottom:1px solid #ddd;">Price</th>
                        </tr>
        `;

        orderGroup.forEach(order => {
            ordersHTML += `
                        <tr>
                            <td style="padding:8px; border-bottom:1px solid #eee;">${order.product || 'N/A'}</td>
                            <td style="padding:8px; border-bottom:1px solid #eee;">${order.quantity || 'N/A'}</td>
                            <td style="padding:8px; border-bottom:1px solid #eee;">₱${order.price || 0}</td>
                        </tr>
            `;
        });

        ordersHTML += `
                        <tr>
                            <td colspan="2" style="padding:8px; text-align:right; font-weight:bold;">Total</td>
                            <td style="padding:8px; font-weight:bold;">₱${totalPrice}</td>
                        </tr>
                    </table>
                </div>
                <div class="admin-order-actions">
                    ${firstOrder.status === 'new' ? `<button class="btn-accept" onclick="updateOrderStatus('${orderId}', 'accepted')">Accept</button> <button class="btn-refuse" onclick="updateOrderStatus('${orderId}', 'cancelled')">Refuse</button>` : ''}
                    ${firstOrder.status === 'accepted' ? `<button class="btn-complete" onclick="updateOrderStatus('${orderId}', 'completed')">Mark Done</button>` : ''}
                    ${firstOrder.status !== 'new' && firstOrder.status !== 'accepted' ? `<span class="admin-info">No actions available for this order.</span>` : ''}
                </div>
            </div>
        `;
    });
    ordersHTML += '</div>';

    ordersContainer.innerHTML = ordersHTML;
}

function updateOrderStatus(orderId, newStatus) {
    orders = JSON.parse(localStorage.getItem('orders')) || [];
    const orderGroup = orders.filter(order => order.orderId === orderId);
    if (orderGroup.length === 0) {
        alert('Order not found.');
        return;
    }
    const currentStatus = orderGroup[0].status;
    if (currentStatus === 'cancelled' || currentStatus === 'completed') {
        alert('This order is already closed and cannot be updated.');
        return;
    }
    if (newStatus === 'accepted' && currentStatus !== 'new') {
        alert('Only new orders can be accepted.');
        return;
    }
    if (newStatus === 'completed' && currentStatus !== 'accepted') {
        alert('Only accepted orders can be marked as done.');
        return;
    }

    orders.forEach(order => {
        if (order.orderId === orderId) {
            order.status = newStatus;
        }
    });
    localStorage.setItem('orders', JSON.stringify(orders));
    displayOrders();
}

// Clear all transaction history
function clearTransactionHistory() {
    const confirmClear = confirm(
        'WARNING: This will delete ALL transaction history.\n\n' +
        'Are you sure you want to proceed? This action cannot be undone.'
    );

    if (!confirmClear) {
        return;
    }

    const confirmAgain = confirm(
        'Are you absolutely sure? All order data will be permanently deleted.'
    );

    if (!confirmAgain) {
        return;
    }

    // Clear orders from localStorage
    localStorage.removeItem('orders');
    orders = [];

    alert('✅ Transaction history cleared successfully!\n\nAll orders have been deleted.');
    
    // Refresh the display
    displayOrders();
}

// Initial orders display
document.addEventListener('DOMContentLoaded', () => {
    displayOrders();
});