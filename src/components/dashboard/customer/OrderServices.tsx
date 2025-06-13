import React, { useState, useEffect } from 'react';
import { ShoppingBag, Search, Filter, TrendingUp } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { getAllServices } from '../../../services/serviceService';
import { createOrder } from '../../../services/orderService';
import { updateUserBalance } from '../../../services/userService';
import { Service } from '../../../types';

const OrderServices: React.FC = () => {
  const { user } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [quantity, setQuantity] = useState<number>(1000);
  const [link, setLink] = useState('');
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadServices = async () => {
      try {
        const servicesData = await getAllServices();
        setServices(servicesData);
      } catch (error) {
        console.error('Error loading services:', error);
      } finally {
        setLoading(false);
      }
    };

    loadServices();
  }, []);

  const platforms = ['all', ...Array.from(new Set(services.map(s => s.platform)))];
  
  const filteredServices = services.filter(service => {
    const matchesPlatform = selectedPlatform === 'all' || service.platform === selectedPlatform;
    const matchesSearch = service.serviceType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.platform.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesPlatform && matchesSearch && service.status === 'active';
  });

  const calculatePrice = (service: Service, qty: number): number => {
    return Math.ceil((qty / 1000) * service.pricePer1000);
  };

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
    setQuantity(service.min);
    setLink('');
    setShowOrderModal(true);
  };

  const handlePlaceOrder = async () => {
    if (!selectedService || !link || !user) return;

    const price = calculatePrice(selectedService, quantity);
    
    if (user.balance < price) {
      alert('Insufficient wallet balance. Please top up your wallet.');
      return;
    }

    try {
      await createOrder({
        userId: user.id,
        serviceId: selectedService.id,
        serviceName: `${selectedService.platform} ${selectedService.serviceType}`,
        platform: selectedService.platform,
        quantity,
        price,
        link
      });

      // Update user balance
      const newBalance = user.balance - price;
      await updateUserBalance(user.id, newBalance);
      
      // Update local user state
      const updatedUser = { ...user, balance: newBalance };
      localStorage.setItem('viralWalletUser', JSON.stringify(updatedUser));
      
      setShowOrderModal(false);
      setOrderSuccess(true);
      setTimeout(() => setOrderSuccess(false), 3000);
      
      // Refresh page to show updated balance
      window.location.reload();
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Error placing order. Please try again.');
    }
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
          <h1 className="text-2xl font-bold text-gray-900">Order Services</h1>
          <p className="text-gray-600 mt-1">Choose from our premium social media services</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-200">
            <p className="text-sm text-gray-600">Wallet Balance</p>
            <p className="text-lg font-bold text-green-600">₦{user?.balance.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Success Message */}
      {orderSuccess && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
          <div className="flex items-center">
            <TrendingUp className="h-5 w-5 mr-2" />
            Order placed successfully! Your order is now being processed.
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="sm:w-48">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                value={selectedPlatform}
                onChange={(e) => setSelectedPlatform(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              >
                {platforms.map(platform => (
                  <option key={platform} value={platform}>
                    {platform === 'all' ? 'All Platforms' : platform}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service) => (
          <div key={service.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{service.platform}</h3>
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                  {service.serviceType}
                </span>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Price per 1K:</span>
                  <span className="font-medium text-gray-900">₦{service.pricePer1000.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Min order:</span>
                  <span className="font-medium text-gray-900">{service.min.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Max order:</span>
                  <span className="font-medium text-gray-900">{service.max.toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={() => handleServiceSelect(service)}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-all mt-4"
              >
                Order Now
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredServices.length === 0 && (
        <div className="text-center py-12">
          <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No services found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria</p>
        </div>
      )}

      {/* Order Modal */}
      {showOrderModal && selectedService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {selectedService.platform} {selectedService.serviceType}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity
                  </label>
                  <input
                    type="number"
                    min={selectedService.min}
                    max={selectedService.max}
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || selectedService.min)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Min: {selectedService.min.toLocaleString()} | Max: {selectedService.max.toLocaleString()}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Link
                  </label>
                  <input
                    type="url"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    placeholder={`Enter your ${selectedService.platform} link`}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-900">Total Price:</span>
                    <span className="text-xl font-bold text-blue-600">
                      ₦{calculatePrice(selectedService, quantity).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowOrderModal(false)}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePlaceOrder}
                  disabled={!link || quantity < selectedService.min || quantity > selectedService.max}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Place Order
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderServices;