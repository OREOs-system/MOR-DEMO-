MOR TESTER ONLY

## Node.js Server

This repository is a static frontend project with a simple Node.js/Express server added for local development.

### Features

- User registration and login
- Menu browsing and cart management
- **GCash Payment Integration**: Secure online payment processing before order placement
- Order tracking and management

### Payment Flow

1. Add items to cart
2. Click "Checkout" to proceed to payment
3. Enter GCash mobile number and confirm payment
4. Payment must cover the full order amount
5. Order is placed only after successful payment

### Run locally

1. Install dependencies:

```bash
npm install
```

2. Start the server:

```bash
npm start
```

3. Open:

```
http://localhost:3000
```
