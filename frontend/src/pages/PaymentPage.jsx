import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SubscriptionPlans } from '../components/payments/SubscriptionPlans';
import { TransactionHistory } from '../components/payments/TransactionHistory';
import Navbar from '../components/layout/Header';
import Footer from '../layouts/Footer';

export default function PaymentsPage() {
  // We define the styles once since they are identical for both triggers.
  const triggerStyles = `
    border
    transition-all
    focus-visible:outline-none
    focus-visible:ring-0
    focus-visible:ring-offset-0

    data-[state=inactive]:bg-gray-100
    data-[state=inactive]:text-gray-500
    data-[state=inactive]:border-gray-200
    data-[state=inactive]:opacity-70
    
    data-[state=active]:bg-white
    data-[state=active]:text-black
    data-[state=active]:shadow-md
    data-[state=active]:border-black
  `;

  return (
    <>
      <Navbar />
      <div className="container mx-auto py-24 px-4">
        <h1 className="text-3xl font-bold mb-2 text-gray-900">Subscription & Billing</h1>
        <p className="text-gray-600 mb-8">Manage your plan and view your transaction history.</p>

        <Tabs defaultValue="plans" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:w-[400px] bg-transparent p-1 gap-1">
            <TabsTrigger value="plans" className={triggerStyles}>
              Subscription Plans
            </TabsTrigger>
            <TabsTrigger value="history" className={triggerStyles}>
              Transaction History
            </TabsTrigger>
          </TabsList>
          <TabsContent value="plans" className="mt-6">
            <SubscriptionPlans />
          </TabsContent>
          <TabsContent value="history" className="mt-6">
            <TransactionHistory />
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </>
  );
}