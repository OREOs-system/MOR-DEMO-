// Handle login form submission
document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();  // Prevent the form from submitting normally

    // Get username, email, and password from the form
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Get all users from localStorage
    let allUsers = JSON.parse(localStorage.getItem('allUsers')) || [];

    // Find user matching username, email, and password
    const foundUser = allUsers.find(u => 
        u.username === username && 
        u.email === email && 
        u.password === password
    );

    if (foundUser) {
        // Store current user information in localStorage
        localStorage.setItem('user', JSON.stringify(foundUser));
        localStorage.setItem('user_id', foundUser.user_id);
        localStorage.setItem('username', foundUser.username);
        localStorage.setItem('email', foundUser.email);

        // If login is successful, redirect to the appropriate page
        if (foundUser.role === 'admin') {
            window.location.href = "admin.html";  // Admin panel
        } else {
            window.location.href = "mainpage.html";  // Regular user home
        }
    } else {
        // Show error message if login fails
        alert('Invalid username, email, or password.');
    }
});
