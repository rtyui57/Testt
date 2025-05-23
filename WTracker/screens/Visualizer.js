import React, { useState } from 'react';
import { View, Text, Dimensions, StyleSheet, TouchableOpacity } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

const WeightGraphScreen = () => {
  const allData = [
    { date: '2025-05-01', value: 72.5 },
    { date: '2025-05-02', value: 73.0 },
    { date: '2025-05-03', value: 74.2 },
    { date: '2025-05-04', value: 73.7 },
    { date: '2025-05-05', value: 72.9 },
    { date: '2025-05-06', value: 72.2 },
    { date: '2025-05-07', value: 71.9 },
    { date: '2025-05-08', value: 72.1 },
    { date: '2025-05-09', value: 73.5 },
    { date: '2025-05-10', value: 74.1 },
    { date: '2025-05-11', value: 75.0 },
    { date: '2025-05-12', value: 75.5 },
    { date: '2025-05-13', value: 76.0 },
    { date: '2025-05-14', value: 76.5 }
  ];

  const [startIndex, setStartIndex] = useState(0);
  const visibleCount = 7;
  const endIndex = startIndex + visibleCount;
  const visibleData = allData.slice(startIndex, endIndex);
  const [selectedIndex, setSelectedIndex] = useState(Math.floor(visibleData.length / 2));

  const selectedData = visibleData[selectedIndex];

  const handleLeft = () => {
    if (startIndex > 0) {
      setStartIndex(startIndex - 1);
      setSelectedIndex(Math.max(0, selectedIndex - 1));
    }
  };

  const handleRight = () => {
    if (endIndex < allData.length) {
      setStartIndex(startIndex + 1);
      setSelectedIndex(Math.min(visibleCount - 1, selectedIndex + 1));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tu peso</Text>
      <Text style={styles.value}>{selectedData.value} kg</Text>
      <Text style={styles.date}>{selectedData.date}</Text>

      <LineChart
        data={{
          labels: visibleData.map(d => d.date.slice(5)),
          datasets: [
            {
              data: visibleData.map(d => d.value),
              color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`
            }
          ]
        }}
        width={screenWidth - 40}
        height={220}
        yAxisSuffix="kg"
        fromZero
        chartConfig={{
          backgroundGradientFrom: "#ffffff",
          backgroundGradientTo: "#ffffff",
          color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
          labelColor: () => "#888",
          propsForDots: {
            r: "4",
            strokeWidth: "2",
            stroke: "#007AFF"
          }
        }}
        bezier
        style={styles.chart}
        onDataPointClick={({ index }) => setSelectedIndex(index)}
      />

      <View style={styles.controls}>
        <TouchableOpacity onPress={handleLeft} style={styles.arrow}>
          <Text style={styles.arrowText}>◀</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleRight} style={styles.arrow}>
          <Text style={styles.arrowText}>▶</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 60,
    alignItems: 'center'
  },
  title: {
    fontSize: 24,
    fontWeight: '600'
  },
  value: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#007AFF'
  },
  date: {
    fontSize: 16,
    color: '#888',
    marginBottom: 20
  },
  chart: {
    borderRadius: 16
  },
  controls: {
    flexDirection: 'row',
    marginTop: 20
  },
  arrow: {
    marginHorizontal: 20,
    padding: 10,
    backgroundColor: '#eee',
    borderRadius: 8
  },
  arrowText: {
    fontSize: 20,
    fontWeight: 'bold'
  }
});

export default WeightGraphScreen;
