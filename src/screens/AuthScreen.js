import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Alert, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAppStore } from '../store/appStore';

export default function AuthScreen(){
  const nav = useNavigation();
  const { loginWithStudent, loginWithEmail } = useAppStore();
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');

  async function go(fn){
    try{
      await fn();
      nav.reset({ index:0, routes:[{ name:'Home' }] });
    }catch(e){
      Alert.alert('登录失败', e.message);
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.brand}>Campus X</Text>
      
      <View style={styles.card}>
        <Text style={styles.section}>学号登录</Text>
        <TextInput 
          style={styles.input} 
          placeholder="学号" 
          value={studentId} 
          onChangeText={setStudentId} 
          keyboardType="number-pad"
        />
        <TextInput 
          style={styles.input} 
          placeholder="密码" 
          secureTextEntry 
          value={password} 
          onChangeText={setPassword}
        />
        <Pressable 
          style={styles.btn} 
          onPress={()=>go(()=>loginWithStudent({ studentId, password }))}
        >
          <Text style={styles.btnText}>登录</Text>
        </Pressable>
      </View>

      <View style={styles.card}>
        <Text style={styles.section}>邮箱登录</Text>
        <TextInput 
          style={styles.input} 
          placeholder="邮箱" 
          value={email} 
          onChangeText={setEmail} 
          autoCapitalize="none" 
          keyboardType="email-address"
        />
        <View style={styles.codeContainer}>
          <TextInput 
            style={styles.codeInput} 
            placeholder="验证码" 
            value={code} 
            onChangeText={setCode} 
            keyboardType="number-pad"
          />
          <Pressable style={styles.sendCodeBtn}>
            <Text style={styles.sendCodeText}>发送验证码</Text>
          </Pressable>
        </View>
        <Pressable 
          style={styles.btn} 
          onPress={()=>go(()=>loginWithEmail({ email, code }))}
        >
          <Text style={styles.btnText}>登录</Text>
        </Pressable>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container:{ 
    flexGrow: 1, 
    backgroundColor:'#fff', 
    padding:16, 
    justifyContent:'center' 
  },
  brand:{ 
    fontSize:28, 
    fontWeight:'800', 
    textAlign:'center', 
    marginBottom:20 
  },
  card:{ 
    borderWidth:1, 
    borderColor:'#E5E7EB', 
    borderRadius:12, 
    padding:16, 
    marginBottom:16 
  },
  section:{ 
    fontWeight:'700', 
    marginBottom:8 
  },
  input:{ 
    borderWidth:1, 
    borderColor:'#E5E7EB', 
    borderRadius:10, 
    paddingHorizontal:12, 
    paddingVertical:10, 
    marginBottom:10 
  },
  codeContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10
  },
  codeInput: {
    flex: 1,
    borderWidth:1, 
    borderColor:'#E5E7EB', 
    borderRadius:10, 
    paddingHorizontal:12, 
    paddingVertical:10
  },
  sendCodeBtn: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    borderRadius: 10,
    justifyContent: 'center'
  },
  sendCodeText: {
    color: '#1D9BF0'
  },
  btn:{ 
    backgroundColor:'#111827', 
    borderRadius:999, 
    paddingVertical:12, 
    alignItems:'center' 
  },
  btnText:{ 
    color:'#fff', 
    fontWeight:'700' 
  }
});
