import { jwtDecode } from 'jwt-decode';
import { BehaviorSubject } from 'rxjs'; // Reaktif güncellemeler için RxJS kullanabilirsiniz.
import { toast } from '@/hooks/use-toast'; // Toast hook importu

class AuthService {
    private _isAuthenticated: boolean = false;
    private _isAdmin: boolean = false;
    private _userId: string | null = null; // userId ekleniyor
    private _authStatusSubject = new BehaviorSubject<{ isAuthenticated: boolean; isAdmin: boolean, userId: string | null }>({
        isAuthenticated: this._isAuthenticated,
        isAdmin: this._isAdmin,
        userId: this._userId,
    });

    constructor() {
        this.identityCheck();
    }

    public identityCheck() {
        const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

        if (token) {
            let expired: boolean;
            let roles: string[] = [];

            try {
                const decoded: any = jwtDecode(token);
                const roleClaimName = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';
                const nameIdentifierClaim = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"; // NameIdentifier claim

                // Rol bilgisini alma
                if (decoded[roleClaimName]) {
                    if (Array.isArray(decoded[roleClaimName])) {
                        roles = decoded[roleClaimName];
                    } else {
                        roles = [decoded[roleClaimName]];
                    }
                }

                // userId'yi ayarla
                this._userId = decoded[nameIdentifierClaim] || null; // Eğer yoksa null olarak ayarla

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
            this._userId = null; // Token yoksa userId de null
        }
        // Durum güncellendiğinde bildir
        this._authStatusSubject.next({ 
            isAuthenticated: this._isAuthenticated, 
            isAdmin: this._isAdmin,
            userId: this._userId // userId durumu ekleniyor
        });
    }

    public signOut() {
        localStorage.removeItem("accessToken");
        this.identityCheck(); // Durumu güncelle
        toast({
            title: 'Çıkış Yapıldı',
            description: 'Başarıyla çıkış yaptınız.',
        });
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

    public get userId(): string | null {
        return this._userId; // userId getter ekleniyor
    }

    public authStatus$() {
        return this._authStatusSubject.asObservable(); // Durum güncellemelerini yayınlar
    }
}

const authService = new AuthService();
export default authService;
