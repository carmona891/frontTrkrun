import { UserForTorneo } from "./usersForTorneo";

// models/torneo.model.ts
export interface Torneo {
    id: number;
    name: string;
    fecha: string;
    premio: number;
    circuitoId: number;
    participantes:number;
    participants: UserForTorneo[];
  }
  
  export interface TorneoCreateRequest {
    id: number;
    name: string;
    fecha: string;
    premio: number;
    circuitoId: number;
  }
  
  export interface TorneoUpdateRequest {
    id: number;
    name: string;
    fecha: string;
    premio: number;
    circuitoId: number;
    participantes: number;
  }