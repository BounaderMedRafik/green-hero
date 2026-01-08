import { useAuth } from "@/components/context/auth-provider";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Link, router } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function LoginScreen() {
  const { login } = useAuth();
  const colorScheme = useColorScheme() ?? "light";
  const theme = Colors[colorScheme];

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isFocused, setIsFocused] = useState<string | null>(null);

  const getFieldStyle = (fieldName: string) => [
    styles.input,
    {
      backgroundColor: colorScheme === "dark" ? "#1A1D1E" : "#FFFFFF",
      color: theme.text,
      borderColor: isFocused === fieldName ? theme.tint : "transparent",
      borderWidth: 2,
    },
  ];

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={[
          styles.container,
          { backgroundColor: theme.background },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Background Decorative Element */}
        <View
          style={[
            styles.circleDecor,
            { backgroundColor: theme.tint, opacity: 0.05 },
          ]}
        />

        <View style={styles.headerSection}>
          {/* YOUR LOGO ADDED HERE */}
          <Image
            source={require("@/assets/gh/gh-rounded.png")}
            style={styles.logo}
            resizeMode="contain"
          />

          <ThemedText type="title" style={styles.title}>
            Welcome Back
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            Sign in to your eco-account
          </ThemedText>
        </View>

        <View
          style={[
            styles.card,
            {
              backgroundColor: colorScheme === "dark" ? "#151718" : "#FFFFFF",
            },
          ]}
        >
          <View style={styles.form}>
            <View>
              <ThemedText style={styles.label}>Email</ThemedText>
              <TextInput
                placeholder="example@green.com"
                placeholderTextColor="#687076"
                keyboardType="email-address"
                autoCapitalize="none"
                style={getFieldStyle("email")}
                value={email}
                onFocus={() => setIsFocused("email")}
                onBlur={() => setIsFocused(null)}
                onChangeText={setEmail}
              />
            </View>

            <View>
              <ThemedText style={styles.label}>Password</ThemedText>
              <TextInput
                placeholder="••••••••"
                placeholderTextColor="#687076"
                secureTextEntry
                style={getFieldStyle("password")}
                value={password}
                onFocus={() => setIsFocused("password")}
                onBlur={() => setIsFocused(null)}
                onChangeText={setPassword}
              />
            </View>

            <TouchableOpacity
              onPress={() => {
                router.push("/(auth)/forget-password");
              }}
              style={styles.forgotPassword}
            >
              <ThemedText
                style={{ color: theme.tint, fontWeight: "600", fontSize: 13 }}
              >
                Forgot Password?
              </ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              style={[styles.button, { backgroundColor: theme.tint }]}
              onPress={() => login(email, password)}
            >
              <ThemedText style={styles.buttonText}>Sign In</ThemedText>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.footer}>
          <ThemedText style={styles.footerText}>New here? </ThemedText>
          <Link href="/signup" asChild>
            <TouchableOpacity>
              <ThemedText style={{ color: theme.tint, fontWeight: "bold" }}>
                Create Account
              </ThemedText>
            </TouchableOpacity>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    paddingTop: Platform.OS === "ios" ? 80 : 60,
  },
  logo: {
    width: 50,
    height: 50,
    marginBottom: 20,
    marginTop: 30,
    alignSelf: "center",
  },
  circleDecor: {
    position: "absolute",
    top: -100,
    right: -100,
    width: 300,
    height: 300,
    borderRadius: 150,
  },
  headerSection: {
    alignItems: "center",
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    lineHeight: 34,
    textAlign: "center",
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 15,
    opacity: 0.5,
    marginTop: 4,
  },
  card: {
    borderRadius: 24,
    padding: 24,
    elevation: 8,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
  },
  form: {
    gap: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    marginLeft: 4,
    opacity: 0.8,
  },
  input: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
    fontSize: 16,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  button: {
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 10,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
    letterSpacing: 0.5,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginTop: -10,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 32,
    marginBottom: 20,
  },
  footerText: {
    opacity: 0.6,
  },
});
