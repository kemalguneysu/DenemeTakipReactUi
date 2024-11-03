import { useToast } from '@/hooks/use-toast'; // Shadcn toast için hook importu
import { TokenResponse, SocialUser } from '@/types'; // types.tsx dosyasından import
import { fetchWithAuth } from './fetch.withAuth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL; // API base URL environment variable üzerinden alınıyor

export const UserAuthService = () => {
  const { toast } = useToast(); // useToast hook'u ile toast fonksiyonu alınır

  const login = async (userNameOrEmail: string, password: string, callBackFunction?: () => void): Promise<void> => {
      try {
          const response = await fetch(`${API_BASE_URL}/auth/login`, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({ userNameOrEmail, password }),
          });

          if (!response.ok) {
              throw new Error('Giriş işlemi başarısız'); // HTTP hata kodlarına göre hata fırlat
          }

          const tokenResponse: TokenResponse = await response.json();

           if (tokenResponse) {
             document.cookie = `accessToken=${tokenResponse.token.accessToken}; path=/; max-age=3600; Secure; SameSite=Lax;`;
             document.cookie = `refreshToken=${tokenResponse.token.refreshToken}; path=/; max-age=604800; Secure; SameSite=Lax;`;

             toast({
               title: "Giriş Başarılı",
               description: "Kullanıcı girişi başarıyla sağlanmıştır.",
             });

             // Eğer callback fonksiyonu varsa çağır
             if (callBackFunction) {
               callBackFunction();
             }
           }
      } catch (error) {
          toast({
              title: 'Giriş Yapılamadı',
              description: 'Kullanıcı adı veya şifre hatalı.',
              variant: "destructive",
          });
          // Hata durumunda callback çağrılmayacak
      }
  };

  const refreshTokenLogin = async (refreshToken: string, callBackFunction?: (state: any) => void): Promise<any> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/refreshtokenlogin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      const tokenResponse: TokenResponse = await response.json();

      if (tokenResponse) {
        document.cookie = `accessToken=${tokenResponse.token.accessToken}; path=/; max-age=3600; Secure; SameSite=Lax;`;
        document.cookie = `refreshToken=${tokenResponse.token.refreshToken}; path=/; max-age=604800; Secure; SameSite=Lax;`;
      }

      if (callBackFunction) {
        callBackFunction(tokenResponse);
      }
    } catch (error) {
      
    }
  };

  const googleLogin = async (user: SocialUser, callBackFunction?: () => void): Promise<any> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/google-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });
  
      // Yanıtı metin olarak oku
      const responseText = await response.text();
  
      // Eğer yanıt başarılıysa (örneğin, 2xx durum kodu) JSON’a dönüştür
      if (response.ok) {
        const tokenResponse: TokenResponse = JSON.parse(responseText);
  
        // Eğer tokenResponse var ise ve geçerliyse
        if (tokenResponse && tokenResponse.token) {
          document.cookie = `accessToken=${tokenResponse.token.accessToken}; path=/; max-age=3600; Secure; SameSite=Lax;`;
          document.cookie = `refreshToken=${tokenResponse.token.refreshToken}; path=/; max-age=604800; Secure; SameSite=Lax;`;
          toast({
            title: 'Giriş Başarılı',
            description: 'Google üzerinden giriş başarıyla sağlanmıştır.',
          });
  
          // Başarılı giriş durumunda callBackFunction varsa çağır
          if (callBackFunction) {
            callBackFunction();
          }
        } else {
          throw new Error('Token alınamadı');
        }
      } else {
        // Hata durumunda hata mesajını çıkart
        throw new Error(responseText);
      }
    } catch (error: any) {
      let errorMessage = 'Google ile giriş yapılırken bir hata ile karşılaşıldı.';
      
      // Hata mesajını kontrol et
      if (typeof error === 'object' && error !== null && 'message' in error) {
        errorMessage = error.message || errorMessage;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
    
      // Hata mesajından yalnızca "Bu email adresi halihazırda başka bir hesap tarafından kullanılmaktadır." kısmını al
      if (typeof errorMessage === 'string') {
        // Hata mesajında "System.Exception:" ifadesini bul ve kaldır
        if (errorMessage.startsWith("System.Exception:")) {
          errorMessage = errorMessage.split("System.Exception:")[1].trim();
        }
    
        // Geri kalan metin içinde istenen mesajı kontrol et
        if (errorMessage.includes("Bu email adresi halihazırda başka bir hesap tarafından kullanılmaktadır.")) {
          errorMessage = "Bu email adresi halihazırda başka bir hesap tarafından kullanılmaktadır.";
        }
      }
      toast({
        title: 'Giriş Yapılamadı',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  const passwordReset = async (emailOrUserName: string, callBackFunction?: () => void) => {
    try {
      await fetchWithAuth(`${API_BASE_URL}/auth/PasswordReset`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ emailOrUserName }),
      });
      toast({
        title: "Başarılı",
        description:
          "Şifre yenileme talebiniz için e-mail adresinizi kontrol ediniz.",
      });
      if (callBackFunction) {
        callBackFunction();
      }
    } catch (error) {
    }
  };

  const verifyResetToken = async (resetToken: string, userId: string, callBackFunction?: () => void): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/VerifyResetToken`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ resetToken, userId }),
      });

      const state: boolean = await response.json();

      if (callBackFunction) {
        callBackFunction();
      }

      return state;
    } catch (error) {
      console.error('Verify reset token error:', error);
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
};
