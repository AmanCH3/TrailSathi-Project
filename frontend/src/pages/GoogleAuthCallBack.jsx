import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../app/providers/AuthProvider';
import { jwtDecode } from 'jwt-decode'; 

export default function GoogleAuthCallback() {
  // Get the login function from your Auth context
  const { login } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');

    if (token) {
      try {
        const userData = jwtDecode(token);
        
        console.log('✅ GoogleAuthCallback: Token received and decoded successfully.');
        console.log('User Data from token:', userData);
        console.log('Token:', token);

        login(userData, token);

        navigate('/');

      } catch (error) {
        console.error("Failed to decode token:", error);
        navigate('/login?error=invalid_token');
      }
      
    } else {
      console.error("Google Auth Error: No token was provided in the redirect URL.");
      navigate('/login?error=google_auth_failed');
    }
  }, []);

  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <h1>Finalizing Login...</h1>
      <p>Please wait, you will be redirected shortly.</p>
    </div>
  );
}