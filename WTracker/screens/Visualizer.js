import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import axios from 'axios';
import { PanGestureHandler, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';

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
      .then(response => setData(response.data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const translateX = useSharedValue(0);

  const onGestureEvent = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      ctx.startX = translateX.value;
    },
    onActive: (event, ctx) => {
      translateX.value = ctx.startX + event.translationX;
    },
    onEnd: (event) => {
      console.log("Se ha movido el gesto en el eje X:", event.translationX);
      if (event.translationX < -150) {
        console.log("Movimiento hacia la izquierda");
        setSelectedIndex(selectedIndex + 1);
      }
      translateX.value = withSpring(0);
    }
  });

  const handleLeft = () => {
    setStartIndex(startIndex - 1);
    setSelectedIndex(Math.max(0, selectedIndex - 1));
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
        <Text style={styles.value}>0 kg</Text>
        <Text style={styles.date}>No hay data disponible</Text>
      </View>
    );
  }

  const selectedData = visibleData[selectedIndex];

  return (
    <View style={styles.container}>
      <View flex={1} style={{ alignItems: 'center', flex: 1, backgroundColor: 'rgba(45, 146, 70, 0.8)', borderRadius: 16, padding: 20, marginBottom: 20 }}>
        <Text style={styles.title}>Tu peso</Text>
        <Text style={styles.value}>{selectedData.value} kg</Text>
        <Text style={styles.date}>{selectedData.date.slice(0, 16).replace("T", " ")}</Text>
      </View>

      <View style={{ position: 'relative', flex: 1, width: screenWidth - 40 }}>
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
          <PanGestureHandler onGestureEvent={onGestureEvent}>
            <Animated.View
              style={
                {
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: screenWidth - 40,
                  height: 220,
                  backgroundColor: 'rgba(179, 19, 19, 0.79)', // invisible pero recibe eventos
                  zIndex: 10,
                }
              }
            />
          </PanGestureHandler>
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
  }
});

export default WeightGraphScreen;