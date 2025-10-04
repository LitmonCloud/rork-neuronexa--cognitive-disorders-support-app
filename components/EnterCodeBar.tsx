import React, { useState } from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';

export default function EnterCodeBar() {
  const [code, setCode] = useState('');
  const insets = useSafeAreaInsets();
  const valid = code.trim().length >= 4;

  return (
    <View
      testID="enter-code-inline"
      style={{
        paddingTop: insets.top + 8,
        paddingHorizontal: 16,
        paddingBottom: 8,
        backgroundColor: '#0b0b0d',
      }}
    >
      <View
        style={{
          borderRadius: 14,
          borderWidth: 1,
          borderColor: '#2a2b31',
          backgroundColor: '#121318',
          padding: 12,
          gap: 10,
        }}
      >
        <Text style={{ color: '#cfd0d9', fontWeight: '700' }}>Enter Care Code</Text>
        <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
          <TextInput
            testID="enter-code-input"
            value={code}
            onChangeText={(t) => setCode(t.toUpperCase())}
            placeholder="e.g. NX4F-72KQ"
            placeholderTextColor="#6e7080"
            autoCapitalize="characters"
            style={{
              flex: 1,
              backgroundColor: '#15161b',
              borderWidth: 1,
              borderColor: '#2a2b31',
              color: '#fff',
              borderRadius: 12,
              paddingHorizontal: 12,
              paddingVertical: 10,
            }}
          />
          <Pressable
            testID="enter-code-redeem"
            onPress={() => router.push({ pathname: '/invite-redeem', params: { code: code.trim() } })}
            disabled={!valid}
            style={({ pressed }) => ({
              paddingHorizontal: 16,
              paddingVertical: 12,
              borderRadius: 12,
              backgroundColor: valid ? (pressed ? '#2a6f65' : '#2f6c63') : '#3a3b44',
              borderWidth: 1,
              borderColor: valid ? '#234a44' : '#2a2b31',
            })}
          >
            <Text style={{ color: valid ? '#e9fff9' : '#9aa0aa', fontWeight: '800' }}>Redeem</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
