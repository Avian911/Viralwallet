import { getDbClient } from './database';
import { Order } from '../types';

export const createOrder = async (orderData: {
  userId: string;
  serviceId: string;
  serviceName: string;
  platform: string;
  quantity: number;
  price: number;
  link: string;
}): Promise<Order> => {
  const client = await getDbClient();
  
  try {
    const result = await client.query(`
      INSERT INTO orders (user_id, service_id, service_name, platform, quantity, price, link, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `, [
      parseInt(orderData.userId),
      parseInt(orderData.serviceId),
      orderData.serviceName,
      orderData.platform,
      orderData.quantity,
      orderData.price,
      orderData.link,
      'processing'
    ]);
    
    const order = result.rows[0];
    return {
      id: order.id.toString(),
      userId: order.user_id.toString(),
      serviceId: order.service_id.toString(),
      serviceName: order.service_name,
      platform: order.platform,
      quantity: order.quantity,
      price: parseFloat(order.price),
      link: order.link,
      status: order.status,
      createdAt: order.created_at.toISOString(),
      completedAt: order.completed_at ? order.completed_at.toISOString() : undefined
    };
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

export const getAllOrders = async (): Promise<Order[]> => {
  const client = await getDbClient();
  
  try {
    const result = await client.query(
      'SELECT * FROM orders ORDER BY created_at DESC'
    );
    
    return result.rows.map(order => ({
      id: order.id.toString(),
      userId: order.user_id.toString(),
      serviceId: order.service_id.toString(),
      serviceName: order.service_name,
      platform: order.platform,
      quantity: order.quantity,
      price: parseFloat(order.price),
      link: order.link,
      status: order.status,
      createdAt: order.created_at.toISOString(),
      completedAt: order.completed_at ? order.completed_at.toISOString() : undefined
    }));
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};

export const getOrdersByUserId = async (userId: string): Promise<Order[]> => {
  const client = await getDbClient();
  
  try {
    const result = await client.query(
      'SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC',
      [parseInt(userId)]
    );
    
    return result.rows.map(order => ({
      id: order.id.toString(),
      userId: order.user_id.toString(),
      serviceId: order.service_id.toString(),
      serviceName: order.service_name,
      platform: order.platform,
      quantity: order.quantity,
      price: parseFloat(order.price),
      link: order.link,
      status: order.status,
      createdAt: order.created_at.toISOString(),
      completedAt: order.completed_at ? order.completed_at.toISOString() : undefined
    }));
  } catch (error) {
    console.error('Error fetching user orders:', error);
    throw error;
  }
};

export const updateOrderStatus = async (orderId: string, status: Order['status']): Promise<void> => {
  const client = await getDbClient();
  
  try {
    const updateData: any[] = [status, parseInt(orderId)];
    let query = 'UPDATE orders SET status = $1';
    
    if (status === 'completed') {
      query += ', completed_at = CURRENT_TIMESTAMP';
    }
    
    query += ' WHERE id = $2';
    
    await client.query(query, updateData);
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
};

export const getProcessingOrders = async (): Promise<Order[]> => {
  const client = await getDbClient();
  
  try {
    const result = await client.query(`
      SELECT * FROM orders 
      WHERE status = 'processing' 
      AND created_at <= NOW() - INTERVAL '5 minutes'
    `);
    
    return result.rows.map(order => ({
      id: order.id.toString(),
      userId: order.user_id.toString(),
      serviceId: order.service_id.toString(),
      serviceName: order.service_name,
      platform: order.platform,
      quantity: order.quantity,
      price: parseFloat(order.price),
      link: order.link,
      status: order.status,
      createdAt: order.created_at.toISOString(),
      completedAt: order.completed_at ? order.completed_at.toISOString() : undefined
    }));
  } catch (error) {
    console.error('Error fetching processing orders:', error);
    throw error;
  }
};