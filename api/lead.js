const crypto = require('crypto');

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

function sha256(v) {
  return crypto.createHash('sha256').update(String(v).trim().toLowerCase()).digest('hex');
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
    checkin = '',
    checkout = '',
    personas = '',
    habitacion = '',
    fbp = '',
    fbc = '',
    eventId,
  } = body;

  const pixelId = PIXEL_MAP[hotel];
  const token   = process.env.META_SYSTEM_USER_TOKEN;

  // ─── Meta CAPI (server-side deduplicación) ───────────────────
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
            ...(phone    && { ph:      [sha256(phone)]    }),
            ...(parts[0] && { fn:      [sha256(parts[0])] }),
            ...(parts[1] && { ln:      [sha256(parts.slice(1).join(' '))] }),
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

  // ─── Google Sheets vía webhook (n8n) ─────────────────────────
  const sheetsUrl = process.env.SHEETS_WEBHOOK_URL;
  if (sheetsUrl) {
    try {
      await fetch(sheetsUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hotel, nombre, whatsapp, checkin, checkout, personas, habitacion,
          timestamp: new Date().toISOString(),
          source: 'web_form',
        }),
      });
    } catch (e) {
      console.error('[Sheets]', e.message);
    }
  }

  res.status(200).json({ ok: true });
};
