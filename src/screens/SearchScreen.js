import React, { useMemo, useState } from 'react';
import { View, TextInput, Text, FlatList, Pressable, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import HeaderBar from '../components/HeaderBar';
import { useAppStore } from '../store/appStore';

export default function SearchScreen(){
  const { posts, trends } = useAppStore();
  const [q, setQ] = useState('');
  const [activeTab, setActiveTab] = useState('trends');
  const nav = useNavigation();

  const filteredPosts = useMemo(()=>{
    const searchTerm = q.trim().toLowerCase();
    if(!searchTerm) return [];
    return posts.filter(p => (p.text||'').toLowerCase().includes(searchTerm));
  }, [q, posts]);

  const topAnnouncements = useMemo(()=>
    posts.filter(p => p.type === 'announcement').slice(0,10), 
  [posts]);

  return (
    <View style={styles.container}>
      <HeaderBar title="搜索" />
      
      <View style={styles.searchContainer}>
        <TextInput 
          style={styles.searchInput} 
          placeholder="搜索帖子或用户" 
          value={q} 
          onChangeText={setQ}
          autoFocus={true}
        />
      </View>
      
      {/* 搜索结果或热门内容 */}
      {q ? (
        // 搜索结果
        <FlatList
          data={filteredPosts}
          keyExtractor={it => it.id}
          renderItem={({item}) => (
            <Pressable 
              style={styles.resultItem}
              onPress={() => {
                // 可以导航到帖子详情页
              }}
            >
              <Text style={styles.resultText}>{item.text}</Text>
            </Pressable>
          )}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>没有找到与"{q}"相关的内容</Text>
            </View>
          )}
        />
      ) : (
        // 热门内容标签页
        <View style={styles.tabsContainer}>
          <View style={styles.tabs}>
            <Pressable
              style={[styles.tab, activeTab === 'trends' && styles.activeTab]}
              onPress={() => setActiveTab('trends')}
            >
              <Text style={[styles.tabText, activeTab === 'trends' && styles.activeTabText]}>
                趋势
              </Text>
            </Pressable>
            <Pressable
              style={[styles.tab, activeTab === 'announcements' && styles.activeTab]}
              onPress={() => setActiveTab('announcements')}
            >
              <Text style={[styles.tabText, activeTab === 'announcements' && styles.activeTabText]}>
                公告
              </Text>
            </Pressable>
          </View>
          
          {activeTab === 'trends' ? (
            <ScrollView>
              <View style={styles.trendsContainer}>
                {trends.length === 0 ? (
                  <Text style={styles.emptyText}>暂无趋势数据</Text>
                ) : (
                  trends.map(t => (
                    <Pressable 
                      key={t.tag} 
                      style={styles.trendItem}
                      onPress={() => setQ(t.tag)}
                    >
                      <Text style={styles.trendTag}>#{t.tag}</Text>
                      <Text style={styles.trendCount}>{t.count} 条帖子</Text>
                    </Pressable>
                  ))
                )}
              </View>
            </ScrollView>
          ) : (
            <FlatList
              data={topAnnouncements}
              keyExtractor={it => it.id}
              renderItem={({item}) => (
                <Pressable 
                  style={styles.announcementItem}
                  onPress={() => {
                    // 可以导航到公告详情页
                  }}
                >
                  <Text style={styles.announcementBadge}>【公告】</Text>
                  <Text style={styles.announcementText}>{item.text}</Text>
                </Pressable>
              )}
              ListEmptyComponent={() => (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>暂无公告</Text>
                </View>
              )}
            />
          )}
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fff' 
  },
  searchContainer: {
    padding: 12,
    borderBottomWidth: 1,
    borderColor: '#E5E7EB'
  },
  searchInput: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10
  },
  tabsContainer: {
    flex: 1
  },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#E5E7EB'
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center'
  },
  activeTab: {
    borderBottomWidth: 2,
    borderColor: '#111827'
  },
  tabText: {
    color: '#6B7280',
    fontWeight: '500'
  },
  activeTabText: {
    color: '#111827',
    fontWeight: '700'
  },
  trendsContainer: {
    padding: 12
  },
  trendItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6'
  },
  trendTag: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827'
  },
  trendCount: {
    color: '#6B7280',
    marginTop: 4
  },
  announcementItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6'
  },
  announcementBadge: {
    color: '#EF4444',
    fontWeight: '700'
  },
  announcementText: {
    marginTop: 4,
    color: '#111827'
  },
  resultItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6'
  },
  resultText: {
    color: '#111827'
  },
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
    