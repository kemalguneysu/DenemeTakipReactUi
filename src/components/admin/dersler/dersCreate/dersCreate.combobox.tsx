import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Ders } from "@/types";
import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";

interface ComboboxDemoProps {
  items: Ders[];
  onSelect: (value: string) => void;
  value: string; // Yeni prop: selected value
}

export function ComboboxDemo({ items, onSelect, value }: ComboboxDemoProps) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSelect = (currentValue: string) => {
      onSelect(currentValue);
      setOpen(false);
  };

  // Türkçe karakterlere duyarlı arama
  const normalizeString = (str: string) => {
      return str
          .replace(/ı/g, 'i')
          .replace(/İ/g, 'i')
          .toLowerCase();
  };

  // Filtreleme işlemi
  const filteredItems = items.filter(ders => 
      normalizeString(ders.dersAdi).includes(normalizeString(searchTerm))
  );

  return (
      <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                  {value ? items.find(item => item.id === value)?.dersAdi : "Ders Seçin..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
              <div className="p-2">
                  <input
                      type="text"
                      placeholder="Ders arayın..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full mb-2 border p-1 rounded"
                  />
                  {filteredItems.length === 0 && <div>Ders bulunamadı.</div>}
                  <ScrollArea className="max-h-60 overflow-y-auto rounded-md">
                      <div>
                          {filteredItems.map((ders) => (
                              <div
                                  key={ders.id}
                                  onClick={() => handleSelect(ders.id)}
                                  className={cn(
                                      "flex items-center justify-between px-4 py-2 cursor-pointer",
                                      value === ders.id 
                                          ? "bg-gray-300 dark:bg-gray-800"
                                          : "hover:bg-gray-200 dark:hover:bg-gray-700"
                                  )}
                              >
                                  <span>{ders.dersAdi}</span>
                                  {value === ders.id && <Check className="h-4 w-4" />}
                              </div>
                          ))}
                      </div>
                  </ScrollArea>
              </div>
          </PopoverContent>
      </Popover>
  );
}
