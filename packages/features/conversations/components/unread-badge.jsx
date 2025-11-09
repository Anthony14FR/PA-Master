'use client';

import { useEffect, useState } from 'react';
import { useConversation } from '../hooks/use-conversation';
import { Badge } from '@kennelo/ui/badge';

export function UnreadBadge() {
  const { conversations } = useConversation();
  const [totalUnread, setTotalUnread] = useState(0);

  useEffect(() => {
    if (conversations) {
      const total = conversations.reduce((sum, conv) => sum + (conv.unread_count || 0), 0);
      setTotalUnread(total);
    }
  }, [conversations]);

  if (totalUnread === 0) {
    return null;
  }

  return (
    <Badge variant="destructive" className="ml-2">
      {totalUnread}
    </Badge>
  );
}
