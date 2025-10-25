// styles/components/chat/jexThemeStyles.ts
import type { Theme } from 'stream-chat-expo';

export const JEX_THEME: Partial<Theme> = {
  colors: {
    primary: '#511F73',      // acciones
    accent_blue: '#4BA3FF',  // azul claro para “visto”
    bg: '#FFFFFF',
    text: '#1F1F1F',
    grey: '#8A8A8A',
    overlay: 'rgba(0,0,0,0.35)',
    link: '#511F73',
    white: '#FFFFFF',
    black: '#000000',
    error: '#D92D20',
    success: '#12B76A',
  },
  messageSimple: {
    myMessageTheme: {
      content: {
        container: {
          backgroundColor: '#E8D1F8',     // burbuja propia (violeta clarito)
          borderWidth: 1,
          borderColor: '#DEC3F0',
          borderRadius: 16,
        },
      },
    },
    otherMessageTheme: {
      content: {
        container: {
          backgroundColor: '#F7F3FB',     // ajenas (lavanda suave)
          borderWidth: 1,
          borderColor: '#E3D6EE',
          borderRadius: 16,
        },
      },
    },
    reactionList: {
      container: { backgroundColor: '#E8D1F8', borderRadius: 12 },
      bubble: { backgroundColor: '#511F73' }, // chips violetas
    },
  },
};
