import React from 'react';
import { Users, ShoppingBag, CreditCard, MessageCircle, TrendingUp, DollarSign, Clock, CheckCircle } from 'lucide-react';
import { mockUsers, mockOrders, mockWalletRequests, mockSupportTickets } from '../../../services/mockData';

const AdminHome: React.FC = () => {
  const totalUsers = mockUsers.filter(u => u.role === 'customer').length;
  const totalOrders = mockOrders.length;
  const pendingWalletRequests = mockWalletRequests.filter(r => r.status === 'pending').length;
  const openSupportTickets = mockSupportTickets.filter(t => t.status === 'open').length;
  
  const todayOrders = mockOrders.filter(order => {
    const today = new Date().toDateString();
    return new Date(order.createdAt).toDateString() === today;
  });
  
  const todayEarnings = todayOrders.reduce((sum, order) => sum + order.price, 0);
  const totalEarnings = mockOrders.reduce((sum, order) => sum + (order.status === 'completed' ? order.price : 0), 0);
  
  const completedOrders = mockOrders.filter(order => order.status === 'completed').length;
  const processingOrders = mockOrders.filter(order => order.status === 'processing' || order.status === 'pending').length;

  const recentOrders = mockOrders
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const recentUsers = mockUsers
    .filter(u => u.role === 'customer')
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl text-white p-8">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-blue-100">Welcome to your admin control center</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{totalUsers}</p>
            </div>
            <div className="bg-blue-100 rounded-full p-3">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-green-600 text-sm font-medium">
              {recentUsers.length} new this week
            </span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{totalOrders}</p>
            </div>
            <div className="bg-green-100 rounded-full p-3">
              <ShoppingBag className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-blue-600 text-sm font-medium">
              {todayOrders.length} orders today
            </span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Earnings</p>
              <p className="text-2xl font-bold text-gray-900">₦{totalEarnings.toLocaleString()}</p>
            </div>
            <div className="bg-yellow-100 rounded-full p-3">
              <DollarSign className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-green-600 text-sm font-medium">
              ₦{todayEarnings.toLocaleString()} today
            </span>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Actions</p>
              <p className="text-2xl font-bold text-gray-900">{pendingWalletRequests + openSupportTickets}</p>
            </div>
            <div className="bg-red-100 rounded-full p-3">
              <Clock className="h-6 w-6 text-red-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-red-600 text-sm font-medium">
              Needs attention
            </span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="text-center">
            <div className="bg-blue-100 rounded-full p-3 w-12 h-12 mx-auto mb-3">
              <CreditCard className="h-6 w-6 text-blue-600" />
            </div>
            <div className="text-lg font-bold text-blue-600">{pendingWalletRequests}</div>
            <div className="text-sm text-gray-600">Wallet Requests</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="text-center">
            <div className="bg-green-100 rounded-full p-3 w-12 h-12 mx-auto mb-3">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="text-lg font-bold text-green-600">{completedOrders}</div>
            <div className="text-sm text-gray-600">Completed Orders</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="text-center">
            <div className="bg-yellow-100 rounded-full p-3 w-12 h-12 mx-auto mb-3">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="text-lg font-bold text-yellow-600">{processingOrders}</div>
            <div className="text-sm text-gray-600">Processing Orders</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="text-center">
            <div className="bg-purple-100 rounded-full p-3 w-12 h-12 mx-auto mb-3">
              <MessageCircle className="h-6 w-6 text-purple-600" />
            </div>
            <div className="text-lg font-bold text-purple-600">{openSupportTickets}</div>
            <div className="text-sm text-gray-600">Open Tickets</div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <ShoppingBag className="h-5 w-5 mr-2" />
              Recent Orders
            </h2>
          </div>
          <div className="p-6">
            {recentOrders.length > 0 ? (
              <div className="space-y-4">
                {recentOrders.map((order) => {
                  const user = mockUsers.find(u => u.id === order.userId);
                  return (
                    <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <h3 className="font-medium text-gray-900">{order.serviceName}</h3>
                        <p className="text-sm text-gray-600">{user?.name} • {formatDate(order.createdAt)}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">₦{order.price.toLocaleString()}</p>
                        <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                          order.status === 'completed' 
                            ? 'bg-green-100 text-green-800' 
                            : order.status === 'processing'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No recent orders</p>
            )}
          </div>
        </div>

        {/* Recent Users */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Recent Users
            </h2>
          </div>
          <div className="p-6">
            {recentUsers.length > 0 ? (
              <div className="space-y-4">
                {recentUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="bg-blue-100 rounded-full p-2 mr-3">
                        <Users className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{user.name}</h3>
                        <p className="text-sm text-gray-600">{user.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">{formatDate(user.createdAt)}</p>
                      <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                        user.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {user.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No recent users</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;