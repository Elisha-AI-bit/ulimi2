# Ulimi Smart Agriculture System - User Guide

## Introduction

Welcome to the Ulimi Smart Agriculture System! This guide will help you understand how to use our AI-powered farming recommendation platform to optimize your agricultural practices.

## Getting Started

### Accessing the Dashboard

1. Log in to the Ulimi platform
2. Navigate to the "Smart Agriculture" section from the main menu
3. You'll be directed to the Smart Agriculture Dashboard

### Dashboard Overview

The dashboard is divided into several sections:

1. **Farm Information Input**
   - Location entry (manual or auto-detect)
   - Crop selection
   - Generate Recommendations button

2. **Current Conditions Display**
   - Weather data panel
   - Soil conditions panel

3. **AI Recommendations**
   - Detailed farming advice
   - Key metrics (yield, profit)
   - Risk warnings

4. **Data Visualization**
   - Yield projection chart
   - Profit projection chart

## Using the System

### 1. Entering Farm Information

#### Location
- Enter your farm location manually in the location field
- Or click the location icon to auto-detect your current position

#### Crop Selection
- Choose your crop from the dropdown menu:
  - Maize
  - Soybeans
  - Groundnuts
  - Cassava
  - Rice

#### Generate Recommendations
- Click the "Generate Recommendations" button to receive AI-powered advice

### 2. Understanding the Results

#### Weather Data
- **Temperature**: Current temperature in Celsius
- **Rainfall**: Recent rainfall in millimeters
- **Humidity**: Current humidity percentage
- **Sunlight**: Daily sunlight hours

#### Soil Conditions
- **Soil Type**: Classification of your soil
- **pH Level**: Acidity/alkalinity of your soil
- **Nutrients**: Nitrogen, phosphorus, and potassium levels in ppm
- **Moisture**: Soil moisture percentage

#### AI Recommendations
The AI provides detailed advice on:
- Fertilizer application schedule
- Irrigation requirements
- Optimal planting times
- Expected yield projections
- Profit estimates
- Risk warnings for pests, diseases, and weather

#### Key Metrics
- **Expected Yield**: Projected harvest in tons per hectare
- **Profit Estimate**: Expected earnings per hectare in ZMW
- **Planting Date**: Recommended planting date

#### Risk Warnings
Potential issues to monitor:
- Pest infestations
- Disease outbreaks
- Weather-related risks
- Nutrient deficiencies

### 3. Data Visualization

#### Yield Projection Chart
- Shows expected yield progression over time
- Helps plan harvest schedules

#### Profit Projection Chart
- Displays profit estimates over time
- Assists with financial planning

## Technical Information

### Database Structure

The system uses five main database tables:

1. **weather_data**: Stores weather information for different locations
2. **soil_data**: Contains soil composition data
3. **crops**: Defines crop characteristics and optimal growing conditions
4. **farmer_inputs**: Records farmer-provided information
5. **recommendations**: Stores AI-generated recommendations

### API Endpoints

1. **POST `/api/farmer_input`**
   - Saves farmer information to the database
   - Requires: farmer_id, location, selected_crop, planting_date

2. **GET `/api/simulate/{farmer_id}`**
   - Generates personalized recommendations
   - Returns: weather data, soil data, and farming advice

### AI Recommendation Engine

The system compares current conditions with crop optimal requirements to generate recommendations on:

- Fertilization schedules
- Irrigation timing and amounts
- Planting dates
- Yield predictions
- Profit forecasts
- Risk assessments

## Troubleshooting

### Common Issues

1. **Location Detection Fails**
   - Ensure browser location services are enabled
   - Check that the website has permission to access location
   - Try entering your location manually

2. **Recommendations Not Loading**
   - Check your internet connection
   - Refresh the page
   - Clear browser cache and try again

3. **Charts Not Displaying**
   - Ensure JavaScript is enabled in your browser
   - Try a different browser if the issue persists

### Support

For technical support, contact:
- Email: support@ulimi.org
- Phone: +260 XXX XXX XXX

## Best Practices

1. **Regular Updates**
   - Update your location and crop information regularly
   - Refresh recommendations as conditions change

2. **Data Accuracy**
   - Provide accurate location information
   - Select the correct crop type
   - Update planting dates when changed

3. **Following Recommendations**
   - Implement AI recommendations for best results
   - Monitor crops for the identified risks
   - Adjust practices based on updated recommendations

## Privacy and Security

- All farmer data is securely stored
- Personal information is never shared with third parties
- Location data is only used for providing recommendations
- Farmers maintain full control over their data

## Feedback and Improvement

We continuously improve our system based on user feedback. To help us enhance the platform:

1. Report any issues or bugs
2. Suggest new features or improvements
3. Share your success stories using the system
4. Provide feedback on recommendation accuracy

Contact us at feedback@ulimi.org with your suggestions.

## Conclusion

The Ulimi Smart Agriculture System is designed to help farmers make informed decisions based on real-time data and AI-powered insights. By following the recommendations and monitoring the projections, you can optimize your farming practices for better yields and higher profits.

Happy farming!