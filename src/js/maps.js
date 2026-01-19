/**
 * BENCHIFY - LOGICA DE MAPAS
 * Tecnología: Leaflet.js (Alternativa Open Source a Google Maps)
 * Funcionalidad: Renderizado de bancos, pines y popups - CON CONEXIÓN A FIREBASE
 */

import { getAllBenches, saveBench, getFriendlyErrorMessage } from './database.js';
import { auth } from './firebase-init.js';

// 1. Configuración Inicial
const DEFAULT_COORDS = [40.416775, -3.703790]; 
const DEFAULT_ZOOM = 13;

let map; // Variable global del mapa
let benchesData = [];

// Datos de ejemplo locales (fallback si Firestore no responde)
const defaultBenchesData = [
    {
        id: "bench_001",
        name: "Banquito del Atardecer",
        location: [40.418308, -3.682664],
        description: "Perfecto para ver caer el sol sobre el lago.",
        image: "https://images.unsplash.com/photo-1562590206-8d59103e0413?w=300",
        ratings: {
            vistas: 5,
            privacidad: 2,
            comodidad: 4
        },
        tags: ["Romántico", "Atardecer"]
    },
    {
        id: "bench_002",
        name: "Rincón Secreto de La Latina",
        location: [40.410985, -3.707255],
        description: "Un banco escondido, ideal para conversaciones privadas.",
        image: "https://images.unsplash.com/photo-1596395359723-5e74c830c29b?w=300",
        ratings: {
            vistas: 3,
            privacidad: 5,
            comodidad: 3
        },
        tags: ["Privacidad", "Silencio"]
    },
    {
        id: "bench_003",
        name: "Mirador del Templo",
        location: [40.4241, -3.7176],
        description: "Vistas panorámicas increíbles, pero muy concurrido.",
        image: "https://images.unsplash.com/photo-1555529733-146e499d3d3c?w=300",
        ratings: {
            vistas: 5,
            privacidad: 1,
            comodidad: 4
        },
        tags: ["Turístico", "Fotografía"]
    }
];

/**
 * 2. Función para Cargar Bancos desde Firebase
 */
async function loadBenchesFromFirebase() {
    try {
        const benches = await getAllBenches();
        console.log('✅ Bancos cargados desde Firebase:', benches.length);
        
        // Convertir datos de Firestore al formato del mapa
        return benches.map(bench => ({
            id: bench.id,
            name: bench.nombre,
            location: [bench.coordenadas.lat, bench.coordenadas.lng],
            description: bench.descripcion,
            image: bench.fotoURL || 'https://images.unsplash.com/photo-1562590206-8d59103e0413?w=300',
            ratings: bench.ratings || { vistas: 0, privacidad: 0, comodidad: 0, atmosfera: 0 },
            tags: bench.etiquetas || [],
            userId: bench.userId,
            fecha_creacion: bench.fecha_creacion
        }));
    } catch (error) {
        console.error('❌ Error al cargar bancos:', error.message);
        console.warn('⚠️ Usando datos de ejemplo por defecto');
        return defaultBenchesData;
    }
}

/**
 * 3. Función para Inicializar el Mapa
 */
async function initMap(containerId = 'map') {
    const container = document.getElementById(containerId);
    if (!container) {
        console.warn('No se encontró contenedor para el mapa');
        return;
    }

    // Crear el mapa
    map = L.map(containerId).setView(DEFAULT_COORDS, DEFAULT_ZOOM);

    // Cargar tiles del mapa
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap &copy; CARTO',
        subdomains: 'abcd',
        maxZoom: 20
    }).addTo(map);

    // Cargar bancos desde Firebase
    benchesData = await loadBenchesFromFirebase();
    loadBenches(benchesData);
    
    console.log('✅ Mapa inicializado con', benchesData.length, 'bancos');
}

/**
 * 4. Función para Renderizar Pines en el Mapa
 */
function loadBenches(data) {
    if (!data || data.length === 0) {
        console.warn('⚠️ No hay bancos para mostrar en el mapa');
        return;
    }
    
    data.forEach(bench => {
        const customIcon = L.divIcon({
            className: 'custom-pin',
            html: `<i class="fa-solid fa-location-dot text-green-600 text-3xl drop-shadow-md"></i>`,
            iconSize: [30, 42],
            iconAnchor: [15, 42]
        });

        const marker = L.marker(bench.location, { icon: customIcon }).addTo(map);

        const popupContent = `
            <div class="p-2 w-48 font-sans">
                <img src="${bench.image}" class="w-full h-24 object-cover rounded-lg mb-2" alt="${bench.name}" onerror="this.src='https://images.unsplash.com/photo-1562590206-8d59103e0413?w=300'">
                <h3 class="font-bold text-sm text-green-700 leading-tight mb-1">${bench.name}</h3>
                
                <div class="flex items-center gap-1 text-xs text-yellow-500 mb-2">
                    <i class="fa-solid fa-eye" title="Vistas"></i> <b>${bench.ratings.vistas || 0}</b>
                    <span class="text-gray-300">|</span>
                    <i class="fa-solid fa-user-shield" title="Privacidad"></i> <b>${bench.ratings.privacidad || 0}</b>
                    <span class="text-gray-300">|</span>
                    <i class="fa-solid fa-chair" title="Comodidad"></i> <b>${bench.ratings.comodidad || 0}</b>
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

/**
 * 5. Función para Filtrar Bancos
 */
function applyFilters() {
    const viewsFilter = parseInt(document.querySelector('input.range-input')?.value || 1);
    const privacyFilter = document.querySelector('select.privacy-select')?.value || 'Cualquiera';
    
    // Limpiar marcadores anteriores
    map.eachLayer(layer => {
        if (layer instanceof L.Marker) {
            map.removeLayer(layer);
        }
    });

    // Aplicar filtros
    const filtered = benchesData.filter(bench => {
        const meetsViews = (bench.ratings.vistas || 0) >= viewsFilter;
        const meetsPrivacy = privacyFilter === 'Cualquiera' || 
                            (privacyFilter === 'Muy Privado (Poca gente)' && (bench.ratings.privacidad || 0) >= 4) ||
                            (privacyFilter === 'Concurrido (Ambiente social)' && (bench.ratings.privacidad || 0) <= 2);
        return meetsViews && meetsPrivacy;
    });

    console.log(`🔍 Filtros aplicados: ${filtered.length} bancos encontrados`);
    loadBenches(filtered);
}

/**
 * 6. Recargar bancos desde Firebase (para actualizaciones en tiempo real)
 */
async function refreshBenches() {
    console.log('🔄 Recargando bancos...');
    
    // Limpiar el mapa
    map.eachLayer(layer => {
        if (layer instanceof L.Marker) {
            map.removeLayer(layer);
        }
    });

    // Recargar datos
    benchesData = await loadBenchesFromFirebase();
    loadBenches(benchesData);
    console.log('✅ Bancos recargados');
}

/**
 * 7. Autoejecución
 */
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 Inicializando mapa...');
    
    // Inicializar mapa
    await initMap('map');
    
    // Configurar filtros
    const filterBtn = document.querySelector('.apply-filters-btn');
    if (filterBtn) {
        filterBtn.addEventListener('click', applyFilters);
        console.log('✅ Botón de filtros configurado');
    }

    // Configurar botón de agregar banco
    const addBenchBtn = document.querySelector('.add-bench-button');
    if (addBenchBtn) {
        addBenchBtn.addEventListener('click', () => {
            window.location.href = 'add-bench.html';
        });
        console.log('✅ Botón de agregar banco configurado');
    }

    // Reajustar tamaño al redimensionar ventana
    window.addEventListener('resize', () => {
        if (map) map.invalidateSize();
    });

    console.log('✅ Mapa listo');
});

// Exportar funciones para uso externo
export { initMap, loadBenches, applyFilters, refreshBenches, loadBenchesFromFirebase };