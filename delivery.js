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
    } else {
        initializeDeliveryMap(null, null);
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
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19
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
        // Create draggable marker
        deliveryMarker = L.marker([lat, lng], { 
            draggable: true,
            title: 'Drag to adjust location'
        }).addTo(deliveryMap);
        
        // Update coordinates when marker is dragged
        deliveryMarker.on('dragend', function() {
            const markerPos = deliveryMarker.getLatLng();
            updateCoordinates(markerPos.lat, markerPos.lng);
        });
    }
    
    deliveryMap.setView([lat, lng], 15);
    updateCoordinates(lat, lng);
}

function updateCoordinates(lat, lng) {
    const latFixed = lat.toFixed(6);
    const lngFixed = lng.toFixed(6);
    
    document.getElementById('deliveryLatitude').value = latFixed;
    document.getElementById('deliveryLongitude').value = lngFixed;
    
    // Update the display
    const coordDisplay = document.getElementById('coordinatesDisplay');
    coordDisplay.textContent = `📍 Latitude: ${latFixed}, Longitude: ${lngFixed}`;
}

function saveDeliveryAddress(event) {
    event.preventDefault();
    const fullName = document.getElementById('deliveryFullName').value.trim();
    const email = document.getElementById('deliveryEmail').value.trim();
    const address = document.getElementById('deliveryAddress').value.trim();
    const city = document.getElementById('deliveryCity').value.trim();
    const zip = document.getElementById('deliveryZip').value.trim();
    const state = document.getElementById('deliveryState').value.trim();
    const latitude = document.getElementById('deliveryLatitude').value.trim();
    const longitude = document.getElementById('deliveryLongitude').value.trim();

    if (!fullName || !email || !address || !city || !zip) {
        alert('Please complete your delivery address information before proceeding.');
        return;
    }

    if (!latitude || !longitude) {
        alert('Please select your delivery location on the map before proceeding.');
        return;
    }

    const storedUser = JSON.parse(localStorage.getItem('user')) || {};
    storedUser.username = fullName;
    storedUser.email = email;
    storedUser.address = address;
    storedUser.city = city;
    storedUser.zipCode = zip;
    storedUser.state = state;
    storedUser.latitude = parseFloat(latitude);
    storedUser.longitude = parseFloat(longitude);

    localStorage.setItem('user', JSON.stringify(storedUser));

    const allUsers = JSON.parse(localStorage.getItem('allUsers')) || [];
    const index = allUsers.findIndex(u => u.user_id === storedUser.user_id);
    if (index !== -1) {
        allUsers[index] = storedUser;
        localStorage.setItem('allUsers', JSON.stringify(allUsers));
    }

    alert('Delivery address saved successfully with location: ' + city);
    
    // Check which payment method was selected
    const paymentMethod = sessionStorage.getItem('paymentMethod');
    
    if (paymentMethod === 'cash') {
        // Process Cash on Delivery directly
        processCODPayment();
    } else if (paymentMethod === 'online') {
        // Redirect to online payment page
        window.location.href = 'payment.html';
    } else {
        // Default to payment page (backward compatibility)
        window.location.href = 'payment.html';
    }
}

// Function to process Cash on Delivery payment
function processCODPayment() {
    const username = localStorage.getItem('username');
    const email = localStorage.getItem('email');
    const user = JSON.parse(localStorage.getItem('user')) || {};
    const currentDate = new Date().toLocaleString();
    
    // Get cart data from sessionStorage if available
    const cart = JSON.parse(sessionStorage.getItem('paymentCart')) || [];
    
    if (cart.length === 0) {
        alert('No items in cart. Please add items first.');
        window.location.href = 'cart.html';
        return;
    }

    function generateOrderId() {
        return `order_${Date.now()}_${Math.floor(Math.random() * 100000)}`;
    }

    const orderId = generateOrderId();
    let orders = JSON.parse(localStorage.getItem('orders')) || [];
    let totalAmount = 0;

    cart.forEach(item => {
        totalAmount += item.price;
        orders.push({
            orderId,
            name: username,
            email: email,
            date: currentDate,
            product: item.name,
            quantity: item.quantity,
            price: item.price,
            status: 'new',
            paymentMethod: 'Cash on Delivery',
            paymentAmount: item.price,
            deliveryAddress: user.address || '',
            deliveryCity: user.city || '',
            deliveryZip: user.zipCode || '',
            latitude: user.latitude,
            longitude: user.longitude
        });
    });

    localStorage.setItem('orders', JSON.stringify(orders));
    sessionStorage.setItem('recentOrderTime', Date.now().toString());

    localStorage.removeItem('cart');
    sessionStorage.removeItem('paymentCart');
    sessionStorage.removeItem('paymentMethod');

    alert('Order placed successfully via Cash on Delivery! Total: ₱' + totalAmount);
    window.location.href = 'orders.html';
}
