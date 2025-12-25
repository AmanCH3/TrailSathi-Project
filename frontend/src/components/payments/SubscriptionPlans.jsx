import React, { useState } from 'react';
import axiosInstance from '../../features/community/services/api/axios.config';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';
import { toast } from 'react-toastify';
import { postToEsewa } from '../../utils/esewa';
import { useAuth } from '@/app/providers/AuthProvider';

const plansData = [
    {
        title: "Basic",
        price: "Free",
        description: "Perfect for casual hikers.",
        features: [
          { text: "Access to public trails", included: true },
          { text: "Basic packing checklists", included: true },
          { text: "Join up to 3 hiking groups", included: true },
          { text: "View beginner tips", included: true },
          { text: "Premium trail maps", included: false },
          { text: "Unlimited group creation", included: false },
          { text: "Guided hikes", included: false },
          { text: "Advanced safety features", included: false },
        ],
    },
    {
        title: "Pro",
        price: "999",
        period: "/month",
        description: "For regular hikers seeking more features.",
        features: [
            { text: "All features from Basic", included: true },
            { text: "Premium trail maps", included: true },
            { text: "Unlimited group creation", included: true },
            { text: "Advanced weather forecasts", included: true },
            { text: "Guided hikes", included: false },
            { text: "Priority support", included: false },
        ],
        isPopular: true,
    },
    {
        title: "Premium",
        price: "1999",
        period: "/month",
        description: "For dedicated hikers who want everything.",
        features: [
            { text: "All features from Pro", included: true },
            { text: "Guided hikes (1 per month)", included: true },
            { text: "Priority support 24/7", included: true },
            { text: "Exclusive trail access", included: true },
        ],
    },
];

export function SubscriptionPlans() {
  const [loadingPlan, setLoadingPlan] = useState(null);
  const { user, isAuthenticated } = useAuth();

  const currentUserPlan = user?.subscription || 'Basic';
  const planIndex = { 'Basic': 0, 'Pro': 1, 'Premium': 2 };
  const currentUserPlanIndex = planIndex[currentUserPlan] ?? 0;

  const handlePayment = async (plan) => {
    if (planIndex[plan.title] <= currentUserPlanIndex) {
        toast.info(`You are already on the ${currentUserPlan} plan.`);
        return;
    }

    setLoadingPlan(plan.title);
    try {
      const response = await axiosInstance.post('/api/payment/initiate', {
        plan: plan.title,
        amount: parseInt(plan.price, 10)
      });

      if (response.data.success) {
        postToEsewa(response.data.data);
      } else {
        toast.error(response.data.message || 'Failed to initiate payment.');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'An error occurred.');
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {plansData.map((plan, index) => {
        const isCurrent = currentUserPlan === plan.title;
        const canUpgrade = index > currentUserPlanIndex;
        const isLoading = loadingPlan === plan.title;
        const isBasicPlan = plan.title === 'Basic';

        return (
          <div key={plan.title} className="relative">
            {/* Most Popular Badge */}
            {plan.isPopular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                <span className="bg-green-500 text-white text-xs font-semibold px-4 py-1 rounded-full">
                  MOST POPULAR
                </span>
              </div>
            )}

            <Card 
              className={`
                h-full flex flex-col transition-all duration-300
                ${isCurrent ? 'border-green-500 border-2 shadow-lg bg-green-50/30' : 'border-gray-200'}
                ${plan.isPopular && !isCurrent ? 'border-green-500 border-2' : ''}
                hover:shadow-xl
              `}
            >
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl font-bold text-gray-900">{plan.title}</CardTitle>
                <CardDescription className="text-gray-600 text-sm">
                  {plan.description}
                </CardDescription>
                
                {/* Price */}
                <div className="pt-4">
                  <div className="flex items-baseline gap-1">
                    {plan.price !== "Free" && (
                      <span className="text-xl font-medium text-gray-900">₹</span>
                    )}
                    <span className="text-4xl font-bold text-gray-900">
                      {plan.price}
                    </span>
                    {plan.period && (
                      <span className="text-gray-600 text-sm font-medium">{plan.period}</span>
                    )}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="flex-grow pb-6">
                <ul className="space-y-3">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      {feature.included ? (
                        <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      ) : (
                        <X className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                      )}
                      <span className={`text-sm ${feature.included ? 'text-gray-700' : 'text-gray-400 line-through'}`}>
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* Current Plan Badge */}
                {isCurrent && (
                  <div className="mt-6 text-center">
                    <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">
                      Your Current Plan
                    </span>
                  </div>
                )}
              </CardContent>

              <CardFooter className="pt-0">
                {isBasicPlan ? (
                  isCurrent && (
                    <Button 
                      className="w-full bg-gray-100 text-gray-500 cursor-not-allowed" 
                      variant="outline" 
                      disabled
                    >
                      Current Plan
                    </Button>
                  )
                ) : (
                  <Button 
                    className={`
                      w-full font-semibold
                      ${isCurrent 
                        ? 'bg-gray-100 text-gray-500 cursor-not-allowed' 
                        : canUpgrade 
                          ? 'bg-gray-900 hover:bg-gray-800 text-white' 
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }
                    `}
                    onClick={() => handlePayment(plan)}
                    disabled={!isAuthenticated || isLoading || !canUpgrade}
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        Processing...
                      </span>
                    ) : isCurrent ? (
                      "Current Plan"
                    ) : (
                      `Upgrade to ${plan.title}`
                    )}
                  </Button>
                )}
              </CardFooter>
            </Card>
          </div>
        );
      })}
    </div>
  );
}