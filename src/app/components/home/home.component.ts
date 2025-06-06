import { Component, OnInit, OnDestroy } from '@angular/core';
import { trigger, state, style, transition, animate, keyframes } from '@angular/animations';
import { HeaderComponent } from "../header/header.component";
import { FooterComponent } from "../footer/footer.component";

interface Slide {
  id: number;
  image: string;
  title: string;
  subtitle: string;
  buttonText: string;
}

interface Service {
  id: number;
  title: string;
  description: string;
  icon: string;
  color: string;
  hovered?: boolean;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  animations: [
    trigger('slideAnimation', [
      transition('* <=> *', [
        animate('800ms ease-in-out')
      ])
    ]),
    trigger('fadeInUp', [
      state('in', style({ opacity: 1, transform: 'translateY(0)' })),
      transition('void => *', [
        style({ opacity: 0, transform: 'translateY(30px)' }),
        animate('600ms ease-out')
      ])
    ]),
    trigger('cardHover', [
      state('normal', style({ 
        transform: 'scale(1) translateY(0)',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      })),
      state('hovered', style({ 
        transform: 'scale(1.03) translateY(-10px)',
        boxShadow: '0 20px 25px rgba(0, 0, 0, 0.15)'
      })),
      transition('normal <=> hovered', animate('300ms cubic-bezier(0.4, 0, 0.2, 1)'))
    ]),
    trigger('heroContent', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(50px)' }),
        animate('1000ms 300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('serviceIcon', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0) rotate(-180deg)' }),
        animate('600ms 200ms cubic-bezier(0.68, -0.55, 0.265, 1.55)', 
          style({ opacity: 1, transform: 'scale(1) rotate(0deg)' }))
      ])
    ])
  ]
})
export class HomeComponent implements OnInit, OnDestroy {
  currentSlide = 0;
  slideInterval: any;
  isAutoPlay = true;

  slides: Slide[] = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
      title: 'SERVICIOS TÉCNICOS',
      subtitle: 'Excelencia en cada detalle para tu vehículo de competición',
      buttonText: 'Descubre Más'
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
      title: 'MÁXIMO RENDIMIENTO',
      subtitle: 'Preparación profesional para alcanzar la victoria',
      buttonText: 'Ver Servicios'
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
      title: 'TECNOLOGÍA AVANZADA',
      subtitle: 'Equipos de última generación y años de experiencia',
      buttonText: 'Contactar Ahora'
    }
  ];

  services: Service[] = [
    {
      id: 1,
      title: 'Inspección',
      description: 'Diagnóstico completo y revisión técnica especializada para garantizar el óptimo funcionamiento y seguridad de tu vehículo de competición.',
      icon: '🔍',
      color: '#e53e3e',
      hovered: false
    },
    {
      id: 2,
      title: 'Mantenimiento',
      description: 'Servicio integral de mantenimiento preventivo y correctivo con los más altos estándares de calidad y precisión técnica.',
      icon: '🔧',
      color: '#3182ce',
      hovered: false
    },
    {
      id: 3,
      title: 'Competición',
      description: 'Preparación y puesta a punto especializada para vehículos de competición y alto rendimiento. Setup personalizado para cada piloto.',
      icon: '🏆',
      color: '#38a169',
      hovered: false
    },
    {
      id: 4,
      title: 'Otros Servicios',
      description: 'Servicios personalizados y soluciones técnicas adaptadas a las necesidades específicas de cada cliente y tipo de vehículo.',
      icon: '⚙️',
      color: '#805ad5',
      hovered: false
    }
  ];

  constructor() { }

  ngOnInit(): void {
    this.startSlideshow();
    this.setupTouchHandlers();
  }

  ngOnDestroy(): void {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
    }
  }

  startSlideshow(): void {
    if (this.isAutoPlay) {
      this.slideInterval = setInterval(() => {
        this.nextSlide();
      }, 5000);
    }
  }

  pauseSlideshow(): void {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
    }
  }

  resumeSlideshow(): void {
    if (this.isAutoPlay) {
      this.startSlideshow();
    }
  }

  nextSlide(): void {
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
  }

  prevSlide(): void {
    this.currentSlide = this.currentSlide === 0 ? this.slides.length - 1 : this.currentSlide - 1;
  }

  goToSlide(index: number): void {
    this.currentSlide = index;
    this.pauseSlideshow();
    setTimeout(() => this.resumeSlideshow(), 3000);
  }

  onServiceHover(service: Service, isHovered: boolean): void {
    service.hovered = isHovered;
  }

  onSlideAction(action: string): void {
    switch(action) {
      case 'discover':
        this.scrollToServices();
        break;
      case 'services':
        this.scrollToServices();
        break;
      case 'contact':
        this.scrollToContact();
        break;
    }
  }

  scrollToServices(): void {
    const element = document.getElementById('servicios');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  scrollToContact(): void {
    const element = document.getElementById('contacto');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  requestService(serviceTitle: string): void {
    // Aquí puedes agregar la lógica para solicitar una cita
    alert(`Solicitud de cita para: ${serviceTitle}\n\nTe contactaremos pronto para coordinar tu cita.`);
  }

  private setupTouchHandlers(): void {
    let startX = 0;
    let startY = 0;
    
    const slider = document.querySelector('.slider-container');
    if (slider) {
      slider.addEventListener('touchstart', (e: any) => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        this.pauseSlideshow();
      });

      slider.addEventListener('touchend', (e: any) => {
        const endX = e.changedTouches[0].clientX;
        const endY = e.changedTouches[0].clientY;
        const diffX = startX - endX;
        const diffY = startY - endY;

        // Solo si el movimiento es más horizontal que vertical
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
          if (diffX > 0) {
            this.nextSlide();
          } else {
            this.prevSlide();
          }
        }
        
        setTimeout(() => this.resumeSlideshow(), 3000);
      });
    }
  }

  getCurrentSlideData(): Slide {
    return this.slides[this.currentSlide];
  }
}