# Ulimi Smart Farming System - Development Setup

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v16 or higher)
- npm or yarn package manager
- Git for version control

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
├── server/                 # Backend services (if needed)
│   ├── functions/          # Supabase edge functions
│   └── package.json
├── ai-models/              # AI/ML models
│   ├── pest-detection/
│   ├── recommendation-engine/
│   └── price-prediction/
├── docs/                   # Documentation
└── README.md
```

## Setting up the Frontend

1. Navigate to the client directory:
   ```
   cd client
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

4. The application will be available at `http://localhost:3000`

## Setting up Supabase

1. Create a new project at https://app.supabase.com
2. Note your project URL and anon/public keys
3. Set up authentication providers
4. Create database tables using the SQL editor

## Environment Variables

Create a `.env` file in the client directory with the following variables:

```
REACT_APP_SUPABASE_URL=your_supabase_project_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Available Scripts

In the client directory, you can run:

### `npm start`
Runs the app in development mode.
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `npm test`
Launches the test runner in interactive watch mode.

### `npm run build`
Builds the app for production to the `build` folder.

### `npm run eject`
**Note: this is a one-way operation. Once you eject, you can't go back!**

## Development Workflow

1. Create a new feature branch for your work:
   ```
   git checkout -b feature/your-feature-name
   ```

2. Make your changes and commit them:
   ```
   git add .
   git commit -m "Add your feature description"
   ```

3. Push your branch to GitHub:
   ```
   git push origin feature/your-feature-name
   ```

4. Create a pull request for code review.

## Code Structure Guidelines

### Components
- Create reusable components in the `src/components` directory
- Use functional components with hooks
- Follow the single responsibility principle

### Pages
- Create page components in the `src/pages` directory
- Each page should represent a route in the application
- Pages should compose components to build the UI

### Services
- Create service files in the `src/services` directory
- Services should handle API calls and data fetching
- Use async/await for API calls

### Utilities
- Create utility functions in the `src/utils` directory
- Utilities should be pure functions that can be reused
- Group related utilities in the same file

## Testing

### Unit Tests
- Write unit tests for components and utility functions
- Use Jest and React Testing Library
- Place test files next to the components they test with `.test.js` extension

### Integration Tests
- Write integration tests for API services
- Test the interaction between components and services

### End-to-End Tests
- Write end-to-end tests for critical user flows
- Use Cypress or similar tools

## Deployment

### Frontend
- The frontend can be deployed to Vercel, Netlify, or similar platforms
- Run `npm run build` to create a production build
- Configure environment variables in your deployment platform

### Backend
- Backend services run on Supabase platform
- Database migrations should be managed through Supabase

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a pull request

## Troubleshooting

### Common Issues

1. **Dependency installation fails**
   - Clear npm cache: `npm cache clean --force`
   - Delete node_modules and package-lock.json
   - Run `npm install` again

2. **Development server fails to start**
   - Check if port 3000 is already in use
   - Try `npm start` again

3. **API calls fail**
   - Verify Supabase credentials in environment variables
   - Check network connectivity

### Getting Help

- Check the documentation in the `docs` directory
- Review existing code for examples
- Reach out to the team for assistance