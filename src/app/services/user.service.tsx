import { User, UserById, UserCreate, UserList } from "@/types"; // Adjust the import path according to your project structure
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/router";
import { fetchWithAuth } from "./fetch.withAuth";

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
  async updateUserPassword(
    currentPassword: string,
    newPassword: string,
    passwordConfirm: string
  ) {
    try {
      const response = await fetchWithAuth(
        `${this.baseUrl}/Users/UpdateUserPassword`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            currentPassword,
            newPassword,
            passwordConfirm,
          }),
        }
      );

      return response;
    } catch (error) {
      throw error;
    }
  }
  async updatePassword(
    userId: string,
    resetToken: string,
    password: string,
    passwordConfirm: string,
    successCallback?: () => void,
    errorCallback?: (error: any) => void
  ) {
    try {
      const response = await fetch(`${this.baseUrl}/Users/UpdatePassword`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          resetToken,
          password,
          passwordConfirm,
        }),
      });
      if (successCallback) {
        successCallback();
      }
      var data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  }

  async getMyDatas(
    userId?: string,
    successCallback?: () => void,
    errorCallback?: (error: any) => void
  ) {
    try {
      let url = `${this.baseUrl}/Users/GetMyDatas`;
      if (userId) {
        url += `?userId=${encodeURIComponent(userId)}`;
      }

      const blob = await fetchWithAuth(url, {
        method: "GET",
        headers: {
          Accept: "application/zip", // ZIP dosyası bekliyoruz
        },
      });

      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = "UserData.zip"; // Dosya adı
      document.body.appendChild(a);
      a.click();
      a.remove();

      if (successCallback) {
        successCallback();
      }
    } catch (error) {
      console.error("Hata:", error);
      if (errorCallback) {
        errorCallback(error);
      }
    }
  }
}

export const userService = new UserService();
