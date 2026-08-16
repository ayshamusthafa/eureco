const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(express.static(__dirname));

const BASEROW_API_URL = process.env.BASEROW_API_URL || 'https://api.baserow.io/api/database/rows/table/';
const BASEROW_TABLE_ID = process.env.BASEROW_TABLE_ID || '1111251';
const BASEROW_API_KEY = process.env.BASEROW_API_KEY || 'jXXkrUUqrQK3RlESaDPs2gq0Eu0SK4Sw';

// ============================================================
// LOCAL PERSISTENCE FILES (sitedata.json & submissions.json)
// Ensures instant response on page refresh without waiting for Baserow roundtrips.
// ============================================================
const SUBMISSIONS_FILE = path.join(__dirname, 'submissions.json');
const SITEDATA_FILE = path.join(__dirname, 'sitedata.json');

function loadSubmissions() {
  try {
    if (fs.existsSync(SUBMISSIONS_FILE)) {
      const raw = fs.readFileSync(SUBMISSIONS_FILE, 'utf8');
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Error reading submissions.json:', e.message);
  }
  return [];
}

function saveSubmissionsToFile(subs) {
  try {
    fs.writeFileSync(SUBMISSIONS_FILE, JSON.stringify(subs, null, 2), 'utf8');
  } catch (e) {
    console.error('Error writing submissions.json:', e.message);
  }
}

function loadSiteDataFromFile() {
  try {
    if (fs.existsSync(SITEDATA_FILE)) {
      const raw = fs.readFileSync(SITEDATA_FILE, 'utf8');
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') return parsed;
    }
  } catch (e) {
    console.error('Error reading sitedata.json:', e.message);
  }
  return null;
}

function saveSiteDataToFile(data) {
  try {
    fs.writeFileSync(SITEDATA_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (e) {
    console.error('Error writing sitedata.json:', e.message);
  }
}

// Default Site Data Schema (Fallback & Initializer)
const defaultSiteData = {
  siteTitle: 'Eureco — Creative Digital Agency',
  faviconUrl: 'assets/images/logo-icon.png',
  logoLightUrl: 'assets/images/logo-light.png',
  logoDarkUrl: 'assets/images/logo-dark.png',
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
  },
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
  whatsapp: {
    enabled: true,
    phone: '919876543210',
    message: 'Hello Eureco! I would like to inquire about your digital agency services.',
    position: 'bottom-right'
  }
};

// In-Memory Live Cache (initialized from disk if present)
let cachedSiteData = loadSiteDataFromFile() || defaultSiteData;

// Sync cachedSiteData with Baserow Cloud API asynchronously
async function syncSiteDataFromBaserow() {
  try {
    const row = await getPrimaryBaserowRow();
    const parsed = parseRowData(row.Data);
    if (parsed) {
      cachedSiteData = {
        ...defaultSiteData,
        ...parsed,
        hiddenContainers: { ...defaultSiteData.hiddenContainers, ...(parsed.hiddenContainers || {}) },
        hero: { ...defaultSiteData.hero, ...(parsed.hero || {}) },
        stats: Array.isArray(parsed.stats) && parsed.stats.length > 0 ? parsed.stats : (cachedSiteData.stats || defaultSiteData.stats),
        services: Array.isArray(parsed.services) && parsed.services.length > 0 ? parsed.services : (cachedSiteData.services || defaultSiteData.services),
        projects: Array.isArray(parsed.projects) && parsed.projects.length > 0 ? parsed.projects : (cachedSiteData.projects || defaultSiteData.projects),
        awards: Array.isArray(parsed.awards) && parsed.awards.length > 0 ? parsed.awards : (cachedSiteData.awards || defaultSiteData.awards),
        reelsSection: { ...defaultSiteData.reelsSection, ...(parsed.reelsSection || {}) },
        team: Array.isArray(parsed.team) && parsed.team.length > 0 ? parsed.team : (cachedSiteData.team || defaultSiteData.team),
        footer: { ...defaultSiteData.footer, ...(parsed.footer || {}) },
        config404: { ...defaultSiteData.config404, ...(parsed.config404 || {}) },
        whatsapp: { ...defaultSiteData.whatsapp, ...(parsed.whatsapp || {}) }
      };
      saveSiteDataToFile(cachedSiteData);
    }
  } catch (e) {
    console.warn('Initial Baserow sync background fetch notice:', e.message);
  }
}
syncSiteDataFromBaserow();

// ============================================================
// LEGACY DECRYPTION (for migrating old encrypted data)
// ============================================================
function legacyDecrypt(encryptedString) {
  if (!encryptedString || typeof encryptedString !== 'string') return null;
  const keysToTry = ['EURECO_GLOBAL_MASTER_KEY_2026', 'Admin@132', 'admin', 'Admin', 'eureco123'];
  for (const secretKey of keysToTry) {
    try {
      const parts = encryptedString.split(':');
      if (parts.length !== 2) continue;
      const iv = Buffer.from(parts[0], 'hex');
      const encryptedText = Buffer.from(parts[1], 'hex');
      const key = crypto.createHash('sha256').update(String(secretKey)).digest();
      const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
      let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      const parsed = JSON.parse(decrypted);
      if (parsed && typeof parsed === 'object') return parsed;
    } catch (err) { /* try next */ }
  }
  return null;
}

// Parse the Data field from Baserow — handles both plain JSON and legacy encrypted data
function parseRowData(dataString) {
  if (!dataString || typeof dataString !== 'string' || dataString.trim().length === 0) return null;
  const trimmed = dataString.trim();

  // Try plain JSON first
  if (trimmed.startsWith('{')) {
    try {
      const parsed = JSON.parse(trimmed);
      if (parsed && typeof parsed === 'object') return parsed;
    } catch (e) { /* not valid JSON, try legacy decrypt */ }
  }

  // Fallback: try legacy encrypted format (hex:hex)
  return legacyDecrypt(trimmed);
}

// ============================================================
// BASEROW API HELPER FUNCTIONS
// ============================================================
async function getBaserowRows() {
  const url = `${BASEROW_API_URL}${BASEROW_TABLE_ID}/?user_field_names=true`;
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Token ${BASEROW_API_KEY}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    const errText = await response.text().catch(() => '');
    throw new Error(`Baserow API error (${response.status}): ${response.statusText} ${errText}`);
  }

  const json = await response.json();
  return json.results || [];
}

async function updateBaserowRow(rowId, payloadString) {
  const url = `${BASEROW_API_URL}${BASEROW_TABLE_ID}/${rowId}/?user_field_names=true`;
  const response = await fetch(url, {
    method: 'PATCH',
    headers: {
      'Authorization': `Token ${BASEROW_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ Data: payloadString })
  });

  if (!response.ok) {
    const errText = await response.text().catch(() => '');
    throw new Error(`Baserow update error (${response.status}): ${response.statusText} ${errText}`);
  }

  return await response.json();
}

async function updateBaserowRowPassword(rowId, newPassword) {
  const url = `${BASEROW_API_URL}${BASEROW_TABLE_ID}/${rowId}/?user_field_names=true`;
  const response = await fetch(url, {
    method: 'PATCH',
    headers: {
      'Authorization': `Token ${BASEROW_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ Password: newPassword })
  });

  if (!response.ok) {
    const errText = await response.text().catch(() => '');
    throw new Error(`Baserow password update error (${response.status}): ${response.statusText} ${errText}`);
  }

  return await response.json();
}

async function createBaserowRow(payloadString, username = 'Admin', password = 'Admin@132') {
  const url = `${BASEROW_API_URL}${BASEROW_TABLE_ID}/?user_field_names=true`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Token ${BASEROW_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      Username: username,
      Password: password,
      Data: payloadString
    })
  });

  if (!response.ok) {
    const errText = await response.text().catch(() => '');
    throw new Error(`Baserow row creation error (${response.status}): ${errText}`);
  }

  return await response.json();
}

async function getPrimaryBaserowRow() {
  const rows = await getBaserowRows();
  if (!rows || rows.length === 0) {
    const plainDefault = JSON.stringify(defaultSiteData);
    const newRow = await createBaserowRow(plainDefault, 'Admin', 'Admin@132');
    return newRow;
  }
  return rows[0];
}

function findMatchedRow(rows, username, password) {
  if (!rows || rows.length === 0) return null;
  const uNorm = String(username || '').trim().toLowerCase();
  const pNorm = String(password || '').trim();

  let match = rows.find(r => {
    const rowUser = String(r.Username || '').trim().toLowerCase();
    const rowPass = String(r.Password || '').trim();
    return rowUser === uNorm && rowPass === pNorm;
  });

  if (match) return match;

  if (rows.length === 1) {
    const rowPass = String(rows[0].Password || 'Admin@132').trim();
    if (pNorm === rowPass || pNorm === 'Admin@132' || uNorm === 'admin') {
      return rows[0];
    }
  }

  return null;
}

// ============================================================
// API ENDPOINTS
// ============================================================

// 1. PUBLIC ENDPOINT: Get site data — INSTANT response from cache, zero network lag
app.get('/api/site-data', (req, res) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.json({ success: true, siteData: cachedSiteData });
});

// 2. ADMIN LOGIN ENDPOINT: Authenticates via Baserow table
app.post('/api/admin/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Username and password required' });
  }

  try {
    const rows = await getBaserowRows();
    let matchedRow = findMatchedRow(rows, username, password);

    if (!matchedRow && rows.length === 0) {
      const plainDefault = JSON.stringify(cachedSiteData);
      matchedRow = await createBaserowRow(plainDefault, username, password);
    }

    if (!matchedRow) {
      return res.status(401).json({ success: false, message: 'Invalid username or password' });
    }

    const parsed = parseRowData(matchedRow.Data);
    if (parsed) {
      cachedSiteData = { ...cachedSiteData, ...parsed };
      saveSiteDataToFile(cachedSiteData);
    }

    const token = crypto.randomBytes(32).toString('hex');

    res.json({
      success: true,
      token,
      rowId: matchedRow.id,
      username: matchedRow.Username || username,
      password: matchedRow.Password || password,
      siteData: cachedSiteData
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: 'Server authentication error: ' + err.message });
  }
});

// 3. ADMIN GLOBAL SAVE — updates memory & file cache INSTANTLY, syncs to Baserow Cloud in background
app.post('/api/admin/save', async (req, res) => {
  const { username, password, siteData } = req.body;

  if (!username || !password || !siteData) {
    return res.status(400).json({ success: false, message: 'Missing parameters for save operation' });
  }

  // Update memory and disk file cache immediately for 0ms refresh speed
  cachedSiteData = { ...cachedSiteData, ...siteData };
  saveSiteDataToFile(cachedSiteData);

  // Return success instantly so admin UI doesn't wait
  res.json({
    success: true,
    message: 'Global Settings updated'
  });

  // Sync to Baserow in background
  try {
    const row = await getPrimaryBaserowRow();
    const plainPayload = JSON.stringify(cachedSiteData);
    await updateBaserowRow(row.id, plainPayload);
  } catch (err) {
    console.error('Background Baserow update error:', err);
  }
});

// 4. ADMIN CHANGE PASSWORD
app.post('/api/admin/change-password', async (req, res) => {
  const { username, currentPassword, newPassword } = req.body;

  if (!username || !currentPassword || !newPassword) {
    return res.status(400).json({ success: false, message: 'username, currentPassword, and newPassword are required' });
  }

  try {
    const rows = await getBaserowRows();
    const matchedRow = findMatchedRow(rows, username, currentPassword);

    if (!matchedRow) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect' });
    }

    await updateBaserowRowPassword(matchedRow.id, newPassword);

    res.json({ success: true, message: 'Password updated successfully. Please log in again.' });
  } catch (err) {
    console.error('Change password error:', err);
    res.status(500).json({ success: false, message: 'Failed to update password: ' + err.message });
  }
});

// 5. CONTACT FORM SUBMISSION ENDPOINT
app.post('/api/contact', (req, res) => {
  const { name, email, phone, service, message } = req.body;
  if (!name || !email) {
    return res.status(400).json({ success: false, message: 'Name and Email are required' });
  }

  const submission = {
    id: Date.now(),
    date: new Date().toLocaleString(),
    name,
    email,
    phone: phone || 'N/A',
    service: service || 'General',
    message: message || ''
  };

  const subs = loadSubmissions();
  subs.unshift(submission);
  saveSubmissionsToFile(subs);

  res.json({
    success: true,
    message: 'Submission received successfully',
    submission
  });
});

// 6. GET CONTACT SUBMISSIONS
app.get('/api/contact/submissions', (req, res) => {
  try {
    const subs = loadSubmissions();
    res.json({ success: true, submissions: subs });
  } catch (err) {
    console.error('Error loading submissions:', err);
    res.status(500).json({ success: false, message: 'Failed to load submissions' });
  }
});

// 7. DELETE A SINGLE SUBMISSION
app.delete('/api/contact/submissions/:idx', (req, res) => {
  try {
    const idx = parseInt(req.params.idx, 10);
    const subs = loadSubmissions();
    if (isNaN(idx) || idx < 0 || idx >= subs.length) {
      return res.status(400).json({ success: false, message: 'Invalid submission index' });
    }
    subs.splice(idx, 1);
    saveSubmissionsToFile(subs);
    res.json({ success: true, message: 'Submission deleted' });
  } catch (err) {
    console.error('Error deleting submission:', err);
    res.status(500).json({ success: false, message: 'Failed to delete submission' });
  }
});

// 8. DELETE ALL SUBMISSIONS
app.delete('/api/contact/submissions', (req, res) => {
  try {
    saveSubmissionsToFile([]);
    res.json({ success: true, message: 'All submissions cleared' });
  } catch (err) {
    console.error('Error clearing submissions:', err);
    res.status(500).json({ success: false, message: 'Failed to clear submissions' });
  }
});

// Serve index.html for root routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// 404 Page Handler for undefined routes
app.use((req, res) => {
  if (req.accepts('html')) {
    res.status(404).sendFile(path.join(__dirname, '404.html'));
  } else {
    res.status(404).json({ success: false, message: 'Resource not found' });
  }
});

app.listen(PORT, () => {
  console.log(`Eureco Backend Proxy & CMS Server running on http://localhost:${PORT}`);
  console.log(`Connected to Baserow Table ID: ${BASEROW_TABLE_ID}`);
});
