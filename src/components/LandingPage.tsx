import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Users, Heart, Eye, MessageCircle, Shield } from 'lucide-react';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-blue-600 mr-2" />
              <span className="text-xl font-bold text-gray-900">Viral Wallet</span>
            </div>
            <div className="flex space-x-4">
              <Link
                to="/login"
                className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Create Free Account
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-6">
            Boost Your Social Media
            <span className="text-blue-600 block">Growth Instantly</span>
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            Get followers, likes, views and pay for your utilities — all in one powerful platform.
            Start growing your social media presence today with our premium services.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-all transform hover:scale-105 shadow-lg"
            >
              Create Free Account
            </Link>
            <Link
              to="/login"
              className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold border-2 border-blue-600 hover:bg-blue-50 transition-all transform hover:scale-105 shadow-lg"
            >
              Login
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose Viral Wallet?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We provide high-quality social media marketing services across all major platforms
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-lg transition-all">
              <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Real Followers</h3>
              <p className="text-gray-600">Get genuine followers that engage with your content and boost your social proof</p>
            </div>
            
            <div className="text-center p-8 rounded-xl bg-gradient-to-br from-yellow-50 to-yellow-100 hover:shadow-lg transition-all">
              <Heart className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Instant Likes</h3>
              <p className="text-gray-600">Boost your posts with authentic likes that improve your content visibility</p>
            </div>
            
            <div className="text-center p-8 rounded-xl bg-gradient-to-br from-green-50 to-green-100 hover:shadow-lg transition-all">
              <Eye className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Video Views</h3>
              <p className="text-gray-600">Increase your video reach with high-quality views from real users</p>
            </div>
          </div>
        </div>
      </div>

      {/* Platforms Section */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Supported Platforms
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We support all major social media platforms to help you grow everywhere
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {['Instagram', 'TikTok', 'YouTube', 'Twitter', 'Telegram', 'Facebook'].map((platform) => (
              <div key={platform} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all text-center">
                <div className="text-2xl font-bold text-blue-600 mb-2">{platform}</div>
                <p className="text-sm text-gray-600">Premium services available</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Go Viral?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who have boosted their social media presence with Viral Wallet
          </p>
          <Link
            to="/register"
            className="bg-yellow-400 text-gray-900 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-yellow-300 transition-all transform hover:scale-105 shadow-lg"
          >
            Get Started Now
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <TrendingUp className="h-8 w-8 text-blue-400 mr-2" />
              <span className="text-xl font-bold">Viral Wallet</span>
            </div>
            <div className="flex items-center space-x-4">
              <Shield className="h-5 w-5 text-blue-400" />
              <span className="text-gray-300">Secure & Reliable Platform</span>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Viral Wallet. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;