/**
 * AURA & BARBA • DEMO LOGIC
 * High-conversion interactive booking & WhatsApp integration
 * Developed for Breborn.cl
 */

document.addEventListener('DOMContentLoaded', () => {
  initTabs();
  initBookingForm();
  initMobileMenu();
  initOpeningStatus();
  initCardBookButtons();
});

// Número de demostración para el showcase (reemplazable por el cliente)
const SALON_WHATSAPP = "56986546546";

/* ================= CONTROLADOR DE PESTAÑAS (TABS) ================= */
function initTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');

      tabBtns.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      btn.classList.add('active');
      const activeContent = document.getElementById(`tab-${targetTab}`);
      if (activeContent) {
        activeContent.classList.add('active');
      }
    });
  });
}

/* ================= BOTONES "AGENDAR ESTE SERVICIO" DE CADA TARJETA ================= */
function initCardBookButtons() {
  const cardButtons = document.querySelectorAll('.btn-card-book');
  const serviceSelect = document.getElementById('bookService');
  const bookingSection = document.getElementById('agendamiento');

  cardButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const serviceName = btn.getAttribute('data-service');
      if (serviceSelect && serviceName) {
        // Find matching option or add
        let found = false;
        for (let opt of serviceSelect.options) {
          if (opt.value.includes(serviceName) || serviceName.includes(opt.value)) {
            opt.selected = true;
            found = true;
            break;
          }
        }
        if (!found) {
          const newOpt = new Option(serviceName, serviceName, true, true);
          serviceSelect.add(newOpt);
        }
      }

      // Smooth scroll to form
      if (bookingSection) {
        bookingSection.scrollIntoView({ behavior: 'smooth' });
        // Highlight form card
        const formCard = document.querySelector('.booking-card');
        if (formCard) {
          formCard.style.transition = 'all 0.4s ease';
          formCard.style.boxShadow = '0 0 30px rgba(212, 175, 55, 0.6)';
          setTimeout(() => {
            formCard.style.boxShadow = '';
          }, 2000);
        }
      }
    });
  });
}

/* ================= FORMULARIO & GENERADOR DE WHATSAPP ================= */
function initBookingForm() {
  const form = document.getElementById('bookingForm');
  const dateInput = document.getElementById('bookDate');

  // Set minimum date to today
  if (dateInput) {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    dateInput.min = `${yyyy}-${mm}-${dd}`;

    // Default to tomorrow or today
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    const tdd = String(tomorrow.getDate()).padStart(2, '0');
    const tmm = String(tomorrow.getMonth() + 1).padStart(2, '0');
    dateInput.value = `${tomorrow.getFullYear()}-${tmm}-${tdd}`;
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const service = document.getElementById('bookService').value;
      const specialist = document.getElementById('bookSpecialist').value;
      const dateVal = document.getElementById('bookDate').value;
      const timeVal = document.getElementById('bookTime').value;
      const location = document.getElementById('bookLocation').value;

      // Format date in Spanish (e.g. "Viernes 5 de Noviembre")
      let dateFormatted = dateVal;
      try {
        const parts = dateVal.split('-');
        if (parts.length === 3) {
          const dObj = new Date(parts[0], parts[1] - 1, parts[2]);
          dateFormatted = dObj.toLocaleDateString('es-CL', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          });
        }
      } catch (err) {}

      // Craft polished, high-converting WhatsApp message
      const message = 
`¡Hola Aura & Barba! 👋

Me gustaría agendar una hora para atención:
💈 *Servicio:* ${service}
✂️ *Especialista:* ${specialist}
📅 *Fecha estimada:* ${dateFormatted}
🕒 *Horario:* ${timeVal}
📍 *Sucursal:* ${location}

¿Tienen disponibilidad en este horario para confirmar mi reserva? ¡Muchas gracias!`;

      const waUrl = `https://wa.me/${SALON_WHATSAPP}?text=${encodeURIComponent(message)}`;
      window.open(waUrl, '_blank');
    });
  }
}

/* ================= MENÚ MÓVIL TOGGLE ================= */
function initMobileMenu() {
  const toggle = document.getElementById('mobileToggle');
  const menu = document.getElementById('mobileMenu');
  const links = document.querySelectorAll('.mobile-link');

  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      menu.classList.toggle('active');
    });

    links.forEach(l => {
      l.addEventListener('click', () => {
        menu.classList.remove('active');
      });
    });
  }
}

/* ================= ESTADO DE APERTURA EN VIVO ================= */
function initOpeningStatus() {
  const statusText = document.getElementById('statusText');
  if (!statusText) return;

  const now = new Date();
  const day = now.getDay(); // 0 is Sunday
  const hour = now.getHours();

  if (day === 0) {
    // Sunday
    statusText.textContent = "Cerrado hoy Domingo • Recibiendo citas por WhatsApp para mañana Lunes";
  } else if (hour >= 10 && hour < 20) {
    statusText.textContent = "Abierto Ahora • Recibiendo citas por WhatsApp con confirmación inmediata";
  } else {
    statusText.textContent = "Cerrado en este momento • Agenda ahora por WhatsApp para abrir mañana a las 10:00";
  }
}
