# Account Information Flow - Verification Guide

## Overview
This document verifies that customer account information (particularly address and contact number) is properly captured, stored, and retrieved throughout the system.

## Fields Captured
- **Customer Name**: username
- **Email**: email  
- **Address**: address
- **City**: city
- **Contact Number**: contact
- **Profile Picture**: profilePicture

---

## 1. SIGNUP PROCESS ✓
**File**: `signup.js`

**What happens**:
- User registers with all required fields including address, city, and contact
- Fields are validated
- New user object is created with all information
- User data is stored in `localStorage.allUsers[]`

**Fields stored**:
```javascript
{
  user_id, username, email, password, role,
  profilePicture, address, city, contact, createdAt
}
```

---

## 2. LOGIN PROCESS ✓
**File**: `login.js`

**What happens**:
- User logs in with username, email, and password
- Entire user object is retrieved from `localStorage.allUsers[]`
- User object is stored in `localStorage.user`
- Individual fields also stored: `localStorage.username`, `localStorage.email`

**Result**: 
- Full user object including address and contact is available in localStorage

---

## 3. ACCOUNT PAGE DISPLAY ✓
**Files**: `account.html`, `account.js`

**What displays**:
- **account.html** has HTML elements with IDs for all fields:
  - `#usernameDisplay` - Shows username
  - `#emailDisplay` - Shows email
  - `#addressDisplay` - Shows address
  - `#cityDisplay` - Shows city
  - `#contactDisplay` - Shows contact number

- **account.js** loads user from localStorage and populates all fields:
  ```javascript
  storedUser.username → #usernameDisplay
  storedUser.email → #emailDisplay
  storedUser.address → #addressDisplay (default: "Not set")
  storedUser.city → #cityDisplay (default: "Not set")
  storedUser.contact → #contactDisplay (default: "Not set")
  ```

**User can edit and save**:
- `editAddres()`, `editCity()`, `editContact()` functions update localStorage

---

## 4. CHECKOUT PROCESS ✓

### 4a. Cash on Delivery (COD)
**File**: `cart.js` > `processCashOnDelivery()`

**How it works**:
1. Retrieves user data: `const user = JSON.parse(localStorage.getItem('user'))`
2. Creates order with address and contact:
```javascript
orders.push({
  orderId, name, email,
  address: user.address || '',      ✓
  city: user.city || '',            ✓
  contact: user.contact || '',      ✓
  date, product, quantity, price,
  status: 'new',
  paymentMethod: 'Cash on Delivery'
})
```
3. Stores in `localStorage.orders[]`

### 4b. Online Payment (GCash)
**File**: `payment.js` > `processSuccessfulPayment()`

**How it works**:
1. Retrieves user data: `const user = JSON.parse(localStorage.getItem('user'))`
2. Creates order with address and contact:
```javascript
orders.push({
  orderId, name, email,
  address: user.address || '',      ✓
  city: user.city || '',            ✓
  contact: user.contact || '',      ✓
  date, product, quantity, price,
  status: 'new',
  paymentMethod: 'GCash',
  gcashNumber, paymentReference
})
```
3. Stores in `localStorage.orders[]`

---

## 5. ADMIN ORDERS VIEW ✓
**Files**: `admin.html`, `admin.js`

**How it displays orders**:
- **admin.js** > `displayOrders()` retrieves orders from `localStorage.orders[]`
- For each order, displays:
  ```javascript
  <p>Customer: ${firstOrder.name || 'N/A'}</p>
  <p>Email: ${firstOrder.email || 'N/A'}</p>
  <p>Address: ${firstOrder.address || 'N/A'}</p>    ✓
  <p>Contact: ${firstOrder.contact || 'N/A'}</p>    ✓
  <p>Date: ${firstOrder.date || 'N/A'}</p>
  ```

**Result**: 
- Admin can see full customer address and contact number for each order

---

## 6. USER MANAGEMENT (API-based) ✓
**Files**: `users.html`, `users.js`

**Fixed Issues**:
- Corrected typo: `user.contactct` → `user.contact` (line in viewUserDetails)
- User details properly display: name, email, phone/contact, address, city, zip code

---

## Data Flow Summary

```
SIGNUP
  ↓
User data stored with: address, city, contact
  ↓
LOGIN
  ↓
User object loaded to localStorage.user
  ↓
ACCOUNT PAGE
  ├→ Displays: address, city, contact ✓
  └→ User can edit and save ✓
  ↓
CHECKOUT (COD or GCash)
  ├→ Retrieves user.address ✓
  ├→ Retrieves user.contact ✓
  └→ Creates order with all info ✓
  ↓
ADMIN PAGE
  ├→ Displays order address ✓
  └→ Displays order contact ✓
```

---

## Verification Checklist

- [x] Signup captures address and contact number
- [x] Login stores complete user object with address and contact
- [x] Account page HTML has elements for address and contact display
- [x] account.js reads and displays address and contact from user object
- [x] account.js allows editing address and contact with edit functions
- [x] cart.js (COD) includes address and contact in orders
- [x] payment.js (GCash) includes address and contact in orders
- [x] admin.js displays address and contact for each order
- [x] Fixed typo in users.js (contactct → contact)

---

## How to Test

1. **Register**: Create new account with full address and contact number
2. **Login**: Log in with the account
3. **Account Page**: Verify address and contact display correctly
4. **Edit Account**: Try editing address and contact info
5. **Checkout**: Place an order using COD
6. **Admin View**: Check admin.html to see the order displays your address and contact number

---

## Status: ✅ COMPLETE

All systems are properly configured to capture, store, and display customer address and contact number information throughout the application.
