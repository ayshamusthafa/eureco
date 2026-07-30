/* ============================================================
   EURECO PORTFOLIO — INTERACTIONS & ANIMATIONS
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ============================================================
  // PRELOADER PROGRESS
  // ============================================================
  const preloader = document.getElementById('preloader');
  const preloaderBarFill = document.getElementById('preloaderBarFill');
  const preloaderPercent = document.getElementById('preloaderPercent');
  
  let currentProgress = 0;
  
  // Disable body scrolling during load
  document.body.style.overflow = 'hidden';
  
  const progressInterval = setInterval(() => {
    if (currentProgress < 90) {
      const increment = Math.floor(Math.random() * 8) + 1;
      currentProgress = Math.min(currentProgress + increment, 90);
      updatePreloader(currentProgress);
    }
  }, 100);
  
  function updatePreloader(value) {
    if (preloaderBarFill) preloaderBarFill.style.width = `${value}%`;
    if (preloaderPercent) preloaderPercent.textContent = `${value}%`;
  }
  
  window.addEventListener('load', () => {
    clearInterval(progressInterval);
    
    const finalInterval = setInterval(() => {
      if (currentProgress < 100) {
        currentProgress += 5;
        updatePreloader(Math.min(currentProgress, 100));
      } else {
        clearInterval(finalInterval);
        setTimeout(hidePreloader, 400);
      }
    }, 30);
  });
  
  // Safety fallback
  setTimeout(() => {
    clearInterval(progressInterval);
    hidePreloader();
  }, 3500);
  
  function hidePreloader() {
    if (preloader && !preloader.classList.contains('fade-out')) {
      preloader.classList.add('fade-out');
      document.body.classList.add('loaded');
      document.body.style.overflow = '';
    }
  }

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

  // Save Contact Form Submission into localStorage for Admin Panel
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

      // Save submission entry to localStorage
      try {
        const raw = localStorage.getItem('eureco_contact_submissions');
        const submissions = raw ? JSON.parse(raw) : [];
        submissions.unshift({
          date: new Date().toLocaleString(),
          name: name,
          email: email,
          service: selectedServices.join(', '),
          message: `Inquiry for ${selectedServices.join(', ')}`
        });
        localStorage.setItem('eureco_contact_submissions', JSON.stringify(submissions));
      } catch(e) {
        console.error('Error saving submission:', e);
      }

      // Success animation
      submitBtn.textContent = 'SENT ✓';
      submitBtn.style.background = '#3D6CAE';
      submitBtn.style.borderColor = '#3D6CAE';
      submitBtn.style.color = '#FFFFFF';
    });
  }

  // ============================================================
  // DYNAMIC CMS SITE DATA HYDRATOR
  // ============================================================
  function applyDynamicSiteData() {
    const raw = localStorage.getItem('eureco_site_data');
    if (!raw) return;
    try {
      const data = JSON.parse(raw);

      // Title & Favicon
      if (data.siteTitle) document.title = data.siteTitle;
      if (data.faviconUrl) {
        let fav = document.querySelector('link[rel="icon"]');
        if (!fav) {
          fav = document.createElement('link');
          fav.rel = 'icon';
          document.head.appendChild(fav);
        }
        fav.href = data.faviconUrl;
      }

      // Hidden Containers (Hero, Services, Projects, Awards, Contact, Footer)
      if (data.hiddenContainers) {
        const secs = {
          hero: document.getElementById('hero'),
          services: document.getElementById('services'),
          projects: document.getElementById('projects'),
          awards: document.getElementById('awards'),
          contact: document.getElementById('contact'),
          footer: document.querySelector('.footer')
        };
        Object.keys(data.hiddenContainers).forEach(key => {
          if (secs[key]) {
            secs[key].style.display = data.hiddenContainers[key] ? 'none' : '';
          }
        });
      }

      // Hero Lines
      if (data.hero) {
        const l1 = document.querySelector('.hero-line--creative');
        const l2 = document.querySelector('.hero-line--digital');
        const l3 = document.querySelector('.hero-line--agency');
        const img3d = document.querySelector('.hero-3d-image img');
        const tag = document.querySelector('.hero-tagline p');

        if (l1 && data.hero.line1) l1.textContent = data.hero.line1;
        if (l2 && data.hero.line2) l2.textContent = data.hero.line2;
        if (l3 && data.hero.line3) l3.textContent = data.hero.line3;
        if (img3d && data.hero.image3d) img3d.src = data.hero.image3d;
        if (tag && data.hero.tagline) tag.textContent = data.hero.tagline;
      }

      // Services List
      if (data.services && Array.isArray(data.services) && data.services.length > 0) {
        const container = document.querySelector('.services .container');
        if (container) {
          const existingRows = container.querySelectorAll('.service-row');
          existingRows.forEach(r => r.remove());

          data.services.forEach((s, idx) => {
            const row = document.createElement('div');
            row.className = `service-row reveal-left delay-${(idx % 3) + 1}`;
            const tagsHtml = s.tags.split(',').map(t => `<span class="service-tag">${t.trim()}</span>`).join('');
            row.innerHTML = `
              <div class="service-row-num">${s.num}</div>
              <div class="service-row-title">${s.title}</div>
              <div class="service-row-tags">${tagsHtml}</div>
            `;
            container.appendChild(row);
          });
        }
      }

      // Projects Grid
      if (data.projects && Array.isArray(data.projects) && data.projects.length > 0) {
        const grid = document.querySelector('.projects-content');
        if (grid) {
          const existingCards = grid.querySelectorAll('.project-card');
          existingCards.forEach(c => c.remove());

          data.projects.forEach((p, idx) => {
            const card = document.createElement('div');
            card.className = `project-card reveal-right delay-${(idx % 3) + 1}`;
            card.innerHTML = `
              <div class="project-card-image">
                <img src="${p.image}" alt="${p.title}">
              </div>
              <div class="project-card-info">
                <h4 class="project-card-title">${p.title}</h4>
                <p class="project-card-desc">${p.category}</p>
              </div>
            `;
            grid.appendChild(card);
          });
        }
      }

      // Awards Table
      if (data.awards && Array.isArray(data.awards) && data.awards.length > 0) {
        const table = document.querySelector('.awards-table');
        if (table) {
          const existingRows = table.querySelectorAll('.award-row');
          existingRows.forEach(r => r.remove());

          data.awards.forEach((a, idx) => {
            const row = document.createElement('div');
            row.className = `award-row ${idx === 1 ? 'highlighted' : ''} reveal-right delay-${(idx % 3) + 1}`;
            row.innerHTML = `
              <div class="award-row-num">${a.num}</div>
              <div class="award-row-name">${a.name}</div>
              <div class="award-row-project">${a.project}</div>
              <div class="award-row-year">${a.year}</div>
            `;
            table.appendChild(row);
          });
        }
      }

    } catch(e) {
      console.error('Error applying dynamic site data:', e);
    }
  }

  applyDynamicSiteData();

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
