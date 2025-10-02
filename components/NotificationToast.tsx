import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity, Platform } from 'react-native';
import { Bell, CheckCircle, AlertCircle, Info, X } from 'lucide-react-native';
import { AppNotification } from '@/types/notification';
import { BlurView } from 'expo-blur';

interface NotificationToastProps {
  notification: AppNotification;
  onDismiss: () => void;
  onPress?: () => void;
  duration?: number;
}

export function NotificationToast({ 
  notification, 
  onDismiss, 
  onPress,
  duration = 4000 
}: NotificationToastProps) {
  const translateY = useRef(new Animated.Value(-100)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  const handleDismiss = useRef(() => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onDismiss();
    });
  });

  useEffect(() => {
    Animated.parallel([
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        tension: 50,
        friction: 8,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      handleDismiss.current();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, translateY, opacity]);

  const getIcon = () => {
    const iconProps = { size: 20, color: '#FFFFFF' };
    
    switch (notification.priority) {
      case 'urgent':
      case 'high':
        return <AlertCircle {...iconProps} />;
      case 'medium':
        return <Bell {...iconProps} />;
      case 'low':
        return notification.type.includes('completed') 
          ? <CheckCircle {...iconProps} />
          : <Info {...iconProps} />;
      default:
        return <Bell {...iconProps} />;
    }
  };

  const getPriorityColor = () => {
    switch (notification.priority) {
      case 'urgent':
        return '#FF3B30';
      case 'high':
        return '#FF9500';
      case 'medium':
        return '#007AFF';
      case 'low':
        return '#34C759';
      default:
        return '#007AFF';
    }
  };

  const containerStyle = [
    styles.container,
    { backgroundColor: getPriorityColor() },
  ];

  const animatedStyle = {
    transform: [{ translateY }],
    opacity,
  };

  const ToastContent = (
    <View style={styles.content}>
      <View style={styles.iconContainer}>
        {getIcon()}
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title} numberOfLines={1}>
          {notification.title}
        </Text>
        <Text style={styles.message} numberOfLines={2}>
          {notification.message}
        </Text>
      </View>
      <TouchableOpacity 
        onPress={() => handleDismiss.current()}
        style={styles.closeButton}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <X size={18} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );

  return (
    <Animated.View style={[styles.wrapper, animatedStyle]}>
      <TouchableOpacity 
        activeOpacity={onPress ? 0.8 : 1}
        onPress={onPress}
        style={containerStyle}
      >
        {Platform.OS === 'ios' ? (
          <BlurView intensity={20} tint="dark" style={styles.blur}>
            {ToastContent}
          </BlurView>
        ) : (
          ToastContent
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute' as const,
    top: 60,
    left: 16,
    right: 16,
    zIndex: 9999,
  },
  container: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  blur: {
    overflow: 'hidden',
  },
  content: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    padding: 16,
    minHeight: 80,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
    marginRight: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  message: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 18,
  },
  closeButton: {
    padding: 4,
  },
});
