import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

interface AuthResponse {
  token: string;
  expiration?: string;
}

interface JwtPayload {
  sub?: string;           // user id
  email?: string;         // user email  
  rol_id?: string | number; // rol_id como viene del backend C#
  name?: string;          // user name
  exp?: number;           // expiration timestamp
  iss?: string;           // issuer
  aud?: string;           // audience
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'https://apitrkrun-production.up.railway.app/api/auth';

  constructor(private http: HttpClient) { }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${this.baseUrl}/login`,
      { email, password }
    ).pipe(
      tap(response => {
        if (!response || !response.token) {
          console.error('[AuthService] login: no llegó token en la respuesta', response);
          throw new Error('Token no recibido del servidor');
        }
        // Solo guardamos el JWT
        localStorage.setItem('jwt_token', response.token);
        console.log('[AuthService] Token guardado, rol del usuario:', this.getRoleId());
      })
    );
  }

  logout(): void {
    localStorage.removeItem('jwt_token');
    console.log('[AuthService] Sesión cerrada');
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem('jwt_token');
    if (!token) return false;

    // Verificar si el token ha expirado
    try {
      const payload = this.decodeJWT(token);
      if (payload.exp && payload.exp * 1000 < Date.now()) {
        console.log('[AuthService] Token expirado');
        this.logout();
        return false;
      }
      return true;
    } catch (error) {
      console.error('[AuthService] Error al verificar token:', error);
      this.logout();
      return false;
    }
  }

  getToken(): string | null {
    return localStorage.getItem('jwt_token');
  }

  /**
   * Decodifica el JWT y retorna el payload
   */
  private decodeJWT(token: string): JwtPayload {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        throw new Error('JWT mal formado');
      }
      
      const payload = parts[1];
      const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
      return JSON.parse(decoded);
    } catch (error) {
      console.error('[AuthService] Error decodificando JWT:', error);
      throw new Error('No se pudo decodificar el token');
    }
  }

  /**
   * Obtiene el rol_id del usuario desde el JWT
   */
  getRoleId(): number | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload = this.decodeJWT(token);
      // Tu backend usa 'rol_id' como claim personalizado
      const roleId = payload.rol_id || payload.rol_id || payload.rol_id;
      return roleId ? parseInt(roleId.toString(), 10) : null;
    } catch (error) {
      console.error('[AuthService] Error obteniendo rol:', error);
      return null;
    }
  }

  /**
   * Verifica si el usuario es administrador (rol_id = 1)
   */
  isAdmin(): boolean {
    return this.getRoleId() === 1;
  }

  /**
   * Obtiene información completa del usuario desde el JWT
   */
  getUserInfo(): JwtPayload | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      return this.decodeJWT(token);
    } catch (error) {
      console.error('[AuthService] Error obteniendo información del usuario:', error);
      return null;
    }
  }
}