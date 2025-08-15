import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 数据类型定义:
// User: { id, handle, displayName, avatar, banner, registeredAt }
// Post: { id, authorId, text, createdAt, type: 'post' | 'announcement', likes:[], bookmarks:[], reposts:[], replyTo?:id }

const initialState = {
  me: null, // 当前用户对象
  users: {}, // id -> user
  posts: [], // 帖子数组，最新的在前
  follows: {}, // userId -> Set<string>
  clubs: {}, // clubId -> { id, name, memberIds:[] }
  trends: [], // 计算得出的趋势
  pinnedAnnouncements: [] // 前10条公告
};

export const useAppStore = create((set, get) => ({
  ...initialState,
  // 认证相关
  loginWithStudent: async ({ studentId, password }) => {
    // 演示用，接受任何非空凭证
    if(!studentId || !password) throw new Error('学号或密码不能为空');
    const id = 'u_' + studentId;
    const user = get().users[id] || {
      id,
      handle: 's' + studentId,
      displayName: '学号' + studentId,
      avatar: '',
      banner: '',
      registeredAt: Date.now(),
    };
    set(state => ({ users: { ...state.users, [id]: user }, me: user }));
    await AsyncStorage.setItem('auth', JSON.stringify(user));
  },
  loginWithEmail: async ({ email, code }) => {
    if(!email || !code) throw new Error('邮箱或验证码不能为空');
    const id = 'e_' + email.toLowerCase();
    const user = get().users[id] || {
      id,
      handle: email.split('@')[0],
      displayName: email.split('@')[0],
      avatar: '',
      banner: '',
      registeredAt: Date.now(),
    };
    set(state => ({ users: { ...state.users, [id]: user }, me: user }));
    await AsyncStorage.setItem('auth', JSON.stringify(user));
  },
  logout: async () => {
    set({ me: null });
    await AsyncStorage.removeItem('auth');
  },
  updateProfile: async (patch) => {
    const me = get().me;
    if(!me) return;
    const next = { ...me, ...patch };
    set(state => ({ me: next, users: { ...state.users, [me.id]: next } }));
    await AsyncStorage.setItem('auth', JSON.stringify(next));
  },
  // 帖子相关
  createPost: ({ text, type='post', replyTo=null }) => {
    const me = get().me;
    if(!me) throw new Error('未登录');
    const p = {
      id: 'p_' + Date.now() + Math.random().toString(36).slice(2,6),
      authorId: me.id,
      text: text.trim(),
      createdAt: Date.now(),
      type,
      likes: [], bookmarks: [], reposts: [],
      replyTo,
    };
    set(state => ({ posts: [p, ...state.posts] }));
    if(type === 'announcement'){
      set(state => ({ pinnedAnnouncements: [p, ...state.pinnedAnnouncements].slice(0,10) }));
    }
    computeTrends();
  },
  toggle: ({ postId, field }) => {
    const me = get().me;
    if(!me) return;
    set(state => ({
      posts: state.posts.map(p => {
        if(p.id !== postId) return p;
        const arr = new Set(p[field]);
        arr.has(me.id) ? arr.delete(me.id) : arr.add(me.id);
        return { ...p, [field]: Array.from(arr) };
      })
    }));
  },
  // 关注和社团功能暂为占位
  follow: (userId) => {
    const me = get().me; if(!me) return;
    set(state => {
      const setF = new Set(state.follows[me.id] || []);
      setF.has(userId) ? setF.delete(userId) : setF.add(userId);
      return { follows: { ...state.follows, [me.id]: Array.from(setF) } };
    });
  },
}));

export async function bootstrapStore(){
  const raw = await AsyncStorage.getItem('auth');
  if(raw){
    const me = JSON.parse(raw);
    useAppStore.setState(state => ({
      ...state,
      me,
      users: { ...state.users, [me.id]: me }
    }));
  }
}

// 简单的TF计数计算趋势
function computeTrends(){
  const { posts } = useAppStore.getState();
  const counts = new Map();
  for(const p of posts.slice(0,500)){
    const words = String(p.text || '').toLowerCase().match(/[\p{L}\p{N}#_]{2,}/gu) || [];
    for(const w of words){
      counts.set(w, (counts.get(w)||0)+1);
    }
  }
  const top = Array.from(counts.entries()).sort((a,b)=>b[1]-a[1]).slice(0,10).map(([k,c])=>({tag:k,count:c}));
  useAppStore.setState({ trends: top });
}
