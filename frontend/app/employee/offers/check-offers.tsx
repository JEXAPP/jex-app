import React, { useState } from 'react';
import { View, Text, ScrollView, Image, TouchableWithoutFeedback, Keyboard, TouchableOpacity } from 'react-native';
import { activeOffersStyles as styles } from '@/styles/app/employee/offers/activeOffersStyles';
import { useActiveOffers } from '@/hooks/employee/offers/useActiveOffers';
import { Colors } from '@/themes/colors';
import { iconos } from '@/constants/iconos';

export default function ActiveOffersScreen() {
  const { offers, sortOffers } = useActiveOffers();
  const [isSortMenuVisible, setIsSortMenuVisible] = useState(false);

  const handleSort = (criteria: 'date' | 'salary' | 'name') => {
    sortOffers(criteria); 
  };

  return (

    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Ofertas</Text>

          {/* Contenedor de "Ordenar por" */}
            <View style={styles.sortContainer}>
            <TouchableOpacity
                onPress={() => setIsSortMenuVisible(prev => !prev)}
                style={{ flexDirection: 'row', alignItems: 'center' }}
            >
                {iconos.lista(20, Colors.gray3)} 
                <Text style={[styles.sortText, { marginLeft: 6 }]}>Ordenar por:</Text>
            </TouchableOpacity>

            {/* Menú de botones */}
            {isSortMenuVisible && (
                <View style={{ flexDirection: 'row', marginTop: 10 }}>
                <TouchableOpacity onPress={() => handleSort('name')} style={styles.sortButton}>
                <Text style={styles.sortButtonText}>Nombre</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleSort('salary')} style={styles.sortButton}>
                <Text style={styles.sortButtonText}>Salario</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleSort('date')} style={styles.sortButton}>
                    <Text style={styles.sortButtonText}>Fecha venc.</Text>
                </TouchableOpacity>
                </View>
            )}
            </View>
            

          {/* Lista de ofertas */}
            <ScrollView
            contentContainerStyle={[styles.scroll, { flexGrow: 1 }]}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            >
            {offers.length === 0 ? (
                // 📌 Cartel cuando no hay ofertas
                <View style={styles.noOffersCard}>
                <Text style={styles.noOffersTitle}>Aún no tienes ofertas activas</Text>
                <Image
                    source={require('@/assets/images/jex/Jex-Olvidadizo.png')} // cambia por una imagen adecuada
                    style={styles.noOffersImage}
                    resizeMode="contain"
                />
                <Text style={styles.noOffersSubtitle}>
                    Vuelve más tarde para ver nuevas oportunidades
                </Text>
                </View>
            ) : (
                offers.map((offer, index) => (
                <View key={index} style={styles.offerCard}>
                    <View style={styles.offerHeader}>
                    <Image source={offer.eventImage} style={styles.offerImage} />
                    <View style={styles.offerInfo}>
                        <Text style={styles.company}>{offer.company}</Text>
                        <Text style={styles.role}>{offer.role}</Text>
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
                </View>
                ))
            )}
            </ScrollView>

        </View>
      </TouchableWithoutFeedback>
    </View>
  );
}
