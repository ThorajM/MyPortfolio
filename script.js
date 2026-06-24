/* =====================================================
   THORAJ MAMIDALA — PORTFOLIO SCRIPT
   ===================================================== */

(function () {
  'use strict';

  /* === PRELOADER === */
  window.addEventListener('load', () => {
    setTimeout(() => {
      const preloader = document.getElementById('preloader');
      if (preloader) preloader.classList.add('hidden');
    }, 1800);
  });

  /* === MOTION PREFERENCE === */
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(pointer: fine)').matches;

  /* === HERO SPOTLIGHT (mouse-follow glow) === */
  const heroBg = document.querySelector('.hero-bg');
  const heroSection = document.getElementById('home');

  if (heroBg && heroSection && finePointer && !reduceMotion) {
    let rafId = null;
    heroSection.addEventListener('mousemove', (e) => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        const mx = (e.clientX / window.innerWidth) * 100;
        const my = (e.clientY / window.innerHeight) * 100;
        heroBg.style.setProperty('--mx', mx + '%');
        heroBg.style.setProperty('--my', my + '%');
        rafId = null;
      });
    });
  }

  /* === CUSTOM CURSOR (premium dot + smooth ring) === */
  const cursorDot = document.getElementById('cursor');
  const cursorRing = document.getElementById('cursorFollower');

  if (cursorDot && cursorRing && finePointer && !reduceMotion) {
    document.documentElement.style.cursor = 'none';

    let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
    let ringX = mouseX, ringY = mouseY;
    let visible = false;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX; mouseY = e.clientY;
      cursorDot.style.left = mouseX + 'px';
      cursorDot.style.top = mouseY + 'px';
      if (!visible) {
        visible = true;
        cursorDot.classList.add('is-active');
        cursorRing.classList.add('is-active');
      }
    });

    document.addEventListener('mouseleave', () => {
      visible = false;
      cursorDot.classList.remove('is-active');
      cursorRing.classList.remove('is-active');
    });

    // Smooth ring follow
    (function animateRing() {
      ringX += (mouseX - ringX) * 0.16;
      ringY += (mouseY - ringY) * 0.16;
      cursorRing.style.left = ringX + 'px';
      cursorRing.style.top = ringY + 'px';
      requestAnimationFrame(animateRing);
    })();

    // Grow over interactive elements
    const hoverSel = 'a, button, .btn-primary, .btn-secondary, .nav-link, .nav-contact-btn, input, textarea, .project-card, .social-link, .filter-btn';
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest(hoverSel)) {
        cursorDot.classList.add('cursor-hover');
        cursorRing.classList.add('cursor-hover');
      }
    });
    document.addEventListener('mouseout', (e) => {
      if (e.target.closest(hoverSel)) {
        cursorDot.classList.remove('cursor-hover');
        cursorRing.classList.remove('cursor-hover');
      }
    });
  }

  /* === NAVBAR SCROLL EFFECT === */
  const navbar = document.getElementById('navbar');

  function handleNavbarScroll() {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  handleNavbarScroll();

  /* === MOBILE MENU === */
  const navBurger = document.getElementById('navBurger');
  const mobileMenu = document.getElementById('mobileMenu');

  navBurger?.addEventListener('click', () => {
    navBurger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
    document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
  });

  document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
      navBurger.classList.remove('open');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  /* === ACTIVE NAV LINK === */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + entry.target.id) {
            link.classList.add('active');
          }
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(section => navObserver.observe(section));

  /* === SCROLL REVEAL === */
  const revealEls = document.querySelectorAll('.reveal-up, .reveal-right');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => revealObserver.observe(el));

  /* === COUNTER ANIMATION === */
  function animateCounter(el, target, decimals, duration = 1500) {
    let start = null;
    const startVal = 0;

    function step(timestamp) {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = startVal + (target - startVal) * eased;
      el.textContent = current.toFixed(decimals);
      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  const statNums = document.querySelectorAll('.stat-num');
  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseFloat(el.getAttribute('data-target'));
        const decimals = parseInt(el.getAttribute('data-decimal') || '0');
        animateCounter(el, target, decimals);
        statObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  statNums.forEach(el => statObserver.observe(el));

  /* === SKILL BAR ANIMATION === */
  const skillFills = document.querySelectorAll('.skill-fill');

  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const width = el.getAttribute('data-width');
        setTimeout(() => { el.style.width = width + '%'; }, 200);
        skillObserver.unobserve(el);
      }
    });
  }, { threshold: 0.2 });

  skillFills.forEach(el => skillObserver.observe(el));

  /* === PROJECT FILTER === */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');

      // Update active button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Filter cards with animation
      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.classList.remove('hidden');
          card.style.animation = 'none';
          requestAnimationFrame(() => {
            card.style.animation = '';
          });
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  /* === SMOOTH SCROLL === */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--navbar-h'));
        const top = target.getBoundingClientRect().top + window.scrollY - navH;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* === BACK TO TOP === */
  const backToTop = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  }, { passive: true });

  backToTop?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* === CONTACT FORM === */
  const form = document.getElementById('contactForm');

  form?.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const message = document.getElementById('message');
    const nameErr = document.getElementById('nameErr');
    const emailErr = document.getElementById('emailErr');
    const msgErr = document.getElementById('msgErr');

    let valid = true;

    // Reset
    [nameErr, emailErr, msgErr].forEach(el => { if (el) el.textContent = ''; });
    [name, email, message].forEach(el => { if (el) el.style.borderColor = ''; });

    // Validate name
    if (!name?.value.trim()) {
      if (nameErr) nameErr.textContent = 'Please enter your name.';
      if (name) name.style.borderColor = 'var(--accent-rose)';
      valid = false;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email?.value.trim() || !emailRegex.test(email.value)) {
      if (emailErr) emailErr.textContent = 'Please enter a valid email address.';
      if (email) email.style.borderColor = 'var(--accent-rose)';
      valid = false;
    }

    // Validate message
    if (!message?.value.trim() || message.value.trim().length < 10) {
      if (msgErr) msgErr.textContent = 'Message must be at least 10 characters.';
      if (message) message.style.borderColor = 'var(--accent-rose)';
      valid = false;
    }

    if (valid) {
      const btn = form.querySelector('.btn-submit');
      const original = btn.innerHTML;
      btn.innerHTML = '<span>Message Sent!</span> <i class="fas fa-check"></i>';
      btn.style.background = 'var(--accent-green)';
      btn.disabled = true;

      setTimeout(() => {
        btn.innerHTML = original;
        btn.style.background = '';
        btn.disabled = false;
        form.reset();
      }, 3500);
    }
  });

  /* === HERO REVEAL STAGGER === */
  const heroEls = document.querySelectorAll('.hero .reveal-up, .hero .reveal-right');
  heroEls.forEach((el, i) => {
    el.style.transitionDelay = (i * 0.12) + 's';
    // Trigger after preloader
    setTimeout(() => { el.classList.add('visible'); }, 1900 + i * 120);
  });

  /* === HOVER LIFT ON PROJECT CARDS === */
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-6px)';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  /* === MAGNETIC BUTTONS === */
  if (finePointer && !reduceMotion) {
    document.querySelectorAll('.btn-primary, .btn-secondary, .nav-contact-btn, .back-to-top').forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
      });
    });

    /* === SUBTLE PROFILE TILT === */
    const profile = document.querySelector('.hero-profile');
    const ring = document.querySelector('.profile-ring');
    if (profile && ring) {
      profile.addEventListener('mousemove', (e) => {
        const rect = profile.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        ring.style.transform = `translateY(-6px) rotateX(${py * -8}deg) rotateY(${px * 10}deg)`;
      });
      profile.addEventListener('mouseleave', () => {
        ring.style.transform = '';
      });
    }
  }

  /* === SCROLL PROGRESS BAR === */
  const scrollProgress = document.getElementById('scrollProgress');
  if (scrollProgress) {
    const updateProgress = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      const pct = max > 0 ? doc.scrollTop / max : 0;
      scrollProgress.style.transform = `scaleX(${pct})`;
    };
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress, { passive: true });
    updateProgress();
  }

  /* === CARD SPOTLIGHT + 3D TILT (cursor-driven) === */
  if (finePointer && !reduceMotion) {
    const tiltCards = document.querySelectorAll('.project-card, .cert-card');
    tiltCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const px = (x / rect.width) * 100;
        const py = (y / rect.height) * 100;
        const rx = (y / rect.height - 0.5) * -7;
        const ry = (x / rect.width - 0.5) * 7;
        card.style.setProperty('--px', px + '%');
        card.style.setProperty('--py', py + '%');
        card.style.transform = `translateY(-6px) perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });

    /* === BUTTON GLOSS FOLLOW (--shine-x) === */
    document.querySelectorAll('.btn-primary, .btn-submit, .nav-contact-btn').forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const sx = ((e.clientX - rect.left) / rect.width) * 100;
        btn.style.setProperty('--shine-x', sx + '%');
      });
    });
  }

  /* === SECTION HEADING WORD REVEAL === */
  document.querySelectorAll('[data-split]').forEach(el => {
    const words = el.textContent.trim().split(/\s+/);
    el.innerHTML = words
      .map(w => `<span class="split-line"><span class="split-word">${w}</span></span>`)
      .join(' ');
  });
  const splitObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const words = entry.target.querySelectorAll('.split-word');
        words.forEach((w, i) => {
          setTimeout(() => w.classList.add('in'), i * 90);
        });
        splitObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  document.querySelectorAll('[data-split]').forEach(el => splitObserver.observe(el));

  /* === SUBTLE PARALLAX ON GLOBAL BLOBS === */
  if (!reduceMotion) {
    const blobs = document.querySelectorAll('.fx-blob');
    let blobTicking = false;
    window.addEventListener('scroll', () => {
      if (blobTicking) return;
      blobTicking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        blobs.forEach((b, i) => {
          const speed = (i + 1) * 0.04;
          b.style.translate = `0 ${y * speed}px`;
        });
        blobTicking = false;
      });
    }, { passive: true });
  }

  console.log('%cThoraj Mamidala Portfolio', 'color: #ffffff; font-size: 1.2rem; font-weight: bold;');
  console.log('%cData Engineer · Builder · Problem Solver', 'color: #808080;');
})();
