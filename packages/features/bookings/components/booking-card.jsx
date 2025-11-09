'use client';

import { Card, CardContent } from '@kennelo/ui/card';
import { Calendar, DollarSign, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@kennelo/lib/utils';

export function BookingCard({ booking, onClick, className }) {
  const bookingData = typeof booking.content === 'string'
    ? JSON.parse(booking.content)
    : booking;

  const checkIn = new Date(bookingData.check_in || bookingData.check_in_date);
  const checkOut = new Date(bookingData.check_out || bookingData.check_out_date);

  return (
    <Card
      className={cn(
        'cursor-pointer hover:shadow-md transition-shadow border-2 border-primary/20',
        className
      )}
      onClick={onClick}
    >
      <CardContent className="p-4 space-y-2">
        <div className="flex items-center justify-between">
          <div className="font-semibold text-sm">
            Réservation #{bookingData.booking_id || bookingData.id}
          </div>
          <ArrowRight className="w-4 h-4 text-muted-foreground" />
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="w-4 h-4" />
          <span>
            {format(checkIn, 'dd MMM', { locale: fr })} - {format(checkOut, 'dd MMM yyyy', { locale: fr })}
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <DollarSign className="w-4 h-4" />
          <span>{bookingData.total_price}€</span>
        </div>

        <div className="text-xs text-primary font-medium pt-1">
          Cliquer pour voir la discussion
        </div>
      </CardContent>
    </Card>
  );
}
