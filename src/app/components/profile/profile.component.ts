import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule} from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { UserService, UserDto } from '../../services/usuarios-service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit, OnDestroy {

  Math = Math;
  private router = inject(Router);
  private userService = inject(UserService);
  private authService = inject(AuthService);
  private destroy$ = new Subject<void>();

  isMobileMenuOpen = false;
  user: UserDto = {
    name: 'Cargando...',
    email: 'cargando@trkrun.com',
    rol_id: 3,
    points: 0,
    torneosInscritos: []
  };

  isEditingName = false;
  tempName = '';
  isLoadingProfile = true;
  profileError = '';

  ngOnInit() {
    this.loadUserProfile();

    this.userService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        if (user) {
          this.user = { ...user };
          this.tempName = user.name;
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadUserProfile() {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    this.isLoadingProfile = true;
    this.profileError = '';

    this.userService.getCurrentUserProfile()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (userDto) => {
          this.user = userDto;
          this.tempName = userDto.name;
          this.isLoadingProfile = false;
        },
        error: (error) => {
          console.error('Error al cargar perfil:', error);
          this.profileError = 'Error al cargar el perfil del usuario';
          this.isLoadingProfile = false;
          
          if (error.status === 401) {
            this.authService.logout();
            this.userService.clearUserData();
            this.router.navigate(['/login']);
          }
        }
      });
  }

  startEditingName() {
    this.isEditingName = true;
    this.tempName = this.user.name;
  }

  saveName() {
    if (this.tempName.trim() && this.tempName.trim() !== this.user.name) {
      this.userService.updateUserName(this.tempName.trim())
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (updatedUser) => {
            this.user.name = this.tempName.trim();
            this.isEditingName = false;
            console.log('Nombre actualizado correctamente');
          },
          error: (error) => {
            console.error('Error al actualizar nombre:', error);
            this.tempName = this.user.name;
          }
        });
    } else {
      this.isEditingName = false;
    }
  }

  cancelEditName() {
    this.isEditingName = false;
    this.tempName = this.user.name;
  }

  onEditProfile() {
    console.log('Editar perfil completo');
  }

  onChangePassword() {
    console.log('Cambiar contraseña');
  }

  onViewStats() {
    console.log('Ver estadísticas completas');
  }

  onGoBack() {
    this.router.navigate(['/home']);
    this.closeMobileMenu();
  }

  closeMobileMenu() {
    this.isMobileMenuOpen = false;
  }

  refreshProfile() {
    this.loadUserProfile();
  }

  getRoleName(): string {
    const roleNames: { [key: number]: string } = {
      1: 'Administrador',
      2: 'Piloto Profesional', 
      3: 'Piloto Amateur',
      4: 'Espectador'
    };
    return roleNames[this.user.rol_id] || 'Usuario';
  }

  onLogout() {
    console.log('[ProfileComponent] Iniciando cierre de sesión...');
    
    // Limpiar datos del usuario
    this.userService.clearUserData();
    
    // Cerrar sesión en AuthService
    this.authService.logout();
    
    console.log('[ProfileComponent] Sesión cerrada, redirigiendo a login...');
    
    // Redirigir a login
    this.router.navigate(['/login']).then(() => {
      console.log('[ProfileComponent] Redirección completada');
    });
  }
}