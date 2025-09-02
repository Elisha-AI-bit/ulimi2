from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import json
import os
from openai import OpenAI
from dotenv import load_dotenv
from datetime import datetime, date
import random

# Load environment variables
load_dotenv()

app = FastAPI(title="ULIMI AI Advisor API", version="1.0.0")

# Initialize OpenAI client
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class ChatRequest(BaseModel):
    message: str
    userId: str
    language: str = "en"

class ChatResponse(BaseModel):
    response: str

class Recommendation(BaseModel):
    id: str
    type: str
    title: str
    description: str
    confidence: int
    createdAt: str

class RecommendationsResponse(BaseModel):
    recommendations: List[Recommendation]

class AICapability(BaseModel):
    name: str
    description: str

class CapabilitiesResponse(BaseModel):
    capabilities: List[AICapability]

# New models for smart agriculture system
class FarmerInput(BaseModel):
    farmer_id: str
    location: str
    selected_crop: str
    planting_date: date

class WeatherData(BaseModel):
    location: str
    date: date
    temperature: float
    rainfall: float
    humidity: float
    sunlight_hours: float

class SoilData(BaseModel):
    location: str
    soil_type: str
    ph: float
    nitrogen: float
    phosphorus: float
    potassium: float
    moisture: float

class CropData(BaseModel):
    crop_name: str
    optimal_soil: str
    optimal_rainfall: float
    optimal_temp_min: float
    optimal_temp_max: float
    market_price: float

class AIRecommendation(BaseModel):
    farmer_id: str
    crop_name: str
    recommendation_text: str
    expected_yield: float
    profit_estimate: float
    risk_warnings: List[str]

class SimulationResponse(BaseModel):
    farmer_id: str
    location: str
    crop_name: str
    current_weather: WeatherData
    soil_data: SoilData
    recommendations: AIRecommendation

# Helper function to load sample data
def load_sample_data(filename: str):
    """Load sample data from JSON files"""
    try:
        file_path = os.path.join(os.path.dirname(__file__), "data", filename)
        with open(file_path, "r") as f:
            return json.load(f)
    except FileNotFoundError:
        return []

# System message for the AI assistant
SYSTEM_MESSAGE = """
You are an expert agricultural advisor specializing in farming practices in Zambia and Southern Africa. 
You provide advice on:
- Crop selection and planting schedules
- Pest and disease identification and management
- Soil fertility and fertilization
- Weather-related farming decisions
- Market trends and pricing
- Livestock management
- Irrigation and water management

Always provide practical, actionable advice tailored to smallholder farmers. 
Use simple language and avoid complex technical terms when possible.
When appropriate, reference specific Zambian crops like maize, cassava, soybeans, and groundnuts.
"""

@app.get("/")
async def root():
    return {"message": "ULIMI AI Advisor API", "version": "1.0.0"}

@app.post("/api/advisor", response_model=ChatResponse)
async def get_ai_advice(request: ChatRequest):
    """
    Get AI-generated farming advice based on user input
    """
    try:
        # Call OpenAI API
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": SYSTEM_MESSAGE},
                {"role": "user", "content": request.message}
            ],
            temperature=0.7,
            max_tokens=500
        )
        
        ai_response = response.choices[0].message.content
        return ChatResponse(response=ai_response)
    
    except Exception as e:
        # Fallback to mock responses if OpenAI fails
        print(f"OpenAI API error: {e}")
        message = request.message.lower()
        
        if "maize" in message or "corn" in message:
            response = """For maize cultivation in Zambia, I recommend:
            
• Plant during the rainy season (November-December)
• Use varieties like SC627 or PAN63 for better yields
• Apply Compound D fertilizer at planting (200kg/ha)
• Top-dress with Urea after 4-6 weeks
• Watch for fall armyworm and treat with appropriate pesticides
• Harvest when moisture content is below 13.5%"""
        
        elif "weather" in message or "rain" in message:
            response = """Based on current weather patterns:
            
• Light rains expected in the next 3 days
• Good conditions for land preparation
• Consider planting drought-tolerant varieties
• Ensure proper drainage in low-lying areas
• Monitor for fungal diseases due to humidity"""
        
        elif "pest" in message or "disease" in message:
            response = """Common pests and diseases in Zambian farming:
            
• Fall Armyworm: Use Bulldock or similar insecticides
• Aphids: Apply Karate insecticide
• Leaf blight: Use Ridomil fungicide
• Stalk borer: Regular scouting and early treatment
• Always follow label instructions and safety precautions"""
        
        elif "fertilizer" in message or "nutrition" in message:
            response = """Fertilizer recommendations for Zambian soils:
            
• Basal: Compound D (10:20:10) at 200-300kg/ha
• Top dressing: Urea (46:0:0) at 150-200kg/ha
• For legumes: Use DAP (18:46:0) for phosphorus
• Soil test recommended for precise application
• Apply during proper moisture conditions"""
        
        elif "price" in message or "market" in message:
            response = """Current market insights:
            
• Maize prices: ZMW 3.50-4.00/kg
• Soybean prices: ZMW 8.00-9.00/kg
• High demand for quality produce
• Consider value addition for better prices
• Direct marketing to processors can increase profits"""
        
        else:
            response = """Thank you for your question. Based on Zambian farming conditions, I recommend consulting with local agricultural extension officers for specific advice. You can also share more details about your specific situation, crop type, or location for more targeted recommendations."""
        
        return ChatResponse(response=response)

@app.get("/api/recommendations", response_model=RecommendationsResponse)
async def get_recommendations(user_id: str):
    """
    Get personalized AI recommendations for a user
    """
    # In a real implementation, this would fetch from a database
    # For now, we'll return sample recommendations
    sample_recommendations = load_sample_data("recommendations.json")
    
    # Convert to Recommendation objects
    recommendations = [
        Recommendation(
            id=rec["id"],
            type=rec["type"],
            title=rec["title"],
            description=rec["description"],
            confidence=rec["confidence"],
            createdAt=rec["createdAt"]
        )
        for rec in sample_recommendations
    ]
    
    return RecommendationsResponse(recommendations=recommendations)

@app.get("/api/capabilities", response_model=CapabilitiesResponse)
async def get_capabilities():
    """
    Get available AI capabilities
    """
    sample_capabilities = load_sample_data("capabilities.json")
    
    # Convert to AICapability objects
    capabilities = [
        AICapability(
            name=cap["name"],
            description=cap["description"]
        )
        for cap in sample_capabilities
    ]
    
    return CapabilitiesResponse(capabilities=capabilities)

# Decision support endpoint
@app.get("/api/decision-support")
async def get_decision_support(user_id: str, context: str = ""):
    """
    Get AI-assisted decision recommendations
    """
    try:
        # Call OpenAI API for decision support
        prompt = f"""
        Provide farming decision support for a user with the following context:
        User ID: {user_id}
        Context: {context}
        
        Give 2-3 specific recommendations with confidence levels and alternatives.
        Focus on practical, actionable advice for smallholder farmers in Zambia.
        """
        
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": SYSTEM_MESSAGE},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=800
        )
        
        ai_response = response.choices[0].message.content
        
        # Parse the response into structured format
        return {
            "userId": user_id,
            "context": context,
            "decisions": [
                {
                    "id": "1",
                    "title": "AI-Generated Decision Support",
                    "description": "Recommendations generated by AI based on your context",
                    "confidence": 85,
                    "factors": ["ai_analysis"],
                    "recommendation": ai_response,
                    "alternatives": [
                        "Consult with local agricultural extension officers",
                        "Review historical farming data"
                    ]
                }
            ]
        }
    
    except Exception as e:
        print(f"OpenAI API error: {e}")
        # Fallback response
        return {
            "userId": user_id,
            "context": context,
            "decisions": [
                {
                    "id": "1",
                    "title": "Irrigation Schedule Optimization",
                    "description": "Based on current soil moisture and weather forecast, irrigate tomorrow morning for 2 hours",
                    "confidence": 87,
                    "factors": ["soil_moisture", "weather_forecast", "crop_stage"],
                    "recommendation": "Irrigate tomorrow (6:00 AM) for 2 hours in Field A",
                    "alternatives": [
                        "Irrigate today for 1.5 hours",
                        "Delay irrigation by 2 days"
                    ]
                },
                {
                    "id": "2",
                    "title": "Harvest Timing",
                    "description": "Maize in Field B is ready for harvest based on moisture content",
                    "confidence": 94,
                    "factors": ["crop_maturity", "weather_forecast", "market_prices"],
                    "recommendation": "Harvest Field B within the next 3 days for optimal yield",
                    "alternatives": [
                        "Wait 5 more days for additional drying",
                        "Harvest immediately to avoid weather risks"
                    ]
                }
            ]
        }

# New endpoints for smart agriculture system
@app.post("/api/farmer_input")
async def save_farmer_input(input_data: FarmerInput):
    """
    Save new farmer input data
    """
    # In a real implementation, this would save to a database
    # For now, we'll just return a success message
    return {"message": "Farmer input saved successfully", "data": input_data}

@app.get("/api/simulate/{farmer_id}", response_model=SimulationResponse)
async def get_ai_recommendations(farmer_id: str):
    """
    Generate AI recommendations based on farmer data
    """
    # In a real implementation, this would fetch data from databases
    # For now, we'll generate mock data
    
    # Mock farmer input data
    location = "Lusaka, Zambia"
    crop_name = "Maize"
    planting_date = date.today()
    
    # Mock weather data
    current_weather = WeatherData(
        location=location,
        date=date.today(),
        temperature=28.5,
        rainfall=15.2,
        humidity=65.0,
        sunlight_hours=8.5
    )
    
    # Mock soil data
    soil_data = SoilData(
        location=location,
        soil_type="Loam",
        ph=6.5,
        nitrogen=120.0,
        phosphorus=45.0,
        potassium=90.0,
        moisture=35.0
    )
    
    # Mock crop data
    crop_data = CropData(
        crop_name=crop_name,
        optimal_soil="Loam",
        optimal_rainfall=20.0,
        optimal_temp_min=20.0,
        optimal_temp_max=30.0,
        market_price=3.50
    )
    
    # Generate AI recommendations
    recommendations = generate_ai_recommendations(current_weather, soil_data, crop_data, planting_date)
    
    return SimulationResponse(
        farmer_id=farmer_id,
        location=location,
        crop_name=crop_name,
        current_weather=current_weather,
        soil_data=soil_data,
        recommendations=recommendations
    )

def generate_ai_recommendations(weather: WeatherData, soil: SoilData, crop: CropData, planting_date: date) -> AIRecommendation:
    """
    Generate AI-based recommendations for farming
    """
    # Compare current conditions with optimal conditions
    temp_optimal = crop.optimal_temp_min <= weather.temperature <= crop.optimal_temp_max
    rainfall_optimal = weather.rainfall >= crop.optimal_rainfall * 0.8
    ph_optimal = 6.0 <= soil.ph <= 7.0
    
    # Generate expected yield based on conditions
    yield_factor = 1.0
    if not temp_optimal:
        yield_factor *= 0.8
    if not rainfall_optimal:
        yield_factor *= 0.7
    if not ph_optimal:
        yield_factor *= 0.9
    
    expected_yield = 5.0 * yield_factor  # Base yield of 5 tons/ha
    
    # Calculate profit estimate
    profit_estimate = expected_yield * crop.market_price * 0.9  # 10% for costs
    
    # Generate risk warnings
    risk_warnings = []
    if weather.temperature > crop.optimal_temp_max:
        risk_warnings.append("High temperature may stress the crop")
    elif weather.temperature < crop.optimal_temp_min:
        risk_warnings.append("Low temperature may slow growth")
    
    if weather.rainfall < crop.optimal_rainfall * 0.5:
        risk_warnings.append("Insufficient rainfall - consider irrigation")
    elif weather.rainfall > crop.optimal_rainfall * 1.5:
        risk_warnings.append("Excessive rainfall may cause waterlogging")
    
    if soil.ph < 5.5 or soil.ph > 7.5:
        risk_warnings.append("Soil pH not optimal - consider lime or sulfur application")
    
    # Generate recommendation text
    recommendation_text = f"Based on current conditions in {weather.location}:\n\n"
    recommendation_text += f"Temperature: {weather.temperature}°C "
    recommendation_text += "(Optimal)" if temp_optimal else "(Suboptimal)\n"
    recommendation_text += f"Rainfall: {weather.rainfall}mm "
    recommendation_text += "(Adequate)" if rainfall_optimal else "(Inadequate)\n"
    recommendation_text += f"Soil pH: {soil.ph} "
    recommendation_text += "(Optimal)" if ph_optimal else "(Suboptimal)\n\n"
    
    recommendation_text += f"Fertilizer schedule: Apply basal fertilizer (Compound D) at planting. Top-dress with Urea 4-6 weeks after planting.\n"
    recommendation_text += f"Irrigation: Maintain soil moisture at 30-40% for optimal growth.\n"
    recommendation_text += f"Planting time: Based on current conditions, planting now is appropriate.\n"
    recommendation_text += f"Expected yield: {expected_yield:.2f} tons/ha\n"
    recommendation_text += f"Profit estimate: ZMW {profit_estimate:.2f}/ha"
    
    return AIRecommendation(
        farmer_id="farmer_123",  # This would be dynamic in real implementation
        crop_name=crop.crop_name,
        recommendation_text=recommendation_text,
        expected_yield=expected_yield,
        profit_estimate=profit_estimate,
        risk_warnings=risk_warnings
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)