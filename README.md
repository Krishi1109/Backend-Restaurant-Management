# Restaurant Management Backend

## Overview

This project provides a backend API for managing restaurant operations, including user authentication, user management, menu management, order management, and more.

### Technologies Used
- Node.js
- Express.js
- MongoDB

## Features

- **Sign In / Sign Up**: 
  - Users can sign in or sign up to access the system.
  
- **Forget Password**:
  - Users can request to reset their password if forgotten.
  
- **JWT Validation**:
  - JSON Web Token (JWT) validation is implemented on each authorized request to ensure security.
  
- **Authorization Validation**:
  - Different levels of authorization are implemented:
    - Admin Access: Access to administrative functionalities.
    - Customer Access: Access to customer-specific functionalities.
  
## API Endpoints

### Users
- `POST /api/users`: Create a new user.
- `GET /api/users`: Get all users (Admin).
- `GET /api/users/:userId`: Get details of a particular user (Admin).
- `POST /api/users/login`: Login user.
- `GET /api/users/profile`: Get user profile.
- `PUT /api/users/profile`: Update user profile.
- `PUT /api/users/:userId/role`: Update user role (Admin).
- `POST /api/users/logout`: Logout user.
- `DELETE /api/users/:userId`: Delete user (Admin).

### Authentication
- `POST /api/auth/forgot-password`: Forgot password.
- `POST /api/auth/reset-password`: Reset password.

### Menu
- `POST /api/menu`: Add a new food item (Admin).
- `PUT /api/menu/:itemId`: Update food item (Admin).
- `DELETE /api/menu/:itemId`: Delete food item (Admin).
- `GET /api/menu`: Get all items (Menu).

### Orders
- `POST /api/orders`: Place a new order.
- `GET /api/orders`: Get all orders (Admin).
- `GET /api/orders/user`: Get orders of a specific user.
- `PUT /api/orders/:orderId/status`: Change order status (Admin).
- `DELETE /api/orders/:orderId`: Delete order (Admin).

## Usage

1. Clone the repository.
2. Install dependencies: `npm install`.
3. Set up environment variables (e.g., MongoDB URI, JWT secret).
4. Run the server: `npm start`.

## Contributors

- [Krishi Tanna](https://github.com/Krishi1109)

