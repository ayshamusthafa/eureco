const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const path = require('path');
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

// In-memory submissions cache for server persistence
let localContactSubmissions = [];

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
  }
};

// ============================================================
// LEGACY DECRYPTION (for migrating old encrypted data)
// If old encrypted data exists in Baserow, this will read it once
// and the next save will store it as plain JSON.
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
    // Store plain JSON — no encryption
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

// 1. PUBLIC ENDPOINT: Get site data for preloader/hydration
app.get('/api/site-data', async (req, res) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  try {
    const row = await getPrimaryBaserowRow();
    const parsed = parseRowData(row.Data);
    if (parsed) {
      const mergedData = {
        ...defaultSiteData,
        ...parsed,
        hiddenContainers: { ...defaultSiteData.hiddenContainers, ...(parsed.hiddenContainers || {}) },
        hero: { ...defaultSiteData.hero, ...(parsed.hero || {}) },
        footer: { ...defaultSiteData.footer, ...(parsed.footer || {}) },
        reelsSection: { ...defaultSiteData.reelsSection, ...(parsed.reelsSection || {}) },
        config404: { ...defaultSiteData.config404, ...(parsed.config404 || {}) }
      };
      return res.json({ success: true, siteData: mergedData });
    }

    return res.json({ success: true, siteData: defaultSiteData });
  } catch (err) {
    console.error('Error fetching site data:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch site data from Baserow', siteData: defaultSiteData });
  }
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
      const plainDefault = JSON.stringify(defaultSiteData);
      matchedRow = await createBaserowRow(plainDefault, username, password);
    }

    if (!matchedRow) {
      return res.status(401).json({ success: false, message: 'Invalid username or password' });
    }

    let siteData = defaultSiteData;
    const parsed = parseRowData(matchedRow.Data);
    if (parsed) {
      siteData = parsed;
    } else if (matchedRow.id) {
      // Initialize row with plain JSON default
      await updateBaserowRow(matchedRow.id, JSON.stringify(defaultSiteData));
    }

    const token = crypto.randomBytes(32).toString('hex');

    res.json({
      success: true,
      token,
      username: matchedRow.Username || username,
      password: matchedRow.Password || password,
      siteData
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: 'Server authentication error: ' + err.message });
  }
});

// 3. ADMIN GLOBAL SAVE — stores plain JSON to Baserow (no encryption)
app.post('/api/admin/save', async (req, res) => {
  const { username, password, siteData } = req.body;

  if (!username || !password || !siteData) {
    return res.status(400).json({ success: false, message: 'Missing parameters for save operation' });
  }

  try {
    const row = await getPrimaryBaserowRow();

    // Store as plain JSON string — no encryption
    const plainPayload = JSON.stringify(siteData);
    await updateBaserowRow(row.id, plainPayload);

    res.json({
      success: true,
      message: 'Global Settings updated'
    });
  } catch (err) {
    console.error('Global save error:', err);
    res.status(500).json({ success: false, message: 'Failed to update Baserow payload: ' + err.message });
  }
});

// 4. CONTACT FORM SUBMISSION ENDPOINT
app.post('/api/contact', (req, res) => {
  const { name, email, phone, service, message } = req.body;
  if (!name || !email) {
    return res.status(400).json({ success: false, message: 'Name and Email are required' });
  }

  const submission = {
    date: new Date().toLocaleString(),
    name,
    email,
    phone: phone || 'N/A',
    service: service || 'General',
    message: message || ''
  };

  localContactSubmissions.unshift(submission);

  res.json({
    success: true,
    message: 'Submission received successfully',
    submission
  });
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

