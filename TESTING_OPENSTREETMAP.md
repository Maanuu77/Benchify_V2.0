# 🧪 GUÍA DE TESTING - BANCOS OPENSTREETMAP

## ✅ Checklist de Verificación

### 1️⃣ **TEST BÁSICO: Mapa carga con bancos**

**Pasos:**
1. Abre `src/pages/map.html`
2. Abre consola del navegador (F12 → Console)
3. Espera 3-5 segundos

**Resultado esperado:**
- ✅ Console debe mostrar: `"✅ Cargados XX bancos desde OpenStreetMap"`
- ✅ Console debe mostrar: `"✅ Mapa inicializado con X bancos de Benchify y XX de OpenStreetMap"`
- ✅ En el mapa deben aparecer:
  - 🟢 **Marcadores verdes** (tus bancos de Benchify, si existen)
  - 🔵 **Marcadores azules** (bancos de OpenStreetMap)

**Debug si falla:**
- Si solo ves verdes: Overpass API puede estar lenta → Intenta en 1 minuto
- Si ves errores de CORS: Es problema de Overpass → Espera/recarga
- Si no ves nada: Verifica que Leaflet está cargado (`L` está disponible)

---

### 2️⃣ **TEST INTERACCIÓN: Popup de banco OSM**

**Pasos:**
1. Abre mapa y localiza un **marcador azul** (banco OSM)
2. Haz click en el marcador
3. Se debe abrir un popup

**Resultado esperado:**
- ✅ Popup muestra:
  - 🏛️ Nombre del banco (ej: "BBVA")
  - Operador (si disponible)
  - Dirección (si disponible)
  - Teléfono (si disponible)
  - Website (si disponible)
  - Mensaje: "¿Has visitado este banco?"
  - **Botón azul: "Crear Reseña"**

**Ejemplo:**
```
┌──────────────────────────┐
│ 🏛️ BBVA                │
│ Operador: BBVA          │
│ Dir: Calle Gran Vía 30  │
│ Tel: +34 91 2345678     │
│ Web: www.bbva.es        │
│                          │
│ 💡 ¿Has visitado este..│
│ ¡Sé el primero!        │
│                          │
│ [Crear Reseña]         │
└──────────────────────────┘
```

---

### 3️⃣ **TEST FLUJO: Crear reseña desde OSM**

**Pasos:**
1. Click en banco OSM (azul) → Se abre popup
2. Click botón "Crear Reseña"
3. **DEBE redireccionar a `add-bench.html?fromOSM=true&osmId=...`**

**Resultado esperado:**
- ✅ Se abre formulario "Registrar Nuevo Banco"
- ✅ **Banner azul** en la parte superior diciendo:
  - "🏛️ BBVA es un banco registrado en OpenStreetMap"
  - "Datos pre-cargados. ¡Ahora cuéntanos tu experiencia!"
- ✅ Campo "Nombre" pre-rellenado con el nombre del banco (con fondo amarillo)
- ✅ Mapa centrado en la ubicación del banco (con marcador azul)
- ✅ Coordenadas (lat/lng) visibles en formulario

**Debug si falla:**
- Si no redirige: Verifica que `osm-bank-prefill.js` está importado en `add-bench-handler.js`
- Si formulario no se rellena: Abre F12 → Console → Busca errores de JavaScript
- Si no hay banner: Verifica que `showOSMInfoBanner()` se ejecutó (check console)

---

### 4️⃣ **TEST COMPLETO: Crear reseña y guardar**

**Pasos:**
1. Sigue test anterior hasta tener formulario rellenado
2. **Rellena manualmente:**
   - Descripción: "Banco muy bien ubicado..."
   - Ratings: Vistas ⭐⭐⭐⭐, Privacidad ⭐⭐⭐, etc.
   - Etiquetas: Selecciona al menos una
3. Click "Guardar"

**Resultado esperado:**
- ✅ Mensaje de éxito: "Banco registrado exitosamente"
- ✅ Redirige a `map.html`
- ✅ El banco ahora aparece con **marcador verde** en el mapa
- ✅ Popup muestra tu reseña con ratings

**Debug si falla:**
- Si no se guarda: Verifica que Firebase está conectado
- Si error de autenticación: Inicia sesión primero
- Si no aparece en mapa: Recarga la página (F5)

---

### 5️⃣ **TEST DATOS: Verificar bancos en Console**

**En Console del navegador:**
```javascript
// Ver cuántos bancos se cargaron
console.log(benchesData.length)

// Ver primer banco de OSM
console.log(benchesData.find(b => b.isOSMBank))

// Ver estructura de un banco OSM
/*
Debe mostrar:
{
  id: "osm_12345678",
  name: "BBVA",
  location: [40.416, -3.703],
  description: "Banco de OpenStreetMap",
  osmId: 12345678,
  isOSMBank: true,
  operador: "BBVA",
  direccion: "Calle Principal, 45",
  website: "https://www.bbva.es",
  telefono: "+34 91 2345678",
  ratings: { vistas: 0, privacidad: 0, ... }
}
*/
```

---

### 6️⃣ **TEST PERFORMANCE: Velocidad de carga**

**Pasos:**
1. Abre F12 → Network
2. Recarga página con F5
3. Espera a que se cargue

**Métrica esperada:**
- Overpass API: **< 3 segundos** (puede ser lento si servicio está saturado)
- Firebase: **< 1 segundo**
- Renderizado total: **< 5 segundos**

**Ejemplo de tiempos:**
```
[00:00] Página empieza a cargar
[00:05] Firebase cargado (3 bancos)
[00:10] Overpass responde (25 bancos OSM)
[00:15] Mapa renderizado completamente
```

Si tarda más: Overpass API puede estar lenta (problema externo, no tuyo)

---

### 7️⃣ **TEST DUPLICADOS: Evita mostrar bancos repetidos**

**Pasos:**
1. Si un banco de Benchify y uno de OSM están **muy cerca** (<50m)
2. Solo debe mostrarse uno (el de Benchify)

**Cómo verificar:**
- En console: `benchesData.length` = número total mostrado
- Si hay 3 de Benchify + 25 de OSM = máximo 28 total
- Si hay duplicados, el número será menor (correcto)

---

## 🐛 ERRORES COMUNES Y SOLUCIONES

### ❌ "CORS error" o "Failed to fetch"
**Causa:** Overpass API rechaza la solicitud
**Solución:** Es temporal. Intenta recargar en 1-2 minutos. Overpass API es gratis y a veces se satura.

### ❌ "No se ven bancos azules"
**Causa:** Overpass API respondió pero vacío (poco probable)
**Solución:** 
- Verifica zona: ¿Estás en Madrid? `DEFAULT_COORDS = [40.416775, -3.703790]`
- Aumenta radio: Cambia `3` a `5` km en `maps.js` línea ~27

### ❌ "Formulario no se rellena desde OSM"
**Causa:** `osm-bank-prefill.js` no está importado
**Solución:** 
- Abre `add-bench-handler.js`
- Verifica que tiene: `import { initOSMBankPreFill } from '../js/osm-bank-prefill.js';`

### ❌ "Los datos no se guardan en Firebase"
**Causa:** Usuario no autenticado o error de BD
**Solución:**
- Inicia sesión primero
- Verifica que Firebase está correctamente configurado en `firebase-init.js`

### ❌ "Mapa no aparece en `add-bench.html`"
**Causa:** Leaflet no está cargado antes
**Solución:** Verifica que `<script src="leaflet.min.js"></script>` está en `<head>`

---

## 📊 MONITOREO CONTINUO

### Mantén abierto en otra ventana:
```javascript
// En Console, pega esto:
setInterval(() => {
  console.clear();
  console.log(`📍 Total bancos: ${benchesData.length}`);
  const benchify = benchesData.filter(b => !b.isOSMBank).length;
  const osm = benchesData.filter(b => b.isOSMBank).length;
  console.log(`🟢 Benchify: ${benchify}`);
  console.log(`🔵 OSM: ${osm}`);
}, 5000);
```

Esto te mostrará cada 5 segundos cuántos bancos hay cargados.

---

## ✨ TEST EXITOSO SIGNIFICA:

- ✅ Mapa carga rápido
- ✅ Bancos verdes + azules visibles
- ✅ Popups funcionan
- ✅ Puedes crear reseña desde bancos OSM
- ✅ Datos se guardan en Firebase
- ✅ Console sin errores rojos

**¡Entonces la integración está lista para producción!**

---

## 📞 PROBLEMAS PERSISTENTES

Si algo no funciona después de seguir estos tests:

1. **Abre Console (F12)** y copia todos los errores rojos
2. **Comprueba que:**
   - `osm-banks-loader.js` existe en `/src/js/`
   - `osm-bank-prefill.js` existe en `/src/js/`
   - Ambos están importados en `maps.js` y `add-bench-handler.js`
3. **Recarga la página** (Ctrl+Shift+R - hard refresh)
4. **Borra caché** si es necesario (Ctrl+Shift+Delete)

---

**🎉 ¡Una vez pasen todos estos tests, tu integración de OpenStreetMap está lista!**
