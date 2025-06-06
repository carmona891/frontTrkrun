// models/rol.model.ts
export interface Rol {
    id: number;
    name: string;
    level: number;
  }
  
  export interface RolCreateRequest {
    id: number;
    name: string;
    level: number;
  }
  
  export interface RolUpdateRequest {
    id: number;
    name: string;
    level: number;
  }