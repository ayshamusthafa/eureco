/* ============================================================
   EURECO PORTFOLIO — ADMIN CONTROL PANEL LOGIC
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // Default Site Data Schema
  const defaultSiteData = {
    siteTitle: 'Eureco — Creative Digital Agency',
    faviconUrl: 'assets/images/logo-icon.png',
    logoLightUrl: 'assets/images/logo-light.png',
    logoDarkUrl: 'assets/images/logo-dark.png',
    auth: {
      username: 'admin',
      password: 'eureco123'
    },
    hiddenContainers: {
      hero: false,
      services: false,
      projects: false,
      awards: false,
      contact: false,
      footer: false
    },
    hero: {
      line1: 'CREATIVE',
      line2: 'Digital',
      line3: 'AGENCY',
      image3d: 'assets/images/hero-3d.png',
      tagline: 'Brand with data driven marketing'
    },
    stats: [
      { number: '150+', label: 'success projects' },
      { number: '100+', label: 'product launched' },
      { number: '90+', label: 'startup company' }
    ],
    services: [
      { num: '01', title: 'Social Media Marketing', tags: 'Facebook, Youtube, Instagram' },
      { num: '02', title: 'Branding & Creative Design', tags: 'Logo Design, Brand Identity, Guidelines' },
      { num: '03', title: 'Web Design and Development', tags: 'React, Node.js, WordPress' }
    ],
    projects: [
      { title: 'NovaBrand', category: 'Logo and Branding', image: 'assets/images/project-1.png' },
      { title: 'Artisan Studio', category: 'Logo and Branding', image: 'assets/images/project-2.png' },
      { title: 'Luxe Prints', category: 'Logo and Branding', image: 'assets/images/project-3.png' }
    ],
    awards: [
      { num: '01', name: 'Webby Awards', project: 'Eureco', year: '2025' },
      { num: '02', name: 'Awwwards Site of the Day', project: 'NovaBrand', year: '2024' },
      { num: '03', name: 'FWA of the Day', project: 'Artisan Studio', year: '2024' }
    ],
    config404: {
      enabled: false,
      customMessage: 'Page Not Found — Eureco Digital Agency'
    }
  };

  // Helper functions for localStorage
  function getSiteData() {
    const raw = localStorage.getItem('eureco_site_data');
    if (!raw) {
      localStorage.setItem('eureco_site_data', JSON.stringify(defaultSiteData));
      return defaultSiteData;
    }
    try {
      return { ...defaultSiteData, ...JSON.parse(raw) };
    } catch(e) {
      return defaultSiteData;
    }
  }

  function saveSiteData(data) {
    localStorage.setItem('eureco_site_data', JSON.stringify(data));
    showToast('Changes saved to live site!');
  }

  function getSubmissions() {
    const raw = localStorage.getItem('eureco_contact_submissions');
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch(e) {
      return [];
    }
  }

  function saveSubmissions(subs) {
    localStorage.setItem('eureco_contact_submissions', JSON.stringify(subs));
  }

  // Toast Notification
  function showToast(msg) {
    const toast = document.getElementById('adminToast');
    if (toast) {
      toast.textContent = msg;
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 3000);
    }
  }

  // ============================================================
  // AUTHENTICATION LOGIC
  // ============================================================
  const loginScreen = document.getElementById('loginScreen');
  const loginForm = document.getElementById('loginForm');
  const loginError = document.getElementById('loginError');
  const logoutBtn = document.getElementById('logoutBtn');

  function checkSession() {
    const isLoggedIn = sessionStorage.getItem('eureco_admin_logged_in') === 'true';
    if (isLoggedIn) {
      loginScreen.classList.add('hidden');
    } else {
      loginScreen.classList.remove('hidden');
    }
  }

  checkSession();

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const siteData = getSiteData();
    const u = document.getElementById('loginUsername').value.trim();
    const p = document.getElementById('loginPassword').value.trim();

    if (u === siteData.auth.username && p === siteData.auth.password) {
      sessionStorage.setItem('eureco_admin_logged_in', 'true');
      loginError.style.display = 'none';
      loginScreen.classList.add('hidden');
      initAdminDashboard();
      showToast('Welcome back, Admin!');
    } else {
      loginError.style.display = 'block';
    }
  });

  logoutBtn.addEventListener('click', () => {
    sessionStorage.removeItem('eureco_admin_logged_in');
    loginScreen.classList.remove('hidden');
    showToast('Logged out successfully.');
  });

  // Theme Toggle for Admin
  const adminThemeToggle = document.getElementById('adminThemeToggle');
  const html = document.documentElement;
  const savedTheme = localStorage.getItem('eureco-theme') || 'dark';
  html.setAttribute('data-theme', savedTheme);

  adminThemeToggle.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('eureco-theme', newTheme);
  });

  // ============================================================
  // TAB NAVIGATION
  // ============================================================
  const navItems = document.querySelectorAll('.admin-nav-item');
  const tabContents = document.querySelectorAll('.admin-tab-content');
  const tabHeaderTitle = document.getElementById('tabHeaderTitle');

  const tabTitles = {
    dashboard: 'Dashboard Overview',
    containers: 'Containers & Visibility Control',
    hero: 'Hero & Stats Content Editor',
    services: 'Services Container Manager',
    projects: 'Projects Grid Manager',
    awards: 'Awards Recognition Manager',
    submissions: 'Contact Form Submissions',
    settings: 'Site Branding & 404 Configuration'
  };

  window.switchTab = function(tabId) {
    navItems.forEach(item => {
      if (item.getAttribute('data-tab') === tabId) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    tabContents.forEach(content => {
      if (content.id === `tab-${tabId}`) {
        content.classList.add('active');
      } else {
        content.classList.remove('active');
      }
    });

    if (tabHeaderTitle && tabTitles[tabId]) {
      tabHeaderTitle.textContent = tabTitles[tabId];
    }
  };

  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const tabId = item.getAttribute('data-tab');
      switchTab(tabId);
    });
  });

  // ============================================================
  // DASHBOARD DATA RENDERER & INITIALIZATION
  // ============================================================
  function initAdminDashboard() {
    const siteData = getSiteData();
    const subs = getSubmissions();

    // Render Stats Box
    document.getElementById('dashSubmissionsCount').textContent = subs.length;
    document.getElementById('dashServicesCount').textContent = siteData.services.length;
    document.getElementById('dashProjectsCount').textContent = siteData.projects.length;
    document.getElementById('dash404Status').textContent = siteData.config404.enabled ? 'ON' : 'OFF';

    // Render Container Switches
    document.getElementById('toggleHero').checked = !siteData.hiddenContainers.hero;
    document.getElementById('toggleServices').checked = !siteData.hiddenContainers.services;
    document.getElementById('toggleProjects').checked = !siteData.hiddenContainers.projects;
    document.getElementById('toggleAwards').checked = !siteData.hiddenContainers.awards;
    document.getElementById('toggleContact').checked = !siteData.hiddenContainers.contact;
    document.getElementById('toggleFooter').checked = !siteData.hiddenContainers.footer;

    // Render Hero & Stats Inputs
    document.getElementById('heroLine1').value = siteData.hero.line1;
    document.getElementById('heroLine2').value = siteData.hero.line2;
    document.getElementById('heroLine3').value = siteData.hero.line3;
    document.getElementById('hero3dImage').value = siteData.hero.image3d;
    document.getElementById('heroTagline').value = siteData.hero.tagline;

    if (siteData.stats.length >= 3) {
      document.getElementById('stat1Num').value = siteData.stats[0].number;
      document.getElementById('stat1Label').value = siteData.stats[0].label;
      document.getElementById('stat2Num').value = siteData.stats[1].number;
      document.getElementById('stat2Label').value = siteData.stats[1].label;
      document.getElementById('stat3Num').value = siteData.stats[2].number;
      document.getElementById('stat3Label').value = siteData.stats[2].label;
    }

    // Render Settings & 404
    document.getElementById('siteTitle').value = siteData.siteTitle;
    document.getElementById('faviconUrl').value = siteData.faviconUrl;
    document.getElementById('logoLight').value = siteData.logoLightUrl;
    document.getElementById('logoDark').value = siteData.logoDarkUrl;
    document.getElementById('toggle404').checked = siteData.config404.enabled;
    document.getElementById('custom404Text').value = siteData.config404.customMessage;

    // Render Tables
    renderRecentSubmissions(subs);
    renderAllSubmissionsTable(subs);
    renderServicesTable(siteData.services);
    renderProjectsTable(siteData.projects);
    renderAwardsTable(siteData.awards);
  }

  initAdminDashboard();

  // ============================================================
  // CONTAINERS VISIBILITY TOGGLES
  // ============================================================
  const containerSwitches = document.querySelectorAll('.container-toggle-list input[type="checkbox"]');
  containerSwitches.forEach(sw => {
    sw.addEventListener('change', () => {
      const containerKey = sw.getAttribute('data-container');
      const siteData = getSiteData();
      siteData.hiddenContainers[containerKey] = !sw.checked;
      saveSiteData(siteData);
    });
  });

  // ============================================================
  // HERO & STATS FORM
  // ============================================================
  document.getElementById('heroForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const siteData = getSiteData();
    siteData.hero.line1 = document.getElementById('heroLine1').value.trim();
    siteData.hero.line2 = document.getElementById('heroLine2').value.trim();
    siteData.hero.line3 = document.getElementById('heroLine3').value.trim();
    siteData.hero.image3d = document.getElementById('hero3dImage').value.trim();
    siteData.hero.tagline = document.getElementById('heroTagline').value.trim();
    saveSiteData(siteData);
  });

  document.getElementById('statsForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const siteData = getSiteData();
    siteData.stats = [
      { number: document.getElementById('stat1Num').value.trim(), label: document.getElementById('stat1Label').value.trim() },
      { number: document.getElementById('stat2Num').value.trim(), label: document.getElementById('stat2Label').value.trim() },
      { number: document.getElementById('stat3Num').value.trim(), label: document.getElementById('stat3Label').value.trim() }
    ];
    saveSiteData(siteData);
  });

  // ============================================================
  // SERVICES CRUD
  // ============================================================
  function renderServicesTable(services) {
    const tbody = document.getElementById('servicesTableBody');
    tbody.innerHTML = '';
    services.forEach((s, idx) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${s.num}</strong></td>
        <td>${s.title}</td>
        <td><span style="color: var(--text-muted); font-size: 0.8rem;">${s.tags}</span></td>
        <td>
          <button class="admin-btn" onclick="editService(${idx})">Edit</button>
          <button class="admin-btn admin-btn-danger" onclick="deleteService(${idx})">Delete</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  document.getElementById('serviceForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const idx = parseInt(document.getElementById('serviceEditIndex').value);
    const num = document.getElementById('serviceNum').value.trim();
    const title = document.getElementById('serviceTitle').value.trim();
    const tags = document.getElementById('serviceTags').value.trim();

    const siteData = getSiteData();
    if (idx >= 0) {
      siteData.services[idx] = { num, title, tags };
    } else {
      siteData.services.push({ num, title, tags });
    }
    saveSiteData(siteData);
    resetServiceForm();
    initAdminDashboard();
  });

  window.editService = function(idx) {
    const siteData = getSiteData();
    const s = siteData.services[idx];
    if (!s) return;
    document.getElementById('serviceEditIndex').value = idx;
    document.getElementById('serviceNum').value = s.num;
    document.getElementById('serviceTitle').value = s.title;
    document.getElementById('serviceTags').value = s.tags;
    document.getElementById('saveServiceBtn').textContent = 'Update Service';
    document.getElementById('cancelServiceBtn').style.display = 'inline-block';
    switchTab('services');
  };

  window.deleteService = function(idx) {
    if (!confirm('Are you sure you want to delete this service?')) return;
    const siteData = getSiteData();
    siteData.services.splice(idx, 1);
    saveSiteData(siteData);
    initAdminDashboard();
  };

  window.resetServiceForm = function() {
    document.getElementById('serviceForm').reset();
    document.getElementById('serviceEditIndex').value = -1;
    document.getElementById('saveServiceBtn').textContent = 'Add Service';
    document.getElementById('cancelServiceBtn').style.display = 'none';
  };

  // ============================================================
  // PROJECTS CRUD
  // ============================================================
  function renderProjectsTable(projects) {
    const tbody = document.getElementById('projectsTableBody');
    tbody.innerHTML = '';
    projects.forEach((p, idx) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><img src="${p.image}" alt="${p.title}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 6px;"></td>
        <td><strong>${p.title}</strong></td>
        <td>${p.category}</td>
        <td>
          <button class="admin-btn" onclick="editProject(${idx})">Edit</button>
          <button class="admin-btn admin-btn-danger" onclick="deleteProject(${idx})">Delete</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  document.getElementById('projectForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const idx = parseInt(document.getElementById('projectEditIndex').value);
    const title = document.getElementById('projectTitle').value.trim();
    const category = document.getElementById('projectCategory').value.trim();
    const image = document.getElementById('projectImage').value.trim();

    const siteData = getSiteData();
    if (idx >= 0) {
      siteData.projects[idx] = { title, category, image };
    } else {
      siteData.projects.push({ title, category, image });
    }
    saveSiteData(siteData);
    resetProjectForm();
    initAdminDashboard();
  });

  window.editProject = function(idx) {
    const siteData = getSiteData();
    const p = siteData.projects[idx];
    if (!p) return;
    document.getElementById('projectEditIndex').value = idx;
    document.getElementById('projectTitle').value = p.title;
    document.getElementById('projectCategory').value = p.category;
    document.getElementById('projectImage').value = p.image;
    document.getElementById('saveProjectBtn').textContent = 'Update Project';
    document.getElementById('cancelProjectBtn').style.display = 'inline-block';
    switchTab('projects');
  };

  window.deleteProject = function(idx) {
    if (!confirm('Are you sure you want to delete this project?')) return;
    const siteData = getSiteData();
    siteData.projects.splice(idx, 1);
    saveSiteData(siteData);
    initAdminDashboard();
  };

  window.resetProjectForm = function() {
    document.getElementById('projectForm').reset();
    document.getElementById('projectEditIndex').value = -1;
    document.getElementById('saveProjectBtn').textContent = 'Add Project';
    document.getElementById('cancelProjectBtn').style.display = 'none';
  };

  // ============================================================
  // AWARDS CRUD
  // ============================================================
  function renderAwardsTable(awards) {
    const tbody = document.getElementById('awardsTableBody');
    tbody.innerHTML = '';
    awards.forEach((a, idx) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${a.num}</strong></td>
        <td>${a.name}</td>
        <td>${a.project}</td>
        <td>${a.year}</td>
        <td>
          <button class="admin-btn" onclick="editAward(${idx})">Edit</button>
          <button class="admin-btn admin-btn-danger" onclick="deleteAward(${idx})">Delete</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  document.getElementById('awardForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const idx = parseInt(document.getElementById('awardEditIndex').value);
    const num = document.getElementById('awardNum').value.trim();
    const name = document.getElementById('awardName').value.trim();
    const project = document.getElementById('awardProject').value.trim();
    const year = document.getElementById('awardYear').value.trim();

    const siteData = getSiteData();
    if (idx >= 0) {
      siteData.awards[idx] = { num, name, project, year };
    } else {
      siteData.awards.push({ num, name, project, year });
    }
    saveSiteData(siteData);
    resetAwardForm();
    initAdminDashboard();
  });

  window.editAward = function(idx) {
    const siteData = getSiteData();
    const a = siteData.awards[idx];
    if (!a) return;
    document.getElementById('awardEditIndex').value = idx;
    document.getElementById('awardNum').value = a.num;
    document.getElementById('awardName').value = a.name;
    document.getElementById('awardProject').value = a.project;
    document.getElementById('awardYear').value = a.year;
    document.getElementById('saveAwardBtn').textContent = 'Update Award';
    document.getElementById('cancelAwardBtn').style.display = 'inline-block';
    switchTab('awards');
  };

  window.deleteAward = function(idx) {
    if (!confirm('Are you sure you want to delete this award?')) return;
    const siteData = getSiteData();
    siteData.awards.splice(idx, 1);
    saveSiteData(siteData);
    initAdminDashboard();
  };

  window.resetAwardForm = function() {
    document.getElementById('awardForm').reset();
    document.getElementById('awardEditIndex').value = -1;
    document.getElementById('saveAwardBtn').textContent = 'Add Award';
    document.getElementById('cancelAwardBtn').style.display = 'none';
  };

  // ============================================================
  // FORM SUBMISSIONS VIEWER
  // ============================================================
  function renderRecentSubmissions(subs) {
    const tbody = document.getElementById('recentSubmissionsBody');
    tbody.innerHTML = '';
    if (subs.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: var(--text-muted);">No form submissions recorded yet.</td></tr>';
      return;
    }
    subs.slice(0, 5).forEach(s => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${s.date || 'Just now'}</td>
        <td><strong>${s.name}</strong></td>
        <td>${s.email}</td>
        <td>${s.service || 'General'}</td>
        <td style="max-width: 200px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${s.message}</td>
      `;
      tbody.appendChild(tr);
    });
  }

  function renderAllSubmissionsTable(subs) {
    const tbody = document.getElementById('submissionsTableBody');
    tbody.innerHTML = '';
    if (subs.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: var(--text-muted);">No submissions found. Submit a message on contact form to view data here.</td></tr>';
      return;
    }
    subs.forEach((s, idx) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${s.date || 'N/A'}</td>
        <td><strong>${s.name}</strong></td>
        <td><a href="mailto:${s.email}" style="color: var(--accent);">${s.email}</a></td>
        <td>${s.service || 'General'}</td>
        <td>${s.message}</td>
        <td>
          <button class="admin-btn admin-btn-danger" onclick="deleteSubmission(${idx})">Delete</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  window.deleteSubmission = function(idx) {
    const subs = getSubmissions();
    subs.splice(idx, 1);
    saveSubmissions(subs);
    initAdminDashboard();
    showToast('Submission deleted');
  };

  window.clearAllSubmissions = function() {
    if (!confirm('Are you sure you want to delete ALL contact submissions?')) return;
    saveSubmissions([]);
    initAdminDashboard();
    showToast('All submissions cleared');
  };

  // ============================================================
  // SITE SETTINGS & 404 CONFIG
  // ============================================================
  document.getElementById('settingsForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const siteData = getSiteData();
    siteData.siteTitle = document.getElementById('siteTitle').value.trim();
    siteData.faviconUrl = document.getElementById('faviconUrl').value.trim();
    siteData.logoLightUrl = document.getElementById('logoLight').value.trim();
    siteData.logoDarkUrl = document.getElementById('logoDark').value.trim();
    saveSiteData(siteData);
  });

  window.save404Settings = function() {
    const siteData = getSiteData();
    siteData.config404.enabled = document.getElementById('toggle404').checked;
    siteData.config404.customMessage = document.getElementById('custom404Text').value.trim();
    saveSiteData(siteData);
    document.getElementById('dash404Status').textContent = siteData.config404.enabled ? 'ON' : 'OFF';
  };

  document.getElementById('passwordForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const newP = document.getElementById('newPassword').value.trim();
    if (!newP) return;
    const siteData = getSiteData();
    siteData.auth.password = newP;
    saveSiteData(siteData);
    document.getElementById('newPassword').value = '';
    showToast('Admin password updated successfully');
  });

});
