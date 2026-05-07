/* ─── Utilities ───────────────────────────────────────────────────────── */
const byId  = id  => document.getElementById(id);
const byAll = sel => document.querySelectorAll(sel);

/* ─── Theme ───────────────────────────────────────────────────────────── */
const THEME_KEY   = 'nova-theme';
const htmlRoot    = document.documentElement;
const themeToggle = byId('theme-toggle');

function applyTheme(theme) {
  htmlRoot.setAttribute('data-theme', theme);
  themeToggle.textContent = theme === 'dark' ? '☀' : '☾';
  themeToggle.setAttribute(
    'aria-label',
    theme === 'dark' ? 'Увімкнути світлу тему' : 'Увімкнути темну тему'
  );
  localStorage.setItem(THEME_KEY, theme);
}

applyTheme(localStorage.getItem(THEME_KEY) || 'dark');
themeToggle.addEventListener('click', () => {
  applyTheme(htmlRoot.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
});

/* ─── Mobile navigation ───────────────────────────────────────────────── */
const burgerBtn    = byId('burger');
const mobileMenu   = byId('mobile-menu');
const firstNavLink = mobileMenu.querySelector('a');

function openMobileMenu() {
  burgerBtn.setAttribute('aria-expanded', 'true');
  mobileMenu.classList.add('open');
  mobileMenu.setAttribute('aria-hidden', 'false');
  firstNavLink.focus();
}

function closeMobileMenu() {
  burgerBtn.setAttribute('aria-expanded', 'false');
  mobileMenu.classList.remove('open');
  mobileMenu.setAttribute('aria-hidden', 'true');
}

burgerBtn.addEventListener('click', () => {
  burgerBtn.getAttribute('aria-expanded') === 'true' ? closeMobileMenu() : openMobileMenu();
});

byAll('#mobile-menu a').forEach(link => link.addEventListener('click', closeMobileMenu));

document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
    closeMobileMenu();
    burgerBtn.focus();
  }
});

/* ─── Slider ──────────────────────────────────────────────────────────── */
const sliderTrack  = byId('slider-track');
const slideItems   = sliderTrack.querySelectorAll('.slide');
const dotBtns      = byAll('.slider-dots button');
const prevSlideBtn = byId('prev-btn');
const nextSlideBtn = byId('next-btn');
const sliderWrap   = byId('slider-wrap');
const SLIDE_COUNT  = slideItems.length;

let activeIndex   = 0;
let autoplayTimer = null;

function showSlide(rawIndex) {
  // Деактивуємо поточний слайд
  slideItems[activeIndex].setAttribute('aria-hidden', 'true');
  dotBtns[activeIndex].setAttribute('aria-current', 'false');

  // Розраховуємо новий індекс з wrap-around
  activeIndex = (rawIndex + SLIDE_COUNT) % SLIDE_COUNT;

  // Застосовуємо трансформацію треку
  sliderTrack.style.transform = `translateX(-${activeIndex * 100}%)`;

  // Активуємо новий слайд
  slideItems[activeIndex].removeAttribute('aria-hidden');
  dotBtns[activeIndex].setAttribute('aria-current', 'true');

  // Кнопки ← / → недоступні на крайніх слайдах
  prevSlideBtn.disabled = activeIndex === 0;
  nextSlideBtn.disabled = activeIndex === SLIDE_COUNT - 1;
}

function startAutoplay() {
  stopAutoplay();
  autoplayTimer = setInterval(() => showSlide(activeIndex + 1), 5000);
}

function stopAutoplay() {
  clearInterval(autoplayTimer);
  autoplayTimer = null;
}

/* Кнопки-стрілки */
prevSlideBtn.addEventListener('click', () => { stopAutoplay(); showSlide(activeIndex - 1); });
nextSlideBtn.addEventListener('click', () => { stopAutoplay(); showSlide(activeIndex + 1); });

/* Точки-навігатори */
dotBtns.forEach(dot =>
  dot.addEventListener('click', () => { stopAutoplay(); showSlide(+dot.dataset.idx); })
);

/* Клавіатурна навігація між точками (← →) */
dotBtns.forEach((dot, i) => dot.addEventListener('keydown', e => {
  if (e.key === 'ArrowRight') dotBtns[(i + 1) % SLIDE_COUNT].focus();
  if (e.key === 'ArrowLeft')  dotBtns[(i - 1 + SLIDE_COUNT) % SLIDE_COUNT].focus();
}));

/* Свайп на тач-екранах */
let touchStartX = 0;
sliderTrack.addEventListener('touchstart', e => {
  touchStartX = e.touches[0].clientX;
}, { passive: true });
sliderTrack.addEventListener('touchend', e => {
  const swipeDelta = e.changedTouches[0].clientX - touchStartX;
  if (Math.abs(swipeDelta) > 50) {
    stopAutoplay();
    showSlide(activeIndex + (swipeDelta < 0 ? 1 : -1));
  }
});

/* Пауза автогри при наведенні / фокусі клавіатури */
sliderWrap.addEventListener('mouseenter', stopAutoplay);
sliderWrap.addEventListener('mouseleave', startAutoplay);
sliderWrap.addEventListener('focusin',    stopAutoplay);
sliderWrap.addEventListener('focusout',   startAutoplay);

// Автогра вмикається лише якщо користувач не вимкнув анімації
if (!matchMedia('(prefers-reduced-motion: reduce)').matches) startAutoplay();

/* ─── Smooth scroll для кнопки «Дослідити GX» ────────────────────────── */
byId('explore-btn').addEventListener('click', () => {
  byId('slides').scrollIntoView({ behavior: 'smooth' });
});
