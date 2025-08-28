// Africa's Talking USSD Integration Service
// This service handles USSD interactions through Africa's Talking API

export interface USSDRequest {
  sessionId: string;
  serviceCode: string;
  phoneNumber: string;
  text: string;
}

export interface USSDResponse {
  response: string;
  endSession?: boolean;
}

export interface USSDSession {
  sessionId: string;
  phoneNumber: string;
  currentMenu: string;
  userData?: any;
  menuHistory: string[];
  createdAt: Date;
  lastActivity: Date;
}

class AfricasTalkingUSSDService {
  private sessions = new Map<string, USSDSession>();
  private readonly sessionTimeout = 5 * 60 * 1000; // 5 minutes

  // Initialize or get existing session
  private getSession(sessionId: string, phoneNumber: string): USSDSession {
    if (!this.sessions.has(sessionId)) {
      this.sessions.set(sessionId, {
        sessionId,
        phoneNumber,
        currentMenu: 'main',
        menuHistory: [],
        createdAt: new Date(),
        lastActivity: new Date()
      });
    }
    
    const session = this.sessions.get(sessionId)!;
    session.lastActivity = new Date();
    return session;
  }

  // Clean up expired sessions
  private cleanupSessions(): void {
    const now = Date.now();
    for (const [sessionId, session] of this.sessions) {
      if (now - session.lastActivity.getTime() > this.sessionTimeout) {
        this.sessions.delete(sessionId);
      }
    }
  }

  // Main USSD handler
  public async handleUSSDRequest(request: USSDRequest): Promise<USSDResponse> {
    this.cleanupSessions();
    
    const session = this.getSession(request.sessionId, request.phoneNumber);
    const userInput = request.text.split('*').pop() || '';
    
    // Route to appropriate menu handler
    switch (session.currentMenu) {
      case 'main':
        return this.handleMainMenu(session, userInput);
      case 'login':
        return this.handleLogin(session, userInput);
      case 'farms':
        return this.handleFarms(session, userInput);
      case 'marketplace':
        return this.handleMarketplace(session, userInput);
      case 'weather':
        return this.handleWeather(session, userInput);
      case 'prices':
        return this.handlePrices(session, userInput);
      case 'advice':
        return this.handleAdvice(session, userInput);
      case 'register':
        return this.handleRegistration(session, userInput);
      default:
        return this.handleMainMenu(session, userInput);
    }
  }

  private handleMainMenu(session: USSDSession, input: string): USSDResponse {
    if (!input) {
      return {
        response: `CON Welcome to ULIMI 2.0 🌾
Agricultural Services Platform

1. Login to your account
2. Register new account
3. Weather information
4. Market prices
5. Farming tips
6. Contact support
0. Exit`
      };
    }

    switch (input) {
      case '1':
        session.currentMenu = 'login';
        return {
          response: 'CON Login to ULIMI\nEnter your phone number:'
        };
      case '2':
        session.currentMenu = 'register';
        return {
          response: 'CON Register for ULIMI\nEnter your full name:'
        };
      case '3':
        session.currentMenu = 'weather';
        return this.handleWeather(session, '');
      case '4':
        session.currentMenu = 'prices';
        return this.handlePrices(session, '');
      case '5':
        session.currentMenu = 'advice';
        return this.handleAdvice(session, '');
      case '6':
        return {
          response: 'END Contact ULIMI Support:\n📞 +260-XXX-XXXX\n📧 support@ulimi.com\n\nThank you for using ULIMI! 🌾',
          endSession: true
        };
      case '0':
        return {
          response: 'END Thank you for using ULIMI Agricultural Services! 🌾\n\nFor more features, visit our website or download our app.',
          endSession: true
        };
      default:
        return {
          response: 'CON Invalid option. Please try again.\n\n1. Login\n2. Register\n3. Weather\n4. Prices\n5. Tips\n6. Support\n0. Exit'
        };
    }
  }

  private handleLogin(session: USSDSession, input: string): USSDResponse {
    if (!session.userData) {
      session.userData = { step: 'phone' };
    }

    if (session.userData.step === 'phone') {
      if (!input) {
        return {
          response: 'CON Enter your phone number:'
        };
      }
      session.userData.phone = input;
      session.userData.step = 'pin';
      return {
        response: 'CON Enter your 4-digit PIN:'
      };
    }

    if (session.userData.step === 'pin') {
      if (!input || input.length !== 4) {
        return {
          response: 'CON Invalid PIN format.\nEnter your 4-digit PIN:'
        };
      }

      // Here you would validate credentials against your database
      const isValidLogin = this.validateCredentials(session.userData.phone, input);
      
      if (isValidLogin) {
        session.currentMenu = 'farms';
        session.userData.authenticated = true;
        return {
          response: `CON Welcome back! 👋\n\nFarmer Dashboard:\n1. My farms\n2. Marketplace\n3. Weather\n4. Tasks\n5. Profile\n0. Logout`
        };
      } else {
        return {
          response: 'END Invalid credentials.\nPlease try again or contact support.\n📞 +260-XXX-XXXX',
          endSession: true
        };
      }
    }

    return this.handleMainMenu(session, '');
  }

  private handleFarms(session: USSDSession, input: string): USSDResponse {
    if (!input) {
      return {
        response: `CON Farmer Dashboard 👨‍🌾\n\n1. My farms\n2. Marketplace\n3. Weather\n4. Tasks\n5. Profile\n0. Logout`
      };
    }

    switch (input) {
      case '1':
        return {
          response: `CON My Farms 🏡\n\n1. Green Valley Farm (5.5 ha)\n   📍 Lusaka\n   🌾 Maize, Soybean\n\n2. Add new farm\n0. Back to menu`
        };
      case '2':
        session.currentMenu = 'marketplace';
        return this.handleMarketplace(session, '');
      case '3':
        session.currentMenu = 'weather';
        return this.handleWeather(session, '');
      case '4':
        return {
          response: `CON My Tasks ✅\n\n1. Apply fertilizer (Due: Tomorrow)\n2. Weed control (Due: 3 days)\n3. Harvest planning (Due: 1 week)\n\n0. Back to menu`
        };
      case '5':
        return {
          response: `CON My Profile 👤\n\nName: ${session.userData?.name || 'Farmer'}\nPhone: ${session.phoneNumber}\nLocation: Lusaka, Zambia\n\n1. Edit profile\n0. Back to menu`
        };
      case '0':
        return {
          response: 'END Thank you for using ULIMI! 🌾\nStay connected for better farming.',
          endSession: true
        };
      default:
        return {
          response: 'CON Invalid option.\n\n1. Farms\n2. Marketplace\n3. Weather\n4. Tasks\n5. Profile\n0. Logout'
        };
    }
  }

  private handleMarketplace(session: USSDSession, input: string): USSDResponse {
    if (!input) {
      return {
        response: `CON Marketplace 🏪\n\n1. Buy inputs\n2. Sell produce\n3. View orders\n4. Price alerts\n0. Back to menu`
      };
    }

    switch (input) {
      case '1':
        return {
          response: `CON Farm Inputs 🌱\n\n1. Fertilizers (K350/bag)\n2. Seeds (K45/kg)\n3. Pesticides (K120/bottle)\n4. Tools\n\n0. Back`
        };
      case '2':
        return {
          response: `CON Sell Your Produce 📦\n\n1. List maize (Current: K8.50/kg)\n2. List soybean (Current: K12/kg)\n3. List vegetables\n\n0. Back`
        };
      case '3':
        return {
          response: `CON My Orders 📋\n\n1. Order #12345 - Fertilizer (Pending)\n2. Order #12344 - Seeds (Delivered)\n\nNo recent sales.\n\n0. Back`
        };
      case '4':
        return {
          response: `CON Price Alerts 📈\n\nCurrent prices:\n🌽 Maize: K8.50/kg (↑ 5%)\n🫘 Soybean: K12.00/kg (→ 0%)\n🥬 Vegetables: K15/kg (↓ 2%)\n\n0. Back`
        };
      default:
        session.currentMenu = 'farms';
        return this.handleFarms(session, '');
    }
  }

  private handleWeather(session: USSDSession, input: string): USSDResponse {
    return {
      response: `CON Weather Forecast 🌤️\n\nLusaka, Zambia\nToday: 28°C, Partly cloudy\nHumidity: 65%\nChance of rain: 30%\n\nTomorrow: 26°C, Light rain\n\n🌾 Good day for planting!\n\n0. Back to menu`,
    };
  }

  private handlePrices(session: USSDSession, input: string): USSDResponse {
    return {
      response: `CON Market Prices 💰\n\nLusaka Market (Today):\n🌽 Maize: K8.50/kg\n🫘 Soybean: K12.00/kg\n🥜 Groundnuts: K18.00/kg\n🌻 Sunflower: K6.50/kg\n\nPrices updated: ${new Date().toLocaleDateString()}\n\n0. Back to menu`
    };
  }

  private handleAdvice(session: USSDSession, input: string): USSDResponse {
    const tips = [
      "Plant drought-resistant maize varieties like SC627 for better yields.",
      "Test your soil pH before planting. Most crops thrive in pH 6.0-7.0.",
      "Watch for fall armyworm in maize fields during rainy season.",
      "Store your harvest properly to get better prices later.",
      "Use organic manure to improve soil health and reduce costs."
    ];
    
    const randomTip = tips[Math.floor(Math.random() * tips.length)];
    
    return {
      response: `CON Farming Tip 💡\n\n${randomTip}\n\nFor more personalized advice:\n📞 Call our extension officer\n📱 Use ULIMI app\n\n0. Back to menu`
    };
  }

  private handleRegistration(session: USSDSession, input: string): USSDResponse {
    if (!session.userData) {
      session.userData = { step: 'name' };
    }

    switch (session.userData.step) {
      case 'name':
        if (!input) {
          return {
            response: 'CON Register for ULIMI\nEnter your full name:'
          };
        }
        session.userData.name = input;
        session.userData.step = 'location';
        return {
          response: 'CON Enter your district (e.g., Lusaka):'
        };
      
      case 'location':
        if (!input) {
          return {
            response: 'CON Enter your district:'
          };
        }
        session.userData.location = input;
        session.userData.step = 'pin';
        return {
          response: 'CON Create a 4-digit PIN for login:'
        };
      
      case 'pin':
        if (!input || input.length !== 4) {
          return {
            response: 'CON Invalid PIN. Create a 4-digit PIN:'
          };
        }
        
        // Here you would save the user to your database
        this.registerUser({
          name: session.userData.name,
          phone: session.phoneNumber,
          location: session.userData.location,
          pin: input
        });
        
        return {
          response: `END Registration successful! 🎉\n\nWelcome to ULIMI, ${session.userData.name}!\n\nYou can now dial *123# to access your account.\n\nHappy farming! 🌾`,
          endSession: true
        };
      
      default:
        return this.handleMainMenu(session, '');
    }
  }

  private validateCredentials(phone: string, pin: string): boolean {
    // Mock validation - replace with actual database check
    const mockUsers = [
      { phone: '+260977123456', pin: '1234', name: 'Mirriam' },
      { phone: '+260977555123', pin: '5678', name: 'Joseph Tembo' }
    ];
    
    return mockUsers.some(user => user.phone === phone && user.pin === pin);
  }

  private registerUser(userData: any): boolean {
    // Mock registration - replace with actual database save
    console.log('Registering user:', userData);
    return true;
  }

  // Public method to get session data for web app integration
  public getSessionData(sessionId: string): USSDSession | undefined {
    return this.sessions.get(sessionId);
  }

  // Public method to end session
  public endSession(sessionId: string): void {
    this.sessions.delete(sessionId);
  }
}

export const africasTalkingUSSD = new AfricasTalkingUSSDService();