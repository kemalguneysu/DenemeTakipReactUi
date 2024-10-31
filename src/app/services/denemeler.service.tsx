import { aytGenelList, AytSingleList, CreateAyt, CreateTyt, tytGenelList, TytSingleList, UpdateAyt, UpdateTyt } from "@/types";
import { fetchWithAuth } from "./fetch.withAuth";

class DenemeService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
  }

  async createTyt(tytDeneme: CreateTyt): Promise<void> {
    const response = await fetchWithAuth(`${this.baseUrl}/Tyts/CreateTyt`, {
      method: "POST",
      body: JSON.stringify(tytDeneme),
    });
    return response; // Başarılı ise JSON olarak döndür
  }

  async createAyt(aytDeneme: CreateAyt): Promise<void> {
    const response = await fetchWithAuth(`${this.baseUrl}/Ayts/CreateAyt`, {
      method: "POST",
      body: JSON.stringify(aytDeneme),
    });
    return response; // Başarılı ise JSON olarak döndür
  }
  async getTytDenemes(
    page: number = 0,
    size: number = 5,
    orderByAndDirections?: Array<{
      orderBy: string;
      orderDirection: "asc" | "desc" | null;
    }>,
    successCallBack?: () => void,
    errorCallBack?: (errorMessage: string) => void
  ): Promise<{ totalCount: number; tytDenemes: tytGenelList[] }> {
    let queryString = `page=${page}&size=${size}`;
    if (orderByAndDirections && orderByAndDirections.length > 0) {
      const orderParams = orderByAndDirections
        .map(
          ({ orderBy, orderDirection }) =>
            `orderByAndDirection=${orderBy},${orderDirection}`
        )
        .join("&");
      queryString += `&${orderParams}`;
    }
    try {
      const data = await fetchWithAuth(
        `${this.baseUrl}/Tyts/getAllTyt?${queryString}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (successCallBack) {
        successCallBack();
      }
      return data;
    } catch (error: any) {
      if (errorCallBack) {
        console.log(error.message);
        errorCallBack(error.message);
      }
      return { totalCount: 0, tytDenemes: [] };
    }
  }
  async getAytDenemes(
    page: number = 0,
    size: number = 5,
    orderByAndDirections?: Array<{
      orderBy: string;
      orderDirection: "asc" | "desc" | null;
    }>,
    successCallBack?: () => void,
    errorCallBack?: (errorMessage: string) => void
  ): Promise<{ totalCount: number; aytDenemes: aytGenelList[] }> {
    let queryString = `page=${page}&size=${size}`;
    if (orderByAndDirections && orderByAndDirections.length > 0) {
      const orderParams = orderByAndDirections
        .map(
          ({ orderBy, orderDirection }) =>
            `orderByAndDirection=${orderBy},${orderDirection}`
        )
        .join("&");
      queryString += `&${orderParams}`;
    }
    try {
      const data = await fetchWithAuth(
        `${this.baseUrl}/Ayts/getAllAyt?${queryString}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (successCallBack) {
        successCallBack();
      }
      return data;
    } catch (error: any) {
      if (errorCallBack) {
        console.log(error.message);
        errorCallBack(error.message);
      }
      return { totalCount: 0, aytDenemes: [] };
    }
  }
  async deleteTytDenemes(ids: string[]): Promise<any> {
    if (ids.length === 0) {
      throw new Error("Silinecek TYT denemesi seçilmedi.");
    }
    const response = await fetchWithAuth(`${this.baseUrl}/Tyts/DeleteTyt`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ids }),
    });
    return response;
  }
  async deleteAytDenemes(ids: string[]): Promise<any> {
    if (ids.length === 0) {
      throw new Error("Silinecek AYT denemesi seçilmedi.");
    }
    const response = await fetchWithAuth(`${this.baseUrl}/Ayts/DeleteAyt`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ids }),
    });
    return response;
  }
  async getTytById(id: string): Promise<TytSingleList> {
    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/Tyts/GetTytById?TytId=${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response as TytSingleList;
    } catch (error) {
      throw new Error("TYT denemesi bulunamadı.");
    }
  }
  async getAytById(id: string): Promise<AytSingleList> {
    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/Ayts/GetAytById?AytId=${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response as AytSingleList;
    } catch (error) {
      throw new Error("AYT denemesi bulunamadı.");
    }
  }
  async editTyt(
    tytDeneme: UpdateTyt,
    successCallback?: any,
    errorCallBack?: (errorMessage: string) => void
  ) {
    try {
      const response = await fetchWithAuth(`${this.baseUrl}/Tyts/updateTyt`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(tytDeneme), // Convert the UpdateDers object to JSON
      });
      if (successCallback) successCallback();
      return response;
    } catch (error: any) {
      if (errorCallBack) {
        errorCallBack(error.message);
      }
    }
  }
  async editAyt(
    aytDeneme: UpdateAyt,
    successCallback?: any,
    errorCallBack?: (errorMessage: string) => void
  ) {
    try {
      const response = await fetchWithAuth(`${this.baseUrl}/Ayts/updateAyt`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(aytDeneme), // Convert the UpdateDers object to JSON
      });
      if (successCallback) successCallback();
      return response;
    } catch (error) {
      // Handle generic error
      const errorMessage = "Bir hata oluştu. Lütfen tekrar deneyin.";
      if (errorCallBack) {
        errorCallBack(errorMessage);
      }
    }
  }
  async getLastTyt(
    successCallBack?: () => void,
    errorCallBack?: (errorMessage: string) => void
  ) {
    try {
      const data = await fetchWithAuth(
        `${this.baseUrl}/HomePage/GetLastTytDeneme`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (successCallBack) {
        successCallBack();
      }
      return data;
    } catch (error: any) {
      if (errorCallBack) {
        errorCallBack(error.message);
      }
    }
  }
  async getLastAyt(
    successCallBack?: () => void,
    errorCallBack?: (errorMessage: string) => void
  ) {
    try {
      const data = await fetchWithAuth(
        `${this.baseUrl}/HomePage/GetLastAytDeneme`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (successCallBack) {
        successCallBack();
      }
      return data;
    } catch (error: any) {
      if (errorCallBack) {
        errorCallBack(error.message);
      }
    }
  }
  async getTytYanlisAnaliz(
    denemeSayisi: number = 5,
    konuSayisi: number = 5,
    dersId?: string,
    successCallBack?: () => void,
    errorCallBack?: (errorMessage: string) => void
  ) {
    try {
      const url =
        `${this.baseUrl}/Tyts/DenemeAnalizTytYanlis?DenemeSayisi=${denemeSayisi}&KonuSayisi=${konuSayisi}` +
        (dersId ? `&DersId=${dersId}` : "");

      const data = await fetchWithAuth(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (successCallBack) {
        successCallBack();
      }
      return data;
    } catch (error: any) {
      if (errorCallBack) {
        errorCallBack(error.message);
      }
    }
  }
  async getTytBosAnaliz(
    denemeSayisi: number = 5,
    konuSayısı: number = 5,
    dersId: string,
    successCallBack?: () => void,
    errorCallBack?: (errorMessage: string) => void
  ) {
    try {
      const data = await fetchWithAuth(
        `${this.baseUrl}/Tyts/DenemeAnalizTytBos?DenemeSayısı=${denemeSayisi}&KonuSayısı=${konuSayısı}&DersId=${dersId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (successCallBack) {
        successCallBack();
      }
      return data;
    } catch (error: any) {
      if (errorCallBack) {
        errorCallBack(error.message);
      }
    }
  }
  async getAytBosAnaliz(
    denemeSayisi: number = 5,
    konuSayısı: number = 5,
    dersId: string,
    successCallBack?: () => void,
    errorCallBack?: (errorMessage: string) => void
  ) {
    try {
      const data = await fetchWithAuth(
        `${this.baseUrl}/Ayts/DenemeAnalizAytBos?DenemeSayısı=${denemeSayisi}&KonuSayısı=${konuSayısı}&DersId=${dersId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (successCallBack) {
        successCallBack();
      }
      return data;
    } catch (error: any) {
      if (errorCallBack) {
        errorCallBack(error.message);
      }
    }
  }
  async getAytYanlisAnaliz(
    denemeSayisi: number = 5,
    konuSayısı: number = 5,
    dersId: string,
    successCallBack?: () => void,
    errorCallBack?: (errorMessage: string) => void
  ) {
    try {
      const data = await fetchWithAuth(
        `${this.baseUrl}/Ayts/DenemeAnalizAytYanlis?DenemeSayısı=${denemeSayisi}&KonuSayısı=${konuSayısı}&DersId=${dersId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (successCallBack) {
        successCallBack();
      }
      return data;
    } catch (error: any) {
      if (errorCallBack) {
        errorCallBack(error.message);
      }
    }
  }
  async getTytAnaliz(
    denemeSayisi: number = 5,
    konuSayisi: number = 5,
    dersId: string,
    type: string,
    successCallBack?: () => void,
    errorCallBack?: (errorMessage: string) => void
  ) {
    try {
      const baseUrl = `${this.baseUrl}/Tyts/TytAnaliz`; // Temel URL
      const queryParams = new URLSearchParams({
        DenemeSayisi: denemeSayisi.toString(),
        KonuSayisi: konuSayisi.toString(),
        DersId: dersId,
        Type: type,
      }).toString();

      const fullUrl = `${baseUrl}?${queryParams}`;
      const data = await fetchWithAuth(fullUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (successCallBack) {
        successCallBack();
      }
      return data.tytAnaliz;
    } catch (error: any) {
      if (errorCallBack) {
        errorCallBack(error.message);
      }
    }
  }
  async getAytAnaliz(
    denemeSayisi: number = 5,
    konuSayisi: number = 5,
    dersId: string,
    type: string,
    successCallBack?: () => void,
    errorCallBack?: (errorMessage: string) => void
  ) {
    try {
      const baseUrl = `${this.baseUrl}/Ayts/AytAnaliz`; // Temel URL
      const queryParams = new URLSearchParams({
        DenemeSayisi: denemeSayisi.toString(),
        KonuSayisi: konuSayisi.toString(),
        DersId: dersId,
        Type: type,
      }).toString();

      const fullUrl = `${baseUrl}?${queryParams}`;
      const data = await fetchWithAuth(fullUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (successCallBack) {
        successCallBack();
      }
      return data.aytAnaliz;
    } catch (error: any) {
      if (errorCallBack) {
        errorCallBack(error.message);
      }
    }
  }
  async getTytNetAnaliz(
    denemeSayisi: number,
    dersAdi?: string | null,
    successCallBack?: () => void,
    errorCallBack?: (errorMessage: string) => void
  ) {
    try {
      const url = new URL(`${this.baseUrl}/Tyts/TytNetAnaliz`);
      url.searchParams.append("DenemeSayisi", denemeSayisi.toString());

      // Eğer dersAdi varsa, onu da URL'ye ekliyoruz.
      if (dersAdi) {
        url.searchParams.append("DersAdi", dersAdi);
      }

      const data = await fetchWithAuth(url.toString(), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (successCallBack) {
        successCallBack();
      }
      return data.tyts;
    } catch (error: any) {
      if (errorCallBack) {
        errorCallBack(error.message);
      }
    }
  }
  async getAytNetAnaliz(
    denemeSayisi: number,
    alanTur: string,
    dersAdi?: string | null,
    successCallBack?: () => void,
    errorCallBack?: (errorMessage: string) => void
  ) {
    try {
      const url = new URL(`${this.baseUrl}/Ayts/AytNetAnaliz`);
      url.searchParams.append("DenemeSayisi", denemeSayisi.toString());
      url.searchParams.append("AlanTuru", alanTur);

      // Eğer dersAdi varsa, onu da ekliyoruz
      if (dersAdi) {
        url.searchParams.append("DersAdi", dersAdi);
      }

      // Fetch isteğini yapıyoruz
      const data = await fetchWithAuth(url.toString(), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (successCallBack) {
        successCallBack();
      }
      return data.ayts;
    } catch (error: any) {
      if (errorCallBack) {
        errorCallBack(error.message);
      }
    }
  }
}


export const denemeService = new DenemeService();
