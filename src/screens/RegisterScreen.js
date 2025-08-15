import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useUser } from '../context/UserContext';

export default function RegisterScreen({ navigation }) {
  const { login } = useUser();
  const [name, setName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || (!studentId && !email) || !password) {
      alert('请填写完整信息');
      return;
    }
    
    if (password !== confirmPassword) {
      alert('两次密码不一致');
      return;
    }
    
    setIsLoading(true);
    try {
      await login({
        id: studentId || email,
        name,
        avatar: `https://api.dicebear.com/9.x/initials/png?seed=${name}`,
        email: email,
        studentId: studentId,
        registeredAt: Date.now()
      });
    } catch (error) {
      alert('注册失败: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>注册</Text>
      
      <TextInput 
        placeholder="昵称" 
        value={name} 
        onChangeText={setName} 
        style={styles.input}
        disabled={isLoading}
      />
      
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
      
      <TextInput
        placeholder="确认密码"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        style={styles.input}
        secureTextEntry
        disabled={isLoading}
      />
      
      <TouchableOpacity 
        style={styles.button} 
        onPress={handleRegister}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading ? '注册中...' : '注册并进入'}
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        onPress={() => navigation.navigate('Login')}
        disabled={isLoading}
      >
        <Text style={styles.link}>已有账号？登录</Text>
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
    