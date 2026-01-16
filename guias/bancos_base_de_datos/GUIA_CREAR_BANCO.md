# 📱 Guía: Crear Banco Persistente en Benchify

## 🎯 ¿Qué hace esta funcionalidad?

Los usuarios pueden crear y publicar nuevos bancos directamente desde la aplicación. Los datos se guardan **permanentemente en Firebase** (no en localStorage), por lo que perduran para siempre y están disponibles para toda la comunidad.

## 📋 Campos del Formulario

### Información Básica
- **Nombre del Lugar** ⭐ (Requerido)
  - Ejemplo: "El rincón de los suspiros", "Banco del Parque Central"
  - Máximo: 100 caracteres
  
- **Descripción** (Opcional)
  - Cuéntale a otros por qué este banco es especial
  - Máximo: 500 caracteres

### Foto del Banco 📸 (Opcional)
- Soporta: JPG, PNG, WebP, GIF
- Tamaño máximo: 5MB
- Mostración: Preview antes de guardar
- Almacenamiento: Firebase Storage (URL permanente)
- Puedes remover la foto con el botón ✕

### Valoración ⭐ (Requerida)
El usuario debe evaluar 4 dimensiones (1-5 estrellas cada una):

1. **Calidad de Vistas**: ¿Qué tan bonitas son las vistas desde el banco?
2. **Nivel de Privacidad**: ¿Qué tan aislado está del bullicio?
3. **Comodidad / Diseño**: ¿Qué tan cómodo es sentarse?
4. **Atmósfera**: ¿Qué sensación general genera el lugar?

### Ubicación 📍
- Se detecta automáticamente desde GPS (geolocalización)
- Por defecto: Madrid (40.4167, -3.7037)
- Se envía al formulario como coordenadas (lat, lng)

## 🔐 Persistencia en Firebase

### Estructura de Datos Guardada

```json
{
  "Bancos": {
    "doc_id_auto_generado": {
      "nombre": "El rincón de los suspiros",
      "descripcion": "Banco perfecto para propuestas...",
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
      "fotoURL": "https://firebase-storage-url...",
      "etiquetas": ["Nuevo"],
      "userId": "user_uid_or_anonimo",
      "fecha_creacion": "timestamp_de_firebase",
      "fecha_actualizacion": "timestamp_si_se_edita"
    }
  }
}
```

### Almacenamiento de Fotos

Las imágenes se suben a **Firebase Storage** en la ruta:
```
gs://benchify-86edd.firebasestorage.app/bancos/{benchId}/foto-{timestamp}
```

Después de subir, se genera una **URL pública permanente** que se guarda en el documento.

## 🛠️ Tecnología Detrás

### Archivos Involucrados

1. **[src/pages/add-bench.html](src/pages/add-bench.html)** - Formulario HTML
   - Campos de entrada
   - Preview de foto
   - Geolocalización automática

2. **[src/assets/css/add-bench.css](src/assets/css/add-bench.css)** - Estilos
   - Diseño responsivo
   - Preview de foto
   - Mensajes de error

3. **[src/js/database.js](src/js/database.js)** - Funciones Firebase
   - `saveBench()` - Crear banco
   - `uploadBenchPhoto()` - Subir foto
   - `updateBench()` - Actualizar banco después de foto
   - `getAllBenches()` - Obtener todos para el mapa

### Flujo de Guardado

```
1. Usuario completa formulario
2. Hace clic en "Publicar Banco"
3. Se validan los campos requeridos
4. Se crea documento en Firestore (colección "Bancos")
5. Si hay foto:
   a. Se sube a Firebase Storage
   b. Se obtiene URL pública
   c. Se actualiza el documento con la URL
6. Se muestra "✅ ¡Guardado!"
7. Se redirige a map.html

```

## 🎨 Validaciones y Errores

- ❌ Nombre vacío → "Por favor, ingresa el nombre del banco"
- ❌ Formato de imagen invalido → "Formato no permitido. Usa JPG, PNG, WebP o GIF"
- ❌ Imagen > 5MB → "Imagen muy grande. Máximo 5MB"
- ❌ Error Firebase → Muestra error específico

## 🗺️ Integración con Mapa

Los bancos creados aparecen automáticamente en el mapa porque:

1. `map.html` llama a `getAllBenches()` desde database.js
2. Esa función obtiene **todos** los documentos de "Bancos"
3. Los nuevos bancos se muestran como pins en Leaflet.js

## 📝 Casos de Uso

### Caso 1: Banco sin foto
```
Nombre: "El Banco del Parque"
Descripción: "Muy tranquilo"
Vistas: 4, Privacidad: 5, Comodidad: 3, Atmósfera: 4
Sin foto
→ Se guarda al instante
```

### Caso 2: Banco con foto
```
Nombre: "Plaza Mayor - Banco Antiguo"
Descripción: "Históricamente importante"
Foto: imagen.jpg (2MB)
→ Tarda más por subida de foto, pero se guarda permanentemente
```

## 🔧 Requisitos

- ✅ Conexión a Internet
- ✅ Permisos de geolocalización (opcional)
- ✅ Firebase configurado (ya está)
- ✅ Navegador moderno (ES6+, Fetch API)

## 📊 Estadísticas

- Bancos creados: Se reflejan en `b2b-stats.html` (campo "Bancos Totales")
- Rating promedio: Calculado en dashboard
- Cobertura geográfica: Visible en el mapa

## 🚀 Próximas Mejoras

- [ ] Editar banco después de crearlo
- [ ] Eliminar bancosCreados por error
- [ ] Galería de múltiples fotos
- [ ] Comentarios y reseñas en cada banco
- [ ] Historial de cambios
- [ ] Exportar bancos a PDF

---

**Última actualización:** Diciembre 2024
**Firebase Config:** Detecta automáticamente desde [src/js/database.js](src/js/database.js)
