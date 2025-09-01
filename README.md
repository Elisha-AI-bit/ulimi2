# ULIMI 2.0 - Farming Management System with Supabase Integration

## Overview
ULIMI 2.0 is a comprehensive farming management system designed to revolutionize agricultural practices through technology. This version has been enhanced with Supabase integration for robust backend services including authentication, database management, and real-time features.

## Features
- **User Authentication**: Secure registration and login using Supabase Auth
- **Farm Management**: Create and manage multiple farm profiles
- **Task Management**: Track agricultural tasks and activities
- **Marketplace**: Buy and sell agricultural products
- **AI Agricultural Advisor**: Soil analysis and plant disease identification
- **IoT Smart Irrigation**: Monitor and control irrigation systems
- **Community Forum**: Connect with other farmers and experts
- **Weather Integration**: Real-time weather information and forecasts

## Technology Stack
- **Frontend**: React with TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Backend**: Supabase (Auth, Database, Storage)
- **Build Tool**: Vite
- **Testing**: Vitest

## Prerequisites
- Node.js (version 16 or higher)
- npm or yarn package manager
- Supabase account (free tier available)

## Setup Instructions

### 1. Clone the Repository
```bash
git clone <repository-url>
cd ulimi
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Supabase
1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Copy your project URL and anon key
3. Create a `.env` file in the project root:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Set Up Database
1. Run the schema script `SUPABASE_SCHEMA.sql` in your Supabase SQL editor
2. Configure Row Level Security (RLS) policies as needed

### 5. Start the Development Server
```bash
npm run dev
```

### 6. Build for Production
```bash
npm run build
```

## Supabase Integration Details

### Authentication
The system uses Supabase Auth for user management:
- Email/password authentication
- User session persistence
- Profile management
- Role-based access control

### Database
Supabase PostgreSQL database stores all application data:
- Users and profiles
- Farms and crops
- Tasks and activities
- Marketplace items and orders
- Inventory management
- Weather data
- AI recommendations

### Security
- Row Level Security (RLS) policies protect data
- Authenticated access to all resources
- Data isolation between users

## Project Structure
```
src/
├── components/           # React components
├── contexts/             # React context providers
├── services/             # Supabase services and utilities
├── utils/                # Utility functions
├── types/                # TypeScript interfaces and types
├── App.tsx              # Main application component
└── main.tsx             # Application entry point
```

## Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm test` - Run tests

## User Roles
1. **Admin**: System administrators with full access
2. **Farmer**: Agricultural producers managing farms
3. **Vendor**: Suppliers of agricultural products
4. **Customer**: End consumers purchasing products

## Contributing
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a pull request

## License
This project is licensed under the MIT License.

## Support
For issues and feature requests, please create an issue in the GitHub repository.