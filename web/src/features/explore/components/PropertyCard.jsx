"use client";

import { Star } from 'lucide-react';
import { Card, CardContent } from '@/shared/components/ui/card';
import { useRouter } from 'next/navigation';

export function PropertyCard({ property, variant = "horizontal" }) {
    const router = useRouter();

    const handleClick = () => {
        router.push(`/dashboard/explore/pension/${property.id}`);
    };

    if (variant === "vertical") {
        return (
            <Card 
                className="overflow-hidden bg-white border-0 shadow-none rounded-2xl py-0 gap-0 cursor-pointer hover:scale-[1.02] transition-transform"
                onClick={handleClick}
            >
                <CardContent className="p-0">
                    {/* Image en haut */}
                    <div className="w-full h-40 relative">
                        <img
                            src={property.image}
                            alt={property.name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    
                    {/* Contenu en bas */}
                    <div className="p-5">
                        <h3 className="font-bold text-lg text-gray-900 leading-tight mb-2">
                            {property.name}
                        </h3>
                        <div className="text-sm text-gray-500 mb-1">
                            {property.location}
                        </div>
                        <div className="text-sm text-gray-500 mb-4">
                            {property.availableSpots} places disponible{property.availableSpots > 1 ? 's' : ''}
                        </div>
                        
                        <div className="flex items-center justify-between">
                            <div>
                                <span className="font-bold text-lg text-gray-900">
                                    {property.pricePerDay}€
                                </span>
                                <span className="text-sm text-gray-500 ml-1">par jour</span>
                            </div>
                            <div className="flex items-center">
                                <Star className="h-4 w-4 text-gray-900 fill-current mr-1" />
                                <span className="text-sm font-semibold text-gray-900">
                                    {property.rating}
                                </span>
                                <span className="text-sm text-gray-500 ml-1">
                                    ({property.reviewCount})
                                </span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    // Card horizontale cliquable
    return (
        <Card 
            className="shadow-lg border border-gray-200 overflow-hidden bg-white w-full py-0 gap-0 cursor-pointer hover:shadow-xl transition-shadow"
            onClick={handleClick}
        >
            <CardContent className="p-0">
                <div className="flex">
                    {/* Image */}
                    <div className="w-20 flex-shrink-0">
                        <img
                            src={property.image}
                            alt={property.name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    
                    {/* Contenu */}
                    <div className="flex-1 p-3 min-w-0">
                        <h3 className="font-semibold text-sm text-gray-900 leading-tight mb-1">
                            {property.name}
                        </h3>

                        <div className="text-xs text-gray-500 mb-2">
                            {property.availableSpots} places disponible{property.availableSpots > 1 ? 's' : ''}
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="font-bold text-sm text-gray-900">
                                {property.pricePerDay}€ <span className="font-normal text-xs text-gray-500">par jour</span>
                            </div>
                            <div className="flex items-center">
                                <Star className="h-3 w-3 text-gray-900 fill-current mr-1" />
                                <span className="text-xs font-medium text-gray-900">
                                    {property.rating} ({property.reviewCount})
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}