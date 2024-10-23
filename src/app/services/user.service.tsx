import { User, UserCreate } from "@/types"; // Adjust the import path according to your project structure

export class UserService {
  private apiUrl: string;

  constructor() {
    this.apiUrl = process.env.NEXT_PUBLIC_API_URL || ""; // Ensure you have the API URL from environment variables
  }

  async create(
    user: User,
    successCallback?: (data: UserCreate) => void, // data parametresini ekliyoruz
    errorCallback?: (errorMessage: string) => void
  ): Promise<UserCreate> {
    try {
      const response = await fetch(`${this.apiUrl}/users/createUser`, {
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
      console.error("Error creating user:", error);
      throw error; // Hata sonrası fırlat
    }
  }
  
}

export const userService = new UserService();
