import { CreateKonu, ListKonu, Role, UpdateKonu } from "@/types"; // Adjust the path as necessary
import { fetchWithAuth } from "./fetch.withAuth";

class RoleService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
  }
  async getRoles():Promise<Role[]>{
    try {
      const response = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_URL}/Roles/GetAllRoles`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response;
    } catch (error) {
      throw new Error("Rol bulunamadı.");
    }
  }
}
export const roleService = new RoleService();
