import { Clue } from "@/app/(tabs)";
import { generateSinePath } from "@/lib/generate-sine-path";
import { useMemo, useState } from "react";
import { Dimensions, ScrollView, TouchableOpacity, View } from "react-native";
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
    <ScrollView className="flex-1">
      <View
        className="relative"
        style={{
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
            stroke="black"
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
  const angle = index * STEP;
  const horizontalOffset = Math.sin(angle) * AMPLITUDE;

  return (
    <View
      style={{
        transform: [{ translateX: horizontalOffset }],
      }}
    >
      <View
        style={{
          backgroundColor: "#4f46e5",
          width: CLUE_SIZE,
          height: CLUE_SIZE,
          borderRadius: "50%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <TouchableOpacity>
          <Text style={{ color: "#fff", fontWeight: "bold" }}>{item.name}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
