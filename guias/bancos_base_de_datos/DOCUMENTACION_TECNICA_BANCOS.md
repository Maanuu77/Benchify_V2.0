# 🔧 Documentación Técnica: Sistema de Creación de Bancos

## 📚 API de Database.js

### 1. saveBench(benchData)

Crea un nuevo banco en Firestore.

**Parámetros:**
```javascript
{
  nombre: string,              // Requerido
  descripcion: string,         // Opcional, por defecto ""
  vistas: number,              // 1-5
  privacidad: number,          // 1-5
  comodidad: number,           // 1-5
  atmosfera: number,           // 1-5
  lat: number,                 // Latitud
  lng: number,                 // Longitud
  etiquetas: string[],         // Ej: ["Nuevo", "Popular"]
  fotoURL: string|null         // Opcional
}
```

**Retorna:** 
- Promise<string> - ID del documento creado

**Ejemplo de uso:**
```javascript
import { saveBench } from '../js/database.js';

const benchData = {
  nombre: "Banco Central",
  descripcion: "Un banco histórico",
  vistas: 5,
  privacidad: 4,
  comodidad: 5,
  atmosfera: 5,
  lat: 40.4168,
  lng: -3.7038,
  etiquetas: ["Nuevo", "Central"],
  fotoURL: null
};

try {
  const benchId = await saveBench(benchData);
  console.log("Banco creado:", benchId);
} catch (error) {
  console.error("Error:", error);
}
```

**Base de datos generada:**
```
Firestore > benchify-86edd
├── Bancos (colección)
│   └── auto_id_123456
│       ├── nombre: "Banco Central"
│       ├── descripcion: "Un banco histórico"
│       ├── coordenadas: {lat: 40.4168, lng: -3.7038}
│       ├── ratings: {vistas: 5, privacidad: 4, comodidad: 5, atmosfera: 5}
│       ├── fotoURL: null
│       ├── etiquetas: ["Nuevo", "Central"]
│       ├── userId: "anonimo"
│       ├── fecha_creacion: 1702123456789
│       └── fecha_actualizacion: null
```

---

### 2. uploadBenchPhoto(file, benchId)

Sube una imagen a Firebase Storage y retorna su URL pública.

**Parámetros:**
- `file: File` - Objeto File del input type="file"
- `benchId: string` - ID del banco para organizar carpetas

**Validaciones:**
- Tipos permitidos: image/jpeg, image/png, image/webp, image/gif
- Tamaño máximo: 5MB

**Retorna:**
- Promise<string> - URL pública de la imagen

**Errores:**
```javascript
// Formato no permitido
throw new Error('Formato de imagen no permitido. Usa JPG, PNG, WebP o GIF')

// Imagen muy grande
throw new Error('Imagen muy grande. Máximo 5MB')
```

**Ejemplo de uso:**
```javascript
import { uploadBenchPhoto } from '../js/database.js';

const fileInput = document.getElementById('fileInput');
const file = fileInput.files[0];

try {
  const photoURL = await uploadBenchPhoto(file, 'bench_123');
  console.log("Foto guardada:", photoURL);
  // Resultado: https://firebasestorage.googleapis.com/v0/b/benchify-86edd.appspot.com/o/bancos%2Fbench_123%2Ffoto-1702123456789?alt=media&token=abc123...
} catch (error) {
  console.error("Error al subir:", error.message);
}
```

**Almacenamiento en Storage:**
```
Firebase Storage > benchify-86edd.appspot.com
├── bancos/
│   └── bench_123/
│       ├── foto-1702123456789
│       ├── foto-1702134567890
│       └── ...
```

---

### 3. updateBench(benchId, updates)

Actualiza un banco existente.

**Parámetros:**
- `benchId: string` - ID del documento a actualizar
- `updates: object` - Campos a actualizar (cualquier estructura)

**Ejemplo de uso:**
```javascript
import { updateBench } from '../js/database.js';

try {
  await updateBench('bench_123', {
    fotoURL: 'https://firebasestorage.googleapis.com/...',
    descripcion: 'Nueva descripción actualizada'
  });
  console.log("Banco actualizado");
} catch (error) {
  console.error("Error:", error);
}
```

---

### 4. getAllBenches()

Obtiene todos los bancos de la base de datos.

**Retorna:**
- Promise<Array> - Array de bancos con estructura:
```javascript
[
  {
    id: "auto_id_123456",
    nombre: "Banco Central",
    descripcion: "...",
    coordenadas: {lat: 40.4168, lng: -3.7038},
    ratings: {vistas: 5, privacidad: 4, comodidad: 5, atmosfera: 5},
    fotoURL: "https://...",
    etiquetas: ["Nuevo"],
    userId: "anonimo",
    fecha_creacion: {...},
    fecha_actualizacion: null
  },
  // ... más bancos
]
```

**Ejemplo de uso:**
```javascript
import { getAllBenches } from '../js/database.js';

try {
  const bancos = await getAllBenches();
  console.log(`Se encontraron ${bancos.length} bancos`);
  
  bancos.forEach(banco => {
    console.log(`${banco.nombre} (${banco.ratings.vistas}/5 estrellas)`);
  });
} catch (error) {
  console.log("Error, devolviendo array vacío:", error);
  // Retorna [] en caso de error
}
```

---

## 📱 Flujo Completo en add-bench.html

### HTML Relevante

```html
<form id="addBenchForm">
  <input type="text" id="benchName" required placeholder="Nombre del banco">
  <textarea id="benchDesc" placeholder="Descripción..."></textarea>
  
  <!-- Foto -->
  <input type="file" id="benchPhoto" accept="image/*">
  <div id="photoPreview" style="display: none;">
    <img id="previewImage" src="">
    <button id="removePhotoBtn">Quitar foto</button>
  </div>
  
  <!-- Sliders (1-5) -->
  <input type="range" id="vistas" min="1" max="5" value="3">
  <input type="range" id="privacidad" min="1" max="5" value="3">
  <input type="range" id="comodidad" min="1" max="5" value="3">
  <input type="range" id="atmosfera" min="1" max="5" value="3">
  
  <!-- Ubicación (oculta) -->
  <input type="hidden" id="lat">
  <input type="hidden" id="lng">
  
  <button type="submit" id="saveBtn">Publicar Banco</button>
</form>
```

### JavaScript Completo

```javascript
import { saveBench, uploadBenchPhoto, updateBench } from '../js/database.js';

let selectedPhotoFile = null;

// 1. MANEJO DE FOTO
const photoInput = document.getElementById('benchPhoto');
photoInput.addEventListener('change', (e) => {
  selectedPhotoFile = e.target.files[0];
  // Mostrar preview...
  const reader = new FileReader();
  reader.readAsDataURL(selectedPhotoFile);
});

// 2. MANEJO DE SLIDERS
const sliders = ['vistas', 'privacidad', 'comodidad', 'atmosfera'];
sliders.forEach(id => {
  document.getElementById(id).addEventListener('input', (e) => {
    document.getElementById(`val-${id}`).textContent = e.target.value;
  });
});

// 3. GEOLOCALIZACIÓN
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition((pos) => {
    document.getElementById('lat').value = pos.coords.latitude;
    document.getElementById('lng').value = pos.coords.longitude;
  });
}

// 4. SUBMIT DEL FORMULARIO
document.getElementById('addBenchForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const benchData = {
    nombre: document.getElementById('benchName').value,
    descripcion: document.getElementById('benchDesc').value,
    vistas: parseInt(document.getElementById('vistas').value),
    privacidad: parseInt(document.getElementById('privacidad').value),
    comodidad: parseInt(document.getElementById('comodidad').value),
    atmosfera: parseInt(document.getElementById('atmosfera').value),
    lat: parseFloat(document.getElementById('lat').value),
    lng: parseFloat(document.getElementById('lng').value),
    etiquetas: ['Nuevo'],
    fotoURL: null
  };
  
  // Crear banco
  const benchId = await saveBench(benchData);
  
  // Subir foto si existe
  if (selectedPhotoFile) {
    const fotoURL = await uploadBenchPhoto(selectedPhotoFile, benchId);
    await updateBench(benchId, { fotoURL });
  }
  
  // Redirigir
  alert('✅ Banco publicado');
  window.location.href = 'map.html';
});
```

---

## 🔐 Configuración de Firebase

### Archivo: src/js/database.js

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyA4AAnIeIWg1cmXMnXtqeZMsQ_YyQNB0HI",
  authDomain: "benchify-86edd.firebaseapp.com",
  projectId: "benchify-86edd",
  storageBucket: "benchify-86edd.firebasestorage.app",
  messagingSenderId: "809519268011",
  appId: "1:809519268011:web:aca914994685a23eb437ee",
  measurementId: "G-72HS3F2N4R"
};
```

### Reglas Firestore (IMPORTANTE)

**archivo:** Firebase Console > Firestore > Seguridad > Reglas

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir leer todos los bancos
    match /Bancos/{document=**} {
      allow read;
      allow create: if request.auth != null || request.auth == null;
      allow update, delete: if request.auth.uid == resource.data.userId || request.auth == null;
    }
  }
}
```

### Reglas Storage

**archivo:** Firebase Console > Storage > Reglas

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /bancos/{allPaths=**} {
      allow read;
      allow create: if request.resource.size < 5 * 1024 * 1024 && 
                       request.resource.contentType.matches('image/.*');
      allow delete: if request.auth.uid == resource.metadata.userId;
    }
  }
}
```

---

## 📊 Casos de Prueba

### Test 1: Crear banco sin foto
```javascript
async function testCrearBancoSinFoto() {
  const benchData = {
    nombre: "Banco Test 1",
    descripcion: "Sin foto",
    vistas: 3,
    privacidad: 3,
    comodidad: 3,
    atmosfera: 3,
    lat: 40.4168,
    lng: -3.7038,
    etiquetas: ["Test"],
    fotoURL: null
  };
  
  const id = await saveBench(benchData);
  console.assert(id, "❌ Debería retornar un ID");
  console.log("✅ Banco creado sin foto:", id);
}
```

### Test 2: Subir foto válida
```javascript
async function testSubirFoto() {
  const file = new File([''], 'test.jpg', { type: 'image/jpeg' });
  const url = await uploadBenchPhoto(file, 'test-bench');
  console.assert(url.includes('firebasestorage'), "❌ URL inválida");
  console.log("✅ Foto subida:", url);
}
```

### Test 3: Validar foto rechazada
```javascript
async function testFotoInvalida() {
  const file = new File([''], 'test.pdf', { type: 'application/pdf' });
  try {
    await uploadBenchPhoto(file, 'test-bench');
  } catch (error) {
    console.assert(error.message.includes('Formato'), "❌ Mensaje de error incorrecto");
    console.log("✅ Rechazo correcto:", error.message);
  }
}
```

---

## 🚀 Performance

| Operación | Tiempo | Nota |
|-----------|--------|------|
| saveBench() | 200-500ms | Depende latencia Firebase |
| uploadBenchPhoto() (1MB) | 2-5s | Subida a Storage |
| uploadBenchPhoto() (5MB) | 10-20s | Máximo permitido |
| updateBench() | 100-300ms | Rápido |
| getAllBenches() | 500ms-2s | Con ~100 bancos |

---

## 🐛 Troubleshooting

### Error: "Firebase not initialized"
**Solución:** Verificar que database.js se importa correctamente antes de usar las funciones.

### Error: "Quota exceeded"
**Solución:** Posiblemente superaste límites de Firebase. Revisar console en Firebase Console.

### Foto no aparece después de crear
**Solución:** 
1. Verificar que `fotoURL` se actualiza en el documento
2. Revisar reglas de Storage en Firebase
3. Comprobar que URL es accesible (no expiró)

### Geolocalización no funciona
**Solución:**
1. Verificar que el sitio usa HTTPS (requerido)
2. Usuario debe permitir acceso a localización
3. GPS puede no estar disponible

---

**Última actualización:** Diciembre 2024
**Versión Firebase SDK:** 10.7.1
