// Reenvío manual de leads — ejecutar con: node resend-leads.js
// Load env vars from .env.local manually
const fs = require('fs');
try {
  const env = fs.readFileSync('.env.local', 'utf8');
  for (const line of env.split('\n')) {
    const m = line.match(/^([^#=]+)=(.*)$/);
    if (m) process.env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, '');
  }
} catch {}

const { google } = require('googleapis');
const crypto = require('crypto');

// ── Copiar exactamente de lead.js ──────────────────────────────────────────
const HOTEL_CONFIG = {
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
  terrabella: {
    name:       'Eco Hotel Terrabella',
    bg:         '#060a07', bgRgb: '6,10,7',
    surface:    '#0e1509',
    accent:     '#6aab5a', accentRgb: '106,171,90',
    cream:      '#f2ede3',
    creamDim:   '#a8a890',
    logoUrl:    'https://terrabella.miranetsas.com.co/logo-terrabella-nuevo.jpeg',
    tagline:    'Eco Hotel · Restaurante · Santa Elena, Antioquia',
    wa:         '573016430309',
  },
};

const FOOTER_LISA_LOGO   = 'https://orucampestre.miranetsas.com.co/assets/lisa-logo.png';
const FOOTER_MIRANET_LOGO = 'https://orucampestre.miranetsas.com.co/assets/miranet-logo.png';

function getOAuth2Client() {
  const client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
  );
  client.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });
  return client;
}

function buildHotelEmailHtml(cfg, data, isAdmin) {
  const { nombre, whatsapp, email, checkin, checkout, personas, habitacion } = data;
  const { name, bg, bgRgb, surface, accent, accentRgb, cream, creamDim, logoUrl, logoLetter, tagline, wa } = cfg;
  const now = new Date().toLocaleString('es-CO', { timeZone: 'America/Bogota', weekday: 'long', day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  const year = new Date().getFullYear();
  const { logoHtml: customLogoHtml } = cfg;
  const logoBlock = customLogoHtml
    ? customLogoHtml
    : logoUrl
      ? `<img src="${logoUrl}" height="68" alt="${name}" style="height:68px;max-width:220px;object-fit:contain;display:block;margin:0 auto;border-radius:6px">`
      : `<div style="display:inline-block;width:68px;height:68px;border-radius:50%;background-color:${bg};border:1.5px solid ${accent};text-align:center;line-height:68px;font-family:'Cormorant Garamond',Georgia,serif;font-size:34px;color:${accent}">${logoLetter || name[0]}</div>`;
  const row = (label, value) => value ? `<tr><td style="padding:11px 0;border-bottom:1px solid rgba(255,255,255,0.055);font-family:'DM Sans',Arial,sans-serif;font-size:11px;color:${creamDim};letter-spacing:0.08em;text-transform:uppercase;width:34%;vertical-align:top">${label}</td><td style="padding:11px 0 11px 14px;border-bottom:1px solid rgba(255,255,255,0.055);font-family:'DM Sans',Arial,sans-serif;font-size:14px;color:${cream};line-height:1.4;vertical-align:top">${value}</td></tr>` : '';
  const title    = isAdmin ? 'Nueva solicitud de reserva' : `¡Hola, ${nombre}!`;
  const subtitle = isAdmin
    ? `Enviada el ${now}.`
    : `Recibimos tu solicitud en <strong style="color:${accent}">${name}</strong>. Nuestro equipo revisará la disponibilidad y te confirmará por WhatsApp al número <strong style="color:${cream}">${whatsapp}</strong> en los próximos minutos.`;
  const clientWhatsapp = whatsapp.replace(/\D/g, '');
  const ctaHref  = isAdmin ? `https://wa.me/${clientWhatsapp}?text=Hola%20${encodeURIComponent(nombre)}%2C%20gracias%20por%20tu%20solicitud%20en%20${encodeURIComponent(name)}.%20Confirmamos%20tu%20reserva%20%F0%9F%8F%A8` : `https://wa.me/${wa}`;
  const ctaLabel = isAdmin ? 'Responder al huésped' : 'Confirmar por WhatsApp';
  return `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><meta name="color-scheme" content="dark"><link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet"><title>${name}</title></head><body id="body" style="margin:0;padding:0;background-color:${bg}" bgcolor="${bg}"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${bg}" bgcolor="${bg}"><tr><td align="center" style="padding:32px 16px 48px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background-color:${surface};border-radius:14px;overflow:hidden;border:1px solid rgba(255,255,255,0.07)" bgcolor="${surface}"><tr><td height="3" style="height:3px;font-size:3px;line-height:3px;background-color:${accent}" bgcolor="${accent}">&nbsp;</td></tr><tr><td align="center" style="padding:36px 36px 26px;border-bottom:1px solid rgba(255,255,255,0.07)">${logoBlock}<div style="font-family:'Cormorant Garamond',Georgia,serif;font-size:23px;font-weight:300;color:${cream};letter-spacing:0.06em;margin-top:18px;line-height:1.25">${name}</div><div style="font-family:'DM Sans',Arial,sans-serif;font-size:11px;color:${creamDim};letter-spacing:0.16em;text-transform:uppercase;margin-top:7px">${tagline}</div></td></tr><tr><td style="padding:22px 36px;border-bottom:1px solid rgba(255,255,255,0.07);background-color:rgba(${accentRgb},0.07)"><div style="font-family:'Cormorant Garamond',Georgia,serif;font-size:20px;font-weight:400;color:${cream};line-height:1.3">${title}</div><div style="font-family:'DM Sans',Arial,sans-serif;font-size:13px;color:${creamDim};margin-top:9px;line-height:1.7">${subtitle}</div></td></tr><tr><td style="padding:10px 36px 20px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0">${isAdmin ? row('Hotel', name) : ''}${row('Nombre', nombre)}${row('WhatsApp', whatsapp)}${row('Email', email)}${row('Llegada', checkin)}${row('Salida', checkout)}${row('Personas', personas)}${row('Alojamiento', habitacion)}</table></td></tr><tr><td align="center" style="padding:8px 36px 36px"><a href="${ctaHref}" style="display:inline-block;background-color:${accent};color:${bg};font-family:'DM Sans',Arial,sans-serif;font-size:12px;font-weight:500;letter-spacing:0.10em;text-transform:uppercase;text-decoration:none;padding:14px 40px;border-radius:100px;white-space:nowrap" bgcolor="${accent}">${ctaLabel}</a></td></tr><tr><td bgcolor="#2d2d2d" style="background-color:#2d2d2d;border-top:2px solid ${accent};padding:24px 36px 28px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center"><div style="font-family:'DM Sans',Arial,sans-serif;font-size:10px;color:#ffffff;letter-spacing:0.18em;text-transform:uppercase;margin-bottom:14px">Gestionado por</div><table role="presentation" cellpadding="0" cellspacing="0" align="center"><tr><td style="padding:0 20px;vertical-align:middle"><img src="${FOOTER_LISA_LOGO}" height="28" alt="LISA IA" style="height:28px;display:block"></td><td style="vertical-align:middle"><div style="width:1px;height:22px;background-color:rgba(255,255,255,0.25)">&nbsp;</div></td><td style="padding:0 20px;vertical-align:middle"><img src="${FOOTER_MIRANET_LOGO}" height="24" alt="Miranet" style="height:24px;display:block"></td></tr></table><div style="font-family:'DM Sans',Arial,sans-serif;font-size:10px;color:#cccccc;margin-top:18px;line-height:1.7">Correo generado automáticamente &nbsp;·&nbsp; No responder directamente<br>© ${year} Miranet Hotels &nbsp;·&nbsp; Medellín, Colombia</div></td></tr></table></td></tr></table></td></tr></table></body></html>`;
}

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

// ── Leads a reenviar ───────────────────────────────────────────────────────
const LEADS = [
  {
    hotel: 'oru',
    nombre: 'Alejandra',
    whatsapp: '573148016925',
    email: 'aleja.jar.mon@gmail.com',
    checkin: '07/06/2026',
    checkout: '08/06/2026',
    personas: '2 personas',
    habitacion: 'Suite con Piscina Privada',
  },
  {
    hotel: 'terrabella',
    nombre: 'Johana duque',
    whatsapp: '573103712780',
    email: 'empresaria1612@gmail.com',
    checkin: '07/06/2026',
    checkout: '08/06/2026',
    personas: '3 personas',
    habitacion: 'Habitación Estándar',
  },
  {
    hotel: 'terrabella',
    nombre: 'Juan',
    whatsapp: '573504701514',
    email: 'gvjuan91@gmail.com',
    checkin: '07/06/2026',
    checkout: '08/06/2026',
    personas: '2 personas',
    habitacion: 'Habitación Estándar',
  },
];

async function main() {
  const auth = getOAuth2Client();
  const gmail = google.gmail({ version: 'v1', auth });

  for (const lead of LEADS) {
    const cfg = HOTEL_CONFIG[lead.hotel];
    console.log(`Enviando: ${cfg.name} — ${lead.nombre}`);

    // Admin (juamnoze + miranetcommunitymanager)
    const adminHtml = buildHotelEmailHtml(cfg, lead, true);
    await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: buildRawEmail(
          'juamnoze@gmail.com, miranetcommunitymanager@gmail.com',
          `[Reserva] ${cfg.name} — ${lead.nombre}`,
          adminHtml,
          'Miranet Hotels',
        ),
      },
    });
    console.log(`  ✓ Admin notificado`);

    // Cliente
    if (lead.email) {
      const clientHtml = buildHotelEmailHtml(cfg, lead, false);
      await gmail.users.messages.send({
        userId: 'me',
        requestBody: {
          raw: buildRawEmail(
            lead.email,
            `Recibimos tu solicitud en ${cfg.name} ✓`,
            clientHtml,
            cfg.name,
          ),
        },
      });
      console.log(`  ✓ Cliente notificado (${lead.email})`);
    }
  }

  console.log('\nTodo listo.');
}

main().catch(console.error);
