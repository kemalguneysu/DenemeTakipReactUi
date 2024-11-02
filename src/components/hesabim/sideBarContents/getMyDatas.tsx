import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card"; // Kart bileşenini içe aktar

export default function GetMyDatas() {
  const handleDownload = () => {
    // İndirme işlemi için gerekli kod buraya gelecek
    console.log("Veriler indiriliyor...");
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
