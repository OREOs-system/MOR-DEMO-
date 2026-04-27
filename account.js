window.onload = async function() {
    // Try to load user information from server first
    const token = localStorage.getItem('token');
    if (token) {
        try {
            const response = await fetch('/api/auth/profile', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const user = await response.json();
                // Display user information
                document.getElementById('usernameDisplay').textContent = `${user.firstName} ${user.lastName}`;
                document.getElementById('emailDisplay').textContent = user.email;
                document.getElementById('profilePic').src = user.profilePicture || 'default-profile.png';
                
                // Display address information
                document.getElementById('addressDisplay').textContent = user.address || 'Not set';
                document.getElementById('cityDisplay').textContent = user.city || 'Not set';
                document.getElementById('contactDisplay').textContent = user.contact || 'Not set';

                // Store user data locally for editing
                localStorage.setItem('user', JSON.stringify(user));
                return;
            }
        } catch (error) {
            console.error('Error fetching user profile:', error);
        }
    }

    // Fallback to localStorage
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
        // Display user information
        document.getElementById('usernameDisplay').textContent = storedUser.username || `${storedUser.firstName} ${storedUser.lastName}`;
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
    const newContact = prompt("Enter your contact number (11 digits only):");
    if (newContact !== null) {
        if (validateContact(newContact)) {
            // Update contact and save to localStorage
            const storedUser = JSON.parse(localStorage.getItem('user'));
            storedUser.contact = newContact;
            localStorage.setItem('user', JSON.stringify(storedUser));

            // Update the displayed contact
            document.getElementById('contactDisplay').textContent = newContact;
        } else {
            alert("Please enter a valid 11-digit contact number (numbers only).");
        }
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

    alert("SUCCESSFULLY");
}

// Logout functionality
function logout() {
    localStorage.removeItem('user');  // Remove user data from localStorage
    alert('SUCCESSFULLY');
    window.location.href = 'login.html';  // Redirect to login page after logout
}

// Email validation helper function
function validateEmail(email) {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
}

// Contact number validation helper function
function validateContact(contact) {
    const regex = /^\d{11}$/;
    return regex.test(contact);
}

// Save changes function
async function saveChanges() {
    const token = localStorage.getItem('token');
    if (!token) {
        alert("Not authenticated. Please log in again.");
        return;
    }

    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (!storedUser) {
        alert("No user data found.");
        return;
    }

    try {
        const response = await fetch('/api/auth/profile', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                firstName: storedUser.firstName,
                lastName: storedUser.lastName,
                contact: storedUser.contact,
                address: storedUser.address,
                city: storedUser.city,
                zipCode: storedUser.zipCode
            })
        });

        if (response.ok) {
            alert("Changes saved successfully!");
            window.location.href = "mainpage.html";
        } else {
            alert("Failed to save changes.");
        }
    } catch (error) {
        console.error('Error saving changes:', error);
        alert("Error saving changes.");
    }
}
