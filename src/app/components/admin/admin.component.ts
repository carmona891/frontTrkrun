import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CircuitoService } from '../../services/circuito-service';
import { RolService } from '../../services/roles-service';
import { TorneoService } from '../../services/torneos-service';
import { UserService } from '../../services/usuarios-service';
import { Circuito } from '../../Dto/circuito.model';
import { Torneo } from '../../Dto/torneo.model';
import { User } from '../../Dto/user.model';
import { Rol } from '../../Dto/rol.model';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  imports: [
    ReactiveFormsModule, 
    CommonModule,
    FormsModule
  ],  
})
export class AdminComponent implements OnInit {
// Formularios reactivos
onGoBack() {
throw new Error('Method not implemented.');
}
  // Variables de control de pestañas
  activeTab: string = 'circuitos';

  // Listas de datos
  circuitos: Circuito[] = [];
  roles: Rol[] = [];
  torneos: Torneo[] = [];
  users: User[] = [];

  // Formularios reactivos
  circuitoForm: FormGroup;
  rolForm: FormGroup;
  torneoForm: FormGroup;
  userForm: FormGroup;

  // Banderas de modo
  isEditingCircuito: boolean = false;
  isEditingRol: boolean = false;
  isEditingTorneo: boolean = false;
  isEditingUser: boolean = false;

  // IDs para edición
  editingCircuitoId: number | null = null;
  editingRolId: number | null = null;
  editingTorneoId: number | null = null;
  editingUserId: number | null = null;

  // Estados de carga
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private circuitoService: CircuitoService,
    private rolService: RolService,
    private torneoService: TorneoService,
    private userService: UserService
  ) {
    // Inicializar formularios
    this.circuitoForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      ubicacion: ['', [Validators.required]]
    });

    this.rolForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      level: [0, [Validators.required, Validators.min(0), Validators.max(10)]]
    });

    this.torneoForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      fecha: ['', [Validators.required]],
      premio: [0, [Validators.required, Validators.min(0)]],
      circuitoId: [0, [Validators.required, Validators.min(1)]]
    });

    this.userForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]], // AGREGAR ESTA LÍNEA
      rol_id: [0, [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    this.loadAllData();
  }

  // Método para cargar todos los datos iniciales
  loadAllData(): void {
    this.loadCircuitos();
    this.loadRoles();
    this.loadTorneos();
    this.loadUsers();
  }

  // === SECCIÓN CIRCUITOS: CRUD ===
  loadCircuitos(): void {
    this.circuitoService.getCircuitos().subscribe({
      next: (data) => {
        this.circuitos = data;
      },
      error: (error) => {
        this.showError('Error al cargar circuitos');
        console.error('Error loading circuitos:', error);
      }
    });
  }

  createCircuito(): void {
    if (this.circuitoForm.valid) {
      this.isLoading = true;
      const circuitoData = {
        id: 0, // El backend genera el ID
        ...this.circuitoForm.value
      };

      this.circuitoService.createCircuito(circuitoData).subscribe({
        next: (circuito) => {
          this.circuitos.push(circuito);
          this.circuitoForm.reset();
          this.showSuccess('Circuito creado exitosamente');
          this.isLoading = false;
        },
        error: (error) => {
          this.showError('Error al crear circuito');
          this.isLoading = false;
          console.error('Error creating circuito:', error);
        }
      });
    }
  }

  editCircuito(circuito: Circuito): void {
    this.isEditingCircuito = true;
    this.editingCircuitoId = circuito.id;
    this.circuitoForm.patchValue({
      name: circuito.name,
      ubicacion: circuito.ubicacion
    });
  }

  updateCircuito(): void {
    if (this.circuitoForm.valid && this.editingCircuitoId) {
      this.isLoading = true;
      const circuitoData = {
        id: this.editingCircuitoId,
        ...this.circuitoForm.value
      };

      this.circuitoService.updateCircuito(this.editingCircuitoId, circuitoData).subscribe({
        next: (circuito) => {
          const index = this.circuitos.findIndex(c => c.id === this.editingCircuitoId);
          if (index !== -1) {
            this.circuitos[index] = circuito;
          }
          this.cancelEditCircuito();
          this.showSuccess('Circuito actualizado exitosamente');
          this.isLoading = false;
        },
        error: (error) => {
          this.showError('Error al actualizar circuito');
          this.isLoading = false;
          console.error('Error updating circuito:', error);
        }
      });
    }
  }

  deleteCircuito(id: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar este circuito?')) {
      this.circuitoService.deleteCircuito(id).subscribe({
        next: () => {
          this.circuitos = this.circuitos.filter(c => c.id !== id);
          this.showSuccess('Circuito eliminado exitosamente');
        },
        error: (error) => {
          this.showError('Error al eliminar circuito');
          console.error('Error deleting circuito:', error);
        }
      });
    }
  }

  cancelEditCircuito(): void {
    this.isEditingCircuito = false;
    this.editingCircuitoId = null;
    this.circuitoForm.reset();
  }

  // === SECCIÓN ROLES: CRUD ===
  loadRoles(): void {
    this.rolService.getRoles().subscribe({
      next: (data) => {
        this.roles = data;
      },
      error: (error) => {
        this.showError('Error al cargar roles');
        console.error('Error loading roles:', error);
      }
    });
  }

  createRol(): void {
    if (this.rolForm.valid) {
      this.isLoading = true;
      const rolData = {
        id: 0,
        ...this.rolForm.value
      };

      this.rolService.createRol(rolData).subscribe({
        next: (rol) => {
          this.roles.push(rol);
          this.rolForm.reset();
          this.showSuccess('Rol creado exitosamente');
          this.isLoading = false;
        },
        error: (error) => {
          this.showError('Error al crear rol');
          this.isLoading = false;
          console.error('Error creating rol:', error);
        }
      });
    }
  }

  editRol(rol: Rol): void {
    this.isEditingRol = true;
    this.editingRolId = rol.id;
    this.rolForm.patchValue({
      name: rol.name,
      level: rol.level
    });
  }

  updateRol(): void {
    if (this.rolForm.valid && this.editingRolId) {
      this.isLoading = true;
      const rolData = {
        id: this.editingRolId,
        ...this.rolForm.value
      };

      this.rolService.updateRol(this.editingRolId, rolData).subscribe({
        next: (rol) => {
          const index = this.roles.findIndex(r => r.id === this.editingRolId);
          if (index !== -1) {
            this.roles[index] = rol;
          }
          this.cancelEditRol();
          this.showSuccess('Rol actualizado exitosamente');
          this.isLoading = false;
        },
        error: (error) => {
          this.showError('Error al actualizar rol');
          this.isLoading = false;
          console.error('Error updating rol:', error);
        }
      });
    }
  }

  deleteRol(id: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar este rol?')) {
      this.rolService.deleteRol(id).subscribe({
        next: () => {
          this.roles = this.roles.filter(r => r.id !== id);
          this.showSuccess('Rol eliminado exitosamente');
        },
        error: (error) => {
          this.showError('Error al eliminar rol');
          console.error('Error deleting rol:', error);
        }
      });
    }
  }

  cancelEditRol(): void {
    this.isEditingRol = false;
    this.editingRolId = null;
    this.rolForm.reset();
  }

  // === SECCIÓN TORNEOS: CRUD ===
  loadTorneos(): void {
    this.torneoService.getTorneos().subscribe({
      next: (data) => {
        this.torneos = data;
      },
      error: (error) => {
        this.showError('Error al cargar torneos');
        console.error('Error loading torneos:', error);
      }
    });
  }

  createTorneo(): void {
    if (this.torneoForm.valid) {
      this.isLoading = true;
      const torneoData = {
        id: 0,
        ...this.torneoForm.value
      };

      this.torneoService.createTorneo(torneoData).subscribe({
        next: (torneo) => {
          this.torneos.push(torneo);
          this.torneoForm.reset();
          this.showSuccess('Torneo creado exitosamente');
          this.isLoading = false;
        },
        error: (error) => {
          this.showError('Error al crear torneo');
          this.isLoading = false;
          console.error('Error creating torneo:', error);
        }
      });
    }
  }

  editTorneo(torneo: Torneo): void {
    this.isEditingTorneo = true;
    this.editingTorneoId = torneo.id;
    this.torneoForm.patchValue({
      name: torneo.name,
      fecha: torneo.fecha.split('T')[0], // Formato para input date
      premio: torneo.premio,
      circuitoId: torneo.circuitoId
    });
  }

  updateTorneo(): void {
    if (this.torneoForm.valid && this.editingTorneoId) {
      this.isLoading = true;
      const torneoData = {
        id: this.editingTorneoId,
        ...this.torneoForm.value
      };

      this.torneoService.updateTorneo(this.editingTorneoId, torneoData).subscribe({
        next: (torneo) => {
          const index = this.torneos.findIndex(t => t.id === this.editingTorneoId);
          if (index !== -1) {
            this.torneos[index] = torneo;
          }
          this.cancelEditTorneo();
          this.showSuccess('Torneo actualizado exitosamente');
          this.isLoading = false;
        },
        error: (error) => {
          this.showError('Error al actualizar torneo');
          this.isLoading = false;
          console.error('Error updating torneo:', error);
        }
      });
    }
  }

  deleteTorneo(id: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar este torneo?')) {
      this.torneoService.deleteTorneo(id).subscribe({
        next: () => {
          this.torneos = this.torneos.filter(t => t.id !== id);
          this.showSuccess('Torneo eliminado exitosamente');
        },
        error: (error) => {
          this.showError('Error al eliminar torneo');
          console.error('Error deleting torneo:', error);
        }
      });
    }
  }

  cancelEditTorneo(): void {
    this.isEditingTorneo = false;
    this.editingTorneoId = null;
    this.torneoForm.reset();
  }

  // === SECCIÓN USUARIOS: CRUD ===
  loadUsers(): void {
    this.userService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
      },
      error: (error) => {
        this.showError('Error al cargar usuarios');
        console.error('Error loading users:', error);
      }
    });
  }

  createUser(): void {
    if (this.userForm.valid) {
      this.isLoading = true;
      const userData = {
        id: 1,
        ...this.userForm.value
      };

      this.userService.createUser(userData).subscribe({
        next: (user) => {
          this.users.push(user);
          this.userForm.reset();
          this.showSuccess('Usuario creado exitosamente');
          this.isLoading = false;
        },
        error: (error) => {
          this.showError('Error al crear usuario');
          this.isLoading = false;
          console.error('Error creating user:', error);
        }
      });
    }
  }

  editUser(user: User): void {
    this.isEditingUser = true;
    this.editingUserId = user.id;
    this.userForm.patchValue({
      name: user.name,
      email: user.email,
      password: '', // AGREGAR ESTA LÍNEA (vacía al editar)
      rol_id: user.rol_id
    });
  }

  updateUser(): void {
    if (this.userForm.valid && this.editingUserId) {
      this.isLoading = true;
      const userData = {
        ...this.userForm.value,
        torneosInscritos: []
      };

      // Si no hay nueva contraseña en modo edición, eliminar el campo
    if (this.isEditingUser && !userData.password) {
      delete userData.password;
    }
      this.userService.updateUser(this.editingUserId, userData).subscribe({
        next: (user) => {
          const index = this.users.findIndex(u => u.id === this.editingUserId);
          if (index !== -1) {
            this.users[index] = user;
          }
          this.cancelEditUser();
          this.showSuccess('Usuario actualizado exitosamente');
          this.isLoading = false;
        },
        error: (error) => {
          this.showError('Error al actualizar usuario');
          this.isLoading = false;
          console.error('Error updating user:', error);
        }
      });
    }
  }

  deleteUser(id: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      this.userService.deleteUser(id).subscribe({
        next: () => {
          this.users = this.users.filter(u => u.id !== id);
          this.showSuccess('Usuario eliminado exitosamente');
        },
        error: (error) => {
          this.showError('Error al eliminar usuario');
          console.error('Error deleting user:', error);
        }
      });
    }
  }

  cancelEditUser(): void {
    this.isEditingUser = false;
    this.editingUserId = null;
    this.userForm.reset();
  }

  // === MÉTODOS AUXILIARES ===
  setActiveTab(tab: string): void {
    this.activeTab = tab;
    this.clearMessages();
  }

  showSuccess(message: string): void {
    this.successMessage = message;
    this.errorMessage = '';
    setTimeout(() => {
      this.successMessage = '';
    }, 3000);
  }

  showError(message: string): void {
    this.errorMessage = message;
    this.successMessage = '';
    setTimeout(() => {
      this.errorMessage = '';
    }, 3000);
  }

  clearMessages(): void {
    this.successMessage = '';
    this.errorMessage = '';
  }

  getCircuitoName(circuitoId: number): string {
    const circuito = this.circuitos.find(c => c.id === circuitoId);
    return circuito ? circuito.name : 'N/A';
  }

  getRolName(rolId: number): string {
    const rol = this.roles.find(r => r.id === rolId);
    return rol ? rol.name : 'N/A';
  }

  //-----------------------------------------------------------------------------------
// Agregar solo estas propiedades al AdminComponent

// Nuevas propiedades para finalizar torneos
participantesTorneo: any[] = [];
torneoSeleccionado: any = null;
mostrarModalFinalizar: boolean = false;
ganadorSeleccionado: number = 0;
otorgarPuntosParticipacion: boolean = true;

// Agregar solo estos métodos al AdminComponent

// Mostrar modal para finalizar torneo
async mostrarFinalizarTorneo(torneo: any): Promise<void> {
  this.torneoSeleccionado = torneo;
  this.mostrarModalFinalizar = true;
  this.ganadorSeleccionado = 0;
  
  // Cargar participantes del torneo
  try {
    this.participantesTorneo = (await this.torneoService.getParticipantesTorneo(torneo.id).toPromise()) || [];
  } catch (error) {
    this.showError('Error al cargar participantes del torneo');
    console.error('Error loading participants:', error);
    this.participantesTorneo = [];
  }
}

// Finalizar torneo
async finalizarTorneo(): Promise<void> {
  if (!this.ganadorSeleccionado || this.ganadorSeleccionado === 0) {
    this.showError('Debe seleccionar un ganador');
    return;
  }

  if (!confirm(`¿Está seguro de finalizar el torneo "${this.torneoSeleccionado.name}" con el ganador seleccionado? Esta acción no se puede deshacer.`)) {
    return;
  }

  this.isLoading = true;

  const finalizarData = {
    ganadorId: this.ganadorSeleccionado,
    otorgarPuntosParticipacion: this.otorgarPuntosParticipacion
  };

  try {
    const response = await this.torneoService.finalizarTorneo(this.torneoSeleccionado.id, finalizarData).toPromise();
    
    // Actualizar la lista de torneos (eliminar el finalizado)
    this.torneos = this.torneos.filter(t => t.id !== this.torneoSeleccionado.id);
    
    // Recargar usuarios para ver puntos actualizados
    this.loadUsers();
    
    this.showSuccess(`${response.mensaje}. ${response.ganadorNombre} ganó ${response.puntosOtorgados} puntos.`);
    this.cerrarModalFinalizar();
  } catch (error) {
    this.showError('Error al finalizar el torneo');
    console.error('Error finalizing tournament:', error);
  } finally {
    this.isLoading = false;
  }
}

// Cerrar modal
cerrarModalFinalizar(): void {
  this.mostrarModalFinalizar = false;
  this.torneoSeleccionado = null;
  this.participantesTorneo = [];
  this.ganadorSeleccionado = 0;
}





}