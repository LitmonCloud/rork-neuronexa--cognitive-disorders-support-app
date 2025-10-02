import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Dimensions } from 'react-native';
import { X } from 'lucide-react-native';
import { TooltipConfig } from '@/types/funnel';
import { useTheme } from '@/contexts/ThemeContext';

type FeatureTooltipProps = {
  tooltip: TooltipConfig;
  onDismiss: () => void;
  position?: { x: number; y: number };
};

export function FeatureTooltip({ tooltip, onDismiss, position }: FeatureTooltipProps) {
  const { colors } = useTheme();
  const { width, height } = Dimensions.get('window');
  
  const tooltipX = position?.x ?? width / 2 - 150;
  const tooltipY = position?.y ?? height / 2 - 100;

  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <Modal transparent visible animationType="fade">
      <TouchableOpacity 
        style={styles.overlay} 
        activeOpacity={1} 
        onPress={onDismiss}
      >
        <View 
          style={[
            styles.tooltip, 
            { 
              left: Math.max(16, Math.min(tooltipX, width - 316)),
              top: Math.max(100, Math.min(tooltipY, height - 250))
            }
          ]}
        >
          <View style={styles.header}>
            <Text style={styles.title}>{tooltip.title}</Text>
            <TouchableOpacity onPress={onDismiss} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <X size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.description}>{tooltip.description}</Text>
          
          <TouchableOpacity style={styles.button} onPress={onDismiss}>
            <Text style={styles.buttonText}>Got it!</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const createStyles = (colors: ReturnType<typeof useTheme>['colors']) => StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  tooltip: {
    position: 'absolute' as const,
    width: 300,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: colors.text,
    flex: 1,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.surface,
  },
});
