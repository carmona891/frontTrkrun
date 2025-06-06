//torneos-service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Torneo, TorneoCreateRequest, TorneoUpdateRequest } from '../Dto/torneo.model';

@Injectable({
  providedIn: 'root'
})
export class TorneoService {
  private apiUrl = 'http://localhost:5186/api/Torneos';

  constructor(private http: HttpClient) { }

  // GET - Obtener todos los torneos
  getTorneos(): Observable<Torneo[]> {
    return this.http.get<Torneo[]>(this.apiUrl);
  }

  // GET - Obtener torneo por ID
  getTorneoById(id: number): Observable<Torneo> {
    return this.http.get<Torneo>(`${this.apiUrl}/${id}`);
  }

  // POST - Crear nuevo torneo
  createTorneo(torneo: TorneoCreateRequest): Observable<Torneo> {
    return this.http.post<Torneo>(this.apiUrl, torneo);
  }

  // PUT - Actualizar torneo
  updateTorneo(id: number, torneo: TorneoUpdateRequest): Observable<Torneo> {
    return this.http.put<Torneo>(`${this.apiUrl}/${id}`, torneo);
  }

  // DELETE - Eliminar torneo
  deleteTorneo(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Métodos adicionales útiles para torneos
  getTorneosByCircuito(circuitoId: number): Observable<Torneo[]> {
    return this.http.get<Torneo[]>(`${this.apiUrl}/circuito/${circuitoId}`);
  }

  getTorneosByFecha(fecha: string): Observable<Torneo[]> {
    return this.http.get<Torneo[]>(`${this.apiUrl}/fecha/${fecha}`);
  }




  // Para unirse
joinTorneo(torneoId: number, userId: number): Observable<Torneo> {
  return this.http.patch<Torneo>(`${this.apiUrl}/${torneoId}/participants/${userId}`, 
    { join: true });
}

// Para salirse
leaveTorneo(torneoId: number, userId: number): Observable<Torneo> {
  return this.http.patch<Torneo>(`${this.apiUrl}/${torneoId}/participants/${userId}`, 
    { join: false });
}

//-----------------------------------------------------------
// Obtener participantes de un torneo
getParticipantesTorneo(torneoId: number): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/${torneoId}/participantes`);
}

// Finalizar torneo
finalizarTorneo(torneoId: number, finalizarData: any): Observable<any> {
  return this.http.post<any>(`${this.apiUrl}/${torneoId}/finalize`, finalizarData);
}



}