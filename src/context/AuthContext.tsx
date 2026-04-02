import { supabase } from "@/lib/supabase/client";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

export interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  profileImage?: string;
  onboardingCompleted?: boolean;
}

interface AuthContextType {
  user: User | null;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
}

// Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        const profile = await fetchUserProfile(session.user.id);
        setUser(profile);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Error checking session:", error);
      setUser(null);
    }
  };

  const fetchUserProfile = async (userId: string): Promise<User | null> => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      if (error) {
        console.log("Error fetching profile:", error);
        return null;
      }

      if (!data) {
        console.log("No profile data returned");
        return null;
      }

      const authUser = await supabase.auth.getUser();
      if (!authUser.data.user) {
        console.log("No auth user found.");
        return null;
      }

      return {
        id: data.id,
        name: data.name,
        username: data.username,
        email: authUser.data.user.email || "",
        profileImage: data.profile_image_url,
        onboardingCompleted: data.onboarding_completed,
      };
    } catch (error) {
      console.error("Error in fetchUserProfile:", error);
      return null;
    }
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    if (data.user) {
      const profile = await fetchUserProfile(data.user.id);
      if (profile) {
        setUser(profile);
      }
    }
  };

  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;

    if (data.user) {
      // 1. Creamos un objeto de usuario temporal para que la app no rompa
      const tempUser: User = {
        id: data.user.id,
        email: data.user.email || "",
        name: "",
        username: "",
        onboardingCompleted: false,
      };

      // 2. Intentamos traer el perfil real (con un pequeño re-intento si es necesario)
      // Pero por ahora, seteamos el temporal para que el Layout sepa quién es
      setUser(tempUser);

      // 3. Intentamos buscar el perfil real creado por el trigger
      setTimeout(async () => {
        if (!data.user) return;
        const profile = await fetchUserProfile(data.user.id);
        if (profile) setUser(profile);
      }, 1500);
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      // Limpiamos el estado local manualmente para forzar la redirección
      setUser(null);
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const updateUser = async (userData: Partial<User>) => {
    if (!user) return;

    try {
      const updateData: any = {};
      updateData.id = user.id;

      if (userData.name !== undefined) updateData.name = userData.name;
      if (userData.username !== undefined)
        updateData.username = userData.username;
      if (userData.profileImage !== undefined)
        updateData.profile_image_url = userData.profileImage;
      if (userData.onboardingCompleted !== undefined)
        updateData.onboarding_completed = userData.onboardingCompleted;

      // update user data
      const { error } = await supabase.from("profiles").upsert(updateData);
      // .update(updateData)
      // .eq("id", user.id);

      if (error) throw error;

      setUser({ ...user, ...userData });
    } catch (error) {
      console.log("Error updating user:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, signUp, signIn, signOut, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("must be inside the provider");
  }
  return context;
};
