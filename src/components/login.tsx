"use client"; // İstemci bileşeni olarak işaretle

import { useTheme } from 'next-themes';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { UserAuthService } from '@/app/services/user-auth.service';
import { z } from 'zod';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'; // UI bileşenleri
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react'; // Eye ikonları
import { useRouter } from 'next/navigation'; // next/navigation'dan useRouter import et
import authService from '@/app/services/auth.service'; // AuthService import et
import { toast } from '@/hooks/use-toast';
import { SocialUser } from '@/types';

// Form doğrulama şemasını tanımlayın
const formSchema = z.object({
  username: z.string().nonempty('Email veya kullanıcı adı gereklidir'),
  password: z.string().nonempty('Şifre gereklidir'),
});

export function LoginForm() {
  const { theme } = useTheme(); // Tema bilgisini almak için useTheme kancası
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter(); // useRouter burada kullanılır
  const userAuthService = UserAuthService(); // UserAuthService örneği alınıyor
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string;

  // Eğer clientId tanımlı değilse hata ver
  if (!clientId) {
    throw new Error("Google Client ID is not defined. Please check your .env file.");
  }
  // Form değerlerini işleyen bir submit handler tanımlayalım.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { username, password } = values;
    try {
        await userAuthService.login(username, password, () => {
            authService.identityCheck(); // Kullanıcı durumunu kontrol et
            router.push('/'); // Ana sayfaya yönlendir
        });
    } catch (error) {
        // Hata durumunda herhangi bir işlem yapılmıyor, toast gösteriliyor
        toast({
            title: 'Giriş Yapılamadı',
            description: 'Kullanıcı adı veya şifre hatalı.',
            variant: "destructive",
        });
    }
}


  // Google ile giriş başarılı olduğunda çağrılacak fonksiyon
  const onSuccess = async (credentialResponse: any) => {
    try {
      const profile = credentialResponse.profileObj || {};

      const user: SocialUser = {
        provider: 'Google',
        id: profile.googleId || '',
        email: profile.email || '',
        name: profile.name || '',
        photoUrl: profile.picture || '',
        firstName: profile.givenName || '',
        lastName: profile.familyName || '',
        authToken: credentialResponse.credential || '',
        idToken: credentialResponse.credential || '',
        authorizationCode: '',
        response: credentialResponse,
      };

      await userAuthService.googleLogin(user, () => {
        authService.identityCheck(); // Kullanıcı durumunu kontrol et
        router.push('/'); // Ana sayfaya yönlendir
      });
    } catch (error) {
      console.error('Google ile giriş hatası:', error);
      toast({
        title: 'Google ile giriş hatası',
        description: 'Google ile girişte bir hata oluştu.',
        variant: 'destructive',
      });
    }
  };

  const onError = () => {
    console.log('Google ile giriş hatası');
    toast({
      title: 'Giriş Yapılamadı',
      description: 'Google ile girişte bir hata oluştu.',
      variant: 'destructive',
    });
  };

  

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Username Alanı */}
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email veya kullanıcı adı</FormLabel>
                <FormControl>
                  <Input placeholder="Email veya kullanıcı adınızı giriniz." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password Alanı */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Şifre</FormLabel>
                <div className="relative">
                  <FormControl>
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Şifrenizi giriniz."
                      {...field}
                    />
                  </FormControl>
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
                <div className="h-6"> {/* Sabit yükseklik ekleyerek kaymayı önlüyoruz */}
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          {/* Şifremi unuttum? Linki */}
          <div className="mt-2 text-center">
            <Link href="/sifremi-unuttum" className="text-primary hover:underline">
              Şifremi unuttum
            </Link>
          </div>

          {/* Submit Butonu */}
          <Button type="submit" className="w-full">
            Giriş Yap
          </Button>

          {/* Hesabınız yok mu? Kayıt Ol Linki */}
          <div className="mt-4 text-center">
            <p className="text-gray-500">
              Hesabınız yok mu?{' '}
              <Link href="/kayit-ol" className="text-primary hover:underline">
                Kayıt Ol
              </Link>
            </p>
          </div>

          {/* Google ile giriş yap butonu */}
          <div className="mt-4 flex justify-center"> {/* Flex ile ortalama */}
            <GoogleLogin
              onSuccess={onSuccess}
              onError={onError}
              type="standard"
              shape="pill"
              text="signin_with"
              size="large"
              theme={theme === 'dark' ? 'filled_black' : 'outline'} // Tema kontrolü
              width="100%"
              auto_select={false}
            />
          </div>
        </form>
      </Form>
    </GoogleOAuthProvider>
  );
}
