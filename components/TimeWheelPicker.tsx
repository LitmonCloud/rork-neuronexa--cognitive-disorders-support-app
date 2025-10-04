import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { spacing, borderRadius } from '@/theme/spacing';
import { fontSizes, fontWeights } from '@/theme/typography';

interface TimeWheelPickerProps {
  value: string;
  onChange: (time: string) => void;
}

const ITEM_HEIGHT = 44;
const VISIBLE_ITEMS = 5;

export default function TimeWheelPicker({ value, onChange }: TimeWheelPickerProps) {
  const { colors } = useTheme();
  const [selectedHour, setSelectedHour] = useState(12);
  const [selectedMinute, setSelectedMinute] = useState(0);
  const [selectedPeriod, setSelectedPeriod] = useState<'AM' | 'PM'>('AM');

  const hourScrollRef = useRef<ScrollView>(null);
  const minuteScrollRef = useRef<ScrollView>(null);
  const periodScrollRef = useRef<ScrollView>(null);

  const hours = Array.from({ length: 12 }, (_, i) => i + 1);
  const minutes = Array.from({ length: 60 }, (_, i) => i);
  const periods = ['AM', 'PM'];

  useEffect(() => {
    if (value) {
      const match = value.match(/(\d+):(\d+)\s*(AM|PM)/i);
      if (match) {
        const hour = parseInt(match[1], 10);
        const minute = parseInt(match[2], 10);
        const period = match[3].toUpperCase() as 'AM' | 'PM';
        
        setSelectedHour(hour);
        setSelectedMinute(minute);
        setSelectedPeriod(period);

        setTimeout(() => {
          hourScrollRef.current?.scrollTo({ y: (hour - 1) * ITEM_HEIGHT, animated: false });
          minuteScrollRef.current?.scrollTo({ y: minute * ITEM_HEIGHT, animated: false });
          periodScrollRef.current?.scrollTo({ y: (period === 'AM' ? 0 : 1) * ITEM_HEIGHT, animated: false });
        }, 100);
      }
    }
  }, [value]);

  useEffect(() => {
    const formattedTime = `${selectedHour}:${selectedMinute.toString().padStart(2, '0')} ${selectedPeriod}`;
    onChange(formattedTime);
  }, [selectedHour, selectedMinute, selectedPeriod, onChange]);

  const handleHourScroll = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const index = Math.round(offsetY / ITEM_HEIGHT);
    const hour = hours[index];
    if (hour !== undefined && hour !== selectedHour) {
      setSelectedHour(hour);
    }
  };

  const handleMinuteScroll = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const index = Math.round(offsetY / ITEM_HEIGHT);
    const minute = minutes[index];
    if (minute !== undefined && minute !== selectedMinute) {
      setSelectedMinute(minute);
    }
  };

  const handlePeriodScroll = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const index = Math.round(offsetY / ITEM_HEIGHT);
    const period = periods[index] as 'AM' | 'PM';
    if (period !== undefined && period !== selectedPeriod) {
      setSelectedPeriod(period);
    }
  };

  const handleHourMomentumEnd = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const index = Math.round(offsetY / ITEM_HEIGHT);
    hourScrollRef.current?.scrollTo({ y: index * ITEM_HEIGHT, animated: true });
  };

  const handleMinuteMomentumEnd = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const index = Math.round(offsetY / ITEM_HEIGHT);
    minuteScrollRef.current?.scrollTo({ y: index * ITEM_HEIGHT, animated: true });
  };

  const handlePeriodMomentumEnd = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const index = Math.round(offsetY / ITEM_HEIGHT);
    periodScrollRef.current?.scrollTo({ y: index * ITEM_HEIGHT, animated: true });
  };

  const styles = StyleSheet.create({
    container: {
      height: ITEM_HEIGHT * VISIBLE_ITEMS,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.background,
      borderRadius: borderRadius.lg,
      borderWidth: 1,
      borderColor: colors.border,
      overflow: 'hidden',
      position: 'relative' as const,
    },
    selectionOverlay: {
      position: 'absolute' as const,
      top: ITEM_HEIGHT * 2,
      left: 0,
      right: 0,
      height: ITEM_HEIGHT,
      backgroundColor: colors.primary + '15',
      borderTopWidth: 2,
      borderBottomWidth: 2,
      borderColor: colors.primary,
      pointerEvents: 'none' as const,
      zIndex: 1,
    },
    wheelContainer: {
      flex: 1,
      height: ITEM_HEIGHT * VISIBLE_ITEMS,
    },
    periodContainer: {
      width: 80,
      height: ITEM_HEIGHT * VISIBLE_ITEMS,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      paddingVertical: ITEM_HEIGHT * 2,
    },
    item: {
      height: ITEM_HEIGHT,
      justifyContent: 'center',
      alignItems: 'center',
    },
    itemText: {
      fontSize: fontSizes.xl,
      color: colors.textSecondary,
      fontWeight: fontWeights.medium,
    },
    separator: {
      width: 1,
      height: ITEM_HEIGHT * VISIBLE_ITEMS,
      backgroundColor: colors.border,
    },
    colonSeparator: {
      paddingHorizontal: spacing.xs,
      justifyContent: 'center',
      alignItems: 'center',
      height: ITEM_HEIGHT * VISIBLE_ITEMS,
    },
    colonText: {
      fontSize: fontSizes.xxl,
      color: colors.text,
      fontWeight: fontWeights.bold,
    },
  });

  const renderWheel = (
    items: (number | string)[],
    scrollRef: React.RefObject<ScrollView | null>,
    onScroll: (event: any) => void,
    onMomentumEnd: (event: any) => void,
    formatItem?: (item: number | string) => string
  ) => (
    <ScrollView
      ref={scrollRef}
      style={styles.scrollView}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      snapToInterval={ITEM_HEIGHT}
      decelerationRate="fast"
      onScroll={onScroll}
      onMomentumScrollEnd={onMomentumEnd}
      scrollEventThrottle={16}
    >
      {items.map((item, index) => (
        <View key={index} style={styles.item}>
          <Text style={styles.itemText}>
            {formatItem ? formatItem(item) : item}
          </Text>
        </View>
      ))}
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      <View style={styles.selectionOverlay}></View>
      
      <View style={styles.wheelContainer}>
        {renderWheel(
          hours,
          hourScrollRef,
          handleHourScroll,
          handleHourMomentumEnd,
          (item) => item.toString().padStart(2, '0')
        )}
      </View>

      <View style={styles.colonSeparator}>
        <Text style={styles.colonText}>:</Text>
      </View>

      <View style={styles.wheelContainer}>
        {renderWheel(
          minutes,
          minuteScrollRef,
          handleMinuteScroll,
          handleMinuteMomentumEnd,
          (item) => item.toString().padStart(2, '0')
        )}
      </View>

      <View style={styles.separator}></View>

      <View style={styles.periodContainer}>
        {renderWheel(
          periods,
          periodScrollRef,
          handlePeriodScroll,
          handlePeriodMomentumEnd
        )}
      </View>
    </View>
  );
}
