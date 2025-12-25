import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

export default function UpgradeSection() {
  const navigate = useNavigate();

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="relative bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl overflow-hidden min-h-[500px] flex items-center">
          {/* Background Image */}
          <div className="absolute inset-0">
            <img
              src="/upgradesection.png"
              alt="Happy hikers enjoying the outdoors"
              className="w-full h-full object-cover"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/5 to-transparent"></div>
          </div>

          {/* Content */}
          <div className="relative z-10 p-8 lg:p-16 max-w-2xl">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-6">
              <Sparkles className="w-6 h-6 text-blue-600" />
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Upgrade your adventures
            </h2>
            
            <p className="text-gray-900 text-base md:text-lg leading-relaxed mb-8 max-w-lg">
              Whether you want to explore offline or create your own route, choose the membership that helps you make the most of every minute outdoors.
            </p>
            
            <button
              onClick={() => navigate('/payments')}
              className="inline-block bg-green-500 hover:bg-green-600 text-white font-semibold px-8 py-3 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Compare plans
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
