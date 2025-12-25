import React from 'react';
import { Mountain, Users, MapPin, Mail, Phone, Facebook, Instagram, Twitter, Youtube, Award } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white relative overflow-hidden">
      {/* Decorative Top Border */}
      <div className="h-1 bg-gradient-to-r from-green-500 via-blue-500 to-green-500"></div>
      
      {/* Footer Links Section */}
      <div className="relative py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            
            {/* Brand Section */}
            <div className="lg:col-span-1">
              <div className="flex items-center gap-2 mb-6">
                <Mountain className="w-8 h-8 text-green-500" />
                <h3 className="text-2xl font-bold text-white">TrailSathi</h3>
              </div>
              <p className="text-gray-400 mb-6 leading-relaxed text-sm">
                Connecting adventurous souls with breathtaking trails and unforgettable hiking experiences around Nepal.
              </p>
              
              {/* Social Links */}
              <div className="flex gap-3">
                <button 
                  aria-label="Facebook"
                  className="bg-gray-800 hover:bg-[#1877F2] p-3 rounded-lg transition-all duration-300 group"
                >
                  <Facebook className="w-5 h-5 text-gray-400 group-hover:text-white" />
                </button>
                <button 
                  aria-label="Instagram"
                  className="bg-gray-800 hover:bg-gradient-to-br hover:from-[#F58529] hover:via-[#E4405F] hover:to-[#C13584] p-3 rounded-lg transition-all duration-300 group"
                >
                  <Instagram className="w-5 h-5 text-gray-400 group-hover:text-white" />
                </button>
                <button 
                  aria-label="Twitter"
                  className="bg-gray-800 hover:bg-[#1DA1F2] p-3 rounded-lg transition-all duration-300 group"
                >
                  <Twitter className="w-5 h-5 text-gray-400 group-hover:text-white" />
                </button>
                <button 
                  aria-label="YouTube"
                  className="bg-gray-800 hover:bg-[#FF0000] p-3 rounded-lg transition-all duration-300 group"
                >
                  <Youtube className="w-5 h-5 text-gray-400 group-hover:text-white" />
                </button>
              </div>
            </div>

            {/* Discover Section */}
            <div>
              <h4 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-green-500" />
                Discover
              </h4>
              <ul className="space-y-3">
                {['Popular Trails', 'Local Hiking Groups', 'Trail Reviews', 'Difficulty Levels', 'Seasonal Hikes'].map((item) => (
                  <li key={item}>
                    <a 
                      href="#" 
                      className="text-gray-400 hover:text-green-500 transition-colors duration-300 text-sm hover:translate-x-1 transform inline-block"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Community Section */}
            <div>
              <h4 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
                <Users className="w-5 h-5 text-green-500" />
                Community
              </h4>
              <ul className="space-y-3">
                {['Join Groups', 'Create Events', 'Find Hiking Buddies', 'Share Experiences', 'Safety Tips'].map((item) => (
                  <li key={item}>
                    <a 
                      href="#" 
                      className="text-gray-400 hover:text-green-500 transition-colors duration-300 text-sm hover:translate-x-1 transform inline-block"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support Section */}
            <div>
              <h4 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
                <Award className="w-5 h-5 text-green-500" />
                Support
              </h4>
              
              {/* Contact Info */}
              <div className="space-y-4">
                <div className="flex items-start gap-3 text-gray-400">
                  <Mail className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <a href="mailto:amanxchau1@gmail.com" className="text-sm hover:text-green-500 transition-colors">
                    amanxchau1@gmail.com
                  </a>
                </div>
                <div className="flex items-start gap-3 text-gray-400">
                  <Phone className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <a href="tel:+9779810800087" className="text-sm hover:text-green-500 transition-colors">
                    +977 9810800087
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative bg-gray-950 py-6 px-6 border-t border-gray-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © 2025 TrailSathi. All rights reserved. Made with ❤️ for adventurers in Nepal.
          </p>
          <div className="flex gap-6 text-sm">
            <a href="#" className="text-gray-500 hover:text-green-500 transition-colors">Privacy Policy</a>
            <a href="#" className="text-gray-500 hover:text-green-500 transition-colors">Terms of Service</a>
            <a href="#" className="text-gray-500 hover:text-green-500 transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}