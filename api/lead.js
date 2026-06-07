const crypto = require('crypto');
const { google } = require('googleapis');

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

// ─── Configuración visual por hotel ────────────────────────────────────────────
const HOTEL_CONFIG = {
  novus: {
    name:       'Hotel Novus Laureles',
    bg:         '#090806', bgRgb: '9,8,6',
    surface:    '#131109',
    accent:     '#c8a96a', accentRgb: '200,169,106',
    cream:      '#f2ece0',
    creamDim:   '#b0a690',
    logoUrl:    null,
    logoHtml:   '<div style="text-align:center;padding:6px 0"><div style="font-family:\'Cormorant Garamond\',Georgia,serif;font-size:27px;font-weight:300;color:#c8a96a;letter-spacing:0.38em;line-height:1">&#9670;NOVUS&#9670;</div><div style="font-family:\'DM Sans\',Arial,sans-serif;font-size:9px;font-weight:400;letter-spacing:0.52em;text-transform:uppercase;color:#c8a96a;margin-top:7px">LAURELES</div></div>',
    tagline:    'La experiencia más exclusiva · Laureles, Medellín',
    wa:         '573008943465',
  },
  oru: {
    name:       'ORU Campestre',
    bg:         '#050909', bgRgb: '5,9,9',
    surface:    '#0b1212',
    accent:     '#4e9e88', accentRgb: '78,158,136',
    cream:      '#f0ede5',
    creamDim:   '#a8a898',
    logoUrl:    'https://orucampestre.miranetsas.com.co/assets/logo-oru.png',
    tagline:    'Naturaleza y confort · Hotel Campestre Colombia',
    wa:         '573145374287',
  },
  tierragrata: {
    name:       'Hotel Tierra Grata',
    bg:         '#060805', bgRgb: '6,8,5',
    surface:    '#0e1309',
    accent:     '#9dc46a', accentRgb: '157,196,106',
    cream:      '#f2ede3',
    creamDim:   '#aea890',
    logoUrl:    'https://tierragrata.miranetsas.com.co/assets/logo-tierra-grata.jpeg',
    tagline:    'Un refugio de bambú y naturaleza · Colombia',
    wa:         '573012230610',
  },
  santotomas: {
    name:       'Hotel Santo Tomás',
    bg:         '#080604', bgRgb: '8,6,4',
    surface:    '#100d09',
    accent:     '#c4783a', accentRgb: '196,120,58',
    cream:      '#f2ede4',
    creamDim:   '#a89880',
    logoUrl:    'https://santotomas.miranetsas.com.co/assets/logo-santo-tomas.jpg',
    tagline:    'Finca Campestre · Rionegro, Antioquia',
    wa:         '573054677360',
  },
  pomarosa: {
    name:       'Hotel Poma Rosa',
    bg:         '#0a0706', bgRgb: '10,7,6',
    surface:    '#13100c',
    accent:     '#c4856a', accentRgb: '196,133,106',
    cream:      '#f2ece0',
    creamDim:   '#b0a690',
    logoUrl:    'https://pomarosa.miranetsas.com.co/assets/logo-pomarosa-oficial.png',
    tagline:    'Confort y calidez · Laureles, Medellín',
    wa:         '573146544069',
  },
  suites44: {
    name:       'Hotel Suites 44 Laureles',
    bg:         '#100e07', bgRgb: '16,14,7',
    surface:    '#161208',
    accent:     '#c8951a', accentRgb: '200,149,26',
    cream:      '#f2ece0',
    creamDim:   '#b0a690',
    logoUrl:    'https://suites44.miranetsas.com.co/assets/logo-suites44.png',
    tagline:    'Hospitalidad y confort · Laureles, Medellín',
    wa:         '573115781227',
  },
  ceo: {
    name:       'Apartahotel CEO',
    bg:         '#0a0e12', bgRgb: '10,14,18',
    surface:    '#0d1318',
    accent:     '#4a7fa5', accentRgb: '74,127,165',
    cream:      '#e8eef3',
    creamDim:   '#8fa8ba',
    logoUrl:    'https://ceo.miranetsas.com.co/assets/logo-ceo.jpeg',
    tagline:    'Apartahotel · Estadías cortas y largas · Medellín',
    wa:         '573022973380',
  },
  history: {
    name:       'Hotel History Center',
    bg:         '#0a100d', bgRgb: '10,16,13',
    surface:    '#0e1510',
    accent:     '#2d6a4f', accentRgb: '45,106,79',
    cream:      '#e6f0ea',
    creamDim:   '#8ab59a',
    logoUrl:    'https://history.miranetsas.com.co/assets/logo-history.jpeg',
    tagline:    'Confort y hospitalidad · Medellín, Colombia',
    wa:         '573246538020',
  },
};

const FOOTER_LISA_LOGO   = 'https://orucampestre.miranetsas.com.co/assets/lisa-logo.png';
const FOOTER_MIRANET_LOGO = 'https://orucampestre.miranetsas.com.co/assets/miranet-logo.png';

// ─── Helpers ────────────────────────────────────────────────────────────────────
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

// ─── Google Sheets ───────────────────────────────────────────────────────────────
async function appendToSheets({ hotel, nombre, whatsapp, email, checkin, checkout, personas, habitacion }) {
  if (!process.env.GOOGLE_REFRESH_TOKEN || !process.env.SHEETS_ID) return;
  const auth = getOAuth2Client();
  const sheets = google.sheets({ version: 'v4', auth });
  const now = new Date().toLocaleString('es-CO', {
    timeZone: 'America/Bogota',
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
  const cfg = HOTEL_CONFIG[hotel];
  await sheets.spreadsheets.values.append({
    spreadsheetId: process.env.SHEETS_ID,
    range: 'A:I',
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [[now, cfg ? cfg.name : hotel, nombre, whatsapp, email || '', checkin, checkout, personas, habitacion]],
    },
  });
}

// ─── Email HTML builder ──────────────────────────────────────────────────────────
function buildHotelEmailHtml(cfg, data, isAdmin) {
  const { nombre, whatsapp, email, checkin, checkout, personas, habitacion } = data;
  const { name, bg, bgRgb, surface, accent, accentRgb, cream, creamDim, logoUrl, logoLetter, tagline, wa } = cfg;

  const now = new Date().toLocaleString('es-CO', {
    timeZone: 'America/Bogota',
    weekday: 'long', day: '2-digit', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
  const year = new Date().getFullYear();

  const { logoHtml: customLogoHtml } = cfg;
  const logoBlock = customLogoHtml
    ? customLogoHtml
    : logoUrl
      ? `<img src="${logoUrl}" height="68" alt="${name}" style="height:68px;max-width:220px;object-fit:contain;display:block;margin:0 auto;border-radius:6px">`
      : `<div style="display:inline-block;width:68px;height:68px;border-radius:50%;background-color:${bg};border:1.5px solid ${accent};text-align:center;line-height:68px;font-family:'Cormorant Garamond',Georgia,serif;font-size:34px;color:${accent}">${logoLetter || name[0]}</div>`;

  const row = (label, value) => value ? `
          <tr>
            <td style="padding:11px 0;border-bottom:1px solid rgba(255,255,255,0.055);font-family:'DM Sans',Arial,sans-serif;font-size:11px;color:${creamDim};letter-spacing:0.08em;text-transform:uppercase;width:34%;vertical-align:top">${label}</td>
            <td style="padding:11px 0 11px 14px;border-bottom:1px solid rgba(255,255,255,0.055);font-family:'DM Sans',Arial,sans-serif;font-size:14px;color:${cream};line-height:1.4;vertical-align:top">${value}</td>
          </tr>` : '';

  const title    = isAdmin ? 'Nueva solicitud de reserva' : `¡Hola, ${nombre}!`;
  const subtitle = isAdmin
    ? `Enviada el ${now}.`
    : `Recibimos tu solicitud en <strong style="color:${accent}">${name}</strong>. Nuestro equipo revisará la disponibilidad y te confirmará por WhatsApp al número <strong style="color:${cream}">${whatsapp}</strong> en los próximos minutos.`;

  const clientWhatsapp = whatsapp.replace(/\D/g, '');
  const ctaHref  = isAdmin
    ? `https://wa.me/${clientWhatsapp}?text=Hola%20${encodeURIComponent(nombre)}%2C%20gracias%20por%20tu%20solicitud%20en%20${encodeURIComponent(name)}.%20Confirmamos%20tu%20reserva%20%F0%9F%8F%A8`
    : `https://wa.me/${wa}`;
  const ctaLabel = isAdmin ? 'Responder al huésped' : 'Confirmar por WhatsApp';

  return `<!DOCTYPE html>
<html lang="es" xmlns:v="urn:schemas-microsoft-com:vml">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <meta name="color-scheme" content="dark">
  <meta name="supported-color-schemes" content="dark">
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet">
  <title>${name}</title>
</head>
<body id="body" style="margin:0;padding:0;background-color:${bg};-webkit-font-smoothing:antialiased" bgcolor="${bg}">
<style type="text/css">
  u + #body .email-footer, #MessageViewBody .email-footer { background-color:#2d2d2d !important; }
</style>

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${bg}" bgcolor="${bg}">
  <tr>
    <td align="center" style="padding:32px 16px 48px">

      <!-- ░░░ CARD ░░░ -->
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background-color:${surface};border-radius:14px;overflow:hidden;border:1px solid rgba(255,255,255,0.07)" bgcolor="${surface}">

        <!-- Top accent bar -->
        <tr>
          <td height="3" style="height:3px;font-size:3px;line-height:3px;background-color:${accent}" bgcolor="${accent}">&nbsp;</td>
        </tr>

        <!-- ─── HEADER ─── -->
        <tr>
          <td align="center" style="padding:36px 36px 26px;border-bottom:1px solid rgba(255,255,255,0.07)">
            ${logoBlock}
            <div style="font-family:'Cormorant Garamond',Georgia,serif;font-size:23px;font-weight:300;color:${cream};letter-spacing:0.06em;margin-top:18px;line-height:1.25">${name}</div>
            <div style="font-family:'DM Sans',Arial,sans-serif;font-size:11px;color:${creamDim};letter-spacing:0.16em;text-transform:uppercase;margin-top:7px">${tagline}</div>
          </td>
        </tr>

        <!-- ─── TITLE BAND ─── -->
        <tr>
          <td style="padding:22px 36px;border-bottom:1px solid rgba(255,255,255,0.07);background-color:rgba(${accentRgb},0.07)">
            <div style="font-family:'Cormorant Garamond',Georgia,serif;font-size:20px;font-weight:400;color:${cream};line-height:1.3">${title}</div>
            <div style="font-family:'DM Sans',Arial,sans-serif;font-size:13px;color:${creamDim};margin-top:9px;line-height:1.7">${subtitle}</div>
          </td>
        </tr>

        <!-- ─── DETAILS ─── -->
        <tr>
          <td style="padding:10px 36px 20px">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
              ${isAdmin ? row('Hotel', name) : ''}
              ${row('Nombre', nombre)}
              ${row('WhatsApp', whatsapp)}
              ${row('Email', email)}
              ${row('Llegada', checkin)}
              ${row('Salida', checkout)}
              ${row('Personas', personas)}
              ${row('Alojamiento', habitacion)}
            </table>
          </td>
        </tr>

        <!-- ─── CTA BUTTON ─── -->
        <tr>
          <td align="center" style="padding:8px 36px 36px">
            <a href="${ctaHref}"
               style="display:inline-block;background-color:${accent};color:${bg};font-family:'DM Sans',Arial,sans-serif;font-size:12px;font-weight:500;letter-spacing:0.10em;text-transform:uppercase;text-decoration:none;padding:14px 40px;border-radius:100px;white-space:nowrap"
               bgcolor="${accent}">
              ${ctaLabel}
            </a>
          </td>
        </tr>

        <!-- ─── FOOTER ─── -->
        <tr>
          <td class="email-footer" style="background-color:#2d2d2d;border-top:1px solid rgba(255,255,255,0.12);padding:22px 36px 28px" bgcolor="#2d2d2d">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td align="center">
                  <div style="font-family:'DM Sans',Arial,sans-serif;font-size:10px;color:rgba(255,255,255,0.28);letter-spacing:0.16em;text-transform:uppercase;margin-bottom:14px">Gestionado por</div>
                  <table role="presentation" cellpadding="0" cellspacing="0" align="center">
                    <tr>
                      <td style="padding:0 20px;vertical-align:middle">
                        <img src="${FOOTER_LISA_LOGO}" height="28" alt="LISA IA" style="height:28px;display:block;opacity:0.9">
                      </td>
                      <td style="vertical-align:middle">
                        <div style="width:1px;height:22px;background-color:rgba(255,255,255,0.14)">&nbsp;</div>
                      </td>
                      <td style="padding:0 20px;vertical-align:middle">
                        <img src="${FOOTER_MIRANET_LOGO}" height="24" alt="Miranet" style="height:24px;display:block;opacity:0.9">
                      </td>
                    </tr>
                  </table>
                  <div style="font-family:'DM Sans',Arial,sans-serif;font-size:10px;color:rgba(255,255,255,0.18);margin-top:18px;line-height:1.7">
                    Correo generado automáticamente &nbsp;·&nbsp; No responder directamente<br>
                    © ${year} Miranet Hotels &nbsp;·&nbsp; Medellín, Colombia
                  </div>
                </td>
              </tr>
            </table>
          </td>
        </tr>

      </table>
      <!-- ░░░ /CARD ░░░ -->

    </td>
  </tr>
</table>

</body>
</html>`;
}

// ─── Raw email builder (RFC 2822) ────────────────────────────────────────────────
function buildRawEmail(to, subject, html, fromName) {
  const msg = [
    `From: =?UTF-8?B?${Buffer.from(fromName).toString('base64')}?= <aicstudioai@gmail.com>`,
    `To: ${to}`,
    `Subject: =?UTF-8?B?${Buffer.from(subject).toString('base64')}?=`,
    'MIME-Version: 1.0',
    'Content-Type: text/html; charset=UTF-8',
    '',
    html,
  ].join('\r\n');
  return Buffer.from(msg).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

// ─── Send emails ─────────────────────────────────────────────────────────────────
async function sendEmails({ hotel, nombre, whatsapp, email, checkin, checkout, personas, habitacion }) {
  if (!process.env.GOOGLE_REFRESH_TOKEN) return;

  const cfg = HOTEL_CONFIG[hotel] || { name: hotel, bg: '#111', bgRgb: '17,17,17', surface: '#1a1a1a', accent: '#888', accentRgb: '136,136,136', cream: '#eee', creamDim: '#aaa', logoUrl: null, tagline: '', wa: '' };
  const data = { hotel, nombre, whatsapp, email, checkin, checkout, personas, habitacion };
  const auth = getOAuth2Client();
  const gmail = google.gmail({ version: 'v1', auth });

  // Admin notification
  const adminHtml = buildHotelEmailHtml(cfg, data, true);
  await gmail.users.messages.send({
    userId: 'me',
    requestBody: {
      raw: buildRawEmail(
        'juamnoze@gmail.com',
        `[Reserva] ${cfg.name} — ${nombre}`,
        adminHtml,
        'Miranet Hotels',
      ),
    },
  });

  // Client confirmation (only if they provided email)
  if (email) {
    const clientHtml = buildHotelEmailHtml(cfg, data, false);
    await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: buildRawEmail(
          email,
          `Recibimos tu solicitud en ${cfg.name} ✓`,
          clientHtml,
          cfg.name,
        ),
      },
    });
  }
}

// ─── Handler ──────────────────────────────────────────────────────────────────────
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

  // ─── Meta CAPI ──────────────────────────────────────────────────────────────
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
            ...(email    && { em: [sha256(email)] }),
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

  // ─── Google Sheets ────────────────────────────────────────────────────────────
  try {
    await appendToSheets({ hotel, nombre, whatsapp, email, checkin, checkout, personas, habitacion });
  } catch (e) {
    console.error('[Sheets]', e.message);
  }

  // ─── Emails ───────────────────────────────────────────────────────────────────
  try {
    await sendEmails({ hotel, nombre, whatsapp, email, checkin, checkout, personas, habitacion });
  } catch (e) {
    console.error('[Email]', e.message);
  }

  res.status(200).json({ ok: true });
};
