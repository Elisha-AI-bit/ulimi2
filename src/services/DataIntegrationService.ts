// Data Integration Service for external data sources
import { storage } from '../utils/storage';

export interface WeatherData {
  timestamp: string;
  location: {
    latitude: number;
    longitude: number;
    name: string;
  };
  current: {
    temperature: number;
    humidity: number;
    windSpeed: number;
    windDirection: number;
    precipitation: number;
    pressure: number;
    visibility: number;
    uvIndex: number;
    condition: string;
    icon: string;
  };
  forecast: Array<{
    date: string;
    maxTemp: number;
    minTemp: number;
    humidity: number;
    precipitation: number;
    precipitationChance: number;
    condition: string;
    icon: string;
    windSpeed: number;
  }>;
}

export interface SatelliteData {
  timestamp: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  ndvi: number; // Normalized Difference Vegetation Index
  evi: number;  // Enhanced Vegetation Index
  soilMoisture: number;
  landSurfaceTemperature: number;
  precipitationRate: number;
  cloudCover: number;
  resolution: number; // meters per pixel
  source: 'landsat' | 'sentinel' | 'modis';
  imageUrl?: string;
}

export interface IoTSensorData {
  sensorId: string;
  farmId: string;
  location: {
    latitude: number;
    longitude: number;
    fieldName?: string;
  };
  timestamp: string;
  sensorType: 'soil' | 'weather' | 'irrigation' | 'pest_trap' | 'camera';
  readings: {
    soilMoisture?: number;
    soilTemperature?: number;
    soilPH?: number;
    soilEC?: number; // Electrical Conductivity
    airTemperature?: number;
    airHumidity?: number;
    lightIntensity?: number;
    co2Level?: number;
    pestCount?: number;
    waterFlow?: number;
    waterPressure?: number;
    batteryLevel?: number;
  };
  status: 'active' | 'offline' | 'maintenance';
  alerts?: Array<{
    type: string;
    message: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
  }>;
}

export interface RegulatoryData {
  id: string;
  type: 'pesticide_regulation' | 'seed_certification' | 'organic_standard' | 'export_requirement' | 'subsidy_program';
  title: string;
  description: string;
  authority: string;
  effectiveDate: string;
  expiryDate?: string;
  region: string;
  applicableCrops?: string[];
  requirements: string[];
  penalties?: string[];
  benefits?: string[];
  contactInfo: {
    office: string;
    phone: string;
    email: string;
    website?: string;
  };
  documents: Array<{
    name: string;
    type: 'pdf' | 'doc' | 'link';
    url: string;
  }>;
}

export interface MarketPriceData {
  commodity: string;
  variety?: string;
  market: string;
  location: string;
  date: string;
  prices: {
    wholesale: number;
    retail: number;
    farmGate: number;
    currency: string;
  };
  quality: 'grade_a' | 'grade_b' | 'grade_c';
  unit: string;
  volume: number;
  trend: 'rising' | 'falling' | 'stable';
}

class DataIntegrationService {
  private baseUrl = 'https://api.ulimi.zm/v2';
  private apiKey = import.meta.env.VITE_ULIMI_API_KEY || 'demo_key';

  // Weather Data Integration
  async getWeatherData(latitude: number, longitude: number): Promise<WeatherData> {
    try {
      // Simulate API call - in production, this would call actual weather services
      const mockWeatherData: WeatherData = {
        timestamp: new Date().toISOString(),
        location: {
          latitude,
          longitude,
          name: 'Lusaka, Zambia'
        },
        current: {
          temperature: 28 + Math.random() * 10,
          humidity: 60 + Math.random() * 30,
          windSpeed: 5 + Math.random() * 15,
          windDirection: Math.random() * 360,
          precipitation: Math.random() * 5,
          pressure: 1013 + Math.random() * 20,
          visibility: 8 + Math.random() * 2,
          uvIndex: Math.floor(Math.random() * 11),
          condition: ['sunny', 'partly_cloudy', 'cloudy', 'rainy'][Math.floor(Math.random() * 4)],
          icon: 'wi-day-sunny'
        },
        forecast: Array.from({ length: 7 }, (_, i) => ({
          date: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          maxTemp: 25 + Math.random() * 15,
          minTemp: 15 + Math.random() * 10,
          humidity: 50 + Math.random() * 40,
          precipitation: Math.random() * 10,
          precipitationChance: Math.random() * 100,
          condition: ['sunny', 'partly_cloudy', 'cloudy', 'rainy'][Math.floor(Math.random() * 4)],
          icon: 'wi-day-sunny',
          windSpeed: 3 + Math.random() * 12
        }))
      };

      // Cache weather data
      storage.set('weather_data', mockWeatherData);
      return mockWeatherData;
    } catch (error) {
      console.error('Weather data fetch error:', error);
      // Return cached data if available
      return storage.get('weather_data') || this.getDefaultWeatherData();
    }
  }

  // Satellite Data Integration
  async getSatelliteData(farmId: string, startDate: string, endDate: string): Promise<SatelliteData[]> {
    try {
      // Simulate satellite data API call
      const mockSatelliteData: SatelliteData[] = Array.from({ length: 10 }, (_, i) => ({
        timestamp: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
        coordinates: {
          latitude: -15.3875 + Math.random() * 0.01,
          longitude: 28.3228 + Math.random() * 0.01
        },
        ndvi: 0.3 + Math.random() * 0.6,
        evi: 0.2 + Math.random() * 0.5,
        soilMoisture: 20 + Math.random() * 60,
        landSurfaceTemperature: 25 + Math.random() * 15,
        precipitationRate: Math.random() * 5,
        cloudCover: Math.random() * 100,
        resolution: 10,
        source: ['landsat', 'sentinel', 'modis'][Math.floor(Math.random() * 3)] as any
      }));

      storage.set(`satellite_data_${farmId}`, mockSatelliteData);
      return mockSatelliteData;
    } catch (error) {
      console.error('Satellite data fetch error:', error);
      return storage.get(`satellite_data_${farmId}`) || [];
    }
  }

  // IoT Sensor Data Integration
  async getIoTSensorData(farmId: string): Promise<IoTSensorData[]> {
    try {
      // Simulate IoT sensor data
      const mockIoTData: IoTSensorData[] = [
        {
          sensorId: 'soil_001',
          farmId,
          location: {
            latitude: -15.3875,
            longitude: 28.3228,
            fieldName: 'North Field'
          },
          timestamp: new Date().toISOString(),
          sensorType: 'soil',
          readings: {
            soilMoisture: 35 + Math.random() * 30,
            soilTemperature: 20 + Math.random() * 10,
            soilPH: 6.0 + Math.random() * 2,
            soilEC: 1.2 + Math.random() * 1.8,
            batteryLevel: 70 + Math.random() * 30
          },
          status: 'active'
        },
        {
          sensorId: 'weather_001',
          farmId,
          location: {
            latitude: -15.3876,
            longitude: 28.3229,
            fieldName: 'Central Station'
          },
          timestamp: new Date().toISOString(),
          sensorType: 'weather',
          readings: {
            airTemperature: 25 + Math.random() * 10,
            airHumidity: 60 + Math.random() * 30,
            lightIntensity: 800 + Math.random() * 400,
            co2Level: 400 + Math.random() * 200,
            batteryLevel: 80 + Math.random() * 20
          },
          status: 'active'
        },
        {
          sensorId: 'pest_trap_001',
          farmId,
          location: {
            latitude: -15.3877,
            longitude: 28.3230,
            fieldName: 'South Field'
          },
          timestamp: new Date().toISOString(),
          sensorType: 'pest_trap',
          readings: {
            pestCount: Math.floor(Math.random() * 20),
            batteryLevel: 90 + Math.random() * 10
          },
          status: 'active',
          alerts: Math.random() > 0.7 ? [{
            type: 'high_pest_count',
            message: 'Unusual pest activity detected',
            severity: 'high' as const
          }] : undefined
        }
      ];

      storage.set(`iot_data_${farmId}`, mockIoTData);
      return mockIoTData;
    } catch (error) {
      console.error('IoT data fetch error:', error);
      return storage.get(`iot_data_${farmId}`) || [];
    }
  }

  // Regulatory Data Integration
  async getRegulatoryData(region: string = 'zambia'): Promise<RegulatoryData[]> {
    try {
      const mockRegulatoryData: RegulatoryData[] = [
        {
          id: 'reg_001',
          type: 'pesticide_regulation',
          title: 'Pesticide Use Guidelines for Maize Production',
          description: 'Updated guidelines for safe and effective pesticide use in maize farming',
          authority: 'Zambia Environmental Management Agency (ZEMA)',
          effectiveDate: '2024-01-01',
          expiryDate: '2026-12-31',
          region: 'zambia',
          applicableCrops: ['maize', 'sorghum'],
          requirements: [
            'Valid pesticide applicator license required',
            'Pre-harvest interval must be observed',
            'Buffer zones near water sources mandatory',
            'Application records must be maintained'
          ],
          penalties: [
            'Fine of ZMW 5,000 - 50,000 for violations',
            'License suspension for repeat offenses'
          ],
          contactInfo: {
            office: 'ZEMA Regional Office - Lusaka',
            phone: '+260-211-254-088',
            email: 'info@zema.org.zm',
            website: 'https://www.zema.org.zm'
          },
          documents: [
            {
              name: 'Pesticide Use Guidelines 2024',
              type: 'pdf',
              url: '/documents/pesticide-guidelines-2024.pdf'
            }
          ]
        },
        {
          id: 'reg_002',
          type: 'seed_certification',
          title: 'Certified Seed Standards and Requirements',
          description: 'Standards for seed quality, labeling, and certification processes',
          authority: 'Seed Control and Certification Institute (SCCI)',
          effectiveDate: '2024-03-01',
          region: 'zambia',
          applicableCrops: ['maize', 'soybeans', 'groundnuts', 'cotton'],
          requirements: [
            'Seeds must meet minimum germination rates',
            'Genetic purity certification required',
            'Proper labeling with variety information',
            'Traceability documentation maintained'
          ],
          benefits: [
            'Access to government subsidy programs',
            'Premium pricing for certified varieties',
            'Technical support and training'
          ],
          contactInfo: {
            office: 'SCCI Headquarters',
            phone: '+260-211-252-377',
            email: 'info@scci.org.zm'
          },
          documents: [
            {
              name: 'Seed Certification Standards',
              type: 'pdf',
              url: '/documents/seed-certification-standards.pdf'
            }
          ]
        },
        {
          id: 'reg_003',
          type: 'subsidy_program',
          title: 'Farmer Input Support Program (FISP) 2024/25',
          description: 'Government subsidy program for agricultural inputs',
          authority: 'Ministry of Agriculture',
          effectiveDate: '2024-10-01',
          expiryDate: '2025-09-30',
          region: 'zambia',
          requirements: [
            'Must be registered smallholder farmer',
            'Farm size between 0.5 - 20 hectares',
            'No outstanding FISP debts',
            'Valid National Registration Card'
          ],
          benefits: [
            'Subsidized fertilizer (50% discount)',
            'Subsidized seeds (75% discount)',
            'Technical advisory services',
            'Access to guaranteed markets'
          ],
          contactInfo: {
            office: 'Ministry of Agriculture - FISP Coordination Unit',
            phone: '+260-211-252-544',
            email: 'fisp@agriculture.gov.zm'
          },
          documents: [
            {
              name: 'FISP Application Form 2024/25',
              type: 'pdf',
              url: '/documents/fisp-application-2024.pdf'
            },
            {
              name: 'FISP Guidelines',
              type: 'pdf',
              url: '/documents/fisp-guidelines-2024.pdf'
            }
          ]
        }
      ];

      storage.set(`regulatory_data_${region}`, mockRegulatoryData);
      return mockRegulatoryData;
    } catch (error) {
      console.error('Regulatory data fetch error:', error);
      return storage.get(`regulatory_data_${region}`) || [];
    }
  }

  // Market Price Data Integration
  async getMarketPriceData(commodity: string, market?: string): Promise<MarketPriceData[]> {
    try {
      const mockPriceData: MarketPriceData[] = [
        {
          commodity: 'maize',
          variety: 'white',
          market: 'Lusaka City Market',
          location: 'Lusaka',
          date: new Date().toISOString().split('T')[0],
          prices: {
            wholesale: 3.50 + Math.random() * 2,
            retail: 4.50 + Math.random() * 2,
            farmGate: 3.00 + Math.random() * 1.5,
            currency: 'ZMW'
          },
          quality: 'grade_a',
          unit: 'kg',
          volume: 5000 + Math.random() * 10000,
          trend: ['rising', 'falling', 'stable'][Math.floor(Math.random() * 3)] as any
        },
        {
          commodity: 'soybeans',
          market: 'Kitwe Central Market',
          location: 'Kitwe',
          date: new Date().toISOString().split('T')[0],
          prices: {
            wholesale: 8.00 + Math.random() * 3,
            retail: 10.00 + Math.random() * 3,
            farmGate: 7.00 + Math.random() * 2,
            currency: 'ZMW'
          },
          quality: 'grade_a',
          unit: 'kg',
          volume: 2000 + Math.random() * 5000,
          trend: ['rising', 'falling', 'stable'][Math.floor(Math.random() * 3)] as any
        }
      ];

      storage.set(`market_data_${commodity}`, mockPriceData);
      return mockPriceData;
    } catch (error) {
      console.error('Market price data fetch error:', error);
      return storage.get(`market_data_${commodity}`) || [];
    }
  }

  // Data Synchronization
  async syncAllData(farmId: string): Promise<{
    weather: boolean;
    satellite: boolean;
    iot: boolean;
    regulatory: boolean;
    market: boolean;
  }> {
    const results = {
      weather: false,
      satellite: false,
      iot: false,
      regulatory: false,
      market: false
    };

    try {
      // Fetch farm location for context
      const farms = storage.getFarms();
      const farm = farms.find(f => f.id === farmId);
      const latitude = farm?.location?.coordinates?.[0] || -15.3875;
      const longitude = farm?.location?.coordinates?.[1] || 28.3228;

      // Weather data sync
      try {
        await this.getWeatherData(latitude, longitude);
        results.weather = true;
      } catch (error) {
        console.error('Weather sync failed:', error);
      }

      // Satellite data sync
      try {
        const endDate = new Date().toISOString().split('T')[0];
        const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        await this.getSatelliteData(farmId, startDate, endDate);
        results.satellite = true;
      } catch (error) {
        console.error('Satellite sync failed:', error);
      }

      // IoT data sync
      try {
        await this.getIoTSensorData(farmId);
        results.iot = true;
      } catch (error) {
        console.error('IoT sync failed:', error);
      }

      // Regulatory data sync
      try {
        await this.getRegulatoryData('zambia');
        results.regulatory = true;
      } catch (error) {
        console.error('Regulatory sync failed:', error);
      }

      // Market data sync
      try {
        await this.getMarketPriceData('maize');
        await this.getMarketPriceData('soybeans');
        results.market = true;
      } catch (error) {
        console.error('Market sync failed:', error);
      }

      // Update last sync timestamp
      storage.set('last_data_sync', new Date().toISOString());

      return results;
    } catch (error) {
      console.error('Data sync error:', error);
      return results;
    }
  }

  // Get data sync status
  getDataSyncStatus(): {
    lastSync: string | null;
    nextSync: string;
    status: 'synced' | 'pending' | 'error';
  } {
    const lastSync = storage.get<string>('last_data_sync');
    const nextSync = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // Next hour

    let status: 'synced' | 'pending' | 'error' = 'pending';
    
    if (lastSync) {
      const timeSinceSync = Date.now() - new Date(lastSync).getTime();
      if (timeSinceSync < 60 * 60 * 1000) { // Less than 1 hour
        status = 'synced';
      } else if (timeSinceSync < 24 * 60 * 60 * 1000) { // Less than 24 hours
        status = 'pending';
      } else {
        status = 'error';
      }
    }

    return {
      lastSync,
      nextSync,
      status
    };
  }

  private getDefaultWeatherData(): WeatherData {
    return {
      timestamp: new Date().toISOString(),
      location: {
        latitude: -15.3875,
        longitude: 28.3228,
        name: 'Lusaka, Zambia'
      },
      current: {
        temperature: 28,
        humidity: 65,
        windSpeed: 8,
        windDirection: 180,
        precipitation: 0,
        pressure: 1013,
        visibility: 10,
        uvIndex: 7,
        condition: 'partly_cloudy',
        icon: 'wi-day-cloudy'
      },
      forecast: []
    };
  }
}

export const dataIntegrationService = new DataIntegrationService();