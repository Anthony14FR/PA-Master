"use client";

import { useState, useEffect, useMemo } from 'react';

// Mock data pour pensions d'animaux
const mockPensions = [
    {
        id: 1,
        name: "Pension Les Amis à Quatre Pattes",
        type: "chiens_chats",
        location: "Belleville, Paris 20e",
        pricePerDay: 35,
        rating: 4.8,
        reviewCount: 127,
        availableSpots: 3,
        totalSpots: 15,
        longitude: 2.3522,
        latitude: 48.8566,
        image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=250&fit=crop",
        services: ["Promenade", "Toilettage", "Soins vétérinaires"],
        description: "Pension familiale avec jardin sécurisé",
        distance: "1.2 km"
    },
    {
        id: 2,
        name: "Villa Canine & Féline",
        type: "chiens_chats",
        location: "Marais, Paris 4e",
        pricePerDay: 45,
        rating: 4.9,
        reviewCount: 89,
        availableSpots: 2,
        totalSpots: 12,
        longitude: 2.3622,
        latitude: 48.8566,
        image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400&h=250&fit=crop",
        services: ["Promenade", "Jeux", "Webcam 24h"],
        description: "Pension haut de gamme au cœur de Paris",
        distance: "0.8 km"
    },
    {
        id: 3,
        name: "Happy Paws Resort",
        type: "chiens",
        location: "République, Paris 11e",
        pricePerDay: 28,
        rating: 4.6,
        reviewCount: 203,
        availableSpots: 5,
        totalSpots: 20,
        longitude: 2.3422,
        latitude: 48.8666,
        image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=250&fit=crop",
        services: ["Promenade", "Dressage", "Parc de jeux"],
        description: "Grande pension spécialisée pour chiens",
        distance: "1.5 km"
    },
    {
        id: 4,
        name: "Félin Palace",
        type: "chats",
        location: "Montmartre, Paris 18e",
        pricePerDay: 32,
        rating: 4.7,
        reviewCount: 156,
        availableSpots: 4,
        totalSpots: 10,
        longitude: 2.3322,
        latitude: 48.8866,
        image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=250&fit=crop",
        services: ["Soins spécialisés", "Arbres à chat", "Salon"],
        description: "Pension exclusive pour nos amis félins",
        distance: "2.1 km"
    },
    {
        id: 5,
        name: "Garden Pet Hotel",
        type: "chiens_chats",
        location: "Bastille, Paris 12e",
        pricePerDay: 38,
        rating: 4.5,
        reviewCount: 94,
        availableSpots: 1,
        totalSpots: 18,
        longitude: 2.3722,
        latitude: 48.8466,
        image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=250&fit=crop",
        services: ["Grand jardin", "Piscine canine", "Massage"],
        description: "Hôtel 5 étoiles pour animaux de compagnie",
        distance: "1.8 km"
    },
    {
        id: 6,
        name: "Pension du Parc",
        type: "chiens",
        location: "Bois de Vincennes, Paris 12e",
        pricePerDay: 25,
        rating: 4.4,
        reviewCount: 67,
        availableSpots: 8,
        totalSpots: 25,
        longitude: 2.4122,
        latitude: 48.8366,
        image: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=250&fit=crop",
        services: ["Promenade en forêt", "Agility", "Pension familiale"],
        description: "Au cœur de la nature, idéal pour les chiens actifs",
        distance: "3.2 km"
    }
];

export function useMapData(searchQuery = '') {
    const [pensions] = useState(mockPensions);

    const filteredPensions = useMemo(() => {
        if (!searchQuery.trim()) return pensions;
        
        return pensions.filter(pension =>
            pension.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            pension.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
            pension.services.some(service => 
                service.toLowerCase().includes(searchQuery.toLowerCase())
            )
        );
    }, [pensions, searchQuery]);

    return {
        properties: pensions, // Garde le nom pour compatibilité
        filteredProperties: filteredPensions
    };
}