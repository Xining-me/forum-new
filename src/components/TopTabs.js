import React from 'react';
import { View, Pressable, Text, StyleSheet } from 'react-native';

export default function TopTabs({ routes, index, onIndexChange }){
  return (
    <View style={styles.wrap}>
      {routes.map((r, i)=>(
        <Pressable 
          key={r.key} 
          style={[styles.tab, i===index && styles.active]} 
          onPress={()=>onIndexChange(i)}
          accessibilityRole="tab"
          accessibilitySelected={i === index}
        >
          <Text style={[styles.label, i===index && styles.activeLabel]}>{r.title}</Text>
        </Pressable>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: { 
    flexDirection:'row', 
    borderBottomWidth:1, 
    borderColor:'#E5E7EB',
    backgroundColor: '#fff'
  },
  tab: { 
    flex:1, 
    paddingVertical:12, 
    alignItems:'center' 
  },
  active: { 
    borderBottomWidth:2, 
    borderColor:'#111827' 
  },
  label: { 
    color:'#6B7280', 
    fontWeight:'500' 
  },
  activeLabel: { 
    color:'#111827',
    fontWeight: '700'
  },
});
    