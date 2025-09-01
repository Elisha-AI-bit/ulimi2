import { supabase } from './supabaseClient'
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

// Supabase Data Service
export class SupabaseDataService {
  // User operations
  static async getUser(userId: string): Promise<User | null> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) throw error
      return data as User
    } catch (error) {
      console.error('Error fetching user:', error)
      return null
    }
  }

  static async createUser(user: Omit<User, 'id' | 'createdAt' | 'lastLogin'>): Promise<User | null> {
    try {
      console.log('Creating user in app database:', user);
      
      // Get the current authenticated user to get their ID
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
      
      if (authError) {
        console.error('Error getting authenticated user:', authError);
        return null;
      }
      
      if (!authUser) {
        console.error('No authenticated user found');
        return null;
      }
      
      console.log('Authenticated user:', authUser);
      
      // Check if user already exists
      const { data: existingUser, error: existingUserError } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single();
      
      if (existingUser) {
        console.log('User already exists in database:', existingUser);
        return existingUser as User;
      }
      
      if (existingUserError && existingUserError.code !== 'PGRST116') {
        console.error('Error checking for existing user:', existingUserError);
      }
      
      // Create the user record with the authenticated user's ID
      // Map the User interface fields to the database column names
      const userWithId = {
        id: authUser.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        username: user.username,
        role: user.role,
        province: user.location.province,
        district: user.location.district,
        coordinates: user.location.coordinates,
        language: user.language,
        is_active: user.isActive,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        last_login: new Date().toISOString()
      };
      
      console.log('Inserting user with data:', userWithId);
      
      const { data, error } = await supabase
        .from('users')
        .insert([userWithId])
        .select()
        .single()

      if (error) {
        console.error('Error creating user in app database:', error);
        // If it's a permission error, try to bypass RLS by using admin privileges
        if (error.code === '42501') { // Insufficient privileges
          console.log('Attempting to create user with admin privileges');
          // This would require admin privileges which we don't have in the frontend
          // For now, we'll just return null and let the registration continue
          return null;
        }
        throw error;
      }
      
      console.log('User created successfully:', data);
      // Map the database fields back to the User interface
      return {
        id: data.id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        username: data.username,
        role: data.role,
        location: {
          province: data.province,
          district: data.district,
          coordinates: data.coordinates
        },
        language: data.language,
        isActive: data.is_active,
        createdAt: data.created_at,
        lastLogin: data.last_login
      } as User
    } catch (error) {
      console.error('Error creating user:', error)
      return null
    }
  }

  static async updateUser(userId: string, updates: Partial<User>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', userId)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error updating user:', error)
      return false
    }
  }

  // Farm operations
  static async getFarms(userId: string): Promise<Farm[]> {
    try {
      // Check if userId is valid
      if (!userId) {
        console.warn('No user ID provided for fetching farms')
        return []
      }

      // First get the farms
      const { data: farmsData, error: farmsError } = await supabase
        .from('farms')
        .select('*')
        .eq('farmer_id', userId)

      if (farmsError) throw farmsError
      if (!farmsData || farmsData.length === 0) return []

      // Get all crop data for these farms
      const farmIds = farmsData.map(farm => farm.id)
      const { data: cropsData, error: cropsError } = await supabase
        .from('crops')
        .select('*')
        .in('farm_id', farmIds)

      if (cropsError) {
        console.error('Error fetching crops:', cropsError)
        // Return farms without crops if there's an error fetching crops
        return farmsData.map(farm => ({
          ...farm,
          crops: []
        })) as Farm[]
      }

      // Map crops to their respective farms
      const farmsWithCrops = farmsData.map(farm => {
        const farmCrops = cropsData.filter(crop => crop.farm_id === farm.id)
        return {
          ...farm,
          crops: farmCrops
        }
      })

      return farmsWithCrops as Farm[]
    } catch (error) {
      console.error('Error fetching farms:', error)
      return []
    }
  }

  static async createFarm(farm: Omit<Farm, 'id' | 'createdAt' | 'crops'>): Promise<Farm | null> {
    try {
      // Transform camelCase properties to snake_case for database
      const farmData = {
        farmer_id: farm.farmerId,
        name: farm.name,
        size: farm.size,
        province: farm.location.province,
        district: farm.location.district,
        coordinates: farm.location.coordinates,
        soil_type: farm.soilType
      };

      const { data, error } = await supabase
        .from('farms')
        .insert([farmData])
        .select()
        .single()

      if (error) throw error
      
      // Transform snake_case response back to camelCase
      const transformedData = {
        id: data.id,
        farmerId: data.farmer_id,
        name: data.name,
        size: data.size,
        location: {
          province: data.province,
          district: data.district,
          coordinates: data.coordinates
        },
        soilType: data.soil_type,
        createdAt: data.created_at,
        crops: []
      } as Farm;
      
      return transformedData
    } catch (error) {
      console.error('Error creating farm:', error)
      return null
    }
  }

  static async updateFarm(farmId: string, updates: Partial<Farm>): Promise<boolean> {
    try {
      // Transform camelCase properties to snake_case for database
      const dbUpdates: Record<string, any> = {};
      
      if (updates.farmerId !== undefined) dbUpdates.farmer_id = updates.farmerId;
      if (updates.name !== undefined) dbUpdates.name = updates.name;
      if (updates.size !== undefined) dbUpdates.size = updates.size;
      if (updates.soilType !== undefined) dbUpdates.soil_type = updates.soilType;
      if (updates.location) {
        if (updates.location.province !== undefined) dbUpdates.province = updates.location.province;
        if (updates.location.district !== undefined) dbUpdates.district = updates.location.district;
        if (updates.location.coordinates !== undefined) dbUpdates.coordinates = updates.location.coordinates;
      }

      const { error } = await supabase
        .from('farms')
        .update(dbUpdates)
        .eq('id', farmId)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error updating farm:', error)
      return false
    }
  }

  static async deleteFarm(farmId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('farms')
        .delete()
        .eq('id', farmId)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error deleting farm:', error)
      return false
    }
  }

  // Task operations
  static async getTasks(farmId: string): Promise<Task[]> {
    try {
      // Check if farmId is valid
      if (!farmId) {
        console.warn('No farm ID provided for fetching tasks')
        return []
      }

      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('farm_id', farmId)

      if (error) throw error
      return data as Task[]
    } catch (error) {
      console.error('Error fetching tasks:', error)
      return []
    }
  }

  static async createTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task | null> {
    try {
      // Transform camelCase properties to snake_case for database
      const taskData = {
        farm_id: task.farmId,
        crop_id: task.cropId,
        equipment_id: task.equipmentId,
        field_id: task.fieldId,
        title: task.title,
        description: task.description,
        type: task.type,
        category: task.category,
        priority: task.priority,
        status: task.status,
        due_date: task.dueDate,
        start_date: task.startDate,
        completed_date: task.completedDate,
        estimated_duration: task.estimatedDuration,
        actual_duration: task.actualDuration,
        assigned_to: task.assignedTo,
        created_by: task.createdBy,
        supervised_by: task.supervisedBy,
        dependencies: task.dependencies,
        weather_dependent: task.weatherDependent,
        recurring: task.recurring,
        cost_estimated: task.cost.estimated,
        cost_actual: task.cost.actual,
        location_field_name: task.location.fieldName,
        location_coordinates: task.location.coordinates,
        location_area: task.location.area,
        attachments: task.attachments,
        notes: task.notes
      };

      const { data, error } = await supabase
        .from('tasks')
        .insert([taskData])
        .select()
        .single()

      if (error) throw error
      
      // Transform snake_case response back to camelCase
      const transformedData = {
        id: data.id,
        farmId: data.farm_id,
        cropId: data.crop_id,
        equipmentId: data.equipment_id,
        fieldId: data.field_id,
        title: data.title,
        description: data.description,
        type: data.type,
        category: data.category,
        priority: data.priority,
        status: data.status,
        dueDate: data.due_date,
        startDate: data.start_date,
        completedDate: data.completed_date,
        estimatedDuration: data.estimated_duration,
        actualDuration: data.actual_duration,
        assignedTo: data.assigned_to,
        createdBy: data.created_by,
        supervisedBy: data.supervised_by,
        dependencies: data.dependencies,
        resourceRequirements: [], // This would need to be fetched separately if needed
        weatherDependent: data.weather_dependent,
        weatherConditions: [], // This would need to be fetched separately if needed
        recurring: data.recurring,
        recurrencePattern: undefined, // This would need to be fetched separately if needed
        cost: {
          estimated: data.cost_estimated,
          actual: data.cost_actual,
          currency: 'ZMW'
        },
        location: {
          fieldName: data.location_field_name,
          coordinates: data.location_coordinates,
          area: data.location_area
        },
        attachments: data.attachments,
        notes: data.notes,
        qualityChecks: [], // This would need to be fetched separately if needed
        safetyRequirements: [], // This would need to be fetched separately if needed
        completionCriteria: [], // This would need to be fetched separately if needed
        progressUpdates: [], // This would need to be fetched separately if needed
        relatedTasks: [], // This would need to be fetched separately if needed
        createdAt: data.created_at,
        updatedAt: data.updated_at
      } as Task;
      
      return transformedData
    } catch (error) {
      console.error('Error creating task:', error)
      return null
    }
  }

  static async updateTask(taskId: string, updates: Partial<Task>): Promise<boolean> {
    try {
      // Transform camelCase properties to snake_case for database
      const dbUpdates: Record<string, any> = {};
      
      if (updates.farmId !== undefined) dbUpdates.farm_id = updates.farmId;
      if (updates.cropId !== undefined) dbUpdates.crop_id = updates.cropId;
      if (updates.equipmentId !== undefined) dbUpdates.equipment_id = updates.equipmentId;
      if (updates.fieldId !== undefined) dbUpdates.field_id = updates.fieldId;
      if (updates.title !== undefined) dbUpdates.title = updates.title;
      if (updates.description !== undefined) dbUpdates.description = updates.description;
      if (updates.type !== undefined) dbUpdates.type = updates.type;
      if (updates.category !== undefined) dbUpdates.category = updates.category;
      if (updates.priority !== undefined) dbUpdates.priority = updates.priority;
      if (updates.status !== undefined) dbUpdates.status = updates.status;
      if (updates.dueDate !== undefined) dbUpdates.due_date = updates.dueDate;
      if (updates.startDate !== undefined) dbUpdates.start_date = updates.startDate;
      if (updates.completedDate !== undefined) dbUpdates.completed_date = updates.completedDate;
      if (updates.estimatedDuration !== undefined) dbUpdates.estimated_duration = updates.estimatedDuration;
      if (updates.actualDuration !== undefined) dbUpdates.actual_duration = updates.actualDuration;
      if (updates.assignedTo !== undefined) dbUpdates.assigned_to = updates.assignedTo;
      if (updates.createdBy !== undefined) dbUpdates.created_by = updates.createdBy;
      if (updates.supervisedBy !== undefined) dbUpdates.supervised_by = updates.supervisedBy;
      if (updates.dependencies !== undefined) dbUpdates.dependencies = updates.dependencies;
      if (updates.weatherDependent !== undefined) dbUpdates.weather_dependent = updates.weatherDependent;
      if (updates.recurring !== undefined) dbUpdates.recurring = updates.recurring;
      
      // Handle nested objects
      if (updates.cost) {
        if (updates.cost.estimated !== undefined) dbUpdates.cost_estimated = updates.cost.estimated;
        if (updates.cost.actual !== undefined) dbUpdates.cost_actual = updates.cost.actual;
      }
      
      if (updates.location) {
        if (updates.location.fieldName !== undefined) dbUpdates.location_field_name = updates.location.fieldName;
        if (updates.location.coordinates !== undefined) dbUpdates.location_coordinates = updates.location.coordinates;
        if (updates.location.area !== undefined) dbUpdates.location_area = updates.location.area;
      }
      
      if (updates.attachments !== undefined) dbUpdates.attachments = updates.attachments;
      if (updates.notes !== undefined) dbUpdates.notes = updates.notes;

      const { error } = await supabase
        .from('tasks')
        .update(dbUpdates)
        .eq('id', taskId)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error updating task:', error)
      return false
    }
  }

  static async deleteTask(taskId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error deleting task:', error)
      return false
    }
  }

  // Marketplace operations
  static async getMarketplaceItems(): Promise<MarketplaceItem[]> {
    try {
      const { data, error } = await supabase
        .from('marketplace_item')
        .select('*')

      if (error) throw error
      return data as MarketplaceItem[]
    } catch (error) {
      console.error('Error fetching marketplace items:', error)
      return []
    }
  }

  static async createMarketplaceItem(item: Omit<MarketplaceItem, 'id' | 'createdAt'>): Promise<MarketplaceItem | null> {
    try {
      // Transform camelCase properties to snake_case for database
      const itemData = {
        seller_id: item.sellerId,
        seller_name: item.sellerName,
        name: item.name,
        category: item.category,
        type: item.type,
        description: item.description,
        price: item.price,
        currency: item.currency,
        quantity: item.quantity,
        unit: item.unit,
        province: item.location.province,
        district: item.location.district,
        images: item.images,
        status: item.status
      };

      const { data, error } = await supabase
        .from('marketplace_item')
        .insert([itemData])
        .select()
        .single()

      if (error) throw error
      
      // Transform snake_case response back to camelCase
      const transformedData = {
        id: data.id,
        sellerId: data.seller_id,
        sellerName: data.seller_name,
        name: data.name,
        category: data.category,
        type: data.type,
        description: data.description,
        price: data.price,
        currency: data.currency,
        quantity: data.quantity,
        unit: data.unit,
        location: {
          province: data.province,
          district: data.district
        },
        images: data.images,
        status: data.status,
        createdAt: data.created_at
      } as MarketplaceItem;
      
      return transformedData
    } catch (error) {
      console.error('Error creating marketplace item:', error)
      return null
    }
  }

  static async updateMarketplaceItem(itemId: string, updates: Partial<MarketplaceItem>): Promise<boolean> {
    try {
      // Transform camelCase properties to snake_case for database
      const dbUpdates: Record<string, any> = {};
      
      if (updates.sellerId !== undefined) dbUpdates.seller_id = updates.sellerId;
      if (updates.sellerName !== undefined) dbUpdates.seller_name = updates.sellerName;
      if (updates.name !== undefined) dbUpdates.name = updates.name;
      if (updates.category !== undefined) dbUpdates.category = updates.category;
      if (updates.type !== undefined) dbUpdates.type = updates.type;
      if (updates.description !== undefined) dbUpdates.description = updates.description;
      if (updates.price !== undefined) dbUpdates.price = updates.price;
      if (updates.currency !== undefined) dbUpdates.currency = updates.currency;
      if (updates.quantity !== undefined) dbUpdates.quantity = updates.quantity;
      if (updates.unit !== undefined) dbUpdates.unit = updates.unit;
      if (updates.status !== undefined) dbUpdates.status = updates.status;
      if (updates.images !== undefined) dbUpdates.images = updates.images;
      
      // Handle nested objects
      if (updates.location) {
        if (updates.location.province !== undefined) dbUpdates.province = updates.location.province;
        if (updates.location.district !== undefined) dbUpdates.district = updates.location.district;
      }

      const { error } = await supabase
        .from('marketplace_item')
        .update(dbUpdates)
        .eq('id', itemId)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error updating marketplace item:', error)
      return false
    }
  }

  static async deleteMarketplaceItem(itemId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('marketplace_item')
        .delete()
        .eq('id', itemId)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error deleting marketplace item:', error)
      return false
    }
  }

  // Inventory operations
  static async getInventory(farmId: string): Promise<InventoryItem[]> {
    try {
      const { data, error } = await supabase
        .from('inventory')
        .select('*')
        .eq('farm_id', farmId)

      if (error) throw error
      return data as InventoryItem[]
    } catch (error) {
      console.error('Error fetching inventory:', error)
      return []
    }
  }

  static async createInventoryItem(item: Omit<InventoryItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<InventoryItem | null> {
    try {
      // Transform camelCase properties to snake_case for database
      const itemData = {
        farm_id: item.farmId,
        category: item.category,
        subcategory: item.subcategory,
        name: item.name,
        description: item.description,
        brand: item.brand,
        model: item.model,
        barcode: item.barcode,
        sku: item.sku,
        quantity_current: item.quantity.current,
        quantity_reserved: item.quantity.reserved,
        quantity_available: item.quantity.available,
        quantity_unit: item.quantity.unit,
        quantity_minimum_stock: item.quantity.minimumStock,
        quantity_maximum_stock: item.quantity.maximumStock,
        cost_unit: item.cost.unitCost,
        cost_total_value: item.cost.totalValue,
        cost_currency: item.cost.currency,
        supplier_id: item.supplier.id,
        supplier_name: item.supplier.name,
        supplier_contact: item.supplier.contact,
        supplier_email: item.supplier.email,
        supplier_address: item.supplier.address,
        location_warehouse: item.location.warehouse,
        location_section: item.location.section,
        location_shelf: item.location.shelf,
        location_coordinates: item.location.coordinates,
        date_purchase: item.dates.purchaseDate,
        date_expiry: item.dates.expiryDate,
        date_last_used: item.dates.lastUsed,
        date_next_maintenance: item.dates.nextMaintenanceDate,
        condition: item.condition,
        status: item.status,
        tags: item.tags,
        photos: item.photos,
        documents: item.documents,
        notes: item.notes,
        created_by: item.createdBy
      };

      const { data, error } = await supabase
        .from('inventory')
        .insert([itemData])
        .select()
        .single()

      if (error) throw error
      
      // Transform snake_case response back to camelCase
      const transformedData = {
        id: data.id,
        farmId: data.farm_id,
        category: data.category,
        subcategory: data.subcategory,
        name: data.name,
        description: data.description,
        brand: data.brand,
        model: data.model,
        barcode: data.barcode,
        sku: data.sku,
        quantity: {
          current: data.quantity_current,
          reserved: data.quantity_reserved,
          available: data.quantity_available,
          unit: data.quantity_unit,
          minimumStock: data.quantity_minimum_stock,
          maximumStock: data.quantity_maximum_stock
        },
        cost: {
          unitCost: data.cost_unit,
          totalValue: data.cost_total_value,
          currency: data.cost_currency
        },
        supplier: {
          id: data.supplier_id,
          name: data.supplier_name,
          contact: data.supplier_contact,
          email: data.supplier_email,
          address: data.supplier_address
        },
        location: {
          warehouse: data.location_warehouse,
          section: data.location_section,
          shelf: data.location_shelf,
          coordinates: data.location_coordinates
        },
        dates: {
          purchaseDate: data.date_purchase,
          expiryDate: data.date_expiry,
          lastUsed: data.date_last_used,
          nextMaintenanceDate: data.date_next_maintenance
        },
        condition: data.condition,
        status: data.status,
        tracking: {
          serialNumbers: [],
          batchNumbers: [],
          warrantyInfo: undefined,
          maintenanceHistory: []
        },
        usage: {
          applicableCrops: [],
          applicationRate: undefined,
          applicationUnit: undefined,
          safetyInstructions: [],
          storageRequirements: []
        },
        alerts: [],
        transactions: [],
        tags: data.tags,
        photos: data.photos,
        documents: data.documents,
        notes: data.notes,
        createdBy: data.created_by,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      } as InventoryItem;
      
      return transformedData
    } catch (error) {
      console.error('Error creating inventory item:', error)
      return null
    }
  }

  static async updateInventoryItem(itemId: string, updates: Partial<InventoryItem>): Promise<boolean> {
    try {
      // Transform camelCase properties to snake_case for database
      const dbUpdates: Record<string, any> = {};
      
      if (updates.farmId !== undefined) dbUpdates.farm_id = updates.farmId;
      if (updates.category !== undefined) dbUpdates.category = updates.category;
      if (updates.subcategory !== undefined) dbUpdates.subcategory = updates.subcategory;
      if (updates.name !== undefined) dbUpdates.name = updates.name;
      if (updates.description !== undefined) dbUpdates.description = updates.description;
      if (updates.brand !== undefined) dbUpdates.brand = updates.brand;
      if (updates.model !== undefined) dbUpdates.model = updates.model;
      if (updates.barcode !== undefined) dbUpdates.barcode = updates.barcode;
      if (updates.sku !== undefined) dbUpdates.sku = updates.sku;
      if (updates.condition !== undefined) dbUpdates.condition = updates.condition;
      if (updates.status !== undefined) dbUpdates.status = updates.status;
      if (updates.tags !== undefined) dbUpdates.tags = updates.tags;
      if (updates.photos !== undefined) dbUpdates.photos = updates.photos;
      if (updates.documents !== undefined) dbUpdates.documents = updates.documents;
      if (updates.notes !== undefined) dbUpdates.notes = updates.notes;
      
      // Handle nested objects
      if (updates.quantity) {
        if (updates.quantity.current !== undefined) dbUpdates.quantity_current = updates.quantity.current;
        if (updates.quantity.reserved !== undefined) dbUpdates.quantity_reserved = updates.quantity.reserved;
        if (updates.quantity.available !== undefined) dbUpdates.quantity_available = updates.quantity.available;
        if (updates.quantity.unit !== undefined) dbUpdates.quantity_unit = updates.quantity.unit;
        if (updates.quantity.minimumStock !== undefined) dbUpdates.quantity_minimum_stock = updates.quantity.minimumStock;
        if (updates.quantity.maximumStock !== undefined) dbUpdates.quantity_maximum_stock = updates.quantity.maximumStock;
      }
      
      if (updates.cost) {
        if (updates.cost.unitCost !== undefined) dbUpdates.cost_unit = updates.cost.unitCost;
        if (updates.cost.totalValue !== undefined) dbUpdates.cost_total_value = updates.cost.totalValue;
        if (updates.cost.currency !== undefined) dbUpdates.cost_currency = updates.cost.currency;
      }
      
      if (updates.supplier) {
        if (updates.supplier.id !== undefined) dbUpdates.supplier_id = updates.supplier.id;
        if (updates.supplier.name !== undefined) dbUpdates.supplier_name = updates.supplier.name;
        if (updates.supplier.contact !== undefined) dbUpdates.supplier_contact = updates.supplier.contact;
        if (updates.supplier.email !== undefined) dbUpdates.supplier_email = updates.supplier.email;
        if (updates.supplier.address !== undefined) dbUpdates.supplier_address = updates.supplier.address;
      }
      
      if (updates.location) {
        if (updates.location.warehouse !== undefined) dbUpdates.location_warehouse = updates.location.warehouse;
        if (updates.location.section !== undefined) dbUpdates.location_section = updates.location.section;
        if (updates.location.shelf !== undefined) dbUpdates.location_shelf = updates.location.shelf;
        if (updates.location.coordinates !== undefined) dbUpdates.location_coordinates = updates.location.coordinates;
      }
      
      if (updates.dates) {
        if (updates.dates.purchaseDate !== undefined) dbUpdates.date_purchase = updates.dates.purchaseDate;
        if (updates.dates.expiryDate !== undefined) dbUpdates.date_expiry = updates.dates.expiryDate;
        if (updates.dates.lastUsed !== undefined) dbUpdates.date_last_used = updates.dates.lastUsed;
        if (updates.dates.nextMaintenanceDate !== undefined) dbUpdates.date_next_maintenance = updates.dates.nextMaintenanceDate;
      }

      const { error } = await supabase
        .from('inventory')
        .update(dbUpdates)
        .eq('id', itemId)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error updating inventory item:', error)
      return false
    }
  }

  static async deleteInventoryItem(itemId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('inventory')
        .delete()
        .eq('id', itemId)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error deleting inventory item:', error)
      return false
    }
  }

  // Order operations
  static async getOrders(userId: string): Promise<Order[]> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('customer_id', userId)

      if (error) throw error
      return data as Order[]
    } catch (error) {
      console.error('Error fetching orders:', error)
      return []
    }
  }

  static async createOrder(order: Omit<Order, 'id'>): Promise<Order | null> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .insert([order])
        .select()
        .single()

      if (error) throw error
      return data as Order
    } catch (error) {
      console.error('Error creating order:', error)
      return null
    }
  }

  // Weather data operations
  static async getWeatherData(location: { province: string; district: string }): Promise<WeatherData | null> {
    try {
      // Check if location data is valid
      if (!location || !location.province || !location.district) {
        console.warn('Invalid location data provided for fetching weather')
        return null
      }

      const { data, error } = await supabase
        .from('weather_data')
        .select('*')
        .eq('province', location.province)
        .eq('district', location.district)
        .order('date', { ascending: false })
        .limit(1)

      if (error) throw error
      
      // Check if data exists before trying to access it
      if (!data || data.length === 0) {
        console.warn('No weather data found for location:', location)
        return null
      }
      
      // Return the first item since we're limiting to 1
      return data[0] as WeatherData
    } catch (error) {
      console.error('Error fetching weather data:', error)
      return null
    }
  }

  // AI Recommendation operations
  static async getAIRecommendations(userId: string): Promise<AIRecommendation[]> {
    try {
      // Check if userId is valid
      if (!userId) {
        console.warn('No user ID provided for fetching AI recommendations')
        return []
      }

      const { data, error } = await supabase
        .from('ai_recommendations')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data as AIRecommendation[]
    } catch (error) {
      console.error('Error fetching AI recommendations:', error)
      return []
    }
  }

  static async createAIRecommendation(recommendation: Omit<AIRecommendation, 'id' | 'createdAt'>): Promise<AIRecommendation | null> {
    try {
      const { data, error } = await supabase
        .from('ai_recommendations')
        .insert([recommendation])
        .select()
        .single()

      if (error) throw error
      return data as AIRecommendation
    } catch (error) {
      console.error('Error creating AI recommendation:', error)
      return null
    }
  }
}