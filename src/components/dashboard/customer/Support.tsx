import React, { useState } from 'react';
import { MessageCircle, Send, Clock, CheckCircle } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { addSupportTicket, mockSupportTickets } from '../../../services/mockData';

const Support: React.FC = () => {
  const { user } = useAuth();
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const userTickets = mockSupportTickets
    .filter(ticket => ticket.userId === user?.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !subject.trim() || !message.trim()) {
      alert('Please fill in all fields');
      return;
    }

    const newTicket = {
      id: Date.now().toString(),
      userId: user.id,
      userName: user.name,
      subject: subject.trim(),
      message: message.trim(),
      status: 'open' as const,
      createdAt: new Date().toISOString()
    };

    addSupportTicket(newTicket);
    
    setSubject('');
    setMessage('');
    setSubmitSuccess(true);
    setTimeout(() => setSubmitSuccess(false), 3000);
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Support</h1>
        <p className="text-gray-600 mt-1">Get help with your orders and account</p>
      </div>

      {/* Success Message */}
      {submitSuccess && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
          <div className="flex items-center">
            <MessageCircle className="h-5 w-5 mr-2" />
            Support ticket submitted successfully! We'll get back to you soon.
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Create Ticket Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Send className="h-5 w-5 mr-2" />
            Create Support Ticket
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                Subject
              </label>
              <input
                type="text"
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Brief description of your issue"
                required
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                Message
              </label>
              <textarea
                id="message"
                rows={6}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Describe your issue in detail..."
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-all flex items-center justify-center"
            >
              <Send className="h-4 w-4 mr-2" />
              Submit Ticket
            </button>
          </form>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Frequently Asked Questions</h2>
          
          <div className="space-y-4">
            <div className="border-b border-gray-200 pb-4">
              <h3 className="font-medium text-gray-900 mb-2">How long does order processing take?</h3>
              <p className="text-sm text-gray-600">Most orders are completed within 5-30 minutes after being processed. Processing time depends on the service type and quantity.</p>
            </div>
            
            <div className="border-b border-gray-200 pb-4">
              <h3 className="font-medium text-gray-900 mb-2">How do I top up my wallet?</h3>
              <p className="text-sm text-gray-600">Go to the Wallet section, select an amount, make payment via bank transfer, and upload your payment proof. Our team will approve it within a few hours.</p>
            </div>
            
            <div className="border-b border-gray-200 pb-4">
              <h3 className="font-medium text-gray-900 mb-2">What if my order doesn't complete?</h3>
              <p className="text-sm text-gray-600">If your order fails or doesn't complete as expected, contact our support team with your order details. We'll either retry the order or refund your wallet.</p>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Are the followers/likes real?</h3>
              <p className="text-sm text-gray-600">We provide high-quality services with real-looking profiles. However, for best results, combine our services with organic content and engagement strategies.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Ticket History */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Your Support Tickets</h2>
        </div>
        <div className="p-6">
          {userTickets.length > 0 ? (
            <div className="space-y-4">
              {userTickets.map((ticket) => (
                <div key={ticket.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <h3 className="font-medium text-gray-900 mr-3">{ticket.subject}</h3>
                        <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                          ticket.status === 'open' 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
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
                      <p className="text-sm text-gray-600 mb-2">{ticket.message}</p>
                      {ticket.reply && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-3">
                          <p className="text-sm text-blue-900">
                            <strong>Admin Reply:</strong> {ticket.reply}
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="text-right text-sm text-gray-500">
                      {formatDate(ticket.createdAt)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No support tickets</h3>
              <p className="text-gray-600">Your support requests will appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Support;