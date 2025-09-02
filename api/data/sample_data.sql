-- Sample data for smart agriculture system

-- Sample weather data
INSERT INTO weather_data (location, date, temperature, rainfall, humidity, sunlight_hours) VALUES
('Lusaka, Zambia', '2024-01-15', 28.5, 15.2, 65.0, 8.5),
('Lusaka, Zambia', '2024-01-16', 29.0, 0.0, 70.0, 9.0),
('Lusaka, Zambia', '2024-01-17', 27.8, 5.5, 68.0, 7.5),
('Ndola, Zambia', '2024-01-15', 26.2, 8.0, 62.0, 9.2),
('Ndola, Zambia', '2024-01-16', 26.8, 2.3, 65.0, 8.8);

-- Sample soil data
INSERT INTO soil_data (location, soil_type, ph, nitrogen, phosphorus, potassium, moisture) VALUES
('Lusaka, Zambia', 'Loam', 6.5, 120.0, 45.0, 90.0, 35.0),
('Ndola, Zambia', 'Sandy Loam', 6.2, 95.0, 38.0, 75.0, 28.0),
('Livingstone, Zambia', 'Clay', 7.0, 110.0, 52.0, 85.0, 42.0);

-- Sample crops data
INSERT INTO crops (crop_name, optimal_soil, optimal_rainfall, optimal_temp_min, optimal_temp_max, market_price) VALUES
('Maize', 'Loam', 20.0, 20.0, 30.0, 3.50),
('Soybeans', 'Well-drained loam', 15.0, 18.0, 28.0, 8.00),
('Groundnuts', 'Sandy loam', 12.0, 20.0, 32.0, 6.50),
('Cassava', 'Well-drained soil', 10.0, 25.0, 35.0, 2.80),
('Rice', 'Clay or loam', 25.0, 22.0, 35.0, 4.20);

-- Sample farmer inputs
INSERT INTO farmer_inputs (farmer_id, location, selected_crop, planting_date) VALUES
('user_123', 'Lusaka, Zambia', 'Maize', '2024-01-10'),
('user_456', 'Ndola, Zambia', 'Soybeans', '2024-01-08');

-- Sample recommendations
INSERT INTO recommendations (farmer_id, crop_name, recommendation_text, expected_yield, profit_estimate) VALUES
('user_123', 'Maize', 'Based on current conditions in Lusaka, Zambia: Temperature: 28.5°C (Optimal) Rainfall: 15.2mm (Adequate) Soil pH: 6.5 (Optimal). Fertilizer schedule: Apply basal fertilizer (Compound D) at planting. Top-dress with Urea 4-6 weeks after planting. Irrigation: Maintain soil moisture at 30-40% for optimal growth. Planting time: Based on current conditions, planting now is appropriate. Expected yield: 4.50 tons/ha. Profit estimate: ZMW 14.18/ha', 4.50, 14.18),
('user_456', 'Soybeans', 'Based on current conditions in Ndola, Zambia: Temperature: 26.2°C (Optimal) Rainfall: 8.0mm (Inadequate) Soil pH: 6.2 (Suboptimal). Fertilizer schedule: Apply basal fertilizer (Compound D) at planting. Top-dress with Urea 4-6 weeks after planting. Irrigation: Increase watering to compensate for low rainfall. Planting time: Based on current conditions, planting now is appropriate. Expected yield: 3.20 tons/ha. Profit estimate: ZMW 23.04/ha', 3.20, 23.04);