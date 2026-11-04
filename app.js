/**
 * BEAR & ROOTS • MEN'S GROOMING STUDIO
 * Interactive Booking Logic & WhatsApp Integration
 * Developed for Breborn.cl Showcase
 */

document.addEventListener('DOMContentLoaded', () => {
  initBookingForm();
  initServiceSelectors();
  initMobileMenu();
});

// Número de demostración comercial para el showcase de Breborn
const WHATSAPP_PHONE = '56986546546';

/**
 * Inicialización y configuración del formulario de agendamiento
 */
function initBookingForm() {
  const form = document.getElementById('bearBookingForm');
  const dateInput = document.getElementById('fDate');

  if (dateInput) {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    dateInput.min = `${yyyy}-${mm}-${dd}`;

    // Fecha sugerida: Mañana
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    const tdd = String(tomorrow.getDate()).padStart(2, '0');
    const tmm = String(tomorrow.getMonth() + 1).padStart(2, '0');
    dateInput.value = `${tomorrow.getFullYear()}-${tmm}-${tdd}`;
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const service = document.getElementById('fService')?.value || 'Corte de Autor';
      const location = document.getElementById('fLocation')?.value || 'Viña del Mar';
      const barber = document.getElementById('fBarber')?.value || 'Primer disponible';
      const date = document.getElementById('fDate')?.value || '';
      const time = document.getElementById('fTime')?.value || 'Tarde';

      // Construcción del mensaje pre-estructurado para WhatsApp
      const lines = [
        '¡Hola Bear & Roots! 👋 Quiero agendar mi hora:',
        '',
        `✂️ *Servicio:* ${service}`,
        `📍 *Sucursal:* ${location}`,
        `💈 *Barbero preferido:* ${barber}`,
        `📅 *Fecha solicitada:* ${date}`,
        `🕒 *Rango horario:* ${time}`,
        '',
        '¿Tienen disponibilidad en ese bloque? ¡Muchas gracias!'
      ];

      const fullMessage = lines.join('\n');
      const waUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(fullMessage)}`;

      // Abrir WhatsApp en pestaña nueva
      window.open(waUrl, '_blank');
    });
  }
}

/**
 * Conexión de las tarjetas de servicios con el selector del formulario
 */
function initServiceSelectors() {
  const serviceCards = document.querySelectorAll('.icon-service-card');
  const serviceSelect = document.getElementById('fService');
  const bookingSection = document.getElementById('agendamiento');
  const bookingBox = document.querySelector('.booking-box');

  serviceCards.forEach((card) => {
    const selectBtn = card.querySelector('.btn-select-service');
    const targetService = card.getAttribute('data-service-target');

    const handleSelect = (e) => {
      e.stopPropagation();

      if (serviceSelect && targetService) {
        let matched = false;
        for (let i = 0; i < serviceSelect.options.length; i++) {
          const optVal = serviceSelect.options[i].value;
          if (optVal.includes(targetService) || targetService.includes(optVal)) {
            serviceSelect.selectedIndex = i;
            matched = true;
            break;
          }
        }
        if (!matched) {
          const newOpt = new Option(targetService, targetService, true, true);
          serviceSelect.add(newOpt);
        }
      }

      if (bookingSection) {
        bookingSection.scrollIntoView({ behavior: 'smooth' });

        if (bookingBox) {
          bookingBox.style.transition = 'box-shadow 0.4s ease, border-color 0.4s ease';
          bookingBox.style.borderColor = '#f3b164';
          bookingBox.style.boxShadow = '0 0 45px rgba(243, 177, 100, 0.65)';
          setTimeout(() => {
            bookingBox.style.boxShadow = '';
            bookingBox.style.borderColor = '';
          }, 1800);
        }
      }
    };

    if (selectBtn) {
      selectBtn.addEventListener('click', handleSelect);
    }
    card.addEventListener('click', (e) => {
      // Si el click no fue en el botón, también activarlo
      if (e.target !== selectBtn) {
        handleSelect(e);
      }
    });
  });
}

/**
 * Menú móvil responsive
 */
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobileToggle');
  const mobileNav = document.getElementById('mobileNav');
  const mobileLinks = document.querySelectorAll('.m-link');

  if (toggleBtn && mobileNav) {
    toggleBtn.addEventListener('click', () => {
      mobileNav.classList.toggle('active');
    });

    mobileLinks.forEach((link) => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('active');
      });
    });
  }
}
