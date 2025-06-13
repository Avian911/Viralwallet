import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  TrendingUp, 
  Home, 
  ShoppingBag, 
  Wallet, 
  History, 
  MessageCircle, 
  Users, 
  Settings,
  FileText,
  CreditCard,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const DashboardLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const customerNavItems = [
    { path: '/dashboard', icon: Home, label: 'Home' },
    { path: '/dashboard/order-services', icon: ShoppingBag, label: 'Order Services' },
    { path: '/dashboard/wallet', icon: Wallet, label: 'Wallet' },
    { path: '/dashboard/order-history', icon: History, label: 'Order History' },
    { path: '/dashboard/support', icon: MessageCircle, label: 'Support' }
  ];

  const adminNavItems = [
    { path: '/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/dashboard/manage-users', icon: Users, label: 'Manage Users' },
    { path: '/dashboard/manage-orders', icon: ShoppingBag, label: 'Manage Orders' },
    { path: '/dashboard/wallet-requests', icon: CreditCard, label: 'Wallet Requests' },
    { path: '/dashboard/support-tickets', icon: MessageCircle, label: 'Support Tickets' },
    { path: '/dashboard/service-settings', icon: Settings, label: 'Service Settings' }
  ];

  const navItems = user?.role === 'admin' ? adminNavItems : customerNavItems;

  const NavLink: React.FC<{ item: typeof navItems[0] }> = ({ item }) => {
    const isActive = location.pathname === item.path;
    const Icon = item.icon;

    return (
      <Link
        to={item.path}
        onClick={() => setSidebarOpen(false)}
        className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all ${
          isActive
            ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-700'
            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
        }`}
      >
        <Icon className="h-5 w-5 mr-3" />
        {item.label}
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-blue-600 mr-2" />
            <span className="text-xl font-bold text-gray-900">Viral Wallet</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-500 hover:text-gray-700"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* User Info */}
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center">
            <div className="bg-blue-100 rounded-full p-2">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">{user?.name}</p>
              <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
            </div>
          </div>
          {user?.role === 'customer' && (
            <div className="mt-3 bg-white rounded-lg p-3">
              <p className="text-xs text-gray-500">Wallet Balance</p>
              <p className="text-lg font-bold text-green-600">₦{user.balance.toLocaleString()}</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {navItems.map((item) => (
            <NavLink key={item.path} item={item} />
          ))}
        </nav>

        {/* Logout Button */}
        <div className="absolute bottom-4 left-4 right-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-all"
          >
            <LogOut className="h-5 w-5 mr-3" />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 lg:hidden">
          <div className="flex items-center justify-between h-16 px-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-gray-500 hover:text-gray-700"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-blue-600 mr-2" />
              <span className="text-xl font-bold text-gray-900">Viral Wallet</span>
            </div>
            <div></div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;