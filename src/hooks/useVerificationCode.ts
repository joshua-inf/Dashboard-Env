// hooks/useVerificationCode.ts
import { useState } from 'react';

interface UseVerificationCodeProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export const useVerificationCode = ({ onSuccess, onError }: UseVerificationCodeProps = {}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendVerificationCode = async (email: string, purpose: string = 'password_reset') => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/send-verification-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, purpose }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to send verification code');
      }

      return data;
    } catch (err: any) {
      const errorMessage = err.message || 'An unexpected error occurred';
      setError(errorMessage);
      onError?.(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyCode = async (email: string, code: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/send-verification-code', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, code }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Verification failed');
      }

      onSuccess?.();
      return data;
    } catch (err: any) {
      const errorMessage = err.message || 'An unexpected error occurred';
      setError(errorMessage);
      onError?.(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    sendVerificationCode,
    verifyCode,
    isLoading,
    error,
    clearError: () => setError(null),
  };
};