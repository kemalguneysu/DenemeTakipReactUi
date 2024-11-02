import { BehaviorSubject } from "rxjs";
import { toast } from "@/hooks/use-toast";
import { jwtDecode } from "jwt-decode";

class AuthService {
  private _isAuthenticated = false;
  private _isAdmin = false;
  private _userId: string | null = null;
  private _authStatusSubject = new BehaviorSubject<{
    isAuthenticated: boolean;
    isAdmin: boolean;
    userId: string | null;
  }>({
    isAuthenticated: this._isAuthenticated,
    isAdmin: this._isAdmin,
    userId: this._userId,
  });
  constructor() {
    this.identityCheck();
  }

  // Cookie'den tokeni alır
  private getCookie(name: string): string | null {
    const matches = document.cookie.match(
      new RegExp(
        "(?:^|; )" +
          name.replace(/([.$?*|{}()\[\]\\\/\+^])/g, "\\$1") +
          "=([^;]*)"
      )
    );
    return matches ? decodeURIComponent(matches[1]) : null;
  }

  // Kullanıcı oturumunu kapatır ve çerezleri temizler
  public async signOut(): Promise<void> {
    // Çerezleri temizle
    document.cookie =
      "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/"; // Çerezi sil
    this._isAuthenticated = false;
    this._isAdmin = false;
    this._userId = null;

    // Güncellenen durumu yayınla
    this._authStatusSubject.next({
      isAuthenticated: this._isAuthenticated,
      isAdmin: this._isAdmin,
      userId: this._userId,
    });

    // Kullanıcıya bilgi ver
    toast({
      title: "Oturum kapatıldı",
      description: "Başarıyla çıkış yapıldı.",
    });
  }

  public async identityCheck(): Promise<void> {
    const token =
      typeof document !== "undefined" ? this.getCookie("accessToken") : null;

    if (token) {
      try {
        const decoded: any = jwtDecode(token);

        this._isAuthenticated = !this.isTokenExpired(decoded);
        this._userId =
          decoded[
            "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
          ] || null;
        this._isAdmin =
          decoded[
            "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
          ]?.includes("admin") || false;
      } catch (error) {
        console.error("Token çözümleme hatası:", error);
        this._isAuthenticated = false;
        this._isAdmin = false;
        this._userId = null;
      }
    } else {
      this._isAuthenticated = false;
      this._isAdmin = false;
      this._userId = null;
    }

    // Güncellenen durumu yayınla
    this._authStatusSubject.next({
      isAuthenticated: this._isAuthenticated,
      isAdmin: this._isAdmin,
      userId: this._userId,
    });
  }

  private isTokenExpired(decodedToken: any): boolean {
    return decodedToken.exp * 1000 < Date.now();
  }

  public get isAuthenticated(): boolean {
    return this._isAuthenticated;
  }

  public get isAdmin(): boolean {
    return this._isAdmin;
  }

  public get userId(): string | null {
    return this._userId;
  }

  public authStatus$() {
    return this._authStatusSubject.asObservable();
  }
}

const authService = new AuthService();
export default authService;
