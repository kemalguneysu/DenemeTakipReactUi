import authService from "@/app/services/auth.service";
import { userService } from "@/app/services/user.service";
import { Icons } from "@/components/icons";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import React from "react";

export default function DeleteMyAccount() {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const router = useRouter();
  const handleDeleteSelected: () => Promise<void> = async () => {
    const result = await userService.deleteUser();
    console.log("Delete User Result:", result);
    setDialogOpen(false);
    if (result.succeeded) {
      await authService.signOut();
      await authService.identityCheck();
      await router.push("/");
      toast({
        title: "Başarılı",
        description: result.message,
      });
    }
    else{
        toast({
          title: "Başarısız",
          description: result.message,
          variant: "destructive",
        });
    }
  };

  return (
    <div className="flex items-center justify-center">
      <Card className="p-6 shadow-md">
        <h1 className="text-2xl font-bold">Deneme Takip</h1>
        <h2 className="text-md mt-2 opacity-70">
          Hesabınızı silmek için aşağıdaki butona basabilirsiniz.
        </h2>
        <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <AlertDialogTrigger asChild>
            <Button variant="outline" className="flex justify-self-center mt-2">
              Hesabımı Sil <Icons.trash2 className="ml-2" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Silme Onayı</AlertDialogTitle>
              <AlertDialogDescription>
                Hesabınızı silmek istediğinize emin misiniz?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>İptal</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  handleDeleteSelected();
                }}
              >
                Sil
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </Card>
    </div>
  );
}
