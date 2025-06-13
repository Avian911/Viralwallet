import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Wallet, ShoppingBag, TrendingUp, Clock } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { getOrdersByUserId } from '../../../services/orderService';
import { Order } from '../../../types';

const CustomerHome: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      if (!user) return;
      
      try {
        const userOrders = await getOrdersByUserId(user.id);
        setOrders(userOrders);
      } catch (error) {
        console.error('Error loading orders:', error);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [user]);

  const recentOrders = orders.slice(0, 3);
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(order => order.status === 'pending' || order.status === 'processing').length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl text-white p-8">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}!</h1>
        <p className="text-blue-100 mb-6">Manage your social media growth and track your orders</p>
        <Link
          to="/dashboard/order-services"
          className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-all inline-flex items-center"
        >
          <ShoppingBag className="h-5 w-5 mr-2" />
          Place New Order
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Wallet Balance</p>
              <p className="text-2xl font-bold text-green-600">₦{user?.balance.toLocaleString()}</p>
            </div>
            <div className="bg-green-100 rounded-full p-3">
              <Wallet className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4">
            <Link
              to="/dashboard/wallet"
              className="text-green-600 hover:text-green-700 text-sm font-medium"
            >
              Top up wallet →
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-blue-600">{totalOrders}</p>
            </div>
            <div className="bg-blue-100 rounded-full p-3">
              <ShoppingBag className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4">
            <Link
              to="/dashboard/order-history"
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              View all orders →
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Orders</p>
              <p className="text-2xl font-bold text-yellow-600">{pendingOrders}</p>
            </div>
            <div className="bg-yellow-100 rounded-full p-3">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-yellow-600 text-sm font-medium">
              {pendingOrders > 0 ? 'Processing...' : 'All complete'}
            </span>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
        </div>
        <div className="p-6">
          {recentOrders.length > 0 ? (
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="bg-blue-100 rounded-full p-2 mr-4">
                      <TrendingUp className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{order.serviceName}</h3>
                      <p className="text-sm text-gray-600">{order.quantity.toLocaleString()} units</p>
                    </div>
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
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
              <p className="text-gray-600 mb-4">Start growing your social media presence today</p>
              <Link
                to="/dashboard/order-services"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all"
              >
                Place Your First Order
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerHome;