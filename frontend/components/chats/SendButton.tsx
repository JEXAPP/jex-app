import React from 'react';
import { Pressable, Text } from 'react-native';
import { useMessageInputContext } from 'stream-chat-expo';

export function SendButton() {
  const { sendMessage } = useMessageInputContext(); 
  return (
    <Pressable
      onPress={sendMessage}
      style={{
        backgroundColor: '#511F73',
        borderRadius: 12,
        paddingHorizontal: 14,
        justifyContent: 'center',
        minHeight: 42,
      }}
    >
      <Text style={{ color: '#fff', fontWeight: '600' }}>Enviar</Text>
    </Pressable>
  );
}
