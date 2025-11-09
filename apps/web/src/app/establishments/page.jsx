'use client';

import { EstablishmentList } from '@kennelo/features/establishments/components/establishment-list';
import { useConversation } from '@kennelo/features/conversations/hooks/use-conversation';
import { useAuth } from '@kennelo/hooks/use-auth';
import { useEstablishmentsTranslation } from '@kennelo/hooks/use-translation';
import { useRouter } from 'next/navigation';
import { AUTH_NAMESPACE } from '@kennelo/config/access-control.config';

export default function EstablishmentsPage() {
  const router = useRouter();
  const { T } = useEstablishmentsTranslation();
  const { isAuthenticated } = useAuth();
  const { getOrCreateConversation } = useConversation();

  const handleContact = async (establishment) => {
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          <T tKey="title" skeletonWidth={200} />
        </h1>
        <p className="text-muted-foreground">
          <T tKey="findPerfect" skeletonWidth={350} />
        </p>
      </div>

      <EstablishmentList onContact={handleContact} />
    </div>
  );
}
