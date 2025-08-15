import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, Image, Alert, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { useAppStore } from '../store/appStore';
import HeaderBar from '../components/HeaderBar';

// 添加Image组件定义（React Native的Image）
const Image = require('react-native').Image;

export default function SettingsScreen(){
  const nav = useNavigation();
  const { me, updateProfile, logout } = useAppStore();
  const [displayName, setDisplayName] = useState(me?.displayName || '');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // 请求相册权限
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('权限不足', '需要相册权限才能更换头像和背景图');
      }
    })();
  }, []);

  async function pickImage(field) {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: field === 'avatar' ? [1, 1] : [16, 9],
        quality: 0.8,
      });

      if (!result.canceled) {
        await updateProfile({ [field]: result.assets[0].uri });
      }
    } catch (error) {
      Alert.alert('错误', '无法选择图片: ' + error.message);
    }
  }

  async function saveChanges() {
    if (!displayName.trim()) {
      Alert.alert('提示', '昵称不能为空');
      return;
    }

    setIsSaving(true);
    try {
      await updateProfile({ displayName: displayName.trim() });
      Alert.alert('成功', '资料已更新');
      nav.goBack();
    } catch (error) {
      Alert.alert('错误', '保存失败: ' + error.message);
    } finally {
      setIsSaving(false);
    }
  }

  async function confirmLogout() {
    Alert.alert(
      '确认退出',
      '确定要退出登录吗？',
      [
        { text: '取消', style: 'cancel' },
        { 
          text: '退出', 
          style: 'destructive',
          onPress: async () => {
            await logout();
            nav.reset({ index: 0, routes: [{ name: 'Auth' }] });
          }
        }
      ]
    );
  }

  if (!me) {
    return (
      <View style={styles.container}>
        <HeaderBar title="设置" />
        <View style={styles.loadingContainer}>
          <Text>加载中...</Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <HeaderBar title="编辑资料" />
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>头像</Text>
        <View style={styles.avatarContainer}>
          <Image 
            source={{ 
              uri: me.avatar || `https://api.dicebear.com/9.x/initials/png?seed=${encodeURIComponent(displayName||me.handle||'U')}` 
            }} 
            style={styles.avatar} 
          />
          <Pressable style={styles.button} onPress={() => pickImage('avatar')}>
            <Text style={styles.buttonText}>更换头像</Text>
          </Pressable>
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>背景图</Text>
        <Pressable 
          style={styles.bannerContainer} 
          onPress={() => pickImage('banner')}
        >
          {me.banner ? (
            <Image source={{ uri: me.banner }} style={styles.banner} />
          ) : (
            <View style={styles.defaultBanner}>
              <Text style={styles.bannerPlaceholder}>点击上传背景图</Text>
            </View>
          )}
        </Pressable>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>昵称</Text>
        <TextInput 
          style={styles.input} 
          value={displayName} 
          onChangeText={setDisplayName} 
          placeholder="显示名称"
        />
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>账号信息</Text>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>用户名</Text>
          <Text style={styles.infoValue}>@{me.handle}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>注册时间</Text>
          <Text style={styles.infoValue}>
            {new Date(me.registeredAt).toLocaleDateString()}
          </Text>
        </View>
      </View>
      
      <Pressable 
        style={styles.saveButton} 
        onPress={saveChanges}
        disabled={isSaving}
      >
        <Text style={styles.saveButtonText}>
          {isSaving ? '保存中...' : '保存'}
        </Text>
      </Pressable>
      
      <Pressable 
        style={styles.logoutButton} 
        onPress={confirmLogout}
      >
        <Text style={styles.logoutText}>退出登录</Text>
      </Pressable>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fff' 
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderColor: '#E5E7EB'
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
    color: '#111827'
  },
  avatarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#eee'
  },
  bannerContainer: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    overflow: 'hidden'
  },
  banner: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover'
  },
  defaultBanner: {
    width: '100%',
    height: '100%',
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center'
  },
  bannerPlaceholder: {
    color: '#6B7280'
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10
  },
  infoItem: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6'
  },
  infoLabel: {
    color: '#6B7280',
    width: 100
  },
  infoValue: {
    color: '#111827',
    flex: 1
  },
  button: {
    backgroundColor: '#111827',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999
  },
  buttonText: {
    color: '#fff'
  },
  saveButton: {
    backgroundColor: '#1D9BF0',
    paddingVertical: 14,
    borderRadius: 999,
    alignItems: 'center',
    margin: 16
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16
  },
  logoutButton: {
    paddingVertical: 14,
    borderRadius: 999,
    alignItems: 'center',
    margin: 16,
    borderWidth: 1,
    borderColor: '#EF4444'
  },
  logoutText: {
    color: '#EF4444',
    fontWeight: '700',
    fontSize: 16
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
    