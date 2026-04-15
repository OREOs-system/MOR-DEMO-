// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Get the form element
    const loginForm = document.getElementById('loginForm');

    // Add event listener for form submission
    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();  // Prevent form from refreshing the page

        // Get the username and password entered by the user
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // Predefined username and password for simplicity
        const correctUsername = 'admin';  // You can change this to the username you want
        const correctPassword = 'admin123';  // You can change this to the password you want

        // Check if the entered username and password match the predefined values
        if (username === correctUsername && password === correctPassword) {
            // If credentials are correct, redirect to the admin page
            window.location.href = 'admin.html';  // Redirect to the admin page
        } else {
            // If credentials are incorrect, show an error message
            alert('Incorrect username or password. You cannot access the admin page.');
        }
    });
});
