MOR TESTER ONLY

## Node.js Server

This repository is a static frontend project with a simple Node.js/Express server added for local development.

### Features

- User registration and login
- Menu browsing and cart management
- **Payment Options**: Choose between Online Payment (GCash) or Cash on Delivery
- Order tracking and management

### Payment Methods

1. **Online Payment (GCash)**:
   - Secure online payment through GCash
   - Must pay full amount before order processing
   - Redirects to payment page for transaction

2. **Cash on Delivery**:
   - Pay in cash when order is delivered
   - Order placed immediately
   - No upfront payment required

### Order Flow

1. Add items to cart
2. Choose payment method:
   - **Online Payment**: Redirects to GCash payment page
   - **Cash on Delivery**: Order placed immediately
3. Track order status in orders page

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
