# 🚀 Quick Start - Crear Bancos en Benchify

## ⚡ Inicio Rápido (2 minutos)

### Paso 1: Abrir la página
```
http://localhost:8000/src/pages/add-bench.html
(o donde tengas tu servidor local)
```

### Paso 2: Completar el formulario

#### Información Básica 📍
- **Nombre:** `El Banco Favorito` (requerido)
- **Descripción:** `Un lugar perfecto para...` (opcional)

#### Foto 📸
- Seleccionar archivo (JPG/PNG/WebP/GIF)
- Máximo 5MB
- Ver preview

#### Valoración ⭐
- Mover sliders (1-5 cada uno):
  - Vistas: 4
  - Privacidad: 5
  - Comodidad: 4
  - Atmósfera: 5

#### Ubicación 📍
- Se detecta automáticamente (GPS)
- Si no funciona: Madrid por defecto

### Paso 3: Publicar
```
Clic en "Publicar Banco" ➜ ¡Listo!
```

### Resultado
```
✅ "¡Banco publicado!"
   ↓ (redirige a map.html)
   Tu banco ya aparece en el mapa
```

---

## 🎯 Verificación Rápida

### ¿Funcionó?

#### En el Mapa
```
map.html → Verás nuevo PIN en la ubicación
```

#### En Base de Datos
```
Firebase Console → Firestore → Bancos → nuevo documento
```

#### Si hay foto
```
Firebase Console → Storage → bancos/ → tu_id/ → foto.jpg
```

---

## 📱 URLs Importantes

| Página | URL |
|--------|-----|
| **Crear banco** | `src/pages/add-bench.html` |
| **Ver mapa** | `src/pages/map.html` |
| **Favoritos** | `src/pages/favorites.html` |
| **Estadísticas** | `src/pages/b2b-stats.html` |
| **Detalle banco** | `src/pages/bench-card.html?id=...` |

---

## ❌ Errores Comunes

### "Por favor, ingresa el nombre del banco"
❌ Olvidaste completar el nombre
✅ Llena el campo de nombre

### "Formato no permitido"
❌ Subiste un PDF, TXT, etc.
✅ Usa JPG, PNG, WebP o GIF

### "Imagen muy grande"
❌ Foto > 5MB
✅ Reduce el tamaño de la imagen

### "Error al guardar"
❌ Sin conexión a Internet
✅ Verifica tu conexión
✅ Verifica que Firebase está configurado

### No aparece en el mapa
❌ Página no se recargó
✅ Abre map.html en nueva pestaña
✅ Verifica en Firebase Console

---

## 🔑 Puntos Clave

✅ **Persistencia:** Datos guardados PARA SIEMPRE  
✅ **Foto:** Almacenada en Firebase Storage  
✅ **GPS:** Ubicación automática  
✅ **Validación:** Todos los campos validados  
✅ **Integración:** Aparece en todas las páginas  

---

## 📖 Documentación Completa

Para más detalles, lee:

- 📘 [GUIA_CREAR_BANCO.md](GUIA_CREAR_BANCO.md) - Guía completa
- 📗 [DOCUMENTACION_TECNICA_BANCOS.md](DOCUMENTACION_TECNICA_BANCOS.md) - Código
- 📙 [DIAGRAMA_FLUJO_BANCOS.md](DIAGRAMA_FLUJO_BANCOS.md) - Diagramas
- 📕 [TESTING_CREAR_BANCOS.md](TESTING_CREAR_BANCOS.md) - Tests
- 📓 [RESUMEN_FUNCIONALIDAD_BANCOS.md](RESUMEN_FUNCIONALIDAD_BANCOS.md) - Resumen

---

## 🧪 Test Rápido (5 minutos)

```javascript
// 1. Abrir add-bench.html
// 2. Completar formulario
const testData = {
  nombre: "Banco Test",
  descripcion: "Banco de prueba",
  vistas: 4,
  privacidad: 3,
  comodidad: 5,
  atmosfera: 4
};
// 3. Clic en Publicar
// 4. Esperar ✅ mensaje
// 5. Verificar en Firebase Console
```

---

## 💡 Consejos

1. **Usa nombres descriptivos** para tus bancos
2. **Sube foto** si es posible (mucho más atractivo)
3. **Sé honesto** con las valoraciones
4. **Añade descripción** para contexto
5. **Comparte** tus descubrimientos

---

## 🎉 ¡Listo!

Acabas de aprender todo lo necesario para:

✅ Crear bancos  
✅ Subir fotos  
✅ Compartir con la comunidad  
✅ Ver resultados en el mapa  

**¡Disfruta usando Benchify!** 🎉

---

**Quick Start:** Diciembre 2024  
**Versión:** 2.1.0
