import React from 'react';
import {Keyboard,ScrollView,Text,TouchableOpacity,TouchableWithoutFeedback,View,Image} from 'react-native';
import { attendanceStyles as styles } from '@/styles/app/employer/panel/attendance/attendanceStyles';
import { useAttendance } from '@/hooks/employer/panel/attendance/useAttendance';
import { ScannerModal } from '@/components/window/ScannerWindow';
import { ConfirmationModal } from '@/components/window/ConfirmationWindow';
import { SelectableTag } from '@/components/button/SelectableTags';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/themes/colors';
import { selectableTagStyles2 } from '@/styles/components/button/selectableTagsStyles/selectableTagsStyles2';
import AttendanceSkeleton from '@/constants/skeletons/employer/attendanceSkeleton';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AttendanceScreen() {
  const {
    isScannerOpen,
    startScan,
    stopScan,
    handleScannedValue,
    confirmVisible,
    confirmAttendance,
    cancelConfirm,
    scanState,
    loadingEmployees,
    jobTypes,
    selectedJobType,
    setSelectedJobType,
    currentList,
  } = useAttendance();

  const occ: Record<string, number> = {};

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View >
          <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
            <View style={styles.header}>
              <Text style={styles.title}>Asistencia</Text>
            </View>

            <TouchableOpacity style={styles.card} onPress={startScan}>
              <View>
                <Image
                  source={require('@/assets/images/jex/Jex-Escanear.png')}
                  style={styles.jex}
                />
              </View>
              <View style={styles.qrRight}>
                <Text style={styles.text}>Escaneá</Text>
              </View>
            </TouchableOpacity>

            {loadingEmployees ? (
              <AttendanceSkeleton />
            ) : (
              <>
                {jobTypes.length ? (
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.tagsContent}
                  >
                    {jobTypes.map((jt) => (
                      <View key={jt} style={styles.tagItem}>
                        <SelectableTag
                          title={jt}
                          selected={selectedJobType === jt}
                          onPress={() => setSelectedJobType(jt)}
                          styles={selectableTagStyles2}
                        />
                      </View>
                    ))}
                  </ScrollView>
                ) : null}

                <View style={styles.cardList}>
                  {selectedJobType && currentList.length ? (
                    currentList.map((emp, idx) => {
                      const base = `${emp.employee_id}-${emp.job_type}`;
                      occ[base] = (occ[base] ?? 0) + 1;
                      const rowKey = `${base}#${occ[base]}`;

                      return (
                        <View key={rowKey}>
                          <View style={styles.row}>
                            <Text style={styles.name}>{emp.employee_name}</Text>
                            <Ionicons
                              name={emp.has_attendance ? 'checkmark' : 'remove'}
                              size={20}
                              color={emp.has_attendance ? Colors.violet2 : Colors.gray3}
                            />
                          </View>
                          {idx < currentList.length - 1 ? <View style={styles.separator} /> : null}
                        </View>
                      );
                    })
                  ) : (
                    <Text style={styles.emptyText}>
                      {selectedJobType ? `Sin personas en ${selectedJobType}.` : (
                        <>
                        <View style={styles.emptyRow}>
                        <Text style={styles.emptyTitle}>No hay datos</Text>
                        <Image source={require('@/assets/images/jex/Jex-Lista-Vacia.png')} style={styles.image2}/>
                        </View>
                        </>
                      )}
                    </Text>
                  )}
                </View>
              </>
            )}
          </ScrollView>

          <ScannerModal visible={isScannerOpen} onClose={stopScan} onScanned={handleScannedValue} />

          <ConfirmationModal
            visible={confirmVisible}
            onConfirm={confirmAttendance}
            onCancel={cancelConfirm}
            confirming={scanState.kind === 'posting'}
          />

          {scanState.kind === 'error' && scanState.msg ? (
            <View style={styles.error}>
              <Text style={styles.text}>{scanState.msg}</Text>
            </View>
          ) : null}
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}
