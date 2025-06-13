import { User, Service, Order, WalletRequest, SupportTicket } from '../types';

// Mock Users (includes admin)
export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@viralwallet.ng',
    phone: '08000000000',
    balance: 0,
    role: 'admin',
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '08012345678',
    balance: 15000,
    role: 'customer',
    status: 'active',
    createdAt: '2024-01-15T00:00:00Z'
  }
];

// Mock Services
export const mockServices: Service[] = [
  { id: '1', platform: 'Instagram', serviceType: 'Followers', pricePer1000: 2500, min: 100, max: 50000, status: 'active' },
  { id: '2', platform: 'Instagram', serviceType: 'Likes', pricePer1000: 800, min: 50, max: 20000, status: 'active' },
  { id: '3', platform: 'Instagram', serviceType: 'Video Views', pricePer1000: 500, min: 100, max: 100000, status: 'active' },
  { id: '4', platform: 'TikTok', serviceType: 'Followers', pricePer1000: 2000, min: 100, max: 50000, status: 'active' },
  { id: '5', platform: 'TikTok', serviceType: 'Video Views', pricePer1000: 400, min: 100, max: 100000, status: 'active' },
  { id: '6', platform: 'TikTok', serviceType: 'Likes', pricePer1000: 700, min: 50, max: 20000, status: 'active' },
  { id: '7', platform: 'YouTube', serviceType: 'Subscribers', pricePer1000: 3500, min: 50, max: 5000, status: 'active' },
  { id: '8', platform: 'YouTube', serviceType: 'Video Likes', pricePer1000: 1000, min: 50, max: 5000, status: 'active' },
  { id: '9', platform: 'YouTube', serviceType: 'Video Views', pricePer1000: 700, min: 100, max: 50000, status: 'active' },
  { id: '10', platform: 'Twitter', serviceType: 'Followers', pricePer1000: 2000, min: 50, max: 10000, status: 'active' },
  { id: '11', platform: 'Twitter', serviceType: 'Retweets', pricePer1000: 800, min: 50, max: 5000, status: 'active' },
  { id: '12', platform: 'Twitter', serviceType: 'Likes', pricePer1000: 800, min: 50, max: 5000, status: 'active' },
  { id: '13', platform: 'Telegram', serviceType: 'Channel Members', pricePer1000: 1800, min: 50, max: 20000, status: 'active' },
  { id: '14', platform: 'Telegram', serviceType: 'Post Views', pricePer1000: 300, min: 100, max: 50000, status: 'active' },
  { id: '15', platform: 'Facebook', serviceType: 'Page Likes', pricePer1000: 2200, min: 50, max: 10000, status: 'active' },
  { id: '16', platform: 'Facebook', serviceType: 'Post Likes', pricePer1000: 800, min: 50, max: 5000, status: 'active' }
];

// Mock Orders
export let mockOrders: Order[] = [
  {
    id: '1',
    userId: '2',
    serviceId: '1',
    serviceName: 'Instagram Followers',
    platform: 'Instagram',
    quantity: 1000,
    price: 2500,
    link: 'https://instagram.com/johndoe',
    status: 'completed',
    createdAt: '2024-01-20T10:00:00Z',
    completedAt: '2024-01-20T10:05:00Z'
  }
];

// Mock Wallet Requests
export let mockWalletRequests: WalletRequest[] = [
  {
    id: '1',
    userId: '2',
    userName: 'John Doe',
    amount: 10000,
    proofImage: 'https://images.pexels.com/photos/164527/pexels-photo-164527.jpeg',
    status: 'pending',
    createdAt: '2024-01-21T14:30:00Z'
  }
];

// Mock Support Tickets
export let mockSupportTickets: SupportTicket[] = [
  {
    id: '1',
    userId: '2',
    userName: 'John Doe',
    subject: 'Order Status Inquiry',
    message: 'Hi, I placed an order 2 hours ago but it\'s still showing as processing. Can you please check?',
    status: 'open',
    createdAt: '2024-01-21T16:00:00Z'
  }
];

// Helper functions
export const addUser = (user: User) => {
  mockUsers.push(user);
};

export const addOrder = (order: Order) => {
  mockOrders.push(order);
};

export const addWalletRequest = (request: WalletRequest) => {
  mockWalletRequests.push(request);
};

export const addSupportTicket = (ticket: SupportTicket) => {
  mockSupportTickets.push(ticket);
};

export const updateUserBalance = (userId: string, newBalance: number) => {
  const user = mockUsers.find(u => u.id === userId);
  if (user) {
    user.balance = newBalance;
  }
};

export const updateOrderStatus = (orderId: string, status: Order['status']) => {
  const order = mockOrders.find(o => o.id === orderId);
  if (order) {
    order.status = status;
    if (status === 'completed') {
      order.completedAt = new Date().toISOString();
    }
  }
};

export const updateWalletRequestStatus = (requestId: string, status: WalletRequest['status']) => {
  const request = mockWalletRequests.find(r => r.id === requestId);
  if (request) {
    request.status = status;
    request.processedAt = new Date().toISOString();
  }
};

export const updateSupportTicketStatus = (ticketId: string, status: SupportTicket['status'], reply?: string) => {
  const ticket = mockSupportTickets.find(t => t.id === ticketId);
  if (ticket) {
    ticket.status = status;
    if (reply) {
      ticket.reply = reply;
    }
  }
};