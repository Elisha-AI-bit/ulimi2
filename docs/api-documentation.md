# Ulimi Smart Farming System - API Documentation

## Overview

This document provides details about the API endpoints available in the Ulimi Smart Farming System.

## Authentication

All API requests require authentication via Supabase Auth.

### Register
```
POST /auth/register
```

Registers a new user in the system.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "name": "John Farmer",
  "phone": "+1234567890",
  "address": "123 Farm Road, Agriculture City",
  "role": "farmer"
}
```

### Login
```
POST /auth/login
```

Authenticates a user and returns an access token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

## Farm Data Management

### Create Farm
```
POST /farms
```

Creates a new farm record.

**Request Body:**
```json
{
  "name": "Green Acres",
  "location": "Latitude: 37.7749, Longitude: -122.4194",
  "size": 50,
  "crop_type": "tomatoes",
  "owner_id": "user-uuid"
}
```

### Get All Farms
```
GET /farms
```

Retrieves all farms for the authenticated user.

### Get Specific Farm
```
GET /farms/{id}
```

Retrieves details for a specific farm.

### Update Farm
```
PUT /farms/{id}
```

Updates information for a specific farm.

### Delete Farm
```
DELETE /farms/{id}
```

Deletes a specific farm.

## Sensor Data

### Submit Sensor Data
```
POST /sensor-data
```

Submits new sensor readings.

**Request Body:**
```json
{
  "farm_id": "farm-uuid",
  "soil_moisture": 45.5,
  "temperature": 24.2,
  "humidity": 65.0,
  "ph_level": 6.8,
  "nitrogen": 120,
  "phosphorus": 85,
  "potassium": 150
}
```

### Get Sensor Data
```
GET /sensor-data/{farmId}
```

Retrieves sensor data for a specific farm.

### Get Latest Sensor Data
```
GET /sensor-data/{farmId}/latest
```

Retrieves the most recent sensor readings for a farm.

## Pest & Disease Detection

### Submit Image for Analysis
```
POST /pest-detection
```

Submits an image for pest and disease detection.

**Request Body:**
```json
{
  "farm_id": "farm-uuid",
  "image_url": "https://example.com/image.jpg"
}
```

### Get Detection History
```
GET /pest-detection/{farmId}
```

Retrieves pest and disease detection history for a farm.

## Recommendations

### Get AI Recommendations
```
GET /recommendations/{farmId}
```

Retrieves AI-generated recommendations for a farm.

### Submit Feedback
```
POST /recommendations/feedback
```

Submits feedback on recommendations.

**Request Body:**
```json
{
  "recommendation_id": "rec-uuid",
  "farm_id": "farm-uuid",
  "feedback": "helpful",
  "notes": "This recommendation was very useful"
}
```

## Livestock Management

### Add New Animal
```
POST /livestock
```

Adds a new animal to a farm.

**Request Body:**
```json
{
  "farm_id": "farm-uuid",
  "name": "Bessie",
  "type": "cattle",
  "breed": "Holstein",
  "age": 3,
  "weight": 650
}
```

### Get Livestock
```
GET /livestock/{farmId}
```

Retrieves all livestock for a farm.

### Get Specific Animal
```
GET /livestock/animal/{id}
```

Retrieves details for a specific animal.

### Update Animal
```
PUT /livestock/animal/{id}
```

Updates information for a specific animal.

### Remove Animal
```
DELETE /livestock/animal/{id}
```

Removes an animal from a farm.

### Submit Health Check
```
POST /livestock/health
```

Submits health check data for an animal.

**Request Body:**
```json
{
  "animal_id": "animal-uuid",
  "temperature": 38.5,
  "activity_level": 85,
  "food_intake": 15.2,
  "water_intake": 8.7,
  "notes": "Animal appears healthy"
}
```

### Get Health History
```
GET /livestock/health/{animalId}
```

Retrieves health history for a specific animal.

## Marketplace

### Create Product Listing
```
POST /products
```

Creates a new product listing.

**Request Body:**
```json
{
  "name": "Organic Tomatoes",
  "description": "Fresh organic tomatoes from local farm",
  "price": 3.99,
  "quantity": 50,
  "vendor_id": "user-uuid",
  "category": "vegetables",
  "image_url": "https://example.com/tomatoes.jpg"
}
```

### Get All Products
```
GET /products
```

Retrieves all products in the marketplace.

### Get Specific Product
```
GET /products/{id}
```

Retrieves details for a specific product.

### Update Product
```
PUT /products/{id}
```

Updates information for a specific product.

### Delete Product
```
DELETE /products/{id}
```

Deletes a specific product.

### Create Order
```
POST /orders
```

Creates a new order.

**Request Body:**
```json
{
  "buyer_id": "user-uuid",
  "product_id": "product-uuid",
  "quantity": 5
}
```

### Get User Orders
```
GET /orders
```

Retrieves orders for the authenticated user.

## Reporting

### Get Performance Report
```
GET /reports/performance/{farmId}
```

Retrieves a performance report for a specific farm.

### Get Comparative Report
```
GET /reports/comparison
```

Retrieves a comparative report across all farms (Admin only).

### Get Pest Report
```
GET /reports/pest/{farmId}
```

Retrieves a pest and disease report for a specific farm.

### Get Livestock Report
```
GET /reports/livestock/{farmId}
```

Retrieves a livestock health report for a specific farm.