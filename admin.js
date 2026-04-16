let orders = JSON.parse(localStorage.getItem('orders')) || [];  // Retrieve orders from localStorage

// Function to display orders
function displayOrders() {
    const ordersContainer = document.getElementById('orders-list');
    ordersContainer.innerHTML = '';  // Clear current orders display

    if (orders.length === 0) {
        ordersContainer.innerHTML = '<h2>No orders available</h2>';
        return;
    }

    let ordersHTML = '';
    orders.forEach((order, index) => {
        const customerName = order.customerName || order.name || 'Unknown';
        const customerEmail = order.customerEmail || order.email || 'Unknown';
        const date = order.date || 'Unknown date';
        const total = order.total !== undefined ? order.total : order.price || 0;
        const items = order.items || [order];

        let itemsHTML = '';
        items.forEach(item => {
            itemsHTML += `
                <div class="order-item-details">
                    <strong>${item.name}</strong>
                    <p>Quantity: ${item.quantity}</p>
                    <p>Price: ₱${item.price}</p>
                </div>
            `;
        });

        ordersHTML += `
        <div class="order-item">
            <h3>Transaction #${index + 1}</h3>
            <p><strong>Name:</strong> ${customerName}</p>
            <p><strong>Email:</strong> ${customerEmail}</p>
            <p><strong>Date:</strong> ${date}</p>
            <p><strong>Total:</strong> ₱${total}</p>
            <div class="order-items-list">
                ${itemsHTML}
            </div>
            <button onclick="removeOrder(${index})">Remove</button>
        </div>
        `;
    });

    ordersContainer.innerHTML = ordersHTML;
}

// Function to remove an order
function removeOrder(index) {
    orders.splice(index, 1);  // Remove the order from the orders array
    localStorage.setItem('orders', JSON.stringify(orders));  // Update localStorage
    displayOrders();  // Update the orders display
}

// Initial orders display
document.addEventListener('DOMContentLoaded', () => {
    displayOrders();  // Display the current orders on page load
});