import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { router } from 'expo-router';

export default function EnterCodeBar() {
  const [code, setCode] = useState('');
  const valid = code.trim().length >= 4;

  return (
    <View
      testID="enter-code-inline"
      style={styles.container}
    >
      <View style={styles.card}>
        <Text style={styles.title}>Enter Care Code</Text>
        <View style={styles.inputRow}>
          <TextInput
            testID="enter-code-input"
            value={code}
            onChangeText={(t) => setCode(t.toUpperCase())}
            placeholder="e.g. NX4F-72KQ"
            placeholderTextColor="#6e7080"
            autoCapitalize="characters"
            style={styles.input}
          />
          <Pressable
            testID="enter-code-redeem"
            onPress={() => {
              console.log('[EnterCodeBar] Redeeming code:', code.trim());
              router.push({ pathname: '/invite-redeem', params: { code: code.trim() } });
            }}
            disabled={!valid}
            style={({ pressed }) => ([
              styles.button,
              {
                backgroundColor: valid ? (pressed ? '#2a6f65' : '#2f6c63') : '#3a3b44',
                borderColor: valid ? '#234a44' : '#2a2b31',
              }
            ])}
          >
            <Text style={[styles.buttonText, { color: valid ? '#e9fff9' : '#9aa0aa' }]}>Redeem</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 0,
    paddingVertical: 0,
    backgroundColor: 'transparent',
    marginBottom: 16,
  },
  card: {
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#7b61ff',
    backgroundColor: '#1a1b24',
    padding: 16,
    gap: 12,
    shadowColor: '#7b61ff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  title: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 16,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: '#15161b',
    borderWidth: 1,
    borderColor: '#2a2b31',
    color: '#fff',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  buttonText: {
    fontWeight: '800',
    fontSize: 14,
  },
});
