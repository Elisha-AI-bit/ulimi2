// Zambia-specific data and utilities

export const zambiaProvinces = [
  'Central',
  'Copperbelt',
  'Eastern',
  'Luapula',
  'Lusaka',
  'Muchinga',
  'Northern',
  'North-Western',
  'Southern',
  'Western'
];

export const zambiaDistricts: Record<string, string[]> = {
  'Central': ['Kabwe', 'Kapiri Mposhi', 'Mkushi', 'Mumbwa', 'Serenje', 'Chibombo', 'Chitambo', 'Itezhi-Tezhi', 'Ngabwe', 'Shibuyunji'],
  'Copperbelt': ['Kitwe', 'Ndola', 'Mufulira', 'Luanshya', 'Chingola', 'Kalulushi', 'Chililabombwe', 'Lufwanyama', 'Masaiti', 'Mpongwe'],
  'Eastern': ['Chipata', 'Katete', 'Lundazi', 'Mambwe', 'Nyimba', 'Petauke', 'Chadiza', 'Chama', 'Kasenengwa', 'Lumezi', 'Sinda', 'Vubwi'],
  'Luapula': ['Mansa', 'Kawambwa', 'Nchelenge', 'Samfya', 'Mwense', 'Chienge', 'Chembe', 'Milenge', 'Mwansabombwe'],
  'Lusaka': ['Lusaka', 'Kafue', 'Luangwa', 'Rufunsa', 'Chongwe', 'Chilanga'],
  'Muchinga': ['Chinsali', 'Isoka', 'Mpika', 'Nakonde', 'Kanchibiya', 'Lavushimanda', 'Shiwangandu'],
  'Northern': ['Kasama', 'Mbala', 'Luwingu', 'Mporokoso', 'Kaputa', 'Mungwi', 'Nsama', 'Senga Hill'],
  'North-Western': ['Solwezi', 'Mwinilunga', 'Kasempa', 'Zambezi', 'Kabompo', 'Chavuma', 'Ikelenge', 'Kalumbila', 'Manyinga', 'Mushindamo'],
  'Southern': ['Livingstone', 'Choma', 'Mazabuka', 'Monze', 'Namwala', 'Kalomo', 'Gwembe', 'Siavonga', 'Sinazongwe', 'Zimba', 'Pemba', 'Itezhi-Tezhi'],
  'Western': ['Mongu', 'Senanga', 'Sesheke', 'Shangombo', 'Kalabo', 'Lukulu', 'Kaoma', 'Nkeyema', 'Limulunga', 'Mitete', 'Mwandi', 'Nalolo', 'Sikongo', 'Sioma']
};

export const commonCrops = [
  { name: 'Maize', varieties: ['SC627', 'SC719', 'PAN67', 'ZM621'], season: 'Rainy', duration: '120-140 days' },
  { name: 'Soybean', varieties: ['Hernon147', 'Soprano', 'Lukanga', 'Kafue'], season: 'Rainy', duration: '90-120 days' },
  { name: 'Groundnuts', varieties: ['Chalimbana', 'CG7', 'Msinjiro', 'Nyanda'], season: 'Rainy', duration: '90-120 days' },
  { name: 'Cotton', varieties: ['Chureza', 'Albar377'], season: 'Rainy', duration: '180-200 days' },
  { name: 'Sunflower', varieties: ['Pannar7351', 'Record'], season: 'Rainy', duration: '90-110 days' },
  { name: 'Wheat', varieties: ['Mwamba', 'Chozi'], season: 'Winter', duration: '120-140 days' },
  { name: 'Sweet Potato', varieties: ['Orange', 'White', 'Purple'], season: 'Year-round', duration: '90-120 days' },
  { name: 'Cassava', varieties: ['Bangweulu', 'Chila', 'Mweru'], season: 'Year-round', duration: '8-12 months' }
];

export const fertilizers = [
  { name: 'Compound D (10:20:10)', use: 'Basal application', crops: ['Maize', 'Soybean'] },
  { name: 'Urea (46:0:0)', use: 'Top dressing', crops: ['Maize', 'Wheat'] },
  { name: 'CAN (27:0:0)', use: 'Top dressing', crops: ['Maize', 'Wheat'] },
  { name: 'NPK (20:10:10)', use: 'General purpose', crops: ['All crops'] },
  { name: 'DAP (18:46:0)', use: 'Phosphorus boost', crops: ['Legumes'] }
];

export const pesticides = [
  { name: 'Roundup', type: 'Herbicide', target: 'Weeds', crops: ['All crops'] },
  { name: 'Bulldock', type: 'Insecticide', target: 'Bollworm', crops: ['Cotton', 'Maize'] },
  { name: 'Karate', type: 'Insecticide', target: 'Aphids', crops: ['All crops'] },
  { name: 'Ridomil', type: 'Fungicide', target: 'Downy mildew', crops: ['Maize', 'Soybean'] }
];

export const languages = {
  en: 'English',
  ny: 'Chinyanja',
  bem: 'Chibemba',
  ton: 'Chitonga',
  loz: 'Silozi',
  lun: 'Chilunda',
  lue: 'Chiluvale',
  lam: 'Chilamba',
  kau: 'Chikaonde'
};

export const translations = {
  en: {
    // Navigation
    dashboard: 'Dashboard',
    farms: 'My Farms',
    marketplace: 'Marketplace',
    ai_advisor: 'AI Advisor',
    weather: 'Weather',
    tasks: 'Tasks',
    inventory: 'Inventory',
    profile: 'Profile',
    
    // Common Actions
    welcome: 'Welcome to ULIMI 2.0',
    add: 'Add',
    edit: 'Edit',
    delete: 'Delete',
    save: 'Save',
    cancel: 'Cancel',
    search: 'Search',
    filter: 'Filter',
    view: 'View',
    download: 'Download',
    upload: 'Upload',
    
    // Farm Management
    farm_management: 'Farm Management',
    add_farm: 'Add Farm',
    farm_name: 'Farm Name',
    farm_size: 'Farm Size',
    location: 'Location',
    soil_type: 'Soil Type',
    crops: 'Crops',
    
    // Marketplace
    buy_inputs: 'Buy Inputs',
    sell_produce: 'Sell Produce',
    price: 'Price',
    quantity: 'Quantity',
    quality: 'Quality',
    supplier: 'Supplier',
    order: 'Order',
    
    // AI and Technology
    get_advice: 'Get AI Advice',
    ai_recommendations: 'AI Recommendations',
    crop_optimizer: 'Crop Optimizer',
    vision_diagnosis: 'Vision Diagnosis',
    weather_forecast: 'Weather Forecast',
    
    // General Terms
    date: 'Date',
    time: 'Time',
    status: 'Status',
    description: 'Description',
    notes: 'Notes',
    priority: 'Priority',
    category: 'Category',
    type: 'Type',
    
    // Messages
    loading: 'Loading...',
    no_data: 'No data available',
    error: 'An error occurred',
    success: 'Operation completed successfully',
    confirm_delete: 'Are you sure you want to delete this item?'
  },
  ny: {
    // Navigation
    dashboard: 'Chipinda',
    farms: 'Minda Yanga',
    marketplace: 'Msika',
    ai_advisor: 'Mlangizi wa AI',
    weather: 'Nyengo',
    tasks: 'Ntchito',
    inventory: 'Zinthu',
    profile: 'Mbiri Yanga',
    
    // Common Actions
    welcome: 'Mwalandiridwa ku ULIMI 2.0',
    add: 'Onjezera',
    edit: 'Sinthani',
    delete: 'Chotsani',
    save: 'Sungani',
    cancel: 'Lekani',
    search: 'Funani',
    filter: 'Salani',
    view: 'Onani',
    download: 'Tulutsani',
    upload: 'Kwezani',
    
    // Farm Management
    farm_management: 'Kasamalidwe ka Munda',
    add_farm: 'Onjezera Munda',
    farm_name: 'Dzina la Munda',
    farm_size: 'Kukula kwa Munda',
    location: 'Malo',
    soil_type: 'Mtundu wa Dothi',
    crops: 'Mbewu',
    
    // Marketplace
    buy_inputs: 'Gula Zipangizo',
    sell_produce: 'Gulitsa Zokolola',
    price: 'Mtengo',
    quantity: 'Kuchuluka',
    quality: 'Ubwino',
    supplier: 'Wogulitsa',
    order: 'Itanani',
    
    // AI and Technology
    get_advice: 'Peza Uphungu wa AI',
    ai_recommendations: 'Malangizo a AI',
    crop_optimizer: 'Wokongola Mbewu',
    vision_diagnosis: 'Kuwona Matenda',
    weather_forecast: 'Kuneneratu Nyengo',
    
    // General Terms
    date: 'Tsiku',
    time: 'Nthawi',
    status: 'Momwe ziliri',
    description: 'Kufotokoza',
    notes: 'Zolemba',
    priority: 'Chofunika kwambiri',
    category: 'Gulu',
    type: 'Mtundu',
    
    // Messages
    loading: 'Kukweza...',
    no_data: 'Palibe chilichonse',
    error: 'Vuto lidachitika',
    success: 'Zachita bwino',
    confirm_delete: 'Mukutsimikiza kuti mukufuna kuchotsa ichi?'
  },
  bem: {
    // Navigation
    dashboard: 'Ukubomfya',
    farms: 'Amafamu Yandi',
    marketplace: 'Amaketala',
    ai_advisor: 'Umutontonkanyi wa AI',
    weather: 'Ukusuba',
    tasks: 'Imilimo',
    inventory: 'Ifintu',
    profile: 'Ubumi Bwandi',
    
    // Common Actions
    welcome: 'Mwaisheni ku ULIMI 2.0',
    add: 'Ongela',
    edit: 'Sinja',
    delete: 'Sula',
    save: 'Sunga',
    cancel: 'Leka',
    search: 'Usha',
    filter: 'Sala',
    view: 'Lola',
    download: 'Tuluka',
    upload: 'Twala',
    
    // Farm Management
    farm_management: 'Ukutungulula Ifamu',
    add_farm: 'Ongela Ifamu',
    farm_name: 'Ishina lya Famu',
    farm_size: 'Ubukulu bwa Famu',
    location: 'Ukwikala',
    soil_type: 'Ubusuma bwa Butaka',
    crops: 'Amakonde',
    
    // Marketplace
    buy_inputs: 'Shita Ifisuma',
    sell_produce: 'Shitisha Amakolola',
    price: 'Indalama',
    quantity: 'Ukubula',
    quality: 'Ukwikala',
    supplier: 'Umushitisha',
    order: 'Tambula',
    
    // AI and Technology
    get_advice: 'Pata Amatontonkanyo ya AI',
    ai_recommendations: 'Amatontonkanyo ya AI',
    crop_optimizer: 'Ukupusanya Amakonde',
    vision_diagnosis: 'Ukumona Ubububa',
    weather_forecast: 'Ukulolela Ukusuba',
    
    // General Terms
    date: 'Ubushiku',
    time: 'Inshita',
    status: 'Ubulanda',
    description: 'Ukufwambana',
    notes: 'Amalemba',
    priority: 'Ifye Ikufwaikwa',
    category: 'Icisuma',
    type: 'Ubusuma',
    
    // Messages
    loading: 'Ukubomba...',
    no_data: 'Tafilapo ifintu',
    error: 'Ificupo fyasanguka',
    success: 'Fyakosa fye bwino',
    confirm_delete: 'Mukashomo ukusulafye ichi?'
  },
  ton: {
    // Navigation
    dashboard: 'Chikombelo',
    farms: 'Masimo Angu',
    marketplace: 'Musika',
    ai_advisor: 'Mulanguzi wa AI',
    weather: 'Mazuba',
    tasks: 'Milimo',
    inventory: 'Zvintu',
    profile: 'Rufungiro Rwangu',
    
    // Common Actions
    welcome: 'Mwabonwa ku ULIMI 2.0',
    add: 'Wedzera',
    edit: 'Chinja',
    delete: 'Bvisa',
    save: 'Chengetedza',
    cancel: 'Rega',
    search: 'Tsvaga',
    filter: 'Sanganisa',
    view: 'Tarisa',
    download: 'Budisa',
    upload: 'Pinza',
    
    // Farm Management
    farm_management: 'Kubamba Musimo',
    add_farm: 'Wedzera Musimo',
    farm_name: 'Zita reMusimo',
    farm_size: 'Ukuru hweMusimo',
    location: 'Nzvimbo',
    soil_type: 'Rudzi rweVhu',
    crops: 'Mbesa',
    
    // Marketplace
    buy_inputs: 'Tenga Zvishandiso',
    sell_produce: 'Tengesa Zvakarimwa',
    price: 'Mutengo',
    quantity: 'Huwandu',
    quality: 'Hunhu',
    supplier: 'Mutengesi',
    order: 'Kuoda',
    
    // AI and Technology
    get_advice: 'Wana Mazano a AI',
    ai_recommendations: 'Mazano a AI',
    crop_optimizer: 'Mukurumbira weMbesa',
    vision_diagnosis: 'Kuona Zvirwere',
    weather_forecast: 'Kufungidzira Mamiriro eKunze',
    
    // General Terms
    date: 'Zuva',
    time: 'Nguva',
    status: 'Mamiriro',
    description: 'Kurondedzera',
    notes: 'Zvinyorwa',
    priority: 'Chakakosha',
    category: 'Boka',
    type: 'Rudzi',
    
    // Messages
    loading: 'Kutakura...',
    no_data: 'Hapana data iripo',
    error: 'Pakaitika dambudziko',
    success: 'Zvakafamba zvakanaka',
    confirm_delete: 'Muri chete chokwadi here kuti munoda kubvisa ichi?'
  },
  loz: {
    // Navigation (Silozi)
    dashboard: 'Litokozo',
    farms: 'Lifamu za ka',
    marketplace: 'Lisupi',
    ai_advisor: 'Mukaululi wa AI',
    weather: 'Mazazi',
    tasks: 'Misebezi',
    inventory: 'Zilimo',
    profile: 'Bulumeli bwa ka',
    
    // Common Actions
    welcome: 'Ni tabile ku ULIMI 2.0',
    add: 'Ekeleza',
    edit: 'Fetolola',
    delete: 'Tusa',
    save: 'Boloka',
    cancel: 'Tuka',
    search: 'Batla',
    filter: 'Keta',
    view: 'Bona',
    download: 'Ntsula',
    upload: 'Kena',
    
    // General Terms
    date: 'Letsatsi',
    time: 'Nako',
    status: 'Makemo',
    description: 'Hlaloso',
    notes: 'Mangolo',
    priority: 'Bohlokoahali',
    category: 'Sehlopha',
    type: 'Lohloho'
  },
  lun: {
    // Navigation (Chilunda)
    dashboard: 'Lupanda',
    farms: 'Masalu etu',
    marketplace: 'Cisalu',
    ai_advisor: 'Mukambi wa AI',
    weather: 'Mvula',
    tasks: 'Milimo',
    inventory: 'Zilimo',
    profile: 'Cilumbu cetu'
  },
  lue: {
    // Navigation (Chiluvale)
    dashboard: 'Kuyendela',
    farms: 'Masalu etu',
    marketplace: 'Luvanda',
    ai_advisor: 'Muvali wa AI',
    weather: 'Mvula',
    tasks: 'Cilimo',
    inventory: 'Zilimo',
    profile: 'Cilumbu cetu'
  },
  lam: {
    // Navigation (Chilamba)
    dashboard: 'Chipinda',
    farms: 'Masalu etu',
    marketplace: 'Cisalu',
    ai_advisor: 'Mulongoxi wa AI',
    weather: 'Mvula',
    tasks: 'Milimo',
    inventory: 'Zilimo',
    profile: 'Cilumbu cetu'
  },
  kau: {
    // Navigation (Chikaonde)
    dashboard: 'Chipinda',
    farms: 'Masalu etu',
    marketplace: 'Cisalu',
    ai_advisor: 'Mutongolaxi wa AI',
    weather: 'Mvula',
    tasks: 'Milimo',
    inventory: 'Zilimo',
    profile: 'Cilumbu cetu'
  }
};

// Additional utility functions for the complete system
export const getCropSeasons = () => {
  return {
    rainy: {
      name: 'Rainy Season',
      months: ['November', 'December', 'January', 'February', 'March', 'April'],
      crops: ['Maize', 'Soybean', 'Groundnuts', 'Cotton', 'Sunflower']
    },
    winter: {
      name: 'Winter Season',
      months: ['May', 'June', 'July', 'August'],
      crops: ['Wheat', 'Barley', 'Vegetables']
    },
    dry: {
      name: 'Dry Season',
      months: ['September', 'October'],
      crops: ['Irrigation crops', 'Vegetables']
    }
  };
};

export const getMarketPrices = () => {
  return {
    maize: { current: 3.5, trend: 'up', change: 0.2 },
    soybean: { current: 8.5, trend: 'stable', change: 0.0 },
    groundnuts: { current: 12.0, trend: 'down', change: -0.5 },
    cotton: { current: 15.0, trend: 'up', change: 1.0 },
    sunflower: { current: 6.5, trend: 'stable', change: 0.1 }
  };
};

export const getWeatherStations = () => {
  return [
    { name: 'Lusaka', coordinates: [-15.3875, 28.3228] },
    { name: 'Kitwe', coordinates: [-12.8024, 28.2132] },
    { name: 'Ndola', coordinates: [-12.9587, 28.6366] },
    { name: 'Livingstone', coordinates: [-17.8419, 25.8544] },
    { name: 'Chipata', coordinates: [-13.6301, 32.6473] }
  ];
};
export const formatCurrency = (amount: number, language: string = 'en'): string => {
  const locale = getLocaleCode(language);
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'ZMW',
    minimumFractionDigits: 2
  }).format(amount);
};

export const formatDate = (date: string, language: string = 'en'): string => {
  const locale = getLocaleCode(language);
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(new Date(date));
};

// Language utility functions
export const getLocaleCode = (language: string): string => {
  const localeCodes: Record<string, string> = {
    en: 'en-ZM',
    ny: 'ny-MW', // Using Malawi as closest for Chinyanja
    bem: 'bem-ZM',
    ton: 'sn-ZW', // Using Shona (Zimbabwe) as closest for Chitonga
    loz: 'loz-ZM',
    lun: 'lun-ZM',
    lue: 'lue-ZM',
    lam: 'lam-ZM',
    kau: 'kau-ZM'
  };
  return localeCodes[language] || 'en-ZM';
};

export const detectUserLanguage = (): string => {
  // Try to get saved language preference
  const savedLanguage = localStorage.getItem('ulimi_language');
  if (savedLanguage && Object.keys(languages).includes(savedLanguage)) {
    return savedLanguage;
  }
  
  // Try to detect from browser language
  const browserLang = navigator.language.toLowerCase();
  
  // Map common browser language codes to our supported languages
  const languageMap: Record<string, string> = {
    'en': 'en',
    'en-us': 'en',
    'en-gb': 'en',
    'ny': 'ny',
    'ny-mw': 'ny',
    'bem': 'bem',
    'bem-zm': 'bem',
    'sn': 'ton', // Shona speakers might prefer Chitonga
    'sn-zw': 'ton'
  };
  
  const detectedLang = languageMap[browserLang] || languageMap[browserLang.split('-')[0]];
  return detectedLang || 'en';
};

export const getLanguageDirection = (language: string): 'ltr' | 'rtl' => {
  // All Zambian languages use left-to-right direction
  return 'ltr';
};

export const formatNumber = (number: number, language: string = 'en'): string => {
  const locale = getLocaleCode(language);
  return new Intl.NumberFormat(locale).format(number);
};

export const getLanguageNativeName = (language: string): string => {
  const nativeNames: Record<string, string> = {
    en: 'English',
    ny: 'ChiNyanja',
    bem: 'ChiBemba',
    ton: 'ChiTonga',
    loz: 'SiLozi',
    lun: 'ChiLunda',
    lue: 'ChiLuvale',
    lam: 'ChiLamba',
    kau: 'ChiKaonde'
  };
  return nativeNames[language] || 'Unknown';
};

// Translation helper function
export const getTranslation = (key: string, language: string = 'en'): string => {
  const langTranslations = translations[language as keyof typeof translations];
  if (langTranslations && langTranslations[key as keyof typeof langTranslations]) {
    return langTranslations[key as keyof typeof langTranslations];
  }
  
  // Fallback to English if translation not found
  const englishTranslations = translations.en;
  return englishTranslations[key as keyof typeof englishTranslations] || key;
};

// Regional data with language preferences
export const getRegionalLanguagePreferences = () => {
  return {
    'Central': ['bem', 'ny', 'en'],
    'Copperbelt': ['bem', 'en', 'ny'],
    'Eastern': ['ny', 'en', 'bem'],
    'Luapula': ['bem', 'en', 'ny'],
    'Lusaka': ['en', 'ny', 'bem'],
    'Muchinga': ['bem', 'ny', 'en'],
    'Northern': ['bem', 'en', 'ny'],
    'North-Western': ['lun', 'lue', 'kau', 'en'],
    'Southern': ['ton', 'en', 'ny'],
    'Western': ['loz', 'en', 'ton']
  };
};

// Audio pronunciation helpers (for future implementation)
export const getAudioPronunciation = (text: string, language: string): string | null => {
  // This would integrate with a text-to-speech service in the future
  // For now, return null to indicate no audio available
  return null;
};

// Date and time formatting for local languages
export const formatDateLocal = (date: string, language: string = 'en'): string => {
  const dateObj = new Date(date);
  
  if (language === 'en') {
    return formatDate(date, language);
  }
  
  // For local languages, provide basic day/month/year format
  const day = dateObj.getDate();
  const month = dateObj.getMonth() + 1;
  const year = dateObj.getFullYear();
  
  return `${day}/${month}/${year}`;
};

// Currency formatting with local language number systems
export const formatCurrencyLocal = (amount: number, language: string = 'en'): string => {
  if (language === 'en') {
    return formatCurrency(amount, language);
  }
  
  // For local languages, use basic format with ZMW
  const formattedAmount = formatNumber(amount, language);
  return `ZMW ${formattedAmount}`;
};