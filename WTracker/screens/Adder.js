import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, Platform, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';

export default function WeightPicker() {
  const [whole, setWhole] = useState(70);
  const [decimal, setDecimal] = useState(0);
  const [unit, setUnit] = useState('kg');

  const sendWeight = async () => {
    const finalWeight = whole + decimal / 10;

    try {
      const res = await fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ weight: finalWeight, unit }),
      });

      const data = await res.json();
      Alert.alert('Enviado ✅', `Peso: ${finalWeight} ${unit}`);
    } catch (error) {
      Alert.alert('Error ❌', 'No se pudo enviar el peso');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Selecciona tu peso</Text>

      <View style={styles.pickerGroup}>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={whole}
            onValueChange={setWhole}
            style={styles.picker}
            itemStyle={styles.pickerItem}>
            {Array.from({ length: 101 }, (_, i) => 50 + i).map((num) => (
              <Picker.Item key={num} label={String(num)} value={num} />
            ))}
          </Picker>
        </View>

        <Text style={styles.dot}>.</Text>

        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={decimal}
            onValueChange={setDecimal}
            style={styles.picker}
            itemStyle={styles.pickerItem}>
            {Array.from({ length: 10 }, (_, i) => (
              <Picker.Item key={i} label={String(i)} value={i} />
            ))}
          </Picker>
        </View>

        <View style={styles.unitPickerWrapper}>
          <Picker
            selectedValue={unit}
            onValueChange={setUnit}
            style={styles.unitPicker}
            itemStyle={styles.pickerItem}>
            <Picker.Item label="kg" value="kg" />
            <Picker.Item label="lb" value="lb" />
            <Picker.Item label="st" value="st" />
          </Picker>
        </View>
      </View>

      {/* Muestra el valor seleccionado aquí */}
      <Text style={styles.selectedText}>
        Peso seleccionado: {whole}.{decimal} {unit}
      </Text>

      <TouchableOpacity onPress={sendWeight} style={styles.button}>
        <Text style={styles.buttonText}>Enviar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  label: {
    fontSize: 22,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 30,
  },
  pickerGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 6,
    marginBottom: 16,
  },
  pickerWrapper: {
    width: 80,
    height: Platform.OS === 'ios' ? 150 : 100,
    justifyContent: 'center',
  },
  picker: {
    flex: 1,
  },
  pickerItem: {
    fontSize: 20,
    height: 150,
  },
  dot: {
    fontSize: 32,
    color: '#334155',
    paddingHorizontal: 4,
    marginTop: -10,
  },
  unitPickerWrapper: {
    width: 80,
    marginLeft: 16,
    height: Platform.OS === 'ios' ? 150 : 100,
  },
  unitPicker: {
    flex: 1,
  },
  selectedText: {
    fontSize: 20,
    color: '#0f172a',
    marginBottom: 20,
    fontWeight: '500',
  },
  button: {
    backgroundColor: '#3b82f6',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 100,
    elevation: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
