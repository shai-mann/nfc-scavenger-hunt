import { Clue } from "@/app/(tabs)";
import { generateSinePath } from "@/lib/generate-sine-path";
import { useMemo, useState } from "react";
import { Dimensions, ScrollView, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Circle, Path } from "react-native-svg";
import { Text } from "./ui/text";

const DIMENSIONS = Dimensions.get("window");
const AMPLITUDE = 0.3;
const STEP = Math.PI / 2;
const VERTICAL_SCALE = 100; // the "tightness" of the wave

interface CluePathProps {
  clues: Clue[];
}

export const CluePath = ({ clues }: CluePathProps) => {
  const insets = useSafeAreaInsets();

  const [contentHeight, setContentHeight] = useState(0);

  // Generate path
  const { d: path, pts } = useMemo(
    () =>
      generateSinePath({
        width: DIMENSIONS.width,
        height: contentHeight,
        amplitude: AMPLITUDE,
        frequency: 1,
        points: 2,
      }),
    [contentHeight]
  );

  console.log(contentHeight);

  return (
    <ScrollView className="flex-1">
      <View
        className="relative"
        style={{
          paddingBottom: insets.bottom + 50, // extra padding for tabs
        }}
      >
        <Svg
          height={contentHeight}
          width={DIMENSIONS.width}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
          }}
        >
          <Path
            d={path}
            stroke="black"
            strokeWidth={3}
            strokeDasharray={[10, 8]}
            fill="none"
          />
          {pts.map((pt, index) => (
            <Circle key={index} cx={pt.x} cy={pt.y} r={5} fill="green" />
          ))}
        </Svg>
        <View
          className="flex flex-col items-center"
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
  const angle = index * STEP;
  const horizontalOffset = Math.sin(angle) * AMPLITUDE * DIMENSIONS.width;
  const verticalOffset = Math.sin(angle) * VERTICAL_SCALE;

  return (
    <View
      style={{
        transform: [{ translateX: horizontalOffset }],
        marginTop: verticalOffset,
      }}
    >
      <View
        style={{
          backgroundColor: "#4f46e5",
          width: DIMENSIONS.width * 0.2,
          height: DIMENSIONS.width * 0.2,
          borderRadius: (DIMENSIONS.width * 0.2) / 2,
          justifyContent: "center",
          alignItems: "center",
          shadowColor: "#000",
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 5,
        }}
      >
        <TouchableOpacity>
          <Text style={{ color: "#fff", fontWeight: "bold" }}>{item.name}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
