import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
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

// --- Mock Data ---
import { Product } from "@/data";

const { width } = Dimensions.get("window");
const COLUMN_WIDTH = (width - 55) / 2; // Adjusted for better grid spacing

export default function SellerProfileScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const colorScheme = useColorScheme() ?? "light";
  const theme = Colors[colorScheme];

  // Mock Seller Data
  const seller = {
    id: id,
    name: "Eco Store Official",
    bio: "Providing high-quality sustainable energy solutions and recycled home goods since 2019. Join us in our mission for a greener planet.",
    rating: 4.9,
    sales: "1.2k+",
    joined: "2019",
    avatar:
      "https://i.pinimg.com/1200x/12/b2/50/12b2500e9e987a25e6b169d6e8b4e0ae.jpg",
    cover: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e",
    verified: true,
  };

  const sellerProducts = Product.slice(0, 4);

  const renderProductItem = ({ item }: any) => (
    <TouchableOpacity
      style={[
        styles.productCard,
        { backgroundColor: colorScheme === "dark" ? "#1A1D1E" : "#FFF" },
      ]}
      //@ts-ignore
      onPress={() => router.push(`/product/${item.id}`)}
    >
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <View style={styles.productInfo}>
        <ThemedText style={styles.productTitle} numberOfLines={1}>
          {item.title}
        </ThemedText>
        <ThemedText style={{ color: theme.tint, fontWeight: "700" }}>
          ${item.price.toFixed(2)}
        </ThemedText>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* 1. MOVED INSIDE: Cover Image & Back Button */}
        <View style={styles.coverWrapper}>
          <Image source={{ uri: seller.cover }} style={styles.coverImage} />
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>

        {/* Profile Header */}
        <View style={styles.profileSection}>
          <View style={styles.avatarWrapper}>
            <Image source={{ uri: seller.avatar }} style={styles.avatar} />
            {seller.verified && (
              <View
                style={[styles.verifiedBadge, { backgroundColor: theme.tint }]}
              >
                <Ionicons name="checkmark" size={12} color="#FFF" />
              </View>
            )}
          </View>

          <ThemedText type="title" style={styles.sellerName}>
            {seller.name}
          </ThemedText>
          <ThemedText style={styles.bioText}>{seller.bio}</ThemedText>

          {/* Stats Bar */}
          <View
            style={[
              styles.statsBar,
              {
                backgroundColor: colorScheme === "dark" ? "#1A1D1E" : "#F2F2F7",
              },
            ]}
          >
            <View style={styles.statItem}>
              <ThemedText style={styles.statValue}>{seller.rating}</ThemedText>
              <ThemedText style={styles.statLabel}>Rating</ThemedText>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <ThemedText style={styles.statValue}>{seller.sales}</ThemedText>
              <ThemedText style={styles.statLabel}>Sales</ThemedText>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <ThemedText style={styles.statValue}>{seller.joined}</ThemedText>
              <ThemedText style={styles.statLabel}>Member</ThemedText>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.messageBtn, { borderColor: theme.tint }]}
          >
            <Ionicons name="chatbubble-outline" size={20} color={theme.tint} />
            <ThemedText style={{ color: theme.tint, fontWeight: "700" }}>
              Message Seller
            </ThemedText>
          </TouchableOpacity>
        </View>

        <View style={styles.productsSection}>
          <ThemedText style={styles.sectionTitle}>Shop Catalog</ThemedText>
          <FlatList
            data={sellerProducts}
            renderItem={renderProductItem}
            keyExtractor={(item) => item.id}
            numColumns={2}
            scrollEnabled={false}
            columnWrapperStyle={styles.gridRow}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  coverWrapper: { width: "100%", height: 200 }, // Container for cover + button
  coverImage: { width: "100%", height: "100%" },
  backBtn: {
    position: "absolute",
    top: Platform.OS === "ios" ? 50 : 30,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  scrollContent: { paddingBottom: 40 },
  profileSection: {
    alignItems: "center",
    paddingHorizontal: 24,
    marginTop: -50,
  },
  avatarWrapper: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: "#FFF",
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  avatar: { width: "100%", height: "100%", borderRadius: 50 },
  verifiedBadge: {
    position: "absolute",
    bottom: 5,
    right: 5,
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
  },
  sellerName: { marginTop: 15, fontSize: 22 },
  bioText: {
    textAlign: "center",
    marginTop: 8,
    opacity: 0.6,
    lineHeight: 20,
    fontSize: 14,
  },
  statsBar: {
    flexDirection: "row",
    width: "100%",
    paddingVertical: 15,
    borderRadius: 20,
    marginTop: 25,
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  statItem: { alignItems: "center" },
  statValue: { fontSize: 16, fontWeight: "800" },
  statLabel: { fontSize: 12, opacity: 0.5, marginTop: 2 },
  statDivider: { width: 1, height: 25, backgroundColor: "rgba(0,0,0,0.1)" },
  messageBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    width: "100%",
    height: 50,
    borderRadius: 15,
    borderWidth: 1.5,
    marginTop: 20,
  },
  productsSection: { paddingHorizontal: 20, marginTop: 30 },
  sectionTitle: { fontSize: 18, fontWeight: "700", marginBottom: 15 },
  gridRow: { justifyContent: "space-between" },
  productCard: {
    width: COLUMN_WIDTH,
    borderRadius: 16,
    marginBottom: 15,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  productImage: { width: "100%", height: 120 },
  productInfo: { padding: 10 },
  productTitle: { fontSize: 14, fontWeight: "600", marginBottom: 4 },
});
