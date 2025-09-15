"use client";

import { useRef, useCallback, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || 'pk.eyJ1IjoidGVzdCIsImEiOiJjbHRlc3QifQ.test';

export function MapView({ properties, onMarkerClick, selectedPropertyId, onMapClick }) {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const markersRef = useRef([]);

    // Créer la map une seule fois
    useEffect(() => {
        if (!mapContainer.current) return;

        mapboxgl.accessToken = MAPBOX_TOKEN;

        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v12',
            center: [2.3522, 48.8566], // Paris
            zoom: 12,
            attributionControl: false
        });

        return () => {
            if (map.current) {
                map.current.remove();
            }
        };
    }, []); // Pas de dépendances = créé une seule fois

    // Gestionnaire de clic sur la map (séparé)
    useEffect(() => {
        if (!map.current) return;

        const handleMapClick = (e) => {
            // Vérifier si le clic n'est pas sur un marqueur
            const features = map.current.queryRenderedFeatures(e.point);
            const isMarkerClick = features.some(feature => 
                feature.layer && feature.layer.type === 'symbol'
            );
            
            if (!isMarkerClick && onMapClick) {
                onMapClick();
            }
        };

        map.current.on('click', handleMapClick);

        return () => {
            if (map.current) {
                map.current.off('click', handleMapClick);
            }
        };
    }, [onMapClick]);

    // Centrer la map sur le marqueur sélectionné (SANS zoom)
    useEffect(() => {
        if (!map.current || !selectedPropertyId) return;

        const selectedProperty = properties.find(p => p.id === selectedPropertyId);
        if (selectedProperty) {
            map.current.easeTo({
                center: [selectedProperty.longitude, selectedProperty.latitude],
                duration: 800
                // Pas de zoom = garde le zoom actuel
            });
        }
    }, [selectedPropertyId, properties]);

    // Gestion des marqueurs
    useEffect(() => {
        if (!map.current) return;

        // Nettoyer les anciens markers
        markersRef.current.forEach(marker => marker.remove());
        markersRef.current = [];

        // Ajouter les nouveaux markers
        properties.forEach(property => {
            const isSelected = selectedPropertyId === property.id;
            const markerElement = document.createElement('button');
            
            markerElement.className = isSelected
                ? 'bg-white text-green-600 px-3 py-2 rounded-full text-xs font-bold shadow-lg border-2 border-green-600 transition-colors duration-200 hover:shadow-xl'
                : 'bg-green-600 text-white px-3 py-2 rounded-full text-xs font-bold shadow-lg transition-colors duration-200 hover:bg-green-700 hover:shadow-xl';
            
            markerElement.innerHTML = `${property.pricePerDay}€`;
            markerElement.onclick = (e) => {
                e.stopPropagation(); // Empêcher la propagation vers la map
                onMarkerClick(property);
            };

            const marker = new mapboxgl.Marker({ element: markerElement })
                .setLngLat([property.longitude, property.latitude])
                .addTo(map.current);

            markersRef.current.push(marker);
        });
    }, [properties, onMarkerClick, selectedPropertyId]);

    return (
        <div 
            ref={mapContainer} 
            className="w-full h-full" 
            style={{ width: '100%', height: '100%' }}
        />
    );
}