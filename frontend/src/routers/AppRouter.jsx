import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import LandingPage from "../pages/LandingPage";
import SignUpPage from "../pages/SignUpPage";
import TrailsPage from "../pages/TrailsPage";
import TrailDetailsPage from "../pages/TrailDetailsPage";
import TrailGalleryPage from "../pages/TrailGalleryPage";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import MainLayout from "../layouts/MainLayout";
import DashboardPage from "../components/admin/DashBoardPage";
import UserManagementPage from "../pages/admin/UserManagementPage";
import ChecklistManagementPage from "../pages/admin/ChecklistManagementPage";
import GroupHikeManagementPage from "../pages/admin/GroupHikeManagement";
import PaymentManagementPage from "../pages/admin/PaymentManagementPage";
import TrailManagementPage from "../pages/admin/TrailManagement";
import PendingGroupsPage from "../pages/admin/PendingGroupsPage";
import AdminLayout from "../layouts/admin/AdminLayout";
import GroupsPage from "../pages/GroupPage";
import ProtectedRoute from "../components/protectedRoutes";
import { SidebarProvider } from "@/components/ui/sidebar";
import { GroupDetails } from "../components/user_group_management/group_detail";
import TrailSathi404 from "../pages/TrailSathi404";
import PaymentsPage from "../pages/PaymentPage";
import EsewaSuccessPage from "../pages/EsewaSuccessPage";
import ChecklistPage from "../pages/ChecklistPage";
import ProfilePage from "../pages/ProfilePage";
import GoogleAuthCallback from "../pages/GoogleAuthCallBack";
import SavedTrailsPage from "../pages/SavedTrailsPage";

// Community Feature Pages
import { GroupsDiscoveryPage, GroupDetailPage, EventDetailPage, MessengerPage } from "../features/community";

// It's good practice to create a simple component for the failure page too
const EsewaFailurePage = () => {
    const params = new URLSearchParams(window.location.search);
    const message = params.get('message') || 'Your payment could not be processed. Please try again.';

    return (
        <div className="flex items-center justify-center h-screen bg-gray-50">
            <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Failed</h1>
                <p className="text-gray-600 mb-6">{message}</p>
                <a href="/community/groups" className="inline-block bg-gray-900 hover:bg-gray-800 text-white font-medium px-6 py-3 rounded-lg transition-colors">
                    Back to Groups
                </a>
            </div>
        </div>
    );
};


export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes with MainLayout */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<LandingPage />} />
          <Route path="trails" element={<TrailsPage />} />
          <Route path="trails/:id" element={<TrailDetailsPage />} />
          <Route path="trails/:id/photos" element={<TrailGalleryPage />} />
          <Route path="forgotpassword" element={<ForgotPasswordPage />} />
          <Route path="signup" element={<SignUpPage />} />
          <Route path="login" element={<LoginPage />} />
           <Route path="/auth/google/success" element={<GoogleAuthCallback />} />
          <Route path="groups" element={<GroupsPage />} />
          <Route path="payments" element={<PaymentsPage />} />
          <Route path="saved-trails" element={<SavedTrailsPage />} />

          {/* Community Feature Routes */}
          <Route path="community/groups" element={<GroupsDiscoveryPage />} />
          <Route path="community/groups/:groupId" element={<GroupDetailPage />} />
          <Route path="community/groups/:groupId/events/:eventId" element={<EventDetailPage />} />
          <Route path="messenger" element={
            <ProtectedRoute>
              <MessengerPage />
            </ProtectedRoute>
          } />
          <Route path="messenger/:conversationId" element={
            <ProtectedRoute>
              <MessengerPage />
            </ProtectedRoute>
          } />

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
          <Route path="pending-groups" element={<PendingGroupsPage />} />
          <Route path="groups/:groupId" element={<GroupDetails />} />
          
          {/* The incorrect checklist route has been removed from this section */}
        </Route>

        {/* Standalone payment callback routes. These are top-level and public. */}
        <Route path="/payment/success" element={<EsewaSuccessPage />} />
        <Route path="/payment/failure" element={<EsewaFailurePage />} />
        
        {/* 404 Catch-all Route */}
        <Route path="*" element={<TrailSathi404 />} />
      </Routes>
    </BrowserRouter>
  );
}