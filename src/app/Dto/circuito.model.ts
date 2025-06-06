// models/circuito.model.ts
export interface Circuito {
    id: number;
    name: string;
    ubicacion: string;
  }
  
  export interface CircuitoCreateRequest {
    id: number;
    name: string;
    ubicacion: string;
  }
  
  export interface CircuitoUpdateRequest {
    id: number;
    name: string;
    ubicacion: string;
  }