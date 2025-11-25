// components/chats/ChatListItem.tsx
import React from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
  ImageSourcePropType,
} from 'react-native';
import { Colors } from '@/themes/colors';

type Props = {
  title: string;
  subtitle?: string | null;
  leftImageSource?: ImageSourcePropType;
  onPress: () => void;
  hasUnread?: boolean;
  unreadCount?: number;
};

const ChatListItem: React.FC<Props> = ({
  title,
  subtitle,
  leftImageSource,
  onPress,
  hasUnread = false,
  unreadCount = 0,
}) => {
  const showBadge = hasUnread && unreadCount > 0;

  return (
    <Pressable onPress={onPress} style={[styles.container,
            hasUnread && { backgroundColor: Colors.violet1 },]}>
      {leftImageSource && (
        <View style={styles.avatarWrapper}>
          <Image source={leftImageSource} style={styles.avatar} />
        </View>
      )}

      <View style={styles.textWrapper}>
        <Text
          style={[
            styles.title,
            hasUnread && { color: Colors.violet3 },
          ]}
          numberOfLines={1}
        >
          {title}
        </Text>
        {subtitle ? (
          <Text style={styles.subtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>

      {showBadge && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {unreadCount > 99 ? '99+' : unreadCount}
          </Text>
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    marginBottom: 10,
  },
  avatarWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: 'hidden',
    marginRight: 10,
  },
  avatar: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  textWrapper: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontFamily: 'interBold',
    color: Colors.black || '#222222',
  },
  subtitle: {
    marginTop: 2,
    fontFamily:'interLightItalic',
    fontSize: 15,
    color: '#666666',
  },
  badge: {
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Colors.violet3,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
    marginLeft: 8,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'interBold'
  },
});

export default ChatListItem;
