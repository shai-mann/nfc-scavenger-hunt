import { Redirect } from "expo-router";

export default function Index() {
  // TODO: in the future we should use /home if the user is registered already!
  return <Redirect href="/registration" />;
}
