import React, { useState } from 'react';
import RegisterForm from '../components/auth/RegisterForm';
import { Box } from 'lucide-react';
const login_page_web = '/Login_page_web.png';

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');


  return (
    <div className="relative min-h-screen w-full overflow-hidden font-sans">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src={login_page_web} 
          alt="Background" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/10" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex min-h-screen w-full">
         
         {/* Left Side (Empty/Branding) */}
         <div className="hidden lg:flex w-1/2 flex-col justify-between p-12">
           {/* Branding could go here */}
        </div>

        {/* Right Side (Form) */}
        <div className="w-full lg:w-1/2 flex flex-col justify-start m-14 items-center lg:items-end px-4 sm:px-12 lg:pr-24 py-12">
            <div className="w-full ">
                
                {/* Header */}
                <div className="mb-6">
                    <div className="flex items-center gap-2 mb-6 text-gray-800">
                        <div className="p-2 bg-red-50 rounded-lg">
                            <Box className="w-6 h-6 text-red-600" />
                        </div>
                        <span className="text-xl font-bold text-gray-800">TrailSathi</span>
                    </div>

                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Create your account</h1>
                    <p className="text-gray-600 text-sm">Fill your details to start hike journey</p>
                </div>

                <RegisterForm/>

                {/* Divider */}
                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-x uppercase">
                        <span className="bg-transparent px-5  font-medium text-white backdrop-blur-md rounded">or continue with</span>
                    </div>
                </div>

                {/* Google Button */}
                <button
                    type="button"
                    className="w-full flex items-center justify-center gap-2 rounded-full py-3 text-gray-700 font-medium bg-white border border-gray-200 hover:bg-gray-50 shadow-sm transition"
                >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Sign in with Google
                </button>

                {/* Sign In Redirect */}
                <div className="text-center mt-6">
                    <p className="text-sm text-white">
                        Already have an account?{' '}
                        <a href="/login" className="text-white hover:text-red-600 font-semibold transition-colors">
                        Login
                        </a>
                    </p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
