// Users Management System
let allUsers = [];
let editingUserId = null;

// Initialize users from localStorage
function initializeUsers() {
    allUsers = JSON.parse(localStorage.getItem('allUsers')) || [];
    displayUsers();
    updateStats();
}

// Display all users
function displayUsers() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const roleFilter = document.getElementById('filterRole').value;
    
    let filteredUsers = allUsers.filter(user => {
        const matchesSearch = user.username.toLowerCase().includes(searchTerm) || 
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
                    <img src="${user.profilePicture || 'default-profile.png'}" alt="${user.username}" class="user-avatar">
                    <div class="user-basic-info">
                        <h3>${user.username}</h3>
                        <p>${user.email}</p>
                        <span class="role-badge role-${user.role}">${user.role === 'admin' ? '👑 Admin' : '👤 User'}</span>
                    </div>
                </div>
                <div class="user-actions">
                    <button class="btn-view" onclick="viewUserDetails('${user.user_id}')">👁️ View</button>
                    <button class="btn-edit" onclick="editUser('${user.user_id}')">✏️ Edit</button>
                    <button class="btn-delete" onclick="deleteUser('${user.user_id}')">🗑️ Delete</button>
                </div>
            </div>
            <div class="user-meta">
                <p><strong>User ID:</strong> ${user.user_id}</p>
                <p><strong>Joined:</strong> ${user.createdAt || 'N/A'}</p>
                <p><strong>Status:</strong> <span class="status-badge status-active">Active</span></p>
            </div>
        `;
        usersList.appendChild(userCard);
    });
}

// View user details
function viewUserDetails(userId) {
    const user = allUsers.find(u => u.user_id === userId);
    if (!user) return;

    const detailsContent = document.getElementById('userDetails');
    detailsContent.innerHTML = `
        <div class="details-container">
            <h2>User Details</h2>
            <div class="details-content">
                <div class="details-left">
                    <img src="${user.profilePicture || 'default-profile.png'}" alt="${user.username}" class="details-avatar">
                </div>
                <div class="details-right">
                    <p><strong>Username:</strong> ${user.username}</p>
                    <p><strong>Email:</strong> ${user.email}</p>
                    <p><strong>User ID:</strong> ${user.user_id}</p>
                    <p><strong>Role:</strong> ${user.role === 'admin' ? '👑 Admin' : '👤 User'}</p>
                    <p><strong>Created:</strong> ${user.createdAt || 'N/A'}</p>
                    <p><strong>Profile Picture URL:</strong> ${user.profilePicture || 'None'}</p>
                    <p><strong>Password (Hashed):</strong> ${user.password ? '*'.repeat(user.password.length) : 'N/A'}</p>
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
    const user = allUsers.find(u => u.user_id === userId);
    if (!user) return;

    document.getElementById('modalTitle').innerText = 'Edit User';
    document.getElementById('modalUsername').value = user.username;
    document.getElementById('modalEmail').value = user.email;
    document.getElementById('modalPassword').value = user.password;
    document.getElementById('modalPassword').placeholder = 'Leave blank to keep current password';
    document.getElementById('modalPassword').required = false;
    document.getElementById('modalRole').value = user.role;
    document.getElementById('modalProfilePic').value = user.profilePicture || '';

    closeDetailsModal();
    document.getElementById('userModal').style.display = 'block';
}

// Save user (add or update)
function saveUser(event) {
    event.preventDefault();

    const username = document.getElementById('modalUsername').value.trim();
    const email = document.getElementById('modalEmail').value.trim();
    const password = document.getElementById('modalPassword').value.trim();
    const role = document.getElementById('modalRole').value;
    const profilePicture = document.getElementById('modalProfilePic').value.trim();

    // Validation
    if (!username || !email || (!editingUserId && !password)) {
        alert('Please fill in all required fields');
        return;
    }

    if (!validateEmail(email)) {
        alert('Invalid email format');
        return;
    }

    if (editingUserId) {
        // Update existing user
        const userIndex = allUsers.findIndex(u => u.user_id === editingUserId);
        if (userIndex !== -1) {
            allUsers[userIndex].username = username;
            allUsers[userIndex].email = email;
            if (password) allUsers[userIndex].password = password;
            allUsers[userIndex].role = role;
            allUsers[userIndex].profilePicture = profilePicture || 'default-profile.png';
            alert('User updated successfully');
            editingUserId = null;
        }
    } else {
        // Add new user
        // Check if email already exists
        if (allUsers.some(u => u.email === email)) {
            alert('Email already exists');
            return;
        }

        const newUser = {
            user_id: 'USER_' + Date.now(),
            username: username,
            email: email,
            password: password,
            role: role,
            profilePicture: profilePicture || 'default-profile.png',
            createdAt: new Date().toLocaleDateString()
        };

        allUsers.push(newUser);
        alert('User added successfully');
    }

    localStorage.setItem('allUsers', JSON.stringify(allUsers));
    displayUsers();
    updateStats();
    closeUserModal();
    document.getElementById('userForm').reset();
}

// Delete user
function deleteUser(userId) {
    if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
        allUsers = allUsers.filter(u => u.user_id !== userId);
        localStorage.setItem('allUsers', JSON.stringify(allUsers));
        displayUsers();
        updateStats();
        alert('User deleted successfully');
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
