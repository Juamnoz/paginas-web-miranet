const { createHash } = require('crypto');

const PIXEL_MAP = {
  novus:       '2610987426024948',
  oru:         '4310716012557629',
  tierragrata: '1021710820800315',
  santotomas:  '1028138033116365',
  ceo:         '1338506288376212',
  history:     '2486606141789212',
  pomarosa:    '1459620725920196',
  suites44:    '1459620725920196',
  terrabella:  '2775037422862248',
  zonafranca:  '853949500693529',
};

const SOURCE_URL_MAP = {
  novus:       'https://novuslaureles.miranetsas.com.co/',
  oru:         'https://orucampestre.miranetsas.com.co/',
  tierragrata: 'https://tierragrata.miranetsas.com.co/',
  santotomas:  'https://santotomas.miranetsas.com.co/',
  ceo:         'https://ceo.miranetsas.com.co/',
  history:     'https://history.miranetsas.com.co/',
  pomarosa:    'https://pomarosa.miranetsas.com.co/',
  suites44:    'https://suites44.miranetsas.com.co/',
  terrabella:  'https://terrabella.miranetsas.com.co/',
  zonafranca:  'https://zonafranca.miranetsas.com.co/',
};

const HOTEL_NAMES = {
  novus:       'Hotel Novus Laureles',
  oru:         'ORU Campestre',
  tierragrata: 'Tierra Grata Eco Hotel & Spa',
  santotomas:  'Hotel Santo Tomás Rionegro',
  ceo:         'Apartahotel CEO Medellín',
  history:     'Hotel History Center Medellín',
  pomarosa:    'Hotel Poma Rosa',
  suites44:    'Hotel Suites 44 Laureles',
  terrabella:  'Hotel Terrabella',
  zonafranca:  'Finca Hotel Zona Franca',
};

function sha256(v) {
  return createHash('sha256').update(String(v).trim().toLowerCase()).digest('hex');
}

async function getAccessToken() {
  const r = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id:     process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
      grant_type:    'refresh_token',
    }),
  });
  const data = await r.json();
  return data.access_token;
}

async function appendToSheets(token, row) {
  const sheetId = process.env.SHEETS_ID;
  const range   = encodeURIComponent("'Leads hoteles'!A1");
  await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ values: [row] }),
    }
  );
}

async function sendEmail(token, hotelName, row) {
  const [fecha, hotel, nombre, whatsapp, email, checkin, checkout, personas, habitacion] = row;
  const html = [
    `<h2>Nuevo lead — ${hotelName}</h2>`,
    `<table><tbody>`,
    `<tr><td><b>Fecha</b></td><td>${fecha}</td></tr>`,
    `<tr><td><b>Hotel</b></td><td>${hotelName}</td></tr>`,
    `<tr><td><b>Nombre</b></td><td>${nombre}</td></tr>`,
    `<tr><td><b>WhatsApp</b></td><td>${whatsapp}</td></tr>`,
    `<tr><td><b>Email</b></td><td>${email}</td></tr>`,
    `<tr><td><b>Check-in</b></td><td>${checkin}</td></tr>`,
    `<tr><td><b>Check-out</b></td><td>${checkout}</td></tr>`,
    `<tr><td><b>Personas</b></td><td>${personas}</td></tr>`,
    `<tr><td><b>Alojamiento</b></td><td>${habitacion}</td></tr>`,
    `</tbody></table>`,
  ].join('');
  const subject  = `Nuevo lead: ${nombre} — ${hotelName}`;
  const fromName = Buffer.from(hotelName).toString('base64');
  const message  =
    `From: =?UTF-8?B?${fromName}?= <aicstudioai@gmail.com>\r\n` +
    `To: juamnoze@gmail.com\r\n` +
    `Subject: ${subject}\r\n` +
    `Content-Type: text/html; charset=UTF-8\r\n\r\n` +
    html;
  const raw = Buffer.from(message).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ raw }),
  });
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  let body = req.body || {};
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch { body = {}; } }

  const {
    hotel = '', nombre = '', whatsapp = '', email = '',
    checkin = '', checkout = '', personas = '', habitacion = '',
    fbp = '', fbc = '', eventId = '', source_url = '',
  } = body;

  const fecha    = new Date().toLocaleString('es-CO', { timeZone: 'America/Bogota' });
  const row      = [fecha, hotel, nombre, whatsapp, email, checkin, checkout, personas, habitacion];
  const hotelName = HOTEL_NAMES[hotel] || hotel;

  // Google Sheets + Gmail — fire and forget
  if (process.env.GOOGLE_CLIENT_ID && process.env.SHEETS_ID) {
    getAccessToken()
      .then(token => Promise.all([appendToSheets(token, row), sendEmail(token, hotelName, row)]))
      .catch(e => console.error('[Sheets/Gmail]', e));
  }

  // Meta CAPI
  const pixelId  = PIXEL_MAP[hotel];
  const metaToken = process.env.META_SYSTEM_USER_TOKEN;
  if (pixelId && metaToken) {
    const phone  = whatsapp.replace(/\D/g, '');
    const parts  = nombre.trim().split(/\s+/);
    const evtUrl = source_url || SOURCE_URL_MAP[hotel] || `https://${hotel}.miranetsas.com.co/`;
    fetch(`https://graph.facebook.com/v21.0/${pixelId}/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        data: [{
          event_name: 'Lead',
          event_time: Math.floor(Date.now() / 1000),
          event_id:   eventId || `lead_${Date.now()}_${hotel}`,
          event_source_url: evtUrl,
          action_source: 'website',
          user_data: {
            ...(phone    && { ph: [sha256(phone)]                     }),
            ...(email    && { em: [sha256(email)]                     }),
            ...(parts[0] && { fn: [sha256(parts[0])]                  }),
            ...(parts[1] && { ln: [sha256(parts.slice(1).join(' '))]  }),
            country: ['co'],
            ...(fbp && { fbp }),
            ...(fbc && { fbc }),
          },
          custom_data: { hotel, checkin, checkout, personas, habitacion },
        }],
        access_token: metaToken,
      }),
    }).catch(e => console.error(`[CAPI ${hotel}]`, e));
  }

  return res.status(200).json({ ok: true });
};
