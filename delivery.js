let deliveryMap;
let deliveryMarker;

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
        initializeDeliveryMap(storedUser.latitude, storedUser.longitude);
    }
};

function initializeDeliveryMap(latitude, longitude) {
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    const defaultCenter = [14.5995, 120.9842];
    const initialCenter = !isNaN(lat) && !isNaN(lng) ? [lat, lng] : defaultCenter;
    const initialZoom = !isNaN(lat) && !isNaN(lng) ? 15 : 5;

    deliveryMap = L.map('deliveryMap').setView(initialCenter, initialZoom);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(deliveryMap);

    if (!isNaN(lat) && !isNaN(lng)) {
        setDeliveryMarker(lat, lng, false);
    }

    deliveryMap.on('click', function(event) {
        setDeliveryMarker(event.latlng.lat, event.latlng.lng, true);
    });
}

function setDeliveryMarker(lat, lng, save) {
    if (deliveryMarker) {
        deliveryMarker.setLatLng([lat, lng]);
    } else {
        deliveryMarker = L.marker([lat, lng]).addTo(deliveryMap);
    }
    deliveryMap.setView([lat, lng], 15);
    document.getElementById('deliveryLatitude').value = lat.toFixed(6);
    document.getElementById('deliveryLongitude').value = lng.toFixed(6);
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

    if (!storedUser.latitude || !storedUser.longitude) {
        alert('Please place your delivery location on the map before proceeding.');
        return;
    }

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
