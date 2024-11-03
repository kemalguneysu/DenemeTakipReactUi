import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card"; // Kart bileşenini içe aktar
import { userService } from "@/app/services/user.service";
import { toast } from "@/hooks/use-toast";

export default function GetMyDatas() {
  const handleDownload = async () => {
    await userService.getMyDatas(undefined,()=>{
      toast({
        title: "Başarılı",
        description: "Verileriniz indiriliyor.",
      });
    },()=>{
      toast({
        title: "Başarısız",
        description: "Verileriniz indirilirken bir hata ile karşılaşıldı.",
        variant: "destructive",
      });
    })
  };

  return (
    <div className="flex items-center justify-center">
      <Card className="p-6 shadow-md">
        <h1 className="text-2xl font-bold">Deneme Takip</h1>
        <h2 className="text-md mt-2 opacity-70">
          Verilerinizi indirmek için aşağıdaki butona basabilirsiniz.
        </h2>
          <Button
            onClick={handleDownload}
            className="flex justify-self-center mt-2"
          >
            {/* İndirme simgesi */}
            <span>Verilerimi İndir</span>
            <Download className="ml-2" />
          </Button>
      </Card>
    </div>
  );
}
