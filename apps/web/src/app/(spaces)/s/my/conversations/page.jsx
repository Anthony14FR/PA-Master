'use client';

import { useRouter } from 'next/navigation';
import { ConversationList } from '@kennelo/features/conversations/components/conversation-list';

export default function ConversationsPage() {
  const router = useRouter();

  const handleSelectConversation = (conversation) => {
    router.push(`/s/my/conversations/${conversation.id}`);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Mes conversations</h1>
        <p className="text-muted-foreground">
          Gérez vos conversations avec les établissements
        </p>
      </div>

      <ConversationList onSelectConversation={handleSelectConversation} />
    </div>
  );
}
