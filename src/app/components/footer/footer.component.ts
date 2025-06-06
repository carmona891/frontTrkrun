import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <footer class="bg-gradient-to-br from-black to-gray-900 border-t border-gray-800">
      <div class="container mx-auto px-4 py-16">
        <!-- Main Footer Content -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <!-- Logo and Description -->
          <div class="lg:col-span-1">
            <div class="flex items-center space-x-3 mb-6">
              <div class="relative">
                <div class="w-12 h-12 bg-gradient-to-br from-red-500 to-blue-500 rounded-lg flex items-center justify-center">
                <img src="../../../assets/logo.png" alt="">
                </div>
                <div class="absolute -top-1 -right-1 w-4 h-4 bg-blue-400 rounded-full animate-pulse"></div>
              </div>
              <div>
                <h3 class="text-xl font-black text-white">
                  <span class="bg-gradient-to-r from-red-500 to-blue-400 bg-clip-text text-transparent">Trk</span>
                  <span class="text-white">Run</span>
                </h3>
                <p class="text-xs text-gray-400 -mt-1">Championship Series</p>
              </div>
            </div>
            <p class="text-gray-300 leading-relaxed mb-6">
              La plataforma líder en competiciones de motociclismo. Vive la adrenalina, siente la velocidad y únete a la comunidad más apasionada del motor.
            </p>
            <div class="flex space-x-4">
              <a *ngFor="let social of socialLinks" 
                 [href]="social.href" 
                 [class]="social.bgColor"
                 class="text-white p-3 rounded-full transition-all duration-300 transform hover:scale-110">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path [attr.d]="social.iconPath"></path>
                </svg>
              </a>
            </div>
          </div>

          <!-- Quick Links -->
          <div>
            <h4 class="text-lg font-bold text-white mb-6">Enlaces Rápidos</h4>
            <ul class="space-y-3">
              <li *ngFor="let link of quickLinks">
                <a [href]="link.href" class="text-gray-300 hover:text-red-400 transition-colors duration-300 flex items-center group">
                  <span class="w-1 h-1 bg-red-500 rounded-full mr-3 group-hover:w-2 transition-all duration-300"></span>
                  {{link.label}}
                </a>
              </li>
            </ul>
          </div>

          <!-- Support -->
          <div>
            <h4 class="text-lg font-bold text-white mb-6">Soporte</h4>
            <ul class="space-y-3">
              <li *ngFor="let support of supportLinks">
                <a [href]="support.href" class="text-gray-300 hover:text-blue-400 transition-colors duration-300 flex items-center group">
                  <span class="w-1 h-1 bg-blue-400 rounded-full mr-3 group-hover:w-2 transition-all duration-300"></span>
                  {{support.label}}
                </a>
              </li>
            </ul>
          </div>

          <!-- Newsletter -->
          <div>
            <h4 class="text-lg font-bold text-white mb-6">Newsletter</h4>
            <p class="text-gray-300 mb-4">Recibe las últimas noticias y actualizaciones de las competiciones.</p>
            <form (ngSubmit)="onNewsletterSubmit()" class="space-y-3">
              <input 
                type="email" 
                [(ngModel)]="newsletterEmail"
                name="email"
                placeholder="Tu email" 
                required
                class="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors duration-300">
              <button 
                type="submit" 
                [disabled]="isSubmittingNewsletter"
                class="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-red-500/50 disabled:opacity-50 disabled:cursor-not-allowed">
                {{isSubmittingNewsletter ? 'Enviando...' : 'Suscribirse'}}
              </button>
            </form>
            <p class="text-xs text-gray-400 mt-3">
              Al suscribirte aceptas recibir comunicaciones promocionales. Puedes darte de baja en cualquier momento.
            </p>
          </div>
        </div>

        <!-- Stats Bar -->
        <div class="border-t border-gray-800 pt-8 mb-8">
          <div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div *ngFor="let stat of statistics" class="group">
              <div [class]="stat.color" class="text-3xl font-black mb-2 group-hover:scale-110 transition-transform duration-300">
                {{stat.value}}
              </div>
              <div class="text-gray-300 text-sm">{{stat.label}}</div>
            </div>
          </div>
        </div>

        <!-- Bottom Footer -->
        <div class="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div class="text-gray-400 text-sm mb-4 md:mb-0">
            © {{currentYear}} MotoRacing Championship Series. Todos los derechos reservados.
          </div>
          <div class="flex items-center space-x-6">
            <span class="text-gray-400 text-sm">Hecho con</span>
            <div class="flex items-center space-x-2">
              <span class="text-red-500 animate-pulse">❤️</span>
              <span class="text-gray-400 text-sm">y mucha adrenalina</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: []
})
export class FooterComponent {
  newsletterEmail = '';
  isSubmittingNewsletter = false;
  currentYear = new Date().getFullYear();

  socialLinks = [
    {
      href: '#',
      bgColor: 'bg-red-600 hover:bg-red-700',
      iconPath: 'M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z'
    },
    {
      href: '#',
      bgColor: 'bg-blue-600 hover:bg-blue-700',
      iconPath: 'M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z'
    },
    {
      href: '#',
      bgColor: 'bg-gray-700 hover:bg-gray-600',
      iconPath: 'M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.097.118.112.222.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z'
    },
    {
      href: '#',
      bgColor: 'bg-red-500 hover:bg-red-600',
      iconPath: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z'
    }
  ];

  quickLinks = [
    { label: 'Competiciones Activas', href: '#competiciones' },
    { label: 'Calendario de Eventos', href: '#calendario' },
    { label: 'Clasificaciones', href: '#clasificaciones' },
    { label: 'Inscribirse Ahora', href: '#inscripcion' },
    { label: 'Reglamento', href: '#reglamento' }
  ];

  supportLinks = [
    { label: 'Centro de Ayuda', href: '#help' },
    { label: 'Preguntas Frecuentes', href: '#faq' },
    { label: 'Contactar Soporte', href: '#contact' },
    { label: 'Términos y Condiciones', href: '#terms' },
    { label: 'Política de Privacidad', href: '#privacy' }
  ];

  statistics = [
    { value: '2,500+', label: 'Pilotos Registrados', color: 'text-red-500' },
    { value: '150+', label: 'Competiciones Anuales', color: 'text-blue-400' },
    { value: '25', label: 'Circuitos Oficiales', color: 'text-red-500' },
    { value: '€2M+', label: 'Premios Entregados', color: 'text-blue-400' }
  ];

  onNewsletterSubmit() {
    if (!this.newsletterEmail) return;
    
    this.isSubmittingNewsletter = true;
    
    // Simular envío del newsletter
    setTimeout(() => {
      console.log('Newsletter suscripción:', this.newsletterEmail);
      alert('¡Gracias por suscribirte! Recibirás nuestras últimas noticias.');
      this.newsletterEmail = '';
      this.isSubmittingNewsletter = false;
    }, 1500);
  }
}