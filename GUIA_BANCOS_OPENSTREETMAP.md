# 🏦 Integración de Bancos OpenStreetMap - GUÍA RÁPIDA

## ¿Qué se ha implementado?

Se ha integrado **Overpass API** (la base de datos abierta de OpenStreetMap) para cargar automáticamente **todos los bancos registrados** en la zona de Madrid en el mapa. Esto significa que:

✅ **Cobertura profesional**: El mapa ahora muestra decenas/cientos de bancos además de los que añadas manualmente  
✅ **Cero mantenimiento**: Los datos vienen de OSM, que se actualiza constantemente  
✅ **Call-to-action**: Los usuarios pueden dejar reseñas en bancos de OSM para que otros los conozcan  
✅ **Mejor UX**: Distintos iconos visuales (🏛️ para OSM, 📍 para Benchify)  

---

## Cómo funciona

### 1. **Carga de datos**
- Cuando el mapa se inicializa, carga:
  - ✅ Bancos de tu BD de Benchify (Firebase)
  - ✅ Bancos de OpenStreetMap en un radio de 3km (configurable)

### 2. **Visualización en el mapa**
- **Marcadores verdes 📍** = Bancos de Benchify (con reseñas locales)
- **Marcadores azules 🏛️** = Bancos de OpenStreetMap (sin reseñas aún)

### 3. **Evitar duplicados**
- El sistema automáticamente **no muestra duplicados** (si el mismo banco existe en ambas fuentes)
- Lo detecta calculando distancia: si dos bancos están a menos de 50 metros, se considera el mismo

### 4. **Crear reseña desde un banco OSM**
- Click en banco azul → Popup con opción "Crear Reseña"
- Redirige a `add-bench.html` con datos pre-rellenados (nombre, ubicación)
- El usuario añade su descripción y ratings
- Se guarda en Firebase como un banco normal de Benchify

---

## Archivos modificados

### ✅ **osm-banks-loader.js** (NUEVO)
Módulo que gestiona la carga de bancos de OpenStreetMap:
- `loadOSMBanks(lat, lng, radiusKm)` → Obtiene bancos de Overpass API
- `loadOSMBankMarkers(map, osmBanks)` → Renderiza marcadores en el mapa
- `mergeBankData(benchifyBanks, osmBanks)` → Combina datos sin duplicados

### 📝 **maps.js** (MODIFICADO)
- Importa el nuevo módulo `osm-banks-loader.js`
- En `initMap()`: ahora carga bancos de OSM + Benchify
- En `loadBenches()`: distingue visualmente entre ambos tipos

---

## Configuración personalizable

### Cambiar radio de búsqueda
En **maps.js**, línea ~27:
```javascript
const osmBanks = await loadOSMBanks(DEFAULT_COORDS[0], DEFAULT_COORDS[1], 3); // 3 = 3km
```
Cambia `3` por el radio que quieras (5, 10, etc.)

### Cambiar coordenadas del centro
En **maps.js**, línea ~13:
```javascript
const DEFAULT_COORDS = [40.416775, -3.703790]; // Madrid
```
Cambia estas coordenadas a tu ciudad

### Cambiar icono de bancos OSM
En **osm-banks-loader.js**, línea ~157:
```javascript
html: `<i class="fa-solid fa-building text-blue-500 text-2xl drop-shadow-md"></i>`,
```
Puedes cambiar el icono (fa-building, fa-landmark, etc.) o colores

---

## Datos que se obtienen de OSM para cada banco

- 🏪 **Nombre**: Nombre del banco
- 📍 **Ubicación**: Latitud/Longitud exacta
- 🏢 **Operador**: Nombre de la compañía (si está disponible)
- 📍 **Dirección**: Calle completa
- ☎️ **Teléfono**: Número de contacto (si está disponible)
- 🌐 **Website**: Sitio web oficial (si está disponible)

---

## Ventajas de esta implementación

| Aspecto | Beneficio |
|--------|----------|
| **Cobertura** | De 3 bancos a potencialmente 200+ |
| **Profesionalismo** | Los usuarios ven una web con mucho contenido |
| **Escalabilidad** | Sin coste: uses los datos públicos de OSM |
| **Gamificación** | Incentivar a usuarios para que dejen reseñas en bancos nuevos |
| **SEO** | Más contenido = mejor posicionamiento |
| **Confianza** | Datos de OpenStreetMap (fuente confiable) |

---

## Próximas mejoras sugeridas (opcional)

1. **Filtro de tipo**: Toggle para mostrar/ocultar bancos OSM
2. **Clustering**: Agrupar bancos cuando están muy cerca
3. **Estadísticas**: "23 bancos en OpenStreetMap, 5 con reseñas de Benchify"
4. **Importación masiva**: Botón para convertir bancos OSM a Benchify (con 1 clic)
5. **Caché local**: Guardar datos de OSM para que el mapa cargue más rápido

---

## Troubleshooting

### Q: No aparecen bancos azules
**A:** Puede ser que Overpass API esté saturada. Espera 1-2 minutos o intenta otra hora.

### Q: Aparecen duplicados
**A:** El rango de 50 metros para detectar duplicados puede ajustarse en `osm-banks-loader.js` línea ~75

### Q: Quiero cambiar el color de los iconos
**A:** Busca `text-blue-500` o `text-green-600` en los archivos y cámbialo a otro (text-red-600, text-purple-600, etc.)

---

**✨ ¡Tu web ahora tiene la cobertura y profesionalismo de un servicio consolidado!**
