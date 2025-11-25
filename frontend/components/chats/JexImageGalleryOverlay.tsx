// components/chats/JexImageGalleryOverlay.tsx
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ImageGallery } from 'stream-chat-expo';

export const JexImageGalleryOverlay = (props: any) => {
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: 'black' }}
      edges={['top', 'bottom', 'left', 'right']}
    >
      <ImageGallery {...props} />
    </SafeAreaView>
  );
};
