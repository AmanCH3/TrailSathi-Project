import React from 'react';
import { Home, MapPin, Users, MessageCircle, Mountain, TreePine, Compass } from 'lucide-react';
import { Link, Links } from 'react-router-dom';

const TrailSathi404 = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 text-green-200 opacity-30">
          <TreePine size={48} />
        </div>
        <div className="absolute top-20 right-20 text-blue-200 opacity-30">
          <Mountain size={56} />
        </div>
        <div className="absolute bottom-20 left-20 text-emerald-200 opacity-30">
          <Compass size={40} />
        </div>
        <div className="absolute bottom-10 right-10 text-green-200 opacity-30">
          <TreePine size={44} />
        </div>
      </div>

      <div className="relative z-10 text-center max-w-2xl mx-auto">
        {/* Main illustration */}
        <div className="mb-8 relative">
          <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full shadow-2xl mb-4">
            <Mountain className="text-white" size={48} />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-orange-400 rounded-full flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-sm">!</span>
          </div>
        </div>

        {/* Error message */}
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
          <h2 className="text-3xl font-semibold text-gray-700 mb-4">Trail Not Found</h2>
          <p className="text-gray-600 text-lg leading-relaxed mb-6">
            Looks like you've wandered off the beaten path! The trail you're looking for doesn't exist, 
            but don't worry – every great hiker knows that getting lost sometimes leads to the best discoveries.
          </p>
        </div>

        {/* Action buttons */}
        <div className="space-y-4 mb-8">
            <Link to = "/">
          <button className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-lg shadow-lg hover:from-green-700 hover:to-emerald-700 transform hover:scale-105 transition-all duration-200">
            <Home className="mr-2" size={20} />
            Back to Base Camp
          </button>
            </Link>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to = "/trails">
            <button className="inline-flex items-center justify-center px-6 py-3 bg-white text-green-600 font-medium rounded-lg shadow-md hover:shadow-lg border-2 border-green-600 hover:bg-green-50 transition-all duration-200">
              <MapPin className="mr-2" size={18} />
              Find Trails
            </button>
            </Link>
            
             <Link to = "/groups">
            <button className="inline-flex items-center justify-center px-6 py-3 bg-white text-blue-600 font-medium rounded-lg shadow-md hover:shadow-lg border-2 border-blue-600 hover:bg-blue-50 transition-all duration-200">
              <Users className="mr-2" size={18} />
              Join Groups
            </button>
             </Link>
            
         
          </div>
        </div>

        {/* Inspirational quote */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-green-100">
          <blockquote className="text-gray-700 italic text-lg mb-2">
            "Not all those who wander are lost."
          </blockquote>
          <cite className="text-green-600 font-medium">– J.R.R. Tolkien</cite>
        </div>

        {/* Footer */}
        <div className="mt-8 text-gray-500 text-sm">
          <p>Need help finding your way? Contact our trail guides at support@TrailSathi.com</p>
        </div>
      </div>

      {/* Floating elements animation */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-green-400 rounded-full opacity-60 animate-pulse"></div>
        <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-blue-400 rounded-full opacity-40 animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-emerald-400 rounded-full opacity-50 animate-pulse delay-500"></div>
      </div>
    </div>
  );
};

export default TrailSathi404;