import React, { useState, useContext } from 'react';
import { View, TextInput, Button, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import * as LocalAuthentication from 'expo-local-authentication';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginUser } from '../screens/api';

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const [showBiometricPrompt, setShowBiometricPrompt] = useState(false);
  const [savedUser, setSavedUser] = useState(null);

  React.useEffect(() => {
    (async () => {
      const user = await AsyncStorage.getItem('biometricUser');
      if (user) {
        setSavedUser(user);
        setShowBiometricPrompt(true);
      }
    })();
  }, []);

  const handleLogin = async () => {
    try {
      console.log('Intentando iniciar sesión');
      loginUser(username, password);
      login(username);
      await AsyncStorage.setItem('biometricUser', username);
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
    }
  };

  const handleBiometricLogin = async () => {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Autenticación biométrica',
    });
    if (result.success) {
      login(savedUser);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Iniciar sesión</Text>
        <TextInput
          placeholder="Usuario"
          value={username}
          onChangeText={setUsername}
          style={styles.input}
        />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
          style={styles.input}
        />
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>
        <Text style={styles.link} onPress={() => navigation.navigate('Register')}>
          ¿No tienes cuenta? Regístrate
        </Text>
        {showBiometricPrompt && (
          <TouchableOpacity style={styles.button} onPress={handleBiometricLogin}>
            <Text style={styles.buttonText}>Entrar con biometría</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#fff',
    padding: 32,
    borderRadius: 16,
    width: '90%',
    maxWidth: 400,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#007AFF',
  },
  input: {
    height: 44,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 12,
    borderRadius: 8,
    width: '100%',
    backgroundColor: '#f9fafb',
  },
  link: {
    color: '#007AFF',
    marginTop: 18,
    marginBottom: 10,
    textDecorationLine: 'underline',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
});