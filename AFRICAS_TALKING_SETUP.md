# ULIMI Africa's Talking USSD Integration

## 🚀 Complete Setup Guide

This guide will help you integrate ULIMI with Africa's Talking to provide USSD services across Africa.

## 📋 Prerequisites

1. **Africa's Talking Account**
   - Sign up at [https://account.africastalking.com/](https://account.africastalking.com/)
   - Get API credentials (Username, API Key)
   - Purchase USSD service code (e.g., *123#)

2. **Server Requirements**
   - Node.js 16+ 
   - Public domain/IP with HTTPS
   - Backend server (Express.js recommended)

## 🔧 Installation Steps

### Step 1: Setup Backend Server

```bash
# Create backend directory
mkdir ulimi-backend
cd ulimi-backend

# Copy the package.json file and install dependencies
cp ../backend-package.json package.json
npm install

# Install Africa's Talking SDK
npm install africas-talking
```

### Step 2: Environment Configuration

Create `.env` file:

```env
# Africa's Talking Configuration
AT_USERNAME=your_username
AT_API_KEY=your_api_key_here
AT_SHORT_CODE=your_short_code

# USSD Configuration
USSD_SERVICE_CODE=*123#
USSD_WEBHOOK_URL=https://yourdomain.com/api/ussd

# Server Configuration
PORT=3001
NODE_ENV=production

# Database (MongoDB recommended)
MONGODB_URI=mongodb://localhost:27017/ulimi

# Security
JWT_SECRET=your_jwt_secret_here
```

### Step 3: Deploy Backend Server

```javascript
// server.js
const express = require('express');
const { handleUSSDWebhook } = require('./dist/services/ussd-webhook');

const app = express();
app.use(express.urlencoded({ extended: false }));

// USSD webhook endpoint
app.post('/api/ussd', handleUSSDWebhook);

app.listen(3001, () => {
  console.log('🚀 ULIMI USSD Server running on port 3001');
});
```

### Step 4: Configure Africa's Talking Dashboard

1. **Login to Africa's Talking Dashboard**
2. **Navigate to USSD Settings**
3. **Configure your USSD code** (e.g., *123#)
4. **Set Webhook URL**: `https://yourdomain.com/api/ussd`
5. **Enable the service**

## 📱 USSD Service Features

### Main Menu Structure
```
*123# → Welcome to ULIMI 🌾
1. Login to your account
2. Register new account  
3. Weather information
4. Market prices
5. Farming tips
6. Contact support
0. Exit
```

### User Journey Examples

#### **New User Registration**
```
*123# → Main Menu
→ 2 (Register)
→ Enter name: "Mirriam Banda"
→ Enter district: "Lusaka"  
→ Create PIN: "1234"
→ ✅ Registration successful!
```

#### **Farmer Dashboard**
```
*123# → Main Menu
→ 1 (Login)
→ Phone: "+260977123456"
→ PIN: "1234"
→ ✅ Welcome back!

Farmer Dashboard:
1. My farms (View/manage farms)
2. Marketplace (Buy/sell)
3. Weather (Local forecast)
4. Tasks (Farm activities)
5. Profile (Account settings)
0. Logout
```

#### **Market Information**
```
*123# → Main Menu
→ 4 (Market prices)

Lusaka Market Today:
🌽 Maize: K8.50/kg
🫘 Soybean: K12.00/kg  
🥜 Groundnuts: K18.00/kg
Prices updated: Today
```

## 🔗 Integration with Web App

### Sync USSD Sessions with Web App

```typescript
// In your React app, check for USSD authentication
const checkUSSDAuth = async (sessionId: string) => {
  const response = await fetch('/api/ussd/auth-check', {
    method: 'POST',
    body: JSON.stringify({ sessionId }),
    headers: { 'Content-Type': 'application/json' }
  });
  
  if (response.ok) {
    const userData = await response.json();
    // Authenticate user in web app
    login(userData);
  }
};
```

## 📊 Countries Supported by Africa's Talking

### **Primary Coverage** (Full USSD Support)
- 🇰🇪 **Kenya** - Safaricom, Airtel, Telkom
- 🇺🇬 **Uganda** - MTN, Airtel, Africell  
- 🇹🇿 **Tanzania** - Vodacom, Airtel, Tigo
- 🇷🇼 **Rwanda** - MTN, Airtel
- 🇲🇼 **Malawi** - TNM, Airtel
- 🇿🇲 **Zambia** - MTN, Airtel, Zamtel

### **Extended Coverage** (SMS/Voice)
- 🇳🇬 **Nigeria** - MTN, Airtel, Glo, 9mobile
- 🇬🇭 **Ghana** - MTN, Vodafone, AirtelTigo
- 🇪🇹 **Ethiopia** - Ethio Telecom
- 🇸🇦 **South Africa** - Vodacom, MTN, Cell C
- 🇲🇦 **Morocco** - Orange, Inwi, IAM
- 🇪🇬 **Egypt** - Orange, Vodafone, Etisalat

## 💰 Pricing Considerations

### USSD Pricing (Approximate)
- **USSD Sessions**: $0.01 - $0.05 per session
- **USSD Service Code**: $50 - $200/month rental
- **SMS Notifications**: $0.02 - $0.08 per SMS

### Revenue Model Options
1. **Freemium**: Basic USSD free, premium features paid
2. **Subscription**: Monthly/yearly farmer subscriptions  
3. **Transaction-based**: Small fee on marketplace transactions
4. **Partnership**: Revenue sharing with telecom operators

## 🔒 Security Best Practices

```typescript
// Input validation
const validateUSSDInput = (input: string): boolean => {
  return /^[0-9*#]+$/.test(input) && input.length <= 100;
};

// Rate limiting
const rateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10, // 10 requests per minute per phone
  keyGenerator: (req) => req.body.phoneNumber
});

// Session security
const sessions = new Map();
setInterval(() => {
  // Clean expired sessions every 5 minutes
  cleanupExpiredSessions();
}, 5 * 60 * 1000);
```

## 📈 Analytics & Monitoring

### Key Metrics to Track
- **User Adoption**: New registrations via USSD
- **Session Duration**: Average time spent in USSD
- **Feature Usage**: Most popular menu options
- **Geographic Distribution**: Usage by region
- **Conversion Rate**: USSD to web app migration

### Monitoring Setup
```javascript
// Log USSD interactions
const logUSSDEvent = (event) => {
  console.log({
    timestamp: new Date(),
    phoneNumber: event.phoneNumber,
    action: event.action,
    sessionDuration: event.duration,
    country: event.country
  });
};
```

## 🚀 Deployment Checklist

- [ ] Africa's Talking account setup
- [ ] USSD service code purchased  
- [ ] Backend server deployed
- [ ] Webhook URL configured
- [ ] SSL certificate installed
- [ ] Environment variables set
- [ ] Database connected
- [ ] Testing completed
- [ ] Monitoring enabled
- [ ] Documentation updated

## 📞 Support & Resources

- **Africa's Talking Docs**: [https://developers.africastalking.com/](https://developers.africastalking.com/)
- **USSD Best Practices**: [AT USSD Guide](https://developers.africastalking.com/docs/ussd/overview)
- **SDK Documentation**: [Node.js SDK](https://developers.africastalking.com/docs/libraries/nodejs)

## 🌟 Next Steps

1. **Test in Sandbox**: Use AT sandbox for development
2. **Go Live**: Switch to production credentials
3. **Marketing**: Promote USSD code to farmers
4. **Iterate**: Improve based on user feedback
5. **Scale**: Add more countries and features

---

## Example USSD Flows

### Weather Information
```
*123* → 3 (Weather)
→ Lusaka Weather 🌤️
  Today: 28°C, Partly cloudy
  Tomorrow: 26°C, Light rain
  🌾 Good day for planting!
```

### Quick Market Prices  
```
*123* → 4 (Prices)
→ Lusaka Market Today 💰
  🌽 Maize: K8.50/kg
  🫘 Soybean: K12.00/kg
  Updated: 2 hours ago
```

This integration will make ULIMI accessible to millions of farmers across Africa via simple mobile phones! 🌾📱