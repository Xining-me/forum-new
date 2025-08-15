import React from 'react';
import { View, Text, Pressable, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function HeaderBar({ 
  title, 
  leftButton, 
  rightButton, 
  backgroundColor = '#fff' 
}) {
  const insets = useSafeAreaInsets();
  
  return (
    <View style={[styles.container, { 
      backgroundColor,
      paddingTop: insets.top,
      height: 44 + insets.top
    }]}>
      <View style={styles.left}>
        {leftButton || <View style={styles.spacer} />}
      </View>
      
      <View style={styles.center}>
        <Text style={styles.title}>{title}</Text>
      </View>
      
      <View style={styles.right}>
        {rightButton || <View style={styles.spacer} />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingHorizontal: 16
  },
  left: {
    flex: 1,
    alignItems: 'flex-start'
  },
  center: {
    flex: 2,
    alignItems: 'center'
  },
  right: {
    flex: 1,
    alignItems: 'flex-end'
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827'
  },
  spacer: {
    width: 40,
    height: 40
  }
});
    