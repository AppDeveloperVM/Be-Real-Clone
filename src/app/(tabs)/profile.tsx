import { useAuth } from "@/context/AuthContext";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { useRouter } from "expo-router";
import React, { useMemo, useRef, useState } from "react";
import { Button, Platform, StyleSheet, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function Profile() {
  const { signOut } = useAuth();
  const router = useRouter();

  // 1. Referencia para controlar el sheet
  const bottomSheetRef = useRef<BottomSheet>(null);

  // 2. Puntos de anclaje (donde se detiene el sheet)
  // '25%' es un cuarto de pantalla, '50%' es la mitad
  const snapPoints = useMemo(() => ["25%", "50%"], []);

  const [selectedColor, setSelectedColor] = useState("#2096F3");

  // Esta función se dispara cada vez que el usuario mueve el dedo
  const onSelectColor = ({ hex }: { hex: string }) => {
    setSelectedColor(hex);
  };

  // 3. Funciones para abrir/cerrar
  const handleOpenPress = () => bottomSheetRef.current?.expand();
  const handleClosePress = () => bottomSheetRef.current?.close();

  const handleLogout = async () => {
    await signOut();
    // El router.replace a login suele hacerse automático en el RootLayout
    // si tienes el useEffect vigilando al 'user', pero puedes reforzarlo:
    router.replace("/(auth)/login");
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.title}>Profile Screen</Text>

        <Button title="Abrir" onPress={handleLogout} />

        {/* Aquí va tu botón y tu BottomSheet de antes */}
        <Button
          title="Abrir"
          onPress={() => bottomSheetRef.current?.expand()}
        />

        <BottomSheet
          ref={bottomSheetRef}
          index={-1}
          snapPoints={["50%"]}
          enablePanDownToClose={true}
          backdropComponent={(props) => (
            <BottomSheetBackdrop
              {...props}
              disappearsOnIndex={-1}
              appearsOnIndex={0}
            />
          )}
        >
          {Platform.OS === "ios"}

          <BottomSheetView>
            <Text>¡Ahora sí detecto los gestos!</Text>
          </BottomSheetView>
        </BottomSheet>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#a3a3a3",
    justifyContent: "center",
  },
  title: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
    padding: 20,
  },
  sheetText: {
    color: "#fff",
    fontSize: 18,
  },
});
