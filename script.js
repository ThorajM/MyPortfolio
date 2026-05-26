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

  /* === CUSTOM CURSOR === */
  const cursor = document.getElementById('cursor');
  const cursorFollower = document.getElementById('cursorFollower');
  let mouseX = 0, mouseY = 0, followerX = 0, followerY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (cursor) {
      cursor.style.left = mouseX + 'px';
      cursor.style.top = mouseY + 'px';
    }
  });

  function animateCursor() {
    followerX += (mouseX - followerX) * 0.08;
    followerY += (mouseY - followerY) * 0.08;
    if (cursorFollower) {
      cursorFollower.style.left = followerX + 'px';
      cursorFollower.style.top = followerY + 'px';
    }
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

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

  /* === HOVER EFFECT ON PROJECT CARDS === */
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 8;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * -8;
      card.style.transform = `translateY(-6px) rotateX(${y}deg) rotateY(${x}deg)`;
      card.style.transformOrigin = 'center center';
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  /* === CURSOR SCALE ON INTERACTIVE ELEMENTS === */
  document.querySelectorAll('a, button, .project-card, .cert-card, .stat-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      if (cursor) cursor.style.transform = 'translate(-50%, -50%) scale(2.5)';
      if (cursorFollower) { cursorFollower.style.opacity = '0.1'; cursorFollower.style.transform = 'translate(-50%, -50%) scale(1.5)'; }
    });
    el.addEventListener('mouseleave', () => {
      if (cursor) cursor.style.transform = 'translate(-50%, -50%) scale(1)';
      if (cursorFollower) { cursorFollower.style.opacity = '0.4'; cursorFollower.style.transform = 'translate(-50%, -50%) scale(1)'; }
    });
  });

  console.log('%c🚀 Thoraj Mamidala Portfolio', 'color: #6366f1; font-size: 1.2rem; font-weight: bold;');
  console.log('%cData Engineer · Builder · Problem Solver', 'color: #94a3b8;');
})();
