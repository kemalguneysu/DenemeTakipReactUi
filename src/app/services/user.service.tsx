import { User, UserById, UserCreate, UserList } from "@/types"; // Adjust the import path according to your project structure
import { fetchWithAuth } from "./fetch.withAuth";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/router";

export class UserService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
  }
  async create(
    user: User,
    successCallback?: (data: UserCreate) => void, // data parametresini ekliyoruz
    errorCallback?: (errorMessage: string) => void
  ): Promise<UserCreate> {
    try {
      const response = await fetch(`${this.baseUrl}/users/createUser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        let message = "";

        if (Array.isArray(errorResponse)) {
          errorResponse.forEach((v) => {
            if (Array.isArray(v.value)) {
              v.value.forEach((errorMessage: any) => {
                message += `${errorMessage}\n`;
              });
            }
          });
        } else {
          message = errorResponse.message || "An unknown error occurred.";
        }

        if (errorCallback) {
          errorCallback(message.trim());
        }

        throw new Error(message.trim());
      }

      const data: UserCreate = await response.json();
      if (successCallback) {
        successCallback(data); // Yanıtı successCallback'e geçiriyoruz
      }

      return data;
    } catch (error) {
      throw error; // Hata sonrası fırlat
    }
  }
  async getAllUsers(
    page: number = 1,
    size: number = 5,
    nameOrEmail?: string,
    isAdmin?: boolean | null,
    successCallBack?: any,
    errorCallBack?: (errorMessage: string) => void
  ): Promise<{ totalCount: number; users: UserList[] }> {
    let queryString = "";
    if (nameOrEmail) {
      queryString += `&NameOrEmail=${nameOrEmail}`;
    }
    if (isAdmin != null) queryString += `&IsAdmin=${isAdmin}`;
    if (page && size) {
      queryString += `&page=${page}&size=${size}`;
    }

    try {
      // API'den veri çekme
      const data = await fetchWithAuth(
        `${this.baseUrl}/Users/GetAllUsers?${queryString}`,
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
      return { totalCount: 0, users: [] };
    }
  }
  async getUserById(
    userId: string,
    successCallBack?: any,
    errorCallBack?: (errorMessage: string) => void
  ): Promise<UserById> {
    try {
      const response = await fetchWithAuth(
        `${this.baseUrl}/Users/GetUserById?UserId=${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response;
    } catch (error) {
      throw new Error("Kullanıcı bulunamadı.");
    }
  }
  async getUserRoles(userName: string): Promise<string[]> {
    try {
      const response = await fetchWithAuth(
        `${this.baseUrl}/Users/GetUserRoles?UserName=${userName}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.userRoles;
    } catch (error) {
      throw new Error("Kullanıcı bulunamadı.");
    }
  }
  async assignToRoles(
    model: any,
    successCallback?: () => void,
    errorCallback?: (errorMessage: string) => void
  ) {
    try {
      const response = await fetchWithAuth(
        `${this.baseUrl}/Users/AssignRolesToUser`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(model),
        }
      );
      if (successCallback) {
        successCallback();
      }
    } catch (error) {
      if (errorCallback) errorCallback(error as string);
    }
  }
  async deleteUser(userId?: string) {
    const response = await fetchWithAuth(
      `${this.baseUrl}/Users/DeleteAccount`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      }
    );
    return response;
  }
}

export const userService = new UserService();
