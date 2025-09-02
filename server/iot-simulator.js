// This is a placeholder for IoT sensor data simulation
// In a real implementation, this would run on a server and generate mock sensor data

class IoTDataSimulator {
  constructor() {
    this.sensors = [
      { id: 'sensor-001', location: 'Field A', type: 'soil-moisture' },
      { id: 'sensor-002', location: 'Field A', type: 'temperature' },
      { id: 'sensor-003', location: 'Field B', type: 'soil-moisture' },
      { id: 'sensor-004', location: 'Greenhouse', type: 'humidity' },
    ];
  }

  // Generate mock sensor data
  generateSensorData() {
    return this.sensors.map(sensor => ({
      id: sensor.id,
      location: sensor.location,
      type: sensor.type,
      value: this.getRandomValue(sensor.type),
      timestamp: new Date().toISOString()
    }));
  }

  // Generate random values based on sensor type
  getRandomValue(type) {
    switch(type) {
      case 'soil-moisture':
        return Math.floor(Math.random() * 30) + 20; // 20-50%
      case 'temperature':
        return Math.floor(Math.random() * 15) + 15; // 15-30°C
      case 'humidity':
        return Math.floor(Math.random() * 40) + 40; // 40-80%
      default:
        return Math.floor(Math.random() * 100);
    }
  }

  // Simulate data generation at intervals
  startSimulation(callback) {
    setInterval(() => {
      const data = this.generateSensorData();
      callback(data);
    }, 30000); // Generate data every 30 seconds
  }
}

// Export a singleton instance
const iotSimulator = new IoTDataSimulator();
export default iotSimulator;