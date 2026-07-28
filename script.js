/* ============================================================
   EURECO PORTFOLIO — INTERACTIONS & ANIMATIONS
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ============================================================
  // THEME TOGGLE
  // ============================================================
  const themeToggle = document.getElementById('themeToggle');
  const html = document.documentElement;

  // Load saved theme or default to dark
  const savedTheme = localStorage.getItem('eureco-theme') || 'dark';
  html.setAttribute('data-theme', savedTheme);

  themeToggle.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('eureco-theme', newTheme);
  });

  // ============================================================
  // NAVBAR SCROLL EFFECT
  // ============================================================
  const navbar = document.getElementById('navbar');
  let lastScrollY = 0;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    lastScrollY = scrollY;
  }, { passive: true });

  // ============================================================
  // HAMBURGER MENU
  // ============================================================
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const menuLinks = mobileMenu.querySelectorAll('.menu-link');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('open');
    document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
  });

  menuLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // ============================================================
  // SCROLL REVEAL (Intersection Observer)
  // ============================================================
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        // Optionally unobserve after reveal
        // revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ============================================================
  // STATS COUNTER ANIMATION
  // ============================================================
  const statNumbers = document.querySelectorAll('.stat-number[data-target]');
  let statsAnimated = false;

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !statsAnimated) {
        statsAnimated = true;
        animateCounters();
      }
    });
  }, { threshold: 0.5 });

  const statsBar = document.querySelector('.stats-bar');
  if (statsBar) {
    statsObserver.observe(statsBar);
  }

  function animateCounters() {
    statNumbers.forEach(numEl => {
      const target = parseInt(numEl.getAttribute('data-target'));
      const suffix = numEl.getAttribute('data-suffix') || '';
      const duration = 2000;
      const startTime = performance.now();

      function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Ease-out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(eased * target);
        
        numEl.textContent = current + suffix;
        
        if (progress < 1) {
          requestAnimationFrame(update);
        }
      }
      
      requestAnimationFrame(update);
    });
  }

  // ============================================================
  // PARALLAX — Background text in Projects section
  // ============================================================
  const bgTextLeft = document.getElementById('projectsBgLeft');
  const bgTextRight = document.getElementById('projectsBgRight');
  const projectsSection = document.getElementById('projects');

  if (bgTextLeft && bgTextRight && projectsSection) {
    window.addEventListener('scroll', () => {
      const rect = projectsSection.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      if (rect.top < windowHeight && rect.bottom > 0) {
        const progress = (windowHeight - rect.top) / (windowHeight + rect.height);
        const offset = (progress - 0.5) * 100;
        
        bgTextLeft.style.transform = `translateX(${offset * 0.5}px)`;
        bgTextRight.style.transform = `translateX(${-offset * 0.5}px)`;
      }
    }, { passive: true });
  }

  // ============================================================
  // CONTACT FORM — Progressive Reveal
  // ============================================================
  const startBtn = document.getElementById('startBtn');
  const nameField = document.getElementById('nameField');
  const nameBtn = document.getElementById('nameBtn');
  const nameInput = document.getElementById('nameInput');
  const emailField = document.getElementById('emailField');
  const emailBtn = document.getElementById('emailBtn');
  const emailInput = document.getElementById('emailInput');
  const servicesField = document.getElementById('servicesField');
  const submitRow = document.getElementById('submitRow');
  const submitBtn = document.getElementById('submitBtn');

  function enableField(field) {
    field.style.opacity = '1';
    field.style.pointerEvents = 'all';
    const input = field.querySelector('input');
    if (input) {
      setTimeout(() => input.focus(), 300);
    }
  }

  if (startBtn) {
    startBtn.addEventListener('click', () => {
      startBtn.textContent = '✓';
      startBtn.style.background = '#3D6CAE';
      startBtn.style.color = '#FFFFFF';
      enableField(nameField);
    });
  }

  if (nameBtn) {
    nameBtn.addEventListener('click', () => {
      if (nameInput.value.trim()) {
        nameBtn.textContent = '✓';
        nameBtn.style.background = '#3D6CAE';
        nameBtn.style.color = '#FFFFFF';
        enableField(emailField);
      } else {
        nameInput.style.borderBottom = '2px solid #e74c3c';
        nameInput.focus();
        setTimeout(() => nameInput.style.borderBottom = '', 2000);
      }
    });
  }

  if (emailBtn) {
    emailBtn.addEventListener('click', () => {
      if (emailInput.value.trim() && emailInput.value.includes('@')) {
        emailBtn.textContent = '✓';
        emailBtn.style.background = '#3D6CAE';
        emailBtn.style.color = '#FFFFFF';
        enableField(servicesField);
        enableField(submitRow);
      } else {
        emailInput.style.borderBottom = '2px solid #e74c3c';
        emailInput.focus();
        setTimeout(() => emailInput.style.borderBottom = '', 2000);
      }
    });
  }

  // Also support Enter key in inputs
  if (nameInput) {
    nameInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') nameBtn.click();
    });
  }
  if (emailInput) {
    emailInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') emailBtn.click();
    });
  }

  // Service Tag Selection
  const serviceTags = document.querySelectorAll('.form-service-tag');
  serviceTags.forEach(tag => {
    tag.addEventListener('click', () => {
      tag.classList.toggle('active');
    });
  });

  // Submit button
  if (submitBtn) {
    submitBtn.addEventListener('click', () => {
      const name = nameInput ? nameInput.value.trim() : '';
      const email = emailInput ? emailInput.value.trim() : '';
      const selectedServices = Array.from(document.querySelectorAll('.form-service-tag.active'))
        .map(tag => tag.textContent);
      
      if (!name || !email || selectedServices.length === 0) {
        submitBtn.textContent = 'FILL ALL FIELDS';
        submitBtn.style.borderColor = '#e74c3c';
        submitBtn.style.color = '#e74c3c';
        setTimeout(() => {
          submitBtn.textContent = 'GET STARTED';
          submitBtn.style.borderColor = '';
          submitBtn.style.color = '';
        }, 2000);
        return;
      }

      // Success animation
      submitBtn.textContent = 'SENT ✓';
      submitBtn.style.background = '#3D6CAE';
      submitBtn.style.borderColor = '#3D6CAE';
      submitBtn.style.color = '#FFFFFF';
    });
  }

  // ============================================================
  // SMOOTH SCROLL for anchor links
  // ============================================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        const navHeight = navbar.offsetHeight;
        const targetPosition = targetElement.offsetTop - navHeight;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ============================================================
  // SERVICE ROW HOVER — show image on hover (desktop)
  // ============================================================
  const serviceRows = document.querySelectorAll('.service-row');
  serviceRows.forEach(row => {
    row.addEventListener('mouseenter', () => {
      serviceRows.forEach(r => {
        if (r !== row) {
          r.querySelector('.service-row-title').style.opacity = '0.3';
        }
      });
    });
    row.addEventListener('mouseleave', () => {
      serviceRows.forEach(r => {
        r.querySelector('.service-row-title').style.opacity = '';
      });
    });
  });

  // ============================================================
  // AWARD ROW HOVER — highlight effect
  // ============================================================
  const awardRows = document.querySelectorAll('.award-row:not(.highlighted)');
  awardRows.forEach(row => {
    row.addEventListener('mouseenter', () => {
      row.style.transform = 'translateX(8px)';
    });
    row.addEventListener('mouseleave', () => {
      row.style.transform = '';
    });
  });

  // ============================================================
  // CURSOR GLOW EFFECT (desktop only)
  // ============================================================
  if (window.innerWidth > 1024) {
    const glow = document.createElement('div');
    glow.style.cssText = `
      position: fixed;
      width: 300px;
      height: 300px;
      border-radius: 50%;
      pointer-events: none;
      z-index: 9999;
      opacity: 0.04;
      transition: opacity 0.3s ease;
      mix-blend-mode: screen;
      background: radial-gradient(circle, var(--accent) 0%, transparent 70%);
      transform: translate(-50%, -50%);
    `;
    document.body.appendChild(glow);

    document.addEventListener('mousemove', (e) => {
      glow.style.left = e.clientX + 'px';
      glow.style.top = e.clientY + 'px';
    });
  }

});
