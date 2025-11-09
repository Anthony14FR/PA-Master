'use client';

import { createContext, useCallback, useEffect, useState, useRef } from 'react';
import { conversationService } from '../services/conversation.service';
import { websocketService } from '@kennelo/services/websocket.service';
import { useAuth } from '@kennelo/hooks/use-auth';
import { authService } from '@kennelo/services/api/auth.service';

const ConversationContext = createContext(null);

export function ConversationProvider({ children }) {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [connected, setConnected] = useState(false);
  const subscribedConversationsRef = useRef(new Set());

  useEffect(() => {
    if (user) {
      initializeWebSocket();
      loadConversations();
    }
  }, [user]);

  useEffect(() => {
    if (!conversations.length || !connected) {
      return;
    }

    conversations.forEach(conversation => {
      if (subscribedConversationsRef.current.has(conversation.id)) {
        return;
      }

      subscribedConversationsRef.current.add(conversation.id);

      websocketService.joinConversation(conversation.id, {
        onMessageSent: (event) => {
          updateConversationLastMessage(event.conversation_id, {
            id: event.id,
            content: event.content,
            created_at: event.created_at,
            sender_id: event.sender_id
          });

          if (event.sender_id !== user?.id) {
            setConversations(prev =>
              prev.map(c =>
                c.id === event.conversation_id
                  ? { ...c, unread_count: (c.unread_count || 0) + 1 }
                  : c
              )
            );
          }
        }
      }, 'context');
    });
  }, [conversations.length, connected, user?.id]);

  const initializeWebSocket = async () => {
    try {
      const token = await authService.getAccessToken();
      if (!token) return;

      if (!websocketService.getConnectionState()) {
        websocketService.connect(token);
        await new Promise(resolve => setTimeout(resolve, 1000));
        setConnected(true);
      }
    } catch (error) {
      console.error('WebSocket initialization error:', error);
    }
  };

  const loadConversations = async () => {
    try {
      setLoading(true);
      const response = await conversationService.getAll();
      setConversations(response.data || []);
    } catch (error) {
      console.error('Error loading conversations:', error);
      setConversations([]);
    } finally {
      setLoading(false);
    }
  };

  const clearUnreadCount = useCallback((conversationId) => {
    setConversations(prev =>
      prev.map(c =>
        c.id === conversationId
          ? { ...c, unread_count: 0 }
          : c
      )
    );
  }, []);

  const getOrCreateConversation = useCallback(async (establishmentId) => {
    try {
      const conversation = await conversationService.getOrCreate(establishmentId);

      setConversations(prev => {
        const existingIndex = prev.findIndex(c => c.id === conversation.id);
        if (existingIndex >= 0) {
          const updated = [...prev];
          updated[existingIndex] = conversation;
          return updated;
        } else {
          return [conversation, ...prev];
        }
      });

      setActiveConversation(conversation);
      return conversation;
    } catch (error) {
      console.error('Error creating conversation:', error);
      throw error;
    }
  }, []);

  const updateConversationLastMessage = useCallback((conversationId, message) => {
    setConversations(prev => {
      const updated = [...prev];
      const index = updated.findIndex(c => c.id === conversationId);

      if (index >= 0) {
        updated[index] = {
          ...updated[index],
          last_message: message,
          updated_at: message.created_at
        };

        const conversation = updated.splice(index, 1)[0];
        updated.unshift(conversation);
      }

      return updated;
    });
  }, []);

  const markAsRead = useCallback(async (conversationId) => {
    try {
      await conversationService.markAsRead(conversationId);

      setConversations(prev =>
        prev.map(c =>
          c.id === conversationId
            ? { ...c, unread_count: 0 }
            : c
        )
      );
    } catch (error) {
      console.error('Error marking conversation as read:', error);
    }
  }, []);

  const value = {
    conversations,
    activeConversation,
    loading,
    connected,

    setActiveConversation,
    getOrCreateConversation,
    updateConversationLastMessage,
    markAsRead,
    refreshConversations: loadConversations,
  };

  return (
    <ConversationContext.Provider value={value}>
      {children}
    </ConversationContext.Provider>
  );
}

export { ConversationContext };
