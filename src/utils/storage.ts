// Storage utilities - now using Supabase instead of localStorage
import { SupabaseDataService } from '../services/supabaseDataService'
import { 
  User, 
  Farm, 
  Task, 
  MarketplaceItem, 
  InventoryItem, 
  Order,
  WeatherData,
  AIRecommendation
} from '../types'

// Map WeatherData from storage format to display format
const mapWeatherData = (weather: any): WeatherData | null => {
  if (!weather) return null;
  
  return {
    date: weather.date,
    temperature: {
      min: weather.temperature_min,
      max: weather.temperature_max
    },
    humidity: weather.humidity,
    rainfall: weather.rainfall,
    windSpeed: weather.wind_speed,
    conditions: weather.conditions
  };
};

class StorageManager {
  // Simple key-value storage methods using localStorage
  set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting ${key} in localStorage:`, error);
    }
  }

  get<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error getting ${key} from localStorage:`, error);
      return null;
    }
  }

  remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing ${key} from localStorage:`, error);
    }
  }

  // User methods
  async saveUser(user: User): Promise<void> {
    // In Supabase implementation, user data is managed by Supabase Auth
    // This method is kept for compatibility but doesn't do anything
    console.log('User data is managed by Supabase Auth, not stored locally')
  }

  async getUser(): Promise<User | null> {
    // This would be handled by Supabase Auth
    console.log('User data is managed by Supabase Auth')
    return null
  }

  // Farm methods
  async saveFarms(farms: Farm[]): Promise<void> {
    // Farms are now stored in Supabase database
    console.log('Farms are stored in Supabase database')
  }

  async getFarms(userId: string): Promise<Farm[]> {
    // Check if userId is valid
    if (!userId) {
      console.warn('No user ID provided for fetching farms')
      return []
    }
    return await SupabaseDataService.getFarms(userId)
  }

  async saveTasks(tasks: Task[]): Promise<void> {
    // Tasks are now stored in Supabase database
    console.log('Tasks are stored in Supabase database')
  }

  async getTasks(farmId: string): Promise<Task[]> {
    // Check if farmId is valid
    if (!farmId) {
      console.warn('No farm ID provided for fetching tasks')
      return []
    }
    return await SupabaseDataService.getTasks(farmId)
  }

  async saveMarketplaceItems(items: MarketplaceItem[]): Promise<void> {
    // Marketplace items are now stored in Supabase database
    console.log('Marketplace items are stored in Supabase database')
  }

  async getMarketplaceItems(): Promise<MarketplaceItem[]> {
    return await SupabaseDataService.getMarketplaceItems()
  }

  async saveOrders(orders: Order[]): Promise<void> {
    // Orders are now stored in Supabase database
    console.log('Orders are stored in Supabase database')
  }

  async getOrders(userId: string): Promise<Order[]> {
    return await SupabaseDataService.getOrders(userId)
  }

  async saveSuppliers(suppliers: any[]): Promise<void> {
    // Suppliers would be stored in Supabase database
    console.log('Suppliers are stored in Supabase database')
  }

  async getSuppliers(): Promise<any[]> {
    // Implementation would depend on Supabase table structure
    return []
  }

  async saveWeatherData(weather: any): Promise<void> {
    // Weather data is now stored in Supabase database
    console.log('Weather data is stored in Supabase database')
  }

  async getWeatherData(location: { province: string; district: string }): Promise<WeatherData | null> {
    // Check if location data is valid
    if (!location || !location.province || !location.district) {
      console.warn('Invalid location data provided for fetching weather')
      return null
    }
    const weather = await SupabaseDataService.getWeatherData(location);
    return mapWeatherData(weather);
  }

  async saveAIRecommendations(recommendations: AIRecommendation[]): Promise<void> {
    // AI recommendations are now stored in Supabase database
    console.log('AI recommendations are stored in Supabase database')
  }

  async getAIRecommendations(userId: string): Promise<AIRecommendation[]> {
    // Check if userId is valid
    if (!userId) {
      console.warn('No user ID provided for fetching AI recommendations')
      return []
    }
    return await SupabaseDataService.getAIRecommendations(userId)
  }

  // Additional storage methods for complete system
  async saveUserPreferences(preferences: any): Promise<void> {
    // User preferences could be stored in Supabase
    console.log('User preferences would be stored in Supabase')
  }

  async getUserPreferences(): Promise<any> {
    // Implementation would depend on Supabase table structure
    return {}
  }

  // Initialize sample data if not exists
  async initializeSampleData(): Promise<void> {
    // Sample data initialization would be handled differently with Supabase
    console.log('Sample data initialization would be handled with Supabase')
  }

  async saveNotifications(notifications: any[]): Promise<void> {
    // Notifications would be stored in Supabase database
    console.log('Notifications are stored in Supabase database')
  }

  async getNotifications(): Promise<any[]> {
    // Implementation would depend on Supabase table structure
    return []
  }

  async saveAnalytics(analytics: any): Promise<void> {
    // Analytics would be stored in Supabase database
    console.log('Analytics are stored in Supabase database')
  }

  async getAnalytics(): Promise<any> {
    // Implementation would depend on Supabase table structure
    return {}
  }

  async saveOfflineActions(actions: any[]): Promise<void> {
    // Offline actions would be stored in Supabase database
    console.log('Offline actions are stored in Supabase database')
  }

  async getOfflineActions(): Promise<any[]> {
    // Implementation would depend on Supabase table structure
    return []
  }

  async clearOfflineActions(): Promise<void> {
    // Implementation would depend on Supabase table structure
    console.log('Clear offline actions in Supabase database')
  }

  // Sync queue for offline operations
  async addToSyncQueue(operation: any): Promise<void> {
    // Sync queue would be implemented with Supabase
    console.log('Sync queue operations are handled with Supabase')
  }

  async getSyncQueue(): Promise<any[]> {
    // Implementation would depend on Supabase table structure
    return []
  }

  async clearSyncQueue(): Promise<void> {
    // Implementation would depend on Supabase table structure
    console.log('Clear sync queue in Supabase database')
  }
}

// Export the single instance of StorageManager
export const storage = new StorageManager()