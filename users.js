// Users Management System
let allUsers = [];

// Initialize users from API
async function initializeUsers() {
    try {
        const response = await fetch('/api/users');
        if (response.ok) {
            allUsers = await response.json();
        } else {
            console.error('Failed to fetch users');
            allUsers = [];
        }
    } catch (error) {
        console.error('Error fetching users:', error);
        allUsers = [];
    }
    displayUsers();
    updateStats();
}

// Display all users
function displayUsers() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const roleFilter = document.getElementById('filterRole').value;
    
    let filteredUsers = allUsers.filter(user => {
        const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
        const matchesSearch = fullName.includes(searchTerm) || 
                             user.email.toLowerCase().includes(searchTerm);
        const matchesRole = roleFilter === 'all' || user.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    const usersList = document.getElementById('usersList');
    usersList.innerHTML = '';

    if (filteredUsers.length === 0) {
        usersList.innerHTML = '<div class="no-users"><p>No users found</p></div>';
        return;
    }

    filteredUsers.forEach(user => {
        const userCard = document.createElement('div');
        userCard.className = 'user-card';
        userCard.innerHTML = `
            <div class="user-card-header">
                <div class="user-profile">
                    <img src="${user.profilePicture || 'default-profile.png'}" alt="${user.firstName} ${user.lastName}" class="user-avatar">
                    <div class="user-basic-info">
                        <h3>${user.firstName} ${user.lastName}</h3>
                        <p>${user.email}</p>
                        <span class="role-badge role-${user.role}">${user.role === 'admin' ? '👑 Admin' : '👤 Customer'}</span>
                    </div>
                </div>
                <div class="user-actions">
                    <button class="btn-view" onclick="viewUserDetails('${user._id}')">👁️ View</button>
                    <button class="btn-edit" onclick="editUser('${user._id}')">✏️ Edit</button>
                    <button class="btn-delete" onclick="deleteUser('${user._id}')">🗑️ Delete</button>
                </div>
            </div>
            <div class="user-meta">
                <p><strong>User ID:</strong> ${user._id}</p>
                <p><strong>Joined:</strong> ${new Date(user.createdAt).toLocaleDateString()}</p>
                <p><strong>Status:</strong> <span class="status-badge status-active">Active</span></p>
            </div>
        `;
        usersList.appendChild(userCard);
    });
}

// View user details
function viewUserDetails(userId) {
    const user = allUsers.find(u => u._id === userId);
    if (!user) return;

    const detailsContent = document.getElementById('userDetails');
    detailsContent.innerHTML = `
        <div class="details-container">
            <h2>User Details</h2>
            <div class="details-content">
                <div class="details-left">
                    <img src="${user.profilePicture || 'default-profile.png'}" alt="${user.firstName} ${user.lastName}" class="details-avatar">
                </div>
                <div class="details-right">
                    <p><strong>Name:</strong> ${user.firstName} ${user.lastName}</p>
                    <p><strong>Email:</strong> ${user.email}</p>
                    <p><strong>Phone:</strong> ${user.phone || 'Not provided'}</p>
                    <p><strong>Address:</strong> ${user.address || 'Not provided'}</p>
                    <p><strong>City:</strong> ${user.city || 'Not provided'}</p>
                    <p><strong>Zip Code:</strong> ${user.zipCode || 'Not provided'}</p>
                    <p><strong>User ID:</strong> ${user._id}</p>
                    <p><strong>Role:</strong> ${user.role === 'admin' ? '👑 Admin' : '👤 Customer'}</p>
                    <p><strong>Created:</strong> ${new Date(user.createdAt).toLocaleDateString()}</p>
                </div>
            </div>
            <div class="details-actions">
                <button class="btn-edit" onclick="editUser('${userId}')">Edit User</button>
                <button class="btn-cancel" onclick="closeDetailsModal()">Close</button>
            </div>
        </div>
    `;
    document.getElementById('detailsModal').style.display = 'block';
}

// Edit user
function editUser(userId) {
    editingUserId = userId;
    const user = allUsers.find(u => u._id === userId);
    if (!user) return;

    document.getElementById('modalTitle').innerText = 'Edit User';
    document.getElementById('modalFirstName').value = user.firstName;
    document.getElementById('modalLastName').value = user.lastName;
    document.getElementById('modalEmail').value = user.email;
    document.getElementById('modalPhone').value = user.phone || '';
    document.getElementById('modalAddress').value = user.address || '';
    document.getElementById('modalCity').value = user.city || '';
    document.getElementById('modalZipCode').value = user.zipCode || '';
    document.getElementById('modalPassword').value = '';
    document.getElementById('modalPassword').placeholder = 'Leave blank to keep current password';
    document.getElementById('modalPassword').required = false;
    document.getElementById('modalRole').value = user.role;

    closeDetailsModal();
    document.getElementById('userModal').style.display = 'block';
}

// Save user (add or update)
async function saveUser(event) {
    event.preventDefault();

    const firstName = document.getElementById('modalFirstName').value.trim();
    const lastName = document.getElementById('modalLastName').value.trim();
    const email = document.getElementById('modalEmail').value.trim();
    const phone = document.getElementById('modalPhone').value.trim();
    const address = document.getElementById('modalAddress').value.trim();
    const city = document.getElementById('modalCity').value.trim();
    const zipCode = document.getElementById('modalZipCode').value.trim();
    const password = document.getElementById('modalPassword').value.trim();
    const role = document.getElementById('modalRole').value;

    // Validation
    if (!firstName || !lastName || !email || (!editingUserId && !password)) {
        alert('Please fill in all required fields');
        return;
    }

    if (!validateEmail(email)) {
        alert('Invalid email format');
        return;
    }

    const userData = {
        firstName,
        lastName,
        email,
        phone,
        address,
        city,
        zipCode,
        role
    };

    if (password) {
        userData.password = password;
    }

    try {
        let response;
        if (editingUserId) {
            // Update existing user
            response = await fetch(`/api/users/${editingUserId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });
        } else {
            // Add new user - but we don't have a POST route for admin adding users
            // For now, we'll just alert that adding users is not implemented
            alert('Adding new users via admin panel is not implemented yet. Users should register themselves.');
            return;
        }

        if (response.ok) {
            alert(editingUserId ? 'User updated successfully' : 'User added successfully');
            editingUserId = null;
            await initializeUsers(); // Refresh the list
            closeUserModal();
            document.getElementById('userForm').reset();
        } else {
            const error = await response.json();
            alert(`Error: ${error.message}`);
        }
    } catch (error) {
        console.error('Error saving user:', error);
        alert('Error saving user');
    }
}

// Delete user
async function deleteUser(userId) {
    if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
        try {
            const response = await fetch(`/api/users/${userId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                alert('User deleted successfully');
                await initializeUsers(); // Refresh the list
            } else {
                const error = await response.json();
                alert(`Error: ${error.message}`);
            }
        } catch (error) {
            console.error('Error deleting user:', error);
            alert('Error deleting user');
        }
    }
}

// Update statistics
function updateStats() {
    document.getElementById('totalUsers').innerText = allUsers.length;
    document.getElementById('activeUsers').innerText = allUsers.length;
}

// Refresh users list
function refreshUsers() {
    initializeUsers();
    alert('User list refreshed');
}

// Reset database - keep only admin account
function resetDatabase() {
    const confirmReset = confirm(
        'WARNING: This will delete ALL user accounts except the admin account.\n\n' +
        'Are you sure you want to proceed? This action cannot be undone.'
    );

    if (!confirmReset) {
        return;
    }

    const confirmAgain = confirm(
        'Are you absolutely sure? All user data will be permanently deleted.'
    );

    if (!confirmAgain) {
        return;
    }

    // Create admin user object
    const adminUser = {
        user_id: 'ADMIN_001',
        username: 'admin',
        email: 'admin@mccaffe.com',
        password: 'admin123',
        role: 'admin',
        profilePicture: 'default-profile.png',
        createdAt: new Date().toLocaleDateString()
    };

    // Reset allUsers to only contain admin
    allUsers = [adminUser];
    localStorage.setItem('allUsers', JSON.stringify(allUsers));

    // Clear current logged in user
    localStorage.removeItem('user');
    localStorage.removeItem('user_id');
    localStorage.removeItem('username');
    localStorage.removeItem('email');

    alert('✅ Database reset successful!\n\nAll user accounts have been deleted.\nOnly the admin account remains.\n\nUsername: admin\nPassword: admin123');
    
    // Refresh the display
    displayUsers();
    updateStats();
}

// Modal functions
function openAddUserModal() {
    editingUserId = null;
    document.getElementById('modalTitle').innerText = 'Add New User';
    document.getElementById('modalPassword').required = true;
    document.getElementById('modalPassword').placeholder = 'Enter password';
    document.getElementById('userForm').reset();
    document.getElementById('userModal').style.display = 'block';
}

function closeUserModal() {
    document.getElementById('userModal').style.display = 'none';
    editingUserId = null;
}

function closeDetailsModal() {
    document.getElementById('detailsModal').style.display = 'none';
}

// Search and filter functionality
document.addEventListener('DOMContentLoaded', () => {
    initializeUsers();

    const searchInput = document.getElementById('searchInput');
    const filterRole = document.getElementById('filterRole');

    if (searchInput) {
        searchInput.addEventListener('input', displayUsers);
    }

    if (filterRole) {
        filterRole.addEventListener('change', displayUsers);
    }

    // Close modal when clicking outside
    window.onclick = function(event) {
        const userModal = document.getElementById('userModal');
        const detailsModal = document.getElementById('detailsModal');
        
        if (event.target === userModal) {
            closeUserModal();
        }
        if (event.target === detailsModal) {
            closeDetailsModal();
        }
    };
});

// Email validation
function validateEmail(email) {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
}
