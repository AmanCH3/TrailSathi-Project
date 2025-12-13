import React, { useState } from 'react';
import { 
  MapPin, 
  Users2, 
  CheckCheck, 
  Award, 
  Camera, 
  Navigation,
  MessageCircle,
  TrendingUp,
  Shield,
  Calendar,
  Star,
  ArrowRight
} from "lucide-react";

const features = [
  {
    icon: <MapPin className="h-7 w-7 text-emerald-600" />,
    title: "Smart Trail Discovery",
    description: "AI-powered recommendations based on your skill level, preferences, and weather conditions.",
    details: "Advanced filtering by elevation, duration, scenery type, and crowd levels",
    stats: "2,500+ trails",
    color: "emerald"
  },
  {
    icon: <Users2 className="h-7 w-7 text-blue-600" />,
    title: "Community Groups",
    description: "Join local hiking communities or create your own group with integrated event planning.",
    details: "Real-time chat, skill matching, and safety check-ins",
    stats: "15,000+ active members",
    color: "blue"
  },
  {
    icon: <CheckCheck className="h-7 w-7 text-purple-600" />,
    title: "Smart Packing Lists",
    description: "Dynamic checklists that adapt to weather, trail difficulty, and duration.",
    details: "Gear recommendations, weight optimization, and sharing features",
    stats: "50+ preset lists",
    color: "purple"
  },
  {
    icon: <Award className="h-7 w-7 text-orange-600" />,
    title: "Achievement System",
    description: "Gamified progress tracking with badges, milestones, and leaderboards.",
    details: "Distance goals, elevation challenges, and seasonal achievements",
    stats: "100+ badges available",
    color: "orange"
  },
  // {
  //   icon: <Camera className="h-7 w-7 text-pink-600" />,
  //   title: "Photo Challenges",
  //   description: "Weekly photography challenges to capture and share your hiking moments.",
  //   details: "Community voting, featured photos, and monthly winners",
  //   stats: "10k+ photos shared",
  //   color: "pink"
  // },
  // {
  //   icon: <Navigation className="h-7 w-7 text-indigo-600" />,
  //   title: "GPS Navigation",
  //   description: "Offline maps with turn-by-turn navigation and emergency location sharing.",
  //   details: "Breadcrumb trails, waypoint marking, and SOS functionality",
  //   stats: "99.9% accuracy",
  //   color: "indigo"
  // },
  // {
  //   icon: <MessageCircle className="h-7 w-7 text-green-600" />,
  //   title: "Trail Reports",
  //   description: "Real-time trail conditions and reviews from the hiking community.",
  //   details: "Weather updates, closures, and difficulty ratings",
  //   stats: "500+ daily updates",
  //   color: "green"
  // },
  // {
  //   icon: <TrendingUp className="h-7 w-7 text-red-600" />,
  //   title: "Performance Analytics",
  //   description: "Comprehensive stats tracking your hiking progress and fitness improvements.",
  //   details: "Heart rate zones, calorie burn, and personal records",
  //   stats: "12 metrics tracked",
  //   color: "red"
  // }
];

const colorVariants = {
  emerald: {
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    gradient: "from-emerald-500 to-emerald-600",
    text: "text-emerald-600"
  },
  blue: {
    bg: "bg-blue-50",
    border: "border-blue-200",
    gradient: "from-blue-500 to-blue-600",
    text: "text-blue-600"
  },
  purple: {
    bg: "bg-purple-50",
    border: "border-purple-200",
    gradient: "from-purple-500 to-purple-600",
    text: "text-purple-600"
  },
  orange: {
    bg: "bg-orange-50",
    border: "border-orange-200",
    gradient: "from-orange-500 to-orange-600",
    text: "text-orange-600"
  },
  pink: {
    bg: "bg-pink-50",
    border: "border-pink-200",
    gradient: "from-pink-500 to-pink-600",
    text: "text-pink-600"
  },
  indigo: {
    bg: "bg-indigo-50",
    border: "border-indigo-200",
    gradient: "from-indigo-500 to-indigo-600",
    text: "text-indigo-600"
  },
  green: {
    bg: "bg-green-50",
    border: "border-green-200",
    gradient: "from-green-500 to-green-600",
    text: "text-green-600"
  },
  red: {
    bg: "bg-red-50",
    border: "border-red-200",
    gradient: "from-red-500 to-red-600",
    text: "text-red-600"
  }
};

const HikeFeatures = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <section className="bg-gradient-to-br from-slate-50 via-white to-slate-50 py-24 px-6 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(16,185,129,0.1),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(59,130,246,0.1),transparent_50%)]"></div>
      
      <div className="max-w-7xl mx-auto relative">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-100 to-blue-100 px-4 py-2 rounded-full mb-6">
            <Star className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium text-slate-700">Professional Features</span>
          </div>
          
          <h2 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
            Everything You Need for
            <span className="block bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Epic Adventures
            </span>
          </h2>
          
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Professional-grade tools designed for serious hikers. From AI-powered trail discovery 
            to comprehensive analytics, we've got every aspect of your hiking journey covered.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => {
            const colors = colorVariants[feature.color];
            const isHovered = hoveredIndex === index;
            
            return (
              <div
                key={index}
                className={`
                  group relative bg-white rounded-2xl shadow-sm border border-slate-200 p-6 
                  hover:shadow-xl hover:border-slate-300 transition-all duration-500 ease-out
                  transform hover:-translate-y-2 cursor-pointer overflow-hidden
                  ${isHovered ? 'scale-105' : ''}
                `}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Gradient Background on Hover */}
                <div className={`
                  absolute inset-0 bg-gradient-to-br ${colors.gradient} opacity-0 
                  group-hover:opacity-5 transition-opacity duration-500
                `}></div>
                
                {/* Icon Container */}
                <div className={`
                  relative ${colors.bg} ${colors.border} border-2 rounded-2xl p-4 w-fit mb-6
                  group-hover:scale-110 transition-transform duration-300
                `}>
                  {feature.icon}
                </div>

                {/* Content */}
                <div className="relative">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-slate-800">
                      {feature.title}
                    </h3>
                    <ArrowRight className={`
                      h-5 w-5 ${colors.text} opacity-0 group-hover:opacity-100 
                      transform translate-x-0 group-hover:translate-x-1 transition-all duration-300
                    `} />
                  </div>
                  
                  <p className="text-slate-600 text-sm leading-relaxed mb-4">
                    {feature.description}
                  </p>
                  
                  {/* Additional Details */}
                  <div className={`
                    text-xs text-slate-500 mb-4 opacity-0 group-hover:opacity-100 
                    transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 delay-100
                  `}>
                    {feature.details}
                  </div>
                  
                  {/* Stats Badge */}
                  <div className={`
                    inline-flex items-center gap-2 ${colors.bg} px-3 py-1 rounded-full
                    transform scale-95 group-hover:scale-100 transition-transform duration-300
                  `}>
                    <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${colors.gradient}`}></div>
                    <span className={`text-xs font-medium ${colors.text}`}>
                      {feature.stats}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA Section */}
        {/* <div className="text-center bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_70%)]"></div>
          
          <div className="relative">
            <Shield className="h-12 w-12 text-green-400 mx-auto mb-6" />
            <h3 className="text-3xl font-bold text-white mb-4">
              Trusted by Professional Hikers
            </h3>
            <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
              Join thousands of serious adventurers who rely on our platform for safe, 
              well-planned, and unforgettable hiking experiences.
            </p>
            
            {/* <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold px-8 py-4 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg">
                Start Free Trial
              </button>
              <button className="border-2 border-white/20 text-white hover:bg-white hover:text-slate-900 font-semibold px-8 py-4 rounded-full transition-all duration-300 backdrop-blur-sm">
                View All Features
              </button>
            </div> */}
          {/* </div>
        </div> */} 
      </div>
    </section>
  );
};

export default HikeFeatures;