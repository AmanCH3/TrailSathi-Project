import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@app/providers/AuthProvider';
import LoginForm from '../components/auth/LoginForm';
import { initiateGoogleLogin } from '../services/authService';
import { Box } from 'lucide-react';
const login_page_web = '/Login_page_web.png';


export default function LoginPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }
    }
  }, [user, navigate]);


  const handleGoogleLogin = () => {
    initiateGoogleLogin();
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden font-poppins">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={login_page_web}
          alt="Mountain Landscape"
          className="w-full h-full object-cover"
        />
        {/* Dark overlay for better text readability if needed, though design asks for clean look */}
         <div className="absolute inset-0 bg-black/25"></div> 
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 flex min-h-screen w-full">
        
        {/* Left Side (Empty/Branding - hidden on small screens) */}
        <div className="hidden lg:flex w-1/2 flex-col justify-between p-12">
           <div className="flex items-center gap-2 text-white/90">
             {/* Logo placeholder if needed on left */}
             {/* <Box size={32} />
             <span className="text-2xl font-bold tracking-tight">TrailSathi</span> */}
           </div>
        </div>

        {/* Right Side (Form) */}
        <div className="w-full lg:w-1/2 flex flex-col m-16 justify-start items-center lg:items-end px-4 sm:px-12 lg:pr-24">
             {/* Glass Card */}
            <div className="w-full p-8">
                {/* Logo & Header */}
                <div className="mb-8">
                    <div className="flex items-center text-gray-800">
                    </div>
                    <div className="flex flex-col items-center gap-2">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
                    <p className="text-black text-sm">Enter your credentials to access your account</p>
                    </div>
                </div>

                {/* Form */}
                <LoginForm />

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
                    onClick={handleGoogleLogin}
                    type="button"
                    className="w-full flex items-center justify-center gap-3 rounded-full py-3 px-4 text-gray-700 font-medium bg-white border border-gray-200 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 transition-all duration-200 shadow-sm"
                >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Login with Google
                </button>

                {/* Sign Up Link */}
                <div className="text-center mt-6">
                    <p className="text-sm text-white">
                        Don't have an account?{' '}
                        <a href="/signup" className="font-semibold text-white hover:text-red-600 transition-colors">
                            Register
                        </a>
                    </p>
                </div>

            </div>
        </div>
      </div>
    </div>
  );
}