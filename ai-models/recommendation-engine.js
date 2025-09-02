// This is a placeholder for the recommendation engine
// In a real implementation, this would use machine learning algorithms

class RecommendationEngine {
  constructor() {
    this.recommendationTypes = [
      'Irrigation',
      'Fertilizer',
      'Pest Control',
      'Harvesting',
      'Planting'
    ];
  }

  // Generate mock recommendations based on sensor data
  generateRecommendations(sensorData, farmInfo) {
    // In a real implementation, this would analyze the actual sensor data
    // For now, we'll generate random recommendations
    
    const recommendations = [];
    const numRecommendations = Math.floor(Math.random() * 3) + 1; // 1-3 recommendations
    
    for (let i = 0; i < numRecommendations; i++) {
      const type = this.recommendationTypes[Math.floor(Math.random() * this.recommendationTypes.length)];
      const priority = ['high', 'medium', 'low'][Math.floor(Math.random() * 3)];
      const message = this.generateRecommendationMessage(type, farmInfo);
      
      recommendations.push({
        id: Date.now() + i, // Simple unique ID
        type,
        message,
        priority
      });
    }
    
    return recommendations;
  }
  
  generateRecommendationMessage(type, farmInfo) {
    const messages = {
      'Irrigation': [
        `Irrigate ${farmInfo.name} in 2 hours`,
        `Reduce irrigation in ${farmInfo.name} due to high soil moisture`,
        `Irrigate ${farmInfo.name} section A immediately`
      ],
      'Fertilizer': [
        `Apply nitrogen fertilizer to ${farmInfo.name}`,
        `Add phosphorus to ${farmInfo.name} section B`,
        `Fertilize ${farmInfo.name} with organic compost`
      ],
      'Pest Control': [
        `Check for aphids in ${farmInfo.name} section 3`,
        `Apply pest control treatment to ${farmInfo.name}`,
        `Monitor ${farmInfo.name} for signs of disease`
      ],
      'Harvesting': [
        `Harvest tomatoes in ${farmInfo.name} in 3 days`,
        `Begin harvesting corn in ${farmInfo.name}`,
        `Harvest time for ${farmInfo.cropType} in ${farmInfo.name}`
      ],
      'Planting': [
        `Plant new seeds in ${farmInfo.name} section 2`,
        `Time to plant ${farmInfo.nextCrop} in ${farmInfo.name}`,
        `Prepare ${farmInfo.name} for next planting season`
      ]
    };
    
    const typeMessages = messages[type] || [`Perform ${type} activities in ${farmInfo.name}`];
    return typeMessages[Math.floor(Math.random() * typeMessages.length)];
  }
}

// Export a singleton instance
const recommendationEngine = new RecommendationEngine();
export default recommendationEngine;