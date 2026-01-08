import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Link } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function ForgotPasswordScreen() {
  const colorScheme = useColorScheme() ?? "light";
  const theme = Colors[colorScheme];

  async function forgotPassword({ email }: { email: string }) {
    try {
      if (!email) return;

      // إرسال البريد للـ backend
      const res = await fetch(
        "https://zander-unknotty-unblamably.ngrok-free.dev/auth/forgot-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      const data = await res.json();

      // عرض الرسالة للمستخدم
      Alert.alert(
        "Password Reset",
        data.msg || "If the email exists, a reset link was sent ✅"
      );
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Error sending reset password email. ❌");
    }
  }

  const [email, setEmail] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const inputStyle = [
    styles.input,
    {
      backgroundColor: colorScheme === "dark" ? "#1A1D1E" : "#FFFFFF",
      color: theme.text,
      borderColor: isFocused ? theme.tint : "transparent",
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
        <View
          style={[
            styles.circleDecor,
            { backgroundColor: theme.tint, opacity: 0.05 },
          ]}
        />

        <View style={styles.headerSection}>
          <Image
            source={require("@/assets/gh/gh-rounded.png")}
            style={styles.logo}
            resizeMode="contain"
          />

          <ThemedText type="title" style={styles.title}>
            {isSubmitted ? "Check Your Email" : "Forgot Password?"}
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            {isSubmitted
              ? "We've sent password reset instructions to your email."
              : "Enter your email address and we'll send you a link to reset your password."}
          </ThemedText>
        </View>

        <View
          style={[
            styles.card,
            { backgroundColor: colorScheme === "dark" ? "#151718" : "#FFFFFF" },
          ]}
        >
          {!isSubmitted ? (
            <View style={styles.form}>
              <View>
                <ThemedText style={styles.label}>Email Address</ThemedText>
                <TextInput
                  placeholder="example@green.com"
                  placeholderTextColor="#687076"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={inputStyle}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  onChangeText={(val) => setEmail(val)}
                  value={email}
                />
              </View>

              <TouchableOpacity
                activeOpacity={0.8}
                disabled={loading || !email}
                style={[
                  styles.button,
                  { backgroundColor: email ? theme.tint : "#ccc" },
                ]}
                onPress={() => {
                  forgotPassword({ email });
                }}
              >
                <ThemedText style={styles.buttonText}>
                  {loading ? "Sending..." : "Send Reset Link"}
                </ThemedText>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.successContent}>
              <ThemedText style={styles.successText}>
                Didn't receive the email? Check your spam folder or try again.
              </ThemedText>
              <TouchableOpacity
                onPress={() => setIsSubmitted(false)}
                style={{ marginTop: 10 }}
              >
                <ThemedText style={{ color: theme.tint, fontWeight: "600" }}>
                  Try another email
                </ThemedText>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.footer}>
          <ThemedText style={styles.footerText}>Back to </ThemedText>
          <Link href="/(auth)/login" asChild>
            <TouchableOpacity>
              <ThemedText style={{ color: theme.tint, fontWeight: "bold" }}>
                Log In
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
    width: 60,
    height: 60,
    marginBottom: 20,
    alignSelf: "center",
  },
  circleDecor: {
    position: "absolute",
    top: -100,
    left: -100, // Reversed from signup for variety
    width: 300,
    height: 300,
    borderRadius: 150,
  },
  headerSection: { alignItems: "center", marginBottom: 32 },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 15,
    textAlign: "center",
    opacity: 0.6,
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  card: {
    borderRadius: 24,
    padding: 24,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
  },
  form: { gap: 20 },
  label: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 8,
    marginLeft: 4,
    opacity: 0.8,
  },
  input: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 14,
    fontSize: 16,
  },
  button: {
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  successContent: {
    alignItems: "center",
    paddingVertical: 10,
  },
  successText: {
    textAlign: "center",
    opacity: 0.7,
    lineHeight: 20,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 32,
  },
  footerText: { opacity: 0.6 },
});
