import { getDbClient } from './database';
import { User } from '../types';

export const getUserByEmail = async (email: string): Promise<User | null> => {
  const client = await getDbClient();
  
  try {
    const result = await client.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    
    if (result.rows.length === 0) {
      return null;
    }
    
    const user = result.rows[0];
    return {
      id: user.id.toString(),
      name: user.name,
      email: user.email,
      phone: user.phone,
      balance: parseFloat(user.balance),
      role: user.role,
      status: user.status,
      createdAt: user.created_at.toISOString()
    };
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
};

export const createUser = async (userData: {
  name: string;
  email: string;
  phone: string;
  password: string;
}): Promise<User> => {
  const client = await getDbClient();
  
  try {
    const result = await client.query(`
      INSERT INTO users (name, email, phone, balance, role, status)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `, [userData.name, userData.email, userData.phone, 0, 'customer', 'active']);
    
    const user = result.rows[0];
    return {
      id: user.id.toString(),
      name: user.name,
      email: user.email,
      phone: user.phone,
      balance: parseFloat(user.balance),
      role: user.role,
      status: user.status,
      createdAt: user.created_at.toISOString()
    };
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export const getAllUsers = async (): Promise<User[]> => {
  const client = await getDbClient();
  
  try {
    const result = await client.query(
      'SELECT * FROM users ORDER BY created_at DESC'
    );
    
    return result.rows.map(user => ({
      id: user.id.toString(),
      name: user.name,
      email: user.email,
      phone: user.phone,
      balance: parseFloat(user.balance),
      role: user.role,
      status: user.status,
      createdAt: user.created_at.toISOString()
    }));
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const updateUserBalance = async (userId: string, newBalance: number): Promise<void> => {
  const client = await getDbClient();
  
  try {
    await client.query(
      'UPDATE users SET balance = $1 WHERE id = $2',
      [newBalance, parseInt(userId)]
    );
  } catch (error) {
    console.error('Error updating user balance:', error);
    throw error;
  }
};

export const updateUserStatus = async (userId: string, status: 'active' | 'suspended'): Promise<void> => {
  const client = await getDbClient();
  
  try {
    await client.query(
      'UPDATE users SET status = $1 WHERE id = $2',
      [status, parseInt(userId)]
    );
  } catch (error) {
    console.error('Error updating user status:', error);
    throw error;
  }
};