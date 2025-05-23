import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { getWeights } from './api';
const screenWidth = Dimensions.get('window').width;

export default function WeightChart() {
  const [pesos, setPesos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://192.168.0.27:8000/weights/test')
      .then(res => res.json())
      .then(data => {
        setPesos(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error al cargar pesos:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Cargando datos...</Text>
      </View>
    );
  }

  const fechas = pesos.map(p => p.fecha.slice(5)); // solo mes/día
  const valores = pesos.map(p => p.peso);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Progreso de Peso</Text>
      <LineChart
        data={{
          labels: fechas,
          datasets: [{ data: valores }]
        }}
        width={screenWidth - 20}
        height={220}
        yAxisSuffix="kg"
        chartConfig={{
          backgroundGradientFrom: "#fff",
          backgroundGradientTo: "#fff",
          color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          propsForDots: {
            r: "4",
            strokeWidth: "2",
            stroke: "#007AFF"
          }
        }}
        bezier
        style={styles.chart}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 50,
    paddingHorizontal: 10
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 20
  },
  chart: {
    borderRadius: 12
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
