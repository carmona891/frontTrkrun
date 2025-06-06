import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService, UserDto } from '../../services/usuarios-service';

interface Season {
  year: number;
  name: string;
  status: 'current' | 'completed' | 'upcoming';
}

@Component({
  selector: 'app-ranking',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-gray-900 via-black to-red-900">
      <!-- Header -->
      <div class="bg-black/95 backdrop-blur-md border-b border-gray-800 px-6 py-8">
        <div class="max-w-7xl mx-auto">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <div class="w-12 h-12 bg-gradient-to-br from-yellow-500 to-red-500 rounded-lg flex items-center justify-center">
                <svg class="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9l-5.91 5.74L18.18 22 12 18.27 5.82 22l1.09-7.26L1 9l6.91-.74L12 2z"/>
                </svg>
              </div>
              <div>
                <h1 class="text-4xl font-bold text-white">Ranking de Pilotos</h1>
                <p class="text-gray-400 text-lg">Temporada {{selectedSeason.year}} - {{selectedSeason.name}}</p>
              </div>
            </div>
            
            <!-- Season Selector -->
            <div class="flex items-center space-x-4">
              <label class="text-gray-300 font-medium">Temporada:</label>
              <select 
                [(ngModel)]="selectedSeasonYear"
                (ngModelChange)="onSeasonChange()"
                class="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500">
                <option *ngFor="let season of seasons" [value]="season.year">
                  {{season.year}} - {{season.name}}
                </option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div class="max-w-7xl mx-auto px-6 py-8">
        <!-- Loading State -->
        <div *ngIf="loading" class="flex justify-center items-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
          <span class="ml-3 text-white text-lg">Cargando usuarios...</span>
        </div>

        <!-- Error State -->
        <div *ngIf="error" class="bg-red-900/50 border border-red-700 rounded-lg p-4 mb-6">
          <p class="text-red-300">Error al cargar los datos: {{error}}</p>
          <button 
            (click)="loadUsers()" 
            class="mt-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors">
            Reintentar
          </button>
        </div>

        <!-- Content -->
        <div *ngIf="!loading && !error">
          <!-- Stats Overview -->
          <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div class="bg-gradient-to-br from-yellow-600 to-yellow-700 rounded-2xl p-6 text-white">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-yellow-100 text-sm font-medium">Líder del Campeonato</p>
                  <p class="text-2xl font-bold">{{getLeader()?.name || 'N/A'}}</p>
                  <p class="text-yellow-100 text-sm">{{getLeader()?.points || 0}} puntos</p>
                </div>
                <div class="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M5 16L3 14l5.5-5.5L16 16l-2.5 2.5L8.5 13 5 16zm2.5-6L16 1.5 17.5 3 9 11.5 7.5 10z"/>
                  </svg>
                </div>
              </div>
            </div>

            <div class="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 text-white">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-blue-100 text-sm font-medium">Total Pilotos</p>
                  <p class="text-2xl font-bold">{{users.length}}</p>
                  <p class="text-blue-100 text-sm">Registrados</p>
                </div>
                <div class="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                  </svg>
                </div>
              </div>
            </div>

            <div class="bg-gradient-to-br from-green-600 to-green-700 rounded-2xl p-6 text-white">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-green-100 text-sm font-medium">Promedio de Puntos</p>
                  <p class="text-2xl font-bold">{{getAveragePoints()}}</p>
                  <p class="text-green-100 text-sm">por piloto</p>
                </div>
                <div class="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 12l2 2 4-4M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
              </div>
            </div>

            <div class="bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl p-6 text-white">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-purple-100 text-sm font-medium">Puntos Máximos</p>
                  <p class="text-2xl font-bold">{{getMaxPoints()}}</p>
                  <p class="text-purple-100 text-sm">Puntuación líder</p>
                </div>
                <div class="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9l-5.91 5.74L18.18 22 12 18.27 5.82 22l1.09-7.26L1 9l6.91-.74L12 2z"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <!-- Filter Section -->
          <div class="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 mb-8">
            <div class="flex flex-col md:flex-row md:items-center md:space-x-6 space-y-4 md:space-y-0">
              <div class="flex-1">
                <input 
                  type="text" 
                  [(ngModel)]="searchTerm"
                  placeholder="Buscar piloto por nombre o email..."
                  class="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500">
              </div>
              <div class="flex space-x-4">
                <select 
                  [(ngModel)]="roleFilter"
                  class="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-500">
                  <option value="">Todos los roles</option>
                  <option value="1">Administradores</option>
                  <option value="2">Pilotos</option>
                </select>
                <button 
                  (click)="loadUsers()"
                  class="bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg transition-colors">
                  Actualizar
                </button>
              </div>
            </div>
          </div>

          <!-- Podium Section (Top 3) -->
          <div class="mb-12" *ngIf="filteredUsers.length >= 3">
            <h2 class="text-2xl font-bold text-white mb-6 text-center">🏆 Podium del Campeonato</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <!-- 2nd Place -->
              <div class="order-1 md:order-1">
                <div class="bg-gradient-to-br from-gray-600 to-gray-700 rounded-2xl p-6 text-white transform hover:scale-105 transition-all duration-300 border-2 border-gray-500">
                  <div class="text-center">
                    <div class="relative inline-block mb-4">
                      <div class="w-20 h-20 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center text-2xl font-bold">
                        {{getTopUsers()[1]?.name?.charAt(0) || '?'}}
                      </div>
                      <div class="absolute -top-2 -right-2 w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        2
                      </div>
                    </div>
                    <h3 class="text-xl font-bold mb-1">{{getTopUsers()[1]?.name}}</h3>
                    <p class="text-gray-300 text-sm mb-2">{{getTopUsers()[1]?.email}}</p>
                    <div class="bg-gray-800/50 rounded-lg p-3">
                      <p class="text-2xl font-bold text-gray-300">{{getTopUsers()[1]?.points}}</p>
                      <p class="text-gray-400 text-sm">puntos</p>
                    </div>
                    <div class="mt-3 text-sm text-gray-300">
                      <span>🏆 {{getRoleText(getTopUsers()[1]?.rol_id)}}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 1st Place (Center, Larger) -->
              <div class="order-2 md:order-2">
                <div class="bg-gradient-to-br from-yellow-600 to-yellow-700 rounded-2xl p-8 text-white transform hover:scale-105 transition-all duration-300 border-4 border-yellow-400 shadow-2xl shadow-yellow-500/20">
                  <div class="text-center">
                    <div class="relative inline-block mb-6">
                      <div class="w-24 h-24 bg-gradient-to-br from-yellow-300 to-yellow-600 rounded-full flex items-center justify-center text-3xl font-bold">
                        {{getTopUsers()[0]?.name?.charAt(0) || '?'}}
                      </div>
                      <div class="absolute -top-3 -right-3 w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center text-yellow-900 font-bold text-lg">
                        1
                      </div>
                      <div class="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                        <svg class="w-8 h-8 text-yellow-300" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M5 16L3 14l5.5-5.5L16 16l-2.5 2.5L8.5 13 5 16zm2.5-6L16 1.5 17.5 3 9 11.5 7.5 10z"/>
                        </svg>
                      </div>
                    </div>
                    <h3 class="text-2xl font-bold mb-2">{{getTopUsers()[0]?.name}}</h3>
                    <p class="text-yellow-200 mb-3">{{getTopUsers()[0]?.email}}</p>
                    <div class="bg-yellow-800/50 rounded-lg p-4 mb-4">
                      <p class="text-3xl font-bold text-yellow-100">{{getTopUsers()[0]?.points}}</p>
                      <p class="text-yellow-200 text-sm">puntos</p>
                    </div>
                    <div class="text-sm text-yellow-200">
                      <span>🏆 {{getRoleText(getTopUsers()[0]?.rol_id)}}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 3rd Place -->
              <div class="order-3 md:order-3">
                <div class="bg-gradient-to-br from-amber-700 to-amber-800 rounded-2xl p-6 text-white transform hover:scale-105 transition-all duration-300 border-2 border-amber-600">
                  <div class="text-center">
                    <div class="relative inline-block mb-4">
                      <div class="w-20 h-20 bg-gradient-to-br from-amber-500 to-amber-700 rounded-full flex items-center justify-center text-2xl font-bold">
                        {{getTopUsers()[2]?.name?.charAt(0) || '?'}}
                      </div>
                      <div class="absolute -top-2 -right-2 w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        3
                      </div>
                    </div>
                    <h3 class="text-xl font-bold mb-1">{{getTopUsers()[2]?.name}}</h3>
                    <p class="text-amber-200 text-sm mb-2">{{getTopUsers()[2]?.email}}</p>
                    <div class="bg-amber-900/50 rounded-lg p-3">
                      <p class="text-2xl font-bold text-amber-200">{{getTopUsers()[2]?.points}}</p>
                      <p class="text-amber-300 text-sm">puntos</p>
                    </div>
                    <div class="mt-3 text-sm text-amber-200">
                      <span>🏆 {{getRoleText(getTopUsers()[2]?.rol_id)}}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Full Ranking Table -->
          <div class="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl overflow-hidden">
            <div class="px-6 py-4 bg-gray-800/50 border-b border-gray-700">
              <h2 class="text-2xl font-bold text-white">Clasificación Completa</h2>
              <p class="text-gray-400">{{filteredUsers.length}} usuarios registrados</p>
            </div>
            
            <div class="overflow-x-auto">
              <table class="w-full">
                <thead class="bg-gray-800">
                  <tr>
                    <th class="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Posición</th>
                    <th class="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Usuario</th>
                    <th class="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Email</th>
                    <th class="px-6 py-4 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">Puntos</th>
                    <th class="px-6 py-4 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">Rol</th>
                    <th class="px-6 py-4 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">Torneos</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-700">
                  <tr *ngFor="let user of filteredUsers; let i = index" 
                      [class]="getRowClass(i + 1)"
                      class="hover:bg-gray-800/30 transition-colors duration-200">
                    <!-- Position -->
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <div [class]="getPositionBadgeClass(i + 1)" class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3">
                          {{i + 1}}
                        </div>
                        <div *ngIf="i < 3" class="text-lg">
                          <span *ngIf="i === 0">🥇</span>
                          <span *ngIf="i === 1">🥈</span>
                          <span *ngIf="i === 2">🥉</span>
                        </div>
                      </div>
                    </td>
                    
                    <!-- User Info -->
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-4">
                          <span class="text-white font-bold text-lg">{{user.name?.charAt(0) || '?'}}</span>
                        </div>
                        <div>
                          <div class="text-white font-bold text-lg">{{user.name}}</div>
                         <!-- <div class="text-gray-400 text-sm">ID: {{user.id}}</div>-->
                        </div>
                      </div>
                    </td>
                    
                    <!-- Email -->
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span class="text-gray-300 font-medium">{{user.email}}</span>
                    </td>
                    
                    <!-- Points -->
                    <td class="px-6 py-4 whitespace-nowrap text-center">
                      <div class="text-2xl font-bold text-white">{{user.points}}</div>
                    </td>
                    
                    <!-- Role -->
                    <td class="px-6 py-4 whitespace-nowrap text-center">
                      <span [class]="getRoleBadgeClass(user.rol_id)" class="px-3 py-1 rounded-full text-sm font-medium">
                        {{getRoleText(user.rol_id)}}
                      </span>
                    </td>
                    
                    <!-- Tournaments -->
                    <td class="px-6 py-4 whitespace-nowrap text-center">
                      <span class="text-gray-300 font-semibold">{{user.torneosInscritos?.length || 0}}</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Additional Stats -->
          <div class="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Championship Progress -->
            <div class="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6">
              <h3 class="text-xl font-bold text-white mb-4">Progreso del Ranking</h3>
              <div class="space-y-4">
                <div *ngFor="let user of getTopUsers().slice(0, 5); let i = index" class="flex items-center justify-between">
                  <div class="flex items-center">
                    <span class="text-gray-400 text-sm w-6">{{i + 1}}.</span>
                    <span class="text-white font-medium ml-2">{{user.name}}</span>
                  </div>
                  <div class="flex-1 mx-4">
                    <div class="bg-gray-700 rounded-full h-2">
                      <div 
                        class="bg-gradient-to-r from-red-500 to-yellow-500 h-2 rounded-full transition-all duration-500"
                        [style.width.%]="getMaxPoints() > 0 ? (user.points / getMaxPoints()) * 100 : 0">
                      </div>
                    </div>
                  </div>
                  <span class="text-white font-bold">{{user.points}}</span>
                </div>
              </div>
            </div>

            <!-- Quick Stats -->
            <div class="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6">
              <h3 class="text-xl font-bold text-white mb-4">Estadísticas Rápidas</h3>
              <div class="space-y-3">
                <div class="flex justify-between items-center">
                  <span class="text-gray-300">Promedio de puntos:</span>
                  <span class="text-white font-bold">{{getAveragePoints()}} pts</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-gray-300">Diferencia líder-último:</span>
                  <span class="text-white font-bold">{{getPointsDifference()}} pts</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-gray-300">Usuarios con puntos:</span>
                  <span class="text-white font-bold">{{getUsersWithPoints()}}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-gray-300">Total puntos sistema:</span>
                  <span class="text-white font-bold">{{getTotalPoints()}}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class RankingComponent implements OnInit {
  searchTerm = '';
  roleFilter = '';
  selectedSeasonYear = 2024;
  loading = false;
  error = '';

  users: UserDto[] = [];

  seasons: Season[] = [
    { year: 2024, name: 'TrkRun Championship', status: 'current' },
    { year: 2023, name: 'TrkRun Championship', status: 'completed' },
    { year: 2022, name: 'TrkRun Championship', status: 'completed' },
    { year: 2025, name: 'TrkRun Championship', status: 'upcoming' }
  ];

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.loading = true;
    this.error = '';
    
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.users = users.sort((a, b) => (b.points || 0) - (a.points || 0));
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.error = 'No se pudieron cargar los usuarios';
        this.loading = false;
      }
    });
  }

  get selectedSeason(): Season {
    return this.seasons.find(s => s.year === this.selectedSeasonYear) || this.seasons[0];
  }

  get filteredUsers(): UserDto[] {
    let filtered = [...this.users];
    
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(user => 
        user.name?.toLowerCase().includes(term) || 
        user.email?.toLowerCase().includes(term)
      );
    }
    
    if (this.roleFilter) {
      filtered = filtered.filter(user => user.rol_id?.toString() === this.roleFilter);
    }
    
    return filtered.sort((a, b) => (b.points || 0) - (a.points || 0));
  }

  onSeasonChange() {
    console.log(`Cambio a temporada ${this.selectedSeasonYear}`);
    // En el futuro aquí podrías cargar datos específicos de la temporada
    this.loadUsers();
  }

  getLeader(): UserDto | null {
    return this.filteredUsers.length > 0 ? this.filteredUsers[0] : null;
  }

  getTopUsers(): UserDto[] {
    return this.filteredUsers.slice(0, 3);
  }

  getMaxPoints(): number {
    return this.users.length > 0 ? Math.max(...this.users.map(u => u.points || 0)) : 0;
  }

  getAveragePoints(): number {
    if (this.users.length === 0) return 0;
    const total = this.users.reduce((sum, user) => sum + (user.points || 0), 0);
    return Math.round(total / this.users.length);
  }

  getPointsDifference(): number {
    if (this.filteredUsers.length < 2) return 0;
    const max = Math.max(...this.filteredUsers.map(u => u.points || 0));
    const min = Math.min(...this.filteredUsers.map(u => u.points || 0));
    return max - min;
  }

  getUsersWithPoints(): number {
    return this.users.filter(user => (user.points || 0) > 0).length;
  }

  getTotalPoints(): number {
    return this.users.reduce((sum, user) => sum + (user.points || 0), 0);
  }

  getRoleText(rolId: number | undefined): string {
    switch (rolId) {
      case 1: return 'Administrador';
      case 2: return 'Piloto';
      default: return 'Usuario';
    }
  }

  getRoleBadgeClass(rolId: number | undefined): string {
    switch (rolId) {
      case 1: return 'bg-red-600 text-white';
      case 2: return 'bg-blue-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  }

  getPositionBadgeClass(position: number): string {
    if (position === 1) return 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-yellow-900';
    if (position === 2) return 'bg-gradient-to-br from-gray-400 to-gray-600 text-white';
    if (position === 3) return 'bg-gradient-to-br from-amber-600 to-amber-800 text-white';
    if (position <= 10) return 'bg-gradient-to-br from-blue-600 to-blue-800 text-white';
    return 'bg-gray-700 text-gray-300';
  }

  getRowClass(position: number): string {
    if (position === 1) return 'bg-gradient-to-r from-yellow-900/20 to-transparent border-l-4 border-yellow-400';
    if (position === 2) return 'bg-gradient-to-r from-gray-600/20 to-transparent border-l-4 border-gray-400';
    if (position === 3) return 'bg-gradient-to-r from-amber-800/20 to-transparent border-l-4 border-amber-600';
    if (position <= 10) return 'bg-gradient-to-r from-blue-900/10 to-transparent border-l-2 border-blue-600';
    return '';
  }
}