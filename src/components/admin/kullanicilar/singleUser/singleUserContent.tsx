"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { z } from "zod";
import { derslerService } from "@/app/services/dersler.service";
import { Ders, Konu, ListKonu, Role, UpdateKonu, UserById } from "@/types";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useSignalR } from "@/hooks/use-signalr";
import { HubUrls } from "@/types/hubUrls";
import { ReceiveFunctions } from "@/types/receiveFunctions";
import { konularService } from "@/app/services/konular.service";
import CustomToggleDersler from "@/app/admin/dersler/custom.toggle.dersler";
import { userService } from "@/app/services/user.service";
import { roleService } from "@/app/services/role.service";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import authService from "@/app/services/auth.service";

// Zod schema
const dersSchema = z.object({
  dersAdi: z.string().min(1, "Ders adı boş olamaz."),
  isTyt: z.boolean(),
});

const SingleUserContent = () => {
  const { id } = useParams();
  const [user, setUser] = useState<UserById | null>(null);
  const [roles, setRoles] = useState<Role[] | []>([]);
  const [userRoles, setUserRoles] = useState<string[] | []>([]);
  const [inputError, setInputError] = useState<string | null>(null);
  const [emailConfirmed, setEmailConfirmed] = useState<boolean>(false);
  const signalRService = useSignalR();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const fetchUser = async () => {
    if (!id) return;
    try {
      const fetchedUser= await userService.getUserById(id as string);
      setUser(fetchedUser);
    } catch (error) {
    } finally {
    }
  };
  const fetchRoles = async () => {
    if (!id) return;
    try {
      const fetchedRoles = await roleService.getRoles();
      setRoles(fetchedRoles);
    } catch (error) {
    } finally {
    }
  };
 const fetchUserRoles = async () => {
   if (!id) return;
   try {
     const fetchedUserRoles = await userService.getUserRoles(id as string);
     setUserRoles(fetchedUserRoles);
   } catch (error) {
   } finally {
   }
 };

  useEffect(() => {
    fetchUser();
    fetchRoles();
    fetchUserRoles()
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      var model = {
        userId: id,
        roles: userRoles,
      }; 

      await userService.assignToRoles(
        model,
        () => {
          
        },
        (errorMessage) => {
          toast({
            title: "Başarısız",
            description: "Kullanıcı bilgileri güncellenirken bir hata oluştu.",
            variant: "destructive",
          });
        }
      );
    } catch (err) {
      if (err instanceof z.ZodError) {
        setInputError(err.errors[0].message);
      }
    }
  };
 useEffect(() => {
   fetchUser();
   fetchUserRoles();
   const userId = authService.userId as string;
   signalRService.start(HubUrls.UserHub, userId);
   signalRService.on(
     HubUrls.UserHub,
     ReceiveFunctions.UserUpdatedMessage,
     async (message) => {
      toast({
        title: "Başarılı",
        description: message,
      });
     }
   );
   return () => {
     signalRService.off(HubUrls.KonuHub, ReceiveFunctions.KonuUpdatedMessage);
   };
 }, [id, signalRService]);
  if (!user) return <div className="text-center mt-2">Kullanıcı bulunamadı.</div>;

  return (
    <div className="max-w-7xl mx-auto p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* UserId */}
        <div>
          <Label htmlFor="userId">Kullanıcı ID</Label>
          <Input id="userId" value={user.userId} readOnly className="w-full" />
        </div>

        {/* UserName */}
        <div>
          <Label htmlFor="userName">Kullanıcı Adı</Label>
          <Input
            id="userName"
            value={user.userName}
            readOnly
            className="w-full"
          />
        </div>

        {/* Email */}
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" value={user.email} readOnly className="w-full" />
        </div>

        {/* Email Confirmed Checkbox */}
        <div className="flex items-center justify-center space-x-2">
          <Checkbox
            id="emailConfirmed"
            checked={emailConfirmed}
            className="cursor-default"
          />
          <Label htmlFor="emailConfirmed">Email Onayı</Label>
        </div>

        {/* User Roles Checkboxes */}
        <div className="flex flex-col">
          <Label className="text-center">Kullanıcı Rolleri</Label>
          <div className="flex flex-wrap justify-center space-x-4 mt-2">
            {roles.map((role) => (
              <div key={role.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`role-${role.id}`}
                  checked={userRoles.includes(role.name as never)}
                  onCheckedChange={(checked) => {
                    setUserRoles((prevRoles) =>
                      checked === true
                        ? [...prevRoles, role.name]
                        : prevRoles.filter((r) => r !== role.name)
                    );
                  }}
                />
                <Label htmlFor={`role-${role.id}`}>{role.name}</Label>
              </div>
            ))}
          </div>
        </div>

        <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <AlertDialogTrigger asChild>
            <Button className="w-full">
              Güncelle
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Güncelleme Onayı</AlertDialogTitle>
              <AlertDialogDescription>
                Kullanıcı bilgilerini güncellemek istediğinize emin misiniz?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setIsDialogOpen(false)}>
                İptal
              </AlertDialogCancel>
              <AlertDialogAction onClick={(e)=>{
                handleSubmit(e);
                setIsDialogOpen(false);
              }}>Güncelle</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </form>
    </div>
  );
};

export default SingleUserContent;
