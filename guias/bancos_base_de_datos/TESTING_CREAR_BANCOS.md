# ✅ Guía de Testing: Funcionalidad de Crear Bancos

## 🧪 Test Plan Completo

### Suite 1: Interfaz y Validación de Formulario

#### Test 1.1: Carga de página
- [ ] Abrir `http://localhost:8000/src/pages/add-bench.html` (o tu URL)
- [ ] Verificar que se cargan todos los elementos:
  - [ ] Navegación con botón "Cancelar"
  - [ ] Sección "Información Básica"
  - [ ] Sección "Foto del Banco"
  - [ ] Sección "Valoración"
  - [ ] Sección "Ubicación"
  - [ ] Botón "Publicar Banco"
- [ ] Verificar que los estilos se cargan correctamente
- [ ] Verificar responsive en mobile (640px)

**Resultado esperado:** ✅ Página carga sin errores, todos elementos visibles

---

#### Test 1.2: Validación de campo nombre
- [ ] Hacer clic en "Publicar Banco" sin completar nombre
- [ ] Verificar que aparece alerta: "Por favor, ingresa el nombre del banco"
- [ ] No debería enviarse el formulario

**Resultado esperado:** ✅ Error capturado, formulario no se envía

---

#### Test 1.3: Sliders funcionan
- [ ] Mover slider "Vistas" a valor 5
- [ ] Verificar que el número junto al slider cambia a 5
- [ ] Hacer lo mismo con los otros 3 sliders
- [ ] Verificar que en el código se capturan correctamente

**Resultado esperado:** ✅ Todos los sliders actualizan su valor en tiempo real

---

### Suite 2: Manejo de Fotos

#### Test 2.1: Seleccionar foto válida (JPG)
- [ ] Hacer clic en input de foto
- [ ] Seleccionar una imagen JPG cualquiera (< 5MB)
- [ ] Verificar que aparece preview de la foto
- [ ] Verificar que aparece botón ✕ para remover

**Resultado esperado:** ✅ Preview visible, sin errores

---

#### Test 2.2: Rechazar formato inválido
- [ ] Hacer clic en input de foto
- [ ] Intentar seleccionar archivo PDF o TXT
- [ ] Verificar que aparece error: "Formato no permitido"
- [ ] Verificar que input se limpia

**Resultado esperado:** ✅ Error mostrado, archivo no se carga

---

#### Test 2.3: Rechazar foto muy grande
- [ ] Hacer clic en input de foto
- [ ] Seleccionar una imagen > 5MB (o crear una)
- [ ] Verificar que aparece error: "Imagen muy grande"

**Resultado esperado:** ✅ Error mostrado

---

#### Test 2.4: Remover foto
- [ ] Cargar una foto válida
- [ ] Hacer clic en botón ✕
- [ ] Verificar que preview desaparece
- [ ] Verificar que input se limpia

**Resultado esperado:** ✅ Preview desaparece, photo removida

---

#### Test 2.5: Múltiples fotos
- [ ] Cargar foto 1 (JPG)
- [ ] Verificar preview
- [ ] Cambiar a foto 2 (PNG)
- [ ] Verificar que preview actualiza (no duplica)

**Resultado esperado:** ✅ Solo una foto cargada a la vez

---

### Suite 3: Geolocalización

#### Test 3.1: GPS automático
- [ ] Abrir página en navegador moderno
- [ ] Si pide permisos, aceptar
- [ ] Abrir Developer Tools (F12)
- [ ] Ir a Console
- [ ] Verificar mensaje: "Ubicación detectada: X, Y"

**Resultado esperado:** ✅ GPS detecta ubicación

---

#### Test 3.2: GPS denegado
- [ ] Abrir página en navegador
- [ ] Si pide permisos, denegar
- [ ] Verificar que usa coordenadas por defecto (Madrid)
- [ ] En console: "No se pudo obtener la ubicación"

**Resultado esperado:** ✅ Usa Madrid (40.4167, -3.7037) por defecto

---

### Suite 4: Integración Firebase

#### Test 4.1: Crear banco sin foto
**Pasos:**
1. Completar formulario:
   - Nombre: "Banco Test 1"
   - Descripción: "Banco de prueba"
   - Vistas: 4
   - Privacidad: 3
   - Comodidad: 5
   - Atmósfera: 4
2. NO seleccionar foto
3. Hacer clic en "Publicar Banco"

**Verificaciones:**
- [ ] Botón muestra spinner "Guardando..."
- [ ] Esperar 1-2 segundos
- [ ] Botón muestra checkmark "¡Guardado!"
- [ ] Alerta: "✅ ¡Banco 'Banco Test 1' publicado!"
- [ ] Redirige a map.html
- [ ] Verificar en Firebase Console (Firestore > Bancos)
  - [ ] Nuevo documento creado
  - [ ] Contiene todos los campos

**Resultado esperado:** ✅ Banco creado en Firestore sin foto

---

#### Test 4.2: Crear banco con foto
**Pasos:**
1. Completar formulario:
   - Nombre: "Banco Test 2"
   - Descripción: "Banco con foto"
   - Foto: Seleccionar imagen JPG (< 5MB)
   - Sliders: valores aleatorios
2. Hacer clic en "Publicar Banco"

**Verificaciones:**
- [ ] Botón muestra "Guardando..."
- [ ] Después: "Subiendo foto..."
- [ ] Esperar hasta que complete (5-10 segundos)
- [ ] Alerta de éxito
- [ ] Redirige a map.html
- [ ] Verificar en Firebase Console:
  - [ ] Nuevo documento en Firestore
  - [ ] Campo `fotoURL` contiene URL válida
  - [ ] Foto visible en Firebase Storage > bancos/...

**Resultado esperado:** ✅ Banco creado con foto en ambos servicios

---

#### Test 4.3: Verificar banco en mapa
**Después de crear banco (Test 4.2):**
1. En map.html, verificar:
   - [ ] Nuevo pin aparece en el mapa
   - [ ] Pin está en la ubicación correcta
   - [ ] Hacer clic en pin muestra popup con nombre

**Resultado esperado:** ✅ Banco visible en mapa

---

#### Test 4.4: Error de Firebase simulado
- [ ] Desactivar Internet (o simular fallo)
- [ ] Intentar crear banco
- [ ] Verificar que aparece error: "❌ Error al guardar: Error message"
- [ ] Botón vuelve a estado normal

**Resultado esperado:** ✅ Error manejado correctamente

---

### Suite 5: UX y Responsiveness

#### Test 5.1: Navegación "Cancelar"
- [ ] Hacer clic en "Cancelar" sin llenar formulario
- [ ] Verificar que redirige a map.html
- [ ] Nada se guarda

**Resultado esperado:** ✅ Redirección sin guardar

---

#### Test 5.2: Validar en mobile (480px)
- [ ] Abrir DevTools (F12)
- [ ] Seleccionar preset "iPhone 12"
- [ ] Verificar que:
  - [ ] Todos elementos son legibles
  - [ ] Botones son clickeables (mín 44x44px)
  - [ ] Preview de foto se ajusta a pantalla
  - [ ] Sliders funcionan correctamente
  - [ ] No hay overflow horizontal

**Resultado esperado:** ✅ Interfaz perfecta en mobile

---

#### Test 5.3: Validar en tablet (768px)
- [ ] Seleccionar preset "iPad"
- [ ] Verificar que:
  - [ ] Layout usa bien el espacio
  - [ ] Márgenes son proporcionales
  - [ ] No hay texto muy pequeño

**Resultado esperado:** ✅ Interfaz responsive en tablet

---

#### Test 5.4: Animaciones y feedback
- [ ] Pasar mouse sobre botón "Publicar"
- [ ] Verificar cambio de color/efecto
- [ ] Hacer clic en slider
- [ ] Verificar que número actualiza al instante
- [ ] Enviar formulario
- [ ] Verificar spinner del botón

**Resultado esperado:** ✅ Todas animaciones fluidas

---

### Suite 6: Casos Extremos

#### Test 6.1: Nombre muy largo
- [ ] Nombre: "A" * 200 caracteres
- [ ] Crear banco
- [ ] Verificar que se guarda (aunque sea muy largo)

**Resultado esperado:** ✅ Se guarda (validar length máximo en Firebase)

---

#### Test 6.2: Descripción con caracteres especiales
- [ ] Descripción: "¡Hola! ¿Cómo estás? 中文 emoji: 😍🎉"
- [ ] Crear banco
- [ ] Verificar en Firebase que se guardó correctamente

**Resultado esperado:** ✅ Caracteres especiales guardados

---

#### Test 6.3: Ubicación en otros países
- [ ] Simular GPS de Sydney (-33.8688, 151.2093)
- [ ] Crear banco
- [ ] Verificar que se guarda con esas coordenadas
- [ ] Ver en mapa

**Resultado esperado:** ✅ Funciona en cualquier ubicación

---

#### Test 6.4: Foto PNG transparente
- [ ] Crear imagen PNG con fondo transparente
- [ ] Cargar como foto
- [ ] Verificar preview
- [ ] Crear banco
- [ ] Verificar en Storage que se guardó

**Resultado esperado:** ✅ PNG transparente funciona

---

### Suite 7: Rendimiento

#### Test 7.1: Tiempo de carga
- [ ] Abrir DevTools > Network
- [ ] Recargar página
- [ ] Verificar tiempos:
  - HTML: < 200ms
  - CSS: < 200ms
  - JS: < 500ms
  - Total: < 2s

**Resultado esperado:** ✅ Carga rápida

---

#### Test 7.2: Tamaño de foto subida
- [ ] Subir foto de 5MB
- [ ] En Network tab, ver:
  - [ ] Request size
  - [ ] Response time
  - [ ] Típicamente 5-20 segundos

**Resultado esperado:** ✅ Subida completa sin timeout

---

#### Test 7.3: Múltiples creaciones rápidas
- [ ] Crear 3 bancos seguidos (sin esperar)
- [ ] Verificar que todos se guardan
- [ ] Verificar en Firebase que hay 3 documentos

**Resultado esperado:** ✅ Manejo de múltiples requests

---

### Suite 8: Integración de Datos

#### Test 8.1: Banco aparece en b2b-stats
- [ ] Crear un banco nuevo
- [ ] Abrir b2b-stats.html
- [ ] Verificar que "Bancos Totales" aumentó en 1
- [ ] Verificar que rating promedio se actualiza

**Resultado esperado:** ✅ Estadísticas actualizadas

---

#### Test 8.2: Banco aparece en favorites
- [ ] Crear un banco
- [ ] Ir a map.html, clickear el pin
- [ ] Hacer clic en "Añadir a Favoritos"
- [ ] Ir a favorites.html
- [ ] Verificar que el banco está en la lista

**Resultado esperado:** ✅ Banco integrado con favoritos

---

#### Test 8.3: Banco persiste después de refresh
- [ ] Crear un banco
- [ ] Esperar a que se guarde (alerta)
- [ ] Presionar F5 (recargar página)
- [ ] Ir a map.html
- [ ] Verificar que banco sigue ahí (en Storage)

**Resultado esperado:** ✅ Datos persisten en Firebase

---

## 📊 Matriz de Cobertura

| Suite | Tema | # Tests | Status |
|-------|------|---------|--------|
| 1 | Interfaz | 3 | ⚪ |
| 2 | Fotos | 5 | ⚪ |
| 3 | GPS | 2 | ⚪ |
| 4 | Firebase | 4 | ⚪ |
| 5 | UX/Responsive | 4 | ⚪ |
| 6 | Casos extremos | 4 | ⚪ |
| 7 | Rendimiento | 3 | ⚪ |
| 8 | Integración | 3 | ⚪ |
| **TOTAL** | | **28** | |

---

## 🐛 Checklist de QA Final

- [ ] Todos los test pasan
- [ ] No hay errores en console
- [ ] No hay warnings en console
- [ ] Responsive en 480px, 768px, 1024px
- [ ] Funciona en Chrome, Firefox, Safari
- [ ] Firebase conectado y funciona
- [ ] Storage accesible
- [ ] GPS funciona (con permisos)
- [ ] Validaciones funcionan
- [ ] Mensajes de error claros
- [ ] Redirecciones correctas

---

## 🚀 Procedimiento de Release

1. [ ] Completar todos los tests
2. [ ] Revisar código en database.js
3. [ ] Revisar código en add-bench.html
4. [ ] Revisar CSS en add-bench.css
5. [ ] Verificar configuración de Firebase
6. [ ] Probar en producción
7. [ ] Documentar cambios
8. [ ] Commit: "feat: add bank creation with photo upload"
9. [ ] Release v2.1.0

---

**Guía creada:** Diciembre 2024
**Versión:** 1.0
**Autor:** Benchify Dev Team
