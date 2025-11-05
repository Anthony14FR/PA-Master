'use client';

import { cn } from '@kennelo/lib/utils';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Avatar } from '@kennelo/ui/avatar';

export function MessageBubble({ message, isOwn }) {
  const isSystem = message.sender_type === 'system';

  if (isSystem) {
    return (
      <div className="flex justify-center my-4">
        <div className="bg-muted px-4 py-2 rounded-full text-sm text-muted-foreground">
          Message système
        </div>
      </div>
    );
  }

  const getSenderName = () => {
    if (!message.sender) return 'Utilisateur inconnu';

    const fullName = `${message.sender.first_name || ''} ${message.sender.last_name || ''}`.trim();

    // Si le nom est vide ou contient "account"
    if (!fullName || fullName.toLowerCase().includes('account')) {
      return message.sender.email?.split('@')[0] || 'Utilisateur';
    }

    return fullName;
  };

  const senderName = getSenderName();
  const displayLabel = isOwn ? 'Vous' : senderName;

  return (
    <div className={cn(
      'flex mb-4 gap-2',
      isOwn ? 'justify-end' : 'justify-start'
    )}>
      {!isOwn && (
        <Avatar
          name={senderName}
          src={message.sender?.avatar_url}
          size="sm"
          className="flex-shrink-0 mt-1"
        />
      )}
      <div className={cn(
        'max-w-[70%] rounded-2xl px-4 py-2 space-y-1 shadow-sm',
        isOwn
          ? 'bg-primary text-primary-foreground rounded-br-sm'
          : 'bg-muted rounded-bl-sm'
      )}>
        <div className="text-xs font-semibold">
          {isOwn ? (
            <span className="text-primary-foreground/80">Vous</span>
          ) : (
            <span className="text-foreground/80">{senderName}</span>
          )}
        </div>
        <div className="text-sm whitespace-pre-wrap break-words leading-relaxed">
          {message.content}
        </div>
        <div className={cn(
          'text-xs',
          isOwn ? 'text-primary-foreground/70' : 'text-muted-foreground'
        )}>
          {format(new Date(message.created_at), 'HH:mm', { locale: fr })}
        </div>
      </div>
      {isOwn && (
        <Avatar
          name={senderName}
          src={message.sender?.avatar_url}
          size="sm"
          className="flex-shrink-0 mt-1"
        />
      )}
    </div>
  );
}
