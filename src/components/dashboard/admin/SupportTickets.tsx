import React, { useState } from 'react';
import { MessageCircle, Search, Clock, CheckCircle, Send, Eye } from 'lucide-react';
import { mockSupportTickets, updateSupportTicketStatus } from '../../../services/mockData';
import { SupportTicket } from '../../../types';

const SupportTickets: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [replyMessage, setReplyMessage] = useState('');

  const filteredTickets = mockSupportTickets
    .filter(ticket => {
      const matchesSearch = ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           ticket.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           ticket.id.includes(searchTerm);
      const matchesStatus = filterStatus === 'all' || ticket.status === filterStatus;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const handleReply = (ticketId: string, reply: string) => {
    updateSupportTicketStatus(ticketId, 'closed', reply);
    setReplyMessage('');
    setShowDetailsModal(false);
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
      case 'open':
        return 'bg-yellow-100 text-yellow-800';
      case 'closed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const totalTickets = mockSupportTickets.length;
  const openTickets = mockSupportTickets.filter(t => t.status === 'open').length;
  const closedTickets = mockSupportTickets.filter(t => t.status === 'closed').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Support Tickets</h1>
          <p className="text-gray-600 mt-1">Manage customer support requests</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-200">
            <p className="text-sm text-gray-600">Open Tickets</p>
            <p className="text-lg font-bold text-yellow-600">{openTickets}</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{totalTickets}</div>
            <div className="text-sm text-gray-600">Total Tickets</div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">{openTickets}</div>
            <div className="text-sm text-gray-600">Open Tickets</div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{closedTickets}</div>
            <div className="text-sm text-gray-600">Closed Tickets</div>
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
                placeholder="Search tickets..."
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
              <option value="open">Open</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tickets List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="divide-y divide-gray-200">
          {filteredTickets.length > 0 ? (
            filteredTickets.map((ticket) => (
              <div key={ticket.id} className="p-6 hover:bg-gray-50 transition-all">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="bg-blue-100 rounded-full p-3">
                      <MessageCircle className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">{ticket.subject}</h3>
                        <span className={`inline-flex px-2 py-1 text-xs rounded-full font-medium ${getStatusColor(ticket.status)} ml-4`}>
                          <div className="flex items-center">
                            {ticket.status === 'open' ? (
                              <Clock className="h-3 w-3 mr-1" />
                            ) : (
                              <CheckCircle className="h-3 w-3 mr-1" />
                            )}
                            {ticket.status}
                          </div>
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">From: {ticket.userName}</p>
                      <p className="text-sm text-gray-800 mb-3 line-clamp-2">{ticket.message}</p>
                      {ticket.reply && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                          <p className="text-sm text-blue-900">
                            <strong>Admin Reply:</strong> {ticket.reply}
                          </p>
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">{formatDate(ticket.createdAt)}</span>
                        <button
                          onClick={() => {
                            setSelectedTicket(ticket);
                            setShowDetailsModal(true);
                          }}
                          className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700 transition-all flex items-center"
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          {ticket.status === 'open' ? 'Reply' : 'View'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No support tickets found</h3>
              <p className="text-gray-600">Support tickets will appear here</p>
            </div>
          )}
        </div>
      </div>

      {/* Ticket Details Modal */}
      {showDetailsModal && selectedTicket && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">Support Ticket Details</h3>
                <span className={`inline-flex px-2 py-1 text-xs rounded-full font-medium ${getStatusColor(selectedTicket.status)}`}>
                  {selectedTicket.status}
                </span>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ticket ID</label>
                  <div className="text-sm text-gray-900">#{selectedTicket.id}</div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
                  <div className="text-sm text-gray-900">{selectedTicket.userName}</div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                  <div className="text-sm text-gray-900">{selectedTicket.subject}</div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                    <p className="text-sm text-gray-900">{selectedTicket.message}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Created</label>
                  <div className="text-sm text-gray-900">{formatDate(selectedTicket.createdAt)}</div>
                </div>

                {selectedTicket.reply && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Admin Reply</label>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <p className="text-sm text-blue-900">{selectedTicket.reply}</p>
                    </div>
                  </div>
                )}

                {selectedTicket.status === 'open' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Reply to Customer</label>
                    <textarea
                      rows={4}
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      placeholder="Type your reply here..."
                    />
                  </div>
                )}
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-all"
                >
                  Close
                </button>
                {selectedTicket.status === 'open' && (
                  <button
                    onClick={() => handleReply(selectedTicket.id, replyMessage)}
                    disabled={!replyMessage.trim()}
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Send Reply & Close
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupportTickets;