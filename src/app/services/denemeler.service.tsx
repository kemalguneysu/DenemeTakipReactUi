import { CreateAyt, CreateTyt } from "@/types";
import { fetchWithAuth } from "./fetch.withAuth";

class DenemeService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
  }

  async createTyt(tytDeneme: CreateTyt): Promise<void> {
    const response = await fetchWithAuth(`${this.baseUrl}/Tyts/CreateTyt`, {
      method: 'POST',
      body: JSON.stringify(tytDeneme),
    });
    return response; // Başarılı ise JSON olarak döndür
  }

  async createAyt(aytDeneme: CreateAyt): Promise<void> {
    const response = await fetchWithAuth(`${this.baseUrl}/Ayts/CreateAyt`, {
      method: 'POST',
      body: JSON.stringify(aytDeneme),
    });
    return response; // Başarılı ise JSON olarak döndür
  }

  async createDers(ders: { dersAdi: string; isTyt: boolean }): Promise<void> {
    const response = await fetchWithAuth(`${this.baseUrl}/Ders/CreateDers`, {
      method: 'POST',
      body: JSON.stringify(ders),
    });
    return response; // Başarılı ise JSON olarak döndür
  }
}

export const denemeService = new DenemeService();
