/**
 * BENCHIFY - INICIALIZADOR DEL MAPA
 * Versión sin módulos ES6 para mayor compatibilidad
 */

(function() {
    'use strict';

    // Configuración
    const DEFAULT_COORDS = [40.416775, -3.703790];
    const DEFAULT_ZOOM = 13;
    
    let map;
    let benchesData = [];
    let markersGroup = null;
    
    // Datos de fallback
    const defaultBenchesData = [
        {
            id: "bench_001",
            name: "Banquito del Atardecer",
            location: [40.418308, -3.682664],
            description: "Perfecto para ver caer el sol sobre el lago.",
            image: "https://images.unsplash.com/photo-1562590206-8d59103e0413?w=300",
            ratings: { vistas: 5, privacidad: 2, comodidad: 4, atmosfera: 5 },
            tags: ["Romántico", "Atardecer"]
        },
        {
            id: "bench_002",
            name: "Rincón Secreto de La Latina",
            location: [40.410985, -3.707255],
            description: "Un banco escondido, ideal para conversaciones privadas.",
            image: "https://images.unsplash.com/photo-1596395359723-5e74c830c29b?w=300",
            ratings: { vistas: 3, privacidad: 5, comodidad: 3, atmosfera: 4 },
            tags: ["Privacidad", "Silencio"]
        },
        {
            id: "bench_003",
            name: "Mirador del Templo",
            location: [40.4241, -3.7176],
            description: "Vistas panorámicas increíbles, pero muy concurrido.",
            image: "https://images.unsplash.com/photo-1555529733-146e499d3d3c?w=300",
            ratings: { vistas: 5, privacidad: 1, comodidad: 4, atmosfera: 5 },
            tags: ["Turístico", "Fotografía"]
        }
    ];

    /**
     * Cargar bancos desde Firebase (sin módulos)
     */
    async function loadBenchesFromFirebase() {
        try {
            console.log('📡 Intentando conectar con Firebase...');
            
            // Usar función disponible globalmente
            if (typeof window.getAllBenches !== 'function') {
                throw new Error('getAllBenches no está disponible');
            }

            const benches = await window.getAllBenches();
            console.log('✅ Bancos cargados desde Firebase:', benches.length);
            
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
            console.warn('⚠️ No se pudo conectar con Firebase, usando datos de ejemplo:', error.message);
            return defaultBenchesData;
        }
    }

    /**
     * Inicializar Leaflet
     */
    async function initMap() {
        const mapContainer = document.getElementById('map');
        if (!mapContainer) {
            console.error('❌ Contenedor del mapa no encontrado');
            return;
        }

        console.log('🗺️ Inicializando mapa...');

        // Crear mapa
        map = L.map('map').setView(DEFAULT_COORDS, DEFAULT_ZOOM);

        // Agregar tiles (OpenStreetMap - fiable para pruebas)
        const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors',
            maxZoom: 19
        }).addTo(map);

        tiles.on('tileerror', (err) => {
            console.warn('⚠️ Error cargando tiles:', err);
        });

        // Crear grupo de marcadores para controlar limpieza y re-render
        markersGroup = L.layerGroup().addTo(map);

        // Invalidar tamaño al terminar de cargar tiles
        map.on('load', () => {
            console.log('✅ Tiles cargados');
            try { map.invalidateSize(); } catch (e) { console.warn('invalidateSize falló:', e.message); }
            setTimeout(() => { try { map.invalidateSize(); } catch (e) {} }, 300);
        });

        console.log('✅ Mapa base cargado');

        // Cargar bancos
        benchesData = await loadBenchesFromFirebase();
        loadBenches(benchesData);

        console.log('✅ Mapa inicializado con', benchesData.length, 'bancos');
    }

    /**
     * Cargar pines en el mapa
     */
    function loadBenches(data) {
        if (!data || data.length === 0) {
            console.warn('⚠️ No hay bancos para mostrar');
            return;
        }

        // Limpiar grupo de marcadores antes de añadir
        if (markersGroup) markersGroup.clearLayers();

        data.forEach(bench => {
            const customIcon = L.divIcon({
                className: 'custom-pin',
                html: '<i class="fa-solid fa-location-dot" style="color: #16a34a; font-size: 2rem; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));"></i>',
                iconSize: [30, 42],
                iconAnchor: [15, 42]
            });

            const marker = L.marker(bench.location, { icon: customIcon });
            marker.addTo(markersGroup);

            const popupContent = `
                <div style="width: 200px;">
                    <img src="${bench.image}" style="width: 100%; height: 100px; object-fit: cover; border-radius: 8px; margin-bottom: 8px;" alt="${bench.name}" onerror="this.src='https://images.unsplash.com/photo-1562590206-8d59103e0413?w=300'">
                    <h3 style="font-weight: bold; font-size: 14px; color: #15803d; margin-bottom: 8px;">${bench.name}</h3>
                    <div style="display: flex; gap: 8px; font-size: 12px; margin-bottom: 8px; color: #f59e0b;">
                        <span><i class="fa-solid fa-eye"></i> ${bench.ratings.vistas || 0}</span>
                        <span><i class="fa-solid fa-user-shield"></i> ${bench.ratings.privacidad || 0}</span>
                        <span><i class="fa-solid fa-chair"></i> ${bench.ratings.comodidad || 0}</span>
                    </div>
                    <p style="font-size: 12px; color: #666; margin-bottom: 8px;">${bench.description}</p>
                    <a href="bench-card.html?id=${bench.id}" style="display: block; width: 100%; background: #16a34a; color: white; text-align: center; padding: 6px; border-radius: 4px; text-decoration: none; font-size: 12px; font-weight: bold;">Ver Detalles</a>
                </div>
            `;

            marker.bindPopup(popupContent);
        });
    }

    /**
     * Aplicar filtros
     */
    function applyFilters() {
        const viewsFilter = parseInt(document.querySelector('input.range-input')?.value || 1);
        const privacyFilter = document.querySelector('select.privacy-select')?.value || 'Cualquiera';

        // Limpiar marcadores
        map.eachLayer(layer => {
            if (layer instanceof L.Marker) {
                map.removeLayer(layer);
            }
        });

        // Filtrar
        const filtered = benchesData.filter(bench => {
            const meetsViews = (bench.ratings.vistas || 0) >= viewsFilter;
            const meetsPrivacy = privacyFilter === 'Cualquiera' || 
                                (privacyFilter === 'Muy Privado (Poca gente)' && (bench.ratings.privacidad || 0) >= 4) ||
                                (privacyFilter === 'Concurrido (Ambiente social)' && (bench.ratings.privacidad || 0) <= 2);
            return meetsViews && meetsPrivacy;
        });

        console.log('🔍 Filtros aplicados:', filtered.length, 'bancos encontrados');
        loadBenches(filtered);
    }

    /**
     * Inicializar al cargar
     */
    document.addEventListener('DOMContentLoaded', async () => {
        console.log('📍 DOM cargado, inicializando mapa...');


        // Verificar que Leaflet esté disponible
        if (typeof L === 'undefined') {
            console.error('❌ Leaflet no está cargado');
            const mapEl = document.getElementById('map');
            if (mapEl) mapEl.innerHTML = '<div style="padding: 20px; color: red;">Error: Leaflet no está disponible</div>';
            return;
        }

        // Inicializar mapa
        await initMap();

        // Configurar botones
        const filterBtn = document.querySelector('.apply-filters-btn');
        if (filterBtn) {
            filterBtn.addEventListener('click', applyFilters);
        }

        const addBtn = document.querySelector('.add-bench-button');
        if (addBtn) {
            addBtn.addEventListener('click', () => {
                window.location.href = 'add-bench.html';
            });
        }

        // Reajustar mapa en responsive
        window.addEventListener('resize', () => {
            if (map) map.invalidateSize();
        });

        console.log('✅ Mapa listo');
    });

    // Exponer funciones globales
    window.benchifyMap = {
        initMap,
        loadBenches,
        applyFilters,
        refreshBenches: async () => {
            map.eachLayer(layer => {
                if (layer instanceof L.Marker) map.removeLayer(layer);
            });
            benchesData = await loadBenchesFromFirebase();
            loadBenches(benchesData);
        }
    };

})();
