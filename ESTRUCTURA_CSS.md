# 🎨 ESTRUCTURA DE ESTILOS CSS - BENCHIFY

## Organización de Archivos CSS

Tu proyecto ahora tiene una estructura de estilos **limpia y modular**:

```
src/assets/css/
├── styles.css         ← Estilos globales (MAIN)
├── index.css          ← Estilos específicos de index.html
└── map.css            ← Estilos específicos de map.html
```

---

## 📋 Detalles de cada archivo

### 1. `styles.css` - Estilos Globales
**Usado por:** Todos los archivos HTML

**Contiene:**
- Variables CSS (colores, sombras, espacios)
- Estilos del mapa (Leaflet)
- Componentes reutilizables (cards, botones, badges)
- Formularios y entrada de datos
- Animaciones globales
- Scrollbar personalizado
- Responsivo base

**Estructura interna:**
1. Configuración Base y Variables
2. Componentes del Mapa
3. Tarjetas y Contenedores
4. Formularios y Entrada
5. Botones
6. Animaciones
7. Scrollbar Personalizado
8. Utilidades y Helpers
9. Responsive

---

### 2. `index.css` - Página de Inicio
**Usado por:** `index.html`

**Contiene:**
- Hero section (banner principal)
- Features section (tarjetas de características)
- Benches section (cards de bancos)
- Footer
- Búsqueda y botones de la homepage
- Responsive específico para mobile

**Estructura interna:**
1. Header y Navegación
2. Hero Section
3. Features Section
4. Benches Section
5. Footer
6. Responsive

---

### 3. `map.css` - Página del Mapa
**Usado por:** `src/pages/map.html`

**Contiene:**
- Contenedor del mapa
- Sidebar de filtros
- Controles del mapa
- Botón de añadir banco
- Popup personalizado
- Estilos responsive para tablet y mobile

**Estructura interna:**
1. Contenedor Principal del Mapa
2. Sidebar de Filtros
3. Botón de Añadir Banco
4. Popup Personalizado
5. Responsive para Mobile
6. Animaciones

---

## 🎨 Variables CSS Globales

Todos los colores y espacios están definidos en `styles.css`:

```css
:root {
    --primary-color: #16a34a;           /* Verde principal */
    --primary-hover: #15803d;           /* Verde hover */
    --primary-light: #d1fae5;           /* Verde claro */
    --primary-bg: #f0fdf4;              /* Fondo verde muy claro */
    
    --text-dark: #111827;               /* Gris oscuro */
    --text-light: #6b7280;              /* Gris medio */
    --text-lighter: #9ca3af;            /* Gris claro */
    
    --border-color: #e5e7eb;            /* Borde gris */
    --shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.1);
    --shadow-md: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    --shadow-lg: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}
```

---

## 🔗 Cómo están vinculados los CSS

### index.html
```html
<link rel="stylesheet" href="assets/css/styles.css">
<link rel="stylesheet" href="assets/css/index.css">
```

### src/pages/map.html
```html
<link rel="stylesheet" href="../css/styles.css">
<link rel="stylesheet" href="../css/map.css">
```

---

## ✅ Ventajas de esta estructura

| Ventaja | Descripción |
|---------|------------|
| **Modular** | Cada página tiene sus propios estilos |
| **Mantenible** | Fácil encontrar y modificar estilos |
| **Reutilizable** | `styles.css` comparte componentes |
| **Escalable** | Fácil añadir nuevas páginas |
| **Limpio** | Cero estilos inline en HTML |
| **Organizado** | Comentarios separando secciones |
| **Variable** | CSS variables para consistencia |

---

## 🎯 Clases Reutilizables en styles.css

### Tarjetas
- `.card` - Tarjeta básica
- `.feature-card` - Card de feature
- `.bench-card` - Card de banco

### Componentes
- `.badge` - Etiquetas (colores: `-green`, `-blue`, `-purple`, `-yellow`)
- `.btn-primary` - Botón principal
- `.btn-secondary` - Botón secundario

### Texto
- `.text-primary` - Color verde
- `.text-muted` - Color gris
- `.section-title` - Títulos de sección

### Sombras
- `.shadow-sm` - Sombra pequeña
- `.shadow-md` - Sombra mediana
- `.shadow-lg` - Sombra grande

### Animaciones
- `.fade-in` - Fade in suave
- `.slide-in-down` - Desliza desde arriba
- `.slide-in-up` - Desliza desde abajo

---

## 📐 Responsive Breakpoints

```css
/* Mobile first approach */
@media (max-width: 480px)   { /* Extra pequeños */ }
@media (max-width: 768px)   { /* Tablets */ }
@media (min-width: 1024px)  { /* Desktop */ }
```

---

## 🛠 Cómo Personalizar

### Cambiar el color principal

Edita en `styles.css`:
```css
:root {
    --primary-color: #tu-color;
    --primary-hover: #tu-color-oscuro;
    --primary-light: #tu-color-claro;
}
```

### Cambiar la tipografía

Ya está definida en `styles.css`:
```css
body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}
```

### Cambiar espaciado

Modifica `padding` y `margin` directamente en:
- `index.css` para la homepage
- `map.css` para el mapa

---

## 📝 Convenciones de Nombres

### Clases
- `.component-name` - Componente principal
- `.component-name-item` - Item dentro del componente
- `.is-active` - Estado activo
- `.has-error` - Estado de error

### Ejemplos
- `.bench-card` - Tarjeta de banco
- `.bench-card-image` - Imagen dentro de la card
- `.bench-card.active` - Card activa
- `.filter-tag.is-active` - Tag de filtro activo

---

## 🔄 Flujo de Estilos

```
styles.css (GLOBAL)
    ↓
index.css (ESPECÍFICO) o map.css (ESPECÍFICO)
    ↓
HTML (Sin estilos inline)
```

**Ventaja:** Los estilos globales se aplican primero, luego se sobrescriben con los específicos.

---

## ✨ Ejemplo de componente limpio

### Antes (Con estilos inline):
```html
<div class="p-6 border rounded-xl hover:shadow-xl transition">
    <div class="text-green-500 text-4xl mb-4"><i class="fa-solid fa-camera-retro"></i></div>
    <h3 class="text-xl font-bold mb-2">Vistas Épicas</h3>
    <p class="text-gray-600">Descripción...</p>
</div>
```

### Después (Limpio):
```html
<div class="feature-card">
    <div class="feature-icon"><i class="fa-solid fa-camera-retro"></i></div>
    <h3>Vistas Épicas</h3>
    <p>Descripción...</p>
</div>
```

CSS en `index.css`:
```css
.feature-card {
    padding: 1.5rem;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    transition: all 0.3s ease;
}

.feature-card:hover {
    border-color: #16a34a;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}
```

---

## 📦 Archivo a Archivo

| Archivo | Líneas | Componentes |
|---------|--------|-------------|
| `styles.css` | ~270 | Globales + Mapa |
| `index.css` | ~380 | Homepage completa |
| `map.css` | ~290 | Mapa + Filtros |
| **Total** | **~940** | **Bien organizado** |

---

## 🎓 Próximos pasos

1. **Usa las variables CSS** - No repitas colores
2. **Añade clases reutilizables** - No duplicues estilos
3. **Mantén archivos separados** - Uno por página
4. **Documenta cambios** - Comenta el por qué
5. **Prueba responsive** - En diferentes pantallas

---

## 🚀 Tips de Performance

✅ Variables CSS centralizadas → Fácil mantenimiento
✅ Clases reutilizables → Menos CSS duplicado
✅ Organización clara → Carga rápida
✅ Mobile-first → Mejor performance

---

¡Tu proyecto ahora tiene **estilos organizados y mantenibles**! 🎉
