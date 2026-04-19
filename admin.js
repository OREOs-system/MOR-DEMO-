let orders = JSON.parse(localStorage.getItem('orders')) || [];  // Retrieve orders from localStorage

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
        ordersHTML += `<td style="border: 1px solid #ddd; padding: 8px;"><button onclick="removeOrder(${index})">Remove</button></td>`;
        ordersHTML += '</tr>';
    });
    ordersHTML += '</table>';

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