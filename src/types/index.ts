export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  balance: number;
  role: 'customer' | 'admin';
  status: 'active' | 'suspended';
  createdAt: string;
}

export interface Service {
  id: string;
  platform: string;
  serviceType: string;
  pricePer1000: number;
  min: number;
  max: number;
  status: 'active' | 'inactive';
}

export interface Order {
  id: string;
  userId: string;
  serviceId: string;
  serviceName: string;
  platform: string;
  quantity: number;
  price: number;
  link: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: string;
  completedAt?: string;
}

export interface WalletRequest {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  proofImage: string;
  status: 'pending' | 'approved' | 'declined';
  createdAt: string;
  processedAt?: string;
}

export interface SupportTicket {
  id: string;
  userId: string;
  userName: string;
  subject: string;
  message: string;
  status: 'open' | 'closed';
  reply?: string;
  createdAt: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, phone: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}