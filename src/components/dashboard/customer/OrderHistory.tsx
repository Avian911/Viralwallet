import React, { useState, useEffect } from 'react';
import { Package, Clock, CheckCircle, XCircle, ExternalLink } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { getOrdersByUserId } from '../../../services/orderService';
import { Order } from '../../../types';

const OrderHistory: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('all');
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

  const filteredOrders = filterStatus === 'all' 
    ? orders 
    : orders.filter(order => order.status === filterStatus);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'processing':
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-blue-600" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Package className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'pending':
        return 'bg-blue-100 text-blue-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Order History</h1>
          <p className="text-gray-600 mt-1">Track all your social media service orders</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          >
            <option value="all">All Orders</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{orders.length}</div>
            <div className="text-sm text-gray-600">Total Orders</div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {orders.filter(o => o.status === 'pending' || o.status === 'processing').length}
            </div>
            <div className="text-sm text-gray-600">Active</div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {orders.filter(o => o.status === 'completed').length}
            </div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              ₦{orders.reduce((sum, order) => sum + order.price, 0).toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Total Spent</div>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {filteredOrders.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {filteredOrders.map((order) => (
              <div key={order.id} className="p-6 hover:bg-gray-50 transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="bg-blue-100 rounded-full p-3">
                      {getStatusIcon(order.status)}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{order.serviceName}</h3>
                      <p className="text-sm text-gray-600">
                        {order.quantity.toLocaleString()} units • {formatDate(order.createdAt)}
                      </p>
                      <div className="flex items-center mt-1">
                        <ExternalLink className="h-4 w-4 text-gray-400 mr-1" />
                        <a 
                          href={order.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:text-blue-800 truncate max-w-xs"
                        >
                          {order.link}
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-gray-900 mb-2">
                      ₦{order.price.toLocaleString()}
                    </div>
                    <span className={`inline-flex px-3 py-1 text-sm rounded-full font-medium ${getStatusColor(order.status)}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                    {order.completedAt && (
                      <div className="text-xs text-gray-500 mt-1">
                        Completed: {formatDate(order.completedAt)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {filterStatus === 'all' ? 'No orders yet' : `No ${filterStatus} orders`}
            </h3>
            <p className="text-gray-600 mb-4">
              {filterStatus === 'all' 
                ? 'Start growing your social media presence today' 
                : 'Try changing the filter to see other orders'
              }
            </p>
            {filterStatus === 'all' && (
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all">
                Place Your First Order
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;