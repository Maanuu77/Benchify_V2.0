# 🗺️ GUÍA RÁPIDA: Mapa Interactivo Funcional en Benchify

## ✅ Lo que YA está funcionando

Tu mapa interactivo ya tiene configurado:

1. **Leaflet.js** - Librería de mapas de código abierto
2. **Pines interactivos** - Mostrando ubicaciones de bancos
3. **Popups detallados** - Con imagen, ratings y descripción
4. **Filtros de búsqueda** - Por vistas, privacidad
5. **Estilos personalizados** - CSS optimizado para móvil

---

## 🚀 Cómo acceder al mapa

1. Abre tu navegador
2. Ve a: `http://localhost:5000/src/pages/map.html` (o la ruta de tu servidor local)
3. Deberías ver: **Madrid con 3 bancos marcados**

---

## 🎯 Características principales funcionando

### 📍 Pines Interactivos
- Haz clic en cualquier pin (ubicación) para ver el popup
- El popup muestra: Foto, nombre, distancia, ratings

### 🔍 Filtros
1. **Deslizador de Vistas**: Filtra por calidad de vistas (1-5 estrellas)
2. **Selector de Privacidad**: Privado o Concurrido
3. **Botón "Aplicar Filtros"**: Actualiza el mapa instantáneamente

### ➕ Añadir Banco
- Click en el botón verde "+ Añadir Banco" (abajo derecha)
- Te llevará a la página de `add-bench.html`

---

## 🔧 Personalización

### Cambiar la ubicación por defecto
Abre `src/js/maps.js` y modifica:
```javascript
const DEFAULT_COORDS = [40.416775, -3.703790]; // [Lat, Lng]
const DEFAULT_ZOOM = 13; // 1-20 (más alto = más zoom)
```

### Cambiar el estilo del mapa
En `src/js/maps.js`, en la función `initMap()`, busca:
```javascript
L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
```

**Opciones disponibles:**
- `voyager` - Estilo limpio y moderno (ACTUAL)
- `voyager_nolabels` - Sin etiquetas
- `positron` - Minimalista blanco
- `positron_nolabels` - Minimalista sin etiquetas

### Añadir más bancos
En `src/js/maps.js`, en el array `benchesData`, añade:
```javascript
{
    id: "bench_004",
    name: "Tu Banco",
    location: [40.4167, -3.7038], // Coordenadas [lat, lng]
    description: "Descripción",
    image: "URL_de_imagen",
    ratings: {
        views: 4,      // 1-5
        privacy: 3,    // 1-5
        comfort: 4     // 1-5
    },
    tags: ["Tag1", "Tag2"]
}
```

---

## 📱 Interactividad añadida

✅ **Búsqueda de ubicación**: Campo de búsqueda funcional (puedes mejorar con API)
✅ **Selector de privacidad**: Dropdown con opciones
✅ **Rango de vistas**: Deslizador ajustable
✅ **Botones de etiquetas**: Atardecer, Picnic, Pedida, Lectura
✅ **Responsive**: Funciona perfectamente en móvil

---

## 🎨 Estilos personalizados

Los siguientes estilos están en `src/assets/css/styles.css`:

- **Pines animados**: Efecto bounce al cargar
- **Popups mejorados**: Borde verde, sombra elegante
- **Controles del zoom**: Estilos personalizados
- **Efectos hover**: Pines brillan al pasar el mouse

---

## 🔌 Próximos pasos recomendados

### 1️⃣ Integrar Base de Datos (Firebase)
Reemplazar `benchesData` con datos de Firestore

### 2️⃣ Añadir Geolocalización
```javascript
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
        const userCoords = [position.coords.latitude, position.coords.longitude];
        map.setView(userCoords, 15);
    });
}
```

### 3️⃣ Geocodificación (Buscar ubicaciones por nombre)
Usar API de OpenStreetMap Nominatim o Google Geocoding

### 4️⃣ Marcador de Usuario
Mostrar dónde estás con un icono diferente

### 5️⃣ Rutas entre puntos
Integrar librería `Leaflet Routing Machine`

---

## 📚 Archivos clave

| Archivo | Función |
|---------|---------|
| `src/js/maps.js` | Lógica principal del mapa |
| `src/pages/map.html` | HTML del mapa |
| `src/assets/css/styles.css` | Estilos CSS |
| `src/js/map-config.js` | Configuración avanzada (nuevo) |

---

## 🐛 Solución de problemas

### El mapa no aparece
- ✅ Verifica que `leaflet.css` y `leaflet.js` estén en el HTML
- ✅ Asegúrate de que el div `#map` tenga altura definida

### Los pines no se ven
- ✅ Comprueba que Font Awesome esté cargado (`<link rel="stylesheet" href="...font-awesome...">`)
- ✅ Verifica las coordenadas en `benchesData`

### Los filtros no funcionan
- ✅ Abre la consola del navegador (F12) y busca errores
- ✅ Verifica que el botón tiene la clase correcta

---

## 🌐 Librerías utilizadas

- **Leaflet.js** - Mapas interactivos
- **Tailwind CSS** - Estilos
- **Font Awesome** - Iconos
- **CartoDB** - Tiles del mapa

---

## 💡 Tips pro

1. Los pins usan `L.divIcon` para permitir HTML personalizado
2. Los popups se crean con `marker.bindPopup(contenido)`
3. Los filtros usan `map.eachLayer()` para limpiar marcadores
4. El responsive se maneja con `map.invalidateSize()`

¡Tu mapa ya está listo para usar! 🎉
