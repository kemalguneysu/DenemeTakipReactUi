"use client";
import { LoginForm } from "@/components/login";
import { RegisterForm } from "@/components/register";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { z } from "zod";
import { userService } from "@/app/services/user.service";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import { UserAuthService } from "@/app/services/user-auth.service";

const passwordUpdateSchema = z
  .object({
    newPassword: z
      .string()
      .min(6, { message: "Yeni şifre en az 6 karakter olmalıdır." })
      .nonempty({ message: "Yeni şifre alanı boş olmamalıdır." }),
    confirmPassword: z
      .string()
      .nonempty({ message: "Şifre tekrarı alanı boş olmamalıdır." }),
  })
  .superRefine((data, ctx) => {
    if (data.newPassword !== data.confirmPassword) {
      ctx.addIssue({
        path: ["confirmPassword"],
        message: "Şifre ve Şifre Tekrar alanları uyuşmamaktadır.",
        code: z.ZodIssueCode.custom,
      });
    }
  });
interface PasswordUpdateErrors {
  newPassword?: string[];
  confirmPassword?: string[];
}
const ResetToken = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<PasswordUpdateErrors>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [state, setState] = useState(false);

  const router = useRouter();
  const userAuthService=UserAuthService();
  const { userId, resetToken } = useParams();
  useEffect(() => {
    const verifyToken = async () => {
      if (resetToken && userId) {
        try {
          const response = await userAuthService.verifyResetToken(
            resetToken as string,
            userId as string
          );
          setState(response);
        } catch (error) {
        }
      }
    };
    verifyToken();
  }, [resetToken, userId]);
  
  const validateField = (
    fieldName: keyof PasswordUpdateErrors,
    value: string
  ) => {
    const result = passwordUpdateSchema.safeParse({
      newPassword,
      confirmPassword,
      [fieldName]: value,
    });

    if (!result.success) {
      const formattedErrors = result.error.flatten();
      setErrors((prevErrors) => ({
        ...prevErrors,
        [fieldName]: formattedErrors.fieldErrors[fieldName],
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [fieldName]: undefined,
      }));
    }
  };

    const handleInputChange =(setter: React.Dispatch<React.SetStateAction<string>>,fieldName: keyof PasswordUpdateErrors
    ) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;
      setter(value);

      // Validate the field and check for password match
      if (fieldName === "newPassword") {
        // Validate the new password field
        validateField("newPassword", value);

        // Check if new password and confirm password match
        if (confirmPassword) {
          const result = passwordUpdateSchema.safeParse({
            newPassword: value,
            confirmPassword,
          });

          if (!result.success) {
            const formattedErrors = result.error.flatten();
            setErrors((prevErrors) => ({
              ...prevErrors,
              confirmPassword: formattedErrors.fieldErrors.confirmPassword,
            }));
          } else {
            setErrors((prevErrors) => ({
              ...prevErrors,
              confirmPassword: undefined, // Clear error if passwords match
            }));
          }
        }
      } else {
        validateField(fieldName, value);
      }
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSubmitted(true);

      const result = passwordUpdateSchema.safeParse({
        newPassword,
        confirmPassword,
      });

      if (!result.success) {
        const formattedErrors = result.error.flatten();
        setErrors(formattedErrors.fieldErrors);
      } else {
        try {
          var response= await userService.updatePassword(
            userId as string,
            resetToken as string,
            newPassword,
            confirmPassword
          );
          if (response.succeeded) {
            toast({
              title: "Başarılı",
              description: response.message,
            });
            router.push("/giris-yap");
          } else {
            toast({
              title: "Başarısız",
              description: response.message,
              variant: "destructive",
            });
          }
          setErrors({});
          setIsSubmitted(false);
        } catch (error) {
        }
      }
    };
  return (
    <div>
      {state ? (
        <form
          onSubmit={handleSubmit}
          className="mx-auto p-6 border shadow rounded-lg space-y-4 max-w-7xl mt-4"
        >
          <h2 className="text-xl font-semibold mb-4">Şifre Güncelle</h2>
          <div>
            <Label htmlFor="newPassword">Yeni Şifre</Label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={handleInputChange(setNewPassword, "newPassword")}
                placeholder="Yeni Şifre"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
            {isSubmitted && errors.newPassword && (
              <div className="text-red-500 text-sm">
                {Array.isArray(errors.newPassword) ? (
                  errors.newPassword.map((error: string, index: number) => (
                    <p key={index}>{error}</p>
                  ))
                ) : (
                  <p>{errors.newPassword}</p>
                )}
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="confirmPassword">Şifre Tekrar</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={handleInputChange(
                  setConfirmPassword,
                  "confirmPassword"
                )}
                placeholder="Şifre Tekrar"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
            {isSubmitted && errors.confirmPassword && (
              <div className="text-red-500 text-sm">
                {Array.isArray(errors.confirmPassword) ? (
                  errors.confirmPassword.map((error: string, index: number) => (
                    <p key={index}>{error}</p>
                  ))
                ) : (
                  <p>{errors.confirmPassword}</p>
                )}
              </div>
            )}
          </div>

          <Button type="submit" className="w-full mt-4">
            Şifreyi Güncelle
          </Button>
        </form>
      ) : (
        <div className="p-6 border shadow rounded-lg text-center mt-4 max-w-7xl mx-auto">
          <h2 className="text-xl font-semibold mb-4 ">
            Geçersiz Şifre Yenileme İsteği
          </h2>
          <p className="opacity-80">
            Lütfen geçerli bir şifre yenileme isteği gönderdiğinizden emin olun.
          </p>
        </div>
      )}
    </div>
  );
};

export default ResetToken;
