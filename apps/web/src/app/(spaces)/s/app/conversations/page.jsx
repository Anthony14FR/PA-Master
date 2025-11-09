'use client';

import { useRouter } from 'next/navigation';
import { ConversationList } from '@kennelo/features/conversations/components/conversation-list';
import { Button } from '@kennelo/ui/button';
import { ArrowLeft } from 'lucide-react';
import KLink from '@kennelo/components/k-link';

export default function ManagerConversationsPage() {
  const router = useRouter();

  const handleSelectConversation = (conversation) => {
    router.push(`/s/app/conversations/${conversation.id}`);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <KLink context="app" href="/overview">
        <Button variant="ghost" className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour au tableau de bord
        </Button>
      </KLink>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Mes conversations</h1>
        <p className="text-muted-foreground">
          Gérez les conversations avec vos clients
        </p>
      </div>

      <ConversationList onSelectConversation={handleSelectConversation} />
    </div>
  );
}
