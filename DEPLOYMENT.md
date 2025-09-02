# Deployment Instructions for ULIMI AI Advisor

This document provides step-by-step instructions for deploying the ULIMI AI Advisor application on Vercel.

## Prerequisites

1. A Vercel account (sign up at [vercel.com](https://vercel.com))
2. The project codebase (frontend and backend)
3. Node.js and npm installed locally (for frontend build)
4. An OpenAI API key (sign up at [platform.openai.com](https://platform.openai.com))

## Folder Structure

The project should have the following structure for proper deployment:

```
ulimi-ai-advisor/
├── src/                 # Frontend React components
├── api/                 # Python FastAPI backend
│   ├── main.py         # API entry point
│   ├── requirements.txt # Python dependencies
│   ├── data/           # Sample data files
│   └── README.md       # API documentation
├── public/              # Static assets
├── index.html           # Main HTML file
├── package.json         # Frontend dependencies
├── vercel.json          # Vercel configuration
└── ...                  # Other configuration files
```

## Deployment Steps

### 1. Prepare the Project

Ensure all files are in the correct locations as shown in the folder structure above.

### 2. Deploy to Vercel

#### Option A: Using Vercel CLI (Recommended)

1. Install Vercel CLI globally:
   ```bash
   npm install -g vercel
   ```

2. Navigate to your project directory:
   ```bash
   cd path/to/ulimi-ai-advisor
   ```

3. Deploy the project:
   ```bash
   vercel --prod
   ```

4. Follow the prompts:
   - Set up and deploy? `Y`
   - Which scope? (Select your Vercel account)
   - Link to existing project? `N`
   - What's your project's name? `ulimi-ai-advisor`
   - In which directory is your code located? `./`
   - Want to override the settings? `N`

#### Option B: Using Git Integration

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Go to your Vercel dashboard
3. Click "New Project"
4. Import your Git repository
5. Configure the project:
   - Framework Preset: `Other`
   - Root Directory: `./`
   - Build and Output Settings:
     - Build Command: `npm run build`
     - Output Directory: `dist`
     - Install Command: `npm install`
6. Click "Deploy"

### 3. Environment Variables

For the application to work properly, you need to set the following environment variables in your Vercel project:

1. In your Vercel project dashboard, go to Settings > Environment Variables
2. Add the required environment variables:
   - `OPENAI_API_KEY` - Your OpenAI API key (required for AI functionality)
   - `VITE_SUPABASE_URL` - Your Supabase URL (if using Supabase)
   - `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous key (if using Supabase)
   - Any other required variables

### 4. Custom Domain (Optional)

1. In your Vercel project dashboard, go to Settings > Domains
2. Add your custom domain
3. Follow the DNS configuration instructions provided by Vercel

## API Endpoints

After deployment, your API will be available at:
- Advisor endpoint: `https://your-project.vercel.app/api/advisor`
- Recommendations endpoint: `https://your-project.vercel.app/api/recommendations`
- Capabilities endpoint: `https://your-project.vercel.app/api/capabilities`
- Decision support endpoint: `https://your-project.vercel.app/api/decision-support`

## Troubleshooting

### Common Issues

1. **Build Failures**: Ensure all dependencies are correctly listed in `package.json` and `api/requirements.txt`

2. **CORS Errors**: The backend includes CORS middleware, but if you encounter issues, verify the frontend is making requests to the correct API endpoints

3. **404 Errors**: Make sure your `vercel.json` routing configuration is correct

4. **Python Runtime Issues**: Ensure your `vercel.json` specifies the correct Python runtime version

5. **OpenAI API Errors**: Verify that your `OPENAI_API_KEY` environment variable is correctly set and has sufficient quota

### Logs and Monitoring

1. View deployment logs in the Vercel dashboard under your project's deployments
2. Monitor function logs in the Vercel dashboard under your project's functions
3. Set up alerts for error rates and performance metrics

## Updating the Deployment

To update your deployed application:

1. Make changes to your code
2. Commit and push to your Git repository (if using Git integration)
3. If using Vercel CLI:
   ```bash
   vercel --prod
   ```

## Scaling and Performance

Vercel automatically scales Serverless Functions based on demand. For high-traffic applications:

1. Monitor function execution times and optimize as needed
2. Consider caching strategies for frequently accessed data
3. Implement proper error handling and rate limiting

## Security Considerations

1. Never commit sensitive information like API keys to version control
2. Use environment variables for sensitive configuration
3. Implement proper authentication and authorization in your API
4. Regularly update dependencies to address security vulnerabilities
5. Monitor your OpenAI API usage and set up billing alerts to prevent unexpected charges