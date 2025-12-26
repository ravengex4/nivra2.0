import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
// Assuming usage of vector icons, replace with your project's icon set if different
import { Ionicons } from '@expo/vector-icons'; 

const FloatingHeader = () => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.headerContainer, { top: insets.top + 12 }]}>
      <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
        <Ionicons name="menu-outline" size={24} color="#00E5FF" />
      </TouchableOpacity>

      <Text style={styles.headerTitle}>NIVRA MONITOR</Text>

      <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
        <Ionicons name="pulse-outline" size={24} color="#FF4081" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    position: 'absolute', // Ensures content scrolls underneath
    alignSelf: 'center', // Centers horizontally
    width: '92%', // Detached from edges
    maxWidth: 400,
    height: 56,
    
    // Pill Shape
    borderRadius: 100,
    
    // Dark Modern Medical Theme
    backgroundColor: 'rgba(18, 18, 24, 0.95)', 
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    
    // Floating Effect (Glow & Shadow)
    zIndex: 1000,
    shadowColor: '#00E5FF', // Medical Cyan Glow
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8, // Android shadow
    
    // Subtle border for definition
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 255, 0.15)',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
});

export default FloatingHeader;