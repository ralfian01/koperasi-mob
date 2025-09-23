import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { styled } from "nativewind";
// Assuming you have an icon component or library
// import { Feather } from '@expo/vector-icons';

// FIX: Apply styled HOC to enable className prop on components.
const StyledAnimatedView = styled(Animated.View);
const StyledView = styled(View);
const StyledText = styled(Text);
const StyledTouchableOpacity = styled(TouchableOpacity);


interface NotificationProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
}

const typeStyles = {
  success: {
    bg: 'bg-green-100',
    border: 'border-green-400',
    text: 'text-green-800',
    icon: 'check-circle',
  },
  error: {
    bg: 'bg-red-100',
    border: 'border-red-400',
    text: 'text-red-800',
    icon: 'x-circle',
  },
  info: {
    bg: 'bg-blue-100',
    border: 'border-blue-400',
    text: 'text-blue-800',
    icon: 'info',
  },
};

const Notification: React.FC<NotificationProps> = ({ message, type, onClose }) => {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(30));

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      handleClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => onClose());
  };

  const styles = typeStyles[type];
  const title = type.charAt(0).toUpperCase() + type.slice(1);

  return (
    <StyledAnimatedView
      style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}
      className={`w-full p-4 rounded-lg shadow-lg border-l-4 ${styles.bg} ${styles.border} flex-row items-start`}
    >
      {/* <Feather name={styles.icon as any} size={24} className={styles.text} /> */}
      <StyledView className="mx-3 flex-1">
        <StyledText className={`font-bold text-sm ${styles.text}`}>{title}</StyledText>
        <StyledText className={`mt-1 text-sm ${styles.text}`}>{message}</StyledText>
      </StyledView>
      <StyledTouchableOpacity onPress={handleClose} className="p-1">
        {/* <Feather name="x" size={20} className={styles.text} /> */}
         <StyledText className={styles.text}>X</StyledText>
      </StyledTouchableOpacity>
    </StyledAnimatedView>
  );
};

export default Notification;
