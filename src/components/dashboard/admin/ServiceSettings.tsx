import React, { useState } from 'react';
import { Settings, Plus, Edit, Trash2, Search, Filter } from 'lucide-react';
import { mockServices } from '../../../services/mockData';
import { Service } from '../../../types';

const ServiceSettings: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPlatform, setFilterPlatform] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isAddMode, setIsAddMode] = useState(false);

  const platforms = ['all', ...Array.from(new Set(mockServices.map(s => s.platform)))];
  
  const filteredServices = mockServices.filter(service => {
    const matchesSearch = service.platform.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.serviceType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPlatform = filterPlatform === 'all' || service.platform === filterPlatform;
    const matchesStatus = filterStatus === 'all' || service.status === filterStatus;
    return matchesSearch && matchesPlatform && matchesStatus;
  });

  const handleEdit = (service: Service) => {
    setSelectedService(service);
    setIsAddMode(false);
    setShowEditModal(true);
  };

  const handleAdd = () => {
    setSelectedService({
      id: '',
      platform: '',
      serviceType: '',
      pricePer1000: 0,
      min: 0,
      max: 0,
      status: 'active'
    });
    setIsAddMode(true);
    setShowEditModal(true);
  };

  const handleSave = () => {
    // In a real app, this would save to the backend
    console.log('Saving service:', selectedService);
    setShowEditModal(false);
    // For demo purposes, we'll just close the modal
  };

  const handleDelete = (serviceId: string) => {
    if (confirm('Are you sure you want to delete this service?')) {
      // In a real app, this would delete from the backend
      console.log('Deleting service:', serviceId);
    }
  };

  const activeServices = mockServices.filter(s => s.status === 'active').length;
  const inactiveServices = mockServices.filter(s => s.status === 'inactive').length;
  const totalServices = mockServices.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Service Settings</h1>
          <p className="text-gray-600 mt-1">Manage available social media services</p>
        </div>
        <button
          onClick={handleAdd}
          className="mt-4 sm:mt-0 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all inline-flex items-center"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Service
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{totalServices}</div>
            <div className="text-sm text-gray-600">Total Services</div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{activeServices}</div>
            <div className="text-sm text-gray-600">Active Services</div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{inactiveServices}</div>
            <div className="text-sm text-gray-600">Inactive Services</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
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
                value={filterPlatform}
                onChange={(e) => setFilterPlatform(e.target.value)}
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
          <div className="sm:w-48">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
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
                <span className={`inline-flex px-2 py-1 text-xs rounded-full font-medium ${
                  service.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {service.status}
                </span>
              </div>
              
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-600">Service:</span>
                  <span className="ml-2 text-sm text-gray-900">{service.serviceType}</span>
                </div>
                
                <div>
                  <span className="text-sm font-medium text-gray-600">Price per 1K:</span>
                  <span className="ml-2 text-sm font-bold text-gray-900">₦{service.pricePer1000.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between">
                  <div>
                    <span className="text-sm font-medium text-gray-600">Min:</span>
                    <span className="ml-2 text-sm text-gray-900">{service.min.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Max:</span>
                    <span className="ml-2 text-sm text-gray-900">{service.max.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => handleEdit(service)}
                  className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-all text-sm flex items-center justify-center"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(service.id)}
                  className="bg-red-600 text-white py-2 px-3 rounded-lg hover:bg-red-700 transition-all text-sm"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredServices.length === 0 && (
        <div className="text-center py-12">
          <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No services found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria</p>
        </div>
      )}

      {/* Edit/Add Service Modal */}
      {showEditModal && selectedService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {isAddMode ? 'Add New Service' : 'Edit Service'}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Platform</label>
                  <input
                    type="text"
                    value={selectedService.platform}
                    onChange={(e) => setSelectedService({...selectedService, platform: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Instagram"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Service Type</label>
                  <input
                    type="text"
                    value={selectedService.serviceType}
                    onChange={(e) => setSelectedService({...selectedService, serviceType: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Followers"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price per 1000</label>
                  <input
                    type="number"
                    value={selectedService.pricePer1000}
                    onChange={(e) => setSelectedService({...selectedService, pricePer1000: parseInt(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., 2500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Min Quantity</label>
                    <input
                      type="number"
                      value={selectedService.min}
                      onChange={(e) => setSelectedService({...selectedService, min: parseInt(e.target.value) || 0})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., 100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Max Quantity</label>
                    <input
                      type="number"
                      value={selectedService.max}
                      onChange={(e) => setSelectedService({...selectedService, max: parseInt(e.target.value) || 0})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., 50000"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={selectedService.status}
                    onChange={(e) => setSelectedService({...selectedService, status: e.target.value as 'active' | 'inactive'})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-all"
                >
                  {isAddMode ? 'Add Service' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceSettings;