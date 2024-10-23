import { CreateDers } from "@/types";
import { fetchWithAuth } from "./fetch.withAuth";

class DerslerService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
  }

  async createDers(ders: CreateDers): Promise<any> {
    const response = await fetchWithAuth(`${this.baseUrl}/Ders/CreateDers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(ders),
    });
    
    return response; // Başarılıysa yanıtı JSON olarak döndür
  }
}

export const derslerService = new DerslerService();
