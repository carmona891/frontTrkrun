//usuarios-service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { User, UserCreateRequest, UserUpdateRequest } from '../Dto/user.model';
import { Torneo } from '../Dto/torneo.model';
import { AuthService } from './auth.service';

// Tu UserDto exacto
export interface UserDto {
  id?: number;
  name: string;
  email: string;
  rol_id: number;
  points: number;
  torneosInscritos: any[];
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:5186/api/Users';
  
  private currentUserSubject = new BehaviorSubject<UserDto | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // === MÉTODOS EXISTENTES ===
  
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl, {
      headers: this.getAuthHeaders()
    });
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  createUser(user: UserCreateRequest): Observable<User> {
    return this.http.post<User>(this.apiUrl, user, {
      headers: this.getAuthHeaders()
    });
  }

  updateUser(id: number, user: UserUpdateRequest): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, user, {
      headers: this.getAuthHeaders()
    });
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  getUsersByRol(rolId: number): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/rol/${rolId}`, {
      headers: this.getAuthHeaders()
    });
  }

  getUserTorneos(userId: number): Observable<Torneo[]> {
    return this.http.get<Torneo[]>(`${this.apiUrl}/${userId}/torneos`, {
      headers: this.getAuthHeaders()
    });
  }

  inscribirUserEnTorneo(userId: number, torneoId: number): Observable<void> {
    return this.http.post<void>(`http://localhost:5186/api/Torneos/${torneoId}/Usuarios/${userId}`, {}, {
      headers: this.getAuthHeaders()
    });
  }

  desinscribirUserDeTorneo(userId: number, torneoId: number): Observable<void> {
    return this.http.delete<void>(`http://localhost:5186/api/Torneos/${torneoId}/Usuarios/${userId}`, {
      headers: this.getAuthHeaders()
    });
  }

  // === NUEVOS MÉTODOS PARA PERFIL ===

  getCurrentUserProfile(): Observable<UserDto> {
    return this.http.get<UserDto>(`${this.apiUrl}/profile`, {
      headers: this.getAuthHeaders()
    }).pipe(
      tap((userDto: UserDto) => {
        this.currentUserSubject.next(userDto);
      })
    );
  }

  updateUserName(name: string): Observable<UserDto> {
    return this.http.put<UserDto>(`${this.apiUrl}/profile`, { name }, {
      headers: this.getAuthHeaders()
    }).pipe(
      tap((updatedUser: UserDto) => {
        this.currentUserSubject.next(updatedUser);
      })
    );
  }

  clearUserData(): void {
    this.currentUserSubject.next(null);
  }

  getCurrentUser(): UserDto | null {
    return this.currentUserSubject.value;
  }
}