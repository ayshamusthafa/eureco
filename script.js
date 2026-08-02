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
  const phoneField = document.getElementById('phoneField');
  const phoneBtn = document.getElementById('phoneBtn');
  const phoneInput = document.getElementById('phoneInput');
  const servicesField = document.getElementById('servicesField');
  const submitRow = document.getElementById('submitRow');
  const submitBtn = document.getElementById('submitBtn');

  function enableField(field) {
    if (!field) return;
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
        enableField(phoneField);
      } else {
        emailInput.style.borderBottom = '2px solid #e74c3c';
        emailInput.focus();
        setTimeout(() => emailInput.style.borderBottom = '', 2000);
      }
    });
  }

  if (phoneBtn) {
    phoneBtn.addEventListener('click', () => {
      if (phoneInput.value.trim()) {
        phoneBtn.textContent = '✓';
        phoneBtn.style.background = '#3D6CAE';
        phoneBtn.style.color = '#FFFFFF';
        enableField(servicesField);
        enableField(submitRow);
      } else {
        phoneInput.style.borderBottom = '2px solid #e74c3c';
        phoneInput.focus();
        setTimeout(() => phoneInput.style.borderBottom = '', 2000);
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
  if (phoneInput) {
    phoneInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') phoneBtn.click();
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
      const phone = phoneInput ? phoneInput.value.trim() : '';
      const selectedServices = Array.from(document.querySelectorAll('.form-service-tag.active'))
        .map(tag => tag.textContent);
      
      if (!name || !email || selectedServices.length === 0) {
        submitBtn.textContent = 'FILL ALL FIELDS';
        submitBtn.style.borderColor = '#e74c3c';
        submitBtn.style.color = '#e74c3c';
        setTimeout(() => {
          submitBtn.textContent = 'SEND ENQUIRY';
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
          phone: phone || 'N/A',
          service: selectedServices.join(', '),
          message: `Phone: ${phone || 'N/A'} | Inquiry for ${selectedServices.join(', ')}`
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

      // Logos (Light & Dark)
      if (data.logoLightUrl) {
        const logoLights = document.querySelectorAll('.logo-light');
        logoLights.forEach(img => img.src = data.logoLightUrl);
      }
      if (data.logoDarkUrl) {
        const logoDarks = document.querySelectorAll('.logo-dark');
        logoDarks.forEach(img => img.src = data.logoDarkUrl);
      }

      // Stats Counters
      if (data.stats && Array.isArray(data.stats)) {
        const statItems = document.querySelectorAll('.stat-item');
        data.stats.forEach((st, idx) => {
          if (statItems[idx]) {
            const numEl = statItems[idx].querySelector('.stat-number');
            const labelEl = statItems[idx].querySelector('.stat-label');
            if (numEl && st.number) {
              const match = st.number.match(/^(\d+)(.*)$/);
              if (match) {
                numEl.setAttribute('data-target', match[1]);
                numEl.setAttribute('data-suffix', match[2]);
              }
              numEl.textContent = st.number;
            }
            if (labelEl && st.label) labelEl.textContent = st.label;
          }
        });
      }

      // Hidden Containers & Synchronized Navigation Links (Hero, Services, Projects, Awards, Contact, Footer)
      if (data.hiddenContainers) {
        const secs = {
          hero: document.getElementById('hero'),
          services: document.getElementById('services'),
          projects: document.getElementById('projects'),
          awards: document.getElementById('awards'),
          team: document.getElementById('team'),
          contact: document.getElementById('contact'),
          footer: document.querySelector('.footer')
        };

        const navMap = {
          hero: ['a[href="#hero"]', 'a[href="#top"]'],
          services: ['a[href="#services"]'],
          projects: ['a[href="#projects"]'],
          awards: ['a[href="#awards"]'],
          team: ['a[href="#team"]'],
          contact: ['a[href="#contact"]']
        };

        Object.keys(data.hiddenContainers).forEach(key => {
          const isHidden = data.hiddenContainers[key];

          // Hide/Show main layout section
          if (secs[key]) {
            secs[key].style.display = isHidden ? 'none' : '';
          }

          // Hide/Show matching navigation links in mobile menu & footer
          if (navMap[key]) {
            navMap[key].forEach(selector => {
              const links = document.querySelectorAll(selector);
              links.forEach(link => {
                link.style.display = isHidden ? 'none' : '';
              });
            });
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
            row.className = `service-row reveal-left delay-${(idx % 3) + 1} revealed`;
            const tagsHtml = s.tags.split(',').map(t => `<span class="service-tag">${t.trim()}</span>`).join('');
            row.innerHTML = `
              <div class="service-row-num">${s.num}</div>
              <div class="service-row-title">${s.title}</div>
              <div class="service-row-tags">${tagsHtml}</div>
            `;
            container.appendChild(row);
          });

          // Re-bind hover logic for newly generated service rows
          const newRows = container.querySelectorAll('.service-row');
          newRows.forEach(row => {
            row.addEventListener('mouseenter', () => {
              newRows.forEach(r => {
                if (r !== row) {
                  const title = r.querySelector('.service-row-title');
                  if (title) title.style.opacity = '0.3';
                }
              });
            });
            row.addEventListener('mouseleave', () => {
              newRows.forEach(r => {
                const title = r.querySelector('.service-row-title');
                if (title) title.style.opacity = '';
              });
            });
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
            card.className = `project-card reveal-right delay-${(idx % 3) + 1} revealed`;
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
            row.className = `award-row ${idx === 1 ? 'highlighted' : ''} reveal-right delay-${(idx % 3) + 1} revealed`;
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

      // Footer Content & Social Links Hydrator
      if (data.footer) {
        const fEmail = document.querySelector('.footer-email');
        const fCopy = document.querySelector('.footer-copyright');
        const fBrand = document.querySelector('.footer-brand-text');

        if (fEmail && data.footer.email) {
          fEmail.textContent = data.footer.email;
          fEmail.href = `mailto:${data.footer.email}`;
        }
        if (fCopy && data.footer.copyright) fCopy.textContent = data.footer.copyright;
        if (fBrand && data.footer.brandText) fBrand.textContent = data.footer.brandText;

        if (data.footer.socials && Array.isArray(data.footer.socials)) {
          const fLinksContainer = document.querySelector('.footer-links');
          if (fLinksContainer) {
            const extLinks = fLinksContainer.querySelectorAll('a[target="_blank"]');
            extLinks.forEach(el => el.remove());

            data.footer.socials.forEach(soc => {
              if (soc.name && soc.url) {
                const a = document.createElement('a');
                a.href = soc.url;
                a.target = '_blank';
                a.className = 'footer-link';
                a.textContent = soc.name;
                fLinksContainer.appendChild(a);
              }
            });
          }
        }
      }

      // Team Carousel
      if (data.team && Array.isArray(data.team) && data.team.length > 0) {
        renderTeamCarousel(data.team);
        const countEl = document.getElementById('teamMemberCount');
        if (countEl) countEl.textContent = data.team.length + ' MEMBERS';
      }

      // 404 / Maintenance Mode Fullscreen Overlay
      let overlay404 = document.getElementById('maintenanceOverlay404');
      if (data.config404 && data.config404.enabled) {
        if (!overlay404) {
          overlay404 = document.createElement('div');
          overlay404.id = 'maintenanceOverlay404';
          overlay404.className = 'maintenance-overlay-404';
          overlay404.innerHTML = `
            <div class="maintenance-content">
              <div class="maintenance-code">404</div>
              <h2 class="maintenance-title">Site Under Maintenance</h2>
              <p class="maintenance-msg" id="maintenanceCustomMsg">${data.config404.customMessage || 'Page Not Found — Eureco Digital Agency'}</p>
            </div>
          `;
          document.body.appendChild(overlay404);
        } else {
          overlay404.style.display = 'flex';
          const msgEl = document.getElementById('maintenanceCustomMsg');
          if (msgEl && data.config404.customMessage) {
            msgEl.textContent = data.config404.customMessage;
          }
        }
        document.body.style.overflow = 'hidden';
      } else {
        if (overlay404) {
          overlay404.style.display = 'none';
          document.body.style.overflow = '';
        }
      }

    } catch(e) {
      console.error('Error applying dynamic site data:', e);
    }
  }

  // Apply initially and listen for instant live updates across tabs/windows
  applyDynamicSiteData();

  window.addEventListener('storage', () => {
    applyDynamicSiteData();
  });

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

  // ============================================================
  // TEAM 3D CAROUSEL ENGINE
  // ============================================================
  let teamCarouselAngle = 0;
  let teamCarouselRadius = 350;
  let teamIsDragging = false;
  let teamDragStartX = 0;
  let teamDragAngle = 0;
  let teamVelocity = 0;
  let teamAnimFrame = null;
  let teamIsAutoSpinning = true;

  function renderTeamCarousel(team) {
    const carousel = document.getElementById('teamCarousel');
    const scene = document.getElementById('teamCarouselScene');
    if (!carousel || !scene) return;

    // Clear existing cards
    carousel.innerHTML = '';
    carousel.classList.remove('auto-spin');

    // Calculate responsive radius
    const isMobile = window.innerWidth <= 768;
    const isSmallMobile = window.innerWidth <= 480;
    teamCarouselRadius = isSmallMobile ? 200 : isMobile ? 260 : 350;

    const count = team.length;
    const angleStep = 360 / count;

    team.forEach((member, i) => {
      const card = document.createElement('div');
      card.className = 'team-card';
      card.style.background = member.gradient;
      card.style.transform = `rotateY(${angleStep * i}deg) translateZ(${teamCarouselRadius}px)`;

      let photoHTML = '';
      if (member.image) {
        photoHTML = `
          <img class="team-card-photo" src="${member.image}" alt="${member.name}">
          <div class="team-card-overlay" style="background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%);"></div>
        `;
      } else {
        photoHTML = `
          <div class="team-card-placeholder">
            <span class="team-card-placeholder-initial">${member.name.charAt(0)}</span>
          </div>
          <div class="team-card-overlay" style="background: linear-gradient(to top, rgba(0,0,0,0.35) 0%, transparent 50%);"></div>
        `;
      }

      card.innerHTML = `
        ${photoHTML}
        <div class="team-card-info">
          <div class="team-card-role">${member.role}</div>
          <div class="team-card-name">${member.name}</div>
        </div>
      `;

      carousel.appendChild(card);
    });

    // Set initial rotation
    carousel.style.transform = `rotateY(${teamCarouselAngle}deg)`;

    // Start auto-spin
    teamIsAutoSpinning = true;
    startTeamAutoSpin();

    // Attach interaction handlers
    attachTeamDragHandlers(scene, carousel);
    attachTeamScrollHandler(scene);
  }

  function startTeamAutoSpin() {
    if (teamAnimFrame) cancelAnimationFrame(teamAnimFrame);

    function spin() {
      if (!teamIsAutoSpinning) return;
      teamCarouselAngle += 0.15;
      const carousel = document.getElementById('teamCarousel');
      if (carousel) {
        carousel.style.transform = `rotateY(${teamCarouselAngle}deg)`;
      }
      teamAnimFrame = requestAnimationFrame(spin);
    }
    teamAnimFrame = requestAnimationFrame(spin);
  }

  function stopTeamAutoSpin() {
    teamIsAutoSpinning = false;
    if (teamAnimFrame) {
      cancelAnimationFrame(teamAnimFrame);
      teamAnimFrame = null;
    }
  }

  function startMomentumDecay() {
    if (teamAnimFrame) cancelAnimationFrame(teamAnimFrame);

    function decay() {
      if (Math.abs(teamVelocity) < 0.01) {
        teamVelocity = 0;
        // Resume auto spin after momentum ends
        setTimeout(() => {
          teamIsAutoSpinning = true;
          startTeamAutoSpin();
        }, 2000);
        return;
      }

      teamVelocity *= 0.96; // Friction
      teamCarouselAngle += teamVelocity;
      const carousel = document.getElementById('teamCarousel');
      if (carousel) {
        carousel.style.transform = `rotateY(${teamCarouselAngle}deg)`;
      }
      teamAnimFrame = requestAnimationFrame(decay);
    }
    teamAnimFrame = requestAnimationFrame(decay);
  }

  function attachTeamDragHandlers(scene, carousel) {
    // Mouse events
    scene.addEventListener('mousedown', (e) => {
      e.preventDefault();
      teamIsDragging = true;
      teamDragStartX = e.clientX;
      teamDragAngle = teamCarouselAngle;
      teamVelocity = 0;
      stopTeamAutoSpin();
    });

    document.addEventListener('mousemove', (e) => {
      if (!teamIsDragging) return;
      const deltaX = e.clientX - teamDragStartX;
      teamVelocity = deltaX * 0.05 - (teamCarouselAngle - teamDragAngle - deltaX * 0.3) * 0.01;
      teamCarouselAngle = teamDragAngle + deltaX * 0.3;
      carousel.style.transform = `rotateY(${teamCarouselAngle}deg)`;
    });

    document.addEventListener('mouseup', () => {
      if (teamIsDragging) {
        teamIsDragging = false;
        startMomentumDecay();
      }
    });

    // Touch events
    scene.addEventListener('touchstart', (e) => {
      teamIsDragging = true;
      teamDragStartX = e.touches[0].clientX;
      teamDragAngle = teamCarouselAngle;
      teamVelocity = 0;
      stopTeamAutoSpin();
    }, { passive: true });

    scene.addEventListener('touchmove', (e) => {
      if (!teamIsDragging) return;
      const deltaX = e.touches[0].clientX - teamDragStartX;
      teamVelocity = deltaX * 0.05 - (teamCarouselAngle - teamDragAngle - deltaX * 0.3) * 0.01;
      teamCarouselAngle = teamDragAngle + deltaX * 0.3;
      carousel.style.transform = `rotateY(${teamCarouselAngle}deg)`;
    }, { passive: true });

    scene.addEventListener('touchend', () => {
      if (teamIsDragging) {
        teamIsDragging = false;
        startMomentumDecay();
      }
    });
  }

  function attachTeamScrollHandler(scene) {
    scene.addEventListener('wheel', (e) => {
      e.preventDefault();
      stopTeamAutoSpin();
      teamVelocity += e.deltaY * 0.08;
      teamCarouselAngle += e.deltaY * 0.15;
      const carousel = document.getElementById('teamCarousel');
      if (carousel) {
        carousel.style.transform = `rotateY(${teamCarouselAngle}deg)`;
      }
      startMomentumDecay();
    }, { passive: false });
  }

  // Initial render on page load
  (function initTeamCarousel() {
    const raw = localStorage.getItem('eureco_site_data');
    let data;
    if (raw) {
      try { data = JSON.parse(raw); } catch(e) { data = null; }
    }

    // Seed default team if not present
    if (!data || !data.team || data.team.length === 0) {
      const defaultTeam = [
        { name: 'Nisam VM', role: 'CEO', image: '', gradient: 'linear-gradient(135deg, #FF2E93, #FF0040)' },
        { name: 'Shirin', role: 'SMM Head', image: '', gradient: 'linear-gradient(135deg, #FF6B35, #FF2E93)' },
        { name: 'Fidha Sabrina', role: 'HR', image: '', gradient: 'linear-gradient(135deg, #FF00FF, #FF2E93)' },
        { name: 'Youthika', role: 'Performance', image: '', gradient: 'linear-gradient(135deg, #FF0040, #FF6B35)' },
        { name: 'Thasleem', role: 'Co-Founder', image: '', gradient: 'linear-gradient(135deg, #4A00E0, #7B2FBE)' },
        { name: 'Amal', role: 'Creative Head', image: '', gradient: 'linear-gradient(135deg, #9B30FF, #4A00E0)' },
        { name: 'Rashid', role: 'Developer', image: '', gradient: 'linear-gradient(135deg, #00D2FF, #3D6CAE)' },
        { name: 'Fathima', role: 'Content Lead', image: '', gradient: 'linear-gradient(135deg, #FF8C00, #FFD700)' }
      ];
      if (data) {
        data.team = defaultTeam;
        localStorage.setItem('eureco_site_data', JSON.stringify(data));
      } else {
        data = { team: defaultTeam };
      }
    }

    if (data && data.team && data.team.length > 0) {
      renderTeamCarousel(data.team);
      const countEl = document.getElementById('teamMemberCount');
      if (countEl) countEl.textContent = data.team.length + ' MEMBERS';
    }
  })();

  // Handle window resize for responsive radius
  window.addEventListener('resize', () => {
    const raw = localStorage.getItem('eureco_site_data');
    if (raw) {
      try {
        const data = JSON.parse(raw);
        if (data.team && data.team.length > 0) {
          renderTeamCarousel(data.team);
        }
      } catch(e) {}
    }
  });

});
