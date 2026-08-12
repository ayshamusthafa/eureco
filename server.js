const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static(__dirname));

const BASEROW_API_URL = process.env.BASEROW_API_URL || 'https://api.baserow.io/api/database/rows/table/';
const BASEROW_TABLE_ID = process.env.BASEROW_TABLE_ID || '1111251';
const BASEROW_API_KEY = process.env.BASEROW_API_KEY || 'jXXkrUUqrQK3RlESaDPs2gq0Eu0SK4Sw';

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
// AES-256-CBC ENCRYPTION HELPERS
// ============================================================
function getKey(password) {
  return crypto.createHash('sha256').update(String(password)).digest();
}

function encryptPayload(dataObject, password) {
  try {
    const key = getKey(password);
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    const jsonStr = JSON.stringify(dataObject);
    let encrypted = cipher.update(jsonStr, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return `${iv.toString('hex')}:${encrypted}`;
  } catch (err) {
    console.error('Encryption error:', err);
    return null;
  }
}

function decryptPayload(encryptedString, password) {
  if (!encryptedString || typeof encryptedString !== 'string') return null;
  try {
    const parts = encryptedString.split(':');
    if (parts.length !== 2) return null;
    const iv = Buffer.from(parts[0], 'hex');
    const encryptedText = Buffer.from(parts[1], 'hex');
    const key = getKey(password);
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return JSON.parse(decrypted);
  } catch (err) {
    console.error('Decryption error:', err.message);
    return null;
  }
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
    throw new Error(`Baserow API error: ${response.status} ${response.statusText}`);
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
    throw new Error(`Baserow update error: ${response.status} ${response.statusText}`);
  }

  return await response.json();
}

// ============================================================
// API ENDPOINTS
// ============================================================

// 1. PUBLIC ENDPOINT: Get site data for preloader/hydration
app.get('/api/site-data', async (req, res) => {
  try {
    const rows = await getBaserowRows();
    if (!rows || rows.length === 0) {
      return res.json({ success: true, siteData: defaultSiteData });
    }

    const firstRow = rows[0];
    const passwordKey = firstRow.Password || 'Admin@132';

    if (firstRow.Data && firstRow.Data.trim().length > 0) {
      const decrypted = decryptPayload(firstRow.Data, passwordKey);
      if (decrypted) {
        return res.json({ success: true, siteData: decrypted });
      }
    }

    // Fallback to default site data if empty or unencrypted
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
    const matchedRow = rows.find(r => 
      r.Username && String(r.Username).trim().toLowerCase() === String(username).trim().toLowerCase() &&
      r.Password && String(r.Password).trim() === String(password).trim()
    );

    if (!matchedRow) {
      return res.status(401).json({ success: false, message: 'Invalid username or password' });
    }

    let siteData = defaultSiteData;
    if (matchedRow.Data && matchedRow.Data.trim().length > 0) {
      const decrypted = decryptPayload(matchedRow.Data, password);
      if (decrypted) {
        siteData = decrypted;
      }
    } else {
      // Initialize row with encrypted default site data
      const encryptedDefault = encryptPayload(defaultSiteData, password);
      if (encryptedDefault) {
        await updateBaserowRow(matchedRow.id, encryptedDefault);
      }
    }

    const token = crypto.randomBytes(32).toString('hex');

    res.json({
      success: true,
      token,
      username: matchedRow.Username,
      password: matchedRow.Password, // Return verified password for encryption session key
      siteData
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: 'Server authentication error: ' + err.message });
  }
});

// 3. ADMIN GLOBAL SAVE / INITIALIZE PAYLOAD ENDPOINT
app.post('/api/admin/save', async (req, res) => {
  const { username, password, siteData } = req.body;

  if (!username || !password || !siteData) {
    return res.status(400).json({ success: false, message: 'Missing parameters for save operation' });
  }

  try {
    const rows = await getBaserowRows();
    const matchedRow = rows.find(r => 
      r.Username && String(r.Username).trim().toLowerCase() === String(username).trim().toLowerCase() &&
      r.Password && String(r.Password).trim() === String(password).trim()
    );

    if (!matchedRow) {
      return res.status(401).json({ success: false, message: 'Unauthorized: Invalid Baserow credentials' });
    }

    // Encrypt JSON payload with password key
    const encryptedPayload = encryptPayload(siteData, password);
    if (!encryptedPayload) {
      return res.status(500).json({ success: false, message: 'Failed to encrypt site payload' });
    }

    // Update Baserow row
    await updateBaserowRow(matchedRow.id, encryptedPayload);

    res.json({
      success: true,
      message: 'Global payload encrypted with password key and published to Baserow successfully!'
    });
  } catch (err) {
    console.error('Global save error:', err);
    res.status(500).json({ success: false, message: 'Failed to update Baserow payload: ' + err.message });
  }
});

// Serve index.html for root routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Eureco Backend Proxy & CMS Server running on http://localhost:${PORT}`);
  console.log(`Connected to Baserow Table ID: ${BASEROW_TABLE_ID}`);
});
