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
      reels: false,
      team: false,
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
    team: [
      { name: 'Nisam VM', role: 'CEO', image: '', gradient: 'linear-gradient(135deg, #FF2E93, #FF0040)' },
      { name: 'Shirin', role: 'SMM Head', image: '', gradient: 'linear-gradient(135deg, #FF6B35, #FF2E93)' },
      { name: 'Fidha Sabrina', role: 'HR', image: '', gradient: 'linear-gradient(135deg, #FF00FF, #FF2E93)' },
      { name: 'Youthika', role: 'Performance', image: '', gradient: 'linear-gradient(135deg, #FF0040, #FF6B35)' },
      { name: 'Thasleem', role: 'Co-Founder', image: '', gradient: 'linear-gradient(135deg, #4A00E0, #7B2FBE)' },
      { name: 'Amal', role: 'Creative Head', image: '', gradient: 'linear-gradient(135deg, #9B30FF, #4A00E0)' },
      { name: 'Rashid', role: 'Developer', image: '', gradient: 'linear-gradient(135deg, #00D2FF, #3D6CAE)' },
      { name: 'Fathima', role: 'Content Lead', image: '', gradient: 'linear-gradient(135deg, #FF8C00, #FFD700)' }
    ],
    footer: {
      email: 'eureco@mail.com',
      copyright: 'copyright 2025, all reserves.',
      brandText: 'EURECO',
      socials: [
        { name: 'Envato', url: 'https://envato.com' },
        { name: 'Dribbble', url: 'https://dribbble.com' },
        { name: 'Behance', url: 'https://behance.net' }
      ]
    },
    config404: {
      enabled: false,
      customMessage: 'Page Not Found — Eureco Digital Agency'
    },
    reelsSection: {
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
    window.dispatchEvent(new Event('storage'));
    showToast('Changes saved & updated live!');
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
    reels: 'Instagram Reels Container Manager',
    team: 'Team Members Manager',
    submissions: 'Contact Form Submissions',
    footer: 'Footer Content Manager',
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
    document.getElementById('dashTeamCount').textContent = (siteData.team || []).length;
    document.getElementById('dash404Status').textContent = siteData.config404.enabled ? 'ON' : 'OFF';

    // Render Container Switches
    document.getElementById('toggleHero').checked = !siteData.hiddenContainers.hero;
    document.getElementById('toggleServices').checked = !siteData.hiddenContainers.services;
    document.getElementById('toggleProjects').checked = !siteData.hiddenContainers.projects;
    document.getElementById('toggleAwards').checked = !siteData.hiddenContainers.awards;
    const toggleReelsEl = document.getElementById('toggleReels');
    if (toggleReelsEl) toggleReelsEl.checked = !siteData.hiddenContainers.reels;
    document.getElementById('toggleTeam').checked = !siteData.hiddenContainers.team;
    document.getElementById('toggleContact').checked = !siteData.hiddenContainers.contact;
    document.getElementById('toggleFooter').checked = !siteData.hiddenContainers.footer;

    // Render Reels Section Inputs
    if (siteData.reelsSection) {
      const rs = siteData.reelsSection;
      if (document.getElementById('reelsTaglineInput')) document.getElementById('reelsTaglineInput').value = rs.tagline || 'WHOM WE BRANDED';
      if (document.getElementById('reelsTitlePrefixInput')) document.getElementById('reelsTitlePrefixInput').value = rs.titlePrefix || 'HEAR FROM';
      if (document.getElementById('reelsTitleHighlightInput')) document.getElementById('reelsTitleHighlightInput').value = rs.titleHighlight || 'OUR';
      if (document.getElementById('reelsTitleSuffixInput')) document.getElementById('reelsTitleSuffixInput').value = rs.titleSuffix || 'CLIENTS';
      if (document.getElementById('reelsProfileUrlInput')) document.getElementById('reelsProfileUrlInput').value = rs.profileUrl || 'https://instagram.com/desgro.media';
      if (document.getElementById('reelsButtonTextInput')) document.getElementById('reelsButtonTextInput').value = rs.buttonText || 'VIEW MORE ON INSTAGRAM';
    }

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

    // Render Footer Content
    if (siteData.footer) {
      document.getElementById('footerEmail').value = siteData.footer.email || 'eureco@mail.com';
      document.getElementById('footerCopyright').value = siteData.footer.copyright || 'copyright 2025, all reserves.';
      document.getElementById('footerBrandText').value = siteData.footer.brandText || 'EURECO';

      if (siteData.footer.socials && siteData.footer.socials.length >= 3) {
        document.getElementById('social1Name').value = siteData.footer.socials[0].name;
        document.getElementById('social1Url').value = siteData.footer.socials[0].url;
        document.getElementById('social2Name').value = siteData.footer.socials[1].name;
        document.getElementById('social2Url').value = siteData.footer.socials[1].url;
        document.getElementById('social3Name').value = siteData.footer.socials[2].name;
        document.getElementById('social3Url').value = siteData.footer.socials[2].url;
      }
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
    renderTeamTable(siteData.team || []);
    renderReelsTable(siteData.reelsSection ? siteData.reelsSection.cards : []);
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
  // TEAM MEMBERS CRUD
  // ============================================================
  function renderTeamTable(team) {
    const tbody = document.getElementById('teamTableBody');
    if (!tbody) return;
    tbody.innerHTML = '';
    team.forEach((m, idx) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>
          <div style="width:40px;height:40px;border-radius:8px;background:${m.gradient};display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;font-size:0.8rem;">
            ${m.image ? `<img src="${m.image}" style="width:100%;height:100%;object-fit:cover;border-radius:8px;">` : m.name.charAt(0)}
          </div>
        </td>
        <td><strong>${m.name}</strong></td>
        <td>${m.role}</td>
        <td><span style="display:inline-block;width:60px;height:20px;border-radius:4px;background:${m.gradient};"></span></td>
        <td>
          <button class="admin-btn" onclick="editTeamMember(${idx})">Edit</button>
          <button class="admin-btn admin-btn-danger" onclick="deleteTeamMember(${idx})">Delete</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  const teamForm = document.getElementById('teamForm');
  if (teamForm) {
    teamForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const idx = parseInt(document.getElementById('teamEditIndex').value);
      const name = document.getElementById('teamName').value.trim();
      const role = document.getElementById('teamRole').value.trim();
      const image = document.getElementById('teamImage').value.trim();
      const gradient = document.getElementById('teamGradient').value;

      const siteData = getSiteData();
      if (!siteData.team) siteData.team = [];
      if (idx >= 0) {
        siteData.team[idx] = { name, role, image, gradient };
      } else {
        siteData.team.push({ name, role, image, gradient });
      }
      saveSiteData(siteData);
      resetTeamForm();
      initAdminDashboard();
    });
  }

  window.editTeamMember = function(idx) {
    const siteData = getSiteData();
    const m = (siteData.team || [])[idx];
    if (!m) return;
    document.getElementById('teamEditIndex').value = idx;
    document.getElementById('teamName').value = m.name;
    document.getElementById('teamRole').value = m.role;
    document.getElementById('teamImage').value = m.image || '';
    document.getElementById('teamGradient').value = m.gradient;
    document.getElementById('saveTeamBtn').textContent = 'Update Member';
    document.getElementById('cancelTeamBtn').style.display = 'inline-block';
    switchTab('team');
  };

  window.deleteTeamMember = function(idx) {
    if (!confirm('Are you sure you want to remove this team member?')) return;
    const siteData = getSiteData();
    if (!siteData.team) return;
    siteData.team.splice(idx, 1);
    saveSiteData(siteData);
    initAdminDashboard();
  };

  window.resetTeamForm = function() {
    const form = document.getElementById('teamForm');
    if (form) form.reset();
    document.getElementById('teamEditIndex').value = -1;
    const saveBtn = document.getElementById('saveTeamBtn');
    if (saveBtn) saveBtn.textContent = 'Add Member';
    const cancelBtn = document.getElementById('cancelTeamBtn');
    if (cancelBtn) cancelBtn.style.display = 'none';
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
      tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; color: var(--text-muted);">No submissions found. Submit a message on contact form to view data here.</td></tr>';
      return;
    }
    subs.forEach((s, idx) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${s.date || 'N/A'}</td>
        <td><strong>${s.name}</strong></td>
        <td><a href="mailto:${s.email}" style="color: var(--accent);">${s.email}</a></td>
        <td><a href="tel:${s.phone}" style="color: var(--text-primary); font-weight: 500;">${s.phone || 'N/A'}</a></td>
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
  // FOOTER CONTENT FORM
  // ============================================================
  document.getElementById('footerForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const siteData = getSiteData();
    siteData.footer = {
      email: document.getElementById('footerEmail').value.trim(),
      copyright: document.getElementById('footerCopyright').value.trim(),
      brandText: document.getElementById('footerBrandText').value.trim(),
      socials: [
        { name: document.getElementById('social1Name').value.trim(), url: document.getElementById('social1Url').value.trim() },
        { name: document.getElementById('social2Name').value.trim(), url: document.getElementById('social2Url').value.trim() },
        { name: document.getElementById('social3Name').value.trim(), url: document.getElementById('social3Url').value.trim() }
      ]
    };
    saveSiteData(siteData);
  });

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

  const toggle404El = document.getElementById('toggle404');
  if (toggle404El) {
    toggle404El.addEventListener('change', () => {
      save404Settings();
    });
  }

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

  // ============================================================
  // INSTAGRAM REELS MANAGER LOGIC
  // ============================================================
  const reelsHeaderForm = document.getElementById('reelsHeaderForm');
  if (reelsHeaderForm) {
    reelsHeaderForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const siteData = getSiteData();
      if (!siteData.reelsSection) siteData.reelsSection = {};

      siteData.reelsSection.tagline = document.getElementById('reelsTaglineInput').value.trim();
      siteData.reelsSection.titlePrefix = document.getElementById('reelsTitlePrefixInput').value.trim();
      siteData.reelsSection.titleHighlight = document.getElementById('reelsTitleHighlightInput').value.trim();
      siteData.reelsSection.titleSuffix = document.getElementById('reelsTitleSuffixInput').value.trim();
      siteData.reelsSection.profileUrl = document.getElementById('reelsProfileUrlInput').value.trim();
      siteData.reelsSection.buttonText = document.getElementById('reelsButtonTextInput').value.trim();

      saveSiteData(siteData);
    });
  }

  function renderReelsTable(cards) {
    const tbody = document.getElementById('reelsTableBody');
    if (!tbody) return;
    tbody.innerHTML = '';
    if (!cards || cards.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; color: var(--text-muted);">No Reel cards added yet. Add one above!</td></tr>';
      return;
    }

    cards.forEach((c, idx) => {
      const tr = document.createElement('tr');
      const mediaPreview = c.videoUrl
        ? `<video src="${c.videoUrl}" style="width:50px; height:70px; object-fit:cover; border-radius:6px;" muted loop playsinline></video>`
        : (c.posterUrl ? `<img src="${c.posterUrl}" style="width:50px; height:70px; object-fit:cover; border-radius:6px;">` : `<span style="font-size:0.75rem; color:var(--text-muted);">No media</span>`);

      tr.innerHTML = `
        <td><strong>${c.handle}</strong></td>
        <td>${mediaPreview}</td>
        <td><a href="${c.reelUrl}" target="_blank" style="color: var(--accent); font-size: 0.8rem;">${c.reelUrl} ↗</a></td>
        <td><span style="font-size:0.8rem; color: var(--text-muted);">${c.quote || 'N/A'}</span></td>
        <td>
          <button class="admin-btn" onclick="editReelCard(${idx})">Edit</button>
          <button class="admin-btn admin-btn-danger" onclick="deleteReelCard(${idx})">Delete</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  const reelCardForm = document.getElementById('reelCardForm');
  if (reelCardForm) {
    reelCardForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const idx = parseInt(document.getElementById('reelEditIndex').value);
      const handle = document.getElementById('reelHandleInput').value.trim();
      const reelUrl = document.getElementById('reelUrlInput').value.trim();
      const videoUrl = document.getElementById('reelVideoUrlInput').value.trim();
      const posterUrl = document.getElementById('reelPosterUrlInput').value.trim();
      const quote = document.getElementById('reelQuoteInput').value.trim();

      const siteData = getSiteData();
      if (!siteData.reelsSection) siteData.reelsSection = { cards: [] };
      if (!Array.isArray(siteData.reelsSection.cards)) siteData.reelsSection.cards = [];

      const newCard = { handle, reelUrl, videoUrl, posterUrl, quote };

      if (idx >= 0 && idx < siteData.reelsSection.cards.length) {
        siteData.reelsSection.cards[idx] = newCard;
      } else {
        siteData.reelsSection.cards.push(newCard);
      }

      saveSiteData(siteData);
      resetReelForm();
      initAdminDashboard();
    });
  }

  window.editReelCard = function(idx) {
    const siteData = getSiteData();
    if (!siteData.reelsSection || !siteData.reelsSection.cards[idx]) return;
    const c = siteData.reelsSection.cards[idx];

    document.getElementById('reelEditIndex').value = idx;
    document.getElementById('reelHandleInput').value = c.handle || '';
    document.getElementById('reelUrlInput').value = c.reelUrl || '';
    document.getElementById('reelVideoUrlInput').value = c.videoUrl || '';
    document.getElementById('reelPosterUrlInput').value = c.posterUrl || '';
    document.getElementById('reelQuoteInput').value = c.quote || '';

    document.getElementById('saveReelBtn').textContent = 'Update Reel Card';
    document.getElementById('cancelReelBtn').style.display = 'inline-block';
    switchTab('reels');
  };

  window.deleteReelCard = function(idx) {
    if (!confirm('Are you sure you want to delete this Reel card?')) return;
    const siteData = getSiteData();
    if (siteData.reelsSection && Array.isArray(siteData.reelsSection.cards)) {
      siteData.reelsSection.cards.splice(idx, 1);
      saveSiteData(siteData);
      initAdminDashboard();
    }
  };

  window.resetReelForm = function() {
    if (document.getElementById('reelCardForm')) document.getElementById('reelCardForm').reset();
    document.getElementById('reelEditIndex').value = -1;
    document.getElementById('saveReelBtn').textContent = 'Add Reel Card';
    document.getElementById('cancelReelBtn').style.display = 'none';
  };

});
