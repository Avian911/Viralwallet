// Mock module to resolve pg package imports in browser environment
export class Client {
  constructor() {
    console.warn('Database Client is not available in browser environment');
  }

  async connect() {
    throw new Error('Database operations are not supported in browser environment');
  }

  async query() {
    throw new Error('Database operations are not supported in browser environment');
  }

  async end() {
    // No-op for browser environment
  }
}

// Default export for compatibility
export default { Client };