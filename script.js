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
  
  // Team 3D Carousel Engine state variables
  let teamCarouselAngle = 0;
  let teamCarouselRadius = 350;
  let teamIsDragging = false;
  let teamDragStartX = 0;
  let teamDragAngle = 0;
  let teamVelocity = 0;
  let teamAnimFrame = null;
  let teamIsAutoSpinning = true;
  
  // Disable body scrolling during load
  document.body.style.overflow = 'hidden';
  
  let preloaderFinished = false;

  function updatePreloader(value) {
    if (preloaderBarFill) preloaderBarFill.style.width = `${value}%`;
    if (preloaderPercent) preloaderPercent.textContent = `${value}%`;
  }

  function finishPreloader() {
    if (preloaderFinished) return;
    preloaderFinished = true;

    const finishInterval = setInterval(() => {
      if (currentProgress < 100) {
        currentProgress = Math.min(currentProgress + 10, 100);
        updatePreloader(currentProgress);
      } else {
        clearInterval(finishInterval);
        setTimeout(hidePreloader, 350);
      }
    }, 25);
  }

  function hidePreloader() {
    if (preloader && !preloader.classList.contains('fade-out')) {
      preloader.classList.add('fade-out');
      document.body.classList.add('loaded');
      document.body.style.overflow = '';
    }
  }

  // Preloader progress animation while waiting for live site data from Baserow
  const progressInterval = setInterval(() => {
    if (!preloaderFinished && currentProgress < 90) {
      const increment = Math.floor(Math.random() * 8) + 2;
      currentProgress = Math.min(currentProgress + increment, 90);
      updatePreloader(currentProgress);
    }
  }, 80);

  // Fetch live site payload from Baserow API on page start (while loader is active)
  fetch(`/api/site-data?t=${Date.now()}`, { cache: 'no-store' })
    .then(r => r.json())
    .then(res => {
      if (res.success && res.siteData) {
        // Pass data directly to hydrator — no localStorage involved
        applyDynamicSiteData(res.siteData);
        if (res.siteData.reelsSection) renderReelsSection(res.siteData.reelsSection);
        if (res.siteData.team && typeof renderTeamCarousel === 'function') renderTeamCarousel(res.siteData.team);
      }
    })
    .catch(err => console.error('[Eureco] Failed to fetch site data from Baserow API:', err))
    .finally(() => {
      // Data loaded and applied to DOM -> complete preloader smoothly
      clearInterval(progressInterval);
      finishPreloader();
    });

  // ============================================================
  // THEME TOGGLE
  // ============================================================
  const themeToggle = document.getElementById('themeToggle');
  const html = document.documentElement;

  // Load saved theme or default to light
  const savedTheme = localStorage.getItem('eureco-theme') || 'light';
  html.setAttribute('data-theme', savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = html.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', newTheme);
      localStorage.setItem('eureco-theme', newTheme);
    });
  }

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

  if (hamburger && mobileMenu) {
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
  }

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
    const currentStatNumbers = document.querySelectorAll('.stat-number[data-target]');
    currentStatNumbers.forEach(numEl => {
      const targetStr = numEl.getAttribute('data-target');
      const target = parseInt(targetStr, 10);
      const suffix = numEl.getAttribute('data-suffix') || '';
      if (isNaN(target)) {
        numEl.textContent = targetStr || '';
        return;
      }
      const duration = 1200;
      const startTime = performance.now();

      function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
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

  // Submit Contact Form to server API
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

      // Post submission to server API
      fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone: phone || 'N/A',
          service: selectedServices.join(', '),
          message: `Phone: ${phone || 'N/A'} | Inquiry for ${selectedServices.join(', ')}`
        })
      })
      .then(r => r.json())
      .then(res => {
        if (res.success && typeof BroadcastChannel !== 'undefined') {
          try {
            const channel = new BroadcastChannel('eureco_updates');
            channel.postMessage({ type: 'NEW_SUBMISSION', submission: res.submission });
            channel.close();
          } catch(e) {}
        }
      })
      .catch(err => console.error('Contact submission error:', err));

      // Success animation
      submitBtn.textContent = 'SENT ✓';
      submitBtn.style.background = '#3D6CAE';
      submitBtn.style.borderColor = '#3D6CAE';
      submitBtn.style.color = '#FFFFFF';
    });
  }

  // ============================================================
  // LIVE UPDATES LISTENER (No Refresh Needed)
  // ============================================================
  if (typeof BroadcastChannel !== 'undefined') {
    try {
      const eurecoChannel = new BroadcastChannel('eureco_updates');
      eurecoChannel.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'SITE_DATA_UPDATED') {
          fetch(`/api/site-data?t=${Date.now()}`, { cache: 'no-store' })
            .then(r => r.json())
            .then(res => {
              if (res.success && res.siteData) {
                applyDynamicSiteData(res.siteData);
                if (res.siteData.reelsSection) renderReelsSection(res.siteData.reelsSection);
                if (res.siteData.team && typeof renderTeamCarousel === 'function') renderTeamCarousel(res.siteData.team);
              }
            })
            .catch(err => console.error('[Eureco] Live site data sync failed:', err));
        }
      });
    } catch(e) {}
  }

  // ============================================================
  // DYNAMIC CMS SITE DATA HYDRATOR
  // Accepts data directly from the Baserow API fetch response.
  // Does NOT read from localStorage.
  // ============================================================
  function applyDynamicSiteData(data) {
    if (!data || typeof data !== 'object') return;
    try {

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
              } else {
                numEl.setAttribute('data-target', st.number);
                numEl.setAttribute('data-suffix', '');
              }
              numEl.textContent = st.number;
            }
            if (labelEl && st.label) labelEl.textContent = st.label;
          }
        });
        if (statsAnimated) {
          animateCounters();
        }
      }

      // Hidden Containers & Synchronized Navigation Links (Hero, Services, Projects, Awards, Contact, Footer)
      if (data.hiddenContainers) {
        const secs = {
          hero: document.getElementById('hero'),
          services: document.getElementById('services'),
          projects: document.getElementById('projects'),
          awards: document.getElementById('awards'),
          reels: document.getElementById('reels'),
          team: document.getElementById('team'),
          contact: document.getElementById('contact'),
          footer: document.querySelector('.footer')
        };

        const navMap = {
          hero: ['a[href="#hero"]', 'a[href="#top"]'],
          services: ['a[href="#services"]'],
          projects: ['a[href="#projects"]'],
          awards: ['a[href="#awards"]'],
          reels: ['a[href="#reels"]'],
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
            const tagsHtml = (s.tags || '').split(',').map(t => `<span class="service-tag">${t.trim()}</span>`).join('');
            row.innerHTML = `
              <div class="service-row-num">${s.num || ''}</div>
              <div class="service-row-title">${s.title || ''}</div>
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

        // Update hero sidebar services list as well
        const heroServicesBox = document.querySelector('.hero-services');
        if (heroServicesBox) {
          heroServicesBox.innerHTML = '';
          data.services.forEach(s => {
            const item = document.createElement('div');
            item.className = 'hero-service-item';
            item.innerHTML = `
              <span class="hero-service-num">${s.num || ''}</span>
              <span class="hero-service-text">${s.title || ''}</span>
            `;
            heroServicesBox.appendChild(item);
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

      // Floating WhatsApp Action Button Hydrator
      const waBtn = document.getElementById('floatingWhatsapp');
      if (waBtn && data.whatsapp) {
        if (data.whatsapp.enabled === false) {
          waBtn.style.display = 'none';
        } else {
          waBtn.style.display = 'flex';
          const cleanPhone = (data.whatsapp.phone || '919876543210').replace(/[^\d]/g, '');
          const encodedMsg = encodeURIComponent(data.whatsapp.message || '');
          waBtn.href = `https://wa.me/${cleanPhone}${encodedMsg ? '?text=' + encodedMsg : ''}`;
          
          if (data.whatsapp.position === 'bottom-left') {
            waBtn.classList.remove('bottom-right');
            waBtn.classList.add('bottom-left');
          } else {
            waBtn.classList.remove('bottom-left');
            waBtn.classList.add('bottom-right');
          }
        }
      }

    } catch(e) {
      console.error('Error applying dynamic site data:', e);
    }
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
        const navHeight = navbar ? navbar.offsetHeight : 0;
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
      teamCarouselAngle += 0.05;
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
      if (Math.abs(teamVelocity) < 0.005) {
        teamVelocity = 0;
        // Resume auto spin after momentum ends
        setTimeout(() => {
          teamIsAutoSpinning = true;
          startTeamAutoSpin();
        }, 2000);
        return;
      }

      teamVelocity *= 0.95; // Friction
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
      teamVelocity = deltaX * 0.015 - (teamCarouselAngle - teamDragAngle - deltaX * 0.1) * 0.005;
      teamCarouselAngle = teamDragAngle + deltaX * 0.1;
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
      teamVelocity = deltaX * 0.015 - (teamCarouselAngle - teamDragAngle - deltaX * 0.1) * 0.005;
      teamCarouselAngle = teamDragAngle + deltaX * 0.1;
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
      teamVelocity += e.deltaY * 0.015;
      teamCarouselAngle += e.deltaY * 0.025;
      const carousel = document.getElementById('teamCarousel');
      if (carousel) {
        carousel.style.transform = `rotateY(${teamCarouselAngle}deg)`;
      }
      startMomentumDecay();
    }, { passive: false });
  }

  // Team carousel initial render is handled by the Baserow fetch chain above
  // (renderTeamCarousel is called from the fetch .then() block with live data)

  // ============================================================
  // INSTAGRAM REELS SECTION RENDERER
  // ============================================================
  const defaultReelsData = {
    tagline: 'WHOM WE BRANDED',
    titlePrefix: 'HEAR FROM',
    titleHighlight: 'OUR',
    titleSuffix: 'CLIENTS',
    profileUrl: 'https://instagram.com/desgro.media',
    buttonText: 'VIEW MORE ON INSTAGRAM',
    cards: [
      {
        handle: '@DESGRO.MEDIA',
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-man-giving-a-speech-in-a-conference-room-41569-large.mp4',
        posterUrl: '',
        reelUrl: 'https://www.instagram.com/reel/C123456789/',
        quote: 'Desgro brought me to that exact place I envisioned.'
      },
      {
        handle: '@DESGRO.MEDIA',
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-young-woman-talking-on-video-call-with-a-laptop-42861-large.mp4',
        posterUrl: '',
        reelUrl: 'https://www.instagram.com/reel/C987654321/',
        quote: 'I have many friends in the industry who recommended them.'
      },
      {
        handle: '@EURECO.MEDIA',
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-creative-team-working-on-a-project-in-an-office-42866-large.mp4',
        posterUrl: '',
        reelUrl: 'https://www.instagram.com/reel/C555555555/',
        quote: 'Our brand identity completely transformed our audience reach.'
      },
      {
        handle: '@DESGRO.MEDIA',
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-woman-working-on-a-laptop-in-an-office-41566-large.mp4',
        posterUrl: '',
        reelUrl: 'https://www.instagram.com/reel/C777777777/',
        quote: 'Exceptional video quality and marketing execution.'
      }
    ]
  };

  function renderReelsSection(reelsConfig) {
    const track = document.getElementById('reelsTrack');
    const taglineText = document.getElementById('reelsTaglineText');
    const titlePrefix = document.getElementById('reelsTitlePrefix');
    const titleHighlight = document.getElementById('reelsTitleHighlight');
    const titleSuffix = document.getElementById('reelsTitleSuffix');
    const profileBtn = document.getElementById('reelsProfileBtn');
    const btnText = document.getElementById('reelsBtnText');

    if (!track) return;

    const data = { ...defaultReelsData, ...reelsConfig };

    if (taglineText) taglineText.textContent = data.tagline || 'WHOM WE BRANDED';
    if (titlePrefix) titlePrefix.textContent = data.titlePrefix || 'HEAR FROM';
    if (titleHighlight) titleHighlight.textContent = data.titleHighlight || 'OUR';
    if (titleSuffix) titleSuffix.textContent = data.titleSuffix || 'CLIENTS';

    if (profileBtn) {
      profileBtn.href = data.profileUrl || 'https://instagram.com/desgro.media';
    }
    if (btnText) {
      btnText.textContent = data.buttonText || 'VIEW MORE ON INSTAGRAM';
    }

    const cardsList = Array.isArray(data.cards) && data.cards.length > 0 ? data.cards : defaultReelsData.cards;

    // Double cards array for seamless infinite marquee loop
    const displayCards = cardsList.length < 5 ? [...cardsList, ...cardsList, ...cardsList] : [...cardsList, ...cardsList];

    track.innerHTML = '';

    displayCards.forEach((card) => {
      const cardEl = document.createElement('a');
      cardEl.className = 'reel-card';
      cardEl.href = card.reelUrl || data.profileUrl || 'https://instagram.com';
      cardEl.target = '_blank';
      cardEl.setAttribute('aria-label', `Watch reel by ${card.handle || 'Instagram'}`);

      const videoHTML = card.videoUrl
        ? `<video class="reel-card-video" autoplay muted loop playsinline poster="${card.posterUrl || ''}">
            <source src="${card.videoUrl}" type="video/mp4">
           </video>`
        : (card.posterUrl ? `<img src="${card.posterUrl}" class="reel-card-poster" alt="Reel preview">` : `<div class="reel-card-video" style="background:#222;"></div>`);

      cardEl.innerHTML = `
        ${videoHTML}
        <div class="reel-card-overlay"></div>
        <div class="reel-card-handle">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
          </svg>
          <span>${card.handle || '@EURECO.MEDIA'}</span>
        </div>
        <div class="reel-card-badge">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="5 3 19 12 5 21 5 3"/>
          </svg>
        </div>
        ${card.quote ? `<div class="reel-card-quote">${card.quote}</div>` : ''}
      `;

      track.appendChild(cardEl);
    });
  }

  // Reels section initial render is handled by the Baserow fetch chain above
  // (renderReelsSection is called from the fetch .then() block with live data)
  // Render defaults immediately so the section is not empty during fetch
  renderReelsSection(defaultReelsData);

});

