import React from 'react';
import { Link } from 'react-router-dom';

const CallToAction = () => {
  return (
    <section className="py-20 px-6 bg-white text-center">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-[#3d2c1d] mb-4">
          Ready for Your Next Adventure ?
        </h2>
        <p className="text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
           Join our community of hikers today and discover beautiful trails, connect with fellow adventurers, and track your hiking journey.
        </p>
        
        <Link to="/signup">
            <button className="bg-[#3e2e1e] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#2a1f14] transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200">
            Get Started
            </button>
        </Link>
      </div>
    </section>
  );
};

export default CallToAction;
