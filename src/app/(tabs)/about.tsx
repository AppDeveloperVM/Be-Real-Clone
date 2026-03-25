import { Image } from "expo-image";
import {
    View
} from "react-native";

export default function About() {
  return (
    <View>
      <Image
        source={{
          uri: "https://media.istockphoto.com/id/1177461477/es/vector/d%C3%ADa-de-alfabetizaci%C3%B3n-papelcut-tarjeta-libro-abierto-aves-volando.jpg?s=1024x1024&w=is&k=20&c=uKgVSCkGEOHdkbyPi5KAEHrkq-Gq_hso5pKtUrU4C6Q=",
        }}
      ></Image>
    </View>
  );
}
