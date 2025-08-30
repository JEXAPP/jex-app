// app/employee/offers/index.tsx (o el archivo de tu screen)
import { iconos } from '@/constants/iconos';
import { useHomeOffers } from '@/hooks/employee/offers/useHomeOffers';
import { homeOffersStyles as styles } from '@/styles/app/employee/offers/homeOffersStyles';
import { Colors } from '@/themes/colors';
import React from 'react';
import { Image, Keyboard, ScrollView, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { OrderButton } from '@/components/button/OrderButton';
import HomeOfferSkeleton from '@/constants/skeletons/employee/offers/homeOfferSkeleton';

export default function HomeOffersScreen() {
  const { offers, handleOrderSelect, goToOfferDetail, loadingOffers } = useHomeOffers();

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={{ flex: 1 }}>
          <View style={styles.headerRow}>
            <Text style={styles.title}>Ofertas</Text>
            {offers.length > 0 && (
              <OrderButton
                options={[
                  'Rol (A-Z)',
                  'Rol (Z-A)',
                  'Vencimiento (ASC)',
                  'Vencimiento (DESC)',
                  'Pago (ASC)',
                  'Pago (DESC)',
                ]}
                onSelect={handleOrderSelect}
                defaultOption="Vencimiento (ASC)"
                defaultIndex={2}
                dropdownVisibleCount={6}
                dropdownPlacement="below"
                dropdownWidth={220} // un poco más angosto
              />
            )}
          </View>

          {loadingOffers ? (
            <HomeOfferSkeleton />
          ) : (
            <ScrollView
              contentContainerStyle={[styles.scroll, { flexGrow: 1 }]}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              {offers.length === 0 ? (
                <View style={styles.noOffersCard}>
                  <Text style={styles.noOffersTitle}>Aún no tienes ofertas</Text>
                  <Image
                    source={require('@/assets/images/jex/Jex-Olvidadizo.png')}
                    style={styles.noOffersImage}
                    resizeMode="contain"
                  />
                  <Text style={styles.noOffersSubtitle}>
                    Vuelve más tarde para ver nuevas oportunidades
                  </Text>
                </View>
              ) : (
                offers.map((offer) => (
                  <TouchableOpacity
                    key={offer.id ?? Math.random()} // evita duplicados si faltara id
                    style={styles.offerCard}
                    activeOpacity={0.8}
                    onPress={() => goToOfferDetail(offer)}
                  >
                    <View style={styles.offerHeader}>
                      <Image
                        source={
                          offer.eventImage ??
                          require('@/assets/images/jex/Jex-Evento-Default.png')
                        }
                        style={styles.offerImage}
                      />
                      <View style={styles.offerInfo}>
                        
                        <Text style={styles.role}>{offer.role}</Text>
                        <Text style={styles.company}>{offer.company}</Text>
                        
                      </View>
                    </View>

                    <Text style={styles.salary}>{offer.salary} ARS</Text>
                    <Text style={styles.date}>
                      {offer.date} {offer.startTime}hs - {offer.endTime}hs
                    </Text>

                    <View style={styles.expirationContainer}>
                      {iconos.reloj(16, Colors.gray3)}
                      <Text style={styles.expirationText}>
                        La oferta vence el {offer.expirationDate} a las {offer.expirationTime}hs
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))
              )}
            </ScrollView>
          )}
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
}
