let cart = JSON.parse(localStorage.getItem('cart')) || [];  // Retrieve the cart from localStorage
let totalPrice = cart.reduce((total, item) => total + item.price, 0);

// Function to update the cart amount in the navbar
function updateCartAmount() {
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    document.getElementById('cartAmount').textContent = cartCount;  // Update the cart item count
}

// Function to display cart items and total price
function updateCartDisplay() {
    const cartItemsContainer = document.getElementById('shopping-cart');
    cartItemsContainer.innerHTML = '';  // Clear current cart display

    if (cart.length === 0) {
        document.getElementById('label').innerHTML = `
            <h2>Your cart is empty</h2>
            <a href="mainpage.html">
                <button class='homeBtn'>Back to Home</button>
            </a>
        `;
        return;
    }

    let cartHTML = '';
    cart.forEach(item => {
        cartHTML += `
        <div class="cart-item">
            <h4>${item.name}</h4>
            <p>Quantity: ${item.quantity}</p>
            <p>Price: ₱${item.price}</p>
            <button onclick="removeItem('${item.name}')">Remove</button>
        </div>
        `;
    });

    document.getElementById('shopping-cart').innerHTML = cartHTML;
    document.getElementById('label').innerHTML = `
        <h2>Total: ₱${totalPrice}</h2>
        <div class="payment-options">
            <h3>Choose Payment Method</h3>
            <div class="payment-methods">
                <button onclick="selectPaymentMethod('online')" class="payment-btn online-btn">
                    <i class="bi bi-phone"></i> Online Payment (GCash)
                </button>
                <button onclick="selectPaymentMethod('cash')" class="payment-btn cash-btn">
                    <i class="bi bi-cash"></i> Cash on Delivery
                </button>
            </div>
        </div>
        <button onclick="clearCart()">Clear Cart</button>
    `;
}

// Function to add items to the cart
function addToCart(itemName, quantity, price) {
    const itemTotal = quantity * price;
    const existingItem = cart.find(item => item.name === itemName);

    if (existingItem) {
        existingItem.quantity += parseInt(quantity);
        existingItem.price += itemTotal;
    } else {
        cart.push({ name: itemName, quantity: parseInt(quantity), price: itemTotal });
    }

    totalPrice += itemTotal;
    localStorage.setItem('cart', JSON.stringify(cart));  // Save to local storage
    updateCartAmount();  // Update the cart icon count
    updateCartDisplay();  // Update the cart display
}

// Function to remove items from the cart
function removeItem(itemName) {
    const itemIndex = cart.findIndex(item => item.name === itemName);
    if (itemIndex !== -1) {
        cart.splice(itemIndex, 1);  // Remove the item from the cart
        localStorage.setItem('cart', JSON.stringify(cart));  // Update localStorage
        totalPrice = cart.reduce((total, item) => total + item.price, 0);  // Recalculate total price
        updateCartAmount();  // Update the cart icon count
        updateCartDisplay();  // Update the cart display
    }
}

function generateOrderId() {
    return `order_${Date.now()}_${Math.floor(Math.random() * 100000)}`;
}

// Checkout functionality
// Function to handle payment method selection
function selectPaymentMethod(method) {
    if (cart.length === 0) {
        alert('Your cart is empty. Add items before selecting payment method.');
        return;
    }

    const username = localStorage.getItem('username');
    const email = localStorage.getItem('email');

    if (!username || !email) {
        alert('User information not found. Please login again.');
        window.location.href = 'login.html';
        return;
    }

    if (method === 'online') {
        // Store cart in sessionStorage for payment page
        sessionStorage.setItem('paymentCart', JSON.stringify(cart));
        // Redirect to payment page
        window.location.href = 'payment.html';
    } else if (method === 'cash') {
        // Process Cash on Delivery directly
        processCashOnDelivery();
    }
}
//
// Process Cash on Delivery order
function processCashOnDelivery() {
    const username = localStorage.getItem('username');
    const email = localStorage.getItem('email');
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
            paymentMethod: 'Cash on Delivery',
            paymentAmount: item.price
        });
    });

    localStorage.setItem('orders', JSON.stringify(orders));
    sessionStorage.setItem('recentOrderTime', Date.now().toString());

    localStorage.removeItem('cart');
    cart = [];
    totalPrice = 0;
    updateCartAmount();
    updateCartDisplay();

    alert('Order placed successfully! You will pay ₱' + totalPrice + ' in cash upon delivery.');
    window.location.href = 'orders.html';
}
//
function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty. Add items before checking out.');
        return;
    }

    const username = localStorage.getItem('username');
    const email = localStorage.getItem('email');

    if (!username || !email) {
        alert('User information not found. Please login again.');
        window.location.href = 'login.html';
        return;
    }

    // Store cart in sessionStorage for payment page
    sessionStorage.setItem('paymentCart', JSON.stringify(cart));

    // Redirect to payment page
    window.location.href = 'payment.html';
}

// Function to handle payment method selection
function selectPaymentMethod(method) {
    if (cart.length === 0) {
        alert('Your cart is empty. Add items before selecting payment method.');
        return;
    }

    const username = localStorage.getItem('username');
    const email = localStorage.getItem('email');

    if (!username || !email) {
        alert('User information not found. Please login again.');
        window.location.href = 'login.html';
        return;
    }

    if (method === 'online') {
        // Store cart in sessionStorage for payment page
        sessionStorage.setItem('paymentCart', JSON.stringify(cart));
        // Redirect to payment page
        window.location.href = 'payment.html';
    } else if (method === 'cash') {
        // Process Cash on Delivery directly
        processCashOnDelivery();
    }
}

// Process Cash on Delivery order
function processCashOnDelivery() {
    const username = localStorage.getItem('username');
    const email = localStorage.getItem('email');
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
            paymentMethod: 'Cash on Delivery',
            paymentAmount: item.price
        });
    });

    localStorage.setItem('orders', JSON.stringify(orders));
    sessionStorage.setItem('recentOrderTime', Date.now().toString());

    localStorage.removeItem('cart');
    cart = [];
    totalPrice = 0;
    updateCartAmount();
    updateCartDisplay();

    alert('Order placed successfully! You will pay ₱' + totalPrice + ' in cash upon delivery.');
    window.location.href = 'orders.html';
}

// Clear Cart functionality
function clearCart() {
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));  // Update localStorage
    totalPrice = 0;  // Reset total price
    updateCartAmount();  // Update the cart icon count
    updateCartDisplay();  // Update the cart display
}

// Initial cart display and update
document.addEventListener('DOMContentLoaded', () => {
    updateCartAmount();  // Update the cart item count on page load
    updateCartDisplay();  // Display the current cart items and total price
});
