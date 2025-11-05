'use client';

import { useEffect } from 'react';
import { Card } from '@kennelo/ui/card';
import { Avatar } from '@kennelo/ui/avatar';
import { Loader2, MessageCircle } from 'lucide-react';
import { useConversation } from '../hooks/use-conversation';
import { useAuth } from '@kennelo/hooks/use-auth';
import { cn } from '@kennelo/lib/utils';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export function ConversationList({ onSelectConversation }) {
  const { conversations = [], loading, activeConversation } = useConversation();
  const { user } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <MessageCircle className="w-12 h-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">Aucune conversation</h3>
        <p className="text-sm text-muted-foreground">
          Commencez une conversation avec un établissement
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {conversations.map((conversation) => {
        const isActive = activeConversation?.id === conversation.id;
        const isUserConversation = conversation.user_id === user?.id;

        const getDisplayInfo = () => {
          if (isUserConversation) {
            return {
              name: conversation.establishment?.name || 'Établissement',
              avatar: conversation.establishment?.logo
            };
          }

          const clientUser = conversation.user;

          if (!clientUser) {
            return {
              name: `Client #${conversation.user_id || 'inconnu'}`,
              avatar: null
            };
          }

          const fullName = `${clientUser.first_name || ''} ${clientUser.last_name || ''}`.trim();

          if (!fullName || fullName.toLowerCase().includes('account')) {
            const clientName = clientUser.email?.split('@')[0] || `Client #${conversation.user_id}`;
            return {
              name: clientName,
              avatar: clientUser.avatar_url
            };
          }

          return {
            name: fullName,
            avatar: clientUser.avatar_url
          };
        };

        const { name: displayName, avatar: displayAvatar } = getDisplayInfo();

        return (
          <Card
            key={conversation.id}
            className={cn(
              'p-4 cursor-pointer hover:shadow-md transition-all',
              isActive && 'border-2 border-primary'
            )}
            onClick={() => onSelectConversation(conversation)}
          >
            <div className="flex items-start gap-3">
              <Avatar
                name={displayName}
                src={displayAvatar}
                size="lg"
                className="flex-shrink-0"
              />

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-1">
                  <h3 className="font-semibold truncate">{displayName}</h3>
                  {conversation.last_message && (
                    <span className="text-xs text-muted-foreground ml-2 shrink-0">
                      {format(new Date(conversation.updated_at), 'HH:mm', { locale: fr })}
                    </span>
                  )}
                </div>

                {conversation.last_message && (
                  <p className="text-sm text-muted-foreground truncate">
                    {conversation.last_message.content}
                  </p>
                )}

                {conversation.unread_count > 0 && (
                  <div className="mt-2">
                    <span className="inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-primary rounded-full">
                      {conversation.unread_count}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
