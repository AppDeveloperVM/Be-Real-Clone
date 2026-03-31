import { File } from "expo-file-system";
import { supabase } from "./client";

export const uploadProfileImage = async (userId: string, imageUri: string) => {
  try {
    const fileExtension = imageUri.split(".").pop()?.toLowerCase() || "jpg";
    const filename = `${userId}/profile.${fileExtension}`;
    const file = new File(imageUri);
    const bytes = await file.bytes();

    const { data: buckets, error: bError } =
      await supabase.storage.listBuckets();
    console.log("Buckets disponibles:", buckets);

    // upload
    const { data, error } = await supabase.storage
      .from("profiles")
      .upload(filename, bytes, {
        contentType: `image/${fileExtension}`,
        upsert: true, // inserts if doesnt exist, if exists, update
      });

    if (error) {
      throw error;
    }

    const { data: urlData } = supabase.storage
      .from("profiles")
      .getPublicUrl(filename);

    return urlData.publicUrl;
  } catch (err) {
    console.error("Error uploading profile image");
    throw err;
  }
};
