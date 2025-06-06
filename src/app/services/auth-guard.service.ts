import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const currentPath = route.routeConfig?.path;
    
    // Verificar si el usuario está logueado PARA TODAS LAS RUTAS PROTEGIDAS
    const protectedRoutes = ['admin', 'home', 'torneos', 'perfil', 'rankings', 'contacto'];
    
    if (protectedRoutes.includes(currentPath || '')) {
      if (!this.authService.isLoggedIn()) {
        console.log('[AuthGuard] Usuario no autenticado, redirigiendo a login');
        this.router.navigate(['/login']);
        return false;
      }
    }

    // Obtener el rol del usuario
    const userRoleId = this.authService.getRoleId();
    
    console.log('[AuthGuard] Verificando acceso:', {
      path: currentPath,
      userRoleId: userRoleId,
      isAdmin: this.authService.isAdmin()
    });

    // Si intenta acceder a /admin
    if (currentPath === 'admin') {
      if (userRoleId === 1) {
        console.log('[AuthGuard] Acceso permitido a admin');
        return true;
      } else {
        console.log('[AuthGuard] Acceso denegado a admin, redirigiendo a home');
        this.router.navigate(['/home']);
        return false;
      }
    }

    // Rutas solo para usuarios normales (no admins)
    const userOnlyRoutes = ['home', 'torneos'];
    
    if (userOnlyRoutes.includes(currentPath || '')) {
      if (userRoleId === 1) {
        // Los admins son redirigidos a su panel
        console.log('[AuthGuard] Admin redirigido a su panel desde:', currentPath);
        this.router.navigate(['/admin']);
        return false;
      } else {
        // Usuario normal puede acceder
        console.log('[AuthGuard] Acceso permitido a usuario normal');
        return true;
      }
    }

    // Por defecto permitir acceso
    return true;
  }
}