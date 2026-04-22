# Database Setup Guide

This project now includes a MongoDB database with Mongoose ORM for managing users, products, orders, and cart data.

## Prerequisites

- **MongoDB** (Local or MongoDB Atlas cloud database)
- **Node.js** 18+
- **npm**

## Installation

### 1. Install Dependencies

```bash
npm install
```

This installs:
- **mongodb/mongoose**: Database ORM
- **bcryptjs**: Password hashing
- **jsonwebtoken**: JWT authentication
- **cors**: Cross-origin requests
- **dotenv**: Environment variables

### 2. Setup MongoDB

#### Option A: Local MongoDB (Development)
```bash
# Install MongoDB Community Edition
# Ubuntu/Debian:
sudo apt-get install -y mongodb-org

# Start MongoDB service
sudo systemctl start mongod
sudo systemctl enable mongod
```

#### Option B: MongoDB Atlas (Cloud - Recommended for Production)
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Get connection string (looks like: `mongodb+srv://user:password@cluster.mongodb.net/dbname`)
4. Update `.env` file with your connection string

### 3. Environment Setup

Create a `.env` file (already included) with your settings:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/mor-demo
JWT_SECRET=your_jwt_secret_key_change_this_in_production
NODE_ENV=development
```

### 4. Seed Initial Data

```bash
npm run seed
```

This populates the database with coffee menu items from `data.js`.

## Database Models

### User
- email (unique)
- password (hashed with bcrypt)
- firstName, lastName
- phone, address, city, zipCode
- role (customer/admin)

### Product
- id (unique product ID)
- name, price
- desc (description)
- img (image filename)
- category
- available (boolean)

### Order
- orderId (unique)
- userId (reference to User)
- items (array of cart items)
- totalAmount
- paymentMethod (online/cod)
- paymentStatus (pending/completed/failed)
- orderStatus (pending/processing/preparing/ready/delivered/cancelled)
- deliveryAddress, deliveryCity, deliveryZipCode
- phone, notes

### Cart
- userId (reference to User)
- items (array of products)
- totalPrice

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product (Admin)

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders/user/:userId` - Get user's orders
- `GET /api/orders` - Get all orders (Admin)
- `PATCH /api/orders/:orderId` - Update order status (Admin)

### Cart
- `GET /api/cart/:userId` - Get user's cart
- `POST /api/cart/:userId/add` - Add item to cart
- `POST /api/cart/:userId/remove` - Remove item from cart
- `POST /api/cart/:userId/clear` - Clear cart

## Running the Server

### Development
```bash
npm run dev
```
Uses nodemon for auto-restart on file changes.

### Production
```bash
npm start
```

Server will run on `http://localhost:3000`

## Example API Requests

### Register
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "09171234567",
    "address": "123 Main St",
    "city": "Manila",
    "zipCode": "1000"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

### Get Products
```bash
curl http://localhost:3000/api/products
```

### Create Order
```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "x-user-id: USER_ID" \
  -d '{
    "items": [
      {
        "productId": "americano12oz",
        "productName": "Americano",
        "price": 55,
        "quantity": 2
      }
    ],
    "totalAmount": 110,
    "paymentMethod": "cod",
    "deliveryAddress": "123 Main St",
    "deliveryCity": "Manila",
    "deliveryZipCode": "1000",
    "phone": "09171234567",
    "notes": "No sugar"
  }'
```

## Health Check

```bash
curl http://localhost:3000/api/health
```

Should return: `{"status":"Server is running"}`

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB service is running: `sudo systemctl status mongod`
- Check MONGODB_URI in .env file
- If using Atlas, whitelist your IP address

### Port Already in Use
- Change PORT in .env file
- Or kill the process: `lsof -i :3000` then `kill -9 <PID>`

### Module Not Found Errors
- Run `npm install` again
- Delete `node_modules` and `package-lock.json`, then run `npm install`

## Next Steps

1. Connect your frontend to these API endpoints
2. Update JWT verification middleware for production
3. Add input validation and error handling
4. Deploy to a hosting platform (Heroku, Railway, etc.)
5. Use MongoDB Atlas for production database
