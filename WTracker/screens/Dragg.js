import React, { useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { PanGestureHandler, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {
    useAnimatedGestureHandler,
    useSharedValue,
    useAnimatedStyle,
    withSpring,
} from 'react-native-reanimated';


const DraggableComponent = ({ setMove }) => {

    let moved = false;
    const onGestureEvent = useAnimatedGestureHandler({
        onStart: (_, ctx) => {
            console.log("Gesture started");
        },
        onActive: (event, ctx) => {
            console.log("Se ha movido el gesto en el eje X:", event.translationX);
            if (event.translationX > 150 && !moved) {
                console.log("Movimiento hacia la derecha");
                setMove(event.translationX);
                moved = true;
            }
        }
    });

    return (
        <View style={styles.container}>
            <GestureHandlerRootView style={{ flex: 1 }}>
                <PanGestureHandler onGestureEvent={onGestureEvent}>
                    <Animated.View style={[styles.box]} />
                </PanGestureHandler>
            </GestureHandlerRootView>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    box: {
        width: 100,
        height: 100,
        backgroundColor: 'blue',
        borderRadius: 10,
    },
});

export default DraggableComponent;