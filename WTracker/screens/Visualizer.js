import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Dimensions, StyleSheet, Button } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import axios from 'axios';
import { GestureHandlerRootView, Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useSharedValue, withSpring, runOnJS } from 'react-native-reanimated';
import { useFocusEffect } from '@react-navigation/native';

const screenWidth = Dimensions.get('window').width;

const WeightGraphScreen = () => {

  const visibleCount = 7;

  const [data, setData] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const allValues = data.map(d => Math.round(d.value));
  const maxStart = Math.max(0, data.length - visibleCount);
  const safeStartIndex = Math.min(Math.max(startIndex, 0), maxStart);
  const endIndex = Math.min(safeStartIndex + visibleCount, data.length);
  const visibleData = data.slice(safeStartIndex, endIndex);

  useEffect(() => {
    if (data.length > 0) {
      const maxStart = Math.max(0, data.length - visibleCount);
      setStartIndex(maxStart);
      setSelectedIndex(visibleCount - 1); // Selecciona el último visible
    }
  }, [data]);

  const fetchWeights = () => {
    console.log("Fetching weights...");
    axios.get('http://192.168.0.27:8000/weights/test')
      .then(response => setData(response.data))
      .catch(error => console.error('Error fetching data:', error));
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchWeights();
    }, [])
  );

  const translateX = useSharedValue(0);

  const safeSelectedIndex = Math.min(Math.max(selectedIndex, 0), visibleData.length - 1);
  const selectedData = visibleData[safeSelectedIndex] || { value: '-', date: '-' };

  // Handlers para moverse
  const handleRight = () => {
    if (safeStartIndex < maxStart) {
      setStartIndex(safeStartIndex + 1);
      setSelectedIndex(prev => Math.min(prev + 1, visibleCount - 1, data.length - 1));
    }
  };

  const handleLeft = () => {
    if (safeStartIndex > 0) {
      setStartIndex(safeStartIndex - 1);
      setSelectedIndex(prev => Math.max(prev - 1, 0));
    }
  };
  const panGesture = Gesture.Pan()
    .onUpdate(e => {
      translateX.value = e.translationX;
    })
    .onEnd(e => {
      if (e.translationX > 60) {
        runOnJS(handleLeft)();
      } else if (e.translationX < -60) {
        runOnJS(handleRight)();
      }
      translateX.value = withSpring(0);
    });

  if (visibleData.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Cargando datos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View flex={1} style={{ alignItems: 'center', flex: 1, borderRadius: 16, padding: 20, marginBottom: 20 }}>
        <Text style={styles.title}>Tu peso</Text>
        <Text style={styles.value}>{selectedData.value} kg</Text>
        <Text style={styles.date}>{selectedData.date.slice(0, 16).replace("T", " ")}</Text>
      </View>

      <View style={{ position: 'relative', flex: 5, width: screenWidth - 40 }}>
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
          yMin={allValues.length ? Math.min(...allValues) : 0} // <-- Fija el mínimo
          yMax={allValues.length ? Math.max(...allValues) : 100} // <-- Fija el máximo
          yAxisMin ={allValues.length ? Math.min(...allValues) : 0} // <-- Fija el mínimo
          yAxisMax ={allValues.length ? Math.max(...allValues) : 100} // <-- Fija el máximo
          fromZero
          chartConfig={{
            flexDirection: 'row',
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
        <GestureHandlerRootView style={StyleSheet.absoluteFill}>
          <GestureDetector gesture={panGesture}>
            <Animated.View style={styles.animated} />
          </GestureDetector>
        </GestureHandlerRootView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 60,
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    height: '100%',
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
  animated: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: screenWidth - 40,
    height: 220,
    backgroundColor: 'rgba(179, 19, 19, 0.01)',
    zIndex: 10,
  }
});

export default WeightGraphScreen;