import { BottomTabBarButtonProps } from "@react-navigation/bottom-tabs";
import { PlatformPressable } from "@react-navigation/elements";
import * as Haptics from "expo-haptics";
import { Animated, View, StyleSheet, Platform } from "react-native";
import { useRef, useCallback, useEffect } from "react";

export function HapticTab(props: BottomTabBarButtonProps) {
  const scale = useRef(new Animated.Value(1)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  const animateScale = useCallback(
    (toValue: number) => {
      Animated.spring(scale, {
        toValue,
        useNativeDriver: true,
        speed: 20,
        bounciness: 8,
      }).start();
    },
    [scale]
  );

  const animatePosition = useCallback(
    (isSelected: boolean) => {
      const translateValue = Platform.OS === "web" ? -2 : -1;
      Animated.spring(translateY, {
        toValue: isSelected ? translateValue : 0,
        useNativeDriver: true,
        speed: Platform.OS === "web" ? 25 : 20,
        bounciness: Platform.OS === "web" ? 2 : 1,
      }).start();
    },
    [translateY]
  );

  useEffect(() => {
    animatePosition(props.accessibilityState?.selected || false);
  }, [props.accessibilityState?.selected, animatePosition]);

  const isSelected = props.accessibilityState?.selected || false;

  return (
    <View style={styles.container}>
      <PlatformPressable
        {...props}
        onPressIn={(ev) => {
          animateScale(0.92);
          if (Platform.OS !== "web") {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }
          props.onPressIn?.(ev);
        }}
        onPressOut={(ev) => {
          animateScale(1);
          props.onPressOut?.(ev);
        }}
        style={styles.pressable}
      >
        <Animated.View
          style={[
            {
              transform: [{ scale }, { translateY }],
            },
            styles.iconContainer,
          ]}
        >
          {props.children}
          {isSelected && (
            <Animated.Text
              style={[
                styles.label,
                {
                  opacity: translateY.interpolate({
                    inputRange: Platform.OS === "web" ? [-4, 0] : [-2, 0],
                    outputRange: [1, 0],
                  }),
                },
              ]}
            >
              {props.accessibilityLabel}
            </Animated.Text>
          )}
        </Animated.View>
      </PlatformPressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
  },
  pressable: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    opacity: 1,
  },
  label: {
    marginTop: 4,
    fontSize: 12,
    textAlign: "center",
  },
});
