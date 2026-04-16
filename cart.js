let cart = JSON.parse(localStorage.getItem('cart')) || [];
let totalPrice = cart.reduce((total, item) => total + item.price, 0);

function getCurrentUser() {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    return {
        username: storedUser?.username || localStorage.getItem('username') || 'Guest',
        email: storedUser?.email || localStorage.getItem('email') || ''
    };
}

// Function to update the cart amount in the navbar
function updateCartAmount() {
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    const cartAmount = document.getElementById('cartAmount');
    if (cartAmount) {
        cartAmount.textContent = cartCount;
    }
}

// Function to display cart items and total price
function updateCartDisplay() {
    const cartItemsContainer = document.getElementById('shopping-cart');
    const labelContainer = document.getElementById('label');
    if (!cartItemsContainer || !labelContainer) {
        return;
    }

    cartItemsContainer.innerHTML = '';  // Clear current cart display

    if (cart.length === 0) {
        labelContainer.innerHTML = `
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

    cartItemsContainer.innerHTML = cartHTML;
    labelContainer.innerHTML = `
        <h2>Total: ₱${totalPrice}</h2>
        <button onclick="checkout()">Checkout</button>
        <button onclick="clearCart()">Clear Cart</button>
    `;
}

// Function to add items to the cart
function addToCart(itemName, quantity, price) {
    quantity = parseInt(quantity, 10) || 1;
    price = Number(price) || 0;
    const itemTotal = quantity * price;
    const existingItem = cart.find(item => item.name === itemName);

    if (existingItem) {
        existingItem.quantity += quantity;
        existingItem.price += itemTotal;
    } else {
        cart.push({ name: itemName, quantity, price: itemTotal });
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
    if (cart.length === 0) {
        alert('Your cart is empty. Add items before checking out.');
        return;
    }

    const currentUser = getCurrentUser();
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const orderTotal = cart.reduce((total, item) => total + item.price, 0);
    const orderObject = {
        id: Date.now(),
        customerName: currentUser.username,
        customerEmail: currentUser.email,
        date: new Date().toLocaleString(),
        total: orderTotal,
        items: cart.map(item => ({ name: item.name, quantity: item.quantity, price: item.price }))
    };

    orders.push(orderObject);
    localStorage.setItem('orders', JSON.stringify(orders));  // Save orders to localStorage

    localStorage.removeItem('cart');  // Clear the cart in localStorage
    cart = [];  // Reset the cart arrays
    totalPrice = 0;  // Reset total price
    updateCartAmount();  // Update the cart icon count
    updateCartDisplay();  // Update the cart display

    alert('Order placed successfully!');
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
