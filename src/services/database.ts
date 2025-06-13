import { Client } from 'pg';

const DATABASE_URL = import.meta.env.VITE_DATABASE_URL;

let client: Client | null = null;

export const getDbClient = async (): Promise<Client> => {
  if (!client) {
    client = new Client({
      connectionString: DATABASE_URL,
      ssl: {
        rejectUnauthorized: false
      }
    });
    await client.connect();
  }
  return client;
};

export const initializeDatabase = async () => {
  const client = await getDbClient();
  
  try {
    // Create tables if they don't exist
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        phone VARCHAR(20) NOT NULL,
        balance DECIMAL(10,2) DEFAULT 0,
        role VARCHAR(20) DEFAULT 'customer',
        status VARCHAR(20) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS services (
        id SERIAL PRIMARY KEY,
        platform VARCHAR(100) NOT NULL,
        service_type VARCHAR(100) NOT NULL,
        price_per_1000 DECIMAL(10,2) NOT NULL,
        min_quantity INTEGER NOT NULL,
        max_quantity INTEGER NOT NULL,
        status VARCHAR(20) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        service_id INTEGER REFERENCES services(id),
        service_name VARCHAR(255) NOT NULL,
        platform VARCHAR(100) NOT NULL,
        quantity INTEGER NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        link TEXT NOT NULL,
        status VARCHAR(20) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        completed_at TIMESTAMP NULL
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS wallet_requests (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        user_name VARCHAR(255) NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        proof_image TEXT,
        status VARCHAR(20) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        processed_at TIMESTAMP NULL
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS support_tickets (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        user_name VARCHAR(255) NOT NULL,
        subject VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        status VARCHAR(20) DEFAULT 'open',
        reply TEXT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Insert default admin user if not exists
    const adminExists = await client.query(
      'SELECT id FROM users WHERE email = $1',
      ['admin@viralwallet.ng']
    );

    if (adminExists.rows.length === 0) {
      await client.query(`
        INSERT INTO users (name, email, phone, balance, role, status)
        VALUES ($1, $2, $3, $4, $5, $6)
      `, ['Admin User', 'admin@viralwallet.ng', '08000000000', 0, 'admin', 'active']);
    }

    // Insert default customer user if not exists
    const customerExists = await client.query(
      'SELECT id FROM users WHERE email = $1',
      ['john@example.com']
    );

    if (customerExists.rows.length === 0) {
      await client.query(`
        INSERT INTO users (name, email, phone, balance, role, status)
        VALUES ($1, $2, $3, $4, $5, $6)
      `, ['John Doe', 'john@example.com', '08012345678', 15000, 'customer', 'active']);
    }

    // Insert default services if table is empty
    const servicesCount = await client.query('SELECT COUNT(*) FROM services');
    
    if (parseInt(servicesCount.rows[0].count) === 0) {
      const services = [
        ['Instagram', 'Followers', 2500, 100, 50000],
        ['Instagram', 'Likes', 800, 50, 20000],
        ['Instagram', 'Video Views', 500, 100, 100000],
        ['TikTok', 'Followers', 2000, 100, 50000],
        ['TikTok', 'Video Views', 400, 100, 100000],
        ['TikTok', 'Likes', 700, 50, 20000],
        ['YouTube', 'Subscribers', 3500, 50, 5000],
        ['YouTube', 'Video Likes', 1000, 50, 5000],
        ['YouTube', 'Video Views', 700, 100, 50000],
        ['Twitter', 'Followers', 2000, 50, 10000],
        ['Twitter', 'Retweets', 800, 50, 5000],
        ['Twitter', 'Likes', 800, 50, 5000],
        ['Telegram', 'Channel Members', 1800, 50, 20000],
        ['Telegram', 'Post Views', 300, 100, 50000],
        ['Facebook', 'Page Likes', 2200, 50, 10000],
        ['Facebook', 'Post Likes', 800, 50, 5000]
      ];

      for (const service of services) {
        await client.query(`
          INSERT INTO services (platform, service_type, price_per_1000, min_quantity, max_quantity)
          VALUES ($1, $2, $3, $4, $5)
        `, service);
      }
    }

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
};