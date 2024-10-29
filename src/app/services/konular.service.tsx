import { CreateKonu, ListKonu, UpdateKonu } from "@/types"; // Adjust the path as necessary
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
  async getAllKonular(
    isTyt?: boolean | null,
    konuOrDersAdi?: string,
    page?: number,
    size?: number,
    dersIds?:string[],
    successCallBack?: () => void,
    errorCallBack?: (errorMessage: string) => void
    ): Promise<{ totalCount: number; konular: ListKonu[] }> {
    let queryString = '';

    // Query string oluşturma
    if (isTyt !== undefined && isTyt!=null) {
        queryString += `isTyt=${isTyt}`;
    }
    if (konuOrDersAdi) {
        queryString += `&KonuOrDersAdi=${konuOrDersAdi}`;
    }
    if (dersIds && dersIds.length > 0) 
      queryString += `&dersId=${dersIds.join('&dersId=')}`;
    if (page && size) {
        queryString += `&page=${page}&size=${size}`;
    }
    try {
        const data = await fetchWithAuth(`${this.baseUrl}/Konular/GetAllKonular?${queryString}`, {
            method: 'GET',
        });

        if (successCallBack) {
            successCallBack();
        }

        return data; 
    } catch (error: any) {
        if (errorCallBack) {
            errorCallBack(error.message);
        }
        return { totalCount: 0, konular: [] };
    }
  }
  async deleteKonu(ids: string[]): Promise<any> {
    if (ids.length === 0) {
        throw new Error("Silinecek konu seçilmedi.");
    }

    // Adjust this part if fetchWithAuth returns already parsed JSON
    const response = await fetchWithAuth(`${this.baseUrl}/Konular/DeleteKonu`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ids }),
    });

    return response; 
  }
  async getKonuById(id: string): Promise<ListKonu> {
    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/Konular/GetKonuById?KonuId=${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      
      return response;
    } catch (error) {
        throw new Error("Ders bulunamadı.");            
    }
  }
  async editKonu(updateKonu: UpdateKonu, successCallback?: () => void, errorCallback?: (errorMessage: string) => void){
    try {
        const response = await fetchWithAuth(`${this.baseUrl}/Konular/UpdateKonu`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updateKonu), // Convert the UpdateDers object to JSON
        });
        if(successCallback)
            successCallback();
        return response;
    } catch (error) {
        // Handle generic error
        const errorMessage = 'Bir hata oluştu. Lütfen tekrar deneyin.';
        if (errorCallback) {
            errorCallback(errorMessage);
        }
    }
  }
}
export const konularService = new KonularService();
