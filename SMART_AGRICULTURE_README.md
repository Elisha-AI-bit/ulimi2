# Ulimi Smart Agriculture System

## Overview

The Ulimi Smart Agriculture System is an AI-powered farming recommendation platform that provides farmers with personalized advice based on real-time weather, soil conditions, and crop data.

## Features

1. **Farmer Input Collection**
   - Location input (manual or auto-detect via browser geolocation)
   - Crop selection from available options
   - Planting date tracking

2. **Data Display**
   - Current weather conditions (temperature, rainfall, humidity, sunlight)
   - Soil data (type, pH, nutrients, moisture)
   - AI-generated recommendations for:
     - Fertilizer schedule
     - Irrigation requirements
     - Optimal planting time
     - Expected yield projections
     - Profit estimates
     - Risk warnings

3. **Data Visualization**
   - Yield projection charts over time
   - Profit projection charts
   - Key metrics display

## Database Schema

The system uses the following tables:

1. **weather_data**
   - location (TEXT)
   - date (DATE)
   - temperature (DOUBLE PRECISION)
   - rainfall (DOUBLE PRECISION)
   - humidity (DOUBLE PRECISION)
   - sunlight_hours (DOUBLE PRECISION)

2. **soil_data**
   - location (TEXT)
   - soil_type (TEXT)
   - ph (DOUBLE PRECISION)
   - nitrogen (DOUBLE PRECISION)
   - phosphorus (DOUBLE PRECISION)
   - potassium (DOUBLE PRECISION)
   - moisture (DOUBLE PRECISION)

3. **crops**
   - crop_name (TEXT)
   - optimal_soil (TEXT)
   - optimal_rainfall (DOUBLE PRECISION)
   - optimal_temp_min (DOUBLE PRECISION)
   - optimal_temp_max (DOUBLE PRECISION)
   - market_price (DOUBLE PRECISION)

4. **farmer_inputs**
   - farmer_id (UUID)
   - location (TEXT)
   - selected_crop (TEXT)
   - planting_date (DATE)

5. **recommendations**
   - farmer_id (UUID)
   - crop_name (TEXT)
   - recommendation_text (TEXT)
   - expected_yield (DOUBLE PRECISION)
   - profit_estimate (DOUBLE PRECISION)
   - risk_warnings (TEXT[])
   - timestamp (TIMESTAMP WITH TIME ZONE)

## API Endpoints

1. **POST `/api/farmer_input`**
   - Saves new farmer input data
   - Request body: FarmerInput object
   - Response: Success message

2. **GET `/api/simulate/{farmer_id}`**
   - Generates AI recommendations for a specific farmer
   - Response: SimulationResponse object containing weather data, soil data, and recommendations

## AI Recommendation Engine

The AI recommendation engine compares current weather and soil data with crop optimal requirements to generate:

- Fertilizer & irrigation schedules
- Best planting times
- Expected yield estimates (tons/ha)
- Profit projections
- Risk warnings for pests, diseases, and extreme weather

## Frontend Components

1. **SmartAgricultureDashboard**
   - Main dashboard component for the smart agriculture system
   - Includes input forms, data displays, and visualization charts
   - Uses Recharts for data visualization

## Setup and Installation

1. Ensure you have the required dependencies installed:
   ```bash
   npm install recharts
   ```

2. Update your database schema with the tables defined in `SUPABASE_SCHEMA.sql`

3. Add sample data using the SQL scripts in `api/data/sample_data.sql`

4. Start the development server:
   ```bash
   npm run dev
   ```

## Integration

The frontend fetches data from the backend API and displays it in a user-friendly dashboard with charts. The system is designed to be modular and can be easily extended with additional features.

## Future Enhancements

- Integration with real weather APIs
- Soil sensor data integration
- Mobile app development
- Advanced machine learning models for more accurate predictions
- Multilingual support for local languages