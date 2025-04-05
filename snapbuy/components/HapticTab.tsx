import { BottomTabBarButtonProps } from "@react-navigation/bottom-tabs";
import { PlatformPressable } from "@react-navigation/elements";
import * as Haptics from "expo-haptics";
import { Animated, View, StyleSheet, Platform } from "react-native";
import { useRef, useCallback, useEffect } from "react";

export function HapticTab(props: BottomTabBarButtonProps) {
  const scale = useRef(new Animated.Value(1)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  const animateScale = useCallback(
    (toValue: number) => {
      Animated.spring(scale, {
        toValue,
        useNativeDriver: true,
        speed: 50,
        bounciness: 4,
      }).start();
    },
    [scale]
  );

  const animateSelection = useCallback(
    (isSelected: boolean) => {
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: isSelected ? -3 : 0,
          useNativeDriver: true,
          speed: 20,
          bounciness: 2,
        }),
        Animated.timing(opacity, {
          toValue: isSelected ? 1 : 0.6,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    },
    [translateY, opacity]
  );

  useEffect(() => {
    animateSelection(props.accessibilityState?.selected || false);
  }, [props.accessibilityState?.selected, animateSelection]);

  return (
    <View style={styles.container}>
      <PlatformPressable
        {...props}
        onPressIn={(ev) => {
          animateScale(0.95);
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
            styles.content,
            {
              transform: [{ scale }, { translateY }],
              opacity,
            },
          ]}
        >
          <View style={styles.iconContainer}>{props.children}</View>
          <Animated.Text
            style={[
              styles.label,
              {
                color: props.accessibilityState?.selected
                  ? "#4169E1"
                  : "#666666",
              },
            ]}
          >
            {props.accessibilityLabel}
          </Animated.Text>
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
  },
  pressable: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 4,
  },
  iconContainer: {
    height: 32,
    width: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: 12,
    fontWeight: "500",
    marginTop: 6,
    textAlign: "center",
  },
});
