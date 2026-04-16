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
        <button onclick="checkout()">Checkout</button>
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

// Checkout functionality
function checkout() {
    alert('Proceeding to checkout');

    const customerName = localStorage.getItem('username') || 'Guest';
    const customerEmail = localStorage.getItem('email') || '';
    const transactionDate = new Date().toLocaleString();

    const order = {
        customerName,
        customerEmail,
        date: transactionDate,
        items: [...cart],
        total: totalPrice
    };

    let orders = JSON.parse(localStorage.getItem('orders')) || [];
    orders.push(order);  // Add current order to orders
    localStorage.setItem('orders', JSON.stringify(orders));  // Save orders to localStorage

    localStorage.removeItem('cart');  // Clear the cart in localStorage
    cart = [];  // Reset the cart array
    totalPrice = 0;  // Reset total price
    updateCartAmount();  // Update the cart icon count
    updateCartDisplay();  // Update the cart display
    window.location.href = "admin.html";
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
