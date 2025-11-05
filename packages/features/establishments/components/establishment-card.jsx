'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@kennelo/ui/card';
import { Button } from '@kennelo/ui/button';
import { MapPin, Phone, Mail } from 'lucide-react';
import KLink from '@kennelo/components/k-link';

export function EstablishmentCard({ establishment, onContact }) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle>{establishment.name}</CardTitle>
        <CardDescription>
          {establishment.description || 'Pension pour animaux'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {establishment.address && (
          <div className="flex items-start gap-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4 mt-0.5" />
            <span>
              {establishment.address.city}, {establishment.address.region}
            </span>
          </div>
        )}

        {establishment.phone && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Phone className="w-4 h-4" />
            <span>{establishment.phone}</span>
          </div>
        )}

        {establishment.email && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Mail className="w-4 h-4" />
            <span>{establishment.email}</span>
          </div>
        )}

        <div className="pt-2 flex gap-2">
          <Button
            variant="default"
            className="flex-1"
            onClick={() => onContact(establishment)}
          >
            Contacter
          </Button>
          <Button
            variant="outline"
            asChild
          >
            <KLink href={`/establishments/${establishment.id}`}>
              Voir détails
            </KLink>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
