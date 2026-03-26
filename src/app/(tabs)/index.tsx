import { Button, Host } from "@expo/ui/swift-ui";
import { Link, useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function Index() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text>Edit src/app/index.tsx to eit this screen.</Text>

      <Link href={"/about"}>Go to About</Link>
      <Host>
        <Button onPress={() => router.push("/about")}>
          <Text></Text>
        </Button>
      </Host>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: 200,
    height: 200,
  },
});
