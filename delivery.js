window.onload = function() {
    const storedUser = JSON.parse(localStorage.getItem('user'));

    if (storedUser) {
        document.getElementById('deliveryFullName').value = storedUser.username || '';
        document.getElementById('deliveryEmail').value = storedUser.email || '';
        document.getElementById('deliveryAddress').value = storedUser.address || '';
        document.getElementById('deliveryCity').value = storedUser.city || '';
        document.getElementById('deliveryZip').value = storedUser.zipCode || '';
        document.getElementById('deliveryState').value = storedUser.state || 'Philippines';
        document.getElementById('deliveryLatitude').value = storedUser.latitude || '';
        document.getElementById('deliveryLongitude').value = storedUser.longitude || '';
        updateDeliveryMap();

        document.getElementById('deliveryAddress').addEventListener('input', updateDeliveryMap);
        document.getElementById('deliveryCity').addEventListener('input', updateDeliveryMap);
        document.getElementById('deliveryZip').addEventListener('input', updateDeliveryMap);
        document.getElementById('deliveryLatitude').addEventListener('input', updateDeliveryMap);
        document.getElementById('deliveryLongitude').addEventListener('input', updateDeliveryMap);
        document.getElementById('updateLocationBtn').addEventListener('click', setManualLocation);
    }
};

function updateDeliveryMap() {
    const address = document.getElementById('deliveryAddress').value;
    const city = document.getElementById('deliveryCity').value;
    const zip = document.getElementById('deliveryZip').value;
    const latitude = document.getElementById('deliveryLatitude').value.trim();
    const longitude = document.getElementById('deliveryLongitude').value.trim();

    let mapQuery;
    if (latitude && longitude && !isNaN(latitude) && !isNaN(longitude)) {
        mapQuery = `${latitude},${longitude}`;
    } else {
        mapQuery = [address, city, zip].filter(Boolean).join(', ') || 'Philippines';
    }
    document.getElementById('deliveryMap').src = `https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed`;
}

function setManualLocation() {
    const latitude = document.getElementById('deliveryLatitude').value.trim();
    const longitude = document.getElementById('deliveryLongitude').value.trim();

    if (!latitude || !longitude || isNaN(latitude) || isNaN(longitude)) {
        alert('Please enter valid numeric latitude and longitude values.');
        return;
    }

    updateDeliveryMap();
    alert('Manual location set. The map preview has been updated.');
}

function saveDeliveryAddress(event) {
    event.preventDefault();
    const fullName = document.getElementById('deliveryFullName').value.trim();
    const email = document.getElementById('deliveryEmail').value.trim();
    const address = document.getElementById('deliveryAddress').value.trim();
    const city = document.getElementById('deliveryCity').value.trim();
    const zip = document.getElementById('deliveryZip').value.trim();
    const state = document.getElementById('deliveryState').value.trim();

    if (!fullName || !email || !address || !city || !zip) {
        alert('Please complete your delivery address information before proceeding.');
        return;
    }

    const storedUser = JSON.parse(localStorage.getItem('user')) || {};
    storedUser.username = fullName;
    storedUser.email = email;
    storedUser.address = address;
    storedUser.city = city;
    storedUser.zipCode = zip;
    storedUser.state = state;
    storedUser.latitude = document.getElementById('deliveryLatitude').value.trim();
    storedUser.longitude = document.getElementById('deliveryLongitude').value.trim();

    localStorage.setItem('user', JSON.stringify(storedUser));

    const allUsers = JSON.parse(localStorage.getItem('allUsers')) || [];
    const index = allUsers.findIndex(u => u.user_id === storedUser.user_id);
    if (index !== -1) {
        allUsers[index] = storedUser;
        localStorage.setItem('allUsers', JSON.stringify(allUsers));
    }

    alert('Delivery address saved successfully.');
    window.location.href = 'payment.html';
}
