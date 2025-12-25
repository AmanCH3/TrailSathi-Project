import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

const faqData = [
  {
    question: "What is TrailSathi?",
    answer: "TrailSathi is your ultimate hiking companion platform that connects hiking enthusiasts, provides trail information, organizes group hikes, and helps you discover the best hiking experiences across Nepal."
  },
  {
    question: "How do I join a hiking group?",
    answer: "Simply browse our group communities, find a group that matches your interests, and click the 'Join' button. Once approved by the admin, you'll have access to all group activities, events, and discussions."
  },
  {
    question: "Is TrailSathi free to use?",
    answer: "Yes! TrailSathi offers a free Basic plan with essential features. We also offer Premium and Pro subscription plans with additional benefits like priority booking, exclusive trails, and advanced features."
  },
  {
    question: "How can I plan a hike?",
    answer: "Choose a trail from our extensive collection, select your preferred date, and either join solo or invite friends. You can also create or join group events for organized hiking experiences."
  },
  {
    question: "Can I create my own hiking group?",
    answer: "Absolutely! Premium and Pro members can create their own hiking groups. Simply navigate to the Groups section, click 'Create Group', fill in the details, and start building your hiking community."
  }
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="relative py-12 px-4 bg-gray-50 overflow-hidden">
      {/* Decorative Curves */}
      <div className="absolute left-0 top-0 w-32 h-1/3 opacity-20">
        <svg viewBox="0 0 100 300" className="h-full">
          <path d="M0,0 Q50,150 0,300" fill="none" stroke="#94a3b8" strokeWidth="2" />
        </svg>
      </div>
      <div className="absolute right-0 top-0 w-32 h-1/3 opacity-20">
        <svg viewBox="0 0 100 300" className="h-full">
          <path d="M100,0 Q50,150 100,300" fill="none" stroke="#94a3b8" strokeWidth="2" />
        </svg>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            FAQs
          </h2>
          <p className="text-gray-600 text-sm md:text-base max-w-2xl mx-auto">
            Find answers to common questions about TrailSathi, hiking groups, and our platform features.
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-3 mb-10">
          {faqData.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between p-5 text-left focus:outline-none group"
              >
                <span className="text-gray-900 font-medium text-sm md:text-base pr-4">
                  {faq.question}
                </span>
                <div className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-full bg-gray-100 group-hover:bg-gray-200 transition-colors">
                  {openIndex === index ? (
                    <Minus className="w-4 h-4 text-gray-700" />
                  ) : (
                    <Plus className="w-4 h-4 text-gray-700" />
                  )}
                </div>
              </button>
              
              {openIndex === index && (
                <div className="px-5 pb-5 animate-fadeIn">
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="text-center">
          <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
            Still have a question?
          </h3>
          <p className="text-gray-600 mb-5 text-sm">
            Can't find the answer you're looking for? Please reach out to our friendly team.
          </p>
          <a
            href="/contact"
            className="inline-block px-7 py-2.5 bg-white text-gray-900 font-medium rounded-full border-2 border-gray-300 hover:border-gray-900 hover:bg-gray-50 transition-all duration-300 shadow-sm text-sm"
          >
            Contact
          </a>
        </div>
      </div>

      {/* Add fadeIn animation */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </section>
  );
}
