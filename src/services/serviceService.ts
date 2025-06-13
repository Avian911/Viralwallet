import { getDbClient } from './database';
import { Service } from '../types';

export const getAllServices = async (): Promise<Service[]> => {
  const client = await getDbClient();
  
  try {
    const result = await client.query(
      'SELECT * FROM services ORDER BY platform, service_type'
    );
    
    return result.rows.map(service => ({
      id: service.id.toString(),
      platform: service.platform,
      serviceType: service.service_type,
      pricePer1000: parseFloat(service.price_per_1000),
      min: service.min_quantity,
      max: service.max_quantity,
      status: service.status
    }));
  } catch (error) {
    console.error('Error fetching services:', error);
    throw error;
  }
};

export const getServiceById = async (serviceId: string): Promise<Service | null> => {
  const client = await getDbClient();
  
  try {
    const result = await client.query(
      'SELECT * FROM services WHERE id = $1',
      [parseInt(serviceId)]
    );
    
    if (result.rows.length === 0) {
      return null;
    }
    
    const service = result.rows[0];
    return {
      id: service.id.toString(),
      platform: service.platform,
      serviceType: service.service_type,
      pricePer1000: parseFloat(service.price_per_1000),
      min: service.min_quantity,
      max: service.max_quantity,
      status: service.status
    };
  } catch (error) {
    console.error('Error fetching service:', error);
    throw error;
  }
};

export const createService = async (serviceData: {
  platform: string;
  serviceType: string;
  pricePer1000: number;
  min: number;
  max: number;
  status: 'active' | 'inactive';
}): Promise<Service> => {
  const client = await getDbClient();
  
  try {
    const result = await client.query(`
      INSERT INTO services (platform, service_type, price_per_1000, min_quantity, max_quantity, status)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `, [
      serviceData.platform,
      serviceData.serviceType,
      serviceData.pricePer1000,
      serviceData.min,
      serviceData.max,
      serviceData.status
    ]);
    
    const service = result.rows[0];
    return {
      id: service.id.toString(),
      platform: service.platform,
      serviceType: service.service_type,
      pricePer1000: parseFloat(service.price_per_1000),
      min: service.min_quantity,
      max: service.max_quantity,
      status: service.status
    };
  } catch (error) {
    console.error('Error creating service:', error);
    throw error;
  }
};

export const updateService = async (serviceId: string, serviceData: {
  platform: string;
  serviceType: string;
  pricePer1000: number;
  min: number;
  max: number;
  status: 'active' | 'inactive';
}): Promise<void> => {
  const client = await getDbClient();
  
  try {
    await client.query(`
      UPDATE services 
      SET platform = $1, service_type = $2, price_per_1000 = $3, min_quantity = $4, max_quantity = $5, status = $6
      WHERE id = $7
    `, [
      serviceData.platform,
      serviceData.serviceType,
      serviceData.pricePer1000,
      serviceData.min,
      serviceData.max,
      serviceData.status,
      parseInt(serviceId)
    ]);
  } catch (error) {
    console.error('Error updating service:', error);
    throw error;
  }
};

export const deleteService = async (serviceId: string): Promise<void> => {
  const client = await getDbClient();
  
  try {
    await client.query(
      'DELETE FROM services WHERE id = $1',
      [parseInt(serviceId)]
    );
  } catch (error) {
    console.error('Error deleting service:', error);
    throw error;
  }
};