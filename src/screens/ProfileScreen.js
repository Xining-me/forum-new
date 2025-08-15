import React, { useMemo, useState } from 'react';
import { View, Text, Image, StyleSheet, Pressable, FlatList, ScrollView } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useAppStore } from '../store/appStore';
import PostCard from '../components/PostCard';
import HeaderBar from '../components/HeaderBar';

// 添加Image组件定义（React Native的Image）
const Image = require('react-native').Image;

export default function ProfileScreen(){
  const route = useRoute();
  const nav = useNavigation();
  const { userId } = route.params || {};
  const { users, posts, me, follow } = useAppStore();
  const u = users[userId] || me;
  const isMe = !userId || userId === me?.id;
  const [tab, setTab] = useState('posts');

  const lists = useMemo(()=>{
    if (!u) return { posts: [], replies: [], bookmarks: [], likes: [] };
    
    const mine = posts.filter(p => p.authorId === u.id);
    const replies = posts.filter(p => p.replyTo && p.authorId === u.id);
    const likes = posts.filter(p => p.likes.includes(u.id));
    const bookmarks = posts.filter(p => p.bookmarks.includes(u.id));
    
    return { posts: mine, replies, bookmarks, likes };
  }, [posts, u]);

  if (!u) {
    return (
      <View style={styles.container}>
        <HeaderBar title="个人主页" />
        <View style={styles.loadingContainer}>
          <Text>用户不存在</Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <HeaderBar title={isMe ? "我的主页" : u.displayName} />
      
      {/* 背景图 */}
      <View style={styles.bannerContainer}>
        {u.banner ? (
          <Image source={{ uri: u.banner }} style={styles.banner} />
        ) : (
          <View style={styles.defaultBanner} />
        )}
      </View>
      
      {/* 个人信息 */}
      <View style={styles.profileInfo}>
        <Image 
          source={{ 
            uri: u.avatar || `https://api.dicebear.com/9.x/initials/png?seed=${encodeURIComponent(u.displayName||u.handle||'U')}` 
          }} 
          style={styles.avatar} 
        />
        
        <View style={styles.infoText}>
          <Text style={styles.displayName}>{u.displayName || '用户'}</Text>
          <Text style={styles.handle}>@{u.handle}</Text>
          <Text style={styles.registeredDate}>
            注册时间 {new Date(u.registeredAt).toLocaleDateString()}
          </Text>
        </View>
        
        {!isMe && (
          <Pressable 
            style={styles.followButton}
            onPress={() => follow(u.id)}
          >
            <Text style={styles.followButtonText}>
              {me && new Set(me.follows || []).has(u.id) ? '已关注' : '关注'}
            </Text>
          </Pressable>
        )}
        
        {isMe && (
          <Pressable 
            style={styles.settingsButton}
            onPress={()=>nav.navigate('Settings')}
          >
            <Text style={styles.settingsText}>设置</Text>
          </Pressable>
        )}
      </View>
      
      {/* 内容标签页 */}
      <View style={styles.tabRow}>
        {['posts','replies','bookmarks','likes'].map(key=>(
          <Pressable 
            key={key} 
            onPress={()=>setTab(key)} 
            style={[styles.tab, tab===key&&styles.tabActive]}
          >
            <Text style={tab===key?styles.tabActiveText:styles.tabText}>
              {({posts:'帖子',replies:'回复',bookmarks:'收藏',likes:'点赞'})[key]}
            </Text>
          </Pressable>
        ))}
      </View>
      
      {/* 内容列表 */}
      {lists[tab].length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>暂无{({posts:'帖子',replies:'回复',bookmarks:'收藏',likes:'点赞'})[tab]}</Text>
        </View>
      ) : (
        <FlatList
          data={lists[tab]}
          keyExtractor={(it)=>it.id}
          renderItem={({item})=>(
            <PostCard 
              post={item} 
              onPressAuthor={()=>{}} 
              onPressMore={()=>{}}
            />
          )}
          showsVerticalScrollIndicator={false}
        />
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex:1, backgroundColor:'#fff' },
  bannerContainer: {
    height: 180,
    width: '100%'
  },
  banner: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover'
  },
  defaultBanner: {
    width: '100%',
    height: '100%',
    backgroundColor: '#E5E7EB'
  },
  profileInfo: {
    padding: 16,
    marginTop: -60,
    flexDirection: 'row',
    alignItems: 'flex-end'
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: '#fff',
    backgroundColor: '#eee'
  },
  infoText: {
    marginLeft: 12,
    marginBottom: 12
  },
  displayName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827'
  },
  handle: {
    color: '#6B7280',
    marginTop: 4
  },
  registeredDate: {
    color: '#6B7280',
    marginTop: 4
  },
  settingsButton: {
    marginLeft: 'auto',
    marginBottom: 12
  },
  settingsText: {
    color: '#1D9BF0',
    fontWeight: '600'
  },
  followButton: {
    marginLeft: 'auto',
    marginBottom: 12,
    backgroundColor: '#1D9BF0',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999
  },
  followButtonText: {
    color: '#fff',
    fontWeight: '600'
  },
  tabRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#E5E7EB'
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center'
  },
  tabActive: {
    borderBottomWidth: 2,
    borderColor: '#111827'
  },
  tabText: {
    color: '#6B7280'
  },
  tabActiveText: {
    color: '#111827',
    fontWeight: '700'
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center'
  },
  emptyText: {
    color: '#6B7280',
    fontSize: 16
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
