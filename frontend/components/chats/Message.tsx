// components/chats/Message.tsx
import React from 'react';
import { MessageSimple, useMessageContext } from 'stream-chat-expo';

export function Message(props: any) {
  // <- trae todo lo necesario del mensaje actual
  const { isMyMessage } = useMessageContext();

  return (
    <MessageSimple
      {...props}
      showUserName          // nombre visible en grupos
      showMessageStatus     // checks de enviado/entregado/visto
      enableSwipeToReply    // swipe para responder
      // estilito mínimo de burbuja sin meternos con el core
      style={{
        borderRadius: 16,
        backgroundColor: isMyMessage ? '#E8D1F8' : '#F7F3FB',
      }}
    />
  );
}
