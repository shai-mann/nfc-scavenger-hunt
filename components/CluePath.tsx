import { Clue } from "@/app/(tabs)";
import { generateSinePath } from "@/lib/generate-sine-path";
import { useMemo } from "react";
import { Dimensions, FlatList, TouchableOpacity, View } from "react-native";
import Svg, { Path } from "react-native-svg";
import { Text } from "./ui/text";

const DIMENSIONS = Dimensions.get("window");
const AMPLITUDE = 0.3;
const STEP = Math.PI / 2;
const VERTICAL_SCALE = 100; // the "tightness" of the wave

interface CluePathProps {
  clues: Clue[];
}

export const CluePath = ({ clues }: CluePathProps) => {
  // Generate path
  const path = useMemo(
    () =>
      generateSinePath({
        width: DIMENSIONS.width,
        height: DIMENSIONS.height,
        amplitude: AMPLITUDE,
        frequency: 1,
      }),
    []
  );

  console.log(path);

  return (
    <View className="size-full relative bg-red-500">
      <Svg
        height="100%"
        width="100%"
        className="absolute top-0 left-0 pointer-events-none"
      >
        <Path
          d={path}
          stroke="black"
          strokeWidth={3}
          strokeDasharray={[10, 8]}
          fill="none"
        />
      </Svg>
      <FlatList
        data={clues}
        keyExtractor={(item) => item.id.toString()}
        renderItem={ClueComponent}
        className="flex flex-col w-full h-full absolute top-0 left-0"
        contentContainerStyle={{
          paddingVertical: 50,
          alignItems: "center",
          justifyContent: "center",
        }}
        showsVerticalScrollIndicator={false}
      />
    </View>
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
