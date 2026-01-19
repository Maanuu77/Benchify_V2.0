/**
 * BENCHIFY - CARGADOR DE BANCOS DESDE OPENSTREETMAP (OVERPASS API)
 * Este módulo obtiene todos los bancos registrados en OpenStreetMap de la zona
 * y los muestra en el mapa como marcadores adicionales sin ser de la BD de Benchify
 * 
 * API: Overpass API (https://overpass-api.de)
 * Datos: OpenStreetMap (https://www.openstreetmap.org)
 */

/**
 * Obtiene todos los bancos (amenity=bank) de una zona específica usando Overpass API
 * @param {number} lat - Latitud central
 * @param {number} lng - Longitud central
 * @param {number} radiusKm - Radio de búsqueda en kilómetros (default: 5)
 * @returns {Promise<Array>} Array de bancos encontrados
 */
export async function loadOSMBanks(lat, lng, radiusKm = 5) {
    try {
        // Convertir radio de km a grados (aproximadamente 0.009 grados = 1km)
        const radiusDegrees = radiusKm * 0.009;
        
        // Query de Overpass API para buscar todos los bancos en el área
        const overpassQuery = `
            [out:json];
            (
                node["amenity"="bank"](${lat - radiusDegrees},${lng - radiusDegrees},${lat + radiusDegrees},${lng + radiusDegrees});
                way["amenity"="bank"](${lat - radiusDegrees},${lng - radiusDegrees},${lat + radiusDegrees},${lng + radiusDegrees});
            );
            out geom;
        `;

        // Llamar a Overpass API
        const response = await fetch('https://overpass-api.de/api/interpreter', {
            method: 'POST',
            body: overpassQuery
        });

        if (!response.ok) {
            throw new Error(`Error en Overpass API: ${response.status}`);
        }

        const data = await response.json();
        
        // Procesar resultados
        const banks = [];
        
        data.elements.forEach(element => {
            // Obtener coordenadas (nodes tienen lat/lon directo, ways usan geometry)
            let lat = element.lat;
            let lon = element.lon;
            
            if (!lat || !lon) {
                // Para ways, usar el centro de geometría
                if (element.geometry && element.geometry.length > 0) {
                    const coords = element.geometry;
                    lat = coords.reduce((sum, p) => sum + p.lat, 0) / coords.length;
                    lon = coords.reduce((sum, p) => sum + p.lon, 0) / coords.length;
                }
            }

            if (lat && lon) {
                banks.push({
                    id: `osm_${element.id}`,
                    name: element.tags?.name || element.tags?.operator || 'Banco desconocido',
                    location: [lat, lon],
                    description: element.tags?.description || 'Banco de OpenStreetMap',
                    osmId: element.id,
                    osmType: element.type,
                    isOSMBank: true,
                    // Información adicional disponible en OSM
                    operador: element.tags?.operator || null,
                    direccion: element.tags?.['addr:street'] || null,
                    website: element.tags?.website || null,
                    telefono: element.tags?.phone || null,
                    // Ratings vacíos para bancos de OSM (hasta que tengan reseñas)
                    ratings: {
                        vistas: 0,
                        privacidad: 0,
                        comodidad: 0,
                        atmosfera: 0
                    },
                    userId: null,
                    fecha_creacion: null
                });
            }
        });

        console.log(`✅ Cargados ${banks.length} bancos desde OpenStreetMap`);
        return banks;
    } catch (error) {
        console.error('❌ Error cargando bancos de OSM:', error.message);
        return [];
    }
}

/**
 * Renderiza marcadores de bancos de OSM en el mapa
 * @param {L.Map} map - Instancia de Leaflet Map
 * @param {Array} osmBanks - Array de bancos de OpenStreetMap
 */
export function loadOSMBankMarkers(map, osmBanks) {
    if (!osmBanks || osmBanks.length === 0) {
        console.warn('⚠️ No hay bancos de OSM para mostrar');
        return;
    }

    osmBanks.forEach(bank => {
        // Icono distintivo para bancos de OSM (edificio de banco)
        const osmIcon = L.divIcon({
            className: 'osm-bank-pin',
            html: `<i class="fa-solid fa-building text-blue-500 text-2xl drop-shadow-md"></i>`,
            iconSize: [26, 32],
            iconAnchor: [13, 32]
        });

        const marker = L.marker(bank.location, { icon: osmIcon }).addTo(map);

        // Popup más simple para bancos de OSM (sin opción de reseña inicial)
        const popupContent = `
            <div class="p-3 w-56 font-sans">
                <div class="flex items-center gap-2 mb-2">
                    <i class="fa-solid fa-building text-blue-500 text-lg"></i>
                    <h3 class="font-bold text-sm text-blue-700">${bank.name}</h3>
                </div>
                
                <div class="text-xs text-gray-600 space-y-1 mb-3">
                    ${bank.operador ? `<div><strong>Operador:</strong> ${bank.operador}</div>` : ''}
                    ${bank.direccion ? `<div><strong>Dirección:</strong> ${bank.direccion}</div>` : ''}
                    ${bank.telefono ? `<div><strong>Teléfono:</strong> <a href="tel:${bank.telefono}" class="text-blue-600">${bank.telefono}</a></div>` : ''}
                    ${bank.website ? `<div><strong>Web:</strong> <a href="${bank.website}" target="_blank" class="text-blue-600">Visitar</a></div>` : ''}
                </div>

                <div class="bg-yellow-50 border border-yellow-200 rounded p-2 mb-3 text-xs">
                    <p class="text-yellow-800"><i class="fa-solid fa-lightbulb text-yellow-600 mr-1"></i><strong>¿Has visitado este banco?</strong></p>
                    <p class="text-yellow-700 mt-1">¡Sé el primero en dejar una reseña en Benchify!</p>
                </div>
                
                <button onclick="crearResenaBancoOSM('${bank.id}', '${bank.name}', '${bank.location[0]}', '${bank.location[1]}')" class="w-full bg-blue-600 text-white text-xs py-2 rounded font-semibold hover:bg-blue-700 transition">
                    Crear Reseña
                </button>
            </div>
        `;

        marker.bindPopup(popupContent);
    });

    console.log(`✅ ${osmBanks.length} marcadores de bancos OSM agregados al mapa`);
}

/**
 * Combina bancos de Benchify con bancos de OSM para mostrar en el mapa
 * @param {Array} benchifyBanks - Bancos de la base de datos de Benchify
 * @param {Array} osmBanks - Bancos de OpenStreetMap
 * @returns {Array} Array combinado (Benchify primero, OSM después)
 */
export function mergeBankData(benchifyBanks, osmBanks) {
    const combined = [...benchifyBanks];
    
    // Evitar duplicados: no agregar bancos de OSM que ya están en Benchify
    osmBanks.forEach(osmBank => {
        const isDuplicate = benchifyBanks.some(benchBank => {
            // Considerar duplicado si están a menos de 50 metros
            const distance = calculateDistanceMeters(
                benchBank.location,
                osmBank.location
            );
            return distance < 50;
        });
        
        if (!isDuplicate) {
            combined.push(osmBank);
        }
    });

    console.log(`📊 Total de bancos a mostrar: ${combined.length} (${benchifyBanks.length} Benchify + ${osmBanks.length - (osmBanks.length - combined.length + benchifyBanks.length)} OSM únicos)`);
    return combined;
}

/**
 * Calcula distancia en metros entre dos puntos
 * @param {Array} coord1 - [lat, lng]
 * @param {Array} coord2 - [lat, lng]
 * @returns {number} Distancia en metros
 */
function calculateDistanceMeters(coord1, coord2) {
    const R = 6371000; // Radio de la Tierra en metros
    const dLat = (coord2[0] - coord1[0]) * Math.PI / 180;
    const dLng = (coord2[1] - coord1[1]) * Math.PI / 180;
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(coord1[0] * Math.PI / 180) * Math.cos(coord2[0] * Math.PI / 180) *
        Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

/**
 * Función global para crear reseña de banco de OSM
 * Se llama desde el popup del banco
 */
window.crearResenaBancoOSM = function(osmId, nombreBanco, lat, lng) {
    // Guardar datos del banco de OSM en sessionStorage para usar en add-bench
    sessionStorage.setItem('osmBankData', JSON.stringify({
        osmId: osmId,
        nombre: nombreBanco,
        lat: lat,
        lng: lng,
        esOSMBank: true
    }));
    
    // Redirigir a página de crear banco con los datos pre-rellenados
    window.location.href = '../pages/add-bench.html?fromOSM=true&osmId=' + osmId;
};

export { calculateDistanceMeters };
