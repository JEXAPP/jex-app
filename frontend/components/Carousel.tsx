import React, { useState } from 'react';
import { View, Image } from 'react-native';
import CarouselLib from 'react-native-reanimated-carousel';
import { carouselStyles1 } from '@/styles/components/carouselStyles1';

interface CarouselProps {
  images: (string | number)[];
}

export const Carousel = ({ images }: CarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <View style={carouselStyles1.container}>
      <CarouselLib
        width={220}
        height={180}
        data={images}
        autoPlay
        autoPlayInterval={4000}
        scrollAnimationDuration={1500}
        mode="horizontal-stack"
        modeConfig={{
          snapDirection: 'left',
          stackInterval: 0,
        }}
        pagingEnabled
        onProgressChange={(_, absoluteProgress) => {
          const rawIndex = Math.floor(absoluteProgress + 0.1);
          const index = ((rawIndex % images.length) + images.length) % images.length; // wrap seguro
          if (index !== currentIndex) {
            setCurrentIndex(index);
          }
        }}

        renderItem={({ item }) => (
          <Image
            source={typeof item === 'string' ? { uri: item } : item}
            style={carouselStyles1.image}
            resizeMode="cover"
          />
        )}
      />

      <View style={carouselStyles1.dotsContainer}>
        {images.map((_, index) => (
          <View
            key={index}
            style={[
              carouselStyles1.dot,
              currentIndex === index && carouselStyles1.activeDot,
            ]}
          />
        ))}
      </View>
    </View>
  );
};
