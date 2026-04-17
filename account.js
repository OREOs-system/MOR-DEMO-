window.onload = function() {
    // Load stored user information
    const storedUser = JSON.parse(localStorage.getItem('user'));

    if (storedUser) {
        // Display user information
        document.getElementById('usernameDisplay').textContent = storedUser.username;
        document.getElementById('emailDisplay').textContent = storedUser.email;
        document.getElementById('profilePic').src = storedUser.profilePicture || 'default-profile.png';
        
        // Display order history
        displayOrderHistory(storedUser.email);
    } else {
        alert("You are not logged in.");
        window.location.href = "login.html";  // Redirect to login page if not logged in
    }
};

// Edit username
function editUsername() {
    const newUsername = prompt("Enter new username:");
    if (newUsername) {
        // Update username and save to localStorage
        const storedUser = JSON.parse(localStorage.getItem('user'));
        storedUser.username = newUsername;
        localStorage.setItem('user', JSON.stringify(storedUser));

        // Update the displayed username
        document.getElementById('usernameDisplay').textContent = newUsername;
    }
}

// Edit email
function editEmail() {
    const newEmail = prompt("Enter new email:");
    if (newEmail && validateEmail(newEmail)) {
        // Update email and save to localStorage
        const storedUser = JSON.parse(localStorage.getItem('user'));
        storedUser.email = newEmail;
        localStorage.setItem('user', JSON.stringify(storedUser));

        // Update the displayed email
        document.getElementById('emailDisplay').textContent = newEmail;
    } else {
        alert("Please enter a valid email address.");
    }
}

// Change profile picture
function changePicture() {
    const newPictureURL = prompt("Enter URL of new profile picture:");
    if (newPictureURL) {
        // Update profile picture and save to localStorage
        const storedUser = JSON.parse(localStorage.getItem('user'));
        storedUser.profilePicture = newPictureURL;
        localStorage.setItem('user', JSON.stringify(storedUser));

        // Update the displayed profile picture
        document.getElementById('profilePic').src = newPictureURL;
    }
}

// Change password
function changePassword() {
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // Retrieve the stored user data
    const storedUser = JSON.parse(localStorage.getItem('user'));

    if (currentPassword !== storedUser.password) {
        alert("Current password is incorrect.");
        return;
    }

    if (newPassword !== confirmPassword) {
        alert("New passwords do not match.");
        return;
    }

    // Update password in localStorage
    storedUser.password = newPassword;
    localStorage.setItem('user', JSON.stringify(storedUser));

    alert("Password changed successfully.");
}

// Logout functionality
function logout() {
    localStorage.removeItem('user');  // Remove user data from localStorage
    alert('You have been logged out successfully.');
    window.location.href = 'login.html';  // Redirect to login page after logout
}

// Email validation helper function
function validateEmail(email) {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
}

// Function to get status label
function getStatusLabel(status) {
    switch (status) {
        case 'new':
            return 'Awaiting Admin';
        case 'accepted':
            return 'Pending';
        case 'completed':
            return 'Completed';
        case 'cancelled':
            return 'Cancelled';
        default:
            return 'Unknown';
    }
}

// Function to display order history for the current user
function displayOrderHistory(userEmail) {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const userOrders = orders.filter(order => order.email === userEmail);
    
    const orderHistoryContainer = document.getElementById('orderHistory');
    
    if (userOrders.length === 0) {
        orderHistoryContainer.innerHTML = '<p>No orders found.</p>';
        return;
    }
    
    let ordersHTML = '<table>';
    ordersHTML += '<tr>';
    ordersHTML += '<th>Date</th>';
    ordersHTML += '<th>Product</th>';
    ordersHTML += '<th>Quantity</th>';
    ordersHTML += '<th>Price</th>';
    ordersHTML += '<th>Status</th>';
    ordersHTML += '</tr>';
    
    userOrders.forEach(order => {
        ordersHTML += '<tr>';
        ordersHTML += `<td>${order.date || 'N/A'}</td>`;
        ordersHTML += `<td>${order.product || 'N/A'}</td>`;
        ordersHTML += `<td>${order.quantity || 'N/A'}</td>`;
        ordersHTML += `<td>₱${order.price || 'N/A'}</td>`;
        ordersHTML += `<td>${getStatusLabel(order.status)}</td>`;
        ordersHTML += '</tr>';
    });
    ordersHTML += '</table>';
    
    orderHistoryContainer.innerHTML = ordersHTML;
}
