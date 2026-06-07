# BRIEF — Webs Miranet para Claude Code
> Generado por Claude Desktop · Junio 2026
> Proyecto: `/Users/Juamnoz/Desktop/paginas web/miranet-webs/`

## Instrucciones generales

Construir landing pages HTML estáticas para los hoteles listados abajo, usando el mismo design system de los HTML existentes (`novus/novus-laureles.html`, `oru-campestre/oru-campestre.html`, etc.):
- Fonts: `Cormorant Garamond` (display) + `DM Sans` (body)
- Dark luxury aesthetic: fondos casi negros
- CSS vars: `--bg`, `--surface`, `--surface-2`, color de acento por hotel, `--cream`, `--border`
- Conversión principal: botón WhatsApp → `https://wa.me/{WA_NUMBER}`
- Eventos Meta Pixel: `PageView`, `ViewContent`, `Contact` (click WA), `InitiateCheckout` (click reservas)

**Formato de salida:** HTML puro (un solo archivo por hotel), igual que `novus` y `oru-campestre`.

---

## 1. Hotel Suites 44 Laureles

**Carpeta destino:** `suites-44/suites-44.html` *(ya existe page.tsx — construir HTML independiente)*

| Campo | Valor |
|---|---|
| WhatsApp | `573115781227` |
| Instagram | `@hotel_suites44laureles` |
| Facebook | `https://www.facebook.com/hotelsuites44/` |
| Dirección | Calle 44 #70A-05, Laureles, Medellín |
| Check-in / out | 3:00 pm / 1:00 pm |
| Color acento | Ámbar dorado (`#C8951A`) |

**Tipos de habitación:**
- Habitación Doble (pareja): L-J $90.000 / Fin de semana desde $120.000 — 1 cama matrimonial
- Habitación Triple: $150.000 L-J / $180.000 fin de semana — matrimonial + individual (o 3 ind.)
- Habitación Cuádruple: $200.000 semana / $240.000 fin de semana — matrimonial + 2 individuales

**Amenities:** Aire acondicionado · TV · Wi-Fi · Baño privado · Recepción 24h · Parqueadero moto · Transporte aeropuerto · Tours (Guatapé, Comuna 13, Pueblito Paisa)

**Fotos en Drive (habitaciones editadas) — 12 imágenes PNG:**
```
Carpeta: https://drive.google.com/drive/folders/1kVDVb_LB9a0xkYMFmKXrqcOcAZILdS55
IDs individuales:
1KMaoKejxFceKu6mPNbVJ-P8grjsraUuR  → hab-01.png
1jDigKzvTSd0qN2nEGMv6a8m__oegSh8-  → hab-02.png
1ZmiJT-KT-WWYdNbcU8NdGrmLWrnLW5oG  → hab-03.png
1qTPTiDr6tPkNYxO1RYIeDul1mDxfyF4M  → hab-04.png
1TqS1M7GxkT7MQgD2SsJSeMWZAZ5IpVpW  → hab-05.png
1zcxfU1rS8NOebI-4ElM8zTc_a1ajaNny   → hab-06.png
1-B2SSsrQVPxRRXR8iCkek3nCIHXUAjmV  → hab-07.png
1lJG351jCxW-pYNlsjeTIy_PivRwzfQCN  → hab-08.png
1sKARmnnUNS2VAYyz7FnYR92YCrPr9Xwi  → hab-09.png
1WtyWJNNwFWTsixgZIU7g7Qbtyf1iBVeY  → hab-10.png
1YZJQbkiPJcEJU7AyEAFVa-5ihcdMksdq  → hab-11.png
1ihQ_KUUypiaRFmWtKQdvAyKjKboWyXxk  → hab-12.png
```
*Las imágenes jpg existentes en `suites-44/assets/` también son válidas para usar.*

**Pixel ID Meta:** `989477617220373`

---

## 2. Hotel Poma Rosa

**Carpeta destino:** `pomarosa/pomarosa.html` *(ya existe page.tsx — construir HTML independiente)*

| Campo | Valor |
|---|---|
| WhatsApp | `573146544069` |
| Instagram | `@pomarosahotel` |
| Facebook | `https://www.facebook.com/profile.php?id=61575743242577` |
| Dirección | Transversal 74 Circular 1-24, Laureles, Medellín |
| Check-in / out | 3:00 pm / 1:00 pm |
| Color acento | Rosa dorado (`#C4856A`) |

**Tipos de habitación:**
- Habitación Doble — 1 persona: sin desayuno $120k / con desayuno $140k
- Habitación Doble — 2 personas: sin desayuno $150k / con desayuno $160k
- Habitación Triple / Familiar — 3 personas: desde $200k / con desayuno desde $220k
- Habitación Triple / Familiar — 4 personas: desde $270k / con desayuno desde $290k

**Amenities:** AC o ventilador · TV · Algunas con patio o balcón · Pet friendly (costo adicional) · Transporte aeropuerto · Tours (Guatapé, Comuna 13, Pueblito Paisa)

**Servicios adicionales:** Espacios para trabajo/reuniones

**Fotos en Drive (habitaciones editadas) — 19 imágenes PNG (AI generadas):**
```
Carpeta: https://drive.google.com/drive/folders/1fO4PY9StkMOTH1jHZ7oYtY644Ta2stxD
IDs individuales:
1Mj1KeQYlLLXuaNGVUG-Zm9jwTcqjiMzC  → hab-01.png
1yt6sEybqD9njgMfhHzafv7o083Hq-nk-  → hab-02.png
1_XbjeTMknKnIvakqSaWw09G6bojAX5Wk  → hab-03.png
1gkhgHrF-sUJS1SYBYVRFR43BvxhSnN-G  → hab-04.png
1QiMLh34F-5xyg37j54JIxBgFv8ilny_M  → hab-05.png
1llxU9ClbwamDeEV_6fFn9cGGcTopez9D  → hab-06.png
1cbsl3DXlVGU-WamjcHxKEZq-L8NhHwKm  → hab-07.png
1miZrVpJQJ_dsPWSN4wor8MRYvat14fEk  → hab-08.png
1G9x3LfpeRzY716M3TGAk-L57jJL6F93A  → hab-09.png
1424f2rrbGA9bUG-ZXpOFhGlFKvjInwEr  → hab-10.png
144-WkcmGNfvChI6pnrDBzrEL9dwah6Li  → hab-11.png
1Jf1yC1l89oR321oa9ouB16G4r_XxvktG  → hab-12.png
1jxChnZKZSc_PAxIh8LV0Bu7hF2e4E9ur  → hab-13.png
1Ksh_T6H-MXQpoQ9QPx403_ROGpp99kdH  → hab-14.png
1sGVGlyfCziXNSuItDM5gz0WjrK0GyXOQ  → hab-15.png
1lRY_hmNARLrLT8fKThS4mEeMivCS6GQu  → hab-16.png
1XYVTGCotC5FJRXDLZh7J5py320pmoxAl  → hab-17.png
1n-XXCYaxin2dAbQPFZ6FLXjPwHzeZ1p2  → hab-18.png
1ss_ARPWYtf-ZX-hWIsh2TNlQIi6kH8Ol  → hab-19.png
```
*También hay imágenes en `pomarosa/assets/` del repo original.*

**Pixel ID Meta:** `1459620725920196`

---

## 3. Apartahotel CEO

**Carpeta destino:** `ceo/ceo.html` *(nueva — crear desde cero)*

| Campo | Valor |
|---|---|
| WhatsApp | `573022973380` |
| Instagram | `@apartahotelceo` |
| Facebook | `https://www.facebook.com/HotelCEOgroup/` |
| Dirección | Carrera 50 #58-74, Medellín (norte, cerca Estación Prado del Metro) |
| Check-in / out | 3:00 pm / 1:00 pm |
| Color acento | Azul acero (`#4A7FA5`) |

**Concepto:** Apartahotel para estadías cortas y largas. Totalmente equipado con cocina.

**Tipos de habitación:**
- Junior Suite con balcón (pareja): $140.000
- Sencilla — 1 persona con ventilador: $100.000 / con aire: $120.000
- Doble — 2 personas con ventilador: $120.000 / con aire: $140.000
- Triple — 3 personas con ventilador: $130.000 / con aire: $150.000
- Cuádruple — 4 personas con ventilador: $140.000 / con aire: $160.000

**Amenities:** Cocina equipada · Baño privado · Clóset · Aire acondicionado o ventilador · Algunas con ventana · Pet friendly 🐾

**Puntos de interés cercanos:** Parque Explora · Jardín Botánico · Planetario de Medellín · Parque Norte · Estación Prado (Metro)

**Fotos en Drive (habitaciones editadas) — 20 imágenes PNG (AI generadas):**
```
Carpeta habitaciones: https://drive.google.com/drive/folders/1t5DU2XwdHo2IGRqIcplBROMUCG3GZBUu
Carpeta espacios:     https://drive.google.com/drive/folders/12Mj9WBf0-bRzDBUB6TxCzljVwPy0HIZX

IDs habitaciones:
168dQccT_WauOkLQLZbBzM0NB7QVS1A38  → hab-01.png
1CWtIzegLUdhwSbCddYo3fS04V7j5vioS  → hab-02.png
1vHTIS1D_E2Kq45Ai1WFbmvbVDCsldhhQ  → hab-03.png
1zlDeMZuS1oVN6TIM7uaiDpNTce5OptSL  → hab-04.png
1R1ZYZ91wV11cFJdyqL474wu2gPSjE95B  → hab-05.png
1koIWR4ftdh5DqDumht7ImgRWe1jbbBj4  → hab-06.png
1cG4mgFuQMwFLNBvM77s2ulPFLhEBD79c  → hab-07.png
1XzQNNSf_HdyKjD82VedpZtDaCm4yAGZc  → hab-08.png
1cN02ZYPBIPgffnX8DuiE5hCmo0CvlkLC  → hab-09.png
1nonctRnJJrYgOIZH6dhW-AupGzPK7iLM  → hab-10.png
1sdsd4vHbzFReB3ggbYN8rpKj1iWUx8AB  → hab-11.png
19UWdDoHDGSPIX3ECr2kqXUx1PUzfMKqo  → hab-12.png
1H8IZ5WG4DWZ1SKDuk-69cMKU2EQuF1oO  → hab-13.png
1APNgMblebOp1bhhrJqLt_NnBWUwDzq_8  → hab-14.png
1mZHooMruB5BKm4Cpefvi0A9DPove6a_U  → hab-15.png
1ciDmzcXdn-fTWnoyeSXR0AJ8f-TXXK6F  → hab-16.png
1GxOZsWtfRxHCZ1BsYIHrtSwCS2bkV46T  → hab-17.png
10ZIJb9Pi46euFGglTMoa_UtCsC91hCYQ  → hab-18.png
1XYmVGYiN0mZyNBF5ZpxExuZoOyrMRuC7  → hab-19.png
1nm03WqxPi5l6Vaa46CuUBhJzl4hhAH_1  → ham-20.png
```

**Pixel ID Meta:** `1338506288376212`

---

## 4. Hotel History Center

**Carpeta destino:** `history/history.html` *(nueva — crear desde cero)*

| Campo | Valor |
|---|---|
| WhatsApp | `573246538020` |
| Instagram | `@hotelhistorycenter` |
| Facebook | `https://www.facebook.com/HostalHistoryOficial/` |
| Dirección | *(pendiente — buscar en Google Maps: "Hotel History Center Medellín")* |
| Color acento | Verde esmeralda oscuro (`#2D6A4F`) |

**Nota:** No hay PDF con info de habitaciones. Construir con info extraída de Instagram/web pública o dejando secciones de habitaciones con placeholder para completar.

**Fotos en Drive (habitaciones editadas) — 9 imágenes PNG (fotos reales):**
```
Carpeta habitaciones: https://drive.google.com/drive/folders/1z9bVHxGZZ--KTT3WtvNOSNBTajta-OEd
Carpeta espacios:     https://drive.google.com/drive/folders/1-zsjG2T40_BI1cu25ED--QXHwrUNhTUO

IDs habitaciones:
1iofCUkg7HKckrQ3JSAp_NlZGd12Zb8Xj  → hab-01.png
1RrFCVvqeAE0TT44nZdcD7dAoqKN7qSQI  → hab-02.png
1LQt6jfWvbDO024rWHHoHX5dcqLj40Wyz  → hab-03.png
1KTzhUoIrMB-5Vhux5kS3oKfQHLVmTBxL  → hab-04.png
1AXEePNMplt5t7HD-mqu32OFTKVcVNv1t  → hab-05.png
1wuw7Xy10A6uey-W6tkPl6STWGBqCWkPc  → hab-06.png
1CAVDd87cz2ivgLWXw7v1ECDm2xhqxk7z  → hab-07.png
1jIOc1vl6qWhdtnstCNt49zuXLtxy-Ioy  → hab-08.png
1LN1lJpBV9UEXarThOLC6YPuU7v963ftw  → hab-09.png
```

**Pixel ID Meta:** `2486606141789212`

---

## Script de descarga de imágenes

Ejecutar desde el terminal en la carpeta `miranet-webs/` antes de construir:

```bash
pip install gdown
python3 download-assets.py
```

---

## Contexto del design system

Revisar estos archivos como referencia de estilo:
- `novus/novus-laureles.html` — estructura HTML completa
- `oru-campestre/oru-campestre.html` — variante campestre
- `santo-tomas/santo-tomas.html` — finca con zonas recreativas
- `tierra-grata/tierra-grata.html` — eco hotel

Cada hotel tiene su propio color acento definido arriba. Mantener la misma estructura de secciones: Hero → Habitaciones → Amenities → Galería → Ubicación → CTA WhatsApp.
