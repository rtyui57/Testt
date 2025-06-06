// app/(tabs)/WeightInput.tsx

import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Alert, Platform, TouchableOpacity } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { Picker } from '@react-native-picker/picker';
import { registerUser, addWeight, getWeights } from './api';
import axios from 'axios';


export default function WeightInput() {
    const [weight, setWeight] = useState(70);
    const [decimal, setDecimal] = useState(0);
    const [selectedLanguage, setSelectedLanguage] = useState("KG");
    const BASE_URL = 'http://192.168.0.27:8000';

    const weights = Array.from({ length: 151 }, (_, i) => ({
        label: `${50 + i}`, // <- Esto ahora es válido JavaScript/JSX
        value: 50 + i,
      }));
      

    const sendWeight = async () => {
        try {
            const peso = weight + (0.1 * decimal);
            console.log(`Peso ${peso} añadido el ${new Date().toISOString()}`);
            const result = await addWeight("test", peso, new Date().toISOString());
            console.log('Peso añadido');

        } catch (error) {
            Alert.alert('Error ❌', 'No se pudo enviar el peso');
        }
    };

    console.log("adsjkajdk")

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Selecciona tu peso</Text>

            <View style={styles.pickerContainer}>
                <RNPickerSelect
                    onValueChange={(value) => setWeight(value)}
                    items={weights}
                    value={weight}
                    style={{ flex: 1, height: 50 }}
                    useNativeAndroidPickerStyle={false}
                />
                <Picker
                    selectedValue={decimal}
                    onValueChange={(itemValue, itemIndex) =>
                        setDecimal(itemValue)
                    }
                    style={{ flex: 1, height: 50 }}>
                    {Array.from({ length: 9 }, (_, i) => i + 1).map((num) => (
                        <Picker.Item key={num} label={String(num)} value={num} />
                    ))}
                </Picker>
                <Picker
                    selectedValue={selectedLanguage}
                    onValueChange={(itemValue, itemIndex) =>
                        setSelectedLanguage(itemValue)
                    }
                      style={{ flex: 1, height: 50 }}>

                    <Picker.Item key={"KG"} label={"KG"} value={"KG"} />
                    <Picker.Item key={"LB"} label={"LB"} value={"LB"} />
                    <Picker.Item key={"KG"} label={"KG"} value={"KG"} />

                </Picker>
            </View>

            <TouchableOpacity onPress={sendWeight} style={styles.button}>
                <Text style={styles.buttonText}>Enviar peso</Text>
            </TouchableOpacity>
        </View>
    );
}


const styles = StyleSheet.create({
    headerImage: {
        color: '#808080',
        bottom: -90,
        left: -35,
        position: 'absolute',
    },
    container: {
        flex: 1,
        backgroundColor: '#f8fafc',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
    },
    label: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 20,
        color: '#1e293b',
    },
    pickerContainer: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 10,
        width: '80%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
        marginBottom: 32,
    },
    button: {
        backgroundColor: '#3b82f6',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 100,
        shadowColor: '#3b82f6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 6,
        elevation: 6,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    titleContainer: {
        flexDirection: 'row',
        gap: 8,
    },
    input: {
        height: 50,
        borderColor: '#d1d5db',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        fontSize: 18,
        color: '#0f172a',
        width: '100%',
    },
});

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        fontSize: 18,
        paddingVertical: 12,
        paddingHorizontal: 10,
        color: '#0f172a',
        flex: 1,
    },
    inputAndroid: {
        fontSize: 18,
        paddingVertical: 8,
        paddingHorizontal: 10,
        color: '#0f172a',
         flex: 1,
    },
});