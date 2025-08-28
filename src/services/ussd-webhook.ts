// Africa's Talking USSD Webhook Handler
// This would typically run on your backend server (Node.js/Express)

import { africasTalkingUSSD, USSDRequest, USSDResponse } from './africastalking';

/**
 * Express.js route handler for Africa's Talking USSD webhook
 * 
 * Setup Instructions:
 * 1. Deploy this to your backend server
 * 2. Configure Africa's Talking USSD service code (e.g., *123#)
 * 3. Set webhook URL to: https://your-domain.com/api/ussd
 * 4. Ensure your server can receive POST requests
 */

export const handleUSSDWebhook = async (req: any, res: any) => {
  try {
    // Parse Africa's Talking USSD request
    const {
      sessionId,
      serviceCode,
      phoneNumber,
      text
    } = req.body;

    // Validate required fields
    if (!sessionId || !serviceCode || !phoneNumber) {
      return res.status(400).send('Missing required fields');
    }

    const ussdRequest: USSDRequest = {
      sessionId,
      serviceCode,
      phoneNumber,
      text: text || ''
    };

    // Process USSD request
    const response: USSDResponse = await africasTalkingUSSD.handleUSSDRequest(ussdRequest);

    // Send response back to Africa's Talking
    res.set('Content-Type', 'text/plain');
    res.send(response.response);

  } catch (error) {
    console.error('USSD Handler Error:', error);
    res.status(500).send('END Service temporarily unavailable. Please try again later.');
  }
};

/**
 * Example Express.js server setup
 */
export const setupUSSDServer = () => {
  const express = require('express');
  const bodyParser = require('body-parser');
  
  const app = express();
  const PORT = process.env.PORT || 3001;

  // Middleware
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  // USSD webhook endpoint
  app.post('/api/ussd', handleUSSDWebhook);

  // Health check endpoint
  app.get('/health', (req: any, res: any) => {
    res.json({
      status: 'ok',
      service: 'ULIMI USSD Service',
      timestamp: new Date().toISOString()
    });
  });

  // Start server
  app.listen(PORT, () => {
    console.log(`🚀 ULIMI USSD Server running on port ${PORT}`);
    console.log(`📞 Webhook URL: http://localhost:${PORT}/api/ussd`);
    console.log(`🌐 Health check: http://localhost:${PORT}/health`);
  });

  return app;
};

/**
 * Configuration for Africa's Talking
 */
export const africasTalkingConfig = {
  // Get these from your Africa's Talking dashboard
  username: process.env.AT_USERNAME || 'sandbox', // Use 'sandbox' for testing
  apiKey: process.env.AT_API_KEY || 'your-api-key-here',
  
  // USSD configuration
  ussd: {
    serviceCode: '*123#', // Your assigned USSD code
    webhookUrl: process.env.USSD_WEBHOOK_URL || 'https://your-domain.com/api/ussd'
  },

  // SMS configuration (for notifications)
  sms: {
    shortCode: process.env.AT_SHORT_CODE || 'your-short-code',
    from: process.env.AT_SENDER_ID || 'ULIMI'
  }
};

/**
 * Send SMS notification (for order confirmations, weather alerts, etc.)
 */
export const sendSMSNotification = async (phoneNumber: string, message: string) => {
  const AfricasTalking = require('africas-talking');
  
  const africastalking = AfricasTalking({
    apiKey: africasTalkingConfig.apiKey,
    username: africasTalkingConfig.username
  });

  const sms = africastalking.SMS;

  try {
    const result = await sms.send({
      to: phoneNumber,
      message: message,
      from: africasTalkingConfig.sms.from
    });
    
    console.log('SMS sent successfully:', result);
    return result;
  } catch (error) {
    console.error('SMS sending failed:', error);
    throw error;
  }
};

/**
 * Integration with existing ULIMI web app
 */
export const integrateWithWebApp = () => {
  // Sync USSD sessions with web app authentication
  // This allows users to start on USSD and continue on web app
  
  return {
    // Get user session from USSD to authenticate in web app
    authenticateFromUSSD: (sessionId: string) => {
      const session = africasTalkingUSSD.getSessionData(sessionId);
      if (session?.userData?.authenticated) {
        return {
          phoneNumber: session.phoneNumber,
          authenticated: true,
          userData: session.userData
        };
      }
      return null;
    },

    // End USSD session when user logs into web app
    transferToWebApp: (sessionId: string) => {
      africasTalkingUSSD.endSession(sessionId);
    }
  };
};

// Export for use in your backend
export default {
  handleUSSDWebhook,
  setupUSSDServer,
  africasTalkingConfig,
  sendSMSNotification,
  integrateWithWebApp
};