"use client";

import { Search } from 'lucide-react';
import { Input } from '@/shared/components/ui/input';

export function SearchInput({ value, onChange, placeholder }) {
    return (
        <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder || "Rechercher une pension, un quartier..."}
                className="pl-12 pr-4 bg-white shadow-lg border-0 rounded-full h-12 text-sm font-medium placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500"
            />
        </div>
    );
}