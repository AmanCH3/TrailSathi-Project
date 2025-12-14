import React, { useEffect, useContext } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { toast } from 'react-toastify'; // Adjust path if necessary
import { useAuth } from '../app/providers/AuthProvider';

export default function EsewaSuccessPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { refreshUser } = useContext(AuthContext); // Get the new refresh function from our context

  useEffect(() => {
    // We create an async function inside useEffect to allow the use of 'await'
    const handlePaymentSuccess = async () => {
      const status = searchParams.get('status');

      if (status === 'success') {
        toast.success('Payment verified! Updating your account details...');
        
        // --- THIS IS THE MOST IMPORTANT STEP ---
        // We wait for the user data to be refreshed from the server.
        // This will update the AuthContext with the new subscription plan.
        await refreshUser(); 
        // ------------------------------------

        toast.info("Your subscription has been updated! Redirecting...");
        
        // Now, redirect the user. When they land on the /payments page,
        // the SubscriptionPlans component will read the NEW, updated user data.
        navigate('/payments', { 
            state: { defaultTab: 'history' }, // Open the history tab by default
            replace: true                     // Prevent user from going "back" to this page
        });

      } else {
        // This handles cases where the user lands here without a success status
        toast.error('There was an issue with your payment. Please try again.');
        navigate('/payments', { replace: true });
      }
    };

    handlePaymentSuccess();

    // The empty dependency array [] is fine here since we want this to run only once
    // when the component mounts. The functions are stable.
  }, []); 

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center p-8 bg-white shadow-lg rounded-lg">
        <Loader2 className="h-12 w-12 animate-spin text-green-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">Payment Verified Successfully</h1>
        <p className="text-gray-600">Finalizing your subscription update. Please wait...</p>
      </div>
    </div>
  );
}