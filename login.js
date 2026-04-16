// Handle login form submission
document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();  // Prevent the form from submitting normally

    // Get username, email, and password from the form
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Simulate checking login details
    const storedUser = JSON.parse(localStorage.getItem('user')); // Retrieve stored user data

    // Check if the user exists and if the username, email, and password match
    if (storedUser && storedUser.username === username && storedUser.email === email && storedUser.password === password) {
        // Store user information in localStorage
        localStorage.setItem('username', storedUser.username); // Store username
        localStorage.setItem('email', storedUser.email); // Store email

        // If login is successful, redirect to the account page
        window.location.href = "mainpage.html";  // Replace with the appropriate URL for your main page
    } else {
        // Show error message if login fails
        alert('Invalid username, email, or password.');
    }
});
