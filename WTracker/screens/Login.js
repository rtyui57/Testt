import React, { useState, useContext } from 'react';
import { View, TextInput, Button } from 'react-native';
import { AuthContext } from '../context/AuthContext';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const { login } = useContext(AuthContext);

  const handleLogin = () => {
    // aquí podrías verificar con la API
    login(username);
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput placeholder="Usuario" value={username} onChangeText={setUsername} />
      <Button title="Entrar" onPress={handleLogin} />
    </View>
  );
}
