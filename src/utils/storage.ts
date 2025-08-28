// Local Storage utilities for offline functionality
class LocalStorageManager {
  private prefix = 'ulimi_';

  // Generic storage methods
  set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(this.prefix + key, JSON.stringify(value));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }

  get<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(this.prefix + key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return null;
    }
  }

  remove(key: string): void {
    localStorage.removeItem(this.prefix + key);
  }

  clear(): void {
    Object.keys(localStorage)
      .filter(key => key.startsWith(this.prefix))
      .forEach(key => localStorage.removeItem(key));
  }

  // Specific data methods
  saveUser(user: any): void {
    this.set('user', user);
  }

  getUser(): any {
    return this.get('user');
  }

  saveFarms(farms: any[]): void {
    this.set('farms', farms);
  }

  getFarms(): any[] {
    return this.get('farms') || [];
  }

  saveTasks(tasks: any[]): void {
    this.set('tasks', tasks);
  }

  getTasks(): any[] {
    return this.get('tasks') || [];
  }

  saveMarketplaceItems(items: any[]): void {
    this.set('marketplace', items);
  }

  getMarketplaceItems(): any[] {
    return this.get('marketplace') || [];
  }

  saveOrders(orders: any[]): void {
    this.set('orders', orders);
  }

  getOrders(): any[] {
    return this.get('orders') || [];
  }

  saveSuppliers(suppliers: any[]): void {
    this.set('suppliers', suppliers);
  }

  getSuppliers(): any[] {
    return this.get('suppliers') || [];
  }

  saveWeatherData(weather: any): void {
    this.set('weather', weather);
  }

  getWeatherData(): any {
    return this.get('weather');
  }

  saveAIRecommendations(recommendations: any[]): void {
    this.set('ai_recommendations', recommendations);
  }

  getAIRecommendations(): any[] {
    return this.get('ai_recommendations') || [];
  }

  // Additional storage methods for complete system
  saveUserPreferences(preferences: any): void {
    this.set('user_preferences', preferences);
  }

  getUserPreferences(): any {
    return this.get('user_preferences') || {};
  }

  // Initialize sample data if not exists
  initializeSampleData(): void {
    // Sample farms
    const existingFarms = this.get<any[]>('farms');
    if (!existingFarms || existingFarms.length === 0) {
      const sampleFarms = [
        {
          id: 'farm1',
          farmerId: 'farmer1',
          name: 'Green Valley Farm',
          size: 5.5,
          location: {
            province: 'Lusaka',
            district: 'Lusaka',
            coordinates: [-15.3875, 28.3228]
          },
          soilType: 'Clay loam',
          crops: [
            {
              id: 'crop1',
              farmId: 'farm1',
              name: 'Maize',
              variety: 'SC627',
              plantingDate: '2024-12-01',
              expectedHarvestDate: '2025-04-15',
              area: 3.0,
              status: 'growing',
              tasks: [],
              inventory: []
            }
          ],
          createdAt: new Date().toISOString()
        }
      ];
      this.saveFarms(sampleFarms);
    }

    // Sample marketplace items
    const existingItems = this.get<any[]>('marketplace');
    if (!existingItems || existingItems.length === 0) {
      const sampleItems = [
        {
          id: 'item1',
          sellerId: 'farmer1',
          sellerName: 'Mirriam',
          name: 'Fresh Maize',
          category: 'produce',
          type: 'grain',
          description: 'Freshly harvested white maize, perfect for consumption or processing',
          price: 8.50,
          currency: 'ZMW',
          quantity: 500,
          unit: 'kg',
          location: {
            province: 'Lusaka',
            district: 'Lusaka'
          },
          images: [],
          status: 'available',
          createdAt: new Date().toISOString()
        },
        {
          id: 'item2',
          sellerId: 'supplier1',
          sellerName: 'AgriSupply Co.',
          name: 'NPK Fertilizer',
          category: 'inputs',
          type: 'fertilizer',
          description: 'High-quality NPK fertilizer (10-10-10) for optimal crop growth',
          price: 350.00,
          currency: 'ZMW',
          quantity: 50,
          unit: 'bag',
          location: {
            province: 'Copperbelt',
            district: 'Kitwe'
          },
          images: [],
          status: 'available',
          createdAt: new Date().toISOString()
        },
        {
          id: 'item3',
          sellerId: 'farmer2',
          sellerName: 'Natasha',
          name: 'Sweet Potatoes',
          category: 'produce',
          type: 'vegetable',
          description: 'Organic sweet potatoes, rich in vitamins and minerals',
          price: 12.00,
          currency: 'ZMW',
          quantity: 200,
          unit: 'kg',
          location: {
            province: 'Central',
            district: 'Kabwe'
          },
          images: [],
          status: 'available',
          createdAt: new Date().toISOString()
        }
      ];
      this.saveMarketplaceItems(sampleItems);
    }

    // Sample tasks
    const existingTasks = this.get<any[]>('tasks');
    if (!existingTasks || existingTasks.length === 0) {
      const sampleTasks = [
        {
          id: 'task1',
          cropId: 'crop1',
          title: 'Apply fertilizer to maize field',
          description: 'Apply NPK fertilizer to the maize crop for optimal growth',
          type: 'fertilizing',
          dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
          completed: false,
          priority: 'high',
          createdAt: new Date().toISOString()
        },
        {
          id: 'task2',
          cropId: 'crop1',
          title: 'Weed control',
          description: 'Remove weeds from the maize field to prevent competition',
          type: 'other',
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          completed: false,
          priority: 'medium',
          createdAt: new Date().toISOString()
        }
      ];
      this.saveTasks(sampleTasks);
    }

    // Sample weather data
    if (!this.get('weather')) {
      const sampleWeather = {
        date: new Date().toISOString(),
        temperature: {
          min: 18,
          max: 28
        },
        humidity: 65,
        rainfall: 2.5,
        windSpeed: 12,
        conditions: 'partly cloudy'
      };
      this.saveWeatherData(sampleWeather);
    }
  }

  saveNotifications(notifications: any[]): void {
    this.set('notifications', notifications);
  }

  getNotifications(): any[] {
    return this.get('notifications') || [];
  }

  saveAnalytics(analytics: any): void {
    this.set('analytics', analytics);
  }

  getAnalytics(): any {
    return this.get('analytics') || {};
  }

  saveOfflineActions(actions: any[]): void {
    this.set('offline_actions', actions);
  }

  getOfflineActions(): any[] {
    return this.get('offline_actions') || [];
  }

  clearOfflineActions(): void {
    this.remove('offline_actions');
  }

  // Sync queue for offline operations
  addToSyncQueue(operation: any): void {
    const queue = this.get<any[]>('sync_queue') || [];
    queue.push({
      ...operation,
      timestamp: new Date().toISOString(),
      id: Date.now().toString()
    });
    this.set('sync_queue', queue);
  }

  getSyncQueue(): any[] {
    return this.get('sync_queue') || [];
  }

  clearSyncQueue(): void {
    this.remove('sync_queue');
  }
}

export const storage = new LocalStorageManager();