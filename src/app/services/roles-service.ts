import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Rol, RolCreateRequest, RolUpdateRequest } from '../Dto/rol.model';

@Injectable({
  providedIn: 'root'
})
export class RolService {
  private apiUrl = 'http://localhost:5186/api/Roles';

  constructor(private http: HttpClient) { }

  // GET - Obtener todos los roles
  getRoles(): Observable<Rol[]> {
    return this.http.get<Rol[]>(this.apiUrl);
  }

  // GET - Obtener rol por ID
  getRolById(id: number): Observable<Rol> {
    return this.http.get<Rol>(`${this.apiUrl}/${id}`);
  }

  // POST - Crear nuevo rol
  createRol(rol: RolCreateRequest): Observable<Rol> {
    return this.http.post<Rol>(this.apiUrl, rol);
  }

  // PUT - Actualizar rol
  updateRol(id: number, rol: RolUpdateRequest): Observable<Rol> {
    return this.http.put<Rol>(`${this.apiUrl}/${id}`, rol);
  }

  // DELETE - Eliminar rol
  deleteRol(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}