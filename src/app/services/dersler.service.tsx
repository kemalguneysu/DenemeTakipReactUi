import { CreateDers, Ders } from "@/types";
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

    async getAllDers(
        isTyt?: boolean | null,
        dersAdi?: string,
        page?: number,
        size?: number,
        successCallBack?: () => void,
        errorCallBack?: (errorMessage: string) => void
    ): Promise<{ totalCount: number; dersler: Ders[] }> {
        let queryString = '';

        // Query string oluşturma
        if (isTyt !== undefined && isTyt!=null) {
            queryString += `isTyt=${isTyt}`;
        }
        if (dersAdi) {
            queryString += `&DersAdi=${dersAdi}`;
        }
        if (page && size) {
            queryString += `&page=${page}&size=${size}`;
        }

        try {
            // API'den veri çekme
            const data = await fetchWithAuth(`${this.baseUrl}/Ders/GetAllDersler?${queryString}`, {
                method: 'GET',
            });

            // Başarılıysa geri çağırma fonksiyonunu çağır
            if (successCallBack) {
                successCallBack();
            }

            return data; // JSON olarak gelen veriyi döndür
        } catch (error: any) {
            // Hata durumunda geri çağırma fonksiyonunu çağır
            if (errorCallBack) {
                errorCallBack(error.message);
            }

            // Varsayılan boş veri döndür
            return { totalCount: 0, dersler: [] };
        }
    }
    async deleteDers(ids: string[]): Promise<any> {
        if (ids.length === 0) {
            throw new Error("Silinecek ders seçilmedi.");
        }
    
        // Adjust this part if fetchWithAuth returns already parsed JSON
        const response = await fetchWithAuth(`${this.baseUrl}/Ders/DeleteDers`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ids }),
        });
    
        return response; 
    }
}

export const derslerService = new DerslerService();
