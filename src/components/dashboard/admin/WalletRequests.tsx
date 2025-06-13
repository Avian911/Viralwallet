import React, { useState } from 'react';
import { CreditCard, Search, CheckCircle, XCircle, Clock, Eye } from 'lucide-react';
import { mockWalletRequests, mockUsers, updateWalletRequestStatus, updateUserBalance } from '../../../services/mockData';
import { WalletRequest } from '../../../types';

const WalletRequests: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedRequest, setSelectedRequest] = useState<WalletRequest | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const filteredRequests = mockWalletRequests
    .filter(request => {
      const matchesSearch = request.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           request.id.includes(searchTerm);
      const matchesStatus = filterStatus === 'all' || request.status === filterStatus;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const handleApprove = (requestId: string, amount: number, userId: string) => {
    // Update request status
    updateWalletRequestStatus(requestId, 'approved');
    
    // Update user balance
    const user = mockUsers.find(u => u.id === userId);
    if (user) {
      updateUserBalance(userId, user.balance + amount);
    }
    
    // Refresh the page to show changes
    window.location.reload();
  };

  const handleDecline = (requestId: string) => {
    updateWalletRequestStatus(requestId, 'declined');
    // Refresh the page to show changes
    window.location.reload();
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'declined':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const totalRequests = mockWalletRequests.length;
  const pendingRequests = mockWalletRequests.filter(r => r.status === 'pending').length;
  const approvedRequests = mockWalletRequests.filter(r => r.status === 'approved').length;
  const totalAmount = mockWalletRequests
    .filter(r => r.status === 'approved')
    .reduce((sum, request) => sum + request.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Wallet Requests</h1>
          <p className="text-gray-600 mt-1">Review and approve wallet top-up requests</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-200">
            <p className="text-sm text-gray-600">Pending Requests</p>
            <p className="text-lg font-bold text-yellow-600">{pendingRequests}</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{totalRequests}</div>
            <div className="text-sm text-gray-600">Total Requests</div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">{pendingRequests}</div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{approvedRequests}</div>
            <div className="text-sm text-gray-600">Approved</div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">₦{totalAmount.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Total Approved</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search requests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="sm:w-48">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="declined">Declined</option>
            </select>
          </div>
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Request ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRequests.map((request) => {
                const user = mockUsers.find(u => u.id === request.userId);
                return (
                  <tr key={request.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="bg-blue-100 rounded-full p-2 mr-3">
                          <CreditCard className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">#{request.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{request.userName}</div>
                      <div className="text-sm text-gray-500">{user?.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-gray-900">₦{request.amount.toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs rounded-full font-medium ${getStatusColor(request.status)}`}>
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(request.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setSelectedRequest(request);
                            setShowDetailsModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 p-1 rounded"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        {request.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleApprove(request.id, request.amount, request.userId)}
                              className="text-green-600 hover:text-green-900 bg-green-50 hover:bg-green-100 p-1 rounded"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDecline(request.id)}
                              className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 p-1 rounded"
                            >
                              <XCircle className="h-4 w-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredRequests.length === 0 && (
          <div className="text-center py-12">
            <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No wallet requests found</h3>
            <p className="text-gray-600">Wallet top-up requests will appear here</p>
          </div>
        )}
      </div>

      {/* Request Details Modal */}
      {showDetailsModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Wallet Request Details</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Request ID</label>
                  <div className="text-sm text-gray-900">#{selectedRequest.id}</div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
                  <div className="text-sm text-gray-900">{selectedRequest.userName}</div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                  <div className="text-lg font-bold text-gray-900">₦{selectedRequest.amount.toLocaleString()}</div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <span className={`inline-flex px-2 py-1 text-xs rounded-full font-medium ${getStatusColor(selectedRequest.status)}`}>
                    {selectedRequest.status.charAt(0).toUpperCase() + selectedRequest.status.slice(1)}
                  </span>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Request Date</label>
                  <div className="text-sm text-gray-900">{formatDate(selectedRequest.createdAt)}</div>
                </div>

                {selectedRequest.processedAt && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Processed Date</label>
                    <div className="text-sm text-gray-900">{formatDate(selectedRequest.processedAt)}</div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Payment Proof</label>
                  <div className="border border-gray-200 rounded-lg p-3">
                    <img
                      src={selectedRequest.proofImage}
                      alt="Payment proof"
                      className="w-full h-40 object-cover rounded"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.pexels.com/photos/164527/pexels-photo-164527.jpeg';
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-all"
                >
                  Close
                </button>
                {selectedRequest.status === 'pending' && (
                  <>
                    <button
                      onClick={() => {
                        handleDecline(selectedRequest.id);
                        setShowDetailsModal(false);
                      }}
                      className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-all"
                    >
                      Decline
                    </button>
                    <button
                      onClick={() => {
                        handleApprove(selectedRequest.id, selectedRequest.amount, selectedRequest.userId);
                        setShowDetailsModal(false);
                      }}
                      className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-all"
                    >
                      Approve
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletRequests;