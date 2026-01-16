# ⚡ GUÍA RÁPIDA DE USO - BENCHIFY v2.0

## 🎯 En 30 segundos

Tu proyecto ahora tiene estilos **limpios y organizados**:

- ✅ **HTML sin estilos inline** - Fácil de leer
- ✅ **CSS modular** - Archivo por página
- ✅ **Variables centralizadas** - Cambios rápidos
- ✅ **Componentes reutilizables** - Menos código

---

## 📝 Cómo trabajar

### Cambiar color verde:
1. Abre `src/assets/css/styles.css`
2. Busca: `--primary-color: #16a34a;`
3. Cambia el código hex
4. ¡Listo! Se aplica en todo el sitio

### Editar la página de inicio:
1. Abre `index.html`
2. Los estilos están en `src/assets/css/index.css`
3. Usa clases CSS como `.hero-bg`, `.feature-card`
4. ¡Sin Tailwind inline!

### Editar el mapa:
1. Abre `src/pages/map.html`
2. Los estilos están en `src/assets/css/map.css`
3. Usa clases como `.filter-sidebar`, `.add-bench-button`
4. Lógica en `src/js/maps.js`

---

## 🔧 Crear una nueva página

### Paso 1: Crear HTML
```html
<!-- src/pages/nueva-pagina.html -->
<!DOCTYPE html>
<html lang="es">
<head>
    <link rel="stylesheet" href="../css/styles.css">
    <link rel="stylesheet" href="../css/nueva-pagina.css">
</head>
<body>
    <div class="mi-componente">
        <!-- Tu contenido -->
    </div>
</body>
</html>
```

### Paso 2: Crear CSS
```css
/* src/assets/css/nueva-pagina.css */

.mi-componente {
    padding: 2rem;
    background: white;
    border-radius: 12px;
}

.mi-componente:hover {
    box-shadow: var(--shadow-md);
}
```

### Paso 3: Usar clases CSS
```html
<div class="mi-componente">
    <h1>Mi Título</h1>
</div>
```

---

## 📂 Estructura de carpetas

```
src/
├── assets/css/
│   ├── styles.css       ← Global (usar para cambios generales)
│   ├── index.css        ← Homepage
│   └── map.css          ← Mapa
├── pages/
│   ├── map.html         ← Página del mapa
│   └── (otras páginas)
└── js/
    └── maps.js          ← Lógica del mapa
```

---

## 🎨 Variables CSS disponibles

```css
/* Colores */
var(--primary-color)        /* Verde principal */
var(--primary-hover)        /* Verde hover */
var(--primary-light)        /* Verde claro */
var(--text-dark)            /* Texto oscuro */
var(--text-light)           /* Texto claro */

/* Sombras */
var(--shadow-sm)            /* Sombra pequeña */
var(--shadow-md)            /* Sombra mediana */
var(--shadow-lg)            /* Sombra grande */
```

---

## 📋 Clases reutilizables

```html
<!-- Tarjetas -->
<div class="card">...</div>
<div class="bench-card">...</div>

<!-- Botones -->
<button class="btn-primary">Primario</button>
<button class="btn-secondary">Secundario</button>

<!-- Texto -->
<span class="text-primary">Verde</span>
<span class="text-muted">Gris</span>

<!-- Sombras -->
<div class="shadow-sm">...</div>
<div class="shadow-lg">...</div>

<!-- Animaciones -->
<div class="fade-in">...</div>
```

---

## ✍️ Convenciones de nombres

```css
/* Componente principal */
.component-name { }

/* Elemento dentro del componente */
.component-name-item { }

/* Estado activo */
.is-active { }

/* Estado de error */
.has-error { }
```

**Ejemplo:**
```css
.bench-card { }              /* Componente */
.bench-card-image { }        /* Elemento */
.bench-card.is-active { }    /* Estado */
```

---

## 🚨 Lo que NO debes hacer

### ❌ MALO:
```html
<div class="p-6 border rounded-xl hover:shadow-xl transition">
    <h3 class="text-xl font-bold mb-2">Título</h3>
</div>
```

### ✅ BUENO:
```html
<div class="feature-card">
    <h3>Título</h3>
</div>
```

---

## 🎓 Ejemplos

### Cambiar tipografía
```css
/* styles.css */
body {
    font-family: 'Tu-Fuente', sans-serif;
}
```

### Cambiar espaciado
```css
/* index.css */
.hero-content {
    padding: 3rem;  /* Cambiar aquí */
}
```

### Añadir animación
```css
/* styles.css */
@keyframes mi-animacion {
    from { opacity: 0; }
    to { opacity: 1; }
}

.mi-clase {
    animation: mi-animacion 0.5s ease;
}
```

---

## 📱 Responsive

Los breakpoints ya están configurados:

```css
@media (max-width: 480px) { }    /* Mobile extra */
@media (max-width: 768px) { }    /* Tablet */
@media (min-width: 1024px) { }   /* Desktop */
```

---

## 🔍 Dónde buscar

| Necesito... | Buscar en... |
|------------|-------------|
| Cambiar colores | `styles.css` línea 15 |
| Editar hero | `index.css` línea 50 |
| Editar mapa | `map.css` línea 1 |
| Ver variables | `styles.css` línea 15-27 |
| Ver componentes | `styles.css` línea 200+ |

---

## 📚 Documentación completa

Para información más detallada, consulta:

- **ESTRUCTURA_CSS.md** - Cómo está organizado
- **REFACTORIZACION_CSS.md** - Qué cambió y por qué
- **ESTRUCTURA_PROYECTO.md** - Árbol del proyecto

---

## 🎯 Flujo de trabajo recomendado

1. **Abrir proyecto**
   ```
   index.html + styles.css
   ```

2. **Hacer cambios**
   - HTML: edita archivo `.html`
   - Estilos: edita archivo `.css`

3. **Verificar**
   - Abre en navegador
   - Verifica responsive (F12 → Device mode)

4. **Commit**
   - Git commit con cambios limpios

---

## 🚀 Próximos pasos

1. Crear `src/pages/add-bench.html`
2. Crear `src/assets/css/add-bench.css`
3. Seguir el mismo patrón
4. ¡Mantener código limpio!

---

## 💡 Tips

- **Usa variables CSS** - `var(--primary-color)` en lugar de códigos hex
- **Reutiliza clases** - No repitas estilos
- **Comenta el CSS** - Explica por qué cada sección
- **Mantén HTML limpio** - Sin clases Tailwind
- **Prueba responsive** - En diferentes tamaños

---

¡Listo para trabajar! 🚀

Última actualización: 16 de Enero de 2026
