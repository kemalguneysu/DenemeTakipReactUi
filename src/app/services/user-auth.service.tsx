import { useRouter } from 'next/router';
import { useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

interface TokenResponse {
  token: {
    accessToken: string;
    refreshToken: string;
  };
}

export default function AuthService() {
  const router = useRouter();

  const login = async (userNameOrEmail: string, password: string, callBackFunction?: () => void) => {
    try {
      const response = await axios.post<TokenResponse>('/api/auth/login', { userNameOrEmail, password });
      const tokenResponse = response.data;

      if (tokenResponse) {
        localStorage.setItem('accessToken', tokenResponse.token.accessToken);
        localStorage.setItem('refreshToken', tokenResponse.token.refreshToken);

        toast.success('Kullanıcı girişi başarıyla sağlanmıştır.', {
          position: "top-right",
        });
        
        router.push('/');
      }

      if (callBackFunction) {
        callBackFunction();
      }
    } catch (error) {
      console.error('Login failed:', error);
      toast.error('Giriş işlemi başarısız.', {
        position: "top-right",
      });
    }
  };

  const refreshTokenLogin = async (refreshToken: string, callBackFunction?: (state: any) => void) => {
    try {
      const response = await axios.post<TokenResponse>('/api/auth/refreshtokenlogin', { refreshToken });

      if (response.data) {
        const tokenResponse = response.data;
        localStorage.setItem('accessToken', tokenResponse.token.accessToken);
        localStorage.setItem('refreshToken', tokenResponse.token.refreshToken);
      }

      if (callBackFunction) {
        callBackFunction(true);
      }
    } catch (error) {
      console.error('Refresh token login failed:', error);
      if (callBackFunction) {
        callBackFunction(false);
      }
    }
  };

  const googleLogin = async (user: any, callBackFunction?: () => void) => {
    try {
      const response = await axios.post<TokenResponse>('/api/auth/google-login', user);
      const tokenResponse = response.data;

      if (tokenResponse) {
        localStorage.setItem('accessToken', tokenResponse.token.accessToken);
        localStorage.setItem('refreshToken', tokenResponse.token.refreshToken);
        toast.success('Google üzerinden giriş başarıyla sağlanmıştır.', {
          position: "top-right",
        });
      }

      if (callBackFunction) {
        callBackFunction();
      }
    } catch (error) {
      console.error('Google login failed:', error);
      toast.error('Google ile giriş işlemi başarısız.', {
        position: "top-right",
      });
    }
  };

  const passwordReset = async (emailOrUserName: string, callBackFunction?: () => void) => {
    try {
      await axios.post('/api/auth/PasswordReset', { emailOrUserName });
      if (callBackFunction) {
        callBackFunction();
      }
    } catch (error) {
      console.error('Password reset failed:', error);
      if (callBackFunction) {
        callBackFunction();
      }
    }
  };

  const verifyResetToken = async (resetToken: string, userId: string, callBackFunction?: () => void): Promise<boolean> => {
    try {
      const response = await axios.post<boolean>('/api/auth/VerifyResetToken', { resetToken, userId });
      const state = response.data;

      if (callBackFunction) {
        callBackFunction();
      }

      return state;
    } catch (error) {
      console.error('Verify reset token failed:', error);
      if (callBackFunction) {
        callBackFunction();
      }
      return false;
    }
  };

  return {
    login,
    refreshTokenLogin,
    googleLogin,
    passwordReset,
    verifyResetToken,
  };
}
