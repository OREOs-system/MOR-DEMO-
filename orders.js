// Function to get status information
function getStatusInfo(status) {
    switch (status) {
        case 'new':
            return { label: 'Awaiting Admin Review', class: 'status-awaiting', icon: '⏳' };
        case 'accepted':
            return { label: 'Pending - Getting Ready', class: 'status-pending', icon: '📦' };
        case 'completed':
            return { label: 'Successfully Completed', class: 'status-completed', icon: '✅' };
        case 'cancelled':
            return { label: 'Order Cancelled', class: 'status-cancelled', icon: '❌' };
        default:
            return { label: 'Unknown Status', class: '', icon: '❓' };
    }
}

function normalizeOrders(orders) {
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

// Display welcome message for recent order
function displayWelcomeMessage() {
    const messageElement = document.getElementById('orderMessage');
    const recentOrderTime = sessionStorage.getItem('recentOrderTime');
    
    if (recentOrderTime) {
        const timeDiff = Date.now() - parseInt(recentOrderTime, 10);
        if (timeDiff < 300000) {
            messageElement.innerHTML = `
                <div class="success-box">
                    <h3>✅ Order Placed Successfully!</h3>
                    <p>Your order has been submitted. Track your order status below.</p>
                </div>
            `;
            sessionStorage.removeItem('recentOrderTime');
        }
    }
}

// Display all orders for the current user
function displayOrders() {
    const ordersContainer = document.getElementById('ordersList');
    const username = localStorage.getItem('username');
    const email = localStorage.getItem('email');
    
    if (!username || !email) {
        ordersContainer.innerHTML = `
            <div class="no-orders">
                <p>Please log in to view your orders.</p>
                <button onclick="window.location.href='login.html'" class="btn">Go to Login</button>
            </div>
        `;
        return;
    }
    
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    normalizeOrders(orders);
    const userOrders = orders.filter(order => order.email === email);
    
    if (userOrders.length === 0) {
        ordersContainer.innerHTML = `
            <div class="no-orders">
                <p>You haven't placed any orders yet.</p>
                <button onclick="goCart()" class="btn">Start Shopping</button>
            </div>
        `;
        return;
    }
    
    const groupedOrders = {};
    userOrders.forEach(order => {
        if (!groupedOrders[order.orderId]) {
            groupedOrders[order.orderId] = [];
        }
        groupedOrders[order.orderId].push(order);
    });
    
    let ordersHTML = '';
    
    Object.keys(groupedOrders).reverse().forEach(orderId => {
        const orderGroup = groupedOrders[orderId];
        const firstOrder = orderGroup[0];
        const statusInfo = getStatusInfo(firstOrder.status);
        const totalPrice = orderGroup.reduce((sum, order) => sum + order.price, 0);
        
        ordersHTML += `
            <div class="order-card">
                <div class="order-header">
                    <div class="order-id-section">
                        <h3>Order #${orderId}</h3>
                        <p class="order-date">${firstOrder.date || 'N/A'}</p>
                    </div>
                    <div class="status-badge ${statusInfo.class}">
                        <span class="status-icon">${statusInfo.icon}</span>
                        <span class="status-label">${statusInfo.label}</span>
                    </div>
                </div>
                
                <div class="order-items">
                    <h4>Items:</h4>
        `;
        
        orderGroup.forEach(order => {
            ordersHTML += `
                <div class="order-item">
                    <span class="item-name">${order.product}</span>
                    <span class="item-qty">Qty: ${order.quantity}</span>
                    <span class="item-price">₱${order.price}</span>
                </div>
            `;
        });
        
        ordersHTML += `
                </div>
                
                <div class="order-footer">
                    <div class="order-total">
                        <strong>Total: ₱${totalPrice}</strong>
                    </div>
                    <div class="order-actions">
                        <button onclick="viewOrderDetails('${orderId}')" class="btn-details">View Details</button>
                        ${firstOrder.status === 'new' ? `<button onclick="cancelOrder('${orderId}')" class="btn-cancel">Cancel Order</button>` : ''}
                    </div>
                </div>
            </div>
        `;
    });
    
    ordersContainer.innerHTML = ordersHTML;
}

function cancelOrder(orderId) {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const orderGroup = orders.filter(order => order.orderId === orderId);
    if (orderGroup.length === 0) {
        alert('Order not found.');
        return;
    }
    const firstOrder = orderGroup[0];
    if (firstOrder.status !== 'new') {
        alert('This order cannot be cancelled after the admin has reviewed it.');
        return;
    }
    orders.forEach(order => {
        if (order.orderId === orderId) {
            order.status = 'cancelled';
        }
    });
    localStorage.setItem('orders', JSON.stringify(orders));
    displayOrders();
    alert('Your order has been cancelled.');
}

// View detailed information for a specific order
function viewOrderDetails(orderId) {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const orderDetails = orders.filter(order => order.orderId === orderId);
    
    if (orderDetails.length === 0) {
        alert('Order not found');
        return;
    }
    
    const firstOrder = orderDetails[0];
    const statusInfo = getStatusInfo(firstOrder.status);
    const totalPrice = orderDetails.reduce((sum, order) => sum + order.price, 0);
    
    let detailsText = `
ORDER DETAILS
=============
Order ID: ${orderId}
Date: ${firstOrder.date || 'N/A'}
Customer: ${firstOrder.name}
Email: ${firstOrder.email}

Status: ${statusInfo.label}

Payment Method: ${firstOrder.paymentMethod || 'N/A'}
${firstOrder.gcashNumber ? `GCash Number: ${firstOrder.gcashNumber}` : ''}
${firstOrder.paymentReference && firstOrder.paymentReference !== 'N/A' ? `Reference: ${firstOrder.paymentReference}` : ''}
${firstOrder.paymentAmount ? `Payment Amount: ₱${firstOrder.paymentAmount}` : ''}

Items:
`;
    
    orderDetails.forEach((order, index) => {
        detailsText += `\n${index + 1}. ${order.product}
   Quantity: ${order.quantity}
   Price: ₱${order.price}`;
    });
    
    detailsText += `\n\nTotal Price: ₱${totalPrice}`;
    
    // Create a modal or alert to display details
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-btn" onclick="this.closest('.modal').remove()">&times;</span>
            <h2>Order Details</h2>
            <div class="modal-body">
                <p><strong>Order ID:</strong> ${orderId}</p>
                <p><strong>Date:</strong> ${firstOrder.date || 'N/A'}</p>
                <p><strong>Customer:</strong> ${firstOrder.name}</p>
                <p><strong>Email:</strong> ${firstOrder.email}</p>
                <p><strong>Status:</strong> <span class="${statusInfo.class}">${statusInfo.label}</span></p>
                
                <h3>Items:</h3>
                <table class="details-table">
                    <tr>
                        <th>Product</th>
                        <th>Quantity</th>
                        <th>Price</th>
                    </tr>
    `;
    
    orderDetails.forEach(order => {
        modal.innerHTML += `
            <tr>
                <td>${order.product}</td>
                <td>${order.quantity}</td>
                <td>₱${order.price}</td>
            </tr>
        `;
    });
    
    modal.innerHTML += `
                </table>
                <p class="total"><strong>Total Price: ₱${totalPrice}</strong></p>
            </div>
            <button onclick="this.closest('.modal').remove()" class="btn-close">Close</button>
        </div>
    `;
    
    document.body.appendChild(modal);
}

// Navigation functions
function goHome() {
    window.location.href = 'mainpage.html';
}

function goCart() {
    window.location.href = 'mainpage.html';
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    displayWelcomeMessage();
    displayOrders();
});
