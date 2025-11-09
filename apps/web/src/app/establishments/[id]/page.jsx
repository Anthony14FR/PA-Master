'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { establishmentService } from '@kennelo/services/api/establishment.service';
import { useConversation } from '@kennelo/features/conversations/hooks/use-conversation';
import { useAuth } from '@kennelo/hooks/use-auth';
import { useEstablishmentsTranslation } from '@kennelo/hooks/use-translation';
import { Button } from '@kennelo/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@kennelo/ui/card';
import { MapPin, Phone, Mail, Globe, ArrowLeft, MessageCircle, Loader2 } from 'lucide-react';
import KLink from '@kennelo/components/k-link';
import { AUTH_NAMESPACE } from '@kennelo/config/access-control.config';

export default function EstablishmentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { T } = useEstablishmentsTranslation();
  const { isAuthenticated } = useAuth();
  const { getOrCreateConversation } = useConversation();
  const [establishment, setEstablishment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEstablishment();
  }, [params.id]);

  const loadEstablishment = async () => {
    try {
      setLoading(true);
      const data = await establishmentService.getDetails(params.id);
      setEstablishment(data);
    } catch (error) {
      console.error('Error loading establishment:', error);
      router.push('/establishments');
    } finally {
      setLoading(false);
    }
  };

  const handleContact = async () => {
    if (!isAuthenticated) {
      const returnUrl = encodeURIComponent(window.location.pathname);
      router.push(`/s/${AUTH_NAMESPACE}/login?returnUrl=${returnUrl}`);
      return;
    }

    try {
      const conversation = await getOrCreateConversation(establishment.id);
      router.push(`/s/my/conversations/${conversation.id}`);
    } catch (error) {
      console.error('Error creating conversation:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!establishment) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <KLink href="/establishments">
        <Button variant="ghost" className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          <T tKey="backToList" skeletonWidth={180} />
        </Button>
      </KLink>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-3xl mb-2">{establishment.name}</CardTitle>
              {establishment.description && (
                <p className="text-muted-foreground">{establishment.description}</p>
              )}
            </div>
            {establishment.logo && (
              <img
                src={establishment.logo}
                alt={establishment.name}
                className="w-24 h-24 object-cover rounded-lg"
              />
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-3">
            {establishment.address && (
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 mt-0.5 text-muted-foreground" />
                <div>
                  <p className="font-medium">
                    <T tKey="labels.address" skeletonWidth={60} />
                  </p>
                  <p className="text-muted-foreground">
                    {establishment.address.street && `${establishment.address.street}, `}
                    {establishment.address.city}, {establishment.address.postal_code}
                    {establishment.address.region && ` - ${establishment.address.region}`}
                  </p>
                </div>
              </div>
            )}

            {establishment.phone && (
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">
                    <T tKey="labels.phone" skeletonWidth={70} />
                  </p>
                  <p className="text-muted-foreground">{establishment.phone}</p>
                </div>
              </div>
            )}

            {establishment.email && (
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">
                    <T tKey="labels.email" skeletonWidth={50} />
                  </p>
                  <p className="text-muted-foreground">{establishment.email}</p>
                </div>
              </div>
            )}

            {establishment.website && (
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">
                    <T tKey="labels.website" skeletonWidth={70} />
                  </p>
                  <a
                    href={establishment.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {establishment.website}
                  </a>
                </div>
              </div>
            )}
          </div>

          <div className="pt-4">
            <Button onClick={handleContact} size="lg" className="w-full sm:w-auto">
              <MessageCircle className="w-4 h-4 mr-2" />
              <T tKey="contactThis" skeletonWidth={180} />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
