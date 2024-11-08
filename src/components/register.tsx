"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox"; // Import Checkbox
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { z } from "zod";
import { SocialUser, UserCreate } from "@/types";
import { userService } from "@/app/services/user.service";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import authService from "@/app/services/auth.service";
import { UserAuthService } from "@/app/services/user-auth.service";
import SpinnerMethodComponent from "@/app/spinner/spinnerForMethods";

// Form validation schema using Zod
const formSchema = z
  .object({
    username: z
      .string()
      .min(5, { message: "Kullanıcı adı en az 5 karakter olmalıdır." })
      .max(25, { message: "Kullanıcı adı en fazla 25 karakter olmalıdır." })
      .nonempty({ message: "Kullanıcı adı alanı boş olmamalıdır." }),

    email: z
      .string()
      .email({ message: "Geçerli bir e-posta adresi girin." })
      .nonempty({ message: "E-posta alanı boş olmamalıdır." }),

    password: z
      .string()
      .min(6, { message: "Şifre en az 6 karakter olmalıdır." })
      .nonempty({ message: "Şifre alanı boş olmamalıdır." }),

    confirmPassword: z
      .string()
      .nonempty({ message: "Şifre tekrarı alanı boş olmamalıdır." }),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        path: ["confirmPassword"],
        message: "Şifre ve Şifre Tekrar alanları uyuşmamaktadır.",
        code: z.ZodIssueCode.custom,
      });
    }
  });

export function RegisterForm() {
  const { theme } = useTheme();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
    },
  });
  const userAuthService = UserAuthService();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false); // State for checkbox
  const [loading, setLoading] = useState(false); 
  // Form submission handler
  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!isChecked) {
      toast({
        title: "Hata",
        description:
          "Gizlilik politikası ve kullanım şartlarını kabul etmelisiniz.",
        variant: "destructive",
      });
      return; // Prevent form submission if not checked
    }

    const { username, email, password, confirmPassword } = values;
    setLoading(true);
    try {
      const userCreateResponse: UserCreate = await userService.create(
        {
          username,
          email,
          password,
          passwordConfirm: confirmPassword,
        },
        undefined,
        (errorMessage) => {
          toast({
            title: "Kayıt Başarısız",
            description: errorMessage,
            variant: "destructive",
          });
        }
      );

      // Kullanıcı oluşturulduysa kontrol et
      if (userCreateResponse.succeeded) {
        toast({
          title: "Kullanıcı Başarıyla Oluşturuldu",
          description:
            userCreateResponse.message || "Kullanıcı başarıyla oluşturuldu.",
        });
        router.push("/giris-yap"); // Yönlendirme
      } else {
        toast({
          title: "Kayıt Başarısız",
          description:
            userCreateResponse.message ||
            "Kullanıcı oluşturulurken bir hata oluştu.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Kullanıcı oluşturma işlemi başarısız:", error);
      let errorMessage = "Kayıt işlemi sırasında bir hata oluştu.";

      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === "string") {
        errorMessage = error;
      } else if (error && typeof error === "object" && "message" in error) {
        errorMessage = (error as any).message;
      }

      toast({
        title: "Kayıt Başarısız",
        description: errorMessage,
        variant: "destructive",
      });
      
    }
    setLoading(false);
  }

  // Google login success handler
  const onSuccess = async (credentialResponse: any) => {
    setLoading(true);
    try {
      const profile = credentialResponse.profileObj || {};

      const user: SocialUser = {
        provider: "Google",
        id: profile.googleId || "",
        email: profile.email || "",
        name: profile.name || "",
        photoUrl: profile.picture || "",
        firstName: profile.givenName || "",
        lastName: profile.familyName || "",
        authToken: credentialResponse.credential || "",
        idToken: credentialResponse.credential || "",
        authorizationCode: "",
        response: credentialResponse,
      };

      await userAuthService.googleLogin(user, () => {
        authService.identityCheck(); // Kullanıcı durumunu kontrol et
        router.push("/"); // Ana sayfaya yönlendir
      });
    } catch (error) {
      console.error("Google ile giriş hatası:", error);
      toast({
        title: "Google ile giriş hatası",
        description: "Google ile girişte bir hata oluştu.",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const onError = () => {
    toast({
      title: "Giriş Yapılamadı",
      description: "Google ile girişte bir hata oluştu.",
      variant: "destructive",
    });
  };

  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string;

  if (!clientId) {
    throw new Error(
      "Google Client ID bulunamadı."
    );
  }

  return (
    <GoogleOAuthProvider clientId={clientId}>
      {loading && <SpinnerMethodComponent />}

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 max-w-7xl mx-auto"
        >
          {/* Email Field */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="E-posta adresinizi giriniz." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Username Field */}
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kullanıcı Adı</FormLabel>
                <FormControl>
                  <Input placeholder="Kullanıcı adınızı giriniz." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password Field */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Şifre</FormLabel>
                <div className="relative">
                  <FormControl>
                    <Input
                      type={showPassword ? "text" : "password"}
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
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Confirm Password Field */}
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Şifre Tekrar</FormLabel>
                <div className="relative">
                  <FormControl>
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Şifrenizi tekrar giriniz."
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
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Checkbox for Privacy Policy */}
          <div className="flex items-center">
            <Checkbox
              id="privacy-policy"
              checked={isChecked}
              onCheckedChange={(checked) => {
                if (checked === true || checked === false) {
                  setIsChecked(checked); // Only update if checked is boolean
                }
              }}
            />
            <label htmlFor="privacy-policy" className="ml-2">
              <span className="text-sm text-gray-600">
                <Link
                  href="/yasal/gizlilik-politikasi"
                  className="text-blue-600 underline"
                >
                  Gizlilik Politikası'nı
                </Link>{" "}
                ve{" "}
                <Link
                  href="/yasal/kullanim-sartlari"
                  className="text-blue-600 underline"
                >
                  Kullanım Şartları'nı
                </Link>{" "}
                okuduğunuzu ve kabul ettiğinizi onaylıyorsunuz.
              </span>
            </label>
          </div>
          <div className="mt-4 text-center">
            <p className="text-gray-500">
              Hesabınız var mı?{" "}
              <Link href="/giris-yap" className="text-primary hover:underline">
                Giriş Yap
              </Link>
            </p>
          </div>
          <div className="mt-4 flex justify-center">
            {" "}
            {/* Flex ile ortalama */}
            <GoogleLogin
              onSuccess={onSuccess}
              onError={onError}
              type="standard"
              shape="pill"
              text="signup_with"
              size="large"
              theme={theme === "dark" ? "filled_black" : "outline"}
              width="100%"
              auto_select={false}
            />
          </div>
          {/* Submit Button */}
          <Button type="submit" className="w-full">
            Kayıt Ol
          </Button>
        </form>
      </Form>
    </GoogleOAuthProvider>
  );
}
