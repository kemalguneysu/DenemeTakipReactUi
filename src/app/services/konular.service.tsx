import { CreateKonu } from "@/types"; // Adjust the path as necessary
import { fetchWithAuth } from "./fetch.withAuth";

class KonularService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
  }

  async createKonu(konu: CreateKonu, successCallback?: any): Promise<void> {
    try {
      const response = await fetchWithAuth(`${this.baseUrl}/konular/createkonu`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(konu), // Send the CreateKonu object
      });

      if (response.ok && successCallback) {
        successCallback();
      }
    } catch (error) {
      throw error;
    }
  }
}

export const konularService = new KonularService();
