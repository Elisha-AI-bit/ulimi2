# Ulimi Smart Farming System

A comprehensive smart farming management and advisory system that leverages AI to provide farmers with data-driven insights for crop management, livestock monitoring, pest and disease detection, marketplace integration, and performance reporting.

## Features

- AI-driven crop recommendations and irrigation schedules
- Livestock health and behavior monitoring
- Pest and disease detection using image recognition
- Marketplace for farmers to sell produce
- Performance reports and comparative analytics
- Support for multiple user roles with tailored interfaces

## Technology Stack

- **Frontend**: React.js with Material-UI
- **Backend**: Supabase (PostgreSQL with built-in authentication and real-time capabilities)
- **AI/ML**: Custom JavaScript implementations simulating TensorFlow.js functionality
- **IoT Simulation**: Node.js services with mock data generation

## Project Structure

```
ulimi-smart-farming/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components for routes
│   │   ├── services/       # API service integrations
│   │   ├── utils/          # Utility functions
│   │   ├── hooks/          # Custom React hooks
│   │   └── assets/         # Images, styles, etc.
│   └── package.json
├── server/                 # Backend services and database schema
│   ├── iot-simulator.js    # IoT sensor data simulation
│   └── database-schema.sql # Supabase database schema
├── ai-models/              # AI/ML model implementations
│   ├── pest-detection.js      # Pest/disease detection
│   ├── recommendation-engine.js # Farming recommendations
│   ├── price-prediction.js    # Market price forecasting
│   └── livestock-monitoring.js # Animal health monitoring
├── docs/                   # Documentation
│   ├── api-documentation.md   # API endpoints reference
│   ├── development-setup.md   # Developer setup guide
│   ├── user-guide.md          # User manual
│   └── ai-ml-models.md        # AI/ML models documentation
└── README.md
```

## Getting Started

1. Clone the repository
2. Install dependencies: `cd client && npm install`
3. Set up Supabase project
4. Configure environment variables
5. Run the development server: `npm start`

## Available Scripts

In the client directory, you can run:

### `npm start`
Runs the app in development mode.
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `npm test`
Launches the test runner in interactive watch mode.

### `npm run build`
Builds the app for production to the `build` folder.

## Documentation

- [API Documentation](docs/api-documentation.md)
- [Development Setup Guide](docs/development-setup.md)
- [User Guide](docs/user-guide.md)
- [AI/ML Models Documentation](docs/ai-ml-models.md)
- [Project Summary](PROJECT_SUMMARY.md)

## Key Components

### User Roles
- **Farmer**: Manages farm operations, receives AI recommendations, and sells produce
- **Buyer**: Purchases agricultural products from the marketplace
- **Vendor**: Lists products for sale in the marketplace
- **Admin**: Manages users and monitors system performance

### AI/ML Features
- **Pest & Disease Detection**: Upload images to detect agricultural pests and diseases
- **Recommendation Engine**: Get personalized farming recommendations
- **Price Prediction**: Forecast market prices for better selling decisions
- **Livestock Monitoring**: Track animal health and predict breeding cycles

### IoT Integration
- **Sensor Data Simulation**: Realistic mock data for soil moisture, temperature, and humidity
- **Real-time Monitoring**: Dashboard visualization of sensor data

### Marketplace
- **Product Listings**: Vendors can list agricultural products
- **Shopping Experience**: Buyers can browse and purchase products
- **Order Management**: Track order status and history

## Security

- Role-based access control
- Row Level Security (RLS) policies
- Authentication via Supabase Auth
- Data encryption at rest

## Deployment

### Frontend
- Ready for deployment to Vercel or Netlify
- Production build with `npm run build`

### Backend
- Database schema for Supabase
- Storage bucket configuration
- RLS policies for data protection

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.