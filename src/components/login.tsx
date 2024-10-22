"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Link from "next/link";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from 'next-themes'; // Tema kullanımı için ekleniyor
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

// Form şemasını güncelleyelim.
const formSchema = z.object({
  username: z.string().nonempty({
    message: "Email veya kullanıcı adı kısmı boş olmamalıdır.",
  }),
  password: z.string().nonempty({
    message: "Şifre alanı boş olmamalıdır.",
  }),
});

export function LoginForm() {
  const { theme } = useTheme(); // Tema bilgisini almak için useTheme kancası ekleniyor
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // Şifre görünürlüğünü kontrol etmek için state tanımlayalım
  const [showPassword, setShowPassword] = useState(false);

  // Form değerlerini işleyen bir submit handler tanımlayalım.
  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  // Google ile giriş başarılı olduğunda çağrılacak fonksiyon
  const onSuccess = (credentialResponse: any) => {
    console.log('Google ile giriş başarılı:', credentialResponse);
    // Giriş başarılı olduğunda yapılacak işlemleri buraya ekleyin
  };

  // Google ile giriş başarısız olduğunda çağrılacak fonksiyon
  const onError = () => {
    console.log('Google ile giriş başarısız');
    // Hata işlemlerini buraya ekleyin
  };
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string;

  // Eğer clientId tanımlı değilse hata ver
  if (!clientId) {
    throw new Error("Google Client ID is not defined. Please check your .env file.");
  }

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
                  <Input placeholder="Email veya kullanıcı adınızı giriniz" {...field} />
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
                      placeholder="Şifrenizi giriniz"
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
                {/* Hata mesajı alanı */}
                <div className="h-6"> {/* Sabit yükseklik ekleyerek kaymayı önlüyoruz */}
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          {/* Şifremi unuttum? Linki */}
          <div className="mt-2 text-center">
            <Link href="/sifremi-unuttum" className="text-primary hover:underline">
              Şifremi unuttum?
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
