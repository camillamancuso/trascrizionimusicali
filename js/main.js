'use strict';

/* ===== NAVIGATION: scroll effect + mobile toggle ===== */
const nav        = document.getElementById('nav');
const navToggle  = document.getElementById('navToggle');
const navLinks   = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });

navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  navToggle.classList.toggle('open', isOpen);
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

/* ===== PORTFOLIO FILTER + EXPAND ===== */
const filterBtns     = document.querySelectorAll('.filter-btn');
const portfolioItems = [...document.querySelectorAll('.portfolio-item')];
const portfolioFade  = document.getElementById('portfolioFade');
const portfolioToggle = document.getElementById('portfolioToggle');

const INITIAL_VISIBLE = 6;
let currentFilter = 'all';
let portfolioExpanded = false;

function applyPortfolioState() {
  const matching = portfolioItems.filter(item =>
    currentFilter === 'all' || item.dataset.category === currentFilter
  );

  portfolioItems.forEach(item => item.classList.add('hidden'));
  const limit = portfolioExpanded ? matching.length : Math.min(INITIAL_VISIBLE, matching.length);
  matching.slice(0, limit).forEach(item => item.classList.remove('hidden'));

  const hasMore = matching.length > INITIAL_VISIBLE;
  if (portfolioFade)   portfolioFade.style.display   = (hasMore && !portfolioExpanded) ? 'block' : 'none';
  if (portfolioToggle) {
    portfolioToggle.style.display = hasMore ? '' : 'none';
    portfolioToggle.textContent   = portfolioExpanded
      ? 'Mostra meno ↑'
      : `Mostra tutti i ${matching.length} lavori ↓`;
  }
}

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    portfolioExpanded = false;
    applyPortfolioState();
  });
});

if (portfolioToggle) {
  portfolioToggle.addEventListener('click', () => {
    portfolioExpanded = !portfolioExpanded;
    applyPortfolioState();
    if (!portfolioExpanded) {
      document.getElementById('portfolio').scrollIntoView({ behavior: 'smooth' });
    }
  });
}

applyPortfolioState();

/* ===== FILE UPLOAD: show file name ===== */
const fileInput  = document.getElementById('file');
const fileNameEl = document.getElementById('fileName');

if (fileInput && fileNameEl) {
  fileInput.addEventListener('change', () => {
    if (fileInput.files.length > 0) {
      fileNameEl.textContent = 'File selezionato: ' + fileInput.files[0].name;
    } else {
      fileNameEl.textContent = '';
    }
  });
}

/* ===== CONTACT FORM SUBMISSION ===== */
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

if (contactForm && formSuccess) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const btn       = contactForm.querySelector('#submitBtn');
    const btnText   = contactForm.querySelector('#btnText');
    const btnLoading = contactForm.querySelector('#btnLoading');

    btn.disabled       = true;
    btnText.style.display   = 'none';
    btnLoading.style.display = 'inline';

    try {
      const formData = new FormData(contactForm);
      formData.delete('file'); // file upload not supported on Formspree free plan
      const res = await fetch(contactForm.action, {
        method:  'POST',
        body:    formData,
        headers: { 'Accept': 'application/json' }
      });

      if (res.ok) {
        contactForm.style.display = 'none';
        formSuccess.style.display = 'flex';
        formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        throw new Error('Errore ' + res.status);
      }
    } catch {
      btn.disabled            = false;
      btnText.style.display   = 'inline';
      btnLoading.style.display = 'none';
      alert(
        'Impossibile inviare il modulo.\n\n' +
        'Contattami direttamente:\n' +
        'Email: camillamancuso02@gmail.com\n' +
        'Fiverr: fiverr.com/sellers/camillamancuso'
      );
    }
  });
}

/* ===== LIGHTBOX ===== */
const lightbox       = document.getElementById('lightbox');
const lightboxImg    = document.getElementById('lightboxImg');
const lightboxCaption = document.getElementById('lightboxCaption');

document.querySelectorAll('.portfolio-img').forEach(container => {
  container.style.cursor = 'zoom-in';
  container.addEventListener('click', () => {
    const img   = container.querySelector('img');
    const title = container.closest('.portfolio-item').querySelector('h4').textContent;
    lightboxImg.src        = img.src;
    lightboxImg.alt        = img.alt;
    lightboxCaption.textContent = title;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  });
});

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}

document.getElementById('lightboxClose').addEventListener('click', closeLightbox);
lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });

/* ===== PORTFOLIO IMAGE FALLBACK ===== */
document.querySelectorAll('.portfolio-img img').forEach(img => {
  img.addEventListener('error', () => {
    img.style.display = 'none';
  });
});

/* ===== SET MIN DATE ON DEADLINE INPUT ===== */
const deadlineInput = document.getElementById('deadline');
if (deadlineInput) {
  const today = new Date().toISOString().split('T')[0];
  deadlineInput.min = today;
}
