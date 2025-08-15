import React from 'react';
import { View, Text, StyleSheet, Pressable, Image, TouchableOpacity } from 'react-native';
import { useAppStore } from '../store/appStore';
import { Ionicons } from '@expo/vector-icons';

// 添加Image组件定义（React Native的Image）
const Image = require('react-native').Image;

export default function PostCard({ post, onPressAuthor, onPressMore }){
  const { users, toggle, me } = useAppStore();
  const u = users[post.authorId] || {};
  const time = new Date(post.createdAt).toLocaleString();
  const badge = post.type === 'announcement' ? '【公告】' : '';
  const isLiked = post.likes.includes(me?.id);
  const isBookmarked = post.bookmarks.includes(me?.id);
  const isReposted = post.reposts.includes(me?.id);

  return (
    <View style={styles.card}>
      <Pressable 
        onPress={onPressAuthor} 
        style={{ marginRight:12 }}
        accessibilityLabel={`查看${u.displayName || '用户'}的主页`}
      >
        <Image 
          source={{ 
            uri: u.avatar || `https://api.dicebear.com/9.x/initials/png?seed=${encodeURIComponent(u.displayName||u.handle||'U')}` 
          }} 
          style={styles.avatar}
          accessibilityLabel="用户头像"
        />
      </Pressable>
      
      <View style={{ flex:1 }}>
        <View style={styles.header}>
          <Pressable onPress={onPressAuthor}>
            <Text style={styles.name}>{u.displayName || u.handle || '用户'}</Text>
          </Pressable>
          <Text style={styles.handle}>@{u.handle}</Text>
          <Text style={styles.dot}>·</Text>
          <Text style={styles.time}>{time}</Text>
        </View>
        
        <Text style={styles.text}>
          {badge}
          {post.text}
        </Text>
        
        <View style={styles.actions}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => toggle({ postId: post.id, field: 'likes' })}
            accessibilityLabel={isLiked ? "取消点赞" : "点赞"}
          >
            <Ionicons 
              name={isLiked ? "heart" : "heart-outline"} 
              size={20} 
              color={isLiked ? "#EF4444" : "#6B7280"} 
            />
            <Text style={[styles.actionText, isLiked && { color: "#EF4444" }]}>
              {post.likes.length}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => toggle({ postId: post.id, field: 'reposts' })}
            accessibilityLabel={isReposted ? "取消转发" : "转发"}
          >
            <Ionicons 
              name={isReposted ? "repeat" : "repeat-outline"} 
              size={20} 
              color={isReposted ? "#10B981" : "#6B7280"} 
            />
            <Text style={[styles.actionText, isReposted && { color: "#10B981" }]}>
              {post.reposts.length}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => toggle({ postId: post.id, field: 'bookmarks' })}
            accessibilityLabel={isBookmarked ? "取消收藏" : "收藏"}
          >
            <Ionicons 
              name={isBookmarked ? "bookmark" : "bookmark-outline"} 
              size={20} 
              color={isBookmarked ? "#1D9BF0" : "#6B7280"} 
            />
            <Text style={[styles.actionText, isBookmarked && { color: "#1D9BF0" }]}>
              {post.bookmarks.length}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <Pressable 
        onPress={onPressMore}
        style={styles.moreButton}
        accessibilityLabel="更多选项"
      >
        <Text style={{fontSize:18}}>⋯</Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  card:{ 
    flexDirection:'row', 
    padding:12, 
    borderBottomWidth:1, 
    borderColor:'#E5E7EB', 
    backgroundColor:'#fff' 
  },
  avatar:{ 
    width:40, 
    height:40, 
    borderRadius:20, 
    backgroundColor:'#eee' 
  },
  header:{ 
    flexDirection:'row', 
    alignItems:'center', 
    flexWrap: 'wrap'
  },
  name:{ 
    fontWeight:'700', 
    color:'#111827' 
  },
  handle:{ 
    color:'#6B7280', 
    marginLeft:6 
  },
  dot:{ 
    color:'#9CA3AF', 
    marginHorizontal:4 
  },
  time:{ 
    color:'#9CA3AF' 
  },
  text:{ 
    marginTop:6, 
    lineHeight:20,
    color: '#111827'
  },
  actions:{ 
    marginTop:8, 
    flexDirection:'row', 
    justifyContent:'space-between',
    paddingRight: 20
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  actionText: {
    color: '#6B7280',
    fontSize: 14
  },
  moreButton: {
    padding: 4
  }
});
    