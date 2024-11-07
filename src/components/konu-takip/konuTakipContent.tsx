"use client";
import React, { useEffect, useState } from "react";
import { derslerService } from "@/app/services/dersler.service";
import { konularService } from "@/app/services/konular.service";
import { toast } from "@/hooks/use-toast";
import { Ders, Konu, ListUserKonular } from "@/types";
import { ScrollArea } from "../ui/scroll-area";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { motion, AnimatePresence } from "framer-motion";
import CustomToggleDersler from "@/app/admin/dersler/custom.toggle.dersler";
import { userKonularService } from "@/app/services/userKonu.service";
import { Input } from "../ui/input";
import SpinnerMethodComponent from "@/app/spinner/spinnerForMethods";

export default function KonuTakipContent() {
  const [dersler, setDersler] = useState<Ders[]>([]);
  const [konular, setKonular] = useState<Konu[]>([]);
  const [filteredKonular, setFilteredKonular] = useState<Konu[]>([]);
  const [selectedKonuId, setSelectedKonuId] = useState<string>(""); // Tek bir string olarak güncellendi
  const [selectedDersId, setSelectedDersId] = useState<string | null>(null);
  const [isTyt, setIsTyt] = useState<boolean>(true); // TYT/AYT seçimi için state
  const [searchTerm, setSearchTerm] = useState("");
  const [openedGroup, setOpenedGroup] = useState<string | null>(null); // Grup açma durumu için state
  const [userKonular, setuserKonular] = useState<ListUserKonular[]>([]);
  const [userKonularCount, setuserKonularCount] = useState<number>(0);
  const [loading, setLoading] = useState(false); 

  // TYT/AYT geçişine göre dersleri güncelle
  useEffect(() => {
    
    const fetchDersler = async () => {
    setLoading(true);
      try {
        const response = await derslerService.getAllDers(isTyt);
        const sortedDersler = response.dersler.sort((a, b) => {
          const order = isTyt
            ? ["Türkçe", "Matematik", "Fen", "Sosyal"] // TYT sıralaması
            : [
                "Matematik",
                "Fizik",
                "Kimya",
                "Biyoloji",
                "Edebiyat",
                "Tarih1",
                "Coğrafya1",
                "Tarih2",
                "Coğrafya2",
                "Felsefe",
                "Din",
                "Dil",
              ]; // AYT sıralaması

          return order.indexOf(a.dersAdi) - order.indexOf(b.dersAdi);
        });
        setDersler(sortedDersler);
      } catch (error) {
        toast({
          title: "Hata",
          description: "Dersler alınırken bir hata oluştu.",
          variant: "destructive",
        });
      }
    setLoading(false);

    };
    fetchDersler();
  }, [isTyt]);
    const fetchUserKonular = async () => {
      try {
        const response = await userKonularService.getUserKonular(
          undefined,
          undefined,
          selectedDersId as string,
          undefined,
          undefined
        );
        setuserKonular(response.userKonular);
        setuserKonularCount(response.totalCount);
      } catch (error) {
        toast({
          title: "Hata",
          description: "Dersler alınırken bir hata oluştu.",
          variant: "destructive",
        });
      }

    };
    useEffect(()=>{
        
        fetchUserKonular();
    },[selectedDersId])
    
  const handleGroupClick = (groupName: string) => {
    // Ana kartlardan birine tıklandığında, o grup açılacak
    if (openedGroup === groupName) {
      setOpenedGroup(null); // Aynı grup tekrar tıklanırsa kapat
    } else {
      setOpenedGroup(groupName);
    }
  };

  const handleDersClick = async (dersId: string, e: React.MouseEvent) => {
     e.stopPropagation();
    if (selectedDersId === dersId) {
      setSelectedDersId(null);
      setKonular([]); // Dersin konularını temizle
      setFilteredKonular([]);
    } else {
      setSelectedDersId(dersId);
      setSearchTerm("");
      setLoading(true);
      try {
        const response = await konularService.getAllKonular(
          isTyt,
          undefined,
          undefined,
          undefined,
          [dersId]
        );
        setKonular(response.konular);
        setFilteredKonular(response.konular);
      } catch (error) {
        toast({
          title: "Hata",
          description: "Konular alınırken bir hata oluştu.",
          variant: "destructive",
        });
      }
      setLoading(false);

    }
  };

  const handleCheckboxChange = async (
    konuId: string,
    checked: boolean // 'checked' parametresini doğrudan alıyoruz
  ) => {
    if (checked) {
      setSelectedKonuId(konuId);
    } else {
      setSelectedKonuId("");
    }
    try {
      await userKonularService.createUserKonu([konuId]);
      fetchUserKonular();
    } catch (error) {
      toast({
        title: "Hata",
        description: "Konular kaydedilirken bir hata oluştu.",
        variant: "destructive",
      });
    }

  };

  const handleSearchChange = (searchTerm: string) => {
    setSearchTerm(searchTerm);
    setFilteredKonular(
      konular.filter((konu) =>
        konu.konuAdi.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  };

  const getGroupDersler = (groupName: string) => {
    switch (groupName) {
      case "Sayısal":
        return dersler.filter((ders) =>
          ["Matematik", "Fizik", "Kimya", "Biyoloji"].includes(ders.dersAdi)
        );
      case "Eşit Ağırlık":
        return dersler.filter((ders) =>
          ["Edebiyat", "Matematik", "Tarih1", "Coğrafya1"].includes(
            ders.dersAdi
          )
        );
      case "Sözel":
        return dersler.filter((ders) =>
          [
            "Edebiyat",
            "Tarih1",
            "Coğrafya1",
            "Tarih2",
            "Coğrafya2",
            "Felsefe",
            "Din",
          ].includes(ders.dersAdi)
        );
      case "Dil": // Dil grubunu da ekledik
        return dersler.filter((ders) => ders.dersAdi === "Dil");
      default:
        return [];
    }
  };

  return (
    <div className="space-y-4 mx-4">
      {loading && <SpinnerMethodComponent />}

      {/* Toggle bileşenini derslerin üstüne ekledik */}
      <CustomToggleDersler onChange={setIsTyt} isTyt={isTyt} />

      {/* Ana kartlar Sayısal, Eşit Ağırlık, Sözel ve Dil */}
      {!isTyt && (
        <>
          {["Sayısal", "Eşit Ağırlık", "Sözel", "Dil"].map((group) => (
            <Card key={group} className="my-4 max-w-xl mx-auto">
              <CardHeader
                onClick={() => handleGroupClick(group)}
                className="cursor-pointer"
              >
                <CardTitle className="font-semibold text-xl text-center">
                  {group}
                </CardTitle>
              </CardHeader>
              <AnimatePresence>
                {openedGroup === group && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }} // Kartın içeriği açılacak
                    exit={{ opacity: 0, height: 0 }} // Kart kapanırken kaybolacak
                    transition={{ duration: 0.3, ease: "easeInOut" }} // Yavaş açılma ve kapanma
                    className="overflow-hidden"
                  >
                    <CardContent>
                      {getGroupDersler(group).map((ders) => (
                        <Card
                          key={ders.id}
                          onClick={(e) => {
                            e.stopPropagation(); // Propagation'ı engelliyoruz
                            handleDersClick(ders.id, e); // Ders tıklanmasında card açılır
                          }}
                          className="mb-2"
                        >
                          <CardHeader className="cursor-pointer">
                            <CardTitle className="font-normal text-lg text-center">
                              {ders.dersAdi}
                            </CardTitle>

                            {selectedDersId === ders.id && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }} // Kartın içeriği açılacak
                                exit={{ opacity: 0, height: 0 }} // Kart kapanırken kaybolacak
                                transition={{
                                  duration: 0.3,
                                  ease: "easeInOut",
                                }} // Yavaş açılma ve kapanma
                                className="overflow-hidden"
                              >
                                <div className="text-center text-sm opacity-80">
                                  {konular.length} konudan {userKonularCount}{" "}
                                  tanesi tamamlandı (
                                  {konular.length > 0
                                    ? (
                                        (userKonularCount / konular.length) *
                                        100
                                      ).toFixed(2)
                                    : 0}
                                  %)
                                </div>
                              </motion.div>
                            )}
                          </CardHeader>
                          <AnimatePresence>
                            {selectedDersId === ders.id && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }} // Kartın içeriği açılacak
                                exit={{ opacity: 0, height: 0 }} // Kart kapanırken kaybolacak
                                transition={{
                                  duration: 0.3,
                                  ease: "easeInOut",
                                }} // Yavaş açılma ve kapanma
                                className="overflow-hidden"
                              >
                                <CardContent
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <Input
                                    type="text"
                                    placeholder="Konu arayın..."
                                    className="w-full my-2 border p-1 rounded"
                                    onChange={(e) =>
                                      handleSearchChange(e.target.value)
                                    }
                                    onClick={(e) => e.stopPropagation()}
                                  />
                                  <ScrollArea className="h-32 overflow-y-auto">
                                    {filteredKonular.length === 0 ? (
                                      <p>Konu bulunamadı.</p>
                                    ) : (
                                      <div className="space-y-2">
                                        {filteredKonular.map((konu) => (
                                          <div
                                            key={konu.id}
                                            className="flex items-center space-x-1"
                                          >
                                            <Checkbox
                                              id={`checkbox-${konu.id}`}
                                              checked={userKonular.some(
                                                (konuItem) =>
                                                  konuItem.konuId === konu.id
                                              )}
                                              onClick={(e) =>
                                                e.stopPropagation()
                                              }
                                              onCheckedChange={(e) => {
                                                const isChecked = e; // 'checked' değerini doğrudan alıyoruz
                                                handleCheckboxChange(
                                                  konu.id,
                                                  isChecked as boolean
                                                );
                                              }}
                                            />
                                            <Label
                                              htmlFor={`checkbox-${konu.id}`}
                                            >
                                              {konu.konuAdi}
                                            </Label>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </ScrollArea>
                                </CardContent>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </Card>
                      ))}
                    </CardContent>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          ))}
        </>
      )}

      {/* TYT dersleri */}
      {isTyt && (
        <div>
          {dersler.map((ders) => (
            <Card key={ders.id} className="my-4 max-w-xl mx-auto">
              <CardHeader
                onClick={(e) => {
                  e.stopPropagation(); // Propagation'ı engelliyoruz
                  handleDersClick(ders.id, e); // Ders tıklanmasında card açılır
                }}
                className="cursor-pointer"
              >
                <CardTitle className="text-xl text-center">
                  {ders.dersAdi}
                </CardTitle>
                {selectedDersId === ders.id && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{
                      duration: 0.3,
                      ease: "easeInOut",
                    }}
                  >
                    <div className="text-center text-sm opacity-80">
                      {konular.length} konudan {userKonularCount} tanesi
                      tamamlandı (
                      {konular.length > 0
                        ? ((userKonularCount / konular.length) * 100).toFixed(2)
                        : 0}
                      %)
                    </div>
                  </motion.div>
                )}
              </CardHeader>
              <AnimatePresence>
                {selectedDersId === ders.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }} // Kartın içeriği açılacak
                    exit={{ opacity: 0, height: 0 }} // Kart kapanırken kaybolacak
                    transition={{ duration: 0.3, ease: "easeInOut" }} // Yavaş açılma ve kapanma
                    className="overflow-hidden"
                  >
                    <CardContent>
                      <Input
                        type="text"
                        placeholder="Konu arayın..."
                        className="w-full my-2 border p-1 rounded"
                        onChange={(e) => handleSearchChange(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <ScrollArea className="h-32 overflow-y-auto">
                        {filteredKonular.length === 0 ? (
                          <p>Konu bulunamadı.</p>
                        ) : (
                          <div className="space-y-2">
                            {filteredKonular.map((konu) => (
                              <div
                                key={konu.id}
                                className="flex items-center space-x-1"
                              >
                                <Checkbox
                                  id={`checkbox-${konu.id}`}
                                  checked={userKonular.some(
                                    (konuItem) => konuItem.konuId === konu.id
                                  )}
                                  onCheckedChange={(e) => {
                                    const isChecked = e;
                                    handleCheckboxChange(
                                      konu.id,
                                      isChecked as boolean
                                    );
                                  }}
                                />

                                <Label htmlFor={`checkbox-${konu.id}`}>
                                  {konu.konuAdi}
                                </Label>
                              </div>
                            ))}
                          </div>
                        )}
                      </ScrollArea>
                    </CardContent>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
