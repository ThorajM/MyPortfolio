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
    let onInteractive = false;
    let textMode = false;
    const textSel = 'input, textarea, select, [contenteditable="true"], [contenteditable=""]';
    const hoverSel = 'a, button, [role="button"], .btn-primary, .btn-secondary, .nav-link, .nav-contact-btn, .project-card, .social-link, .filter-btn, .cs-btn, .cert-link-btn';

    function setNativeTextMode(enabled) {
      if (enabled === textMode) return;
      textMode = enabled;
      document.body.classList.toggle('cursor-native-text', enabled);
      document.documentElement.style.cursor = enabled ? 'text' : 'none';
      if (enabled) {
        onInteractive = false;
        cursorDot.classList.remove('cursor-hover', 'cursor-press');
        cursorRing.classList.remove('cursor-hover', 'cursor-press');
      }
    }

    function setHover(enabled) {
      if (enabled === onInteractive) return;
      onInteractive = enabled;
      cursorDot.classList.toggle('cursor-hover', enabled);
      cursorRing.classList.toggle('cursor-hover', enabled);
    }

    // Single source of truth: resolve cursor state from the element under the pointer.
    function resolveCursorState(el) {
      if (!el || el.nodeType !== 1 || typeof el.closest !== 'function') {
        setNativeTextMode(false); setHover(false); return;
      }
      if (el.closest(textSel) || el.isContentEditable) {
        setNativeTextMode(true);
        return;
      }
      setNativeTextMode(false);
      setHover(!!el.closest(hoverSel));
    }

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX; mouseY = e.clientY;
      cursorDot.style.left = mouseX + 'px';
      cursorDot.style.top = mouseY + 'px';
      if (!visible) {
        visible = true;
        cursorDot.classList.add('is-active');
        cursorRing.classList.add('is-active');
      }
      resolveCursorState(e.target);
    }, { passive: true });

    document.addEventListener('mouseleave', () => {
      visible = false;
      cursorDot.classList.remove('is-active');
      cursorRing.classList.remove('is-active');
    });

    document.addEventListener('mouseenter', () => {
      if (!textMode) {
        visible = true;
        cursorDot.classList.add('is-active');
        cursorRing.classList.add('is-active');
      }
    });

    // Scrolling changes what's under the cursor WITHOUT firing mouse events,
    // which is what made the cursor vanish near the contact form. Re-check on scroll.
    window.addEventListener('scroll', () => {
      if (!visible) return;
      resolveCursorState(document.elementFromPoint(mouseX, mouseY));
    }, { passive: true });

    // Smooth ring follow
    (function animateRing() {
      const follow = onInteractive ? 0.34 : 0.16;
      ringX += (mouseX - ringX) * follow;
      ringY += (mouseY - ringY) * follow;
      cursorRing.style.left = ringX + 'px';
      cursorRing.style.top = ringY + 'px';
      requestAnimationFrame(animateRing);
    })();

    // Keep native text mode while field is focused (keyboard/mouse)
    document.addEventListener('focusin', (e) => {
      if (e.target.matches(textSel)) setNativeTextMode(true);
    });
    document.addEventListener('focusout', (e) => {
      if (e.target.matches(textSel)) {
        // Re-evaluate based on where the pointer actually is.
        resolveCursorState(document.elementFromPoint(mouseX, mouseY));
      }
    });

    // Click feedback makes button/link interactions feel intentional
    window.addEventListener('mousedown', () => {
      if (textMode) return;
      cursorDot.classList.add('cursor-press');
      cursorRing.classList.add('cursor-press');
    });
    window.addEventListener('mouseup', () => {
      cursorDot.classList.remove('cursor-press');
      cursorRing.classList.remove('cursor-press');
    });
    window.addEventListener('blur', () => {
      setHover(false);
      cursorDot.classList.remove('cursor-hover', 'cursor-press');
      cursorRing.classList.remove('cursor-hover', 'cursor-press');
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

    /* === CTA CARD: pointer spotlight + gentle 3D tilt === */
    const ctaCard = document.querySelector('.cta-card[data-tilt]');
    if (ctaCard) {
      ctaCard.addEventListener('mousemove', (e) => {
        const rect = ctaCard.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        ctaCard.style.setProperty('--mx', x + 'px');
        ctaCard.style.setProperty('--my', y + 'px');
        const rx = (y / rect.height - 0.5) * -4;
        const ry = (x / rect.width - 0.5) * 4;
        ctaCard.style.transform = `perspective(1400px) rotateX(${rx}deg) rotateY(${ry}deg)`;
      });
      ctaCard.addEventListener('mouseleave', () => {
        ctaCard.style.transform = '';
      });
    }

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
    const emphasis = (el.dataset.emphasis || '')
      .split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
    const words = el.textContent.trim().split(/\s+/);
    el.innerHTML = words
      .map(w => {
        const bare = w.toLowerCase().replace(/[^a-z0-9-]/g, '');
        const kw = emphasis.includes(bare) ? ' kw' : '';
        return `<span class="split-line"><span class="split-word${kw}">${w}</span></span>`;
      })
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

  /* === HERO CONSTELLATION CANVAS (performant, pauses off-screen) === */
  (function constellation() {
    const canvas = document.getElementById('constellation');
    if (!canvas || reduceMotion || !finePointer) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    const hero = document.getElementById('home');
    if (!ctx || !hero) return;

    let w = 0, h = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
    let particles = [];
    let running = false, rafId = null;
    const mouse = { x: -9999, y: -9999 };
    const LINK_DIST = 130;

    function resize() {
      const rect = hero.getBoundingClientRect();
      w = canvas.clientWidth || rect.width;
      h = canvas.clientHeight || rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Density scales with area but is capped for performance
      const count = Math.min(90, Math.round((w * h) / 16000));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.6 + 0.6
      }));
    }

    function step() {
      if (!running) return;
      ctx.clearRect(0, 0, w, h);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Gentle cursor repulsion
        const dx = p.x - mouse.x, dy = p.y - mouse.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 120 && dist > 0) {
          const force = (120 - dist) / 120 * 0.6;
          p.x += (dx / dist) * force;
          p.y += (dy / dist) * force;
        }

        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        p.x = Math.max(0, Math.min(w, p.x));
        p.y = Math.max(0, Math.min(h, p.y));

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(169, 192, 255, 0.7)';
        ctx.fill();
      }

      // Link nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i], b = particles[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const d = Math.hypot(dx, dy);
          if (d < LINK_DIST) {
            const alpha = (1 - d / LINK_DIST) * 0.32;
            ctx.strokeStyle = `rgba(91, 140, 255, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      rafId = requestAnimationFrame(step);
    }

    function start() {
      if (running) return;
      running = true;
      step();
    }
    function stop() {
      running = false;
      if (rafId) cancelAnimationFrame(rafId);
      rafId = null;
    }

    hero.addEventListener('mousemove', (e) => {
      const rect = hero.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });
    hero.addEventListener('mouseleave', () => { mouse.x = mouse.y = -9999; });

    window.addEventListener('resize', () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      resize();
    }, { passive: true });

    // Only animate while the hero is on screen
    const vis = new IntersectionObserver((entries) => {
      entries.forEach((entry) => entry.isIntersecting ? start() : stop());
    }, { threshold: 0 });
    vis.observe(hero);

    resize();
    canvas.classList.add('ready');
    start();
  })();

  /* === TYPEWRITER ROTATING ROLES === */
  (function typewriter() {
    const el = document.getElementById('heroTyped');
    if (!el) return;
    const roles = (el.getAttribute('data-roles') || el.textContent).split('|').map(s => s.trim()).filter(Boolean);
    if (reduceMotion || roles.length < 2) { el.textContent = roles[0] || el.textContent; return; }

    let roleIdx = 0, charIdx = roles[0].length, deleting = false;
    el.textContent = roles[0];

    function tick() {
      const current = roles[roleIdx];
      if (!deleting) {
        charIdx++;
        el.textContent = current.slice(0, charIdx);
        if (charIdx >= current.length) {
          deleting = true;
          return setTimeout(tick, 1600);
        }
        return setTimeout(tick, 70);
      } else {
        charIdx--;
        el.textContent = current.slice(0, charIdx);
        if (charIdx <= 0) {
          deleting = false;
          roleIdx = (roleIdx + 1) % roles.length;
          return setTimeout(tick, 300);
        }
        return setTimeout(tick, 35);
      }
    }
    // Begin after the hero reveal settles
    setTimeout(() => { deleting = true; tick(); }, 2600);
  })();

  /* === STAGGERED GRID REVEALS === */
  (function staggerReveals() {
    const grids = document.querySelectorAll('.about-highlights, .about-stats, .services-grid, .projects-grid, .certs-grid, .soft-grid');
    if (!grids.length) return;
    grids.forEach(g => g.classList.add('reveal-stagger'));
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    grids.forEach(g => obs.observe(g));
  })();

  console.log('%cThoraj Mamidala Portfolio', 'color: #ffffff; font-size: 1.2rem; font-weight: bold;');
  console.log('%cData Engineer · Builder · Problem Solver', 'color: #808080;');
})();
