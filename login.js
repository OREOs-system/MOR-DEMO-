// Handle login form submission
document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault();  // Prevent the form from submitting normally

    // Get username, email, and password from the form
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email,
                password
            })
        });

        const data = await response.json();

        if (response.ok) {
            // Store token and user info
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            // If login is successful, redirect to the appropriate page
            if (data.user.role === 'admin') {
                window.location.href = "admin.html";  // Admin panel
            } else {
                window.location.href = "mainpage.html";  // Regular user home
            }
        } else {
            // Show error message if login fails
            alert(data.message || 'Invalid email or password.');
        }
    } catch (error) {
        console.error('Login error:', error);
        alert('An error occurred. Please try again.');
    }
});
