/**
 * Ch. Vignesh - Portfolio Script
 * 1. Full Navbar in Intro -> Scrolled Oval Pill Dock Only (Beside Theme Toggle)
 * 2. Bi-directional Reversible Scroll Animations (Slide In & Slide Out)
 * 3. Left Side Corner Vertical Capsule (VIGNESH PORTFOLIO Marquee)
 * 4. Vanta.js 3D Dots Background (Theme Synced)
 * 5. Custom Dual-Circle Cursor with Pinpoint Hover
 * 6. Individual Letter Heading Magnification
 */

(function () {
  'use strict';

  /* =========================================================
     1. THEME SWITCHER & VANTA.JS BACKGROUND INTEGRATION
     ========================================================= */
  const themeToggleCorner = document.getElementById('theme-toggle');
  const themeToggleNavbar = document.getElementById('navbar-theme-toggle');
  const htmlRoot = document.documentElement;

  const savedTheme = localStorage.getItem('theme') || 'dark';
  htmlRoot.setAttribute('data-theme', savedTheme);

  let vantaEffect = null;

  function initVantaBackground(theme) {
    if (!window.VANTA || !window.VANTA.DOTS) return;

    const isDark = theme === 'dark';

    const vantaConfig = isDark
      ? {
          el: "#vanta-bg",
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.0,
          minWidth: 200.0,
          scale: 1.0,
          scaleMobile: 1.0,
          color: 0xf9ff15,
          color2: 0xf2bfbf,
          backgroundColor: 0x101a10,
          size: 4.3,
          spacing: 26.0,
          showLines: false
        }
      : {
          el: "#vanta-bg",
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.0,
          minWidth: 200.0,
          scale: 1.0,
          scaleMobile: 1.0,
          color: 0xb30000,
          color2: 0xff0808,
          backgroundColor: 0xffffff,
          size: 4.3,
          spacing: 26.0,
          showLines: false
        };

    try {
      if (vantaEffect) {
        vantaEffect.destroy();
      }
      vantaEffect = window.VANTA.DOTS(vantaConfig);
    } catch (e) {
      console.warn('Vanta initialization notice:', e);
    }
  }

  // Initialize Vanta
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initVantaBackground(savedTheme);
    });
  } else {
    initVantaBackground(savedTheme);
  }

  function toggleTheme() {
    const currentTheme = htmlRoot.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    htmlRoot.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    initVantaBackground(newTheme);
  }

  if (themeToggleCorner) themeToggleCorner.addEventListener('click', toggleTheme);
  if (themeToggleNavbar) themeToggleNavbar.addEventListener('click', toggleTheme);

  /* =========================================================
     2. DYNAMIC SCROLL CONTROLS:
     - Full Navbar shown at top in Intro page
     - On scroll: Full Navbar hides, Top-Right Oval Pill Dock appears
     - Vertical capsule scrolls inside
     ========================================================= */
  const fullNavbar = document.getElementById('full-navbar');
  const topRightControls = document.getElementById('top-right-controls');
  const pillText = document.getElementById('pill-text');

  const trackedSections = [
    { id: 'home', title: 'Home' },
    { id: 'education', title: 'Education' },
    { id: 'skills', title: 'Skills' },
    { id: 'projects', title: 'Projects' },
    { id: 'certifications', title: 'Certifications' },
    { id: 'contact', title: 'Contact' }
  ];

  function handlePageScroll() {
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    const viewportHeight = window.innerHeight;
    const viewCenter = scrollY + viewportHeight * 0.42;

    // Full Navbar in Intro vs Scrolled Oval Pill Dock
    if (scrollY > 75) {
      if (fullNavbar) fullNavbar.classList.add('navbar-hidden');
      if (topRightControls) topRightControls.classList.add('controls-visible');
    } else {
      if (fullNavbar) fullNavbar.classList.remove('navbar-hidden');
      if (topRightControls) topRightControls.classList.remove('controls-visible');
    }

    // Dynamic Section Status in Pill Dock (Education, Education — Skills, etc.)
    const sectionMetrics = trackedSections.map((sec) => {
      const el = document.getElementById(sec.id);
      if (!el) return { id: sec.id, title: sec.title, top: 0, bottom: 0, height: 0 };
      const rect = el.getBoundingClientRect();
      const top = rect.top + scrollY;
      return {
        id: sec.id,
        title: sec.title,
        top: top,
        bottom: top + rect.height,
        height: rect.height
      };
    });

    let activeDisplay = 'Home';

    for (let i = 0; i < sectionMetrics.length; i++) {
      const current = sectionMetrics[i];
      const next = sectionMetrics[i + 1];

      if (viewCenter >= current.top && viewCenter <= current.bottom) {
        if (next && viewCenter > current.bottom - current.height * 0.28) {
          activeDisplay = `${current.title} &mdash; ${next.title}`;
        } else {
          activeDisplay = current.title;
        }
        break;
      } else if (next && viewCenter > current.bottom && viewCenter < next.top) {
        activeDisplay = `${current.title} &mdash; ${next.title}`;
        break;
      }
    }

    if (window.innerHeight + scrollY >= document.body.offsetHeight - 80) {
      activeDisplay = 'Contact';
    }

    if (pillText && pillText.innerHTML !== activeDisplay) {
      pillText.style.opacity = '0';
      setTimeout(() => {
        pillText.innerHTML = activeDisplay;
        pillText.style.opacity = '1';
      }, 100);
    }
  }

  window.addEventListener('scroll', handlePageScroll, { passive: true });
  handlePageScroll();

  /* =========================================================
     3. BI-DIRECTIONAL SMOOTH SCROLL ANIMATIONS (IN & OUT)
     Reversible on Scroll Up and Scroll Down
     ========================================================= */
  function setupBiDirectionalScrollAnimations() {
    const revealSections = document.querySelectorAll('.reveal-section');

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
            } else {
              entry.target.classList.remove('is-visible');
            }
          });
        },
        {
          threshold: 0.14,
          rootMargin: '0px 0px -40px 0px'
        }
      );

      revealSections.forEach((sec) => observer.observe(sec));
    } else {
      revealSections.forEach((sec) => sec.classList.add('is-visible'));
    }
  }

  setupBiDirectionalScrollAnimations();

  /* =========================================================
     4. DUAL-CIRCLE CUSTOM CURSOR (Ultra-Small Pinpoint Hover)
     ========================================================= */
  const cursorOuter = document.getElementById('cursor-outer');
  const cursorInner = document.getElementById('cursor-inner');
  const ambientGlow = document.getElementById('cursor-ambient-glow');

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let outerX = mouseX;
  let outerY = mouseY;
  let isMouseInWindow = false;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (!isMouseInWindow) {
      isMouseInWindow = true;
      cursorOuter.style.opacity = '1';
      cursorInner.style.opacity = '1';
      if (ambientGlow) ambientGlow.style.opacity = '1';
    }

    cursorInner.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;

    if (ambientGlow) {
      ambientGlow.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
    }
  });

  function animateCursor() {
    outerX += (mouseX - outerX) * 0.18;
    outerY += (mouseY - outerY) * 0.18;

    cursorOuter.style.transform = `translate(${outerX}px, ${outerY}px) translate(-50%, -50%)`;
    requestAnimationFrame(animateCursor);
  }
  requestAnimationFrame(animateCursor);

  document.addEventListener('mouseleave', () => {
    isMouseInWindow = false;
    cursorOuter.style.opacity = '0';
    cursorInner.style.opacity = '0';
    if (ambientGlow) ambientGlow.style.opacity = '0';
  });

  document.addEventListener('mouseenter', () => {
    isMouseInWindow = true;
    cursorOuter.style.opacity = '1';
    cursorInner.style.opacity = '1';
    if (ambientGlow) ambientGlow.style.opacity = '1';
  });

  function attachCursorHover() {
    const interactiveTargets = document.querySelectorAll(
      'a, button, .magnetic-target, .card, .tag, .mag-char, input, textarea, .contact-ref-card'
    );

    interactiveTargets.forEach((target) => {
      target.addEventListener('mouseenter', () => {
        document.body.classList.add('cursor-hover');
      });
      target.addEventListener('mouseleave', () => {
        document.body.classList.remove('cursor-hover');
      });
    });
  }

  /* =========================================================
     5. HEADING HOVER INDIVIDUAL LETTER MAGNIFICATION
     ========================================================= */
  function setupLetterMagnification() {
    const headingElements = document.querySelectorAll('.magnify-heading');

    headingElements.forEach((heading) => {
      if (heading.querySelector('.mag-char')) return;

      const words = heading.textContent.trim().split(/\s+/);
      heading.innerHTML = '';

      words.forEach((word, wordIdx) => {
        const wordSpan = document.createElement('span');
        wordSpan.className = 'mag-word';

        const chars = Array.from(word);
        chars.forEach((char) => {
          const charSpan = document.createElement('span');
          charSpan.className = 'mag-char';
          charSpan.textContent = char;
          wordSpan.appendChild(charSpan);
        });

        heading.appendChild(wordSpan);

        if (wordIdx < words.length - 1) {
          heading.appendChild(document.createTextNode(' '));
        }
      });
    });
  }

  setupLetterMagnification();
  attachCursorHover();
})();
