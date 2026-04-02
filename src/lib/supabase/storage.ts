import { decode } from "base64-arraybuffer";
import { File } from "expo-file-system";
import * as FileSystem from "expo-file-system/legacy";
import { supabase } from "./client";

export const uploadProfileImage = async (userId: string, imageUri: string) => {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) throw new Error("No active session");

    const fileExtension = imageUri.split(".").pop()?.toLowerCase() || "jpg";
    const path = `${session.user.id}/profile.${fileExtension}`;

    // 2. Fetch the image and convert to Blob (Most stable for RN/Expo)
    const response = await fetch(imageUri);
    const blob = await response.blob();

    // upload
    const { data, error } = await supabase.storage
      .from("profiles")
      .upload(path, blob, {
        contentType: `image/${fileExtension === "jpg" ? "jpeg" : fileExtension}`,
        upsert: true,
      });

    if (error) {
      throw error;
    }

    const { data: urlData } = supabase.storage
      .from("profiles")
      .getPublicUrl(path);

    return urlData.publicUrl;
  } catch (err) {
    console.error("Error uploading profile image");
    throw err;
  }
};

export const uploadPostImage = async (userId: string, imageUri: string) => {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) throw new Error("No active session");

    const fileExtension = imageUri.split(".").pop()?.toLowerCase() || "jpg";
    const path = `${session.user.id}/${Date.now()}.${fileExtension}`;

    // --- NUEVA FORMA ---
    // 1. Instanciamos el archivo
    const file = new File(imageUri);

    // 2. Leemos el contenido como Base64
    const base64 = await FileSystem.readAsStringAsync(imageUri, {
      encoding: "base64" as any, // En la nueva API se puede pasar el string directo
    });
    // -------------------

    const { data, error } = await supabase.storage
      .from("posts")
      .upload(path, decode(base64), {
        contentType: `image/${fileExtension === "jpg" ? "jpeg" : fileExtension}`,
        upsert: true,
      });

    if (error) throw error;

    const { data: urlData } = supabase.storage.from("posts").getPublicUrl(path);
    return urlData.publicUrl;
  } catch (err) {
    console.error("Error en uploadPostImage:", err);
    throw err;
  }
};
