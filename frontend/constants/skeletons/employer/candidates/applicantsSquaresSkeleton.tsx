import React from 'react';
import { View } from 'react-native';
import { MotiView } from 'moti';
import { Borders } from '@/themes/borders';

const SkeletonBox = ({ w, h, br = 8, mt = 0 }: { w: number; h: number; br?: number; mt?: number }) => (
  <MotiView
    style={{ width: w, height: h, borderRadius: br, marginTop: mt, backgroundColor: '#E1E9EE' }}
    from={{ opacity: 0.4 }}
    animate={{ opacity: 1 }}
    transition={{ type: 'timing', duration: 800, loop: true }}
  />
);

export function ApplicantsSquaresSkeleton() {
  return (
    <View style={{ width: 350, marginTop: 16 }}>
            
      {[0,1,2].map(row => (
        
        <View key={row} style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 20, gap: 20  }}>
          
          {[0,1].map(col => (
            
            <View key={col} >
              
              <SkeletonBox w={160} h={150} br={16} />
              
            </View>
          
          ))}
        
        </View>
      
      ))}
  
    </View>
  );
}
