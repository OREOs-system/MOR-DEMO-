document.getElementById('registerForm').addEventListener('submit', async function(event) {
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

    // Split username into firstName and lastName (assuming space separated)
    const nameParts = username.trim().split(' ');
    const firstName = nameParts[0] || username;
    const lastName = nameParts.slice(1).join(' ') || '';

    try {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email,
                password,
                firstName,
                lastName,
                phone: contact, // API expects phone
                address,
                city,
                zipCode: '' // Not in form, set empty
            })
        });

        const data = await response.json();

        if (response.ok) {
            alert('Registration successful! Please login.');
            window.location.href = 'login.html';
        } else {
            errorMessage.textContent = data.message || 'Registration failed';
        }
    } catch (error) {
        console.error('Error:', error);
        errorMessage.textContent = 'An error occurred. Please try again.';
    }
});

// Helper function to validate email format
function validateEmail(email) {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
}
