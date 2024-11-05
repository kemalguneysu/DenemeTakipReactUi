import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { z } from "zod";
import { userService } from "@/app/services/user.service";
import { toast } from "@/hooks/use-toast";
import SpinnerMethodComponent from "@/app/spinner/spinnerForMethods";

// Define the Zod schema for validation
const passwordUpdateSchema = z
  .object({
    currentPassword: z
      .string()
      .nonempty({ message: "Mevcut şifre alanı boş olmamalıdır." }),
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

// Define an interface for the error messages
interface PasswordUpdateErrors {
  currentPassword?: string[];
  newPassword?: string[];
  confirmPassword?: string[];
}

export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<PasswordUpdateErrors>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false); 

  const validateField = (
    fieldName: keyof PasswordUpdateErrors,
    value: string
  ) => {
    const result = passwordUpdateSchema.safeParse({
      currentPassword,
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

  const handleInputChange =
    (
      setter: React.Dispatch<React.SetStateAction<string>>,
      fieldName: keyof PasswordUpdateErrors
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
            currentPassword,
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
    setLoading(true);
    
    const result = passwordUpdateSchema.safeParse({
      currentPassword,
      newPassword,
      confirmPassword,
    });

    if (!result.success) {
      const formattedErrors = result.error.flatten();
      setErrors(formattedErrors.fieldErrors);
    } else {
      try {
        var response=await userService.updateUserPassword(
          currentPassword,
          newPassword,
          confirmPassword
        );
        if(response.succeeded){
          toast({
            title: "Başarılı",
            description: response.message,
          });
          setCurrentPassword("");
          setNewPassword("");
          setConfirmPassword("");
        }
        else{
          toast({
            title: "Başarısız",
            description: response.message,
            variant: "destructive",
          });
        }
        
        setErrors({});
        setIsSubmitted(false);
      } catch (error) {
        
        toast({
          title: "Başarısız",
          description: response.message,
          variant: "destructive",
        });
      }
    }
    setLoading(false);

  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto p-6 border shadow rounded-lg space-y-4"
    >
      {loading && <SpinnerMethodComponent />}

      <h2 className="text-xl font-semibold mb-4">Şifre Güncelle</h2>

      <div>
        <Label htmlFor="currentPassword">Mevcut Şifre</Label>
        <div className="relative">
          <Input
            id="currentPassword"
            type={showCurrentPassword ? "text" : "password"}
            value={currentPassword}
            onChange={handleInputChange(setCurrentPassword, "currentPassword")}
            placeholder="Mevcut Şifre"
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 flex items-center pr-3"
            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
          >
            {showCurrentPassword ? <EyeOff /> : <Eye />}
          </button>
        </div>
        {isSubmitted && errors.currentPassword && (
          <div className="text-red-500 text-sm">
            {Array.isArray(errors.currentPassword) ? (
              errors.currentPassword.map((error: string, index: number) => (
                <p key={index}>{error}</p>
              ))
            ) : (
              <p>{errors.currentPassword}</p>
            )}
          </div>
        )}
      </div>

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
            onChange={handleInputChange(setConfirmPassword, "confirmPassword")}
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
  );
}
