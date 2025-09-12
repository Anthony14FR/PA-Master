"use client";

import { useRouter } from 'next/navigation';
import { ArrowLeft, Star, MapPin, Users, Clock, Shield, Heart, Phone, Mail } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { useMapData } from '../hooks/useMapData';

export function PensionDetailPage({ pensionId }) {
    const router = useRouter();
    const { properties } = useMapData();
    
    // Trouver la pension par ID
    const pension = properties.find(p => p.id === parseInt(pensionId));
    
    if (!pension) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-gray-500">Pension non trouvée</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header avec image */}
            <div className="relative h-64 bg-gray-200">
                <img
                    src={pension.image}
                    alt={pension.name}
                    className="w-full h-full object-cover"
                />
                <button
                    onClick={() => router.back()}
                    className="absolute top-4 left-4 p-2 bg-white rounded-full shadow-lg"
                >
                    <ArrowLeft className="h-5 w-5" />
                </button>
            </div>

            <div className="px-4 -mt-6 relative z-10">
                {/* Card principale */}
                <Card className="shadow-lg border-0">
                    <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex-1">
                                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                                    {pension.name}
                                </h1>
                                <div className="flex items-center text-gray-600 mb-2">
                                    <MapPin className="h-4 w-4 mr-2" />
                                    <span>{pension.location}</span>
                                </div>
                                <div className="flex items-center">
                                    <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                                    <span className="font-semibold">{pension.rating}</span>
                                    <span className="text-gray-500 ml-1">({pension.reviewCount} avis)</span>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-2xl font-bold text-gray-900">
                                    {pension.pricePerDay}€
                                </div>
                                <div className="text-sm text-gray-500">par jour</div>
                            </div>
                        </div>

                        {/* Disponibilité */}
                        <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg mb-6">
                            <div className="flex items-center">
                                <Users className="h-5 w-5 text-green-600 mr-2" />
                                <span className="text-green-800 font-medium">
                                    {pension.availableSpots} places disponibles
                                </span>
                            </div>
                            <Badge className="bg-green-100 text-green-800">
                                Disponible maintenant
                            </Badge>
                        </div>

                        {/* Description */}
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold mb-2">À propos</h3>
                            <p className="text-gray-600 leading-relaxed">
                                {pension.description} Notre équipe professionnelle s'occupe de votre animal avec amour et attention. 
                                Nous proposons des espaces sécurisés et adaptés pour le bien-être de tous nos pensionnaires.
                            </p>
                        </div>

                        {/* Services */}
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold mb-3">Services inclus</h3>
                            <div className="grid grid-cols-1 gap-3">
                                {pension.services.map((service, index) => (
                                    <div key={index} className="flex items-center">
                                        <Shield className="h-4 w-4 text-green-600 mr-3" />
                                        <span className="text-gray-700">{service}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Contact */}
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold mb-3">Contact</h3>
                            <div className="space-y-2">
                                <div className="flex items-center">
                                    <Phone className="h-4 w-4 text-gray-500 mr-3" />
                                    <span className="text-gray-700">01 23 45 67 89</span>
                                </div>
                                <div className="flex items-center">
                                    <Mail className="h-4 w-4 text-gray-500 mr-3" />
                                    <span className="text-gray-700">contact@{pension.name.toLowerCase().replace(/\s+/g, '')}.fr</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Avis fictifs */}
                <Card className="mt-4 shadow-lg border-0">
                    <CardContent className="p-6">
                        <h3 className="text-lg font-semibold mb-4">Avis récents</h3>
                        <div className="space-y-4">
                            <div className="border-b pb-4 last:border-b-0">
                                <div className="flex items-center mb-2">
                                    <div className="flex">
                                        {[1,2,3,4,5].map(star => (
                                            <Star key={star} className="h-4 w-4 text-yellow-400 fill-current" />
                                        ))}
                                    </div>
                                    <span className="ml-2 font-medium">Marie D.</span>
                                </div>
                                <p className="text-gray-600 text-sm">
                                    "Excellent service ! Mon chien a été très bien traité. Je recommande vivement."
                                </p>
                            </div>
                            <div className="border-b pb-4 last:border-b-0">
                                <div className="flex items-center mb-2">
                                    <div className="flex">
                                        {[1,2,3,4,5].map(star => (
                                            <Star key={star} className="h-4 w-4 text-yellow-400 fill-current" />
                                        ))}
                                    </div>
                                    <span className="ml-2 font-medium">Pierre L.</span>
                                </div>
                                <p className="text-gray-600 text-sm">
                                    "Personnel très professionnel et installations impeccables."
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Bouton de réservation fixe */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 z-10">
                <Button 
                    className="w-full h-12 text-lg font-semibold bg-green-600 hover:bg-green-700"
                    onClick={() => alert('Fonctionnalité de réservation à implémenter')}
                >
                    Réserver maintenant - {pension.pricePerDay}€/jour
                </Button>
            </div>

            {/* Espace pour le bouton fixe */}
            <div className="h-20"></div>
        </div>
    );
}