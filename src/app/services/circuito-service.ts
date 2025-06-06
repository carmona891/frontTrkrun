import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Circuito, CircuitoCreateRequest, CircuitoUpdateRequest } from '../Dto/circuito.model';

@Injectable({
  providedIn: 'root'
})
export class CircuitoService {
  private apiUrl = 'https://apitrkrun-production.up.railway.app/api/Circuitos';

  constructor(private http: HttpClient) { }

  // GET - Obtener todos los circuitos
  getCircuitos(): Observable<Circuito[]> {
    return this.http.get<Circuito[]>(this.apiUrl);
  }

  // GET - Obtener circuito por ID
  getCircuitoById(id: number): Observable<Circuito> {
    return this.http.get<Circuito>(`${this.apiUrl}/${id}`);
  }

  // POST - Crear nuevo circuito
  createCircuito(circuito: CircuitoCreateRequest): Observable<Circuito> {
    return this.http.post<Circuito>(this.apiUrl, circuito);
  }

  // PUT - Actualizar circuito
  updateCircuito(id: number, circuito: CircuitoUpdateRequest): Observable<Circuito> {
    return this.http.put<Circuito>(`${this.apiUrl}/${id}`, circuito);
  }

  // DELETE - Eliminar circuito
  deleteCircuito(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}