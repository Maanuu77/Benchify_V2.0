# Guía: Importar Base de Datos en Firebase

Este documento explica cómo importar la estructura de base de datos de Benchify en Firebase Firestore.

## 📋 Contenido del Archivo JSON

El archivo `firebase_database_estructura.json` contiene:

### Colecciones principales:

1. **Bancos** - Colección principal con documentos de bancos
   - Campos: nombre, descripcion, coordenadas, ratings, fotoURL, etiquetas, userId, fecha_creacion, fecha_actualizacion

2. **users** - Colección de usuarios del sistema
   - Campos: email, nombre, tipo_usuario, favorites, fecha_registro, bio

3. **Bancos/{benchId}/reviews** - Subcolecciones de reseñas por banco
   - Campos: author, authorId, rating, text, timestamp

## 🚀 Opciones de Importación

### Opción 1: Usando Firebase Console (Recomendado para principiantes)

**Nota:** Firebase Console no permite importar JSON directamente. Debes usar una herramienta.

### Opción 2: Usando Firebase CLI (Recomendado)

#### Requisitos:
- Node.js instalado
- Firebase CLI instalada

#### Pasos:

1. **Instalar Firebase CLI** (si no lo tienes):
   ```bash
   npm install -g firebase-tools
   ```

2. **Loguarte en Firebase**:
   ```bash
   firebase login
   ```

3. **Navegar al directorio del proyecto** (donde está `firebase_database_estructura.json`):
   ```bash
   cd c:\Users\Alumno\Desktop\Visual Studio\Benchify_V2.0
   ```

4. **Importar datos usando Firestore Import/Export** (mediante Cloud Shell o herramienta alternativa):
   - Ve a https://console.firebase.google.com
   - Selecciona tu proyecto "benchify-86edd"
   - Abre la consola en la esquina inferior derecha
   - Ejecuta:
   ```bash
   gcloud firestore import gs://TU_BUCKET/firebase_database_estructura.json
   ```

### Opción 3: Usando una Herramienta Web (Más fácil)

#### Opción 3a: Firestore Backup & Restore (Recomendado)

1. Ve a: https://firestore-backup-restore.web.app/

2. Conecta tu cuenta de Firebase y selecciona el proyecto "benchify-86edd"

3. Selecciona la opción **"Restore"** y sube el archivo `firebase_database_estructura.json`

4. Confirma la restauración

#### Opción 3b: Firebase Studio

1. Ve a: https://www.firebasestudio.com/

2. Conecta tu proyecto

3. Importa el JSON y crea las colecciones

### Opción 4: Importación Manual desde Firebase Console

1. **Ve a Firebase Console**: https://console.firebase.google.com/

2. **Selecciona tu proyecto**: "benchify-86edd"

3. **Abre Firestore Database**

4. **Crear colecciones manualmente**:
   - Click en "Crear colección" → "Bancos"
   - Añade un documento de prueba
   - Repite para "users"

5. **Importa los datos del JSON** usando el panel de desarrollo de la consola o copia-pega manualmente

## ✅ Verificar la Importación

Después de importar:

1. Ve a **Firebase Console** → tu proyecto → **Firestore Database**

2. Verifica que existan las colecciones:
   - `Bancos` (debe tener 5 documentos)
   - `users` (debe tener 5 documentos)

3. Expande `Bancos/banco_001` y verifica los campos

### Crear Subcolecciones de Reviews (Manual)

Las reviews se deben crear manualmente dentro de cada banco:

1. Abre Firebase Console → Firestore Database
2. Haz click en un documento banco, por ejemplo `Bancos/banco_001`
3. Click en **Crear colección** → escribe `reviews`
4. Click en **Crear documento automático** y agrega los datos:

```json
{
  "author": "María",
  "authorId": "user_456",
  "rating": 5,
  "text": "Lugar absolutamente mágico...",
  "timestamp": "2024-01-15T16:45:00Z"
}
```

Repite esto para cada banco que necesite reviews (puedes usar el script de ejemplo en el siguiente apartado).

### Opción: Crear Reviews Automáticamente (Recomendado)

Para automatizar la creación de reviews:

1. Abre tu navegador en `index.html`
2. Abre la consola (F12)
3. Copia y ejecuta este comando:

```javascript
import { crearReviewsDeEjemplo } from './src/js/crear-reviews-ejemplo.js';
await crearReviewsDeEjemplo();
```

Esto creará automáticamente todas las 8 reviews en sus respectivos bancos.

## 🔐 Reglas de Seguridad

No olvides **actualizar las reglas de seguridad de Firestore** después de importar los datos:

1. Ve a **Firestore Database** → **Rules**

2. Reemplaza el contenido con el archivo `firestore.rules` incluido en el proyecto

3. Click en **Publicar**

## 📝 Estructura de Datos Explicada

### Documento Banco (ejemplo):
```json
{
  "nombre": "Banco Central Plaza Mayor",
  "descripcion": "Descripción del banco",
  "coordenadas": {
    "lat": 40.415363,
    "lng": -3.707398
  },
  "ratings": {
    "vistas": 5,
    "privacidad": 4,
    "comodidad": 4,
    "atmosfera": 5
  },
  "fotoURL": null,
  "etiquetas": ["Perfecto para pedida", "Romántico"],
  "userId": "user_123",
  "fecha_creacion": "2024-01-15T10:30:00Z",
  "fecha_actualizacion": "2024-01-15T10:30:00Z"
}
```

### Documento Usuario:
```json
{
  "email": "juan@example.com",
  "nombre": "Juan García",
  "tipo_usuario": "Standard|Fotógrafo|Ayuntamiento",
  "favorites": ["banco_001", "banco_003"],
  "fecha_registro": "2024-01-10T08:00:00Z",
  "bio": "Descripción del usuario"
}
```

### Documento Review (subcolección):
```json
{
  "author": "María",
  "authorId": "user_456",
  "rating": 5,
  "text": "Texto de la reseña",
  "timestamp": "2024-01-15T16:45:00Z"
}
```

## ⚠️ Notas Importantes

1. **Timestamps**: Los timestamps en el JSON son strings ISO 8601. Firebase los convertirá automáticamente.

2. **userId en Bancos**: Debe coincidir con el ID de la colección `users` para que las reglas de seguridad funcionen correctamente.

3. **authorId en Reviews**: Similar a userId, debe coincidir con un documento en `users`.

4. **fotoURL**: Inicialmente está en `null`. Las fotos se subirán mediante la interfaz web a Firebase Storage.

5. **Coordenadas**: Están centradas en Madrid. Puedes modificarlas para tu región.

## 🔧 Solución de Problemas

### "El archivo no se importa"
- Verifica que el JSON tenga sintaxis válida
- Usa: https://jsonlint.com/ para validar

### "Falta la subcolección reviews"
- Firebase requiere que primero exista el documento padre (Banco)
- Las subcolecciones se crearán automáticamente cuando añadas el primer review

### "Los datos no aparecen en la web"
- Verifica las **reglas de Firestore** en la consola
- Asegúrate de que permiten `read` y `write` adecuadamente
- Revisa la consola del navegador (F12) para errores

## ✨ Próximos Pasos

1. ✅ Importa el JSON en Firebase
2. ✅ Actualiza las reglas de seguridad
3. ✅ Comprueba que los datos aparecen en la web
4. ✅ Prueba la creación de un nuevo banco desde la interfaz
5. ✅ Prueba agregar reseñas a un banco

---

**¿Necesitas ayuda?** Revisa la consola de Firefox/Chrome (F12) para ver mensajes de error detallados.
