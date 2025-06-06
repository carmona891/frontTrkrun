import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  imports: [CommonModule, FormsModule],
})
export class ContactComponent {
  
  // Formulario de contacto
  contactForm = {
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    contactMethod: 'email' // email, phone, whatsapp
  };

  // Estados del formulario
  isSubmitting = false;
  formSubmitted = false;
  formErrors: any = {};

  // Información de contacto
  contactInfo = [
    {
      icon: '📧',
      title: 'Email',
      value: 'info@trkrun.com',
      link: 'mailto:info@trkrun.com',
      description: 'Respuesta en 24 horas'
    },
    {
      icon: '📞',
      title: 'Teléfono',
      value: '+34 900 123 456',
      link: 'tel:+34900123456',
      description: 'Lun - Vie: 9:00 - 18:00'
    },
    {
      icon: '💬',
      title: 'WhatsApp',
      value: '+34 600 789 012',
      link: 'https://wa.me/34600789012',
      description: 'Respuesta inmediata'
    },
    {
      icon: '📍',
      title: 'Ubicación',
      value: 'Madrid, España',
      link: 'https://maps.google.com/?q=Madrid,Spain',
      description: 'Circuito de Jarama'
    }
  ];

  // Horarios de atención
  schedule = [
    { day: 'Lunes - Viernes', hours: '9:00 - 18:00', type: 'work' },
    { day: 'Sábados', hours: '10:00 - 14:00', type: 'weekend' },
    { day: 'Domingos', hours: 'Cerrado', type: 'closed' },
    { day: 'Emergencias 24/7', hours: '+34 600 123 456', type: 'emergency' }
  ];

  // Redes sociales
  socialLinks = [
    { name: 'Instagram', icon: '📷', url: 'https://instagram.com/trkrun', color: '#E4405F' },
    { name: 'Facebook', icon: '👥', url: 'https://facebook.com/trkrun', color: '#1877F2' },
    { name: 'Twitter', icon: '🐦', url: 'https://twitter.com/trkrun', color: '#1DA1F2' },
    { name: 'YouTube', icon: '📺', url: 'https://youtube.com/trkrun', color: '#FF0000' }
  ];

  // Validar formulario
  validateForm(): boolean {
    this.formErrors = {};
    let isValid = true;

    if (!this.contactForm.name.trim()) {
      this.formErrors.name = 'El nombre es requerido';
      isValid = false;
    }

    if (!this.contactForm.email.trim()) {
      this.formErrors.email = 'El email es requerido';
      isValid = false;
    } else if (!this.isValidEmail(this.contactForm.email)) {
      this.formErrors.email = 'El email no es válido';
      isValid = false;
    }

    if (!this.contactForm.subject.trim()) {
      this.formErrors.subject = 'El asunto es requerido';
      isValid = false;
    }

    if (!this.contactForm.message.trim()) {
      this.formErrors.message = 'El mensaje es requerido';
      isValid = false;
    } else if (this.contactForm.message.trim().length < 10) {
      this.formErrors.message = 'El mensaje debe tener al menos 10 caracteres';
      isValid = false;
    }

    return isValid;
  }

  // Validar email
  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Enviar formulario
  onSubmit() {
    if (!this.validateForm()) {
      return;
    }

    this.isSubmitting = true;

    // Simular envío del formulario
    setTimeout(() => {
      this.isSubmitting = false;
      this.formSubmitted = true;
      
      // Resetear formulario después de 3 segundos
      setTimeout(() => {
        this.resetForm();
      }, 3000);
    }, 2000);
  }

  // Resetear formulario
  resetForm() {
    this.contactForm = {
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
      contactMethod: 'email'
    };
    this.formSubmitted = false;
    this.formErrors = {};
  }

  // Abrir enlace externo
  openExternalLink(url: string) {
    window.open(url, '_blank');
  }

  // Llamar por teléfono
  callPhone(phone: string) {
    window.location.href = `tel:${phone}`;
  }

  // Enviar WhatsApp
  sendWhatsApp() {
    const message = `Hola! Me gustaría obtener más información sobre TrkRun.`;
    const url = `https://wa.me/34600789012?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  }
}