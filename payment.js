// Get cart data from sessionStorage (passed from cart.js)
let cart = JSON.parse(sessionStorage.getItem('paymentCart')) || [];
let totalPrice = cart.reduce((total, item) => total + item.price, 0);

// Display order summary
function displayOrderSummary() {
    const orderItemsContainer = document.getElementById('orderItems');
    const totalAmountElement = document.getElementById('totalAmount');
    const amountInput = document.getElementById('amount');

    let itemsHTML = '';
    cart.forEach(item => {
        itemsHTML += `
            <div class="order-item">
                <span class="item-name">${item.name}</span>
                <span class="item-qty">Qty: ${item.quantity}</span>
                <span class="item-price">₱${item.price}</span>
            </div>
        `;
    });

    orderItemsContainer.innerHTML = itemsHTML;
    totalAmountElement.textContent = totalPrice;
    amountInput.value = totalPrice;
}

// Handle payment form submission
document.getElementById('gcashForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const gcashNumber = document.getElementById('gcashNumber').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const reference = document.getElementById('reference').value;

    // Validate GCash number format
    if (!/^09\d{9}$/.test(gcashNumber)) {
        alert('Please enter a valid GCash mobile number (09XXXXXXXXX)');
        return;
    }

    // Validate amount matches total
    if (amount !== totalPrice) {
        alert('Payment amount must match the total order amount.');
        return;
    }

    // Simulate GCash payment process
    if (confirm(`Confirm payment of ₱${amount} using GCash number ${gcashNumber}?`)) {
        // Simulate payment processing
        alert('Redirecting to GCash for payment...');

        // In a real implementation, this would redirect to GCash API
        // For demo purposes, we'll simulate a successful payment after a delay
        setTimeout(() => {
            processSuccessfulPayment(gcashNumber, amount, reference);
        }, 2000);
    }
});

function processSuccessfulPayment(gcashNumber, amount, reference) {
    // Simulate successful payment
    alert('Payment successful! Processing your order...');

    // Get user delivery information
    const user = JSON.parse(localStorage.getItem('user')) || {};
    const username = user.username || localStorage.getItem('username');
    const email = user.email || localStorage.getItem('email');
    const deliveryAddress = user.address || '';
    const deliveryCity = user.city || '';
    const deliveryZip = user.zipCode || '';
    const latitude = user.latitude || null;
    const longitude = user.longitude || null;

    if (!username || !email) {
        alert('User information not found. Please login again.');
        window.location.href = 'login.html';
        return;
    }

    if (!latitude || !longitude) {
        alert('Delivery location not set. Please complete delivery address first.');
        window.location.href = 'delivery.html';
        return;
    }

    const currentDate = new Date().toLocaleString();
    const orderId = generateOrderId();

    let orders = JSON.parse(localStorage.getItem('orders')) || [];
    cart.forEach(item => {
        orders.push({
            orderId,
            name: username,
            email: email,
            date: currentDate,
            product: item.name,
            quantity: item.quantity,
            price: item.price,
            status: 'new',
            paymentMethod: 'GCash',
            gcashNumber: gcashNumber,
            paymentReference: reference || 'N/A',
            paymentAmount: amount,
            deliveryAddress: deliveryAddress,
            deliveryCity: deliveryCity,
            deliveryZip: deliveryZip,
            latitude: latitude,
            longitude: longitude
        });
    });

    localStorage.setItem('orders', JSON.stringify(orders));
    sessionStorage.setItem('recentOrderTime', Date.now().toString());

    // Clear cart and payment data
    localStorage.removeItem('cart');
    sessionStorage.removeItem('paymentCart');

    // Redirect to orders page
    window.location.href = 'orders.html';
}

function generateOrderId() {
    return `order_${Date.now()}_${Math.floor(Math.random() * 100000)}`;
}

function cancelPayment() {
    if (confirm('Are you sure you want to cancel the payment? Your cart will be restored.')) {
        // Restore cart from sessionStorage back to localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
        sessionStorage.removeItem('paymentCart');
        window.location.href = 'cart.html';
    }
}

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    // Check if coming from delivery page with payment method
    const paymentMethod = sessionStorage.getItem('paymentMethod');
    
    if (paymentMethod === 'cash') {
        // If somehow we got here with COD selected, redirect back
        alert('Please complete your delivery address information.');
        window.location.href = 'delivery.html';
        return;
    }
    
    // Clear payment method from session
    sessionStorage.removeItem('paymentMethod');
    
    if (cart.length === 0) {
        alert('No items to pay for. Redirecting to cart.');
        window.location.href = 'cart.html';
        return;
    }

    displayOrderSummary();
});