"use client";
import { useEffect, useState } from 'react';
import { useSearchParams , useRouter} from 'next/navigation';

export default function Page() {
  const [token, setToken] = useState(null);
  const [error, setError] = useState(null);
  
  const searchParams = useSearchParams();
  const tokenFromQuery = searchParams.get('token');// Extract token from URL query parameters

  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL
  useEffect(() => {
    if (tokenFromQuery) {
      const fetchToken = async () => {
        try {
          const response = await fetch(`${API_URL}/confirm?token=${tokenFromQuery}`);
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const data = await response.json();
          console.log('API response:', data); // Log the response to check its structure
          if (data && data.token) {
            setToken(data.token); // Assuming the token is in the response under token
          } else {
            setError('Token not found in response');
          }
        } catch (error) {
          console.error('Error fetching token:', error);
          setError(error.message); // Set error message to display to the user
        }
      };

      fetchToken();
      router.replace('/login')
    }
  }, [tokenFromQuery]); // Dependency on tokenFromQuery

  return (
    <div className="min-h-screen flex items-center justify-center flex-col bg-[#EAEFF0]">
      <div className="text-center">
        {error && <p className="text-red-500">Error: {error}</p>}
        {token ? <p>Token: {token}</p> : !error && <p>Fetching token...</p>&& <p>Confirmation Successful</p>}
        
      </div>
    </div>
  );
}
