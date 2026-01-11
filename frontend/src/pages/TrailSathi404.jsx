import React from 'react';
import { Home, MapPin, Users, MessageCircle, Mountain, TreePine, Compass } from 'lucide-react';
import { Link, Links } from 'react-router-dom';
import Lottie from 'lottie-react';
import notFoundAnimation from '../assets/404.json';

const TrailSathi404 = () => {
  return (
    <div className="min-h-screen bg-[#FAF9F6] flex flex-col items-center justify-center p-4 relative overflow-hidden select-none">
      
      {/* Decorative Birds (Subtle) */}
      <div className="absolute top-1/4 left-1/4 opacity-20 transform -translate-x-12 -translate-y-12">
        <svg width="60" height="40" viewBox="0 0 60 40" fill="none" xmlns="http://www.w3.org/2000/svg">
           <path d="M10 20 Q 20 5, 30 20 T 50 20" stroke="#2F3E46" strokeWidth="2" fill="none"/>
        </svg>
      </div>
      <div className="absolute top-1/3 right-1/4 opacity-15 transform translate-x-12">
        <svg width="40" height="30" viewBox="0 0 40 30" fill="none" xmlns="http://www.w3.org/2000/svg">
           <path d="M5 15 Q 15 5, 25 15 T 35 15" stroke="#2F3E46" strokeWidth="2" fill="none"/>
        </svg>
      </div>

      <div className="text-center z-10 w-full max-w-5xl mx-auto space-y-6">
        
        {/* MASKED 404 TEXT with LOTTIE */}
        <div className="flex items-center justify-center gap-2 sm:gap-4 md:gap-6">
          <span 
            className="text-[10rem] sm:text-[16rem] md:text-[20rem] font-bold leading-none tracking-tighter text-transparent bg-clip-text bg-center bg-cover select-none drop-shadow-sm"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1448375240586-dfd8d395ea6c?q=80&w=2940&auto=format&fit=crop')`,
              fontFamily: 'Inter, system-ui, sans-serif'
            }}
          >
            4
          </span>
          
          <div className="w-[8rem] h-[8rem] sm:w-[14rem] sm:h-[14rem] md:w-[18rem] md:h-[18rem] flex items-center justify-center">
             <Lottie animationData={notFoundAnimation} loop={true} className="w-full h-full" />
          </div>

          <span 
            className="text-[10rem] sm:text-[16rem] md:text-[20rem] font-bold leading-none tracking-tighter text-transparent bg-clip-text bg-center bg-cover select-none drop-shadow-sm"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1448375240586-dfd8d395ea6c?q=80&w=2940&auto=format&fit=crop')`,
              fontFamily: 'Inter, system-ui, sans-serif'
            }}
          >
            4
          </span>
        </div>
        
        <div className="space-y-8 relative -top-8 sm:-top-16">
            <h2 className="text-[#4A5D5E] text-xl sm:text-2xl font-light tracking-wide">
            Looks like you lost your way home
            </h2>

            <Link to="/">
                <button className="px-10 py-4 bg-[#6A4C6F] hover:bg-[#573d5c] text-white text-sm font-bold rounded-full tracking-widest uppercase transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                    Take Me Back
                </button>
            </Link>
        </div>

      </div>
      
       {/* Attribution tiny */}
       <div className="absolute bottom-4 text-[10px] text-gray-300">
        Photo by Unsplash
       </div>

    </div>
  );
};

export default TrailSathi404;