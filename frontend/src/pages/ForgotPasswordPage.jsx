import React, { useEffect, useState } from "react";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
import Lottie from "lottie-react";

const lottieUrl = "https://assets2.lottiefiles.com/packages/lf20_jcikwtux.json";

export default function ForgotPasswordPage() {
  const [animationData, setAnimationData] = useState(null);

  useEffect(() => {
    fetch(lottieUrl)
      .then((response) => response.json())
      .then((data) => setAnimationData(data))
      .catch((error) => console.error("Error loading Lottie animation:", error));
  }, []);

  return (
    <div className="min-h-screen w-full font-poppins flex items-center justify-center bg-white">
      {/* Centered Content */}
      <div className="w-full max-w-md px-6 text-center">
            
            {/* Lottie Animation */}
            <div className="flex justify-center mb-6">
                <div className="w-48 h-48">
                    {animationData && <Lottie animationData={animationData} loop={true} />}
                </div>
            </div>

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Forgot Password?</h1>
                <p className="text-gray-500 text-sm">
                    No worries! Enter your email and we'll send you a reset link.
                </p>
            </div>

            {/* Form */}
            <ForgotPasswordForm />

            {/* Back to Login Link */}
            <div className="text-center mt-8">
                <p className="text-sm text-gray-500">
                    Remember your password?{" "}
                    <a href="/login" className="font-semibold text-gray-900 hover:text-red-500 transition-colors">
                        Back to login
                    </a>
                </p>
            </div>
      </div>
    </div>
  );
}
