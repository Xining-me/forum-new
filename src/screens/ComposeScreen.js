import React, { useState } from 'react';
import { View, TextInput, Text, Pressable, StyleSheet, Alert, ScrollView } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useAppStore } from '../store/appStore';
import HeaderBar from '../components/HeaderBar';

// 添加Image组件定义（React Native的Image）
const Image = require('react-native').Image;

export default function ComposeScreen(){
  const route = useRoute();
  const nav = useNavigation();
  const { type = 'post' } = route.params || {};
  const { createPost, me } = useAppStore();
  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [postType, setPostType] = useState(type);

  function submit(){
    const content = text.trim();
    if(!content) {
      return Alert.alert('提示', '请输入内容');
    }
    
    setIsSubmitting(true);
    try {
      createPost({ text: content, type: postType });
      Alert.alert('成功', '发布成功');
      nav.goBack();
    } catch (error) {
      Alert.alert('错误', error.message);
      setIsSubmitting(false);
    }
  }

  return (
    <View style={styles.container}>
      <HeaderBar 
        title={postType === 'announcement' ? '发布公告' : '发布帖子'} 
        leftButton={
          <Pressable onPress={() => nav.goBack()}>
            <Text style={styles.cancelText}>取消</Text>
          </Pressable>
        }
        rightButton={
          <Pressable 
            style={styles.postButton} 
            onPress={submit}
            disabled={isSubmitting || !text.trim()}
          >
            <Text style={styles.postText}>
              {isSubmitting ? '发布中...' : '发布'}
            </Text>
          </Pressable>
        }
      />
      
      <ScrollView style={styles.contentContainer}>
        <View style={styles.profileContainer}>
          <Image 
            source={{ 
              uri: me?.avatar || `https://api.dicebear.com/9.x/initials/png?seed=${encodeURIComponent(me?.displayName||me?.handle||'U')}` 
            }} 
            style={styles.avatar} 
          />
          <Text style={styles.userName}>{me?.displayName || '用户'}</Text>
        </View>
        
        <View style={styles.typeSelector}>
          <Pressable
            style={[styles.typeButton, postType === 'post' && styles.activeTypeButton]}
            onPress={() => setPostType('post')}
          >
            <Text style={[styles.typeText, postType === 'post' && styles.activeTypeText]}>
              普通帖子
            </Text>
          </Pressable>
          <Pressable
            style={[styles.typeButton, postType === 'announcement' && styles.activeTypeButton]}
            onPress={() => setPostType('announcement')}
          >
            <Text style={[styles.typeText, postType === 'announcement' && styles.activeTypeText]}>
              公告
            </Text>
          </Pressable>
        </View>
        
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="分享你的想法..."
          multiline
          style={styles.input}
          autoFocus={true}
          maxLength={280}
        />
        
        <Text style={styles.characterCount}>
          {text.length}/280
        </Text>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container:{ 
    flex:1, 
    backgroundColor:'#fff' 
  },
  contentContainer: {
    flex: 1,
    padding: 16
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#eee'
  },
  userName: {
    marginLeft: 10,
    fontWeight: '600'
  },
  typeSelector: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderColor: '#E5E7EB',
    paddingBottom: 8
  },
  typeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16
  },
  activeTypeButton: {
    backgroundColor: '#E8F0FE'
  },
  typeText: {
    color: '#6B7280'
  },
  activeTypeText: {
    color: '#1D9BF0',
    fontWeight: '600'
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    minHeight: 150,
    padding: 12,
    textAlignVertical: 'top',
    fontSize: 16
  },
  characterCount: {
    textAlign: 'right',
    color: '#6B7280',
    marginTop: 8
  },
  cancelText: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '500'
  },
  postButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: '#1D9BF0',
    opacity: 0.9
  },
  postText: {
    color: '#fff',
    fontWeight: '600'
  }
});
    