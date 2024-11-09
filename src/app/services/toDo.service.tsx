import { CreateKonu, ListKonu, ListToDoElement, ListUserKonular, UpdateKonu } from "@/types"; // Adjust the path as necessary
import { fetchWithAuth } from "./fetch.withAuth";
import { toast } from "@/hooks/use-toast";

class ToDoService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
  }

  async createToDo(
    toDoElementTitle: string,
    toDoDate: Date,
    isCompleted: boolean,
    successCallback?: any
  ): Promise<void> {
    try {
      const response = await fetchWithAuth(
        `${this.baseUrl}/ToDoElement/CreateToDoElement`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            toDoElementTitle: toDoElementTitle,
            toDoDate: toDoDate,
            isCompleted: isCompleted,
          }),
        }
      );
      if (successCallback) {
        successCallback();
      }
    } catch (error) {
      throw error;
    }
  }
  async getToDoElements(
    toDoDateStart: Date,
    toDoDateEnd: Date,
    isCompleted?: boolean | null,
    successCallBack?: () => void,
    errorCallBack?: (errorMessage: string) => void
  ): Promise<{ totalCount: number; toDoElements: ListToDoElement[] }> {
    let queryString = "";

    // Tarihleri ve isCompleted parametresini query string'e ekle
    queryString += `ToDoDateStart=${encodeURIComponent(
      toDoDateStart.toISOString()
    )}`;
    queryString += `&ToDoDateEnd=${encodeURIComponent(
      toDoDateEnd.toISOString()
    )}`;

    // isCompleted parametresi varsa, ekleyin
    if (isCompleted !== undefined && isCompleted !== null) {
      queryString += `&IsCompleted=${isCompleted}`;
    }
    try {
      const data = await fetchWithAuth(
        `${this.baseUrl}/ToDoElement/GetToDoElement?${queryString}`,
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
      return { totalCount: 0, toDoElements: [] };
    }
  }
  async updateToDoElement(
    id: string,
    isCompleted?: boolean,
    toDoTitle?: string,
    successCallback?: any
  ) {
    try {
      const response = await fetchWithAuth(
        `${this.baseUrl}/ToDoElement/UpdateToDoElement`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            toDoId: id,
            toDoTitle: toDoTitle,
            isCompleted: isCompleted,
          }),
        }
      );
      if (successCallback) {
        successCallback();
      }
    } catch (error) {
      throw error;
    }
  }
}
export const toDoService = new ToDoService();
