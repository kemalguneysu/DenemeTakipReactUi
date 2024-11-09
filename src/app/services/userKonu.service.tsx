import { CreateKonu, ListKonu, ListUserKonular, UpdateKonu } from "@/types"; // Adjust the path as necessary
import { fetchWithAuth } from "./fetch.withAuth";

class UserKonularService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
  }

  async createUserKonu(
    konuIds: string[],
    successCallback?: any
  ): Promise<void> {
    try {
      const response = await fetchWithAuth(
        `${this.baseUrl}/UserKonu/CreateUserKonu`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            KonuIds: konuIds,
          }),
        }
      );

      if (response.ok && successCallback) {
        successCallback();
      }
    } catch (error) {
      throw error;
    }
  }
  async getUserKonular(
    page?: number,
    size?: number,
    dersId?: string,
    successCallBack?: () => void,
    errorCallBack?: (errorMessage: string) => void
  ): Promise<{ totalCount: number; userKonular: ListUserKonular[] }> {
    let queryString = "";
    if (dersId) {
      queryString += `&DersId=${dersId}`;
    }
    if (page && size) {
      queryString += `&page=${page}&size=${size}`;
    }
    try {
      const data = await fetchWithAuth(
        `${this.baseUrl}/UserKonu/GetUserKonular?${queryString}`,
        {
          method: "GET",
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
      return { totalCount: 0, userKonular: [] };
    }
  }
}
export const userKonularService = new UserKonularService();
