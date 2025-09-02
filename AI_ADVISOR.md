# ULIMI AI Advisor Documentation

## Overview

The ULIMI AI Advisor is an intelligent farming assistant that provides personalized agricultural advice to farmers. It offers features such as chat-based consultation, personalized recommendations, and plant vision analysis.

## Features

### 1. Chat Advisor
Users can interact with the AI through a chat interface, asking questions about:
- Crop planning and planting schedules
- Pest and disease identification
- Weather insights and recommendations
- Fertilizer and input recommendations
- Market price predictions

### 2. Recommendations
The AI provides personalized recommendations based on:
- User's farming history
- Location-specific data
- Current farming conditions
- Seasonal factors

### 3. Vision Analysis
Users can upload photos of their crops for AI-powered analysis of:
- Pest infestations
- Disease symptoms
- Nutrient deficiencies
- General plant health

## Technical Implementation

### Frontend (React/TypeScript)
The frontend component is located at `src/components/AIAdvisor.tsx` and includes:
- Tab-based navigation between chat, recommendations, and vision analysis
- Real-time chat interface with message history
- Loading states and error handling
- Integration with authentication context

### Backend (Python/FastAPI)
The backend API is implemented with FastAPI and includes the following endpoints:

#### POST /api/advisor
Get AI-generated farming advice based on user input.

**Request Body:**
```json
{
  "message": "string",
  "userId": "string",
  "language": "string"
}
```

**Response:**
```json
{
  "response": "string"
}
```

#### GET /api/recommendations
Get personalized AI recommendations for a user.

**Query Parameters:**
- `userId` (required): User ID

**Response:**
```json
{
  "recommendations": [
    {
      "id": "string",
      "type": "string",
      "title": "string",
      "description": "string",
      "confidence": "integer",
      "createdAt": "string"
    }
  ]
}
```

#### GET /api/capabilities
Get available AI capabilities.

**Response:**
```json
{
  "capabilities": [
    {
      "name": "string",
      "description": "string"
    }
  ]
}
```

#### GET /api/decision-support
Get AI-assisted decision recommendations.

**Query Parameters:**
- `userId` (required): User ID
- `context` (optional): Context for decision support

**Response:**
```json
{
  "userId": "string",
  "context": "string",
  "decisions": [
    {
      "id": "string",
      "title": "string",
      "description": "string",
      "confidence": "integer",
      "factors": ["string"],
      "recommendation": "string",
      "alternatives": ["string"]
    }
  ]
}
```

## Deployment

The application is configured for deployment on Vercel with:
- Frontend served as a static site
- Python backend running as Serverless Functions
- Proper CORS configuration for frontend-backend communication

## Usage Examples

### Chatting with the AI Advisor
1. Navigate to the AI Advisor component
2. Type your question in the chat input (e.g., "What crops should I plant in November?")
3. Press Enter or click the Send button
4. Wait for the AI response to appear in the chat

### Viewing Recommendations
1. Click on the "Recommendations" tab
2. The system will automatically fetch personalized recommendations
3. View details about each recommendation including confidence level and creation date

### Vision Analysis (Future Implementation)
1. Click on the "Vision Analysis" tab
2. Click "Upload Photo" to select an image of your crop
3. The AI will analyze the image and provide insights

## Error Handling

The component includes comprehensive error handling:
- Network error detection and user-friendly error messages
- Loading states during API requests
- Fallback to local storage when network requests fail
- Graceful degradation when backend services are unavailable

## Future Enhancements

Planned improvements include:
- Integration with actual AI models for more sophisticated responses
- Real-time plant disease detection using computer vision
- Personalized notifications based on farming calendar
- Integration with weather APIs for hyperlocal forecasts
- Multilingual support for wider accessibility