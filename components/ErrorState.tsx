import { TouchableOpacity, View } from "react-native";
import { Text } from "./ui/text";

export const ErrorState = ({
  error,
  refetch,
}: {
  error: any;
  refetch?: () => void;
}) => {
  return (
    <View className="flex-1 bg-white flex flex-col items-center justify-center">
      <Text className="text-destructive text-center px-4">
        {error instanceof Error ? error.message : "An error occurred"}
      </Text>
      <TouchableOpacity
        onPress={() => refetch?.()}
        className="mt-4 bg-primary px-4 py-2 rounded"
      >
        <Text className="text-white">Retry</Text>
      </TouchableOpacity>
    </View>
  );
};
