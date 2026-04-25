window.onload = function() {
    // Load stored user information
    const storedUser = JSON.parse(localStorage.getItem('user'));

    if (storedUser) {
        // Display user information
        document.getElementById('usernameDisplay').textContent = storedUser.username;
        document.getElementById('emailDisplay').textContent = storedUser.email;
        document.getElementById('profilePic').src = storedUser.profilePicture || 'default-profile.png';
        
        // Display address information
        document.getElementById('addressDisplay').textContent = storedUser.address || 'Not set';
        document.getElementById('cityDisplay').textContent = storedUser.city || 'Not set';
        document.getElementById('contactDisplay').textContent = storedUser.contact || 'Not set';
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

// Edit address
function editAddress() {
    const newAddress = prompt("Enter your address:");
    if (newAddress !== null) {
        // Update address and save to localStorage
        const storedUser = JSON.parse(localStorage.getItem('user'));
        storedUser.address = newAddress;
        localStorage.setItem('user', JSON.stringify(storedUser));

        // Update the displayed address
        document.getElementById('addressDisplay').textContent = newAddress;
    }
}

// Edit city
function editCity() {
    const newCity = prompt("Enter your city:");
    if (newCity !== null) {
        // Update city and save to localStorage
        const storedUser = JSON.parse(localStorage.getItem('user'));
        storedUser.city = newCity;
        localStorage.setItem('user', JSON.stringify(storedUser));

        // Update the displayed city
        document.getElementById('cityDisplay').textContent = newCity;
    }
}

// Edit contact number
function editContact() {
    const newContact = prompt("Enter your contact number:");
    if (newContact !== null) {
        // Update contact and save to localStorage
        const storedUser = JSON.parse(localStorage.getItem('user'));
        storedUser.contact = newContact;
        localStorage.setItem('user', JSON.stringify(storedUser));

        // Update the displayed contact
        document.getElementById('contactDisplay').textContent = newContact;
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
