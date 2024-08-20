import { Easing } from "react-native";
import { Animated } from "react-native";

export default ({ on, children, style }) => {
  spinValue = new Animated.Value(0);

  if (on) {
    Animated.loop(
      Animated.timing(this.spinValue, {
        toValue: 1,
        duration: 3000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }

  const spin = this.spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <Animated.View style={{ transform: [{ rotate: spin }], ...style }}>
      {children}
    </Animated.View>
  );
};
