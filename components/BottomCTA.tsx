import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface BottomCTAProps {
  title: string;
  onPress: () => void;
  tone?: 'primary' | 'danger';
}

export const BottomCTA: React.FC<BottomCTAProps> = ({ title, onPress, tone = 'primary' }) => {
  const inset = useSafeAreaInsets();
  const bg = tone === 'primary' ? '#FFB020' : '#E34D4D';
  return (
    <View style={[styles.container, { paddingBottom: inset.bottom + 12 }]}>
      <Pressable onPress={onPress} style={[styles.button, { backgroundColor: bg }]}>
        <Text style={styles.text}>{title}</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(10,10,14,0.6)',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255,255,255,0.08)',
  },
  button: {
    height: 56,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
  },
  text: { fontSize: 17, fontWeight: '700', color: '#0B0B0E' },
});
