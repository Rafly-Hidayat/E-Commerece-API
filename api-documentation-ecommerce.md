# E-Commerce API Documentation

This document provides detailed information about the endpoints available in the E-Commerce API.

## Base URL

All URLs referenced in the documentation have the following base:

```
http://localhost:3000
```

## Authentication

Most endpoints require authentication using a JWT token. Include the token in the Authorization header of your requests:

```
Authorization: Bearer <your_jwt_token>
```

## Endpoints

### Authentication

#### Register a new user

- **URL**: `/auth/register`
- **Method**: `POST`
- **Auth required**: No
- **Request body**:
  ```json
  {
    "username": "string",
    "email": "string",
    "password": "string"
  }
  ```
- **Success Response**:
  - **Code**: 201
  - **Content**:
    ```json
    {
      "token": "string"
    }
    ```

#### Login

- **URL**: `/auth/login`
- **Method**: `POST`
- **Auth required**: No
- **Request body**:
  ```json
  {
    "username": "string",
    "password": "string"
  }
  ```
- **Success Response**:
  - **Code**: 200
  - **Content**:
    ```json
    {
      "token": "string"
    }
    ```

### Products

#### Get all products

- **URL**: `/products`
- **Method**: `GET`
- **Auth required**: Yes
- **URL Params**:
  - `page` (optional): Page number (default: 1)
  - `pageSize` (optional): Number of items per page (default: 8, max: 100)
- **Success Response**:
  - **Code**: 200
  - **Content**:
    ```json
    {
      "products": [
        {
          "id": "number",
          "title": "string",
          "sku": "string",
          "image_url": "string",
          "price": "number",
          "description": "string"
        }
      ],
      "total": "number",
      "page": "number",
      "pageSize": "number",
      "totalPages": "number"
    }
    ```

#### Get a specific product

- **URL**: `/products/{id}`
- **Method**: `GET`
- **Auth required**: Yes
- **URL Params**: None
- **Success Response**:
  - **Code**: 200
  - **Content**:
    ```json
    {
      "id": "number",
      "title": "string",
      "sku": "string",
      "image_url": "string",
      "price": "number",
      "description": "string"
    }
    ```

#### Create a new product

- **URL**: `/products`
- **Method**: `POST`
- **Auth required**: Yes
- **Content-Type**: `multipart/form-data`
- **Request body**:
  - `title`: string (required)
  - `sku`: string (required)
  - `price`: number (required)
  - `description`: string (optional)
  - `image`: file (required, max 5MB, types: jpg, jpeg, png)
- **Success Response**:
  - **Code**: 201
  - **Content**:
    ```json
    {
      "id": "number",
      "title": "string",
      "sku": "string",
      "image_url": "string",
      "price": "number",
      "description": "string"
    }
    ```

#### Update a product

- **URL**: `/products/{id}`
- **Method**: `PUT`
- **Auth required**: Yes
- **Content-Type**: `multipart/form-data`
- **Request body**:
  - `title`: string (optional)
  - `sku`: string (optional)
  - `price`: number (optional)
  - `description`: string (optional)
  - `image`: file (optional, max 5MB, types: jpg, jpeg, png)
- **Success Response**:
  - **Code**: 200
  - **Content**:
    ```json
    {
      "id": "number",
      "title": "string",
      "sku": "string",
      "image_url": "string",
      "price": "number",
      "description": "string"
    }
    ```

#### Delete a product

- **URL**: `/products/{id}`
- **Method**: `DELETE`
- **Auth required**: Yes
- **Success Response**:
  - **Code**: 200
  - **Content**:
    ```json
    {
      "message": "Product deleted successfully"
    }
    ```

#### Import products

- **URL**: `/products/import`
- **Method**: `POST`
- **Auth required**: Yes
- **Success Response**:
  - **Code**: 200
  - **Content**:
    ```json
    {
      "message": "Products imported successfully"
    }
    ```

## Error Responses

- **Unauthorized**:

  - **Code**: 401
  - **Content**: `{ "error": "Unauthorized" }`

- **Not Found**:

  - **Code**: 404
  - **Content**: `{ "error": "Not found" }`

- **Conflict**:

  - **Code**: 409
  - **Content**: `{ "error": "Conflict" }`

- **Internal Server Error**:
  - **Code**: 500
  - **Content**: `{ "error": "Internal Server Error" }`

## Data Models

### Product

```typescript
{
  id: number;
  title: string;
  sku: string;
  image_url: string;
  price: number;
  description: string | null;
}
```

## Notes

- The `sku` field must be unique for each product.
- The `description` field can be null.
- The `/products/import` endpoint fetches product data from the Dummy JSON API and imports it into the local database.
- The `image_url` field in the response will contain the path to the uploaded image file.
- Uploaded images are stored in the `uploads` directory on the server.
- Maximum file size for image uploads is 5MB.
- Accepted image formats are JPG, JPEG, and PNG.
