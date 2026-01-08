import { ProductType } from "@/app/(tabs)/marketplace";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { Alert } from "react-native";

// 1. Define the User type
interface User {
  _id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  name?: string;
  age?: number;
}

// 2. Define the Context interface
interface AuthContextType {
  user: User | null;
  products: ProductType[];
  token: string | null;
  loading: boolean;
  setToken: (token: string | null) => void;
  setUser: (user: User | null) => void;
  setProducts: (products: ProductType[]) => void;
  login: (email: string, password: string) => Promise<void>;
  signup: (formData: any) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [products, setProducts] = useState<ProductType[]>([]);

  // ✅ LOAD DATA ON STARTUP
  useEffect(() => {
    const loadStorageData = async () => {
      try {
        const savedToken = await SecureStore.getItemAsync("token");
        const savedUser = await SecureStore.getItemAsync("user");

        if (savedToken) {
          setToken(savedToken);
        }

        if (savedUser) {
          // Parse the string back into a JSON object
          setUser(JSON.parse(savedUser));
        }
      } catch (e) {
        console.error("Failed to load storage data", e);
      } finally {
        setLoading(false);
      }
    };
    loadStorageData();
  }, []);

  // ✅ LOGIN
  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const res = await fetch(
        "https://zander-unknotty-unblamably.ngrok-free.dev/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        Alert.alert("Login failed", data.message || "Something went wrong");
        return;
      }

      // ✅ Store both token and user object (as string)
      await SecureStore.setItemAsync("token", data.token);
      await SecureStore.setItemAsync("user", JSON.stringify(data.user));

      setToken(data.token);
      setUser(data.user);

      Alert.alert("Success", "Welcome back!");
      router.push("/(tabs)");
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Server not reachable");
    } finally {
      setLoading(false);
    }
  };

  // ✅ SIGNUP
  const signup = async (formData: {
    first_name: string;
    last_name: string;
    email: string;
    age: number;
    password: string;
  }) => {
    try {
      const res = await fetch(
        "https://zander-unknotty-unblamably.ngrok-free.dev/auth/signup",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        Alert.alert(
          "Signup failed",
          data.msg || data.errors?.[0]?.msg || "Something went wrong"
        );
        return;
      }

      // If your signup automatically logs them in, store data here.
      // Otherwise, redirect to login as you did before:
      Alert.alert("Success", "Account created successfully.");
      router.push("/(auth)/login"); //verifier compte ta3k
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Server not reachable");
    }
  };

  // ✅ LOGOUT
  const logout = async () => {
    setUser(null);
    setToken(null);
    await SecureStore.deleteItemAsync("token");
    await SecureStore.deleteItemAsync("user"); // Clean up user storage
    router.replace("/(auth)/login");
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        setToken,
        setUser,
        setProducts,
        products,
        user,
        signup,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
