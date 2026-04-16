let orders = JSON.parse(localStorage.getItem('orders')) || [];  // Retrieve orders from localStorage

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
        // Check if order is in new format (has customer) or old format (direct item)
        if (order.customer) {
            // New format
            ordersHTML += `
            <div class="order-item">
                <h3>Order #${index + 1}</h3>
                <p><strong>Customer:</strong> ${order.customer.username} (${order.customer.email})</p>
                <p><strong>Date:</strong> ${new Date(order.date).toLocaleString()}</p>
                <p><strong>Total:</strong> ₱${order.total}</p>
                <h4>Items:</h4>
                <ul>
            `;
            order.items.forEach(item => {
                ordersHTML += `<li>${item.name} - Quantity: ${item.quantity} - Price: ₱${item.price}</li>`;
            });
            ordersHTML += `
                </ul>
                <button onclick="removeOrder(${index})">Remove Order</button>
            </div>
            `;
        } else {
            // Old format - individual item
            ordersHTML += `
            <div class="order-item">
                <h4>${order.name}</h4>
                <p>Quantity: ${order.quantity}</p>
                <p>Price: ₱${order.price}</p>
                <button onclick="removeOrder(${index})">Remove</button>
            </div>
            `;
        }
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