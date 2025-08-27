import { View } from 'moti';
import React from 'react';
import { Keyboard, TouchableWithoutFeedback } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PruebaScreen() {

  return (

    <SafeAreaView edges={['top', 'left', 'right']}>

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>

        <View>


    </View>
      
      </TouchableWithoutFeedback>

    </SafeAreaView>
  
  );
  
}
