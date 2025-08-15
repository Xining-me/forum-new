import React, { useState, useMemo } from 'react';
import { View, FlatList, StyleSheet, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import HeaderBar from '../components/HeaderBar';
import TopTabs from '../components/TopTabs';
import PostCard from '../components/PostCard';
import FAB from '../components/FAB';
import { useAppStore } from '../store/appStore';

export default function HomeScreen(){
  const nav = useNavigation();
  const { posts, me, follows } = useAppStore();
  const [index, setIndex] = useState(0);
  const routes = [
    { key:'latest', title:'最新发帖' },
    { key:'following', title:'正在关注' },
    { key:'clubs', title:'参加社团' },
  ];

  const data = useMemo(()=>{
    if(index===0) return posts;
    if(index===1){
      const setF = new Set(follows[me?.id] || []);
      return posts.filter(p => setF.has(p.authorId));
    }
    // 社团动态：简单演示，先显示公告
    return posts.filter(p => p.type==='announcement').concat(posts.filter(p => p.type!=='announcement'));
  }, [index, posts, follows, me]);

  return (
    <View style={styles.container}>
      <HeaderBar title="首页" />
      <TopTabs routes={routes} index={index} onIndexChange={setIndex} />
      <FlatList
        data={data}
        keyExtractor={(item)=>item.id}
        renderItem={({item})=>(
          <PostCard 
            post={item} 
            onPressAuthor={()=>nav.navigate('Profile', { userId:item.authorId })} 
            onPressMore={()=>{}}
          />
        )}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>暂无内容</Text>
          </View>
        )}
      />
      <FAB/>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex:1, backgroundColor:'#fff' },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  emptyText: {
    color: '#6B7280',
    fontSize: 16
  }
});
