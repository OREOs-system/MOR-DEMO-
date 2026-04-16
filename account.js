window.onload = function() {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const username = storedUser?.username || localStorage.getItem('username');
    const email = storedUser?.email || localStorage.getItem('email');

    if (username && email) {
        document.getElementById('usernameDisplay').textContent = username;
        document.getElementById('emailDisplay').textContent = email;
        document.getElementById('profilePic').src = storedUser?.profilePicture || 'default-profile.png';
        displayUserOrders(username, email);
    } else {
        alert("You are not logged in.");
        window.location.href = "login.html";  // Redirect to login page if not logged in
    }
};

function getCurrentUser() {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    return {
        username: storedUser?.username || localStorage.getItem('username') || 'Guest',
        email: storedUser?.email || localStorage.getItem('email') || ''
    };
}

function displayUserOrders(username, email) {
    const ordersContainer = document.getElementById('user-orders');
    if (!ordersContainer) {
        return;
    }

    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const userOrders = orders.filter(order => {
        if (order.items && Array.isArray(order.items)) {
            return order.customerName === username || order.customerEmail === email;
        }

        return order.customerName === username || order.customerEmail === email;
    });

    if (userOrders.length === 0) {
        ordersContainer.innerHTML = '<p>No orders found for this user.</p>';
        return;
    }

    let ordersHTML = '';
    userOrders.forEach(order => {
        const itemsHTML = (order.items || [{ name: order.name, quantity: order.quantity, price: order.price }]).map(item => `
            <li>${item.name} — Qty: ${item.quantity} — ₱${item.price}</li>
        `).join('');

        ordersHTML += `
        <div class="user-order-card">
            <h4>Order #${order.id || 'N/A'}</h4>
            <p><strong>Date:</strong> ${order.date || 'N/A'}</p>
            <p><strong>Total:</strong> ₱${order.total || order.price || 0}</p>
            <ul>${itemsHTML}</ul>
        </div>
        `;
    });

    ordersContainer.innerHTML = ordersHTML;
}

// Edit username
function editUsername() {
    const newUsername = prompt("Enter new username:");
    if (newUsername) {
        const storedUser = JSON.parse(localStorage.getItem('user')) || {};
        storedUser.username = newUsername;
        localStorage.setItem('user', JSON.stringify(storedUser));
        document.getElementById('usernameDisplay').textContent = newUsername;
        displayUserOrders(newUsername, storedUser.email || localStorage.getItem('email'));
    }
}

// Edit email
function editEmail() {
    const newEmail = prompt("Enter new email:");
    if (newEmail && validateEmail(newEmail)) {
        const storedUser = JSON.parse(localStorage.getItem('user')) || {};
        storedUser.email = newEmail;
        localStorage.setItem('user', JSON.stringify(storedUser));
        document.getElementById('emailDisplay').textContent = newEmail;
        displayUserOrders(storedUser.username || localStorage.getItem('username'), newEmail);
    } else {
        alert("Please enter a valid email address.");
    }
}

// Change profile picture
function changePicture() {
    const newPictureURL = prompt("Enter URL of new profile picture:");
    if (newPictureURL) {
        const storedUser = JSON.parse(localStorage.getItem('user')) || {};
        storedUser.profilePicture = newPictureURL;
        localStorage.setItem('user', JSON.stringify(storedUser));
        document.getElementById('profilePic').src = newPictureURL;
    }
}

// Change password
function changePassword() {
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const storedUser = JSON.parse(localStorage.getItem('user'));

    if (!storedUser) {
        alert("No user data available.");
        return;
    }

    if (currentPassword !== storedUser.password) {
        alert("Current password is incorrect.");
        return;
    }

    if (newPassword !== confirmPassword) {
        alert("New passwords do not match.");
        return;
    }

    storedUser.password = newPassword;
    localStorage.setItem('user', JSON.stringify(storedUser));
    alert("Password changed successfully.");
}

// Logout functionality
function logout() {
    localStorage.removeItem('username');
    localStorage.removeItem('email');
    alert('You have been logged out successfully.');
    window.location.href = 'login.html';
}

// Email validation helper function
function validateEmail(email) {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
}
