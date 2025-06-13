import { getDbClient } from './database';
import { SupportTicket } from '../types';

export const createSupportTicket = async (ticketData: {
  userId: string;
  userName: string;
  subject: string;
  message: string;
}): Promise<SupportTicket> => {
  const client = await getDbClient();
  
  try {
    const result = await client.query(`
      INSERT INTO support_tickets (user_id, user_name, subject, message, status)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `, [
      parseInt(ticketData.userId),
      ticketData.userName,
      ticketData.subject,
      ticketData.message,
      'open'
    ]);
    
    const ticket = result.rows[0];
    return {
      id: ticket.id.toString(),
      userId: ticket.user_id.toString(),
      userName: ticket.user_name,
      subject: ticket.subject,
      message: ticket.message,
      status: ticket.status,
      reply: ticket.reply,
      createdAt: ticket.created_at.toISOString()
    };
  } catch (error) {
    console.error('Error creating support ticket:', error);
    throw error;
  }
};

export const getAllSupportTickets = async (): Promise<SupportTicket[]> => {
  const client = await getDbClient();
  
  try {
    const result = await client.query(
      'SELECT * FROM support_tickets ORDER BY created_at DESC'
    );
    
    return result.rows.map(ticket => ({
      id: ticket.id.toString(),
      userId: ticket.user_id.toString(),
      userName: ticket.user_name,
      subject: ticket.subject,
      message: ticket.message,
      status: ticket.status,
      reply: ticket.reply,
      createdAt: ticket.created_at.toISOString()
    }));
  } catch (error) {
    console.error('Error fetching support tickets:', error);
    throw error;
  }
};

export const getSupportTicketsByUserId = async (userId: string): Promise<SupportTicket[]> => {
  const client = await getDbClient();
  
  try {
    const result = await client.query(
      'SELECT * FROM support_tickets WHERE user_id = $1 ORDER BY created_at DESC',
      [parseInt(userId)]
    );
    
    return result.rows.map(ticket => ({
      id: ticket.id.toString(),
      userId: ticket.user_id.toString(),
      userName: ticket.user_name,
      subject: ticket.subject,
      message: ticket.message,
      status: ticket.status,
      reply: ticket.reply,
      createdAt: ticket.created_at.toISOString()
    }));
  } catch (error) {
    console.error('Error fetching user support tickets:', error);
    throw error;
  }
};

export const updateSupportTicketStatus = async (
  ticketId: string, 
  status: SupportTicket['status'], 
  reply?: string
): Promise<void> => {
  const client = await getDbClient();
  
  try {
    await client.query(`
      UPDATE support_tickets 
      SET status = $1, reply = $2 
      WHERE id = $3
    `, [status, reply || null, parseInt(ticketId)]);
  } catch (error) {
    console.error('Error updating support ticket:', error);
    throw error;
  }
};