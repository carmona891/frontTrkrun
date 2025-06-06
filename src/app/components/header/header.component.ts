import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styles: []
})
export class HeaderComponent implements OnInit {
  private router = inject(Router); // Inyección moderna de Angular
  isMobileMenuOpen = false;
  
  navigationItems = [
    { label: 'Inicio', href: 'home', active: true },
    { label: 'Competiciones', href: 'torneos', active: false },
    { label: 'Calendario', href: 'calendario', active: false },
    { label: 'Perfil', href: 'perfil', active: false },
    { label: 'Resultados', href: 'rankings', active: false },
    { label: 'Contacto', href: 'contacto', active: false }
  ];

  constructor() {}

  ngOnInit() {
    console.log('Header component initialized');
    console.log('Router available:', !!this.router);
    // Add scroll effect to header
    window.addEventListener('scroll', this.handleScroll.bind(this));
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu() {
    this.isMobileMenuOpen = false;
  }

  navigateToLogin() {
    
    
    try {
      this.router.navigate(['/login']).then((success: any) => {
        console.log('🔥 Navigation result:', success);
        if (success) {
          console.log('✅ Navigation successful!');
        } else {
          console.log('❌ Navigation failed!');
        }
      }).catch((error: any) => {
        console.error('❌ Navigation error:', error);
      });
    } catch (error) {
      console.error('❌ Exception during navigation:', error);
    }
    
    this.closeMobileMenu();
  }

  navigateToRegister() {
    console.log('🔥 Register button clicked');
    try {
      this.router.navigate(['/register']).then((success: any) => {
        console.log('🔥 Register navigation result:', success);
      });
    } catch (error) {
      console.error('❌ Register navigation error:', error);
    }
    this.closeMobileMenu();
  }

  private handleScroll() {
    const header = document.querySelector('header');
    if (header) {
      if (window.scrollY > 100) {
        header.classList.add('backdrop-blur-lg');
        header.classList.remove('backdrop-blur-md');
      } else {
        header.classList.add('backdrop-blur-md');
        header.classList.remove('backdrop-blur-lg');
      }
    }
  }
}