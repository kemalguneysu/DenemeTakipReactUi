"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useState } from "react";
import { UserAuthService } from "../services/user-auth.service";
import { toast } from "@/hooks/use-toast";

const ForgotPassword = () => {
  const userAuthService = UserAuthService();
  const [emailOrUsername, setEmailOrUsername] = useState<string>("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await userAuthService.passwordReset(emailOrUsername);
  };

  return (
    <div className="flex items-center max-w-7xl mx-auto mt-4">
      <Card className="w-full p-6">
        <CardHeader>
          <CardTitle>Deneme Takip</CardTitle>
          <CardDescription>
            Şifrenizi değiştirmek için hesabınızla ilişkilendirilmiş e-posta
            adresini veya kullanıcı adınızı giriniz.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <Label htmlFor="emailOrUsername">
                E-mail veya kullanıcı adınızı giriniz
              </Label>
              <Input
                id="emailOrUsername"
                type="text"
                placeholder="E-mail veya kullanıcı adınızı giriniz."
                value={emailOrUsername}
                onChange={(e) => setEmailOrUsername(e.target.value)}
                required
              />
            </div>
              <Button className="w-full mt-4" type="submit">
                Devam Et
              </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPassword;
