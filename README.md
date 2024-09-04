# E-Commerce API

This project is a simple E-Commerce Web API built with Node.js, Hapi.js, and PostgreSQL.

## Prerequisites

- Node.js (v14 or later)
- PostgreSQL
- npm/pnpm/yarn (i use pnpm)

## Setup

1. Clone the repository:
   ```
   git clone https://github.com/Rafly-Hidayat/E-Commerece-API.git
   cd E-Commerece-API
   ```

2. Install dependencies:
   ```
   pnpm install
   ```

3. Set up the database:
   - Create a PostgreSQL database for the project
   - Run the migration script located in `src/config/db_migration.sql`

4. Set up environment variables:
   - Create a `.env` file in the root directory
   - Add the following variables:
     ```
     PORT=3000
     DB_HOST=localhost
     DB_PORT=5432
     DB_NAME=your_database_name
     DB_USER=your_database_user
     DB_PASSWORD=your_database_password
     JWT_SECRET=your_jwt_secret
     ```

## Running the API

1. Start the server:
   ```
   pnpm start
   ```
   or in development:
   ```
   pnpm run dev
   ```

2. The API will be available at `http://localhost:3000`

## API Endpoints

- POST /auth/register - Register a new user
- POST /auth/login - Login and receive a JWT token
- GET /products - Get all products (requires authentication)
- GET /products/{id} - Get a specific product (requires authentication)
- POST /products - Create a new product (requires authentication)
- PUT /products/{id} - Update a product (requires authentication)
- DELETE /products/{id} - Delete a product (requires authentication)
- POST /products/import - Import products from Dummy JSON API (requires authentication)

## Additional Notes

- A default admin user is created if the users table is empty. Username: 'admin', Password: 'adminpassword'
- Make sure to include the JWT token in the Authorization header for authenticated requests: `Authorization: Bearer <token>`