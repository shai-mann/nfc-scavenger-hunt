import { Clue } from "@/app/(tabs)";
import { generateSinePath } from "@/lib/generate-sine-path";
import { cn } from "@/lib/utils";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import { Dimensions, Pressable, ScrollView, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";
import { Text } from "./ui/text";

const DIMENSIONS = Dimensions.get("window");
const AMPLITUDE = 100;
const STEP = Math.PI / 2;
const PERIOD = 750; // the "tightness" of the wave

const CLUE_SIZE = DIMENSIONS.width * 0.2;

interface CluePathProps {
  clues: Clue[];
}

export const CluePath = ({ clues }: CluePathProps) => {
  const insets = useSafeAreaInsets();

  const [contentHeight, setContentHeight] = useState(0);

  // Generate path
  const { d: path } = useMemo(
    () =>
      generateSinePath({
        width: DIMENSIONS.width,
        // height of canvas minus the height of the final clue,
        // so the line doesn't extend past the final clue!
        height: contentHeight - CLUE_SIZE,
        amplitude: AMPLITUDE,
        period: PERIOD,
      }),
    [contentHeight]
  );

  return (
    <ScrollView className="flex-1 bg-secondary/50">
      <View
        className="relative"
        style={{
          marginTop: 15, // needed to allow the shadow from the clue to
          paddingBottom: insets.bottom + 50, // extra padding for tabs
        }}
      >
        <Svg
          height={contentHeight}
          width={DIMENSIONS.width} // TODO: can I remove this and just center the SVG?
          style={{
            position: "absolute",
            top: CLUE_SIZE / 2,
            left: 0,
          }}
        >
          <Path
            d={path}
            stroke="#DCDEDF"
            strokeWidth={3}
            strokeDasharray={[10, 8]}
            fill="none"
          />
        </Svg>
        <View
          className="flex flex-col items-center"
          style={{
            gap: PERIOD / 4 - CLUE_SIZE,
          }}
          onLayout={(event) => {
            const { height } = event.nativeEvent.layout;
            setContentHeight(height);
          }}
        >
          {clues.map((clue, index) => (
            <ClueComponent key={clue.id} item={clue} index={index} />
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const ClueComponent = ({ item, index }: { item: Clue; index: number }) => {
  // offset calculations
  const angle = index * STEP;
  const horizontalOffset = Math.sin(angle) * AMPLITUDE;

  // Shared values for animation
  const scale = useSharedValue(1);

  // Animated style that updates on UI thread
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      width: CLUE_SIZE,
      height: CLUE_SIZE,
    };
  });

  const handlePressIn = () => {
    scale.value = withSpring(0.95);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  return (
    <View
      style={{
        transform: [{ translateX: horizontalOffset }],
      }}
    >
      <Pressable
        disabled={!item.isFound}
        onPress={() => router.push(`/clue-display/${item.id}`)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <Animated.View
          className={cn("rounded-full items-center justify-center", {
            "bg-primary": item.isFound,
            "border-2 border-primary border-dashed": !item.isFound,
          })}
          style={animatedStyle}
        >
          <View
            className={cn("absolute self-center rounded-full size-1/2", {
              "bg-primary": !item.isFound,
              "bg-transparent": item.isFound,
            })}
          />
          <Text className="font-bold text-white">
            {item.isFound ? item.name : "???"}
          </Text>
        </Animated.View>
      </Pressable>
    </View>
  );
};
