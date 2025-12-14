import React, { useState, useContext } from 'react';
import axios from 'axios';
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
  const { user, isAuthenticated } = useContext(AuthContext);

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
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/payment/initiate`,
        { plan: plan.title, amount: parseInt(plan.price, 10) },
        { headers: { 'Authorization': `Bearer ${token}` } }
      );

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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {plansData.map((plan, index) => {
        const isCurrent = currentUserPlan === plan.title;
        const canUpgrade = index > currentUserPlanIndex;
        const isLoading = loadingPlan === plan.title;
        const isBasicPlan = plan.title === 'Basic';

        return (
          <Card key={plan.title} className={`flex flex-col ${isCurrent ? 'border-green-600 border-2' : ''} ${plan.isPopular && !isCurrent ? 'shadow-lg' : ''}`}>
            {plan.isPopular && <div className="text-center py-1 bg-green-500 text-white font-semibold text-sm rounded-t-lg">MOST POPULAR</div>}
            <CardHeader>
              <CardTitle>{plan.title}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
              <div className="pt-4">
                <span className="text-4xl font-bold">{plan.price !== "Free" ? `रु ${plan.price}` : 'Free'}</span>
                <span className="text-muted-foreground">{plan.period}</span>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <ul className="space-y-3">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2">
                    {feature.included ? <Check className="h-5 w-5 text-green-500" /> : <X className="h-5 w-5 text-red-500" />}
                    <span className="text-sm text-gray-700">{feature.text}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              {/* --- LOGIC CHANGE IS HERE --- */}
              {isBasicPlan ? (
                  // Only show the button for the Basic plan if it's the user's current plan.
                  isCurrent && <Button className="w-full" variant="outline" disabled>Your Current Plan</Button>
              ) : (
                  // For Pro and Premium, the logic remains the same.
                  <Button 
                    className="w-full" 
                    variant={isCurrent ? "outline" : "default"}
                    onClick={() => handlePayment(plan)}
                    disabled={!isAuthenticated || isLoading || (plan.price !== "Free" && !canUpgrade && !isCurrent)}
                  >
                    {isLoading ? "Processing..." : 
                     isCurrent ? "Your Current Plan" : `Upgrade to ${plan.title}`}
                  </Button>
              )}
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}