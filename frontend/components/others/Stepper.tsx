import React from 'react';
import { View, Text } from 'react-native';
import { stepperStyles1 as s } from '@/styles/components/others/stepperStyles1';
import { iconos } from '@/constants/iconos';
import { Colors } from '@/themes/colors';

type Props = {
  activeIndex: number;       
  totalSteps: number;       
  containerStyle?: object;
};

export const Stepper: React.FC<Props> = ({
  activeIndex,
  totalSteps,
  containerStyle,
}) => {
  return (
    <View style={[s.container, containerStyle]}>
      <View style={s.trackContainer}>
        {Array.from({ length: totalSteps }).map((_, idx) => {
          const isPast = idx < activeIndex;
          const isCurrent = idx === activeIndex;

          const circleStyle = [
            s.circleBase,
            isCurrent ? s.circleCurrent : isPast ? s.circlePast : s.circleFuture,
          ];
          const numberStyle = [
            s.numberBase,
            isCurrent ? s.numberCurrent : isPast ? s.numberPast : s.numberFuture,
          ];

          return (
            <React.Fragment key={idx}>
              <View
                style={circleStyle}
                accessibilityLabel={`Paso ${idx + 1} de ${totalSteps}`}
                accessibilityState={{ selected: isCurrent }}
              >
                {isPast ? (
                  iconos.exitoSinCirculo(16, Colors.white)
                ) : (
                  <Text style={numberStyle}>{idx + 1}</Text>
                )}
              </View>

              {idx < totalSteps - 1 && (
                <View
                  style={[
                    s.connectorBase,
                    isPast ? s.connectorPast : s.connectorFuture,
                  ]}
                />
              )}
            </React.Fragment>
          );
        })}
      </View>
    </View>
  );
};
