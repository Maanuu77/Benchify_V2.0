/**
 * BENCHIFY - CONFIGURACIÓN AVANZADA DEL MAPA
 * Este archivo contiene opciones y utilidades para personalizar Leaflet
 */

// Configuración de capas de mapa disponibles
const MAP_LAYERS = {
    CartoDB: {
        name: 'CartoDB Voyager',
        url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
    },
    OpenStreetMap: {
        name: 'OpenStreetMap',
        url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    },
    Dark: {
        name: 'Dark Mode',
        url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png',
        attribution: '&copy; CARTO'
    }
};

// Configuración de íconos personalizados
const CUSTOM_ICONS = {
    bench: {
        className: 'custom-pin-bench',
        html: '<i class="fa-solid fa-location-dot text-green-600 text-3xl drop-shadow-md"></i>',
        iconSize: [30, 42],
        iconAnchor: [15, 42]
    },
    favorite: {
        className: 'custom-pin-favorite',
        html: '<i class="fa-solid fa-heart text-red-500 text-3xl drop-shadow-md"></i>',
        iconSize: [30, 42],
        iconAnchor: [15, 42]
    },
    cluster: {
        className: 'custom-pin-cluster',
        html: '<i class="fa-solid fa-circle text-blue-600 text-2xl drop-shadow-md"></i>',
        iconSize: [24, 24],
        iconAnchor: [12, 12]
    }
};

// Funciones de utilidad para el mapa

/**
 * Calcula la distancia entre dos coordenadas (en km)
 * @param {Array} coord1 - [lat, lng]
 * @param {Array} coord2 - [lat, lng]
 */
function calculateDistance(coord1, coord2) {
    const R = 6371; // Radio de la Tierra en km
    const dLat = (coord2[0] - coord1[0]) * Math.PI / 180;
    const dLng = (coord2[1] - coord1[1]) * Math.PI / 180;
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(coord1[0] * Math.PI / 180) * Math.cos(coord2[0] * Math.PI / 180) *
        Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return (R * c).toFixed(2);
}

/**
 * Obtiene el código de color según la puntuación
 * @param {Number} rating - Puntuación de 1 a 5
 */
function getRatingColor(rating) {
    if (rating >= 5) return '#10b981'; // Verde oscuro
    if (rating >= 4) return '#34d399'; // Verde
    if (rating >= 3) return '#f59e0b'; // Naranja
    if (rating >= 2) return '#f97316'; // Naranja oscuro
    return '#ef4444'; // Rojo
}

/**
 * Crea una tarjeta de popup mejorada
 * @param {Object} bench - Datos del banco
 */
function createBenchPopup(bench) {
    const distance = calculateDistance([40.416775, -3.703790], bench.location);
    const viewColor = getRatingColor(bench.ratings.views);
    const privacyColor = getRatingColor(bench.ratings.privacy);
    const comfortColor = getRatingColor(bench.ratings.comfort);
    
    return `
        <div class="popup-content w-60 font-sans">
            <img src="${bench.image}" class="w-full h-32 object-cover rounded-t-lg" alt="${bench.name}">
            
            <div class="p-3 bg-white rounded-b-lg">
                <h3 class="font-bold text-base text-gray-900 mb-1">${bench.name}</h3>
                
                <div class="flex items-center gap-2 text-xs text-gray-500 mb-3">
                    <i class="fa-solid fa-location-dot"></i>
                    <span>${distance} km</span>
                </div>
                
                <div class="grid grid-cols-3 gap-2 mb-3">
                    <div class="text-center p-2 bg-gray-50 rounded">
                        <div style="color: ${viewColor}" class="text-lg">★</div>
                        <div class="text-xs font-bold text-gray-700">${bench.ratings.views}/5</div>
                        <div class="text-[10px] text-gray-500">Vistas</div>
                    </div>
                    <div class="text-center p-2 bg-gray-50 rounded">
                        <div style="color: ${privacyColor}" class="text-lg">🔒</div>
                        <div class="text-xs font-bold text-gray-700">${bench.ratings.privacy}/5</div>
                        <div class="text-[10px] text-gray-500">Privacía</div>
                    </div>
                    <div class="text-center p-2 bg-gray-50 rounded">
                        <div style="color: ${comfortColor}" class="text-lg">🪑</div>
                        <div class="text-xs font-bold text-gray-700">${bench.ratings.comfort}/5</div>
                        <div class="text-[10px] text-gray-500">Comodidad</div>
                    </div>
                </div>
                
                <p class="text-xs text-gray-600 mb-3 line-clamp-2">${bench.description}</p>
                
                <div class="flex gap-2 mb-3">
                    ${bench.tags.map(tag => `<span class="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">${tag}</span>`).join('')}
                </div>
                
                <a href="../pages/bench-card.html?id=${bench.id}" class="block w-full bg-green-600 text-white text-xs text-center py-2 rounded font-semibold hover:bg-green-700 transition">
                    Ver Detalles
                </a>
            </div>
        </div>
    `;
}

/**
 * Cambia la capa del mapa
 * @param {String} layerName - Nombre de la capa (CartoDB, OpenStreetMap, Dark)
 */
function changeMapLayer(layerName, mapInstance) {
    const layer = MAP_LAYERS[layerName];
    if (layer) {
        // Remover todas las capas tile del mapa
        mapInstance.eachLayer(mapLayer => {
            if (mapLayer instanceof L.TileLayer) {
                mapInstance.removeLayer(mapLayer);
            }
        });
        
        // Agregar nueva capa
        L.tileLayer(layer.url, {
            attribution: layer.attribution,
            maxZoom: 20
        }).addTo(mapInstance);
    }
}

export { MAP_LAYERS, CUSTOM_ICONS, calculateDistance, getRatingColor, createBenchPopup, changeMapLayer };
