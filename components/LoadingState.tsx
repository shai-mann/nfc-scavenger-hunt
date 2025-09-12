import { ActivityIndicator, View } from "react-native";
import { Text } from "./ui/text";

export const LoadingState = ({ message }: { message: string }) => {
  return (
    <View className="flex-1 bg-white flex flex-col items-center justify-center">
      <ActivityIndicator size="large" color="#AD8AD1" />
      <Text className="mt-4 text-gray-500">{message}</Text>
    </View>
  );
};
