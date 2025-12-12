import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import LandingPage from "../pages/LandingPage";
import SignUpPage from "../pages/SignUpPage";
import TrailsPage from "../pages/TrailsPage";
import TrailDetailsPage from "../pages/TrailDetailsPage";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import MainLayout from "../layouts/MainLayout";
import DashboardPage from "../components/admin/DashBoardPage";
import UserManagementPage from "../pages/admin/UserManagementPage";
import ChecklistManagementPage from "../pages/admin/ChecklistManagementPage";
import GroupHikeManagementPage from "../pages/admin/GroupHikeManagement";
import PaymentManagementPage from "../pages/admin/PaymentManagementPage";
import TrailManagementPage from "../pages/admin/TrailManagement";
import AdminLayout from "../layouts/admin/AdminLayout";
import GroupsPage from "../pages/GroupPage";
import ProtectedRoute from "../components/protectedRoutes";
import { SidebarProvider } from "@/components/ui/sidebar";
import { GroupDetails } from "../components/user_group_management/group_detail";
import HikeHub404 from "../pages/HikeHub404";
import PaymentsPage from "../pages/PaymentPage";
import EsewaSuccessPage from "../pages/EsewaSuccessPage";
import ChecklistPage from "../pages/ChecklistPage";
import ProfilePage from "../pages/ProfilePage";
import GoogleAuthCallback from "../pages/GoogleAuthCallBack";

// It's good practice to create a simple component for the failure page too
const EsewaFailurePage = () => (
    <div className="flex items-center justify-center h-screen">
        <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600">Payment Failed</h1>
            <p className="text-gray-700">Your payment could not be processed. Please try again.</p>
            <a href="/payments" className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded">
                Go back to Payments
            </a>
        </div>
    </div>
);


export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes with MainLayout */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<LandingPage />} />
          <Route path="trails" element={<TrailsPage />} />
          <Route path="trails/:id" element={<TrailDetailsPage />} />
          <Route path="forgotpassword" element={<ForgotPasswordPage />} />
          <Route path="signup" element={<SignUpPage />} />
          <Route path="login" element={<LoginPage />} />
           <Route path="/auth/google/success" element={<GoogleAuthCallback />} />
          <Route path="groups" element={<GroupsPage />} />
          <Route path="payments" element={<PaymentsPage />} />


          <Route path="profile" element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } />
          
          {/* --- FIX IS HERE --- */}
          {/* Moved the checklist route to be with other main user features */}
          <Route path="checklist" element={<ChecklistPage />} />
        </Route>

        {/* Admin Routes with AdminLayout, protected by ProtectedRoute */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute adminOnly={true}>
              <SidebarProvider>
                <AdminLayout />
              </SidebarProvider>
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="users" element={<UserManagementPage />} />
          <Route path="checklists" element={<ChecklistManagementPage />} />
          <Route path="hikes" element={<GroupHikeManagementPage />} />
          <Route path="payments" element={<PaymentManagementPage />} />
          <Route path="trail" element={<TrailManagementPage />} />
          <Route path="groups/:groupId" element={<GroupDetails />} />
          
          {/* The incorrect checklist route has been removed from this section */}
        </Route>

        {/* Standalone payment callback routes. These are top-level and public. */}
        <Route path="/payment/success" element={<EsewaSuccessPage />} />
        <Route path="/payment/failure" element={<EsewaFailurePage />} />
        
        {/* 404 Catch-all Route */}
        <Route path="*" element={<HikeHub404 />} />
      </Routes>
    </BrowserRouter>
  );
}