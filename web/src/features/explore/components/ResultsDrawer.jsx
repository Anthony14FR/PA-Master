// Supprimer les onClick et onPropertySelect car maintenant c'est géré dans PropertyCard
"use client";

import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/shared/components/ui/drawer';
import { PropertyCard } from './PropertyCard';

export function ResultsDrawer({ isOpen, onClose, properties }) {
    return (
        <Drawer open={isOpen} onOpenChange={onClose}>
            <DrawerContent className="h-[85vh]">
                <DrawerHeader className="border-b bg-white">
                    <DrawerTitle className="text-lg font-bold text-gray-900">
                        {properties.length} pension{properties.length > 1 ? 's' : ''} trouvée{properties.length > 1 ? 's' : ''}
                    </DrawerTitle>
                </DrawerHeader>
                <div className="overflow-y-auto bg-white p-4 space-y-4">
                    {properties.map((property) => (
                        <PropertyCard 
                            key={property.id}
                            property={property} 
                            variant="vertical"
                        />
                    ))}
                </div>
            </DrawerContent>
        </Drawer>
    );
}