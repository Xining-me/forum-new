import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, Modal, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

export default function FAB(){
  const [open, setOpen] = useState(false);
  const [animation] = useState(new Animated.Value(0));
  const nav = useNavigation();

  // 动画效果
  React.useEffect(() => {
    Animated.timing(animation, {
      toValue: open ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [open, animation]);

  const sheetStyle = {
    opacity: animation.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    }),
    transform: [
      {
        translateY: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [20, 0],
        }),
      },
    ],
  };

  const backdropStyle = {
    opacity: animation.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 0.5],
    }),
  };

  return (
    <View style={styles.wrap}>
      <Pressable 
        style={styles.fab} 
        onPress={() => setOpen(true)}
        accessibilityLabel="创建内容"
      >
        <Ionicons name="add" size={24} color="#fff" />
      </Pressable>
      
      <Modal 
        visible={open} 
        transparent 
        animationType="fade" 
        onRequestClose={() => setOpen(false)}
      >
        <Animated.View style={[styles.backdrop, backdropStyle]}>
          <Pressable 
            style={styles.backdropPressable}
            onPress={() => setOpen(false)}
          />
        </Animated.View>
        
        <Animated.View style={[styles.sheet, sheetStyle]}>
          <Pressable 
            style={styles.item} 
            onPress={() => { 
              setOpen(false); 
              nav.navigate('Compose', { type: 'post' }); 
            }}
          >
            <Ionicons name="create-outline" size={20} color="#111827" style={styles.itemIcon} />
            <Text style={styles.itemText}>发布帖子</Text>
          </Pressable>
          
          <Pressable 
            style={styles.item} 
            onPress={() => { 
              setOpen(false); 
              nav.navigate('Compose', { type: 'announcement' }); 
            }}
          >
            <Ionicons name="megaphone-outline" size={20} color="#111827" style={styles.itemIcon} />
            <Text style={styles.itemText}>发布公告</Text>
          </Pressable>
          
          <Pressable 
            style={[styles.item, styles.cancelItem]} 
            onPress={() => setOpen(false)}
          >
            <Ionicons name="close-outline" size={20} color="#EF4444" style={styles.itemIcon} />
            <Text style={[styles.itemText, { color: '#EF4444' }]}>取消</Text>
          </Pressable>
        </Animated.View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  wrap:{ 
    position:'absolute', 
    right:16, 
    bottom:24,
    zIndex: 100
  },
  fab:{ 
    width:56, 
    height:56, 
    borderRadius:28, 
    backgroundColor:'#1D9BF0', 
    alignItems:'center', 
    justifyContent:'center', 
    elevation:4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  backdropPressable: {
    flex: 1
  },
  sheet: { 
    position:'absolute', 
    right:16, 
    bottom:90, 
    backgroundColor:'#fff', 
    borderRadius:12, 
    elevation:5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    minWidth: 200
  },
  item:{ 
    paddingHorizontal:16, 
    paddingVertical:14, 
    borderBottomWidth:1, 
    borderColor:'#F3F4F6',
    flexDirection: 'row',
    alignItems: 'center'
  },
  itemIcon: {
    marginRight: 12
  },
  itemText: {
    fontSize: 16,
    color: '#111827'
  },
  cancelItem: {
    borderBottomWidth: 0
  }
});
    