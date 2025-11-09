'use client';

import { useParams, useRouter } from 'next/navigation';
import { ConversationView } from '@kennelo/features/conversations/components/conversation-view';

export default function ManagerConversationDetailPage() {
  const params = useParams();
  const router = useRouter();

  return (
    <div className="h-screen">
      <ConversationView
        conversationId={params.id}
        onBack={() => router.push('/s/app/conversations')}
      />
    </div>
  );
}
