# 🎨 Ejemplos Visuales - Benchify v2.0

## Estructura HTML Visual

```
┌─────────────────────────────────────────┐
│          NAVEGACIÓN (Navbar)            │
│  Logo + Links + Botón Explorar Mapa    │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│         HERO SECTION (100vh)            │
│   Fondo: Gradiente Verde + Overlay     │
│   Contenido:                            │
│   ├─ Título Grande                     │
│   ├─ Subtítulo                         │
│   └─ Barra de búsqueda                 │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│      CARACTERÍSTICAS (3 Cards)          │
│                                         │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐│
│  │ Icono   │  │ Icono   │  │ Icono   ││
│  │ Título  │  │ Título  │  │ Título  ││
│  │ Desc.   │  │ Desc.   │  │ Desc.   ││
│  └─────────┘  └─────────┘  └─────────┘│
│                                         │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│    BANCOS DESTACADOS (3 Cards)          │
│                                         │
│  ┌───────────────┐ ┌───────────────┐   │
│  │   Imagen      │ │   Imagen      │   │
│  │ ⭐ Rating     │ │ ⭐ Rating     │   │
│  ├───────────────┤ ├───────────────┤   │
│  │ Título        │ │ Título        │   │
│  │ 📍 Ubicación  │ │ 📍 Ubicación  │   │
│  │ Tags Tags Tags│ │ Tags Tags Tags│   │
│  │ [Botón]       │ │ [Botón]       │   │
│  └───────────────┘ └───────────────┘   │
│                                         │
│         ┌───────────────┐               │
│         │   Imagen      │               │
│         │ ⭐ Rating     │               │
│         ├───────────────┤               │
│         │ Título        │               │
│         │ 📍 Ubicación  │               │
│         │ Tags Tags Tags│               │
│         │ [Botón]       │               │
│         └───────────────┘               │
│                                         │
│    [Explorar Todos los Bancos]         │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│          FOOTER (Oscuro)                │
│   Logo + Texto + Redes Sociales        │
└─────────────────────────────────────────┘
```

---

## Colores en Acción

### Paleta de Colores

```
PRIMARIOS:
🟢 #16a34a - Verde Principal (Botones, Links)
🟢 #15803d - Verde Hover (Estados activos)
🟢 #d1fae5 - Verde Claro (Backgrounds)
🟢 #f0fdf4 - Verde Muy Claro (Fondos suaves)

NEUTRALES:
⚫ #111827 - Gris Oscuro (Texto principal)
⚫ #6b7280 - Gris Medio (Texto secundario)
⚫ #9ca3af - Gris Claro (Texto terciario)
⚫ #e5e7eb - Gris Borde (Bordes)

FONDOS:
⚪ #ffffff - Blanco (Cards, navbar)
⚪ #f9fafb - Gris Muy Claro (Secciones)
⚪ #111827 - Oscuro (Footer)
```

---

## Animaciones CSS

### 1. Fade In (Desvanecimiento)
```
Inicio: opacity 0, translateY +10px
Fin: opacity 1, translateY 0px
Duración: 0.6s ease-in-out
```

### 2. Slide In Down (Desde arriba)
```
Inicio: opacity 0, translateY -30px
Fin: opacity 1, translateY 0px
Duración: 0.8s ease-out
```

### 3. Slide In Up (Desde abajo)
```
Inicio: opacity 0, translateY +30px
Fin: opacity 1, translateY 0px
Duración: 0.8s ease-out
Delay: 0.2s - 0.4s (escalonado)
```

### 4. Pulse (Pulso)
```
0%: opacity 1
50%: opacity 0.7
100%: opacity 1
Duración: 1.5s ease-in-out (infinito)
```

---

## Hover Effects

### Feature Cards
```
Normal:
- Borde: transparent
- Sombra: 0 4px 15px rgba(0,0,0,0.08)
- Transform: none

Hover:
- Borde: #16a34a (verde)
- Sombra: 0 20px 40px rgba(22,163,74,0.15)
- Transform: translateY(-12px)
- Icono: scale(1.15) rotate(5deg)
```

### Bench Cards
```
Normal:
- Sombra: 0 4px 15px rgba(0,0,0,0.08)
- Transform: none
- Imagen: scale(1)

Hover:
- Sombra: 0 25px 50px rgba(0,0,0,0.15)
- Transform: translateY(-16px)
- Imagen: scale(1.12)
```

### Botones
```
Normal:
- Background: #16a34a
- Sombra: 0 4px 12px rgba(22,163,74,0.2)

Hover:
- Background: #15803d
- Transform: translateY(-3px)
- Sombra: 0 8px 20px rgba(22,163,74,0.35)
```

---

## Tipografía

### Fuente
```
Font Family: 'Inter', -apple-system, BlinkMacSystemFont
Disponible en: Google Fonts
Weights: 300, 400, 500, 600, 700, 800
```

### Tamaños

```
Hero Title: clamp(2.5rem, 6vw, 4rem)
  → Mínimo 2.5rem, máximo 4rem
  → Escala responsiva (6vw)

Section Title: clamp(2rem, 5vw, 2.5rem)
  → Mínimo 2rem, máximo 2.5rem
  → Escala responsiva (5vw)

Body: 1rem (16px)
Small: 0.875rem (14px)
Extra Small: 0.75rem (12px)

Hero Subtitle: clamp(1.1rem, 3vw, 1.25rem)
```

---

## Espaciado

### Padding
```
Secciones:
- Desktop: 6rem vertical, 1rem horizontal
- Tablet: 4rem vertical, 1rem horizontal
- Móvil: 2.5rem vertical, 0.75rem horizontal

Cards:
- Content: 1.5rem general, 1rem en móvil
- Icon: 80px (70px en móvil)
```

### Margin
```
Entre elementos:
- Cards grid: 2rem - 2.5rem gap
- Secciones: 3rem entre elementos
```

### Border Radius
```
Cards: 16px
Tags: 12px
Botones: 12px
Inputs: 8px
Footer links: 50% (círculo)
```

---

## Tags de Ejemplo

### Tag-Green
```
Background: Linear gradient (primary-bg → #dcfce7)
Color: #16a34a
Border: 1px solid rgba(22,163,74,0.2)
Padding: 6px 12px
```

### Tag-Blue
```
Background: Linear gradient (#dbeafe → #bfdbfe)
Color: #1e40af
Border: 1px solid rgba(30,64,175,0.2)
```

### Tag-Purple
```
Background: Linear gradient (#f3e8ff → #e9d5ff)
Color: #6b21a8
Border: 1px solid rgba(107,33,168,0.2)
```

### Tag-Yellow
```
Background: Linear gradient (#fef3c7 → #fde68a)
Color: #b45309
Border: 1px solid rgba(180,83,9,0.2)
```

---

## Responsive Breakpoints

### Desktop (1024px+)
```
├─ Navegación: Horizontal completa
├─ Hero: 100vh con padding-top 64px
├─ Grid: 3 columnas
├─ Gap: 2rem
└─ Fuentes: Tamaño completo
```

### Tablet (768px - 1023px)
```
├─ Navegación: Adaptada
├─ Hero: Altura reducida
├─ Grid: 2-3 columnas (auto-fit)
├─ Gap: 1.5rem - 2rem
└─ Fuentes: Clamp active
```

### Móvil (< 768px)
```
├─ Navegación: Icono hamburguesa
├─ Hero: Mínimo 80vh, stack vertical
├─ Grid: 1 columna
├─ Gap: 1.5rem
└─ Fuentes: 14px base
```

### Ultra-Móvil (< 480px)
```
├─ Navegación: Solo logo + menú
├─ Hero: Ajustado al viewport
├─ Cards: Bordes 12px
├─ Padding: 0.75rem
└─ Espaciado: Mínimo
```

---

## Ejemplos de Código CSS

### Gradiente Principal
```css
background: linear-gradient(135deg, rgba(22, 163, 74, 0.4), rgba(21, 128, 61, 0.4));
```

### Sombra con Hover
```css
box-shadow: 0 25px 50px rgba(22, 163, 74, 0.3);
```

### Animación Suave
```css
transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
```

### Transform 3D
```css
transform: translateY(-16px) translateZ(0);
```

---

## Iconos Font Awesome

```
🏞️ fa-park              (Logo)
📍 fa-map-pin           (Ubicación)
⭐ fa-star              (Calificación)
❤️ fa-heart             (Favoritos)
🗺️ fa-map               (Mapa)
👤 fa-user              (Perfil)
☰ fa-bars               (Menú)
```

---

## Proporciones

### Feature Cards
```
Width: Flexible (auto-fit minmax(280px, 1fr))
Aspect Ratio: 1:1 (cuadrado)
Icon Size: 80px × 80px
```

### Bench Cards
```
Width: Flexible (auto-fit minmax(300px, 1fr))
Image Height: 220px
Content Padding: 1.5rem
```

### Rating Badge
```
Position: Absolute top-right
Size: Small badge (8px 14px)
Background: white
Shadow: 0 4px 12px rgba(0,0,0,0.15)
```

---

**Nota**: Este documento describe los estilos visuales implementados. Para detalles técnicos, revisa los archivos CSS directamente.
