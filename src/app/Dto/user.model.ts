import { Torneo } from "./torneo.model";

// models/user.model.ts
export interface User {
    id: number;
    name: string;
    email: string;
    rol_id: number;
    points: number;
    torneosInscritos: Torneo[];
  }
  
  export interface UserCreateRequest {
    id: number;
    name: string;
    email: string;
    password: string;
    rol_id: number;
  }
  
  export interface UserUpdateRequest {
    name: string;
    email: string;
    password?: string; // Opcional, si no se quiere cambiar la contraseña
    rol_id: number;
    points: number;
    torneosInscritos: Torneo[];
  }