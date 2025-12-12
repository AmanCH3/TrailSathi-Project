import React from 'react';
import { Mountain, Users, MapPin, Calendar, Mail, Phone, Facebook, Instagram, Twitter, Youtube, Star, Award, Shield } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-green-800 via-green-700 to-green-600 relative overflow-hidden">
      {/* Footer Links Section */}
      <div className="relative py-10 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            
            {/* Brand Section */}
            <div className="lg:col-span-1">
              <div className="flex items-center gap-2 mb-6">
                <Mountain className="w-8 h-8 text-yellow-400" />
                <h3 className="text-2xl font-bold text-white">Hike Hub</h3>
              </div>
              <p className="text-white/80 mb-6 leading-relaxed">
                Connecting adventurous souls with breathtaking trails and unforgettable hiking experiences around the world.
              </p>
              
              {/* Social Links */}
              <div className="flex gap-4">
                {[Facebook, Instagram, Twitter, Youtube].map((Icon, index) => (
                  <button key={index} className="bg-white/20 hover:bg-yellow-500 p-3 rounded-full transition-all duration-300 group">
                    <Icon className="w-5 h-5 text-white group-hover:text-white" />
                  </button>
                ))}
              </div>
            </div>

            {/* Discover Section */}
            <div>
              <h4 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-yellow-400" />
                Discover
              </h4>
              <ul className="space-y-3">
                {['Popular Trails', 'Local Hiking Groups', 'Trail Reviews', 'Difficulty Levels', 'Seasonal Hikes',].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-white/80 hover:text-yellow-400 transition-colors duration-300 hover:translate-x-1 transform inline-block">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Community Section */}
            <div>
              <h4 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
                <Users className="w-5 h-5 text-yellow-400" />
                Community
              </h4>
              <ul className="space-y-3">
                {['Join Groups', 'Create Events', 'Find Hiking Buddies', 'Share Experiences', 'Safety Tips', ].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-white/80 hover:text-yellow-400 transition-colors duration-300 hover:translate-x-1 transform inline-block">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support Section */}
            <div>
              <h4 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-400" />
                Support
              </h4>
              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-white/80">
                  <Mail className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm">amanxchau1@gmail.com</span>
                </div>
                <div className="flex items-center gap-3 text-white/80">
                  <Phone className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm">9810800087</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative bg-green-900 py-6 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/70 text-sm">
            © 2025 Hike Hub. All rights reserved. Made with ❤️ for adventurers worldwide.
          </p>
          <div className="flex gap-6 text-sm">
            <a href="#" className="text-white/70 hover:text-yellow-400 transition-colors">Privacy</a>
            <a href="#" className="text-white/70 hover:text-yellow-400 transition-colors">Terms</a>
            <a href="#" className="text-white/70 hover:text-yellow-400 transition-colors">Cookies</a>
            <a href="#" className="text-white/70 hover:text-yellow-400 transition-colors">Accessibility</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
