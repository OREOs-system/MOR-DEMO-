window.onload = async function() {
    const token = localStorage.getItem('token');
    if (!token) {
        alert("You are not logged in.");
        window.location.href = "login.html";
        return;
    }

    try {
        const response = await fetch('/api/auth/profile', {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (response.ok) {
            const user = await response.json();
            // Display user information
            document.getElementById('usernameDisplay').textContent = user.firstName + ' ' + user.lastName;
            document.getElementById('emailDisplay').textContent = user.email;
            document.getElementById('profilePic').src = user.profilePicture || 'default-profile.png';
            
            // Display address information
            document.getElementById('addressDisplay').textContent = user.address || 'N/A';
            document.getElementById('cityDisplay').textContent = user.city || 'N/A';
            document.getElementById('contactDisplay').textContent = user.contact || 'N/A';
        } else {
            alert("Failed to load user data.");
            window.location.href = "login.html";
        }
    } catch (error) {
        console.error('Error:', error);
        alert("An error occurred while loading user data.");
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
async function editAddress() {
    const newAddress = prompt("Enter your address:");
    if (newAddress !== null) {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch('/api/auth/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ address: newAddress }),
            });

            if (response.ok) {
                const user = await response.json();
                // Update localStorage
                localStorage.setItem('user', JSON.stringify(user));
                // Update the displayed address
                document.getElementById('addressDisplay').textContent = newAddress;
            } else {
                alert("Failed to update address.");
            }
        } catch (error) {
            console.error('Error:', error);
            alert("An error occurred while updating address.");
        }
    }
}

// Edit city
async function editCity() {
    const newCity = prompt("Enter your city:");
    if (newCity !== null) {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch('/api/auth/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ city: newCity }),
            });

            if (response.ok) {
                const user = await response.json();
                // Update localStorage
                localStorage.setItem('user', JSON.stringify(user));
                // Update the displayed city
                document.getElementById('cityDisplay').textContent = newCity;
            } else {
                alert("Failed to update city.");
            }
        } catch (error) {
            console.error('Error:', error);
            alert("An error occurred while updating city.");
        }
    }
}

// Edit contact number
async function editContact() {
    const newContact = prompt("Enter your contact number (11 digits only):");
    if (newContact !== null) {
        if (validateContact(newContact)) {
            const token = localStorage.getItem('token');
            try {
                const response = await fetch('/api/auth/profile', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify({ contact: newContact }),
                });

                if (response.ok) {
                    const user = await response.json();
                    // Update localStorage
                    localStorage.setItem('user', JSON.stringify(user));
                    // Update the displayed contact
                    document.getElementById('contactDisplay').textContent = newContact;
                } else {
                    alert("Failed to update contact.");
                }
            } catch (error) {
                console.error('Error:', error);
                alert("An error occurred while updating contact.");
            }
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
    localStorage.removeItem('token');  // Remove token
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
function saveChanges() {
    alert("SUCCESSFULLY");
    window.location.href = "mainpage.html";
}
