'use client';

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { MessageBubble } from './message-bubble';
import { BookingCard } from '@kennelo/features/bookings/components/booking-card';
import { Button } from '@kennelo/ui/button';
import { Textarea } from '@kennelo/ui/textarea';
import { Card } from '@kennelo/ui/card';
import { Avatar } from '@kennelo/ui/avatar';
import { ArrowLeft, Send, Loader2 } from 'lucide-react';
import { conversationService } from '../services/conversation.service';
import { bookingService } from '@kennelo/features/bookings/services/booking.service';
import { websocketService } from '@kennelo/services/websocket.service';
import { useAuth } from '@kennelo/hooks/use-auth';
import { authService } from '@kennelo/services/api/auth.service';
import { useConversation } from '../hooks/use-conversation';

export function ConversationView({ conversationId, onBack }) {
  const { user } = useAuth();
  const { conversations, markAsRead: contextMarkAsRead } = useConversation();
  const [messages, setMessages] = useState([]);
  const [threadMessages, setThreadMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [content, setContent] = useState('');
  const [view, setView] = useState('conversation');
  const [activeBooking, setActiveBooking] = useState(null);
  const messagesEndRef = useRef(null);
  const initializedConversationId = useRef(null);

  const conversation = useMemo(() => {
    return conversations.find(c => c.id === conversationId);
  }, [conversations, conversationId]);

  const loadMessages = useCallback(async (convId) => {
    try {
      setLoading(true);
      const response = await conversationService.getMessages(convId);
      setMessages(response.data.reverse());
      await contextMarkAsRead(convId);
      setTimeout(() => scrollToBottom(true), 100);
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  }, [contextMarkAsRead]);

  const setupWebSocket = useCallback(async (convId) => {
    const token = await authService.getAccessToken();
    if (!token) {
      return;
    }

    if (!websocketService.getConnectionState()) {
      websocketService.connect(token);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    websocketService.joinConversation(convId, {
      onMessageSent: (event) => {
        if (event.sender_id === user?.id) {
          return;
        }

        if (!event.booking_id) {
          setMessages(prev => {
            const exists = prev.some(m => m.id === event.id);
            if (exists) return prev;
            return [...prev, event];
          });
        } else {
          setThreadMessages(prev => {
            if (event.booking_id === activeBooking?.id) {
              const exists = prev.some(m => m.id === event.id);
              if (exists) return prev;
              return [...prev, event];
            }
            return prev;
          });
        }
      },
      onBookingCreated: (event) => {
        setMessages(prev => {
          const exists = prev.some(m => m.id === event.message.id);
          if (exists) return prev;
          return [...prev, event.message];
        });
      },
    }, 'view');
  }, [user?.id, activeBooking?.id]);

  useEffect(() => {
    if (!conversationId) return;

    if (initializedConversationId.current === conversationId) {
      return;
    }

    if (initializedConversationId.current) {
      websocketService.leaveConversation(initializedConversationId.current, 'view');
    }

    initializedConversationId.current = conversationId;
    setMessages([]);
    loadMessages(conversationId);
    setupWebSocket(conversationId);
  }, [conversationId, loadMessages, setupWebSocket]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, threadMessages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!content.trim() || sending || !conversationId) return;

    try {
      setSending(true);
      const message = await conversationService.sendMessage(conversationId, content.trim());
      setMessages(prev => {
        const exists = prev.some(m => m.id === message.id);
        if (exists) return prev;
        return [...prev, message];
      });
      setContent('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  const handleSendThreadMessage = async (e) => {
    e.preventDefault();
    if (!content.trim() || sending || !activeBooking) return;

    try {
      setSending(true);
      const message = await bookingService.sendThreadMessage(activeBooking.id, content.trim());
      setThreadMessages(prev => {
        const exists = prev.some(m => m.id === message.id);
        if (exists) return prev;
        return [...prev, message];
      });
      setContent('');
    } catch (error) {
      console.error('Error sending thread message:', error);
    } finally {
      setSending(false);
    }
  };

  const handleOpenBookingThread = async (booking) => {
    try {
      setLoading(true);
      const response = await bookingService.getThreadMessages(booking.booking_id || booking.id);
      setActiveBooking(response.booking);
      setThreadMessages(response.messages);
      setView('thread');
    } catch (error) {
      console.error('Error loading thread:', error);
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = (instant = false) => {
    messagesEndRef.current?.scrollIntoView({ behavior: instant ? 'instant' : 'smooth' });
  };

  if (loading || !conversation) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const isUserConversation = conversation.user_id === user?.id;

  const getDisplayInfo = () => {
    if (isUserConversation) {
      return {
        name: conversation.establishment?.name || 'Établissement',
        avatar: conversation.establishment?.logo
      };
    }

    const clientUser = conversation.user;
    const establishmentName = conversation.establishment?.name || 'Établissement';

    if (!clientUser) {
      return {
        name: `Client #${conversation.user_id || 'inconnu'} (${establishmentName})`,
        avatar: null
      };
    }

    const fullName = `${clientUser.first_name || ''} ${clientUser.last_name || ''}`.trim();

    if (!fullName || fullName.toLowerCase().includes('account')) {
      const clientName = clientUser.email?.split('@')[0] || 'Client';
      return {
        name: `${clientName} (${establishmentName})`,
        avatar: clientUser.avatar_url
      };
    }

    return {
      name: `${fullName} (${establishmentName})`,
      avatar: clientUser.avatar_url
    };
  };

  const { name: displayName, avatar: displayAvatar } = getDisplayInfo();

  const getUserFullName = () => {
    if (!user) return '';
    const fullName = `${user.first_name || ''} ${user.last_name || ''}`.trim();
    if (!fullName || fullName.toLowerCase().includes('account')) {
      return user.email?.split('@')[0] || '';
    }
    return fullName;
  };

  const userFullName = getUserFullName();

  const headerTitle = () => {
    if (view === 'thread') {
      return `Réservation #${activeBooking?.id}`;
    }

    if (isUserConversation) {
      return `${userFullName} - ${displayName}`;
    } else {
      return `${userFullName} (${displayName})`;
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="border-b p-4 flex items-center gap-3 bg-background shadow-sm">
        <Button variant="ghost" size="icon" onClick={view === 'thread' ? () => setView('conversation') : onBack}>
          <ArrowLeft className="w-5 h-5" />
        </Button>

        {view === 'conversation' && (
          <Avatar
            name={displayName}
            src={displayAvatar}
            size="md"
            className="flex-shrink-0"
          />
        )}

        <div className="flex-1 min-w-0">
          <h2 className="font-semibold truncate">
            {headerTitle()}
          </h2>
          {view === 'thread' && activeBooking && (
            <p className="text-sm text-muted-foreground">
              {new Date(activeBooking.check_in_date).toLocaleDateString()} - {new Date(activeBooking.check_out_date).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-muted/20">
        {view === 'conversation' ? (
          <>
            {messages.map((message) => {
              if (message.message_type === 'booking_reference') {
                return (
                  <BookingCard
                    key={message.id}
                    booking={message}
                    onClick={() => handleOpenBookingThread(message.message_type === 'booking_reference' ? JSON.parse(message.content) : message)}
                  />
                );
              }
              return (
                <MessageBubble
                  key={message.id}
                  message={message}
                  isOwn={user?.id && message.sender_id === user.id}
                />
              );
            })}
          </>
        ) : (
          <>
            {activeBooking && (
              <Card className="p-4 mb-4 bg-muted/50">
                <div className="text-sm space-y-1">
                  <div><strong>Dates:</strong> {new Date(activeBooking.check_in_date).toLocaleDateString()} - {new Date(activeBooking.check_out_date).toLocaleDateString()}</div>
                  <div><strong>Prix:</strong> {activeBooking.total_price}€</div>
                  <div><strong>Animaux:</strong> {activeBooking.pets?.length || 0}</div>
                </div>
              </Card>
            )}
            {threadMessages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                isOwn={user?.id && message.sender_id === user.id}
              />
            ))}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={view === 'thread' ? handleSendThreadMessage : handleSendMessage} className="border-t p-4 bg-background shadow-lg">
        <div className="flex gap-2 items-end">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Écrivez votre message..."
            className="resize-none flex-1 min-h-[44px] max-h-[120px]"
            rows={1}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                view === 'thread' ? handleSendThreadMessage(e) : handleSendMessage(e);
              }
            }}
          />
          <Button
            type="submit"
            disabled={sending || !content.trim()}
            size="icon"
            className="h-11 w-11 shrink-0"
          >
            {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </Button>
        </div>
      </form>
    </div>
  );
}
