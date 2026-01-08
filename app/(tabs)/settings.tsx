import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker"; // 1. Import ImagePicker
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useState } from "react";
import {
  ActivityIndicator,
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

// --- Context ---
import { useAuth } from "@/components/context/auth-provider";

const API_BASE = "https://zander-unknotty-unblamably.ngrok-free.dev/users";

export default function SettingsPage() {
  const router = useRouter();
  const { user, setUser } = useAuth();
  const colorScheme = useColorScheme() ?? "light";
  const theme = Colors[colorScheme];

  // --- Form State ---
  const [firstName, setFirstName] = useState(user?.first_name || "");
  const [lastName, setLastName] = useState(user?.last_name || "");
  const [email, setEmail] = useState(user?.email || "");
  //@ts-ignore
  const [phone, setPhone] = useState(user?.phone_number || "");
  //@ts-ignore
  const [bio, setBio] = useState(user?.bio || "");
  //@ts-ignore
  const [location, setLocation] = useState(user?.location || "");
  const [loading, setLoading] = useState(false);

  // --- Media State ---
  //@ts-ignore
  const [avatar, setAvatar] = useState(user?.profile_image_url || null);
  const [cover, setCover] = useState(
    //@ts-ignore
    user?.profile_background_image_url ||
      "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e"
  );

  // 2. Image Picker Logic
  const pickImage = async (type: "avatar" | "cover") => {
    // Request permission
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "We need access to your photos to change your profile images."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"], // Updated for newer expo versions
      allowsEditing: true,
      aspect: type === "avatar" ? [1, 1] : [16, 9],
      quality: 0.7,
    });

    if (!result.canceled) {
      const selectedUri = result.assets[0].uri;
      if (type === "avatar") setAvatar(selectedUri);
      else setCover(selectedUri);

      // NOTE: In a real app, you should upload 'selectedUri' to your server/S3/Cloudinary
      // here and get back a permanent URL to save in your database.
    }
  };

  const handleSave = async () => {
    if (!firstName || !lastName || !email) {
      Alert.alert("Required Fields", "Name and Email cannot be empty.");
      return;
    }

    try {
      setLoading(true);
      const token = await SecureStore.getItemAsync("token");

      const updatedData = {
        first_name: firstName,
        last_name: lastName,
        email: email,
        phone_number: phone,
        bio: bio,
        location: location,
        profile_image_url: avatar,
        profile_background_image_url: cover,
      };

      const response = await fetch(`${API_BASE}/${user?._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify(updatedData),
      });

      const data = await response.json();

      if (response.ok) {
        if (setUser) setUser(data.user || { ...user, ...updatedData });
        Alert.alert("Success", "Profile updated successfully.");
        router.back();
      } else {
        Alert.alert("Update Failed", data.msg || "Something went wrong");
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="close" size={28} color={theme.text} />
          </TouchableOpacity>
          <ThemedText style={styles.headerTitle}>Edit Profile</ThemedText>
          <TouchableOpacity onPress={handleSave} disabled={loading}>
            {loading ? (
              <ActivityIndicator size="small" color={theme.tint} />
            ) : (
              <ThemedText style={[styles.saveBtn, { color: theme.tint }]}>
                Done
              </ThemedText>
            )}
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Media Section */}
          <View style={styles.mediaContainer}>
            <TouchableOpacity
              onPress={() => pickImage("cover")}
              style={styles.coverWrapper}
            >
              <Image source={{ uri: cover }} style={styles.coverImage} />
              <View style={styles.editOverlay}>
                <Ionicons name="camera" size={20} color="#FFF" />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => pickImage("avatar")}
              style={styles.avatarWrapper}
            >
              <Image
                source={
                  avatar
                    ? { uri: avatar }
                    : {
                        uri: `https://ui-avatars.com/api/?name=${firstName}+${lastName}`,
                      }
                }
                style={styles.avatarImage}
              />
              <View style={[styles.editOverlay, styles.avatarOverlay]}>
                <Ionicons name="camera" size={18} color="#FFF" />
              </View>
            </TouchableOpacity>
          </View>

          {/* Form Fields */}
          <ThemedText style={styles.sectionLabel}>
            Account Information
          </ThemedText>
          <View
            style={[
              styles.card,
              {
                backgroundColor: colorScheme === "dark" ? "#1A1D1E" : "#F2F2F7",
              },
            ]}
          >
            <View style={styles.inputGroup}>
              <ThemedText style={styles.inputLabel}>First Name</ThemedText>
              <TextInput
                style={[styles.input, { color: theme.text }]}
                value={firstName}
                onChangeText={setFirstName}
              />
            </View>
            <View style={styles.divider} />
            <View style={styles.inputGroup}>
              <ThemedText style={styles.inputLabel}>Last Name</ThemedText>
              <TextInput
                style={[styles.input, { color: theme.text }]}
                value={lastName}
                onChangeText={setLastName}
              />
            </View>
            <View style={styles.divider} />
            <View style={styles.inputGroup}>
              <ThemedText style={styles.inputLabel}>Email Address</ThemedText>
              <TextInput
                style={[styles.input, { color: theme.text }]}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            <View style={styles.divider} />
            <View style={styles.inputGroup}>
              <ThemedText style={styles.inputLabel}>Phone Number</ThemedText>
              <TextInput
                style={[styles.input, { color: theme.text }]}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
            </View>
          </View>

          <ThemedText style={styles.sectionLabel}>About Me</ThemedText>
          <View
            style={[
              styles.card,
              {
                backgroundColor: colorScheme === "dark" ? "#1A1D1E" : "#F2F2F7",
              },
            ]}
          >
            <View style={styles.inputGroup}>
              <ThemedText style={styles.inputLabel}>Bio</ThemedText>
              <TextInput
                style={[styles.input, { color: theme.text, height: 60 }]}
                value={bio}
                onChangeText={setBio}
                multiline
                placeholder="Tell us about yourself..."
              />
            </View>
            <View style={styles.divider} />
            <View style={styles.inputGroup}>
              <ThemedText style={styles.inputLabel}>Location</ThemedText>
              <TextInput
                style={[styles.input, { color: theme.text }]}
                value={location}
                onChangeText={setLocation}
                placeholder="City, Country"
              />
            </View>
          </View>

          <TouchableOpacity
            style={[styles.card, styles.dangerCard, { marginTop: 30 }]}
          >
            <ThemedText style={styles.dangerText}>Delete Account</ThemedText>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingHorizontal: 20,
    paddingBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: { fontSize: 18, fontWeight: "700" },
  saveBtn: { fontSize: 16, fontWeight: "700" },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },
  mediaContainer: { height: 200, marginBottom: 50, marginTop: 10 },
  coverWrapper: {
    width: "100%",
    height: 160,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#DDD",
  },
  coverImage: { width: "100%", height: "100%" },
  avatarWrapper: {
    position: "absolute",
    bottom: 0,
    left: 20,
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: "#FFF",
    overflow: "hidden",
    backgroundColor: "#EEE",
  },
  avatarImage: { width: "100%", height: "100%" },
  editOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarOverlay: { borderRadius: 40 },
  sectionLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#8E8E93",
    textTransform: "uppercase",
    marginBottom: 10,
    marginTop: 25,
    marginLeft: 10,
  },
  card: { borderRadius: 20, paddingHorizontal: 16 },
  inputGroup: { paddingVertical: 12 },
  inputLabel: {
    fontSize: 12,
    opacity: 0.5,
    marginBottom: 2,
    fontWeight: "600",
  },
  input: { fontSize: 16, padding: 0 },
  divider: { height: 1, backgroundColor: "rgba(0,0,0,0.05)" },
  dangerCard: {
    paddingVertical: 15,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FF3B3020",
  },
  dangerText: { color: "#FF3B30", fontWeight: "700" },
});
