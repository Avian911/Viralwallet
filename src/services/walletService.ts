import { getDbClient } from './database';
import { WalletRequest } from '../types';

export const createWalletRequest = async (requestData: {
  userId: string;
  userName: string;
  amount: number;
  proofImage: string;
}): Promise<WalletRequest> => {
  const client = await getDbClient();
  
  try {
    const result = await client.query(`
      INSERT INTO wallet_requests (user_id, user_name, amount, proof_image, status)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `, [
      parseInt(requestData.userId),
      requestData.userName,
      requestData.amount,
      requestData.proofImage,
      'pending'
    ]);
    
    const request = result.rows[0];
    return {
      id: request.id.toString(),
      userId: request.user_id.toString(),
      userName: request.user_name,
      amount: parseFloat(request.amount),
      proofImage: request.proof_image,
      status: request.status,
      createdAt: request.created_at.toISOString(),
      processedAt: request.processed_at ? request.processed_at.toISOString() : undefined
    };
  } catch (error) {
    console.error('Error creating wallet request:', error);
    throw error;
  }
};

export const getAllWalletRequests = async (): Promise<WalletRequest[]> => {
  const client = await getDbClient();
  
  try {
    const result = await client.query(
      'SELECT * FROM wallet_requests ORDER BY created_at DESC'
    );
    
    return result.rows.map(request => ({
      id: request.id.toString(),
      userId: request.user_id.toString(),
      userName: request.user_name,
      amount: parseFloat(request.amount),
      proofImage: request.proof_image,
      status: request.status,
      createdAt: request.created_at.toISOString(),
      processedAt: request.processed_at ? request.processed_at.toISOString() : undefined
    }));
  } catch (error) {
    console.error('Error fetching wallet requests:', error);
    throw error;
  }
};

export const updateWalletRequestStatus = async (
  requestId: string, 
  status: WalletRequest['status']
): Promise<void> => {
  const client = await getDbClient();
  
  try {
    await client.query(`
      UPDATE wallet_requests 
      SET status = $1, processed_at = CURRENT_TIMESTAMP 
      WHERE id = $2
    `, [status, parseInt(requestId)]);
  } catch (error) {
    console.error('Error updating wallet request status:', error);
    throw error;
  }
};