/* Small helper selectors */
const $ = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));

/* Toggle dark/light theme */
const modeToggle = $('#modeToggle');
modeToggle.addEventListener('click', () => {
  const dark = document.body.classList.toggle('dark');
  modeToggle.setAttribute('aria-pressed', dark ? 'true' : 'false');
  modeToggle.textContent = dark ? '☀️ Siang' : '🌙 Malam';
});

/* Sections reveal on scroll — retrigger when element leaves so animation plays both directions */
const sections = $$('.section');
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (prefersReduced) {
  // Show all immediately if user prefers reduced motion
  sections.forEach(s => s.classList.add('visible'));
} else {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
      else entry.target.classList.remove('visible'); // remove so re-enter replays
    });
  }, { threshold: 0.18 });
  sections.forEach(s => io.observe(s));
}

/* Next buttons: advance forward only */
$$('.next').forEach((btn, idx) => {
  btn.addEventListener('click', () => {
    const nextSection = sections[idx + 1];
    if (nextSection) nextSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

/* Gallery lightbox with prev/next and keyboard support */
const thumbs = $$('.thumb');
const lightbox = $('#lightbox');
const lbImg = $('#lbImage');
const lbClose = $('#lbClose');
const lbPrev = $('#lbPrev');
const lbNext = $('#lbNext');
let current = -1;

function openLightbox(i){
  if (i < 0 || i >= thumbs.length) return;
  current = i;
  lbImg.src = thumbs[i].src;
  lightbox.classList.add('open');
  lightbox.setAttribute('aria-hidden','false');
}
function closeLightbox(){
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden','true');
  lbImg.src = '';
  current = -1;
}
function prevLB(){
  if (thumbs.length === 0) return;
  current = (current - 1 + thumbs.length) % thumbs.length;
  lbImg.src = thumbs[current].src;
}
function nextLB(){
  if (thumbs.length === 0) return;
  current = (current + 1) % thumbs.length;
  lbImg.src = thumbs[current].src;
}

thumbs.forEach((t,i) => t.addEventListener('click', () => openLightbox(i)));
if (lbClose) lbClose.addEventListener('click', closeLightbox);
if (lbPrev) lbPrev.addEventListener('click', prevLB);
if (lbNext) lbNext.addEventListener('click', nextLB);
lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') prevLB();
  if (e.key === 'ArrowRight') nextLB();
});

/* Footer year */
const yearEl = $('#year');
if (yearEl) yearEl.textContent = new Date().getFullYear();
