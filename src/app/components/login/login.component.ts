import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-gray-900 via-black to-red-900 flex items-center justify-center px-4 py-8">
      <!-- Background Pattern -->
      <div class="absolute inset-0 opacity-5">
        <div class="absolute inset-0 bg-gradient-to-r from-transparent via-red-500 to-transparent transform -skew-y-12 scale-150"></div>
        <div class="absolute inset-0 bg-gradient-to-l from-transparent via-blue-500 to-transparent transform skew-y-12 scale-150"></div>
      </div>

      <div class="relative z-10 w-full max-w-md">
        <!-- Logo Header -->
        <div class="text-center mb-8">
          <div class="flex items-center justify-center space-x-3 mb-4">
            <div class="relative">
              <div class="w-16 h-16 bg-gradient-to-br from-red-500 to-blue-500 rounded-xl flex items-center justify-center">
                <svg class="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L15.5 8.5L22 9L17 14L18.5 22L12 18.5L5.5 22L7 14L2 9L8.5 8.5L12 2Z"/>
                </svg>
              </div>
              <div class="absolute -top-2 -right-2 w-6 h-6 bg-blue-400 rounded-full animate-pulse"></div>
            </div>
          </div>
          <h1 class="text-3xl font-black text-white mb-2">
            <span class="bg-gradient-to-r from-red-500 to-blue-400 bg-clip-text text-transparent">TrkRun</span>
          </h1>
          <p class="text-gray-400">Championship Series</p>
        </div>

        <!-- Login Card -->
        <div class="bg-gray-900/80 backdrop-blur-xl border border-gray-800 rounded-2xl p-8 shadow-2xl">
          <div class="text-center mb-8">
            <h2 class="text-2xl font-bold text-white mb-2">Iniciar Sesión</h2>
            <p class="text-gray-400">Accede a tu cuenta de piloto</p>
          </div>

          <!-- Login Form -->
          <form (ngSubmit)="onLogin()" class="space-y-6">
            <!-- Email Field -->
            <div>
              <label for="email" class="block text-sm font-semibold text-gray-300 mb-2">
                Email
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"></path>
                  </svg>
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  [(ngModel)]="loginForm.email"
                  required
                  class="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all duration-300"
                  placeholder="piloto@example.com"
                  [class.border-red-500]="emailError && loginForm.email"
                  [class.ring-2]="emailError && loginForm.email"
                  [class.ring-red-500]="emailError && loginForm.email">
              </div>
              <p *ngIf="emailError && loginForm.email" class="text-red-400 text-sm mt-1">{{emailError}}</p>
            </div>

            <!-- Password Field -->
            <div>
              <label for="password" class="block text-sm font-semibold text-gray-300 mb-2">
                Contraseña
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                  </svg>
                </div>
                <input
                  [type]="showPassword ? 'text' : 'password'"
                  id="password"
                  name="password"
                  [(ngModel)]="loginForm.password"
                  required
                  class="w-full pl-10 pr-12 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all duration-300"
                  placeholder="••••••••"
                  [class.border-red-500]="passwordError && loginForm.password"
                  [class.ring-2]="passwordError && loginForm.password"
                  [class.ring-red-500]="passwordError && loginForm.password">
                <button
                  type="button"
                  (click)="togglePasswordVisibility()"
                  class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-300 transition-colors duration-200">
                  <svg *ngIf="!showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                  </svg>
                  <svg *ngIf="showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"></path>
                  </svg>
                </button>
              </div>
              <p *ngIf="passwordError && loginForm.password" class="text-red-400 text-sm mt-1">{{passwordError}}</p>
            </div>

            <!-- Remember Me & Forgot Password -->
            <div class="flex items-center justify-between">
              <label class="flex items-center">
                <input
                  type="checkbox"
                  [(ngModel)]="loginForm.rememberMe"
                  name="rememberMe"
                  class="w-4 h-4 text-red-600 bg-gray-800 border-gray-600 rounded focus:ring-red-500 focus:ring-2">
                <span class="ml-2 text-sm text-gray-300">Recordarme</span>
              </label>
              <button
                type="button"
                (click)="onForgotPassword()"
                class="text-sm text-blue-400 hover:text-blue-300 transition-colors duration-200">
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            <!-- Error Message -->
            <div *ngIf="loginError" class="bg-red-900/20 border border-red-500/50 rounded-lg p-4">
              <div class="flex items-center">
                <svg class="w-5 h-5 text-red-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <p class="text-red-400 text-sm">{{loginError}}</p>
              </div>
            </div>

            <!-- Success Message -->
            <div *ngIf="loginSuccess" class="bg-green-900/20 border border-green-500/50 rounded-lg p-4">
              <div class="flex items-center">
                <svg class="w-5 h-5 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <p class="text-green-400 text-sm">¡Inicio de sesión exitoso! Redirigiendo...</p>
              </div>
            </div>

            <!-- Login Button -->
            <button
              type="submit"
              [disabled]="isLoading"
              class="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 disabled:from-gray-600 disabled:to-gray-700 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 disabled:scale-100 shadow-lg hover:shadow-red-500/50 disabled:shadow-none disabled:cursor-not-allowed flex items-center justify-center">
              <svg *ngIf="isLoading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}}
            </button>
          </form>

          <!-- Divider -->
          <div class="flex items-center my-6">
            <div class="flex-1 border-t border-gray-700"></div>
            <span class="px-4 text-gray-400 text-sm">o continúa con</span>
            <div class="flex-1 border-t border-gray-700"></div>
          </div>

          <!-- Social Login -->
          <div class="grid grid-cols-2 gap-4">
            <button
              (click)="onSocialLogin('google')"
              class="flex items-center justify-center px-4 py-3 bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded-lg transition-all duration-300 transform hover:scale-105">
              <svg class="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span class="text-white text-sm font-medium">Google</span>
            </button>
            <button
              (click)="onSocialLogin('facebook')"
              class="flex items-center justify-center px-4 py-3 bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded-lg transition-all duration-300 transform hover:scale-105">
              <svg class="w-5 h-5 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              <span class="text-white text-sm font-medium">Facebook</span>
            </button>
          </div>

          <!-- Register Link -->
          <div class="text-center mt-8">
            <p class="text-gray-400 text-sm">
              ¿No tienes una cuenta?
              <button
                (click)="onGoToRegister()"
                class="text-blue-400 hover:text-blue-300 font-semibold ml-1 transition-colors duration-200">
                Regístrate aquí
              </button>
            </p>
          </div>
        </div>

        <!-- Racing Stats -->
        <div class="mt-8 grid grid-cols-3 gap-4 text-center">
          <div class="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg p-4">
            <div class="text-2xl font-black text-red-500 mb-1">2.5K+</div>
            <div class="text-xs text-gray-400">Pilotos Activos</div>
          </div>
          <div class="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg p-4">
            <div class="text-2xl font-black text-blue-400 mb-1">150+</div>
            <div class="text-xs text-gray-400">Competiciones</div>
          </div>
          <div class="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-lg p-4">
            <div class="text-2xl font-black text-red-500 mb-1">€2M+</div>
            <div class="text-xs text-gray-400">En Premios</div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class LoginComponent {
  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  loginForm = {
    email: '',
    password: '',
    rememberMe: false
  };

  showPassword = false;
  isLoading = false;
  loginError = '';
  loginSuccess = false;
  emailError = '';
  passwordError = '';

  onLogin() {
    // Reset errores
    this.loginError = '';
    this.emailError = '';
    this.passwordError = '';
    this.loginSuccess = false;

    // Validar localmente el formulario
    if (!this.validateForm()) {
      return;
    }

    this.isLoading = true;

    // Llamada real al servicio de login
    this.authService.login(this.loginForm.email, this.loginForm.password)
      .subscribe({
        next: (res) => {
          this.loginSuccess = true;
          this.loginError = '';
          this.isLoading = false;

          // Redirigir al dashboard o a la ruta protegida (ajusta '/dashboard' a tu ruta real)
          setTimeout(() => {
            this.router.navigate(['/admin']);
          }, 1000);
        },
        error: (err) => {
          this.isLoading = false;
          // Si la API devuelve 401, err.status será 401
          console.error('Login fallido, error completo:', err);
          if (err.status === 401) {
            this.loginError = 'Email o contraseña incorrectos.';
          } else {
            this.loginError = 'Error de servidor. Intenta de nuevo más tarde.';
          }
        }
      });
  }

  validateForm(): boolean {
    let isValid = true;

    // Validación del email
    if (!this.loginForm.email) {
      this.emailError = 'El email es requerido';
      isValid = false;
    } else if (!this.isValidEmail(this.loginForm.email)) {
      this.emailError = 'Por favor ingresa un email válido';
      isValid = false;
    }

    // Validación de la contraseña
    if (!this.loginForm.password) {
      this.passwordError = 'La contraseña es requerida';
      isValid = false;
    } else if (this.loginForm.password.length < 6) {
      this.passwordError = 'La contraseña debe tener al menos 6 caracteres';
      isValid = false;
    }

    return isValid;
  }

  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onForgotPassword() {
    alert('Funcionalidad de recuperación de contraseña - Por implementar');
  }

  onSocialLogin(provider: string) {
    console.log(`Social login with ${provider}`);
    alert(`Login con ${provider} - Por implementar`);
  }

  onGoToRegister() {
    console.log('Navigate to register page');
    alert('Navegación a registro - Por implementar');
    // this.router.navigate(['/register']);
  }
}