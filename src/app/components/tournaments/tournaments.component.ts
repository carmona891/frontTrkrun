import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TorneoService } from '../../services/torneos-service';
import { UserService } from '../../services/usuarios-service';
import { CircuitoService } from '../../services/circuito-service';
import { Torneo, TorneoCreateRequest } from '../../Dto/torneo.model';
import { Circuito } from '../../Dto/circuito.model';
import { UserDto } from '../../services/usuarios-service';

interface TorneoWithDetails extends Torneo {
  circuitoNombre?: string;
  participantesCount?: number;
  isUserInscrito?: boolean;
  maxParticipantes?: number;
  isCreatedByUser?: boolean;
}

@Component({
  selector: 'app-tournaments',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './tournaments.component.html',
  styleUrls: ['./tournaments.component.css']
})
export class TournamentsComponent implements OnInit, OnDestroy {
  torneos: TorneoWithDetails[] = [];
  torneosFiltered: TorneoWithDetails[] = [];
  circuitos: Circuito[] = [];
  currentUser: UserDto | null = null;
  
  // Formularios
  createTorneoForm: FormGroup;
  
  // Filtros
  searchName: string = '';
  filterDate: string = '';
  filterParticipants: string = '';
  
  // Estados de UI
  showCreateModal: boolean = false;
  loading: boolean = false;
  error: string = '';
  success: string = '';
  showParticipants: { [key: number]: boolean } = {}; // ✅ NUEVO

  constructor(
    private torneoService: TorneoService,
    private userService: UserService,
    private circuitoService: CircuitoService,
    private fb: FormBuilder
  ) {
    this.createTorneoForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      fecha: ['', [Validators.required, this.validateFutureDate]],
      premio: [0, [Validators.required, Validators.min(0)]],
      circuitoId: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.loadData();
  }

  validateFutureDate(control: any) {
    const selectedDate = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      return { pastDate: true };
    }
    return null;
  }

  async loadData(): Promise<void> {
    this.loading = true;
    try {
      // Cargar datos en paralelo
      const [torneos, circuitos, userProfile] = await Promise.all([
        this.torneoService.getTorneos().toPromise(), 
        this.circuitoService.getCircuitos().toPromise(),
        this.userService.getCurrentUserProfile().toPromise()
      ]);

      this.torneos = torneos || [];
      this.circuitos = circuitos || [];
      this.currentUser = userProfile || null;

      // Enriquecer torneos con información adicional
      await this.enrichTorneosData();
      this.applyFilters();
      
    } catch (error) {
      console.error('Error loading data:', error);
      this.error = 'Error al cargar los datos';
    } finally {
      this.loading = false;
    }
  }

  async enrichTorneosData(): Promise<void> {
    for (let torneo of this.torneos) {
      //agregar nombre del circuito
      const circuito = this.circuitos.find(c => c.id === torneo.circuitoId);
      torneo.circuitoNombre = circuito?.name || 'Circuito desconocido';
      
      //verificar si hay participants array o usar el campo participantes
      if (torneo.participants && Array.isArray(torneo.participants)) {
        torneo.participantesCount = torneo.participants.length;
        //verificar si el usuario está inscrito basandose en el array de participantes
        torneo.isUserInscrito = this.isUserInParticipantsArray(torneo.participants);
      } else {
        //fallback al método anterior
        torneo.participantesCount = torneo.participantes || 0;
        torneo.isUserInscrito = this.isUserInscribedInTorneo(torneo.id);
      }
      
      torneo.maxParticipantes = 20; //siempre 20 participantes máximo
      torneo.isCreatedByUser = false;
    }
  }

  //verificar si el usuario está en el array de participantes
  private isUserInParticipantsArray(participants: any[]): boolean {
    if (!this.currentUser || !participants) {
      return false;
    }
    return participants.some(participant => participant.id === this.currentUser!.id);
  }

  // MANTENER: Método anterior para compatibilidad
  private isUserInscribedInTorneo(torneoId: number): boolean {
    if (!this.currentUser || !this.currentUser.torneosInscritos) {
      return false;
    }
    return this.currentUser.torneosInscritos.some(torneo => torneo.id === torneoId);
  }

  // === CREAR TORNEO ===
  
  openCreateModal(): void {
    this.showCreateModal = true;
    this.createTorneoForm.reset();
    this.error = '';
    this.success = '';
  }

  closeCreateModal(): void {
    this.showCreateModal = false;
    this.createTorneoForm.reset();
  }

  async createTorneo(): Promise<void> {
    if (this.createTorneoForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    const formValue = this.createTorneoForm.value;
    
    // Verificar si ya existe un torneo en ese circuito en esa fecha
    const existeTorneo = this.torneos.some(t => 
      t.circuitoId === parseInt(formValue.circuitoId) && 
      new Date(t.fecha).toDateString() === new Date(formValue.fecha).toDateString()
    );

    if (existeTorneo) {
      this.error = 'Ya existe un torneo en ese circuito para la fecha seleccionada';
      return;
    }

    this.loading = true;
    try {
      const torneoRequest: TorneoCreateRequest = {
        id: 0,
        name: formValue.name,
        fecha: formValue.fecha,
        premio: parseFloat(formValue.premio),
        circuitoId: parseInt(formValue.circuitoId)
      };

      const nuevoTorneo = await this.torneoService.createTorneo(torneoRequest).toPromise();
      
      if (nuevoTorneo) {
        this.success = 'Torneo creado exitosamente';
        this.closeCreateModal();
        await this.loadData();
      }
    } catch (error) {
      console.error('Error creating torneo:', error);
      this.error = 'Error al crear el torneo';
    } finally {
      this.loading = false;
    }
  }

  markFormGroupTouched(): void {
    Object.keys(this.createTorneoForm.controls).forEach(key => {
      this.createTorneoForm.get(key)?.markAsTouched();
    });
  }

  // === ✅ NUEVOS MÉTODOS CON PATCH ===
  
  async joinTorneo(torneo: TorneoWithDetails): Promise<void> {
    if (!this.currentUser) {
      this.error = 'Debes estar logueado para unirte a un torneo';
      return;
    }

    if (torneo.isUserInscrito) {
      this.error = 'Ya estás inscrito en este torneo';
      return;
    }

    if ((torneo.participantesCount || 0) >= (torneo.maxParticipantes || 20)) {
      this.error = 'El torneo está completo';
      return;
    }

    this.loading = true;
    try {
      // ✅ USAR EL NUEVO MÉTODO PATCH
      const torneoActualizado = await this.torneoService.joinTorneo(torneo.id, this.currentUser.id!).toPromise();
      
      if (torneoActualizado) {
        // ✅ ACTUALIZAR CON LA RESPUESTA DEL SERVIDOR
        this.updateLocalTorneo(torneo.id, torneoActualizado);
        this.success = `Te has unido al torneo "${torneo.name}" exitosamente`;
      }
    } catch (error) {
      console.error('Error joining torneo:', error);
      this.error = 'Error al unirse al torneo. Por favor, inténtalo de nuevo.';
    } finally {
      this.loading = false;
    }
  }

  async leaveTorneo(torneo: TorneoWithDetails): Promise<void> {
    if (!this.currentUser || !torneo.isUserInscrito) return;

    this.loading = true;
    try {
      // ✅ USAR EL NUEVO MÉTODO PATCH
      const torneoActualizado = await this.torneoService.leaveTorneo(torneo.id, this.currentUser.id!).toPromise();
      
      if (torneoActualizado) {
        // ✅ ACTUALIZAR CON LA RESPUESTA DEL SERVIDOR
        this.updateLocalTorneo(torneo.id, torneoActualizado);
        this.success = `Te has salido del torneo "${torneo.name}"`;
      }
    } catch (error) {
      console.error('Error leaving torneo:', error);
      this.error = 'Error al salir del torneo. Por favor, inténtalo de nuevo.';
    } finally {
      this.loading = false;
    }
  }

  // ✅ NUEVO: Actualizar torneo local con respuesta del servidor
  private updateLocalTorneo(torneoId: number, torneoActualizado: Torneo): void {
    // Actualizar en la lista principal
    const torneoIndex = this.torneos.findIndex(t => t.id === torneoId);
    if (torneoIndex !== -1) {
      // Mantener propiedades locales y actualizar con datos del servidor
      this.torneos[torneoIndex] = {
        ...this.torneos[torneoIndex],
        ...torneoActualizado,
        participantesCount: torneoActualizado.participantes,
        isUserInscrito: this.isUserInParticipantsArray(torneoActualizado.participants || [])
      };
    }

    // Actualizar en la lista filtrada también
    const filteredIndex = this.torneosFiltered.findIndex(t => t.id === torneoId);
    if (filteredIndex !== -1) {
      this.torneosFiltered[filteredIndex] = this.torneos[torneoIndex];
    }
  }

  // === ✅ NUEVOS MÉTODOS PARA GESTIÓN DE PARTICIPANTES ===

  toggleParticipantsList(torneoId: number): void {
    this.showParticipants[torneoId] = !this.showParticipants[torneoId];
  }

  isParticipantsListVisible(torneoId: number): boolean {
    return !!this.showParticipants[torneoId];
  }

  getParticipantsList(torneo: TorneoWithDetails): any[] {
    return torneo.participants || [];
  }

  // === FILTROS ===
  
  applyFilters(): void {
    this.torneosFiltered = this.torneos.filter(torneo => {
      const matchesName = !this.searchName || 
        torneo.name.toLowerCase().includes(this.searchName.toLowerCase());
      const matchesDate = this.filterByDate(torneo);
      const matchesParticipants = this.filterByParticipants(torneo);

      return matchesName && matchesDate && matchesParticipants;
    });
  }

  private filterByDate(torneo: TorneoWithDetails): boolean {
    if (!this.filterDate) return true;

    const torneoDate = new Date(torneo.fecha);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    switch (this.filterDate) {
      case 'today':
        return torneoDate.toDateString() === today.toDateString();
      case 'tomorrow':
        return torneoDate.toDateString() === tomorrow.toDateString();
      case 'this-week':
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay());
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        return torneoDate >= weekStart && torneoDate <= weekEnd;
      case 'this-month':
        return torneoDate.getMonth() === today.getMonth() && 
               torneoDate.getFullYear() === today.getFullYear();
      default:
        return true;
    }
  }

  private filterByParticipants(torneo: TorneoWithDetails): boolean {
    if (!this.filterParticipants) return true;

    const count = torneo.participantesCount || 0;
    
    switch (this.filterParticipants) {
      case '1-10':
        return count >= 1 && count <= 10;
      case '11-25':
        return count >= 11 && count <= 20;
      default:
        return true;
    }
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  // === UTILIDADES ===
  
  formatDate(fecha: string): string {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatPrize(premio: number): string {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(premio);
  }

  getTorneoStatusClass(torneo: TorneoWithDetails): string {
    if (torneo.isUserInscrito) return 'bg-green-500/20 text-green-400';
    if ((torneo.participantesCount || 0) >= (torneo.maxParticipantes || 20)) {
      return 'bg-red-500/20 text-red-400';
    }
    return 'bg-blue-500/20 text-blue-400';
  }

  getTorneoStatusText(torneo: TorneoWithDetails): string {
    if (torneo.isUserInscrito) return 'INSCRITO';
    if ((torneo.participantesCount || 0) >= (torneo.maxParticipantes || 20)) {
      return 'COMPLETO';
    }
    return 'DISPONIBLE';
  }

  getButtonText(torneo: TorneoWithDetails): string {
    if (torneo.isUserInscrito) return 'Salir del Torneo';
    if ((torneo.participantesCount || 0) >= (torneo.maxParticipantes || 20)) {
      return 'Torneo Completo';
    }
    return 'Unirse al Torneo';
  }

  isButtonDisabled(torneo: TorneoWithDetails): boolean {
    return !this.currentUser || 
           ((torneo.participantesCount || 0) >= (torneo.maxParticipantes || 20) && !torneo.isUserInscrito);
  }

  clearMessages(): void {
    this.error = '';
    this.success = '';
  }

  // === MÉTODOS PARA ESTADÍSTICAS ===
  
  getTotalParticipants(): string {
    const total = this.torneos.reduce((sum, torneo) => sum + (torneo.participantesCount || 0), 0);
    return this.formatNumber(total);
  }

  getTotalPrizes(): string {
    const total = this.torneos.reduce((sum, torneo) => sum + torneo.premio, 0);
    return this.formatPrize(total);
  }

  getThisWeekTournaments(): number {
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);

    return this.torneos.filter(torneo => {
      const torneoDate = new Date(torneo.fecha);
      return torneoDate >= weekStart && torneoDate <= weekEnd;
    }).length;
  }

  private formatNumber(num: number): string {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  }

  // === TRACKBY FUNCTIONS ===
  
  trackByTorneoId(index: number, torneo: TorneoWithDetails): number {
    return torneo.id;
  }

  trackByParticipantId(index: number, participant: any): number {
    return participant.id;
  }

  // === CLEANUP ===
  
  ngOnDestroy(): void {
    this.clearMessages();
  }

  // Getters para validación del formulario
  get nameControl() { return this.createTorneoForm.get('name'); }
  get fechaControl() { return this.createTorneoForm.get('fecha'); }
  get premioControl() { return this.createTorneoForm.get('premio'); }
  get circuitoControl() { return this.createTorneoForm.get('circuitoId'); }
}