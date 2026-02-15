// === Navbar scroll effect ===
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 10);
});

// === Mobile nav toggle with keyboard support ===
const navToggle = document.getElementById('nav-toggle');
const navLinks = document.getElementById('nav-links');

function toggleNav() {
  const isOpen = navLinks.classList.toggle('active');
  navToggle.setAttribute('aria-expanded', isOpen);
}

navToggle.addEventListener('click', toggleNav);

// Close mobile nav on link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('active');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// Close mobile nav on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    // Close mobile nav
    if (navLinks.classList.contains('active')) {
      navLinks.classList.remove('active');
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.focus();
    }
    // Close accessibility panel
    if (!a11yPanel.hidden) {
      a11yPanel.hidden = true;
      a11yToggle.setAttribute('aria-expanded', 'false');
      a11yToggle.focus();
    }
  }
});

// === Scroll animations with reduced motion respect ===
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  },
  { threshold: 0.1 }
);

document.querySelectorAll('.service-card, .step, .why-card, .contact-form, .contact-info').forEach(el => {
  if (prefersReducedMotion.matches) {
    el.classList.add('visible');
  } else {
    el.classList.add('fade-in');
    observer.observe(el);
  }
});

// === Contact form with validation and mailto ===
const contactForm = document.getElementById('contact-form');

function showError(fieldId, message) {
  const field = document.getElementById(fieldId);
  const error = document.getElementById(fieldId + '-error');
  if (error) {
    error.textContent = message;
  }
  if (field) {
    field.setAttribute('aria-invalid', 'true');
    field.setAttribute('aria-describedby', fieldId + '-error');
  }
}

function clearError(fieldId) {
  const field = document.getElementById(fieldId);
  const error = document.getElementById(fieldId + '-error');
  if (error) {
    error.textContent = '';
  }
  if (field) {
    field.removeAttribute('aria-invalid');
    field.removeAttribute('aria-describedby');
  }
}

// Clear errors on input
['name', 'email', 'message'].forEach(id => {
  const field = document.getElementById(id);
  if (field) {
    field.addEventListener('input', () => clearError(id));
  }
});

contactForm.addEventListener('submit', function (e) {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const subject = document.getElementById('subject').value.trim();
  const message = document.getElementById('message').value.trim();

  let isValid = true;

  // Clear previous errors
  ['name', 'email', 'message'].forEach(clearError);

  // Validate
  if (!name) {
    showError('name', 'Please enter your name.');
    isValid = false;
  }

  if (!email) {
    showError('email', 'Please enter your email address.');
    isValid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showError('email', 'Please enter a valid email address.');
    isValid = false;
  }

  if (!message) {
    showError('message', 'Please enter your message.');
    isValid = false;
  }

  if (!isValid) {
    // Focus the first invalid field
    const firstInvalid = this.querySelector('[aria-invalid="true"]');
    if (firstInvalid) firstInvalid.focus();
    return;
  }

  const mailtoBody = `Name: ${name}\nEmail: ${email}\n\n${message}`;
  const mailtoLink = `mailto:office@zakconsult.com?subject=${encodeURIComponent(subject || 'Website Inquiry')}&body=${encodeURIComponent(mailtoBody)}`;

  window.location.href = mailtoLink;

  // Show success state
  this.innerHTML = `
    <div class="form-success" role="status" aria-live="polite">
      <h3>Opening your email client...</h3>
      <p>If it doesn't open, email us directly at <a href="mailto:office@zakconsult.com">office@zakconsult.com</a></p>
    </div>
  `;
});

// === Accessibility Toolbar ===
const a11yToggle = document.getElementById('a11y-toggle');
const a11yPanel = document.getElementById('a11y-panel');

// Toggle panel
a11yToggle.addEventListener('click', () => {
  const isHidden = a11yPanel.hidden;
  a11yPanel.hidden = !isHidden;
  a11yToggle.setAttribute('aria-expanded', isHidden);
  if (isHidden) {
    // Focus first button in panel
    const firstBtn = a11yPanel.querySelector('.a11y-btn');
    if (firstBtn) firstBtn.focus();
  }
});

// Close panel when clicking outside
document.addEventListener('click', (e) => {
  if (!e.target.closest('.a11y-toolbar') && !a11yPanel.hidden) {
    a11yPanel.hidden = true;
    a11yToggle.setAttribute('aria-expanded', 'false');
  }
});

// Trap focus in panel when open
a11yPanel.addEventListener('keydown', (e) => {
  if (e.key === 'Tab') {
    const focusable = a11yPanel.querySelectorAll('button');
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }
});

// Font size controls
let fontScale = parseFloat(localStorage.getItem('a11y-font-scale') || '1');
document.documentElement.style.setProperty('--font-scale', fontScale);

document.getElementById('a11y-font-increase').addEventListener('click', () => {
  if (fontScale < 1.5) {
    fontScale = Math.round((fontScale + 0.1) * 10) / 10;
    document.documentElement.style.setProperty('--font-scale', fontScale);
    localStorage.setItem('a11y-font-scale', fontScale);
  }
});

document.getElementById('a11y-font-decrease').addEventListener('click', () => {
  if (fontScale > 0.8) {
    fontScale = Math.round((fontScale - 0.1) * 10) / 10;
    document.documentElement.style.setProperty('--font-scale', fontScale);
    localStorage.setItem('a11y-font-scale', fontScale);
  }
});

// Toggle classes with persistence
function setupToggle(btnId, className) {
  const btn = document.getElementById(btnId);
  const isActive = localStorage.getItem('a11y-' + className) === 'true';

  if (isActive) {
    document.body.classList.add(className);
    btn.classList.add('active');
    btn.setAttribute('aria-pressed', 'true');
  } else {
    btn.setAttribute('aria-pressed', 'false');
  }

  btn.addEventListener('click', () => {
    const active = document.body.classList.toggle(className);
    btn.classList.toggle('active', active);
    btn.setAttribute('aria-pressed', active);
    localStorage.setItem('a11y-' + className, active);
  });
}

setupToggle('a11y-high-contrast', 'high-contrast');
setupToggle('a11y-grayscale', 'grayscale');
setupToggle('a11y-links-underline', 'underline-links');
setupToggle('a11y-readable-font', 'readable-font');

// Reset all
document.getElementById('a11y-reset').addEventListener('click', () => {
  // Remove classes
  document.body.classList.remove('high-contrast', 'grayscale', 'underline-links', 'readable-font');

  // Reset font
  fontScale = 1;
  document.documentElement.style.setProperty('--font-scale', 1);

  // Clear localStorage
  ['a11y-font-scale', 'a11y-high-contrast', 'a11y-grayscale', 'a11y-underline-links', 'a11y-readable-font'].forEach(key => {
    localStorage.removeItem(key);
  });

  // Reset button states
  document.querySelectorAll('.a11y-btn').forEach(btn => {
    btn.classList.remove('active');
    if (btn.hasAttribute('aria-pressed')) {
      btn.setAttribute('aria-pressed', 'false');
    }
  });
});
