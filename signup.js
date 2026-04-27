document.getElementById('registerForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form from submitting normally

    // Get values from the form fields
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const address = document.getElementById('address').value;
    const city = document.getElementById('city').value;
    const contact = document.getElementById('contact').value;
    const errorMessage = document.getElementById('error-message');

    // Clear previous error message
    errorMessage.textContent = '';

    // Validation checks
    if (!username || !email || !password || !confirmPassword || !address || !city || !contact) {
        errorMessage.textContent = 'All fields are required!';
        return;
    }

    if (password !== confirmPassword) {
        errorMessage.textContent = 'Passwords do not match!';
        return;
    }

    if (!validateEmail(email)) {
        errorMessage.textContent = 'Invalid email format!';
        return;
    }

    // Get existing users array
    let allUsers = JSON.parse(localStorage.getItem('allUsers')) || [];
    
    // Check if email already exists
    if (allUsers.some(u => u.email === email)) {
        errorMessage.textContent = 'Email already registered!';
        return;
    }

    // Generate a simple user_id and create new user
    const user_id = 'USER_' + Date.now();
    const newUser = {
        user_id: user_id,
        username: username,
        email: email,
        password: password,
        role: 'user',
        profilePicture: 'default-profile.png',
        address: address,
        city: city,
        contact: contact,
        createdAt: new Date().toLocaleDateString()
    };

    // Add to users array
    allUsers.push(newUser);
    localStorage.setItem('allUsers', JSON.stringify(allUsers));
    
    // Also set current user for login
    localStorage.setItem('user', JSON.stringify(newUser));

    // Redirect to login page or success message
    alert('Registration successful! Please login.');
    window.location.href = 'login.html';  // Redirect to login page
});

// Helper function to validate email format
function validateEmail(email) {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
}
