import { View, Text, ScrollView, Image, Pressable, SafeAreaView } from 'react-native';
import { useApplyJob } from '@/hooks/apply-job/useApplyJob';
import { applyJobStyles as styles } from '@/styles/app/apply-job/applyJobStyles';
import { Ionicons } from '@expo/vector-icons';

export default function ApplyJobScreen() {
  const {
    job,
    organizer,
    handleApply,
  } = useApplyJob();
  
  const stars = Math.round(job.rating)
  
  return (
          
    <SafeAreaView style={styles.container}>
    
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
    
            <View style={styles.header}>

                <View style={styles.headerTop}>

                    <Image
                    source={require('@/assets/images/jex/Jex-FotoPerfil.png')}
                    style={styles.logoWrapper}
                    />

                    <View style={styles.headerText}>

                        <Text style={styles.eventTitle}>{job.title}</Text>

                        <View style={styles.ratingWrapper}>

                            {Array.from({ length: stars }).map((_, index) => (
                            <Ionicons
                                key={index}
                                name="star"
                                size={16}
                                style={styles.starsIcon}
                            />
                            ))}
                                
                        </View>

                    </View>

                </View>

                <Image source={{ uri: job.mapImage }} style={styles.map} />
            
            </View>

            <View style={styles.section}>
                <Text style={styles.containerTitle}>{job.role}</Text>
                <Text style={styles.containerText}>{job.description}</Text>
                
                <View style={styles.row}>

                    <Ionicons
                        name="calendar-clear"
                        size={20}
                        style={styles.icon}
                    />
                    <Text style={styles.containerText}>{job.date}</Text>

                </View>

                <View style={styles.row}>
                    <Ionicons
                        name="time"
                        size={20}
                        style={styles.icon}
                    />
                    <Text style={styles.containerText}>{job.time}</Text>
                </View>
                
            </View>

            <View style={styles.separator} />

            <View style={styles.section}>

                <Text style={styles.containerSubtitle}>¿Qué necesitas?</Text>
                <Text style={styles.containerText}>{job.requirements}</Text>

            </View>

            <View style={styles.separator} />

            <View style={styles.section}>

                <Text style={styles.containerSubtitle}>Conocé al organizador</Text>
                <View style={styles.textArea}></View>
                
            </View>


          
        </ScrollView>

        <View style={styles.applyBox}>
        <View>
          <Text style={styles.salary}>${job.salary}</Text>
          <Text style={styles.deadline}>Vence el {job.deadline}</Text>
        </View>
        <Pressable onPress={handleApply} style={styles.applyButton}>
          <Text style={styles.applyText}>Postularme</Text>
        </Pressable>
      </View>
            
    </SafeAreaView>
)}
