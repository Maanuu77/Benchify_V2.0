# Estructura de carpetas - src/js/

## 📁 Organización del código JavaScript

```
src/js/
├── core/
│   ├── firebase-init.js      → Inicialización de Firebase
│   └── database.js           → Funciones CRUD de bancos
│
├── map/
│   ├── map-loader.js         → Inicializador del mapa (IIFE)
│   └── map-config.js         → Configuración y utilidades de Leaflet
│
├── forms/
│   └── add-bench-handler.js  → Manejador del formulario de crear banco
│
└── osm/
    ├── osm-banks-loader.js   → Cargador de bancos desde OpenStreetMap
    └── osm-bank-prefill.js   → Pre-relleno automático desde OSM
```

## 🎯 Propósito de cada carpeta

### **core/** - Base de datos y configuración
- **firebase-init.js**: Inicializa Firebase y exporta db, auth, storage
- **database.js**: CRUD completo (crear, leer, actualizar bancos)

### **map/** - Funcionalidad del mapa
- **map-loader.js**: IIFE que inicializa Leaflet al cargar DOM
- **map-config.js**: Configuración de capas, iconos, funciones utilitarias

### **forms/** - Manejo de formularios
- **add-bench-handler.js**: Captura datos y guarda en Firebase

### **osm/** - Integración con OpenStreetMap
- **osm-banks-loader.js**: Consulta Overpass API y obtiene bancos
- **osm-bank-prefill.js**: Pre-rellena formulario desde datos de OSM

## 🔗 Dependencias entre módulos

```
map.html
  ↓
  ├─→ core/database.js
  │   └─→ core/firebase-init.js
  │
  └─→ map/map-loader.js
      └─→ (window.getAllBenches desde database.js)
```

```
add-bench.html
  ↓
  ├─→ core/database.js
  │   └─→ core/firebase-init.js
  │
  └─→ osm/osm-bank-prefill.js
      └─→ forms/add-bench-handler.js
```

## 📝 Cómo actualizar referencias

Si cambias una ruta, actualiza los imports en:

1. **En HTML**: `<script src="...">` y `import {...} from "..."`
2. **En JS**: `import {...} from "..."`

Ejemplo:
```javascript
// ✅ CORRECTO
import { getAllBenches } from '../core/database.js';

// ❌ INCORRECTO
import { getAllBenches } from '../database.js';
```

## 🔄 Flujos principales

### Flujo 1: Ver mapa con bancos
1. `map.html` carga
2. `map/map-loader.js` se ejecuta (IIFE)
3. Llama a `window.getAllBenches()` (desde `core/database.js`)
4. Renderiza marcadores en Leaflet

### Flujo 2: Crear banco desde OSM
1. Usuario click en banco azul (OSM)
2. `osm/osm-banks-loader.js` guarda en sessionStorage
3. Redirige a `add-bench.html?fromOSM=true`
4. `osm/osm-bank-prefill.js` detecta y pre-rellena
5. Usuario rellena formulario
6. `forms/add-bench-handler.js` guarda en Firebase via `core/database.js`

---

**Última actualización:** Enero 2026
