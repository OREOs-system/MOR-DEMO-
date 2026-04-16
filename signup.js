document.getElementById('registerForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form from submitting normally

    // Get values from the form fields
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const errorMessage = document.getElementById('error-message');

    // Clear previous error message
    errorMessage.textContent = '';

    // Validation checks
    if (!username || !email || !password || !confirmPassword) {
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

    // Generate a simple user_id and save user data to localStorage
    const user_id = 'USER_' + Date.now();
    localStorage.setItem('user', JSON.stringify({ user_id, username, email, password }));

    // Redirect to login page or success message
    alert('Registration successful! Please login.');
    window.location.href = 'login.html';  // Redirect to login page
});

// Helper function to validate email format
function validateEmail(email) {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
}
