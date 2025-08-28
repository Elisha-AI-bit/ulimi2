export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  username?: string;
  role: 'admin' | 'farmer' | 'customer' | 'ussd_user';
  location: {
    province: string;
    district: string;
    coordinates?: [number, number];
  };
  language: 'en' | 'ny' | 'bem' | 'ton';
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  permissions?: Permission[];
}

// RBAC Permission System
export type Permission = 
  // Admin permissions
  | 'manage_users'
  | 'configure_system'
  | 'view_analytics'
  | 'view_reports'
  
  // Farmer permissions
  | 'manage_farm_profile'
  | 'add_products'
  | 'update_products'
  | 'receive_soil_advice'
  | 'receive_plant_advice'
  
  // Customer permissions
  | 'browse_marketplace'
  | 'place_orders'
  | 'make_payments'
  | 'track_orders'
  | 'track_deliveries'
  | 'rate_products'
  | 'review_products'
  
  // Universal permissions
  | 'receive_notifications'
  | 'update_profile'
  | 'view_weather';

export interface Role {
  id: string;
  name: 'admin' | 'farmer' | 'customer' | 'ussd_user';
  displayName: string;
  description: string;
  permissions: Permission[];
  isActive: boolean;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  permissions: Permission[];
}

export interface LoginCredentials {
  identifier: string; // Can be email, phone, or username
  password: string;
  loginType: 'email' | 'phone' | 'username';
}

export interface USSDCredentials {
  phone: string;
  pin: string;
}

export interface RegisterData {
  name: string;
  email: string;
  phone: string;
  username?: string;
  password: string;
  confirmPassword: string;
  role: 'farmer' | 'customer';
  province: string;
  district: string;
  language: 'en' | 'ny' | 'bem' | 'ton';
}

export interface AdminStats {
  totalUsers: number;
  totalFarmers: number;
  totalCustomers: number;
  totalFarms: number;
  totalMarketplaceItems: number;
  totalRevenue: number;
}

export interface CustomerOrder {
  id: string;
  customerId: string;
  items: MarketplaceItem[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  deliveryAddress: string;
  orderDate: string;
  deliveryDate?: string;
  paymentMethod?: 'mobile_money' | 'bank_transfer' | 'cash_on_delivery';
  paymentStatus?: 'pending' | 'processing' | 'completed' | 'failed';
  deliveryDetails?: {
    fullName: string;
    phone: string;
    address: string;
    district: string;
    province: string;
    specialInstructions?: string;
  };
  paymentDetails?: {
    mobileNumber?: string;
    bankAccount?: string;
    bankName?: string;
  };
}

export interface Farm {
  id: string;
  farmerId: string;
  name: string;
  size: number; // in hectares
  location: {
    province: string;
    district: string;
    coordinates: [number, number];
  };
  soilType: string;
  crops: Crop[];
  createdAt: string;
}

export interface Crop {
  id: string;
  farmId: string;
  name: string;
  variety: string;
  plantingDate: string;
  expectedHarvestDate: string;
  area: number; // in hectares
  status: 'planned' | 'planted' | 'growing' | 'harvested';
  tasks: Task[];
  inventory: InventoryItem[];
}

export interface Task {
  id: string;
  farmId: string;
  cropId?: string;
  equipmentId?: string;
  fieldId?: string;
  title: string;
  description: string;
  type: 'planting' | 'irrigation' | 'fertilizing' | 'pest_control' | 'harvesting' | 'maintenance' | 'monitoring' | 'marketing' | 'other';
  category: 'routine' | 'seasonal' | 'emergency' | 'maintenance' | 'harvest' | 'planning';
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled' | 'overdue';
  dueDate: string;
  startDate?: string;
  completedDate?: string;
  estimatedDuration: number; // hours
  actualDuration?: number; // hours
  assignedTo: string[];
  createdBy: string;
  supervisedBy?: string;
  dependencies: string[]; // task IDs that must be completed first
  resourceRequirements: TaskResource[];
  weatherDependent: boolean;
  weatherConditions?: WeatherRequirement[];
  recurring: boolean;
  recurrencePattern?: RecurrencePattern;
  cost: {
    estimated: number;
    actual?: number;
    currency: 'ZMW';
  };
  location: {
    fieldName?: string;
    coordinates?: [number, number];
    area?: string;
  };
  attachments: string[];
  notes: string;
  qualityChecks: QualityCheck[];
  safetyRequirements: string[];
  completionCriteria: string[];
  progressUpdates: TaskProgress[];
  relatedTasks: string[]; // IDs of related tasks
  createdAt: string;
  updatedAt?: string;
}

export interface TaskResource {
  type: 'labor' | 'equipment' | 'input' | 'vehicle' | 'tool';
  resourceId?: string;
  name: string;
  quantity: number;
  unit: string;
  costPerUnit?: number;
  availability: 'available' | 'reserved' | 'unavailable';
  required: boolean;
}

export interface WeatherRequirement {
  parameter: 'temperature' | 'humidity' | 'wind_speed' | 'rainfall' | 'conditions';
  condition: 'min' | 'max' | 'exact' | 'range';
  value: number | string;
  rangeMin?: number;
  rangeMax?: number;
}

export interface RecurrencePattern {
  type: 'daily' | 'weekly' | 'monthly' | 'seasonal' | 'yearly' | 'custom';
  interval: number; // every X days/weeks/months
  daysOfWeek?: number[]; // 0-6, Sunday = 0
  dayOfMonth?: number;
  monthOfYear?: number;
  endDate?: string;
  maxOccurrences?: number;
  customPattern?: string;
}

export interface QualityCheck {
  id: string;
  description: string;
  criteria: string;
  required: boolean;
  completed: boolean;
  completedBy?: string;
  completedAt?: string;
  result?: 'pass' | 'fail' | 'partial';
  notes?: string;
}

export interface TaskProgress {
  id: string;
  timestamp: string;
  progressPercentage: number;
  description: string;
  updatedBy: string;
  issues?: string[];
  photos?: string[];
  location?: [number, number];
}

// Task Templates for common farming activities
export interface TaskTemplate {
  id: string;
  name: string;
  category: string;
  type: string;
  description: string;
  estimatedDuration: number;
  resourceRequirements: TaskResource[];
  qualityChecks: Omit<QualityCheck, 'id' | 'completed' | 'completedBy' | 'completedAt' | 'result'>[];
  safetyRequirements: string[];
  completionCriteria: string[];
  weatherRequirements?: WeatherRequirement[];
  seasonalTiming: string[];
  applicableCrops: string[];
  skillLevel: 'beginner' | 'intermediate' | 'advanced';
  createdAt: string;
}

// Enhanced Task Scheduling
export interface TaskSchedule {
  id: string;
  farmId: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  tasks: ScheduledTask[];
  assignedTeams: TeamAssignment[];
  totalEstimatedCost: number;
  status: 'draft' | 'approved' | 'active' | 'completed' | 'cancelled';
  createdBy: string;
  approvedBy?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface ScheduledTask {
  taskId: string;
  scheduledDate: string;
  scheduledTime?: string;
  duration: number;
  assignedTo: string[];
  priority: number;
  dependencies: string[];
}

export interface TeamAssignment {
  teamId: string;
  teamName: string;
  members: TeamMember[];
  schedule: {
    startDate: string;
    endDate: string;
    workingHours: {
      start: string;
      end: string;
    };
    workingDays: number[];
  };
  responsibilities: string[];
  supervisor: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  skills: string[];
  experience: 'novice' | 'experienced' | 'expert';
  availability: {
    [date: string]: {
      available: boolean;
      hours?: number;
      notes?: string;
    };
  };
  hourlyRate?: number;
  contact: {
    phone?: string;
    email?: string;
  };
}

// Enhanced Inventory Management System
export interface InventoryItem {
  id: string;
  farmId: string;
  category: 'inputs' | 'equipment' | 'tools' | 'consumables' | 'produce' | 'parts' | 'safety' | 'office';
  subcategory: string;
  name: string;
  description?: string;
  brand?: string;
  model?: string;
  barcode?: string;
  sku?: string;
  quantity: {
    current: number;
    reserved: number;
    available: number;
    unit: string;
    minimumStock: number;
    maximumStock?: number;
  };
  cost: {
    unitCost: number;
    totalValue: number;
    currency: 'ZMW';
    lastPurchasePrice?: number;
    averageCost?: number;
  };
  supplier: {
    id?: string;
    name?: string;
    contact?: string;
    email?: string;
    address?: string;
  };
  location: {
    warehouse?: string;
    section?: string;
    shelf?: string;
    coordinates?: [number, number];
  };
  dates: {
    purchaseDate: string;
    expiryDate?: string;
    lastUsed?: string;
    nextMaintenanceDate?: string;
  };
  condition: 'new' | 'good' | 'fair' | 'poor' | 'damaged' | 'expired';
  status: 'active' | 'inactive' | 'reserved' | 'damaged' | 'expired' | 'disposed';
  tracking: {
    serialNumbers?: string[];
    batchNumbers?: string[];
    warrantyInfo?: WarrantyInfo;
    maintenanceHistory?: MaintenanceRecord[];
  };
  usage: {
    applicableCrops?: string[];
    applicationRate?: number;
    applicationUnit?: string;
    safetyInstructions?: string[];
    storageRequirements?: string[];
  };
  alerts: InventoryAlert[];
  transactions: InventoryTransaction[];
  tags: string[];
  photos: string[];
  documents: string[];
  notes?: string;
  createdBy: string;
  createdAt: string;
  updatedAt?: string;
}

export interface WarrantyInfo {
  provider: string;
  startDate: string;
  endDate: string;
  coverage: string[];
  claimProcess?: string;
  contact?: string;
}

export interface MaintenanceRecord {
  id: string;
  date: string;
  type: 'routine' | 'repair' | 'calibration' | 'cleaning';
  description: string;
  performedBy: string;
  cost?: number;
  partsUsed?: string[];
  nextMaintenanceDate?: string;
  notes?: string;
}

export interface InventoryAlert {
  id: string;
  type: 'low_stock' | 'expiry_warning' | 'maintenance_due' | 'quality_issue' | 'other';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  triggeredDate: string;
  resolvedDate?: string;
  resolvedBy?: string;
  actions: string[];
  status: 'active' | 'acknowledged' | 'resolved' | 'dismissed';
}

export interface InventoryTransaction {
  id: string;
  itemId: string;
  type: 'purchase' | 'usage' | 'transfer' | 'adjustment' | 'disposal' | 'return';
  quantity: number;
  unit: string;
  reason: string;
  reference?: string; // Purchase order, task ID, etc.
  fromLocation?: string;
  toLocation?: string;
  cost?: number;
  performedBy: string;
  approvedBy?: string;
  date: string;
  relatedDocuments?: string[];
  notes?: string;
}

// Inventory Categories and Classifications
export interface InventoryCategory {
  id: string;
  name: string;
  description: string;
  subcategories: InventorySubcategory[];
  trackingRequirements: TrackingRequirement[];
  storageRequirements: string[];
  safetyRequirements: string[];
  complianceRequirements?: string[];
  defaultUnits: string[];
  allowedLocations: string[];
}

export interface InventorySubcategory {
  id: string;
  name: string;
  description?: string;
  properties: CategoryProperty[];
  expiryTracking: boolean;
  serialTracking: boolean;
  batchTracking: boolean;
  maintenanceTracking: boolean;
}

export interface CategoryProperty {
  name: string;
  type: 'text' | 'number' | 'date' | 'boolean' | 'select';
  required: boolean;
  options?: string[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
}

export interface TrackingRequirement {
  type: 'quantity' | 'location' | 'condition' | 'usage' | 'maintenance' | 'expiry';
  mandatory: boolean;
  alertThresholds?: {
    warning: number;
    critical: number;
  };
  reportingFrequency?: 'daily' | 'weekly' | 'monthly' | 'as_needed';
}

// Inventory Reporting and Analytics
export interface InventoryReport {
  id: string;
  farmId: string;
  type: 'stock_levels' | 'usage_analysis' | 'cost_analysis' | 'expiry_report' | 'movement_report' | 'valuation';
  title: string;
  description?: string;
  filters: {
    categories?: string[];
    dateRange: {
      startDate: string;
      endDate: string;
    };
    locations?: string[];
    conditions?: string[];
    statuses?: string[];
  };
  data: any;
  summary: {
    totalItems: number;
    totalValue: number;
    alertCount: number;
    lowStockItems: number;
    expiringItems: number;
  };
  generatedBy: string;
  generatedAt: string;
  format: 'pdf' | 'excel' | 'csv' | 'json';
  scheduledReport?: {
    frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
    recipients: string[];
    nextRun: string;
  };
}

// Purchase Management
export interface PurchaseOrder {
  id: string;
  farmId: string;
  poNumber: string;
  supplier: {
    id: string;
    name: string;
    contact: string;
    address: string;
  };
  items: PurchaseOrderItem[];
  totals: {
    subtotal: number;
    tax: number;
    shipping: number;
    total: number;
    currency: 'ZMW';
  };
  status: 'draft' | 'submitted' | 'approved' | 'ordered' | 'partial_received' | 'received' | 'completed' | 'cancelled';
  dates: {
    created: string;
    submitted?: string;
    approved?: string;
    expectedDelivery?: string;
    actualDelivery?: string;
  };
  deliveryAddress: string;
  paymentTerms: string;
  notes?: string;
  approvals: {
    requestedBy: string;
    approvedBy?: string;
    approvalDate?: string;
    comments?: string;
  };
  documents: string[];
  createdAt: string;
  updatedAt?: string;
}

export interface PurchaseOrderItem {
  id: string;
  inventoryItemId?: string;
  name: string;
  description?: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalPrice: number;
  expectedDeliveryDate?: string;
  receivedQuantity?: number;
  receivedDate?: string;
  qualityStatus?: 'pending' | 'approved' | 'rejected';
  notes?: string;
}

// Supplier Management
export interface Supplier {
  id: string;
  name: string;
  type: 'inputs' | 'equipment' | 'services' | 'general';
  contact: {
    primaryContact: string;
    phone: string;
    email?: string;
    website?: string;
  };
  address: {
    street: string;
    city: string;
    province: string;
    postalCode?: string;
    country: string;
  };
  businessInfo: {
    registrationNumber?: string;
    taxNumber?: string;
    certification?: string[];
    paymentTerms: string;
    creditLimit?: number;
  };
  products: SupplierProduct[];
  performance: {
    rating: number;
    totalOrders: number;
    onTimeDelivery: number;
    qualityScore: number;
    lastOrderDate?: string;
  };
  contracts: {
    active: boolean;
    startDate?: string;
    endDate?: string;
    terms?: string;
  };
  notes?: string;
  tags: string[];
  createdAt: string;
  updatedAt?: string;
}

export interface SupplierProduct {
  id: string;
  name: string;
  category: string;
  description?: string;
  specifications?: Record<string, any>;
  pricing: {
    unitPrice: number;
    unit: string;
    minimumOrder?: number;
    bulkDiscounts?: BulkDiscount[];
    currency: 'ZMW';
  };
  availability: {
    inStock: boolean;
    leadTime: number; // days
    minimumOrder: number;
  };
  quality: {
    certifications?: string[];
    qualityGrade?: string;
    specifications?: Record<string, any>;
  };
  lastUpdated: string;
}

export interface BulkDiscount {
  minimumQuantity: number;
  discountPercentage: number;
  validUntil?: string;
}

export interface MarketplaceItem {
  id: string;
  sellerId: string;
  sellerName: string;
  name: string;
  category: 'inputs' | 'produce';
  type: string;
  description: string;
  price: number;
  currency: 'ZMW';
  quantity: number;
  unit: string;
  location: {
    province: string;
    district: string;
  };
  images: string[];
  status: 'available' | 'sold' | 'reserved';
  createdAt: string;
}

export interface WeatherData {
  date: string;
  temperature: {
    min: number;
    max: number;
  };
  humidity: number;
  rainfall: number;
  windSpeed: number;
  conditions: string;
}

export interface AIRecommendation {
  id: string;
  type: 'crop_plan' | 'input_recommendation' | 'yield_forecast' | 'price_prediction' | 'pest_disease';
  title: string;
  description: string;
  confidence: number;
  data: any;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  language: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  read: boolean;
  createdAt: string;
}

export interface SecurityLog {
  id: string;
  userId: string;
  action: 'login' | 'logout' | 'failed_login' | 'permission_denied' | 'role_change';
  details: string;
  ipAddress?: string;
  userAgent?: string;
  timestamp: string;
}

export interface AccessAttempt {
  id: string;
  identifier: string;
  success: boolean;
  failureReason?: string;
  ipAddress?: string;
  timestamp: string;
}

// Comprehensive Farm Management System Types

// Crop Planning & Management
export interface CropPlan {
  id: string;
  farmId: string;
  season: string;
  year: number;
  crops: PlannedCrop[];
  totalArea: number;
  rotationStrategy: string;
  expectedRevenue: number;
  expectedCosts: number;
  profitMargin: number;
  status: 'draft' | 'approved' | 'active' | 'completed';
  createdAt: string;
  updatedAt?: string;
}

export interface PlannedCrop {
  id: string;
  cropId: string;
  name: string;
  variety: string;
  area: number;
  plantingDate: string;
  harvestDate: string;
  expectedYield: number;
  marketPrice: number;
  inputCosts: number;
  profitability: number;
  riskLevel: 'low' | 'medium' | 'high';
  soilRequirements: string[];
  climateRequirements: string[];
}

export interface CropRotation {
  id: string;
  farmId: string;
  name: string;
  duration: number; // years
  sequence: CropRotationStep[];
  benefits: string[];
  requirements: string[];
  suitableSoilTypes: string[];
  createdAt: string;
}

export interface CropRotationStep {
  year: number;
  season: string;
  cropName: string;
  purpose: 'cash_crop' | 'cover_crop' | 'nitrogen_fixing' | 'soil_improvement';
  benefits: string[];
}

// Equipment Management
export interface Equipment {
  id: string;
  farmId: string;
  name: string;
  type: 'tractor' | 'plow' | 'harvester' | 'sprayer' | 'irrigation' | 'other';
  model: string;
  manufacturer: string;
  purchaseDate: string;
  purchasePrice: number;
  currentValue: number;
  status: 'active' | 'maintenance' | 'repair' | 'retired';
  location: string;
  operatingHours: number;
  fuelType?: string;
  specifications: Record<string, any>;
  maintenanceSchedule: MaintenanceSchedule[];
  repairHistory: RepairRecord[];
  createdAt: string;
  updatedAt?: string;
}

export interface MaintenanceSchedule {
  id: string;
  equipmentId: string;
  type: 'routine' | 'preventive' | 'seasonal';
  description: string;
  frequency: number; // hours or days
  frequencyType: 'hours' | 'days' | 'months';
  lastPerformed?: string;
  nextDue: string;
  estimatedCost: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
  assignedTo?: string;
  status: 'scheduled' | 'overdue' | 'completed' | 'skipped';
}

export interface RepairRecord {
  id: string;
  equipmentId: string;
  date: string;
  description: string;
  cost: number;
  partsReplaced: string[];
  laborHours: number;
  performedBy: string;
  warranty?: string;
  status: 'completed' | 'pending' | 'failed';
}

// Irrigation Management
export interface IrrigationSystem {
  id: string;
  farmId: string;
  name: string;
  type: 'drip' | 'sprinkler' | 'flood' | 'center_pivot' | 'furrow';
  coverage: number; // hectares
  zones: IrrigationZone[];
  efficiency: number; // percentage
  waterSource: string;
  pumpCapacity: number; // liters per hour
  status: 'active' | 'maintenance' | 'inactive';
  installationDate: string;
  lastMaintenance?: string;
  nextMaintenance: string;
  createdAt: string;
}

export interface IrrigationZone {
  id: string;
  systemId: string;
  name: string;
  area: number;
  cropType: string;
  soilType: string;
  waterRequirement: number; // mm per day
  sensors: IoTSensor[];
  schedule: IrrigationSchedule[];
  status: 'active' | 'inactive' | 'maintenance';
}

export interface IrrigationSchedule {
  id: string;
  zoneId: string;
  startTime: string;
  duration: number; // minutes
  frequency: string; // daily, weekly, etc.
  waterAmount: number; // liters
  status: 'scheduled' | 'active' | 'completed' | 'cancelled';
  triggeredBy: 'schedule' | 'sensor' | 'manual' | 'weather';
  createdAt: string;
}

// Scouting & Monitoring
export interface ScoutingReport {
  id: string;
  farmId: string;
  cropId: string;
  scoutedBy: string;
  date: string;
  location: {
    fieldName: string;
    coordinates?: [number, number];
    area: string;
  };
  observations: ScoutingObservation[];
  overallHealth: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
  recommendations: string[];
  urgentActions: string[];
  photos: string[];
  weatherConditions: {
    temperature: number;
    humidity: number;
    windSpeed: number;
    conditions: string;
  };
  nextScoutingDate: string;
  status: 'draft' | 'submitted' | 'reviewed' | 'actioned';
  createdAt: string;
}

export interface ScoutingObservation {
  id: string;
  category: 'pest' | 'disease' | 'weed' | 'nutrition' | 'growth' | 'irrigation' | 'other';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  affected_area: number; // percentage
  pest_species?: string;
  disease_type?: string;
  weed_species?: string;
  deficiency_type?: string;
  immediate_action: boolean;
  estimated_loss?: number; // percentage
  photos: string[];
  gps_coordinates?: [number, number];
}

export interface FieldMap {
  id: string;
  farmId: string;
  name: string;
  boundaries: [number, number][]; // polygon coordinates
  area: number;
  soilType: string;
  elevationData?: number[];
  drainageMap?: string;
  zones: FieldZone[];
  createdAt: string;
  updatedAt?: string;
}

export interface FieldZone {
  id: string;
  fieldId: string;
  name: string;
  boundaries: [number, number][];
  area: number;
  soilCharacteristics: {
    ph: number;
    organic_matter: number;
    nitrogen: number;
    phosphorus: number;
    potassium: number;
    texture: string;
  };
  crop_history: string[];
  productivity_index: number;
  special_notes: string;
}

// Harvest Management
export interface HarvestPlan {
  id: string;
  farmId: string;
  cropId: string;
  plannedStartDate: string;
  plannedEndDate: string;
  estimatedYield: number;
  harvestMethod: 'manual' | 'mechanical' | 'combined';
  equipmentNeeded: string[];
  laborRequired: number;
  storageArranged: boolean;
  marketingPlan: string;
  qualityTargets: QualityTarget[];
  logisticsArrangements: string[];
  status: 'planned' | 'active' | 'completed' | 'delayed';
  createdAt: string;
}

export interface HarvestRecord {
  id: string;
  harvestPlanId: string;
  farmId: string;
  cropId: string;
  date: string;
  area_harvested: number;
  quantity_harvested: number;
  quality_grade: string;
  moisture_content?: number;
  foreign_matter?: number;
  broken_grains?: number;
  market_price: number;
  storage_location: string;
  harvested_by: string[];
  equipment_used: string[];
  weather_conditions: string;
  yield_per_hectare: number;
  total_revenue: number;
  harvest_costs: number;
  profit_margin: number;
  quality_assessment: QualityAssessment;
  photos: string[];
  notes: string;
  createdAt: string;
}

export interface QualityTarget {
  parameter: string;
  target_min?: number;
  target_max?: number;
  target_value?: string;
  unit: string;
  importance: 'critical' | 'important' | 'desired';
}

export interface QualityAssessment {
  overall_grade: string;
  parameters: {
    parameter: string;
    value: number | string;
    unit: string;
    meets_target: boolean;
  }[];
  market_acceptability: 'excellent' | 'good' | 'acceptable' | 'poor';
  price_impact: number; // percentage
  storage_recommendation: string;
  processing_suitability: string[];
}

// Enhanced AI & Decision Support
export interface YieldForecast {
  id: string;
  farmId: string;
  cropId: string;
  forecast_date: string;
  harvest_date: string;
  predicted_yield: number;
  confidence_level: number;
  yield_range: {
    min: number;
    max: number;
  };
  factors_considered: string[];
  weather_impact: number;
  soil_impact: number;
  management_impact: number;
  historical_comparison: number;
  methodology: string;
  created_at: string;
}

export interface PestDiseaseAlert {
  id: string;
  farmId: string;
  cropId?: string;
  pest_species?: string;
  disease_type?: string;
  risk_level: 'low' | 'medium' | 'high' | 'critical';
  probability: number;
  detection_method: 'ai_vision' | 'sensor' | 'manual' | 'model_prediction';
  symptoms: string[];
  recommended_actions: string[];
  treatment_options: TreatmentOption[];
  economic_threshold: number;
  weather_conditions: any;
  location_data: {
    field_name: string;
    coordinates?: [number, number];
    affected_area?: number;
  };
  confidence_score: number;
  created_at: string;
  status: 'active' | 'monitoring' | 'treated' | 'resolved';
}

export interface TreatmentOption {
  id: string;
  name: string;
  type: 'chemical' | 'biological' | 'cultural' | 'integrated';
  active_ingredients?: string[];
  application_method: string;
  dosage: string;
  timing: string;
  cost_estimate: number;
  effectiveness: number;
  environmental_impact: 'low' | 'medium' | 'high';
  safety_requirements: string[];
  resistance_risk: 'low' | 'medium' | 'high';
  organic_approved: boolean;
}

export interface MarketPrediction {
  id: string;
  commodity: string;
  prediction_date: string;
  forecast_period: string; // "1_month", "3_months", "6_months"
  current_price: number;
  predicted_price: number;
  price_trend: 'increasing' | 'decreasing' | 'stable';
  confidence_level: number;
  price_range: {
    min: number;
    max: number;
  };
  factors_affecting: string[];
  regional_variations: RegionalPrice[];
  seasonal_patterns: SeasonalPattern[];
  recommendations: string[];
  created_at: string;
}

export interface RegionalPrice {
  province: string;
  district?: string;
  current_price: number;
  predicted_price: number;
  price_differential: number;
}

export interface SeasonalPattern {
  month: string;
  average_price: number;
  price_volatility: number;
  supply_level: 'low' | 'medium' | 'high';
  demand_level: 'low' | 'medium' | 'high';
}

// Data Integration Types
export interface WeatherForecast {
  id: string;
  location: {
    province: string;
    district: string;
    coordinates: [number, number];
  };
  forecast_date: string;
  daily_forecasts: DailyForecast[];
  alerts: WeatherAlert[];
  agricultural_insights: string[];
  created_at: string;
}

export interface DailyForecast {
  date: string;
  temperature: {
    min: number;
    max: number;
    avg: number;
  };
  humidity: {
    min: number;
    max: number;
    avg: number;
  };
  precipitation: {
    probability: number;
    amount: number;
    type: 'rain' | 'drizzle' | 'storm';
  };
  wind: {
    speed: number;
    direction: string;
    gusts?: number;
  };
  uv_index: number;
  conditions: string;
  farming_suitability: {
    planting: 'excellent' | 'good' | 'fair' | 'poor';
    spraying: 'excellent' | 'good' | 'fair' | 'poor';
    harvesting: 'excellent' | 'good' | 'fair' | 'poor';
    irrigation: 'needed' | 'optional' | 'not_needed';
  };
}

export interface WeatherAlert {
  id: string;
  type: 'frost' | 'drought' | 'flood' | 'hail' | 'wind' | 'heat';
  severity: 'watch' | 'warning' | 'advisory';
  start_date: string;
  end_date: string;
  description: string;
  farming_impact: string;
  recommended_actions: string[];
}

export interface SatelliteData {
  id: string;
  farmId: string;
  fieldId?: string;
  capture_date: string;
  satellite_source: string;
  resolution: number; // meters
  bands_available: string[];
  ndvi_data: NDVIData;
  vegetation_analysis: VegetationAnalysis;
  anomaly_detection: AnomalyDetection[];
  recommendations: string[];
  created_at: string;
}

export interface NDVIData {
  average_ndvi: number;
  min_ndvi: number;
  max_ndvi: number;
  ndvi_zones: NDVIZone[];
  health_classification: 'excellent' | 'good' | 'moderate' | 'poor' | 'very_poor';
  comparison_previous: number;
  trend: 'improving' | 'stable' | 'declining';
}

export interface NDVIZone {
  zone_id: string;
  coordinates: [number, number][];
  average_ndvi: number;
  area: number;
  health_status: string;
  recommendations: string[];
}

export interface VegetationAnalysis {
  coverage_percentage: number;
  growth_stage: string;
  biomass_estimate: number;
  stress_indicators: string[];
  uniformity_index: number;
  canopy_cover: number;
}

export interface AnomalyDetection {
  type: 'pest_damage' | 'disease' | 'nutrient_deficiency' | 'water_stress' | 'equipment_damage';
  location: [number, number][];
  severity: 'low' | 'medium' | 'high';
  confidence: number;
  area_affected: number;
  description: string;
  recommended_investigation: string[];
}

export interface IoTSensor {
  id: string;
  farmId: string;
  fieldId?: string;
  name: string;
  type: 'soil_moisture' | 'temperature' | 'humidity' | 'ph' | 'light' | 'wind' | 'rain' | 'leaf_wetness';
  location: {
    coordinates: [number, number];
    depth?: number; // for soil sensors
    height?: number; // for air sensors
  };
  status: 'active' | 'inactive' | 'maintenance' | 'error';
  battery_level?: number;
  last_reading: string;
  reading_frequency: number; // minutes
  calibration_date: string;
  next_calibration: string;
  readings: SensorReading[];
  thresholds: SensorThreshold[];
  created_at: string;
}

export interface SensorReading {
  timestamp: string;
  value: number;
  unit: string;
  quality: 'good' | 'questionable' | 'bad';
  alert_triggered?: boolean;
}

export interface SensorThreshold {
  parameter: string;
  min_value?: number;
  max_value?: number;
  alert_type: 'low' | 'high' | 'critical_low' | 'critical_high';
  action_required: string;
  notification_method: 'app' | 'sms' | 'email';
}

export interface RegulatoryData {
  id: string;
  type: 'pesticide_limits' | 'organic_standards' | 'export_requirements' | 'safety_regulations';
  crop_type?: string;
  region: string;
  regulations: Regulation[];
  compliance_checklist: ComplianceItem[];
  last_updated: string;
  source: string;
}

export interface Regulation {
  id: string;
  title: string;
  description: string;
  requirements: string[];
  penalties: string[];
  compliance_deadline?: string;
  affected_operations: string[];
}

export interface ComplianceItem {
  requirement: string;
  status: 'compliant' | 'non_compliant' | 'pending' | 'not_applicable';
  evidence_required: string[];
  deadline?: string;
  responsible_party: string;
  notes?: string;
}

// Enhanced AI Capabilities
export interface CropOptimization {
  id: string;
  farmId: string;
  optimization_type: 'rotation' | 'variety_selection' | 'planting_schedule' | 'resource_allocation';
  current_plan: any;
  optimized_plan: any;
  improvement_metrics: {
    yield_increase: number;
    cost_reduction: number;
    risk_reduction: number;
    sustainability_score: number;
  };
  confidence_level: number;
  implementation_steps: string[];
  potential_challenges: string[];
  created_at: string;
}

export interface InputRecommendation {
  id: string;
  farmId: string;
  cropId: string;
  input_type: 'fertilizer' | 'pesticide' | 'seed' | 'water';
  product_name: string;
  application_rate: number;
  application_timing: string[];
  application_method: string;
  cost_estimate: number;
  expected_benefit: string;
  risk_assessment: {
    environmental_risk: 'low' | 'medium' | 'high';
    resistance_risk: 'low' | 'medium' | 'high';
    economic_risk: 'low' | 'medium' | 'high';
  };
  safety_precautions: string[];
  alternatives: AlternativeInput[];
  confidence_score: number;
  created_at: string;
}

export interface AlternativeInput {
  product_name: string;
  application_rate: number;
  cost_estimate: number;
  effectiveness: number;
  environmental_impact: 'low' | 'medium' | 'high';
  organic_approved: boolean;
}

export interface VisionDiagnosis {
  id: string;
  farmId: string;
  image_url: string;
  analysis_date: string;
  detected_issues: DetectedIssue[];
  plant_health_score: number;
  growth_stage: string;
  recommendations: string[];
  confidence_metrics: {
    overall_confidence: number;
    detection_accuracy: number;
    classification_confidence: number;
  };
  processing_time: number;
  model_version: string;
  created_at: string;
}

export interface DetectedIssue {
  type: 'pest' | 'disease' | 'nutrient_deficiency' | 'water_stress' | 'physical_damage';
  species?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  location: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  description: string;
  treatment_options: string[];
  urgency: 'immediate' | 'within_week' | 'within_month' | 'monitor';
}

// System Enhancement Types
export interface OfflineSync {
  id: string;
  operation_type: string;
  data: any;
  timestamp: string;
  status: 'pending' | 'syncing' | 'completed' | 'failed';
  retry_count: number;
  error_message?: string;
}

export interface LanguageSupport {
  code: string;
  name: string;
  native_name: string;
  supported_features: string[];
  translation_completeness: number;
  voice_support: boolean;
  text_direction: 'ltr' | 'rtl';
}

export interface MobileOptimization {
  screen_size: 'small' | 'medium' | 'large';
  orientation: 'portrait' | 'landscape';
  touch_optimized: boolean;
  offline_capable: boolean;
  data_usage: 'low' | 'medium' | 'high';
  performance_metrics: {
    load_time: number;
    responsiveness: number;
    battery_usage: 'low' | 'medium' | 'high';
  };
}