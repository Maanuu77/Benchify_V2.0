# 📊 Diagrama del Sistema de Creación de Bancos

## Flujo de Usuario

```
┌─────────────────────────────────────────────────────────────┐
│                    USUARIO ABRE add-bench.html               │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
           ┌───────────────────────────────┐
           │  Página de Crear Nuevo Banco   │
           │  ✓ Campo nombre                │
           │  ✓ Campo descripción           │
           │  ✓ Selector foto (opcional)    │
           │  ✓ 4 Sliders (vistas, etc)     │
           │  ✓ Ubicación (auto GPS)        │
           └───────────────┬────────────────┘
                           │
                           ▼
        ┌──────────────────────────────────┐
        │  Usuario selecciona foto (opt)     │
        │  • Validar formato (JPG/PNG/...)  │
        │  • Validar tamaño (max 5MB)        │
        │  • Mostrar preview                 │
        └──────────────────┬────────────────┘
                           │
                           ▼
        ┌──────────────────────────────────┐
        │  Usuario ajusta sliders (1-5)     │
        │  • Vistas (paisaje)                │
        │  • Privacidad                      │
        │  • Comodidad                       │
        │  • Atmósfera                       │
        └──────────────────┬────────────────┘
                           │
                           ▼
        ┌──────────────────────────────────┐
        │  Usuario hace clic en              │
        │  "Publicar Banco"                  │
        └──────────────────┬────────────────┘
                           │
                           ▼
        ┌──────────────────────────────────┐
        │  VALIDAR DATOS                     │
        │  ✓ Nombre no vacío                 │
        │  ✓ Ubicación válida                │
        │  Si error → mostrar alerta         │
        └──────────────────┬────────────────┘
                           │
                   ┌───────┴───────┐
                   │               │
        ERROR      │      ✓        │ OK
        ────────────►             │
        (Cancelar)   ▼
                   ┌──────────────────────────────────┐
                   │  GUARDAR BANCO EN FIRESTORE      │
                   │  1. Crear documento en "Bancos"  │
                   │  2. Campos: nombre, ratings, etc │
                   │  3. Obtener ID del documento     │
                   └──────────────────┬───────────────┘
                                      │
                            ┌─────────▼──────────┐
                            │ ¿Hay foto?         │
                            └─────┬──────────┬──┘
                                  │          │
                            NO    │          │ SÍ
                                  │          │
                            ┌─────▼──┐    ┌─▼──────────────┐
                            │  FIN   │    │ SUBIR FOTO A   │
                            │        │    │ FIREBASE       │
                            └────────┘    │ STORAGE        │
                                          └─┬──────────────┘
                                            │
                                    ┌───────▼──────────┐
                                    │ OBTENER URL      │
                                    │ PÚBLICA          │
                                    └─┬────────────────┘
                                      │
                                ┌─────▼──────────────┐
                                │ ACTUALIZAR BANCO   │
                                │ CON fotoURL        │
                                └─┬──────────────────┘
                                  │
                            ┌─────▼──────────────┐
                            │ ✅ ÉXITO           │
                            │ Mostrar mensaje    │
                            │ "¡Guardado!"       │
                            └─┬──────────────────┘
                              │
                        ┌─────▼──────────────┐
                        │ Redirigir a        │
                        │ map.html           │
                        │ (mostrar nuevo     │
                        │ banco en el mapa)  │
                        └────────────────────┘
```

---

## Arquitectura de Datos

```
BENCHIFY APP
│
├─ index.html ─────────────┐
│                           │
├─ src/pages/              │
│  ├─ add-bench.html ◄─────┤ (Crear banco)
│  ├─ map.html              │ (Ver todos)
│  ├─ favorites.html        │ (Favoritos)
│  └─ bench-card.html ◄─────┤ (Detalle)
│
├─ src/js/                 │
│  ├─ database.js ◄────────┤
│  │  ├─ saveBench()
│  │  ├─ uploadBenchPhoto()
│  │  ├─ updateBench()
│  │  └─ getAllBenches()
│  ├─ auth.js
│  ├─ maps.js
│  └─ ...
│
└─ src/assets/css/
   ├─ add-bench.css ◄─────────┘
   ├─ styles.css
   └─ ...

FIREBASE (Cloud)
│
├─ Firestore Database
│  └─ Bancos (colección)
│     ├─ doc_001
│     │  ├─ nombre
│     │  ├─ descripcion
│     │  ├─ coordenadas: {lat, lng}
│     │  ├─ ratings: {vistas, privacidad, comodidad, atmosfera}
│     │  ├─ fotoURL (opcional)
│     │  ├─ etiquetas
│     │  ├─ userId
│     │  └─ fecha_creacion
│     └─ doc_002, doc_003, ...
│
└─ Storage
   └─ bancos/
      ├─ doc_001/
      │  └─ foto-1702123456789.jpg
      └─ doc_002/
         └─ foto-1702234567890.png
```

---

## Ciclo de Vida de un Banco

### Fase 1: Creación (add-bench.html)
```
[Usuario rellena formulario]
                │
                ▼
        [Validar datos]
                │
                ▼
        [saveBench()] ──────► Firestore
                             (Banco guardado)
```

### Fase 2: Subida de Foto (opcional)
```
[uploadBenchPhoto()]
        │
        ├─ Validar archivo
        ├─ Subir a Storage
        ├─ Obtener URL pública
        │
        ▼
[updateBench()] ──────► Firestore
                       (Actualizar fotoURL)
```

### Fase 3: Visualización (map.html)
```
[getAllBenches()]
        │
        ▼
[Leer todos de Firestore]
        │
        ▼
[Renderizar pins en mapa]
        │
        ▼
[Usuario ve banco creado]
```

### Fase 4: Interacción (bench-card.html)
```
[Usuario hace clic en pin]
        │
        ▼
[Mostrar detalle del banco]
├─ Foto (si existe)
├─ Ratings con estrellas
├─ Descripción
├─ Botón "Añadir a favoritos"
└─ Compartir en redes
```

---

## Validaciones

```javascript
// add-bench.html - JavaScript

✓ Validación de Nombre
  ├─ Requerido
  ├─ No puede ser solo espacios
  └─ Máximo 100 caracteres

✓ Validación de Foto
  ├─ Tipo: image/jpeg, image/png, image/webp, image/gif
  ├─ Tamaño: máximo 5MB
  └─ Retornar error antes de subir

✓ Validación de Sliders
  ├─ Rango: 1-5
  ├─ Tipo: number
  └─ Todos requeridos

✓ Validación de Ubicación
  ├─ Latitud válida (-90 a 90)
  ├─ Longitud válida (-180 a 180)
  └─ Por defecto: Madrid (40.4167, -3.7037)
```

---

## Base de Datos - Ejemplo Real

### Documento creado en Firestore

```json
{
  "id": "KxH2jQ8mPn3fL1vY4zZ",
  "nombre": "El Banco de los Suspiros",
  "descripcion": "El lugar perfecto para propuestas de matrimonio. Ubicado en el parque central, ofrece vistas hermosas del atardecer.",
  "coordenadas": {
    "lat": 40.4521,
    "lng": -3.6891
  },
  "ratings": {
    "vistas": 5,
    "privacidad": 4,
    "comodidad": 5,
    "atmosfera": 5
  },
  "fotoURL": "https://firebasestorage.googleapis.com/v0/b/benchify-86edd.appspot.com/o/bancos%2FKxH2jQ8mPn3fL1vY4zZ%2Ffoto-1702123456789.jpg?alt=media&token=AbCdEfGhIjKlMnOpQrStUvWxYz",
  "etiquetas": ["Nuevo", "Romántico"],
  "userId": "anonimo",
  "fecha_creacion": {
    "_seconds": 1702123456,
    "_nanoseconds": 789000000
  },
  "fecha_actualizacion": null
}
```

---

## Estadísticas de Almacenamiento

```
Total Bencos: 10
├─ Con foto: 7
│  ├─ JPG: 5 (media 2.3 MB)
│  └─ PNG: 2 (media 1.8 MB)
└─ Sin foto: 3

Storage usado: ~15.6 MB
Database usado: ~45 KB (muy pequeño)
```

---

## Flujo de Errores

```javascript
// En add-bench.html

addEventListener('submit', async (e) => {
  try {
    // Crear banco
    const benchId = await saveBench(benchData);
    
    // Subir foto
    if (selectedPhotoFile) {
      const url = await uploadBenchPhoto(file, benchId);
      
      // Actualizar con URL
      await updateBench(benchId, { fotoURL: url });
    }
    
    // ✅ Éxito
    alert('✅ Banco publicado');
    
  } catch (error) {
    // ❌ Error
    console.error(error);
    alert('❌ Error: ' + error.message);
    // Restaurar botón
    btn.disabled = false;
  }
});
```

---

## Integración con otras páginas

### map.html
```javascript
import { getAllBenches } from '../js/database.js';

async function cargarBancos() {
  const bancos = await getAllBenches();
  
  bancos.forEach(banco => {
    // Crear pin en mapa
    L.marker([banco.coordenadas.lat, banco.coordenadas.lng])
      .bindPopup(`
        <h3>${banco.nombre}</h3>
        <p>⭐ ${banco.ratings.atmosfera}/5</p>
        <a href="bench-card.html?id=${banco.id}">Ver detalle</a>
      `)
      .addTo(map);
  });
}
```

### b2b-stats.html
```javascript
import { getAllBenches } from '../js/database.js';

async function actualizarEstadisticas() {
  const bancos = await getAllBenches();
  
  // Actualizar card
  document.querySelector('[data-stat="bancos-totales"]')
    .textContent = bancos.length;
  
  // Rating promedio
  const ratingPromedio = bancos.reduce((sum, b) => 
    sum + (b.ratings.vistas + b.ratings.privacidad + 
           b.ratings.comodidad + b.ratings.atmosfera) / 4, 0) / bancos.length;
  
  document.querySelector('[data-stat="rating-promedio"]')
    .textContent = ratingPromedio.toFixed(1);
}
```

---

**Diagrama creado:** Diciembre 2024
**Componentes:** add-bench.html, database.js, Firebase Firestore, Firebase Storage
