import React from 'react';
import { View } from 'react-native';
import { MotiView } from 'moti';
import { Borders } from '@/themes/borders';


const SkeletonBox = ({w,h,br = 8,mt = 0,ml = 0,mr = 0,}: {w: number;h: number;br?: number;mt?: number;ml?: number;mr?: number;}) => (
    <MotiView
      style={{
      width: w,
      height: h,
      borderRadius: br,
      marginTop: mt,
      marginLeft: ml,
      marginRight: mr,
      backgroundColor: '#E1E9EE',
      }}
      from={{ opacity: 0.4 }}
      animate={{ opacity: 1 }}
      transition={{ type: 'timing', duration: 800, loop: true }}
    />
    );


  export default function ChooseCandidatesSkeleton() {
  return (
    
    <View style={{ alignItems: 'center' }}>
      
      {/* 🔹 Header de evento con flechas */}
      <View style={{ flexDirection: 'row', alignItems: 'center', width: 350, marginTop: 20, marginBottom: 20 }}>
        

        <View style={{ flex: 1, alignItems: 'center' }}>
          
          <SkeletonBox w={350} h={40} br={Borders.soft} mt={10} />
        
        </View>
        
      
      </View>

      {/* 🔹 Picker de vacante */}
      <SkeletonBox w={350} h={48} br={12} mt={10} />
      
      {/* 🔹 Info superior: horario + ofertas (no hacer turnos/tags) */}
      <View style={{ width: 350, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 }}>
      
        {/* scheduleCard */}
        <View style={{ flex: 1, marginRight: 12 }}>
          
          <SkeletonBox w={190} h={70} br={16} />
        
        </View>

        {/* offersCard */}
        <SkeletonBox w={140} h={70} br={16} />
      
      </View>

      {/* 🔹 Grid de postulaciones (3 filas x 2 columnas) */}
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

    </View>
  )}