import React, { useState, useEffect } from 'react';
import { View, Text, Dimensions, StyleSheet, TouchableOpacity } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import axios from 'axios';

const screenWidth = Dimensions.get('window').width;

const WeightGraphScreen = () => {

  const [data, setData] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const visibleCount = 7;
  const endIndex = startIndex + visibleCount;
  const visibleData = data.length > 0 ? data.slice(startIndex, endIndex) : [];
  const [selectedIndex, setSelectedIndex] = useState(Math.floor(visibleData.length / 2));

  useEffect(() => {
    axios.get('http://192.168.0.27:8000/weights/test')
      .then(response => {
        console.log('Data fetched:', response.data);
        setData(response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);



  const handleLeft = () => {
    if (startIndex > 0) {
      setStartIndex(startIndex - 1);
      setSelectedIndex(Math.max(0, selectedIndex - 1));
    }
  };

  const handleRight = () => {
    if (endIndex < data.length) {
      setStartIndex(startIndex + 1);
      setSelectedIndex(Math.min(visibleCount - 1, selectedIndex + 1));
    }
  };

  if (visibleData.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Cargando datos...</Text>
      </View>
    );
  }

  const selectedData = visibleData[selectedIndex];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tu peso</Text>
      <Text style={styles.value}>{selectedData.value} kg</Text>
      <Text style={styles.date}>{selectedData.date.slice(0, 16).replace("T", " ")}</Text>

      <LineChart
        data={{
          labels: visibleData.map(d => d.date.slice(5, 10).replace("-", "/")),
          datasets: [
            {
              data: visibleData.map(d => Math.round(d.value)),
              color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`
            }
          ]
        }}
        width={screenWidth - 40}
        height={220}
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
