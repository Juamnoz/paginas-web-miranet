const crypto = require('crypto');
const { google } = require('googleapis');

// Pixel IDs creados con el token de AIC Studio (CAPI funciona para estos)
const PIXEL_MAP = {
  novus:       '2610987426024948',
  oru:         '4310716012557629',
  tierragrata: '1021710820800315',
  santotomas:  '1028138033116365',
  terrabella:  '2775037422862248',
  pomarosa:    '1459620725920196',
  suites44:    '989477617220373',
  ceo:         '1338506288376212',
  history:     '2486606141789212',
};

const HOTEL_NAMES = {
  novus:       'Hotel Novus Laureles',
  oru:         'ORU Campestre',
  tierragrata: 'Hotel Tierra Grata',
  santotomas:  'Hotel Santo Tomás',
  terrabella:  'Hotel Terrabella',
  pomarosa:    'Hotel Pomarosa',
  suites44:    'Hotel Suites 44',
  ceo:         'CEO Hotel',
  history:     'Hotel History Center',
};

function sha256(v) {
  return crypto.createHash('sha256').update(String(v).trim().toLowerCase()).digest('hex');
}

function getOAuth2Client() {
  const client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
  );
  client.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });
  return client;
}

async function appendToSheets({ hotel, nombre, whatsapp, email, checkin, checkout, personas, habitacion }) {
  if (!process.env.GOOGLE_REFRESH_TOKEN || !process.env.SHEETS_ID) return;

  const auth = getOAuth2Client();
  const sheets = google.sheets({ version: 'v4', auth });
  const now = new Date().toLocaleString('es-CO', {
    timeZone: 'America/Bogota',
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });

  await sheets.spreadsheets.values.append({
    spreadsheetId: process.env.SHEETS_ID,
    range: 'A:I',
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [[
        now,
        HOTEL_NAMES[hotel] || hotel,
        nombre,
        whatsapp,
        email || '',
        checkin,
        checkout,
        personas,
        habitacion,
      ]],
    },
  });
}

function buildRawEmail(to, subject, html, fromName) {
  const msg = [
    `From: "${fromName}" <aicstudioai@gmail.com>`,
    `To: ${to}`,
    `Subject: =?UTF-8?B?${Buffer.from(subject).toString('base64')}?=`,
    'MIME-Version: 1.0',
    'Content-Type: text/html; charset=UTF-8',
    '',
    html,
  ].join('\r\n');
  return Buffer.from(msg).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

async function sendEmails({ hotel, nombre, whatsapp, email, checkin, checkout, personas, habitacion }) {
  if (!process.env.GOOGLE_REFRESH_TOKEN) return;

  const hotelName = HOTEL_NAMES[hotel] || hotel;
  const auth = getOAuth2Client();
  const gmail = google.gmail({ version: 'v1', auth });

  const tableRow = (label, value) =>
    `<tr><td style="padding:6px 12px 6px 0;color:#888;font-size:13px;white-space:nowrap">${label}</td><td style="padding:6px 0;font-size:14px;color:#111">${value || '—'}</td></tr>`;

  const sharedTable = `
    <table cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin-top:16px">
      ${tableRow('Hotel', hotelName)}
      ${tableRow('Nombre', nombre)}
      ${tableRow('WhatsApp', whatsapp)}
      ${tableRow('Email', email || '—')}
      ${tableRow('Llegada', checkin)}
      ${tableRow('Salida', checkout)}
      ${tableRow('Personas', personas)}
      ${tableRow('Alojamiento', habitacion)}
    </table>`;

  // Notificación interna a juamnoze@gmail.com
  const adminHtml = `
    <div style="font-family:sans-serif;max-width:520px;margin:0 auto">
      <h2 style="margin:0 0 4px;font-size:18px;color:#111">Nueva solicitud de reserva</h2>
      <p style="margin:0;color:#888;font-size:13px">${new Date().toLocaleString('es-CO', { timeZone: 'America/Bogota', dateStyle: 'full', timeStyle: 'short' })}</p>
      ${sharedTable}
      <p style="margin-top:20px;font-size:13px;color:#aaa">Desde el formulario web de ${hotelName}</p>
    </div>`;

  await gmail.users.messages.send({
    userId: 'me',
    requestBody: { raw: buildRawEmail('juamnoze@gmail.com', `[Reserva] ${hotelName} — ${nombre}`, adminHtml, 'Miranet Hotels') },
  });

  // Confirmación al cliente (solo si proporcionó email)
  if (email) {
    const clientHtml = `
      <div style="font-family:sans-serif;max-width:520px;margin:0 auto">
        <h2 style="margin:0 0 8px;font-size:20px;color:#111">¡Hola, ${nombre}!</h2>
        <p style="margin:0 0 16px;font-size:15px;color:#444;line-height:1.6">
          Recibimos tu solicitud de reserva en <strong>${hotelName}</strong>.
          Nuestro equipo revisará la disponibilidad y te confirmará por WhatsApp
          al número <strong>${whatsapp}</strong> en los próximos minutos.
        </p>
        <div style="background:#f7f7f7;border-radius:8px;padding:16px 20px">
          <p style="margin:0 0 8px;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:.06em;color:#888">Resumen de tu solicitud</p>
          ${sharedTable}
        </div>
        <p style="margin-top:20px;font-size:13px;color:#aaa;line-height:1.5">
          Si tienes alguna pregunta adicional, escríbenos directamente por WhatsApp.<br>
          Este correo fue enviado automáticamente — no responder.
        </p>
      </div>`;

    await gmail.users.messages.send({
      userId: 'me',
      requestBody: { raw: buildRawEmail(email, `Recibimos tu solicitud en ${hotelName} ✓`, clientHtml, hotelName) },
    });
  }
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = {}; }
  }
  body = body || {};

  const {
    hotel = '',
    nombre = '',
    whatsapp = '',
    email = '',
    checkin = '',
    checkout = '',
    personas = '',
    habitacion = '',
    fbp = '',
    fbc = '',
    eventId,
  } = body;

  // ─── Meta CAPI (server-side deduplicación) ───────────────────────────────
  const pixelId = PIXEL_MAP[hotel];
  const token   = process.env.META_SYSTEM_USER_TOKEN;
  if (pixelId && token) {
    try {
      const phone = whatsapp.replace(/\D/g, '');
      const parts = nombre.trim().split(/\s+/);
      const payload = {
        data: [{
          event_name: 'Lead',
          event_time: Math.floor(Date.now() / 1000),
          event_id: eventId || `lead_${Date.now()}_${hotel}`,
          event_source_url: req.headers.referer || `https://${hotel}.miranetsas.com.co/`,
          action_source: 'website',
          user_data: {
            ...(phone    && { ph: [sha256(phone)] }),
            ...(parts[0] && { fn: [sha256(parts[0])] }),
            ...(parts[1] && { ln: [sha256(parts.slice(1).join(' '))] }),
            ...(email     && { em: [sha256(email)] }),
            country: ['co'],
            ...(fbp && { fbp }),
            ...(fbc && { fbc }),
          },
          custom_data: { hotel, checkin, checkout, personas, habitacion },
        }],
        access_token: token,
      };
      await fetch(`https://graph.facebook.com/v21.0/${pixelId}/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } catch (e) {
      console.error('[CAPI]', hotel, e.message);
    }
  }

  // ─── Google Sheets ────────────────────────────────────────────────────────
  try {
    await appendToSheets({ hotel, nombre, whatsapp, email, checkin, checkout, personas, habitacion });
  } catch (e) {
    console.error('[Sheets]', e.message);
  }

  // ─── Emails (admin + cliente) ─────────────────────────────────────────────
  try {
    await sendEmails({ hotel, nombre, whatsapp, email, checkin, checkout, personas, habitacion });
  } catch (e) {
    console.error('[Email]', e.message);
  }

  res.status(200).json({ ok: true });
};
