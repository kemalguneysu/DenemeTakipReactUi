import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card"; // Kart bileşenini içe aktar

export default function GetMyDatas() {
  const handleDownload = () => {
    // İndirme işlemi için gerekli kod buraya gelecek
    console.log("Veriler indiriliyor...");
  };

  return (
    <Card className="w-full max-w-md mx-auto p-4">
      {" "}
      {/* Kart bileşeni */}
      <CardHeader className="flex flex-col">
        <h1 className="text-2xl font-bold">Deneme Takip</h1> {/* Ana başlık */}
        <p className="text-md opacity-70">
          Aşağıdaki butondan verilerinizi indirebilirsiniz.
        </p>{" "}
        {/* Alt başlık */}
      </CardHeader>
      <CardContent className="flex items-center justify-center mt-4">
        <Button
          onClick={handleDownload}
          className="flex items-center space-x-2"
        >
          <Download className="w-4 h-4" /> {/* İndirme simgesi */}
          <span>Verilerimi İndir</span>
        </Button>
      </CardContent>
    </Card>
  );
}
