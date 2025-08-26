import { router } from "expo-router";
import { useLayoutEffect } from "react";

export default function Index() {
  useLayoutEffect(() => {
    router.replace("/registration");
  }, []);

  return null;
}
