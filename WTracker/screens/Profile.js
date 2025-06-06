import React from 'react';
import { View, Text, Button } from 'react-native';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function ProfileScreen({ navigation }) {

    const { user, logout } = useContext(AuthContext);

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Perfil</Text>
            <Text>Esta es la pantalla de perfil.</Text>
            <Button title="Log Out" onPress={logout}/>
        </View>
    );
}