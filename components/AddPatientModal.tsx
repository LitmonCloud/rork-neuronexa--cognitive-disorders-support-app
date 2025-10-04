import React, { useState } from 'react';
import {
  Modal, View, Text, Pressable, TextInput, KeyboardAvoidingView, Platform, ScrollView, SafeAreaView,
} from 'react-native';
import { router } from 'expo-router';

type Method = 'code' | 'manual';

export default function AddPatientModal({
  visible, onClose, defaultMethod = 'code',
}: { visible: boolean; onClose: () => void; defaultMethod?: Method }) {
  const [method, setMethod] = useState<Method>(defaultMethod);
  const [code, setCode] = useState('');
  const [first, setFirst] = useState('');
  const [last, setLast] = useState('');

  const redeem = () => {
    const c = code.trim();
    if (!c) return;
    console.log('[AddPatientModal] Redeeming code:', c);
    onClose();
    router.push({ pathname: '/invite-redeem', params: { code: c } });
  };

  const addManual = () => {
    if (!first.trim() || !last.trim()) return;
    console.log('[AddPatientModal] Manual add:', first.trim(), last.trim());
    // TODO: Wire to PatientContext.addPatient
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: '#00000080', justifyContent: 'center', padding: 16 }}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ width: '100%' }}>
          <SafeAreaView
            style={{
              alignSelf: 'center',
              width: '100%',
              maxWidth: 720,
              maxHeight: '85%',
              borderRadius: 16,
              backgroundColor: '#0f1014',
              borderWidth: 1,
              borderColor: '#24252c',
              overflow: 'hidden',
            }}
          >
            <View style={{ padding: 16, borderBottomWidth: 1, borderBottomColor: '#23242a' }}>
              <Text style={{ color: '#fff', fontSize: 18, fontWeight: '800' }}>Add Patient</Text>
            </View>

            <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }} keyboardShouldPersistTaps="handled">
              <View
                style={{
                  flexDirection: 'row', backgroundColor: '#1b1c20', borderRadius: 12, padding: 4,
                  borderWidth: 1, borderColor: '#2a2b31',
                }}
                accessibilityRole="tablist"
              >
                {(['code', 'manual'] as Method[]).map((tab) => {
                  const active = method === tab;
                  return (
                    <Pressable
                      key={tab}
                      onPress={() => setMethod(tab)}
                      accessibilityRole="tab"
                      accessibilityState={{ selected: active }}
                      style={{
                        flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 8,
                        backgroundColor: active ? '#7b61ff' : 'transparent',
                      }}
                    >
                      <Text style={{ color: active ? '#0b0b0d' : '#d7d7de', fontWeight: '700' }}>
                        {tab === 'code' ? 'Use Code' : 'Manual Entry'}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>

              {method === 'code' && (
                <View style={{ gap: 8 }}>
                  <Text style={{ color: '#b7b8c2' }}>Care Code</Text>
                  <TextInput
                    testID="modal-code-input"
                    value={code}
                    onChangeText={(t) => setCode(t.toUpperCase())}
                    placeholder="e.g. NX4F-72KQ"
                    placeholderTextColor="#6e7080"
                    autoCapitalize="characters"
                    style={{
                      backgroundColor: '#15161b', borderWidth: 1, borderColor: '#2a2b31',
                      color: '#fff', borderRadius: 12, padding: 12,
                    }}
                  />
                  <Pressable
                    testID="modal-redeem"
                    onPress={redeem}
                    disabled={!code.trim()}
                    style={({ pressed }) => ({
                      backgroundColor: !code.trim() ? '#3a3b44' : '#2f6c63',
                      borderRadius: 12, padding: 14, alignItems: 'center', opacity: pressed ? 0.9 : 1,
                    })}
                  >
                    <Text style={{ color: '#e9fff9', fontWeight: '800' }}>Redeem Code</Text>
                  </Pressable>
                </View>
              )}

              {method === 'manual' && (
                <View style={{ gap: 8 }}>
                  <Text style={{ color: '#b7b8c2' }}>Patient Name</Text>
                  <View style={{ flexDirection: 'row', gap: 8 }}>
                    <TextInput
                      value={first}
                      onChangeText={setFirst}
                      placeholder="First name"
                      placeholderTextColor="#6e7080"
                      style={{
                        flex: 1, backgroundColor: '#15161b', borderWidth: 1, borderColor: '#2a2b31',
                        color: '#fff', borderRadius: 12, padding: 12,
                      }}
                    />
                    <TextInput
                      value={last}
                      onChangeText={setLast}
                      placeholder="Last name"
                      placeholderTextColor="#6e7080"
                      style={{
                        flex: 1, backgroundColor: '#15161b', borderWidth: 1, borderColor: '#2a2b31',
                        color: '#fff', borderRadius: 12, padding: 12,
                      }}
                    />
                  </View>
                  <Pressable
                    onPress={addManual}
                    disabled={!first.trim() || !last.trim()}
                    style={({ pressed }) => ({
                      backgroundColor: !first.trim() || !last.trim() ? '#3a3b44' : '#7b61ff',
                      borderRadius: 12, padding: 14, alignItems: 'center', opacity: pressed ? 0.9 : 1,
                    })}
                  >
                    <Text style={{ color: '#0b0b0d', fontWeight: '800' }}>Add Patient</Text>
                  </Pressable>
                </View>
              )}
            </ScrollView>

            <View style={{ padding: 12, borderTopWidth: 1, borderTopColor: '#23242a', alignItems: 'flex-end' }}>
              <Pressable
                onPress={onClose}
                style={({ pressed }) => ({
                  paddingVertical: 10, paddingHorizontal: 14, borderRadius: 10,
                  backgroundColor: pressed ? '#1a1b21' : '#14161b', borderWidth: 1, borderColor: '#2a2b31',
                })}
              >
                <Text style={{ color: '#cfd0d9' }}>Close</Text>
              </Pressable>
            </View>
          </SafeAreaView>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}
