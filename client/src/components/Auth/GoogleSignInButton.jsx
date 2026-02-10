import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

export default function GoogleSignInButton({ onError }) {
  const { googleLogin } = useAuth();
  const navigate = useNavigate();
  const buttonRef = useRef(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID || initializedRef.current) return;

    const initGoogle = () => {
      if (!window.google?.accounts?.id) {
        setTimeout(initGoogle, 100);
        return;
      }

      initializedRef.current = true;

      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse,
      });

      window.google.accounts.id.renderButton(buttonRef.current, {
        theme: 'outline',
        size: 'large',
        width: buttonRef.current.offsetWidth,
        text: 'signin_with',
      });
    };

    initGoogle();
  }, []);

  const handleCredentialResponse = async (response) => {
    try {
      await googleLogin(response.credential);
      navigate('/dashboard');
    } catch (err) {
      onError?.(err.response?.data?.message || 'Google sign-in failed');
    }
  };

  if (!GOOGLE_CLIENT_ID) return null;

  return <div ref={buttonRef} className="w-full flex justify-center" />;
}
