// Navbar scroll effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 10);
});

// Mobile nav toggle
const navToggle = document.getElementById('nav-toggle');
const navLinks = document.getElementById('nav-links');

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('active');
});

// Close mobile nav on link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('active');
  });
});

// Scroll animations
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
  el.classList.add('fade-in');
  observer.observe(el);
});

// Contact form — mailto fallback
document.getElementById('contact-form').addEventListener('submit', function (e) {
  e.preventDefault();

  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const subject = document.getElementById('subject').value;
  const message = document.getElementById('message').value;

  const mailtoBody = `Name: ${name}\nEmail: ${email}\n\n${message}`;
  const mailtoLink = `mailto:office@zakconsult.com?subject=${encodeURIComponent(subject || 'Website Inquiry')}&body=${encodeURIComponent(mailtoBody)}`;

  window.location.href = mailtoLink;

  // Show success state
  this.innerHTML = `
    <div class="form-success">
      <h3>Opening your email client...</h3>
      <p>If it doesn't open, email us directly at <a href="mailto:office@zakconsult.com">office@zakconsult.com</a></p>
    </div>
  `;
});
