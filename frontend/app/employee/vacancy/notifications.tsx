import React from 'react';
import { ActivityIndicator, FlatList, Text, View, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/themes/colors';
import ImageOnline from '@/components/others/ImageOnline';
import { notificationsStyles as s } from '@/styles/app/notificationsStyles';
import { useNotifications, NotificationDTO } from '@/hooks/useNotifications';
import { buttonStyles5 } from '@/styles/components/button/buttonStyles/buttonStyles5';
import { Button } from '@/components/button/Button';

type NotifItemProps = { item: NotificationDTO; rightText: string; onPress: (n: NotificationDTO) => void };

const NotifItem = React.memo(function NotifItem({ item, rightText, onPress }: NotifItemProps) {
  return (
    <View style={s.card}>
      <View style={s.iconWrap}>
        {item.image_url ? (
          <ImageOnline imageUrl={item.image_url} size={20} style={{ width: 36, height: 36 }} />
        ) : (
          <Ionicons name="notifications-outline" size={22} color={Colors.violet4} />
        )}
      </View>

      <View style={s.textWrap}>
        <View style={s.titleRow}>
          <Text style={s.notifTitle} numberOfLines={1} onPress={() => onPress(item)}>{item.title}</Text>
          <Text style={s.time}>{rightText}</Text>
          {!item.read && <View style={s.unreadDot} />}
        </View>
        <Text style={s.message} numberOfLines={2} onPress={() => onPress(item)}>{item.message}</Text>
      </View>
    </View>
  );
});

export default function NotificationsScreen() {
  const {
    items, isFetching, handleLoadMore, markAllRead, handlePress, formatDate, unreadCount, fetchNotifications
  } = useNotifications();

  const renderItem = ({ item }: { item: NotificationDTO }) => {
    const dateStr = formatDate(item.created_at);
    return <NotifItem item={item} rightText={dateStr} onPress={handlePress} />;
  };

  return (
    <SafeAreaView style={s.container} edges={['top']}>
      <View>
        <Text style={s.title}>Notificaciones</Text>
        <Button
          texto={`Marcar todas como leídas${unreadCount ? ` (${unreadCount})` : ''}`}
          onPress={markAllRead}
          styles={buttonStyles5}
        />
      </View>

      {isFetching && items.length === 0 ? (
        <ActivityIndicator style={{ marginTop: 40 }} color={Colors.violet4} />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(n) => String(n.id)}               // estable (dedupe evita repetidos)
          renderItem={renderItem}
          contentContainerStyle={s.list}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListEmptyComponent={
            <View style={s.noNotificationsCard}>
              <Image
                source={require('@/assets/images/jex/Jex-Sin-Notificaciones.png')}
                style={s.noNotificationsImage}
                resizeMode="contain"
              />
              <Text style={s.noNotificationsTitle}>No tenés notificaciones</Text>
              <Text style={s.noNotificationsSubtitle}>Cuando llegue algo nuevo, lo vas a ver acá.</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}
