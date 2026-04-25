window.onload = function() {
    // Load stored user information
    const storedUser = JSON.parse(localStorage.getItem('user'));

    if (storedUser) {
        // Display user information
        document.getElementById('usernameDisplay').textContent = storedUser.username;
        document.getElementById('emailDisplay').textContent = storedUser.email;
        document.getElementById('profilePic').src = storedUser.profilePicture || 'default-profile.png';
        document.getElementById('addressDisplay').textContent = storedUser.address || 'No address saved';
        document.getElementById('cityDisplay').textContent = storedUser.city || 'N/A';
        document.getElementById('zipDisplay').textContent = storedUser.zipCode || 'N/A';
        updateMap(storedUser.address, storedUser.city, storedUser.zipCode);
    } else {
        alert("You are not logged in.");
        window.location.href = "login.html";  // Redirect to login page if not logged in
    }
};

function saveUserChanges(updatedUser) {
    localStorage.setItem('user', JSON.stringify(updatedUser));
    let allUsers = JSON.parse(localStorage.getItem('allUsers')) || [];
    const index = allUsers.findIndex(u => u.user_id === updatedUser.user_id);
    if (index !== -1) {
        allUsers[index] = updatedUser;
        localStorage.setItem('allUsers', JSON.stringify(allUsers));
    }
}

function updateMap(address, city, zipCode) {
    const query = encodeURIComponent([address, city, zipCode].filter(Boolean).join(', ') || 'Philippines');
    document.getElementById('addressMap').src = `https://www.google.com/maps?q=${query}&output=embed`;
}

// Edit username
function editUsername() {
    const newUsername = prompt("Enter new username:");
    if (newUsername) {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        storedUser.username = newUsername;
        saveUserChanges(storedUser);
        document.getElementById('usernameDisplay').textContent = newUsername;
    }
}

// Edit email
function editEmail() {
    const newEmail = prompt("Enter new email:");
    if (newEmail && validateEmail(newEmail)) {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        storedUser.email = newEmail;
        saveUserChanges(storedUser);
        document.getElementById('emailDisplay').textContent = newEmail;
    } else {
        alert("Please enter a valid email address.");
    }
}

// Edit address details
function editAddress() {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const newAddress = prompt("Enter your street address:", storedUser.address || '');
    const newCity = prompt("Enter your city:", storedUser.city || '');
    const newZip = prompt("Enter your zip code:", storedUser.zipCode || '');

    if (newAddress && newCity && newZip) {
        storedUser.address = newAddress;
        storedUser.city = newCity;
        storedUser.zipCode = newZip;
        saveUserChanges(storedUser);
        document.getElementById('addressDisplay').textContent = newAddress;
        document.getElementById('cityDisplay').textContent = newCity;
        document.getElementById('zipDisplay').textContent = newZip;
        updateMap(newAddress, newCity, newZip);
    } else {
        alert('Address, city, and zip code are required.');
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
