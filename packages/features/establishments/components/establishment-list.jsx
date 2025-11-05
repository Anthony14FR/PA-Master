'use client';

import { useState, useEffect } from 'react';
import { EstablishmentCard } from './establishment-card';
import { establishmentService } from '@kennelo/services/api/establishment.service';
import { Button } from '@kennelo/ui/button';
import { Loader2 } from 'lucide-react';

export function EstablishmentList({ onContact }) {
  const [establishments, setEstablishments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    loadEstablishments();
  }, [page]);

  const loadEstablishments = async () => {
    try {
      setLoading(true);
      const response = await establishmentService.getAll(page);

      if (page === 1) {
        setEstablishments(response.data);
      } else {
        setEstablishments(prev => [...prev, ...response.data]);
      }

      setHasMore(response.current_page < response.last_page);
    } catch (error) {
      console.error('Error loading establishments:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading && page === 1) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {establishments.map((establishment) => (
          <EstablishmentCard
            key={establishment.id}
            establishment={establishment}
            onContact={onContact}
          />
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center pt-4">
          <Button
            variant="outline"
            onClick={() => setPage(p => p + 1)}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Chargement...
              </>
            ) : (
              'Charger plus'
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
