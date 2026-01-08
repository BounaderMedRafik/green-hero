import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  Dimensions,
  FlatList,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

// --- Context & Data ---
import { useAuth } from "@/components/context/auth-provider";
import { Product } from "@/data";

const { width } = Dimensions.get("window");
const COLUMN_WIDTH = (width - 55) / 2;

export default function ProfilePage() {
  const router = useRouter();
  const { logout, user } = useAuth();
  const colorScheme = useColorScheme() ?? "light";
  const theme = Colors[colorScheme];

  const handleLogout = () => {
    logout();
  };

  const myItems = Product.slice(0, 4);

  // Data Mapping
  const firstName = user?.first_name || "User";
  const lastName = user?.last_name || "";
  const fullName = `${firstName} ${lastName}`.trim();
  //@ts-ignore
  const role = user?.role || "Normal User";
  const email = user?.email || "No email provided";
  //@ts-ignore
  const phone = user?.phone_number || "No phone added";

  // Avatar and Cover logic
  //@ts-ignore
  const avatarSource = user?.profile_image_url
    ? //@ts-ignore
      { uri: user.profile_image_url }
    : {
        uri: `https://ui-avatars.com/api/?name=${firstName}+${lastName}&background=random&size=200`,
      };

  //@ts-ignore
  const coverSource = user?.profile_background_image_url
    ? //@ts-ignore
      { uri: user.profile_background_image_url }
    : { uri: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e" };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollPadding}
      >
        {/* Header/Cover Section */}
        <View style={styles.headerContainer}>
          <Image source={coverSource} style={styles.coverPhoto} />

          {/* Settings Button Overlayed on Cover */}
          <TouchableOpacity
            onPress={() => router.push("/(tabs)/settings")}
            style={[
              styles.settingsIconBtn,
              { backgroundColor: "rgba(0,0,0,0.3)" },
            ]}
          >
            <Ionicons name="settings-outline" size={22} color="#FFF" />
          </TouchableOpacity>

          {/* Avatar Positioned Overlapping */}
          <View
            style={[styles.avatarContainer, { borderColor: theme.background }]}
          >
            <Image source={avatarSource} style={styles.avatar} />
          </View>
        </View>

        {/* User Info Section (shifted down to account for overlapping avatar) */}
        <View style={styles.userSection}>
          <View
            style={[styles.roleBadge, { backgroundColor: theme.tint + "20" }]}
          >
            <ThemedText style={[styles.roleText, { color: theme.tint }]}>
              {role.toUpperCase()}
            </ThemedText>
          </View>

          <ThemedText type="title" style={styles.userName}>
            {fullName}
          </ThemedText>

          <ThemedText style={styles.userEmail}>{email}</ThemedText>

          <View style={styles.contactInfo}>
            <Ionicons
              name="call-outline"
              size={14}
              color={theme.text}
              style={{ opacity: 0.5 }}
            />
            <ThemedText style={styles.contactText}>{phone}</ThemedText>
          </View>
        </View>

        {/* Stats Dashboard */}
        <View
          style={[
            styles.statsContainer,
            { backgroundColor: theme.tint + "10" },
          ]}
        >
          <View style={styles.statBox}>
            <ThemedText style={[styles.statValue, { color: theme.tint }]}>
              $0.00
            </ThemedText>
            <ThemedText style={styles.statLabel}>Earnings</ThemedText>
          </View>
          <View
            style={[styles.divider, { backgroundColor: theme.tint + "20" }]}
          />
          <View style={styles.statBox}>
            <ThemedText style={[styles.statValue, { color: theme.tint }]}>
              0
            </ThemedText>
            <ThemedText style={styles.statLabel}>Sold</ThemedText>
          </View>
          <View
            style={[styles.divider, { backgroundColor: theme.tint + "20" }]}
          />
          <View style={styles.statBox}>
            <ThemedText style={[styles.statValue, { color: theme.tint }]}>
              5.0
            </ThemedText>
            <ThemedText style={styles.statLabel}>Rating</ThemedText>
          </View>
        </View>

        {/* Selling Section */}
        <View style={styles.sectionHeader}>
          <ThemedText style={styles.sectionTitle}>My Listings</ThemedText>
          <TouchableOpacity>
            <ThemedText style={{ color: theme.tint, fontWeight: "600" }}>
              Manage All
            </ThemedText>
          </TouchableOpacity>
        </View>

        <FlatList
          data={myItems}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.itemCard,
                {
                  backgroundColor:
                    colorScheme === "dark" ? "#1A1D1E" : "#F2F2F7",
                },
              ]}
              onPress={() => router.push(`/product/${item.id}`)}
            >
              <Image source={{ uri: item.image }} style={styles.itemImage} />
              <View style={styles.itemInfo}>
                <ThemedText style={styles.itemTitle} numberOfLines={1}>
                  {item.title}
                </ThemedText>
                <ThemedText style={[styles.itemPrice, { color: theme.tint }]}>
                  ${item.price.toFixed(2)}
                </ThemedText>
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id}
          numColumns={2}
          scrollEnabled={false}
          columnWrapperStyle={styles.gridRow}
        />

        {/* Logout */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.logoutBtn, { borderColor: "#FF3B30" }]}
            onPress={handleLogout}
          >
            <Ionicons name="log-out-outline" size={20} color="#FF3B30" />
            <ThemedText style={styles.logoutText}>Log Out</ThemedText>
          </TouchableOpacity>
          <ThemedText style={styles.versionText}>Version 1.0.2</ThemedText>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollPadding: { paddingBottom: 50 },

  // New Header/Cover Layout
  headerContainer: {
    height: 220,
    width: "100%",
    position: "relative",
    marginBottom: 50, // Space for the avatar to hang over
  },
  coverPhoto: {
    width: "100%",
    height: 180,
  },
  settingsIconBtn: {
    position: "absolute",
    top: Platform.OS === "ios" ? 50 : 20,
    right: 20,
    padding: 8,
    borderRadius: 20,
  },
  avatarContainer: {
    position: "absolute",
    bottom: 0,
    left: width / 2 - 55, // Centers the avatar
    borderRadius: 60,
    borderWidth: 5,
    elevation: 5, // Android shadow
    shadowColor: "#000", // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },

  userSection: { alignItems: "center", paddingHorizontal: 20 },
  roleBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  roleText: { fontSize: 10, fontWeight: "800", letterSpacing: 1 },
  userName: { fontSize: 24, fontWeight: "800" },
  userEmail: { opacity: 0.5, fontSize: 14, marginTop: 4 },
  contactInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    gap: 5,
  },
  contactText: { fontSize: 13, opacity: 0.6 },

  statsContainer: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginTop: 30,
    borderRadius: 24,
    paddingVertical: 20,
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  statBox: { alignItems: "center" },
  statValue: { fontSize: 18, fontWeight: "800" },
  statLabel: { fontSize: 12, opacity: 0.6, marginTop: 4 },
  divider: { width: 1, height: 30 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 35,
    marginBottom: 15,
  },
  sectionTitle: { fontSize: 20, fontWeight: "700" },
  gridRow: { paddingHorizontal: 20, justifyContent: "space-between" },
  itemCard: {
    width: COLUMN_WIDTH,
    borderRadius: 20,
    marginBottom: 15,
    overflow: "hidden",
  },
  itemImage: { width: "100%", height: 130 },
  itemInfo: { padding: 12 },
  itemTitle: { fontSize: 14, fontWeight: "600" },
  itemPrice: { fontSize: 14, fontWeight: "700", marginTop: 4 },
  footer: { marginTop: 40, paddingHorizontal: 20, alignItems: "center" },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    width: "100%",
    height: 55,
    borderRadius: 18,
    borderWidth: 1.5,
  },
  logoutText: { color: "#FF3B30", fontWeight: "700", fontSize: 16 },
  versionText: { marginTop: 20, opacity: 0.3, fontSize: 12 },
});
