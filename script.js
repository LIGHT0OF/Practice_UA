/* THEME */
const root = document.documentElement;
const themeBtn = document.getElementById('theme-toggle');

function setTheme(t) {
  root.setAttribute('data-theme', t);
  themeBtn.textContent = t === 'dark' ? '☀' : '☾';
  themeBtn.setAttribute('aria-label', t === 'dark' ? 'Увімкнути світлу тему' : 'Увімкнути темну тему');
  localStorage.setItem('nova-theme', t);
}
setTheme(localStorage.getItem('nova-theme') || 'dark');
themeBtn.addEventListener('click', () => setTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'));

/* MOBILE MENU */
const burger = document.getElementById('burger');
const menu = document.getElementById('mobile-menu');
const firstLink = menu.querySelector('a');

function closeMenu() {
  burger.setAttribute('aria-expanded', 'false');
  menu.classList.remove('open');
  menu.setAttribute('aria-hidden', 'true');
}
burger.addEventListener('click', () => {
  const open = burger.getAttribute('aria-expanded') === 'true';
  if (open) {
    closeMenu();
  } else {
    burger.setAttribute('aria-expanded', 'true');
    menu.classList.add('open');
    menu.setAttribute('aria-hidden', 'false');
    firstLink.focus();
  }
});
menu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && menu.classList.contains('open')) {
    closeMenu();
    burger.focus();
  }
});

/* SLIDER */
const track   = document.getElementById('slider-track');
const slides  = track.querySelectorAll('.slide');
const dots    = document.querySelectorAll('.slider-dots button');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
let cur = 0, timer;

function goTo(idx) {
  slides[cur].setAttribute('aria-hidden', 'true');
  dots[cur].setAttribute('aria-current', 'false');
  cur = (idx + slides.length) % slides.length;
  track.style.transform = `translateX(-${cur * 100}%)`;
  slides[cur].removeAttribute('aria-hidden');
  dots[cur].setAttribute('aria-current', 'true');
  prevBtn.disabled = cur === 0;
  nextBtn.disabled = cur === slides.length - 1;
}

prevBtn.addEventListener('click', () => { clearInterval(timer); goTo(cur - 1); });
nextBtn.addEventListener('click', () => { clearInterval(timer); goTo(cur + 1); });
dots.forEach(d => d.addEventListener('click', () => { clearInterval(timer); goTo(+d.dataset.idx); }));
dots.forEach((d, i) => d.addEventListener('keydown', e => {
  if (e.key === 'ArrowRight') dots[(i + 1) % dots.length].focus();
  if (e.key === 'ArrowLeft')  dots[(i - 1 + dots.length) % dots.length].focus();
}));

let startX = 0;
track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
track.addEventListener('touchend', e => {
  const dx = e.changedTouches[0].clientX - startX;
  if (Math.abs(dx) > 50) { clearInterval(timer); goTo(cur + (dx < 0 ? 1 : -1)); }
});

const wrap = document.getElementById('slider-wrap');
const startAuto = () => { timer = setInterval(() => goTo(cur + 1), 5000); };
wrap.addEventListener('mouseenter', () => clearInterval(timer));
wrap.addEventListener('mouseleave', startAuto);
wrap.addEventListener('focusin',    () => clearInterval(timer));
wrap.addEventListener('focusout',   startAuto);

if (!matchMedia('(prefers-reduced-motion: reduce)').matches) startAuto();
