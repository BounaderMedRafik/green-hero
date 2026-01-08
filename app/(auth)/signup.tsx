import { useAuth } from "@/components/context/auth-provider";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Link } from "expo-router";
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

export default function SignupScreen() {
  const { signup } = useAuth();
  const colorScheme = useColorScheme() ?? "light";
  const theme = Colors[colorScheme];

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    password: "",
    confirmPassword: "",
  });

  const [isFocused, setIsFocused] = useState<string | null>(null);

  // Validation Logic
  const validatePassword = (pass: string) => {
    return {
      length: pass.length >= 6,
      capital: /[A-Z]/.test(pass),
      match: pass === form.confirmPassword && pass !== "",
    };
  };

  const passwordValidation = validatePassword(form.password);
  const isFormValid =
    passwordValidation.length &&
    passwordValidation.capital &&
    form.password === form.confirmPassword &&
    form.email.includes("@");

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
        <View
          style={[
            styles.circleDecor,
            { backgroundColor: theme.tint, opacity: 0.05 },
          ]}
        />

        <View style={styles.headerSection}>
          {/* LOGO SECTION */}
          <Image
            source={require("@/assets/gh/gh-rounded.png")}
            style={styles.logo}
            resizeMode="contain"
          />

          <ThemedText type="title" style={styles.title}>
            Create Account
          </ThemedText>
        </View>

        <View
          style={[
            styles.card,
            { backgroundColor: colorScheme === "dark" ? "#151718" : "#FFFFFF" },
          ]}
        >
          <View style={styles.form}>
            {/* Name Row */}
            <View style={styles.row}>
              <View style={{ flex: 1, marginRight: 10 }}>
                <ThemedText style={styles.label}>First Name</ThemedText>
                <TextInput
                  placeholder="Mohamed"
                  placeholderTextColor="#687076"
                  style={getFieldStyle("firstName")}
                  onFocus={() => setIsFocused("firstName")}
                  onBlur={() => setIsFocused(null)}
                  onChangeText={(val) => setForm({ ...form, first_name: val })}
                />
              </View>
              <View style={{ flex: 1 }}>
                <ThemedText style={styles.label}>Last Name</ThemedText>
                <TextInput
                  placeholder="Rafik"
                  placeholderTextColor="#687076"
                  style={getFieldStyle("lastName")}
                  onFocus={() => setIsFocused("lastName")}
                  onBlur={() => setIsFocused(null)}
                  onChangeText={(val) => setForm({ ...form, last_name: val })}
                />
              </View>
            </View>

            {/* Email */}
            <View>
              <ThemedText style={styles.label}>Email</ThemedText>
              <TextInput
                placeholder="example@green.com"
                placeholderTextColor="#687076"
                keyboardType="email-address"
                autoCapitalize="none"
                style={getFieldStyle("email")}
                onFocus={() => setIsFocused("email")}
                onBlur={() => setIsFocused(null)}
                onChangeText={(val) => setForm({ ...form, email: val })}
              />
            </View>

            <View>
              <ThemedText style={styles.label}>Phone Number</ThemedText>
              <TextInput
                placeholder="+1234567890"
                placeholderTextColor="#687076"
                keyboardType="phone-pad"
                style={getFieldStyle("phonenumber")}
                onFocus={() => setIsFocused("phonenumber")}
                onBlur={() => setIsFocused(null)}
                onChangeText={(val) => setForm({ ...form, phone_number: val })}
              />
            </View>

            {/* Password */}
            <View>
              <ThemedText style={styles.label}>Password</ThemedText>
              <TextInput
                placeholder="••••••••"
                placeholderTextColor="#687076"
                secureTextEntry
                style={getFieldStyle("password")}
                onFocus={() => setIsFocused("password")}
                onBlur={() => setIsFocused(null)}
                onChangeText={(val) => setForm({ ...form, password: val })}
              />

              <View style={styles.validationBox}>
                <ThemedText
                  style={[
                    styles.hint,
                    passwordValidation.length && { color: theme.tint },
                  ]}
                >
                  {passwordValidation.length ? "✓" : "○"} Min 6 characters
                </ThemedText>
                <ThemedText
                  style={[
                    styles.hint,
                    passwordValidation.capital && { color: theme.tint },
                  ]}
                >
                  {passwordValidation.capital ? "✓" : "○"} At least one capital
                  letter
                </ThemedText>
              </View>
            </View>

            {/* Confirm Password */}
            <View>
              <ThemedText style={styles.label}>Confirm Password</ThemedText>
              <TextInput
                placeholder="••••••••"
                placeholderTextColor="#687076"
                secureTextEntry
                style={getFieldStyle("confirmPassword")}
                onFocus={() => setIsFocused("confirmPassword")}
                onBlur={() => setIsFocused(null)}
                onChangeText={(val) =>
                  setForm({ ...form, confirmPassword: val })
                }
              />
              {form.confirmPassword !== "" && !passwordValidation.match && (
                <ThemedText style={styles.errorText}>
                  Passwords do not match
                </ThemedText>
              )}
            </View>

            <TouchableOpacity
              activeOpacity={0.8}
              disabled={!isFormValid}
              style={[
                styles.button,
                { backgroundColor: isFormValid ? theme.tint : "#ccc" },
              ]}
              onPress={() => {
                if (isFormValid) {
                  signup(form);
                }
              }}
            >
              <ThemedText style={styles.buttonText}>Get Started</ThemedText>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.footer}>
          <ThemedText style={styles.footerText}>
            Already have an account?{" "}
          </ThemedText>
          <Link href="/login" asChild>
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
    paddingTop: Platform.OS === "ios" ? 60 : 40,
  },
  logo: {
    width: 50, // Adjusted size for your logo
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
  headerSection: { alignItems: "center", marginBottom: 28 },
  title: {
    fontSize: 28,
    lineHeight: 34,
    textAlign: "center",
    fontWeight: "bold",
  },
  card: {
    borderRadius: 24,
    padding: 24,
    elevation: 8,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
  },
  form: { gap: 18 },
  row: { flexDirection: "row" },
  label: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 6,
    marginLeft: 4,
    opacity: 0.8,
  },
  input: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 14,
    fontSize: 15,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  validationBox: { marginTop: 8, gap: 4, marginLeft: 4 },
  hint: { fontSize: 12, color: "#687076", opacity: 0.8 },
  errorText: { fontSize: 12, color: "#FF3B30", marginTop: 4, marginLeft: 4 },
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
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
    marginBottom: 30,
  },
  footerText: { opacity: 0.6 },
});
