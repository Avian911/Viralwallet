import { createClient } from '@supabase/supabase-js';

// Mock database for browser environment since we can't connect directly to Neon from frontend
let mockDatabase: any = {
  users: [],
  services: [],
  orders: [],
  wallet_requests: [],
  support_tickets: []
};

export const initializeDatabase = async () => {
  try {
    // Initialize with default data
    if (mockDatabase.users.length === 0) {
      mockDatabase.users = [
        {
          id: 1,
          name: 'Admin User',
          email: 'admin@viralwallet.ng',
          phone: '08000000000',
          balance: 0,
          role: 'admin',
          status: 'active',
          created_at: new Date('2024-01-01')
        },
        {
          id: 2,
          name: 'John Doe',
          email: 'john@example.com',
          phone: '08012345678',
          balance: 15000,
          role: 'customer',
          status: 'active',
          created_at: new Date('2024-01-15')
        }
      ];

      mockDatabase.services = [
        { id: 1, platform: 'Instagram', service_type: 'Followers', price_per_1000: 2500, min_quantity: 100, max_quantity: 50000, status: 'active' },
        { id: 2, platform: 'Instagram', service_type: 'Likes', price_per_1000: 800, min_quantity: 50, max_quantity: 20000, status: 'active' },
        { id: 3, platform: 'Instagram', service_type: 'Video Views', price_per_1000: 500, min_quantity: 100, max_quantity: 100000, status: 'active' },
        { id: 4, platform: 'TikTok', service_type: 'Followers', price_per_1000: 2000, min_quantity: 100, max_quantity: 50000, status: 'active' },
        { id: 5, platform: 'TikTok', service_type: 'Video Views', price_per_1000: 400, min_quantity: 100, max_quantity: 100000, status: 'active' },
        { id: 6, platform: 'TikTok', service_type: 'Likes', price_per_1000: 700, min_quantity: 50, max_quantity: 20000, status: 'active' },
        { id: 7, platform: 'YouTube', service_type: 'Subscribers', price_per_1000: 3500, min_quantity: 50, max_quantity: 5000, status: 'active' },
        { id: 8, platform: 'YouTube', service_type: 'Video Likes', price_per_1000: 1000, min_quantity: 50, max_quantity: 5000, status: 'active' },
        { id: 9, platform: 'YouTube', service_type: 'Video Views', price_per_1000: 700, min_quantity: 100, max_quantity: 50000, status: 'active' },
        { id: 10, platform: 'Twitter', service_type: 'Followers', price_per_1000: 2000, min_quantity: 50, max_quantity: 10000, status: 'active' },
        { id: 11, platform: 'Twitter', service_type: 'Retweets', price_per_1000: 800, min_quantity: 50, max_quantity: 5000, status: 'active' },
        { id: 12, platform: 'Twitter', service_type: 'Likes', price_per_1000: 800, min_quantity: 50, max_quantity: 5000, status: 'active' },
        { id: 13, platform: 'Telegram', service_type: 'Channel Members', price_per_1000: 1800, min_quantity: 50, max_quantity: 20000, status: 'active' },
        { id: 14, platform: 'Telegram', service_type: 'Post Views', price_per_1000: 300, min_quantity: 100, max_quantity: 50000, status: 'active' },
        { id: 15, platform: 'Facebook', service_type: 'Page Likes', price_per_1000: 2200, min_quantity: 50, max_quantity: 10000, status: 'active' },
        { id: 16, platform: 'Facebook', service_type: 'Post Likes', price_per_1000: 800, min_quantity: 50, max_quantity: 5000, status: 'active' }
      ];

      mockDatabase.orders = [
        {
          id: 1,
          user_id: 2,
          service_id: 1,
          service_name: 'Instagram Followers',
          platform: 'Instagram',
          quantity: 1000,
          price: 2500,
          link: 'https://instagram.com/johndoe',
          status: 'completed',
          created_at: new Date('2024-01-20T10:00:00Z'),
          completed_at: new Date('2024-01-20T10:05:00Z')
        }
      ];

      mockDatabase.wallet_requests = [
        {
          id: 1,
          user_id: 2,
          user_name: 'John Doe',
          amount: 10000,
          proof_image: 'https://images.pexels.com/photos/164527/pexels-photo-164527.jpeg',
          status: 'pending',
          created_at: new Date('2024-01-21T14:30:00Z')
        }
      ];

      mockDatabase.support_tickets = [
        {
          id: 1,
          user_id: 2,
          user_name: 'John Doe',
          subject: 'Order Status Inquiry',
          message: 'Hi, I placed an order 2 hours ago but it\'s still showing as processing. Can you please check?',
          status: 'open',
          created_at: new Date('2024-01-21T16:00:00Z')
        }
      ];
    }

    console.log('Database initialized successfully');
    return true;
  } catch (error) {
    console.error('Database initialization error:', error);
    return false;
  }
};

// Mock database client that simulates PostgreSQL operations
export const getDbClient = async () => {
  return {
    query: async (sql: string, params: any[] = []) => {
      // Simulate database queries with mock data
      console.log('Executing query:', sql, params);
      
      try {
        if (sql.includes('SELECT * FROM users WHERE email = $1')) {
          const email = params[0];
          const user = mockDatabase.users.find((u: any) => u.email === email);
          return { rows: user ? [user] : [] };
        }
        
        if (sql.includes('INSERT INTO users')) {
          const newUser = {
            id: mockDatabase.users.length + 1,
            name: params[0],
            email: params[1],
            phone: params[2],
            balance: params[3] || 0,
            role: params[4] || 'customer',
            status: params[5] || 'active',
            created_at: new Date()
          };
          mockDatabase.users.push(newUser);
          return { rows: [newUser] };
        }
        
        if (sql.includes('SELECT * FROM services')) {
          return { rows: mockDatabase.services };
        }
        
        if (sql.includes('SELECT * FROM orders WHERE user_id = $1')) {
          const userId = params[0];
          const orders = mockDatabase.orders.filter((o: any) => o.user_id === userId);
          return { rows: orders };
        }
        
        if (sql.includes('SELECT * FROM orders') && sql.includes('ORDER BY created_at DESC')) {
          return { rows: mockDatabase.orders };
        }
        
        if (sql.includes('INSERT INTO orders')) {
          const newOrder = {
            id: mockDatabase.orders.length + 1,
            user_id: params[0],
            service_id: params[1],
            service_name: params[2],
            platform: params[3],
            quantity: params[4],
            price: params[5],
            link: params[6],
            status: params[7] || 'processing',
            created_at: new Date()
          };
          mockDatabase.orders.push(newOrder);
          return { rows: [newOrder] };
        }
        
        if (sql.includes('UPDATE users SET balance = $1 WHERE id = $2')) {
          const balance = params[0];
          const userId = params[1];
          const user = mockDatabase.users.find((u: any) => u.id === userId);
          if (user) {
            user.balance = balance;
          }
          return { rows: [] };
        }
        
        if (sql.includes('UPDATE orders SET status = $1')) {
          const status = params[0];
          const orderId = params[1];
          const order = mockDatabase.orders.find((o: any) => o.id === orderId);
          if (order) {
            order.status = status;
            if (status === 'completed') {
              order.completed_at = new Date();
            }
          }
          return { rows: [] };
        }
        
        // Default return for other queries
        return { rows: [] };
      } catch (error) {
        console.error('Query error:', error);
        return { rows: [] };
      }
    }
  };
};