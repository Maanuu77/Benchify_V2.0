## 🔧 Solución: El mapa no aparece

### ✅ Cambios Realizados

#### 1. **Actualizar `src/pages/map.html`**
- Agregué `type="module"` al script de `maps.js`
- Añadí CSS para dimensionar correctamente el mapa:
  ```css
  #map { width: 100%; height: 100%; }
  main { height: calc(100vh - 64px); }
  ```

#### 2. **Corregir selectores en `src/js/maps.js`**
- Actualicé selectores para que coincidan con los elementos de `map.html`:
  - `input.range-input` (en lugar de `input[type="range"]`)
  - `select.privacy-select` (en lugar de `select`)
  - `.apply-filters-btn` (para el botón de filtros)
  - `.add-bench-button` (para agregar banco)

### 🧪 Cómo Verificar

1. **Abre `map.html` en el navegador**

2. **Abre la consola (F12)** y busca los mensajes:
   ```
   ✅ Bancos cargados desde Firebase: 5
   ✅ Mapa inicializado con 5 bancos
   ✅ Mapa listo
   ```

3. **El mapa debe ocupar toda la pantalla** (excepto la barra de navegación)

4. **Verifica que aparezcan:**
   - Los 5 bancos como pines verdes en el mapa
   - Panel de filtros a la izquierda
   - Botón "+" para agregar banco

### ❌ Si Aún No Aparece

**Opción 1: Errores en la Consola (F12)**
- Abre F12 en el navegador
- Ve a la pestaña **Console**
- Busca mensajes en rojo (errores)
- Captura pantalla y comparte el error

**Opción 2: Verificar que Leaflet está cargado**
- En la consola, escribe: `L.map`
- Si aparece `ƒ ()` es que Leaflet se cargó bien
- Si aparece `undefined`, hay problema con la librería

**Opción 3: Verificar que Firebase está cargado**
- En la consola, escribe: `db`
- Debe mostrar el objeto de Firestore

**Opción 4: Probar manualmente**
- En la consola, ejecuta:
  ```javascript
  import('./src/js/maps.js').then(m => {
    console.log('✅ Módulo cargado');
    m.initMap('map');
  });
  ```

### 📋 Checklist Final

- [ ] `src/pages/map.html` tiene `type="module"` en el script
- [ ] El CSS del mapa está agregado
- [ ] El elemento `<div id="map"></div>` existe en el HTML
- [ ] Los selectores en `maps.js` coinciden con `map.html`
- [ ] La consola (F12) no muestra errores
- [ ] El mapa llena toda la pantalla
- [ ] Los bancos aparecen como pines verdes

### 🆘 Comando de Prueba Rápida

Copia y pega esto en la consola (F12) para probar si todo está conectado:

```javascript
// Probar si Leaflet está cargado
console.log('Leaflet:', typeof L !== 'undefined' ? '✅ Cargado' : '❌ No cargado');

// Probar si el mapa existe
console.log('Mapa:', document.getElementById('map') ? '✅ Existe' : '❌ No existe');

// Probar si Firebase está cargado
console.log('Firebase:', typeof firebase !== 'undefined' ? '✅ Cargado' : '❌ No cargado');

// Ver tamaño del contenedor del mapa
const mapDiv = document.getElementById('map');
if (mapDiv) {
  console.log(`Dimensiones del mapa: ${mapDiv.offsetWidth}x${mapDiv.offsetHeight}px`);
}
```

---

**¿El mapa sigue sin aparecer?** Abre la consola (F12), copia todos los errores y comparte aquí.
