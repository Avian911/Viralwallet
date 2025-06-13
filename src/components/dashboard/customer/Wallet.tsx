import React, { useState } from 'react';
import { Wallet as WalletIcon, Plus, Upload, History } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { addWalletRequest } from '../../../services/mockData';

const Wallet: React.FC = () => {
  const { user } = useAuth();
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState<number>(0);
  const [customAmount, setCustomAmount] = useState('');
  const [proofImage, setProofImage] = useState<File | null>(null);
  const [proofImageUrl, setProofImageUrl] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const presetAmounts = [1000, 5000, 10000, 50000];

  const handleTopUpSubmit = () => {
    if (!user) return;

    const amount = selectedAmount || parseInt(customAmount);
    if (!amount || amount < 500) {
      alert('Minimum top-up amount is ₦500');
      return;
    }

    if (!proofImageUrl && !proofImage) {
      alert('Please upload payment proof');
      return;
    }

    const newRequest = {
      id: Date.now().toString(),
      userId: user.id,
      userName: user.name,
      amount,
      proofImage: proofImageUrl || 'uploaded-proof.jpg',
      status: 'pending' as const,
      createdAt: new Date().toISOString()
    };

    addWalletRequest(newRequest);
    
    setShowTopUpModal(false);
    setSelectedAmount(0);
    setCustomAmount('');
    setProofImage(null);
    setProofImageUrl('');
    setSubmitSuccess(true);
    setTimeout(() => setSubmitSuccess(false), 3000);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProofImage(file);
      // In a real app, you would upload to a server here
      setProofImageUrl(`uploaded-${Date.now()}.jpg`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Wallet</h1>
          <p className="text-gray-600 mt-1">Manage your wallet balance and transactions</p>
        </div>
        <button
          onClick={() => setShowTopUpModal(true)}
          className="mt-4 sm:mt-0 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all inline-flex items-center"
        >
          <Plus className="h-5 w-5 mr-2" />
          Top Up Wallet
        </button>
      </div>

      {/* Success Message */}
      {submitSuccess && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
          <div className="flex items-center">
            <WalletIcon className="h-5 w-5 mr-2" />
            Top-up request submitted successfully! It will be reviewed by admin.
          </div>
        </div>
      )}

      {/* Balance Card */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl text-white p-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-100 mb-2">Current Balance</p>
            <p className="text-4xl font-bold">₦{user?.balance.toLocaleString()}</p>
          </div>
          <div className="bg-blue-500 rounded-full p-4">
            <WalletIcon className="h-8 w-8" />
          </div>
        </div>
      </div>

      {/* Quick Top-up Options */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Top-up</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {presetAmounts.map((amount) => (
            <button
              key={amount}
              onClick={() => {
                setSelectedAmount(amount);
                setShowTopUpModal(true);
              }}
              className="bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-lg p-4 text-center transition-all"
            >
              <div className="text-lg font-bold text-gray-900">₦{amount.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Top up</div>
            </button>
          ))}
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <History className="h-5 w-5 mr-2" />
            Transaction History
          </h2>
        </div>
        <div className="p-6">
          <div className="text-center py-8">
            <WalletIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions yet</h3>
            <p className="text-gray-600">Your wallet transactions will appear here</p>
          </div>
        </div>
      </div>

      {/* Top-up Modal */}
      {showTopUpModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Top Up Wallet</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount
                  </label>
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    {presetAmounts.map((amount) => (
                      <button
                        key={amount}
                        onClick={() => {
                          setSelectedAmount(amount);
                          setCustomAmount('');
                        }}
                        className={`p-2 rounded-lg border text-sm font-medium transition-all ${
                          selectedAmount === amount
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        ₦{amount.toLocaleString()}
                      </button>
                    ))}
                  </div>
                  <input
                    type="number"
                    placeholder="Or enter custom amount"
                    value={customAmount}
                    onChange={(e) => {
                      setCustomAmount(e.target.value);
                      setSelectedAmount(0);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Proof
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-2">Upload payment receipt/screenshot</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="proof-upload"
                    />
                    <label
                      htmlFor="proof-upload"
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm cursor-pointer hover:bg-blue-700 transition-all"
                    >
                      Choose File
                    </label>
                    {proofImage && (
                      <p className="text-sm text-green-600 mt-2">File uploaded: {proofImage.name}</p>
                    )}
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-sm text-yellow-800">
                    <strong>Payment Instructions:</strong>
                    <br />Transfer to: Bank XYZ, Account: 1234567890
                    <br />Upload proof after payment for approval.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowTopUpModal(false)}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleTopUpSubmit}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-all"
                >
                  Submit Request
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Wallet;