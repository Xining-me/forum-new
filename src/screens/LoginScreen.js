import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useUser } from '../context/UserContext';

export default function LoginScreen({ navigation }) {
  const { login } = useUser();
  const [studentId, setStudentId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if ((!studentId && !email) || !password) {
      alert('请填写完整信息');
      return;
    }
    
    setIsLoading(true);
    try {
      await login({
        id: studentId || email,
        name: studentId ? '学号用户' : email.split('@')[0],
        avatar: `https://api.dicebear.com/9.x/initials/png?seed=${studentId || email}`,
        email: email,
        studentId: studentId,
        registeredAt: Date.now()
      });
    } catch (error) {
      alert('登录失败: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>登录</Text>
      
      <TextInput
        placeholder="学生号（选填）"
        value={studentId}
        onChangeText={setStudentId}
        style={styles.input}
        keyboardType="number-pad"
        disabled={isLoading}
      />
      
      <TextInput
        placeholder="邮箱（选填）"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
        disabled={isLoading}
      />
      
      <TextInput
        placeholder="密码"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
        disabled={isLoading}
      />
      
      <TouchableOpacity 
        style={styles.button} 
        onPress={handleLogin}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading ? '登录中...' : '进入'}
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        onPress={() => navigation.navigate('Register')}
        disabled={isLoading}
      >
        <Text style={styles.link}>没有账号？注册</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flexGrow: 1, 
    justifyContent: 'center', 
    padding: 20,
    backgroundColor: '#fff'
  },
  title: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    marginBottom: 20,
    textAlign: 'center'
  },
  input: { 
    borderWidth: 1, 
    borderColor: '#ccc', 
    padding: 10, 
    borderRadius: 5, 
    marginBottom: 10 
  },
  button: { 
    backgroundColor: '#1DA1F2', 
    padding: 15, 
    borderRadius: 5,
    marginTop: 10
  },
  buttonText: { 
    color: '#fff', 
    textAlign: 'center', 
    fontWeight: 'bold' 
  },
  link: { 
    marginTop: 10, 
    color: '#1DA1F2', 
    textAlign: 'center' 
  }
});
    