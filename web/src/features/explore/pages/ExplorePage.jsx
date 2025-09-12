"use client";

import { useState } from 'react';
import { MapView } from '../components/MapView';
import { SearchInput } from '../components/SearchInput';
import { ResultsDrawer } from '../components/ResultsDrawer';
import { PropertyCard } from '../components/PropertyCard';
import { useMapData } from '../hooks/useMapData';

export function ExplorePage() {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedProperty, setSelectedProperty] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    
    const { properties, filteredProperties } = useMapData(searchQuery);

    const handleMarkerClick = (property) => {
        setSelectedProperty(property);
    };

    const handleMapClick = () => {
        // Désélectionner le marqueur quand on clique sur la map
        setSelectedProperty(null);
    };

    const handlePropertySelect = (property) => {
        setSelectedProperty(property);
        setIsDrawerOpen(false);
    };

    return (
        <div className="relative h-screen w-full overflow-hidden">
            {/* Map - plein écran */}
            <MapView 
                properties={filteredProperties}
                onMarkerClick={handleMarkerClick}
                onMapClick={handleMapClick}
                selectedPropertyId={selectedProperty?.id}
            />
            
            {/* Search Input - overlay en haut */}
            <div className="absolute top-4 left-4 right-4 z-10">
                <SearchInput 
                    value={searchQuery}
                    onChange={setSearchQuery}
                    placeholder="Rechercher une pension, un quartier..."
                />
            </div>

            {/* Property Card - au-dessus du bouton */}
            {selectedProperty && (
                <div className="absolute bottom-20 left-2 right-2 z-20">
                    <PropertyCard 
                        property={selectedProperty}
                        variant="horizontal"
                    />
                </div>
            )}

            {/* Bouton Résultats - en bas */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-10">
                <button
                    onClick={() => setIsDrawerOpen(true)}
                    className="bg-gray-900 text-white px-6 py-3 rounded-full shadow-xl flex items-center gap-2 font-medium hover:bg-gray-800 transition-all transform hover:scale-105"
                >
                    <span>Voir {filteredProperties.length} pension{filteredProperties.length > 1 ? 's' : ''}</span>
                </button>
            </div>

            {/* Drawer - résultats */}
            <ResultsDrawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                properties={filteredProperties}
            />
        </div>
    );
}