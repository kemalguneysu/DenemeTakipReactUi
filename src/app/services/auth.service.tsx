import { jwtDecode } from 'jwt-decode';
class AuthService {
    private _isAuthenticated: boolean = false;
    private _isAdmin: boolean = false;
  
    constructor() {
      this.identityCheck();
    }
  
    private identityCheck() {
      const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  
      if (token) {
        let expired: boolean;
        let roles: string[] = [];
  
        try {
          const decoded: any = jwtDecode(token);
          const roleClaimName = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';
  
          // Rol bilgisini alma
          if (decoded[roleClaimName]) {
            if (Array.isArray(decoded[roleClaimName])) {
              roles = decoded[roleClaimName];
            } else {
              roles = [decoded[roleClaimName]];
            }
          }
  
          // Token süresi kontrolü
          expired = this.isTokenExpired(decoded);
        } catch (error) {
          console.error('Token çözümleme hatası:', error);
          expired = true;
        }
        this._isAdmin = roles.includes('admin');
        this._isAuthenticated = !expired;
      } else {
        this._isAuthenticated = false;
        this._isAdmin = false;
      }
    }
    public signOut() {
        localStorage.removeItem("accessToken");
        this.identityCheck(); // Durumu güncelle
    }

    private isTokenExpired(decodedToken: any): boolean {
      return decodedToken.exp * 1000 < Date.now(); // Expiry time in milliseconds
    }
  
    public get isAuthenticated(): boolean {
      return this._isAuthenticated;
    }
  
    public get isAdmin(): boolean {
      return this._isAdmin;
    }
  }
  
  const authService = new AuthService();
  export default authService;