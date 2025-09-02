# ULIMI AI Advisor API

This is the backend API for the ULIMI AI Advisor feature, built with FastAPI.

## Features

- AI-powered farming advice using OpenAI GPT models
- Personalized recommendations for farmers
- Decision support system
- RESTful API with JSON responses
- CORS support for frontend integration

## API Endpoints

### POST /api/advisor
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

### GET /api/recommendations
Get personalized AI recommendations for a user.

**Query Parameters:**
- `user_id` (required): User ID

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

### GET /api/capabilities
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

### GET /api/decision-support
Get AI-assisted decision recommendations.

**Query Parameters:**
- `user_id` (required): User ID
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

## Development

### Prerequisites

1. Python 3.8 or higher
2. OpenAI API key (sign up at [platform.openai.com](https://platform.openai.com))

### Setup

1. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```
   
4. Add your OpenAI API key to the `.env` file:
   ```
   OPENAI_API_KEY=your_actual_api_key_here
   ```

### Running the Server

1. Run the development server:
   ```bash
   python run_local.py
   ```
   
   Or directly with uvicorn:
   ```bash
   uvicorn main:app --reload
   ```

The API will be available at `http://localhost:8000`.

## API Documentation

When the server is running, you can access the interactive API documentation at:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Deployment

This API is configured for deployment on Vercel using the Serverless Functions feature. The [vercel.json](../vercel.json) file contains the necessary configuration.

For deployment, you'll need to set the `OPENAI_API_KEY` environment variable in your Vercel project settings.