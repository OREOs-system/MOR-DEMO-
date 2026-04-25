let accountMap;
let accountMarker;

window.onload = function() {
    const storedUser = JSON.parse(localStorage.getItem('user'));

    if (storedUser) {
        document.getElementById('usernameDisplay').textContent = storedUser.username || '';
        document.getElementById('emailDisplay').textContent = storedUser.email || '';
        document.getElementById('profilePic').src = storedUser.profilePicture || 'default-profile.png';
        document.getElementById('addressDisplay').textContent = storedUser.address || 'No address saved';
        document.getElementById('cityDisplay').textContent = storedUser.city || 'N/A';
        document.getElementById('zipDisplay').textContent = storedUser.zipCode || 'N/A';
        document.getElementById('latitudeDisplay').textContent = storedUser.latitude || 'Not set';
        document.getElementById('longitudeDisplay').textContent = storedUser.longitude || 'Not set';
        initializeAccountMap(storedUser.latitude, storedUser.longitude);
    } else {
        alert("You are not logged in.");
        window.location.href = "login.html";
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

function initializeAccountMap(latitude, longitude) {
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    const defaultCenter = [14.5995, 120.9842];
    const initialCenter = !isNaN(lat) && !isNaN(lng) ? [lat, lng] : defaultCenter;
    const initialZoom = !isNaN(lat) && !isNaN(lng) ? 15 : 5;

    accountMap = L.map('accountMap').setView(initialCenter, initialZoom);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(accountMap);

    if (!isNaN(lat) && !isNaN(lng)) {
        setAccountMarker(lat, lng, false);
    }

    accountMap.on('click', function(event) {
        setAccountMarker(event.latlng.lat, event.latlng.lng, true);
    });
}

function setAccountMarker(lat, lng, save) {
    if (accountMarker) {
        accountMarker.setLatLng([lat, lng]);
    } else {
        accountMarker = L.marker([lat, lng]).addTo(accountMap);
    }
    accountMap.setView([lat, lng], 15);

    document.getElementById('latitudeDisplay').textContent = lat.toFixed(6);
    document.getElementById('longitudeDisplay').textContent = lng.toFixed(6);

    if (save) {
        const storedUser = JSON.parse(localStorage.getItem('user')) || {};
        storedUser.latitude = lat.toString();
        storedUser.longitude = lng.toString();
        saveUserChanges(storedUser);
    }
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
