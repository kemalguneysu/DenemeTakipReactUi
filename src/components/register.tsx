"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { z } from "zod";
const formSchema = z.object({
    username: z.string()
      .min(5, { message: "Kullanıcı adı en az 5 karakter olmalıdır." })
      .max(35, { message: "Kullanıcı adı en fazla 35 karakter olmalıdır." })
      .nonempty({ message: "Kullanıcı adı alanı boş olmamalıdır." }),
  
    email: z.string()
      .email({ message: "Geçerli bir e-posta adresi girin." })
      .nonempty({ message: "E-posta alanı boş olmamalıdır." }),
  
    password: z.string()
      .min(6, { message: "Şifre en az 6 karakter olmalıdır." })
      .nonempty({ message: "Şifre alanı boş olmamalıdır." }),
  
      confirmPassword: z.string()
      .nonempty({ message: "Şifre tekrarı alanı boş olmamalıdır." }),
        }).superRefine((data, ctx) => {
            if (data.password !== data.confirmPassword) {
            ctx.addIssue({
                path: ["confirmPassword"],
                message: "Şifreler eşleşmiyor.",
                code: z.ZodIssueCode.custom,
            });
            }
  });

export function RegisterForm() {
  const { theme } = useTheme(); // Tema bilgisini almak için useTheme kancası ekleniyor
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Şifre görünürlüğünü kontrol etmek için state tanımlayalım
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form değerlerini işleyen bir submit handler tanımlayalım.
  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    // Kayıt işlemi burada yapılacak
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
          {/* Email Alanı */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="E-posta adresinizi girin" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Username Alanı */}
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kullanıcı Adı</FormLabel>
                <FormControl>
                  <Input placeholder="Kullanıcı adınızı girin" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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
                      placeholder="Şifrenizi girin"
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

          {/* Confirm Password Alanı */}
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Şifre Tekrar</FormLabel>
                <div className="relative">
                  <FormControl>
                    <Input
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Şifrenizi tekrar girin"
                      {...field}
                    />
                  </FormControl>
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
                {/* Hata mesajı alanı */}
                <div className="h-6"> {/* Sabit yükseklik ekleyerek kaymayı önlüyoruz */}
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          {/* Submit Butonu */}
          <Button type="submit" className="w-full">
            Kayıt Ol
          </Button>

          {/* Hesabınız var mı? Giriş Yap Linki */}
          <div className="mt-4 text-center">
            <p className="text-gray-500">
              Hesabınız var mı?{' '}
              <Link href="/giris-yap" className="text-primary hover:underline">
                Giriş Yap
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
              text="signup_with"
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
