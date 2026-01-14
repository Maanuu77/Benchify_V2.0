/**
 * BENCHIFY - LOGICA DE MAPAS
 * Tecnología: Leaflet.js (Alternativa Open Source a Google Maps)
 * Funcionalidad: Renderizado de bancos, pines y popups.
 */

// 1. Configuración Inicial
// Coordenadas centradas en Madrid (puedes cambiarlas a tu ciudad objetivo)
const DEFAULT_COORDS = [40.416775, -3.703790]; 
const DEFAULT_ZOOM = 13;

let map; // Variable global del mapa

// 2. Base de Datos Simulada (Mock Data)
// Esto simula lo que vendría de Firebase Firestore [cite: 7]
const benchesData = [
    {
        id: "bench_001",
        name: "Banquito del Atardecer", // [cite: 54]
        location: [40.418308, -3.682664], // Parque del Retiro aprox
        description: "Perfecto para ver caer el sol sobre el lago.",
        image: "https://images.unsplash.com/photo-1562590206-8d59103e0413?w=300",
        ratings: {
            views: 5,      // [cite: 56]
            privacy: 2,    // [cite: 58]
            comfort: 4     // [cite: 58]
        },
        tags: ["Romántico", "Atardecer"] // [cite: 55]
    },
    {
        id: "bench_002",
        name: "Rincón Secreto de La Latina",
        location: [40.410985, -3.707255],
        description: "Un banco escondido, ideal para conversaciones privadas.",
        image: "https://images.unsplash.com/photo-1596395359723-5e74c830c29b?w=300",
        ratings: {
            views: 3,
            privacy: 5,    // Alta privacidad
            comfort: 3
        },
        tags: ["Privacidad", "Silencio"]
    },
    {
        id: "bench_003",
        name: "Mirador del Templo",
        location: [40.4241, -3.7176], // Templo de Debod
        description: "Vistas panorámicas increíbles, pero muy concurrido.",
        image: "https://images.unsplash.com/photo-1555529733-146e499d3d3c?w=300",
        ratings: {
            views: 5,
            privacy: 1,
            comfort: 4
        },
        tags: ["Turístico", "Fotografía"]
    }
];

// 3. Función para Inicializar el Mapa
function initMap(containerId = 'map') {
    // Verificar si el contenedor existe en el HTML
    if (!document.getElementById(containerId)) return;

    // Crear el mapa
    map = L.map(containerId).setView(DEFAULT_COORDS, DEFAULT_ZOOM);

    // Cargar las "Tejas" (Tiles) del mapa (Diseño visual)
    // Usamos CartoDB Voyager para un diseño limpio y romántico
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
    }).addTo(map);

    // Cargar los pines de los bancos
    loadBenches(benchesData);
}

// 4. Función para Generar Pines y Popups
function loadBenches(data) {
    data.forEach(bench => {
        // Crear icono personalizado (opcional)
        const customIcon = L.divIcon({
            className: 'custom-pin',
            html: `<i class="fa-solid fa-location-dot text-green-600 text-3xl drop-shadow-md"></i>`,
            iconSize: [30, 42],
            iconAnchor: [15, 42]
        });

        // Crear marcador
        const marker = L.marker(bench.location, { icon: customIcon }).addTo(map);

        // Crear contenido HTML del Popup (Tarjeta pequeña)
        const popupContent = `
            <div class="p-2 w-48 font-sans">
                <img src="${bench.image}" class="w-full h-24 object-cover rounded-lg mb-2" alt="${bench.name}">
                <h3 class="font-bold text-sm text-green-700 leading-tight mb-1">${bench.name}</h3>
                
                <div class="flex items-center gap-1 text-xs text-yellow-500 mb-2">
                    <i class="fa-solid fa-eye" title="Vistas"></i> <b>${bench.ratings.views}</b>
                    <span class="text-gray-300">|</span>
                    <i class="fa-solid fa-user-shield" title="Privacidad"></i> <b>${bench.ratings.privacy}</b>
                </div>

                <p class="text-xs text-gray-600 mb-2 line-clamp-2">${bench.description}</p>
                
                <a href="bench-card.html?id=${bench.id}" class="block w-full bg-green-600 text-white text-xs text-center py-1 rounded hover:bg-green-700 transition">
                    Ver Detalles
                </a>
            </div>
        `;

        marker.bindPopup(popupContent);
    });
}

// 5. Autoejecución al cargar el DOM
document.addEventListener('DOMContentLoaded', () => {
    // Intentar iniciar el mapa si existe el elemento #map
    initMap('map');
});